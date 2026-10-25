import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';

// Import UI and feature components
import GoalTaskCreation from '../../../../components/app/goals/GoalTaskCreation/GoalTaskCreation';
import DashboardCard from '../../../../components/common/DashboardCard/DashboardCard';
import { ButtonComponent } from '../../../../components/common/CommonComponents/ButtonComponent';

// Import API and Context
import { getGoalDetails, formatDateForInput } from '../../../../api/goals/goalApi';
import { useConfiguration } from '../../../../context/ConfigurationContext';
import { useAppState } from '../../../../context/StateContext';
import './GoalDetails.css';

export const GoalDetails = () => {
    const location = useLocation();
    const { goalId } = useParams();
    const navigate = useNavigate();
    const { updateGoalWithTasks } = useAppState();

    const {
        getGoalTypeIdentifier,
        getPriorityIdentifier,
        getStatusIdentifier,
        getStatusName
    } = useConfiguration();

    // Decode goalIdentifier from URL parameter
    const goalIdentifier = goalId ? decodeURIComponent(goalId) : '';

    // Determine mode from React Router pathname
    const isEditMode = location.pathname.endsWith('/edit');
    const [mode, setMode] = useState(isEditMode ? 'edit' : 'view');

    // Keep mode state in sync on pathname changes
    useEffect(() => {
        setMode(isEditMode ? 'edit' : 'view');
    }, [isEditMode]);

    // Data states
    const [goal, setGoal] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch Goal Details from the backend API
    const fetchGoalDetails = useCallback(async () => {
        if (!goalIdentifier) {
            setError('No goal identifier specified.');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const data = await getGoalDetails(goalIdentifier);

            if (!data) {
                throw new Error('Goal not found.');
            }

            // 1. Extract and map Goal Information
            const rawTitle = data.goalTitle ?? data.GoalTitle ?? '';
            const rawDescription = data.goalDescription ?? data.GoalDescription ?? '';
            const rawTargetDate = data.targetDate ?? data.TargetDate ?? '';
            const rawGoalType = data.goalType ?? data.GoalType ?? '';
            const rawPriority = data.priority ?? data.Priority ?? 'Medium';
            const rawStatus = data.status ?? data.Status ?? 'Active';
            const rawProgress = Number(data.progressPercentage ?? data.ProgressPercentage ?? 0);

            // Resolve dropdown values to master identifiers
            const resolvedGoalTypeId = getGoalTypeIdentifier(rawGoalType) || rawGoalType;
            const resolvedPriorityId = getPriorityIdentifier(rawPriority) || rawPriority;
            const resolvedStatusId = getStatusIdentifier(rawStatus) || rawStatus;

            const mappedGoal = {
                id: goalIdentifier,
                goalIdentifier,
                title: rawTitle,
                goalTitle: rawTitle,
                description: rawDescription,
                goalDescription: rawDescription,
                targetDate: formatDateForInput(rawTargetDate),
                rawTargetDate,
                type: resolvedGoalTypeId,
                goalType: resolvedGoalTypeId,
                category: resolvedGoalTypeId,
                priority: resolvedPriorityId,
                priorityLevel: resolvedPriorityId,
                status: resolvedStatusId,
                progress: rawProgress,
                createdDate: data.createdDate ?? data.CreatedDate ?? '',
                lastUpdated: data.lastUpdated ?? data.LastUpdated ?? ''
            };

            // 2. Extract and map Task Items (preserving taskIdentifier)
            const rawTasks = data.taskItems || data.TaskItems || [];
            const mappedTasks = rawTasks.map((t, idx) => {
                const taskIdentifier = t.taskIdentifier ?? t.TaskIdentifier ?? null;
                const taskName = t.taskName ?? t.TaskName ?? '';
                const taskDescription = t.taskDescription ?? t.TaskDescription ?? t.description ?? '';
                const taskEstimatedHours = t.taskEstimatedHours ?? t.TaskEstimatedHours ?? t.estimatedHours ?? '';
                const taskDueDate = t.taskDueDate ?? t.TaskDueDate ?? t.dueDate ?? '';
                const taskPriority = t.priority ?? t.Priority ?? 'Medium';
                const taskStatus = t.taskStatusIdentifier ?? t.TaskStatusIdentifier ?? t.taskStatus ?? t.TaskStatus ?? 'Pending';

                return {
                    id: taskIdentifier || `task-${idx + 1}`,
                    taskIdentifier, // Intact backend identifier
                    taskName,
                    description: taskDescription,
                    estimatedHours: taskEstimatedHours,
                    dueDate: formatDateForInput(taskDueDate),
                    rawDueDate: taskDueDate,
                    priority: getPriorityIdentifier(taskPriority) || taskPriority,
                    status: getStatusIdentifier(taskStatus) || taskStatus,
                    taskStatus: t.taskStatus ?? t.TaskStatus,
                    taskStatusIdentifier: t.taskStatusIdentifier ?? t.TaskStatusIdentifier
                };
            });

            // 3. Extract and map Statistics
            const rawStats = data.statistics || data.Statistics || {};
            const totalTasksCount = Number(rawStats.totalTasks ?? rawStats.TotalTasks ?? mappedTasks.length);
            const completedTasksCount = Number(rawStats.completedTasks ?? rawStats.CompletedTasks ?? mappedTasks.filter(t => {
                const s = (getStatusName(t.status) || t.status || '').toLowerCase();
                return s === 'completed';
            }).length);
            const completedStudyHours = Number(rawStats.completedStudyHours ?? rawStats.CompletedStudyHours ?? 0);
            const totalStudyHours = Number(rawStats.totalStudyHours ?? rawStats.TotalStudyHours ?? 0);

            const mappedStats = {
                tasksDone: String(completedTasksCount),
                tasksTotal: String(totalTasksCount),
                hoursDone: String(completedStudyHours),
                hoursTotal: String(totalStudyHours),
                weeklyProgress: [
                    { day: 'M', progress: completedTasksCount > 0 ? 35 : 0 },
                    { day: 'T', progress: completedTasksCount > 0 ? 55 : 0 },
                    { day: 'W', progress: completedTasksCount > 0 ? 25 : 0 },
                    { day: 'T', progress: completedTasksCount > 0 ? 85 : 0 },
                    { day: 'F', progress: completedTasksCount > 0 ? 60 : 0 },
                    { day: 'S', progress: completedTasksCount > 0 ? 20 : 0 },
                    { day: 'S', progress: completedTasksCount > 0 ? 12 : 0 }
                ]
            };

            setGoal(mappedGoal);
            setTasks(mappedTasks);
            setStatistics(mappedStats);
        } catch (err) {
            console.error('Failed to fetch goal details:', err);
            setError(err.message || 'Failed to load goal details. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [goalIdentifier, getGoalTypeIdentifier, getPriorityIdentifier, getStatusIdentifier, getStatusName]);

    // Prevent stale requests when goalIdentifier changes
    useEffect(() => {
        let isCurrent = true;

        const load = async () => {
            if (isCurrent) {
                await fetchGoalDetails();
            }
        };

        load();

        return () => {
            isCurrent = false;
        };
    }, [fetchGoalDetails]);

    // Dynamic progress update if tasks change
    const completedCount = tasks.filter(t => {
        const s = (getStatusName(t.status) || t.status || '').toLowerCase();
        return s === 'completed';
    }).length;

    const updatedGoal = goal ? {
        ...goal,
        progress: tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : (goal.progress || 0)
    } : null;

    // Handle Goal Information field edits
    const handleGoalChange = (field, value) => {
        setGoal(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                [field]: value,
                ...(field === 'title' ? { goalTitle: value } : {}),
                ...(field === 'description' ? { goalDescription: value } : {}),
                ...(field === 'goalType' ? { type: value, category: value } : {})
            };
        });
    };

    // Handle single task field changes
    const handleTaskChange = (taskId, fieldName, value) => {
        setTasks(prev => prev.map(task =>
            task.id === taskId ? { ...task, [fieldName]: value } : task
        ));
    };

    // Append a new task row (taskIdentifier is null for new tasks)
    const handleAddTask = () => {
        const newId = `task-new-${Date.now()}`;
        setTasks(prev => [
            ...prev,
            {
                id: newId,
                taskIdentifier: null, // Preserved distinction: null means new task
                taskName: '',
                description: '',
                estimatedHours: '',
                dueDate: '',
                priority: '2',
                status: '1'
            }
        ]);
    };

    // Save tasks edits (switches to view mode)
    const handleSaveTasks = () => {
        console.log('Saved changes inside edit mode:', { goal: updatedGoal, tasks });
        if (updateGoalWithTasks && updatedGoal) {
            updateGoalWithTasks(goalIdentifier, updatedGoal, tasks);
        }
        setMode('view');
        navigate(`/goals/${encodeURIComponent(goalIdentifier)}`);
        alert('Changes saved successfully!');
    };

    // Back to Goals navigation handler
    const handleBackToGoals = () => {
        navigate('/goals');
    };

    // Mock scheduling triggers
    const handleGenerateSchedule = () => {
        console.log('Generate study schedule clicked inside GoalDetails page');
        alert('Scheduler triggered successfully!');
    };

    // Render Loading State
    if (isLoading) {
        return (
            <div className="goal-details-page-wrapper py-4 px-2 px-md-4">
                <DashboardCard className="goal-loading-card" hover={false} shadow={true} padding="64px 32px">
                    <div className="d-flex flex-column align-items-center justify-content-center text-center">
                        <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
                            <span className="visually-hidden">Loading goal details...</span>
                        </div>
                        <h4 className="fw-bold mb-1">Loading Goal Details</h4>
                        <p className="text-muted mb-0">Please wait while we retrieve the goal information and tasks.</p>
                    </div>
                </DashboardCard>
            </div>
        );
    }

    // Render Error State
    if (error || !goal) {
        return (
            <div className="goal-details-page-wrapper py-4 px-2 px-md-4">
                <DashboardCard className="goal-error-card" hover={false} shadow={true} padding="56px 32px">
                    <div className="d-flex flex-column align-items-center justify-content-center text-center">
                        <div className="text-danger mb-3" style={{ fontSize: '2.5rem' }}>
                            <i className="bi bi-exclamation-triangle"></i>
                        </div>
                        <h3 className="mb-2 fw-bold">Unable to Load Goal Details</h3>
                        <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '440px' }}>
                            {error || 'The requested goal could not be found.'}
                        </p>
                        <div className="d-flex gap-3">
                            <ButtonComponent
                                type="button"
                                text="Back to Goals"
                                className="btn btn-outline-secondary"
                                onclick={handleBackToGoals}
                            />
                            <ButtonComponent
                                type="button"
                                text="Try Again"
                                className="btn type_1_btn"
                                onclick={fetchGoalDetails}
                            />
                        </div>
                    </div>
                </DashboardCard>
            </div>
        );
    }

    return (
        <div className="goal-details-page-wrapper py-4 px-2 px-md-4">
            <GoalTaskCreation
                mode={mode}
                goal={updatedGoal}
                tasks={tasks}
                statistics={statistics}
                onBack={handleBackToGoals}
                onSaveTasks={handleSaveTasks}
                onGenerateSchedule={handleGenerateSchedule}
                onAddTask={handleAddTask}
                onTaskChange={handleTaskChange}
                onGoalChange={handleGoalChange}
            />
        </div>
    );
};

export default GoalDetails;

