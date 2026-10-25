import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Import the step feature components
import GoalInformation from '../../../../components/app/goals/GoalInformation/GoalInformation';
import TaskCreationMethod from '../../../../components/app/goals/TaskCreationMethod/TaskCreationMethod';
import GoalTaskCreation from '../../../../components/app/goals/GoalTaskCreation/GoalTaskCreation';
import PlannerLoading from '../../../../components/app/goals/PlannerLoading/PlannerLoading';
import PlannerSuccess from '../../../../components/app/goals/PlannerSuccess/PlannerSuccess';

import './CreateGoal.css';

const DEFAULT_PLANNER_STEPS = [
    'Reading Goal Information',
    'Organizing Tasks',
    'Checking Deadlines',
    'Reading Study Availability',
    'Calculating Priorities',
    'Distributing Study Hours',
    'Creating Weekly Schedule...'
];

import { useAppState } from '../../../../context/StateContext';
import { useConfiguration } from '../../../../context/ConfigurationContext';
import { createGoalWithTasks, formatDateForBackend, formatDateForInput } from '../../../../api/goals/goalApi';

export const CreateGoal = () => {
    const navigate = useNavigate();
    const { addGoalWithTasks } = useAppState();
    const {
        getGoalTypeName,
        getGoalTypeIdentifier,
        getPriorityName,
        getPriorityIdentifier,
        getStatusIdentifier,
        statusList = []
    } = useConfiguration();

    // 1. Wizard workflow step indicator (1 to 5)
    const [currentStep, setCurrentStep] = useState(1);

    // 2. Goal Information state (Step 1)
    const [goal, setGoal] = useState({
        goalTitle: '',
        goalDescription: '',
        goalType: '',
        targetDate: '',
        priority: '2', // Defaults to '2' (Medium Priority in master)
        category: '',
        priorityLevel: 'Medium',
        status: '2', // In Progress
        progress: 0
    });

    // 3. Task Creation Method state (Step 2)
    const [selectedMethod, setSelectedMethod] = useState('manual');

    // 4. Task Management List state (Step 3) - starts with a starter empty row
    const [tasks, setTasks] = useState([
        {
            id: 1,
            taskName: '',
            description: '',
            estimatedHours: '',
            dueDate: '',
            priority: '2',
            status: '1'
        }
    ]);

    // Validation error states
    const [goalErrors, setGoalErrors] = useState({});
    const [taskErrors, setTaskErrors] = useState({});
    const [taskGeneralError, setTaskGeneralError] = useState('');

    // Submission states
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isSubmittingRef = useRef(false);
    const progressIntervalRef = useRef(null);
    const [createdGoalIdentifier, setCreatedGoalIdentifier] = useState(null);

    // 5. Planner Loader progress states (Step 4)
    const [plannerProgress, setPlannerProgress] = useState(0);
    const [currentPlannerStep, setCurrentPlannerStep] = useState('Reading Goal Information');
    const [plannerStatus, setPlannerStatus] = useState('loading');
    const [plannerErrorMessage, setPlannerErrorMessage] = useState('');

    // Cleanup progress interval on unmount
    useEffect(() => {
        return () => {
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
        };
    }, []);

    // --- Dynamic calculations for Step 3 and 5 statistics ---

    // Calculate total hours
    const totalHours = tasks.reduce((sum, t) => sum + (Number(t.estimatedHours) || 0), 0);
    const completedTasksCount = tasks.filter(t => t.status === 'Completed').length;
    const completedHours = tasks.filter(t => t.status === 'Completed').reduce((sum, t) => sum + (Number(t.estimatedHours) || 0), 0);

    // Format goal type details
    const getGoalCategory = (type) => {
        if (!type) return 'Skill';
        const match = type.match(/^([a-zA-Z]+)/);
        return match ? match[1] : 'Skill';
    };

    // Format target date for summary box (e.g. "2024-12-15" -> "Dec 15")
    const getFormattedSummaryDate = (dateStr) => {
        if (!dateStr) return 'Dec 15';
        try {
            const [, month, day] = dateStr.split('-');
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const mIdx = Number(month) - 1;
            if (monthNames[mIdx]) {
                return `${monthNames[mIdx]} ${Number(day)}`;
            }
            return dateStr;
        } catch {
            return dateStr;
        }
    };

    // Goal information prop structure
    const goalProp = {
        ...goal,
        type: getGoalTypeName(goal.goalType) || goal.goalType,
        category: getGoalTypeName(goal.goalType) || getGoalCategory(goal.goalType),
        priority: getPriorityName(goal.priority) || goal.priority,
        priorityLevel: `${getPriorityName(goal.priority) || goal.priority} Priority`,
        progress: tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0
    };

    // Statistics prop structure
    const statisticsProp = {
        tasksDone: String(completedTasksCount),
        tasksTotal: String(tasks.length),
        hoursDone: String(completedHours),
        hoursTotal: String(totalHours),
        weeklyProgress: [
            { day: 'M', progress: completedTasksCount > 0 ? 30 : 0 },
            { day: 'T', progress: completedTasksCount > 0 ? 55 : 0 },
            { day: 'W', progress: completedTasksCount > 0 ? 25 : 0 },
            { day: 'T', progress: completedTasksCount > 0 ? 85 : 0 },
            { day: 'F', progress: completedTasksCount > 0 ? 60 : 0 },
            { day: 'S', progress: completedTasksCount > 0 ? 20 : 0 },
            { day: 'S', progress: completedTasksCount > 0 ? 12 : 0 }
        ]
    };

    // Summary statistics cards for Step 5 Success Page
    const successSummaryCards = [
        { id: 'tasks', icon: 'bi-file-earmark-text', label: 'TOTAL TASKS', value: String(tasks.length) },
        { id: 'sessions', icon: 'bi-calendar-event', label: 'SESSIONS', value: String(Math.ceil(tasks.length * 1.5 || 2)) },
        { id: 'hours', icon: 'bi-clock', label: 'TOTAL HOURS', value: String(totalHours || 8) },
        { id: 'target', icon: 'bi-flag', label: 'TARGET DATE', value: getFormattedSummaryDate(goal.targetDate) }
    ];

    // Checklist for Step 5 Success Page
    const successChecklist = [
        'Goal Processed',
        'Tasks Organized',
        'Sessions Created',
        'Dashboard Updated',
        'Calendar Updated'
    ];

    // --- Validation Logic ---

    // Validates mandatory goal fields: Title, Type, Priority, Target Date
    const validateGoal = (goalData) => {
        const errs = {};
        if (!goalData.goalTitle || !goalData.goalTitle.trim()) {
            errs.goalTitle = 'Goal title is required.';
        }
        const resolvedType = getGoalTypeIdentifier(goalData.goalType);
        if (!goalData.goalType || (!resolvedType && resolvedType !== 0)) {
            errs.goalType = 'Goal type is required.';
        }
        const resolvedPri = getPriorityIdentifier(goalData.priority);
        if (!goalData.priority || (!resolvedPri && resolvedPri !== 0)) {
            errs.priority = 'Priority is required.';
        }
        if (!goalData.targetDate || !goalData.targetDate.trim()) {
            errs.targetDate = 'Target date is required.';
        } else {
            const d = new Date(goalData.targetDate);
            if (isNaN(d.getTime())) {
                errs.targetDate = 'Please enter a valid target date.';
            }
        }
        return errs;
    };

    // Validates task fields: at least one task, name, estimatedHours > 0, dueDate <= goal targetDate
    const validateTasks = (tasksList, targetDateStr) => {
        const itemErrors = {};
        let generalErr = '';

        if (!tasksList || tasksList.length === 0) {
            generalErr = 'At least one task is required.';
            return { itemErrors, generalErr };
        }

        const normGoalDate = formatDateForInput(targetDateStr);

        tasksList.forEach(t => {
            const tErrs = {};
            if (!t.taskName || !t.taskName.trim()) {
                tErrs.taskName = 'Task name is required.';
            }

            const hours = Number(t.estimatedHours);
            if (t.estimatedHours === '' || t.estimatedHours === null || t.estimatedHours === undefined) {
                tErrs.estimatedHours = 'Estimated hours is required.';
            } else if (isNaN(hours) || hours <= 0) {
                tErrs.estimatedHours = 'Must be greater than 0.';
            }

            if (!t.dueDate || !t.dueDate.trim()) {
                tErrs.dueDate = 'Due date is required.';
            } else {
                const normTaskDate = formatDateForInput(t.dueDate);
                if (!normTaskDate || isNaN(new Date(t.dueDate).getTime())) {
                    tErrs.dueDate = 'Valid date required.';
                } else if (normGoalDate && normTaskDate > normGoalDate) {
                    tErrs.dueDate = 'Cannot be after target date.';
                }
            }

            if (Object.keys(tErrs).length > 0) {
                itemErrors[t.id] = tErrs;
            }
        });

        return { itemErrors, generalErr };
    };

    // --- State Handlers ---

    // Handle Goal Info Fields change
    const handleGoalChange = (e) => {
        const { name, value } = e.target;
        setGoal(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear field error as user types
        if (goalErrors[name]) {
            setGoalErrors(prev => {
                const next = { ...prev };
                delete next[name];
                return next;
            });
        }
    };

    // Validate Step 1 Goal Info before moving to Step 2
    const handleGoalNext = () => {
        const errs = validateGoal(goal);
        if (Object.keys(errs).length > 0) {
            setGoalErrors(errs);
            return;
        }
        setGoalErrors({});
        setCurrentStep(2);
    };

    // Handle single task field modifications
    const handleTaskChange = (taskId, fieldName, value) => {
        setTasks(prev => prev.map(task =>
            task.id === taskId ? { ...task, [fieldName]: value } : task
        ));

        // Clear field error as user types
        if (taskErrors[taskId]?.[fieldName]) {
            setTaskErrors(prev => {
                const next = { ...prev };
                if (next[taskId]) {
                    const updated = { ...next[taskId] };
                    delete updated[fieldName];
                    if (Object.keys(updated).length === 0) {
                        delete next[taskId];
                    } else {
                        next[taskId] = updated;
                    }
                }
                return next;
            });
        }
        if (taskGeneralError) {
            setTaskGeneralError('');
        }
    };

    // Append an empty task row to the list
    const handleAddTask = () => {
        const newId = tasks.length > 0 ? Math.max(...tasks.map(t => Number(t.id) || 0)) + 1 : 1;
        setTasks(prev => [
            ...prev,
            {
                id: newId,
                taskName: '',
                description: '',
                estimatedHours: '',
                dueDate: '',
                priority: '2',
                status: '1'
            }
        ]);
        if (taskGeneralError) {
            setTaskGeneralError('');
        }
    };

    // Save Tasks / Generate Schedule submit handler
    const handleSaveTasks = async () => {
        // 1. Prevent duplicate submissions
        if (isSubmittingRef.current) return;

        // 2. Validate goal fields
        const gErrs = validateGoal(goal);
        // 3. Validate task fields
        const { itemErrors, generalErr } = validateTasks(tasks, goal.targetDate);

        const hasGoalErrs = Object.keys(gErrs).length > 0;
        const hasTaskErrs = Object.keys(itemErrors).length > 0 || !!generalErr;

        setGoalErrors(gErrs);
        setTaskErrors(itemErrors);
        setTaskGeneralError(generalErr);

        // If validation fails, preserve entered values and remain on the form
        if (hasGoalErrs || hasTaskErrs) {
            if (hasGoalErrs && !hasTaskErrs) {
                setCurrentStep(1); // Return to goal information step to show missing fields
            }
            return;
        }

        // 4. Set submission state to loading
        isSubmittingRef.current = true;
        setIsSubmitting(true);

        // 5. Navigate to Generating Schedule page (Step 4) while API is running
        setPlannerProgress(15);
        setCurrentPlannerStep('Reading Goal Information');
        setPlannerStatus('loading');
        setPlannerErrorMessage('');
        setCurrentStep(4);

        // Smooth progress animation while request is pending
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
        }
        progressIntervalRef.current = setInterval(() => {
            setPlannerProgress(prev => {
                if (prev >= 85) return 85;
                const next = prev + 12;
                if (next < 25) setCurrentPlannerStep('Reading Goal Information');
                else if (next < 40) setCurrentPlannerStep('Organizing Tasks');
                else if (next < 55) setCurrentPlannerStep('Checking Deadlines');
                else if (next < 70) setCurrentPlannerStep('Reading Study Availability');
                else if (next < 85) setCurrentPlannerStep('Calculating Priorities');
                return next;
            });
        }, 350);

        // 6. Build the request DTO
        const payload = {
            goalTitle: goal.goalTitle.trim(),
            goalDescription: goal.goalDescription?.trim() || null,
            goalTypeIdentifier: String(getGoalTypeIdentifier(goal.goalType) || goal.goalType),
            goalTypeId: null,
            priorityIdentifier: String(getPriorityIdentifier(goal.priority) || goal.priority),
            priorityId: null,
            targetDate: formatDateForBackend(goal.targetDate),
            tasks: tasks.map(t => ({
                taskName: t.taskName.trim(),
                description: t.description?.trim() || null,
                estimatedHours: Number(t.estimatedHours),
                dueDate: formatDateForBackend(t.dueDate),
                statusIdentifier: String(getStatusIdentifier(t.status) || t.status || (statusList[0]?.identifier ?? '1'))
            }))
        };

        // 7. Execute create goal with tasks API call
        try {
            const responseData = await createGoalWithTasks(payload);

            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }

            setPlannerProgress(100);
            setCurrentPlannerStep('Creating Weekly Schedule...');
            setPlannerStatus('completed');

            // Extract created goal identifier if returned
            const createdId = responseData?.goalIdentifier ?? responseData?.GoalIdentifier ?? responseData?.identifier ?? responseData?.id ?? (typeof responseData === 'string' ? responseData : null);
            setCreatedGoalIdentifier(createdId);

            // Update in-memory app state for dashboard and calendar
            if (addGoalWithTasks) {
                addGoalWithTasks(
                    { ...goal, goalIdentifier: createdId, id: createdId },
                    tasks
                );
            }

            // 8. Progress to Success Page (Step 5) only after successful response
            setTimeout(() => {
                setCurrentStep(5);
                setIsSubmitting(false);
                isSubmittingRef.current = false;
            }, 600);

        } catch (error) {
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
            console.error('Failed to create goal with tasks:', error);
            setPlannerStatus('error');
            const message = error.message || (Array.isArray(error.errors) ? error.errors.join(', ') : error.errors) || 'An unexpected error occurred while creating the goal.';
            setPlannerErrorMessage(message);
            setIsSubmitting(false);
            isSubmittingRef.current = false;
        }
    };

    // Navigation redirects
    const handleBackToGoals = () => {
        navigate('/goals');
    };

    const handleViewDashboard = () => {
        navigate('/dashboard');
    };

    const handleViewCalendar = () => {
        navigate('/calendar');
    };

    const handleViewGoal = () => {
        if (createdGoalIdentifier) {
            navigate(`/goals/${encodeURIComponent(createdGoalIdentifier)}`);
        } else {
            navigate('/goals');
        }
    };

    // Render active step component
    const renderActiveStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <GoalInformation
                        goalTitle={goal.goalTitle}
                        goalDescription={goal.goalDescription}
                        goalType={goal.goalType}
                        targetDate={goal.targetDate}
                        priority={goal.priority}
                        errors={goalErrors}
                        onChange={handleGoalChange}
                        onNext={handleGoalNext}
                        onCancel={handleBackToGoals}
                    />
                );
            case 2:
                return (
                    <TaskCreationMethod
                        selectedMethod={selectedMethod}
                        onMethodChange={setSelectedMethod}
                        onBack={() => setCurrentStep(1)}
                        onContinue={() => setCurrentStep(3)}
                    />
                );
            case 3:
                return (
                    <GoalTaskCreation
                        mode="create"
                        goal={goalProp}
                        tasks={tasks}
                        statistics={statisticsProp}
                        taskErrors={taskErrors}
                        goalErrors={goalErrors}
                        generalError={taskGeneralError}
                        isSubmitting={isSubmitting}
                        onBack={() => setCurrentStep(2)}
                        onCancel={handleBackToGoals}
                        onSaveTasks={handleSaveTasks}
                        onGenerateSchedule={handleSaveTasks}
                        onAddTask={handleAddTask}
                        onTaskChange={handleTaskChange}
                    />
                );
            case 4:
                return (
                    <PlannerLoading
                        progress={plannerProgress}
                        currentStep={currentPlannerStep}
                        steps={DEFAULT_PLANNER_STEPS}
                        status={plannerStatus}
                        errorMessage={plannerErrorMessage}
                        goal={goalProp}
                        onBack={() => {
                            setCurrentStep(3); // Return to task creation with form data preserved
                            setPlannerStatus('loading');
                            setPlannerErrorMessage('');
                            setPlannerProgress(0);
                        }}
                    />
                );
            case 5:
                return (
                    <PlannerSuccess
                        summaryCards={successSummaryCards}
                        checklist={successChecklist}
                        goalIdentifier={createdGoalIdentifier}
                        onViewGoal={handleViewGoal}
                        onViewDashboard={handleViewDashboard}
                        onViewCalendar={handleViewCalendar}
                    />
                );
            default:
                return (
                    <GoalInformation
                        goalTitle={goal.goalTitle}
                        goalDescription={goal.goalDescription}
                        goalType={goal.goalType}
                        targetDate={goal.targetDate}
                        priority={goal.priority}
                        errors={goalErrors}
                        onChange={handleGoalChange}
                        onNext={handleGoalNext}
                        onCancel={handleBackToGoals}
                    />
                );
        }
    };

    return (
        <div className="create-goal-workflow-page-container py-4 px-2 px-md-4">
            {/* Header titles */}
            <div className="workflow-title-block text-start mb-4 max-width-card mx-auto">
                <h1 className="workflow-main-title">Create New Goal</h1>
                <p className="workflow-main-desc">
                    Let's create your learning goal. We'll guide you through two simple steps.
                </p>
            </div>

            {/* Workflow Step mounted view */}
            <div className="workflow-step-content-box">
                {renderActiveStep()}
            </div>
        </div>
    );
};

export default CreateGoal;

