import React, { useState, useEffect } from 'react';
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

export const CreateGoal = () => {
    const navigate = useNavigate();

    // 1. Wizard workflow step indicator (1 to 5)
    const [currentStep, setCurrentStep] = useState(1);

    // 2. Goal Information state (Step 1)
    const [goal, setGoal] = useState({
        goalTitle: '',
        goalDescription: '',
        goalType: '',
        targetDate: '',
        priority: 'Medium',
        category: 'Skill Acquisition', // Default category
        priorityLevel: 'Medium Priority',
        status: 'In Progress',
        progress: 65
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
            priority: 'Medium',
            status: 'Pending'
        }
    ]);

    // 5. Planner Loader progress states (Step 4)
    const [plannerProgress, setPlannerProgress] = useState(0);
    const [currentPlannerStep, setCurrentPlannerStep] = useState('Reading Goal Information');
    const [plannerStatus, setPlannerStatus] = useState('loading');
    const [plannerErrorMessage, setPlannerErrorMessage] = useState('');

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
            const [year, month, day] = dateStr.split('-');
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const mIdx = Number(month) - 1;
            if (monthNames[mIdx]) {
                return `${monthNames[mIdx]} ${Number(day)}`;
            }
            return dateStr;
        } catch (e) {
            return dateStr;
        }
    };

    // Goal information prop structure
    const goalProp = {
        ...goal,
        category: getGoalCategory(goal.goalType),
        priorityLevel: `${goal.priority} Priority`,
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
            { day: 'T', progress: completedTasksCount > 0 ? 85 : 0 }, // Thursday highlighted active
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

    // --- State Handlers ---

    // Handle Goal Info Fields change
    const handleGoalChange = (e) => {
        const { name, value } = e.target;
        setGoal(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle single task field modifications
    const handleTaskChange = (taskId, fieldName, value) => {
        setTasks(prev => prev.map(task =>
            task.id === taskId ? { ...task, [fieldName]: value } : task
        ));
    };

    // Append an empty task row to the list
    const handleAddTask = () => {
        const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
        setTasks(prev => [
            ...prev,
            {
                id: newId,
                taskName: '',
                description: '',
                estimatedHours: '',
                dueDate: '',
                priority: 'Medium',
                status: 'Pending'
            }
        ]);
    };

    // Save Tasks action handler (logs details and notifies)
    const handleSaveTasks = () => {
        console.log('Goal and tasks saved successfully:', { goal: goalProp, tasks });
        alert('Tasks saved successfully!');
    };

    // Trigger Scheduler generation loading step
    const handleGenerateSchedule = () => {
        setCurrentStep(4);
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

    // --- Step 4 Progress Bar Generation Simulation ---
    useEffect(() => {
        if (currentStep === 4) {
            setPlannerProgress(0);
            setPlannerStatus('loading');

            const interval = setInterval(() => {
                setPlannerProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);

                        // Automatically progress to Step 5 Success page
                        setTimeout(() => {
                            setCurrentStep(5);
                        }, 600);

                        return 100;
                    }

                    const nextProgress = prev + 10;

                    // Cycle Checklist labels dynamically based on percentage
                    if (nextProgress < 20) {
                        setCurrentPlannerStep('Reading Goal Information');
                    } else if (nextProgress < 35) {
                        setCurrentPlannerStep('Organizing Tasks');
                    } else if (nextProgress < 50) {
                        setCurrentPlannerStep('Checking Deadlines');
                    } else if (nextProgress < 65) {
                        setCurrentPlannerStep('Reading Study Availability');
                    } else if (nextProgress < 80) {
                        setCurrentPlannerStep('Calculating Priorities');
                    } else if (nextProgress < 95) {
                        setCurrentPlannerStep('Distributing Study Hours');
                    } else {
                        setCurrentPlannerStep('Creating Weekly Schedule...');
                    }

                    return nextProgress;
                });
            }, 300); // Progress updates every 300ms

            return () => clearInterval(interval);
        }
    }, [currentStep]);

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
                        onChange={handleGoalChange}
                        onNext={() => setCurrentStep(2)}
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
                        onBack={() => setCurrentStep(2)}
                        onSaveTasks={handleSaveTasks}
                        onGenerateSchedule={handleGenerateSchedule}
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
                        onBack={() => setCurrentStep(3)} // Return to tasks edit on error retry
                    />
                );
            case 5:
                return (
                    <PlannerSuccess
                        summaryCards={successSummaryCards}
                        checklist={successChecklist}
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
                        onChange={handleGoalChange}
                        onNext={() => setCurrentStep(2)}
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
