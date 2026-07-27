import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';

// Import the GoalTaskCreation component
import GoalTaskCreation from '../../../../components/app/goals/GoalTaskCreation/GoalTaskCreation';
import './GoalDetails.css';

// Default mock values matching the Figma screen exactly
const DEFAULT_GOAL = {
    title: 'Mastering Advanced Neural Architectures',
    description: 'Deep dive into Transformer models, GNNs, and diffusion-based architectures. This goal aims to achieve technical proficiency in implementing and optimizing custom layers from scratch using PyTorch, with a final project focusing on multi-modal integration.',
    type: 'Academic Research',
    priority: 'High / Strategic',
    targetDate: '2024-12-15',
    createdDate: 'Aug 22, 2024',
    lastUpdated: 'Oct 14, 2024',
    category: 'Academic',
    priorityLevel: 'High Priority',
    status: 'In Progress',
    progress: 65
};

const DEFAULT_TASKS = [
    {
        id: 1,
        taskName: 'Atten',
        description: 'Paper review on',
        estimatedHours: 4,
        dueDate: '2024-11-05',
        priority: 'High',
        status: 'Completed'
    },
    {
        id: 2,
        taskName: 'ViT Im',
        description: 'Coding Vision T',
        estimatedHours: 8,
        dueDate: '2024-11-12',
        priority: 'Medium',
        status: 'In Progress'
    }
];

const DEFAULT_STATISTICS = {
    tasksDone: '12',
    tasksTotal: '18',
    hoursDone: '42',
    hoursTotal: '60',
    weeklyProgress: [
        { day: 'M', progress: 35 },
        { day: 'T', progress: 55 },
        { day: 'W', progress: 25 },
        { day: 'T', progress: 85 },
        { day: 'F', progress: 60 },
        { day: 'S', progress: 20 },
        { day: 'S', progress: 12 }
    ]
};

export const GoalDetails = () => {
    const location = useLocation();
    const { goalId } = useParams(); // Placeholder for future backend fetch
    const navigate = useNavigate();

    // Determine mode from React Router pathname
    const isEditMode = location.pathname.endsWith('/edit');
    const [mode, setMode] = useState(isEditMode ? 'edit' : 'view');

    // Keep mode state in sync on pathname changes
    useEffect(() => {
        setMode(isEditMode ? 'edit' : 'view');
    }, [isEditMode]);

    // Local states
    const [goal, setGoal] = useState(DEFAULT_GOAL);
    const [tasks, setTasks] = useState(DEFAULT_TASKS);

    // Dynamic calculations for Statistics
    const totalHours = tasks.reduce((sum, t) => sum + (Number(t.estimatedHours) || 0), 0);
    const completedTasksCount = tasks.filter(t => t.status === 'Completed').length;
    const completedHours = tasks.filter(t => t.status === 'Completed').reduce((sum, t) => sum + (Number(t.estimatedHours) || 0), 0);

    const statistics = {
        tasksDone: String(completedTasksCount),
        tasksTotal: String(tasks.length),
        hoursDone: String(completedHours),
        hoursTotal: String(totalHours),
        weeklyProgress: DEFAULT_STATISTICS.weeklyProgress
    };

    // Keep goal progress percentage in sync with tasks completed
    const updatedGoal = {
        ...goal,
        progress: tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0
    };

    // Log ID updates for backend integration placeholder
    useEffect(() => {
        if (goalId) {
            console.log(`GoalDetails page loaded for Goal ID: ${goalId}`);
        }
    }, [goalId]);

    // Handle single task field changes
    const handleTaskChange = (taskId, fieldName, value) => {
        setTasks(prev => prev.map(task =>
            task.id === taskId ? { ...task, [fieldName]: value } : task
        ));
    };

    // Append a new empty task row
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

    // Save tasks edits and return to view mode URL
    const handleSaveTasks = () => {
        console.log('Saved changes inside edit mode:', { goal: updatedGoal, tasks });
        setMode('view');
        navigate(`/goals/${goalId || '1'}`);
        alert('Changes saved successfully!');
    };

    // Back to Goals navigation handler
    const handleBackToGoals = () => {
        navigate('/goals');
    };

    // Mock scheduling triggers
    const handleGenerateSchedule = () => {
        console.log('Generate study schedule clicked inside GoalDetails wrapper page');
        alert('Scheduler triggered successfully!');
    };

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
            />
        </div>
    );
};

export default GoalDetails;
