import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USER } from '../mock/users';
import { MOCK_GOALS } from '../mock/goals';
import { MOCK_TASKS_BY_GOAL, DEFAULT_TASKS } from '../mock/tasks';
import { MOCK_EVENTS } from '../mock/calendar';
import { MOCK_NOTIFICATIONS } from '../mock/notifications';
import { MOCK_STUDY_AVAILABILITY, MOCK_STUDY_PREFERENCES } from '../mock/profile';
import { MOCK_SETTINGS } from '../mock/settings';

const AppStateContext = createContext(null);

export const StateProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(MOCK_USER);
    const [goals, setGoals] = useState(MOCK_GOALS);
    const [tasks, setTasks] = useState(MOCK_TASKS_BY_GOAL);
    const [calendarEvents, setCalendarEvents] = useState(MOCK_EVENTS);
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const [availability, setAvailability] = useState(MOCK_STUDY_AVAILABILITY);
    const [preferences, setPreferences] = useState(MOCK_STUDY_PREFERENCES);
    const [settings, setSettings] = useState(MOCK_SETTINGS);
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    // Helpers
    const addGoalWithTasks = (goalData, tasksList) => {
        const newGoalId = goals.length > 0 ? Math.max(...goals.map(g => g.id)) + 1 : 1;
        
        const newGoal = {
            id: newGoalId,
            title: goalData.goalTitle || 'Untitled Goal',
            category: goalData.category || 'Skill',
            priority: goalData.priority || 'Medium',
            progress: 0,
            totalTasks: tasksList.length,
            completedTasks: 0,
            remainingTasks: tasksList.length,
            targetDate: goalData.targetDate || '2026-12-31',
            nextSession: 'Today, 2:00 PM',
            status: goalData.status || 'Active',
            description: goalData.goalDescription || ''
        };

        // Save Goal
        setGoals(prev => [newGoal, ...prev]);

        // Save Tasks associated with Goal ID
        const tasksWithIds = tasksList.map((task, idx) => ({
            ...task,
            id: task.id || idx + 1,
            status: task.status || 'Pending'
        }));
        setTasks(prev => ({
            ...prev,
            [newGoalId]: tasksWithIds
        }));

        // Generate Calendar Events for each task
        const newEvents = tasksWithIds.map((task, idx) => ({
            id: calendarEvents.length + idx + 100, // Safe unique ID
            title: task.taskName || `Task ${idx + 1}`,
            course: newGoal.title,
            date: task.dueDate || newGoal.targetDate,
            time: "10:00 AM - 12:00 PM",
            type: "Study Session",
            status: task.status === 'Completed' ? 'Completed' : 'Upcoming',
            completed: task.status === 'Completed'
        }));
        setCalendarEvents(prev => [...newEvents, ...prev]);

        // Create notification
        const newNotification = {
            id: notifications.length + 1,
            text: `Goal "${newGoal.title}" was successfully created and optimized schedule was generated!`,
            time: "Just now",
            type: "success",
            unread: true
        };
        setNotifications(prev => [newNotification, ...prev]);

        return newGoalId;
    };

    const updateGoalWithTasks = (goalId, goalData, tasksList) => {
        const numericId = Number(goalId);
        
        // Update goal metadata
        setGoals(prev => prev.map(g => {
            if (g.id === numericId) {
                const total = tasksList.length;
                const completed = tasksList.filter(t => t.status === 'Completed').length;
                const progressVal = total > 0 ? Math.round((completed / total) * 100) : 0;
                
                return {
                    ...g,
                    title: goalData.title || g.title,
                    description: goalData.description || g.description,
                    priority: goalData.priority || g.priority,
                    targetDate: goalData.targetDate || g.targetDate,
                    totalTasks: total,
                    completedTasks: completed,
                    remainingTasks: total - completed,
                    progress: progressVal
                };
            }
            return g;
        }));

        // Update tasks
        setTasks(prev => ({
            ...prev,
            [numericId]: tasksList
        }));

        // Log notification
        const matchedGoal = goals.find(g => g.id === numericId);
        const newNotification = {
            id: notifications.length + 1,
            text: `Goal "${matchedGoal?.title || 'Goal'}" tasks were updated.`,
            time: "Just now",
            type: "info",
            unread: true
        };
        setNotifications(prev => [newNotification, ...prev]);
    };

    const deleteGoal = (id) => {
        const numericId = Number(id);
        const matchedGoal = goals.find(g => g.id === numericId);

        setGoals(prev => prev.filter(g => g.id !== numericId));
        setTasks(prev => {
            const copy = { ...prev };
            delete copy[numericId];
            return copy;
        });

        // Add deletion notification
        if (matchedGoal) {
            const newNotification = {
                id: notifications.length + 1,
                text: `Goal "${matchedGoal.title}" has been deleted.`,
                time: "Just now",
                type: "warning",
                unread: true
            };
            setNotifications(prev => [newNotification, ...prev]);
        }
    };

    const markNotificationAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    return (
        <AppStateContext.Provider value={{
            currentUser,
            setCurrentUser,
            goals,
            setGoals,
            tasks,
            setTasks,
            calendarEvents,
            setCalendarEvents,
            notifications,
            setNotifications,
            availability,
            setAvailability,
            preferences,
            setPreferences,
            settings,
            setSettings,
            theme,
            toggleTheme,
            addGoalWithTasks,
            updateGoalWithTasks,
            deleteGoal,
            markNotificationAsRead,
            clearNotifications
        }}>
            {children}
        </AppStateContext.Provider>
    );
};

export const useAppState = () => {
    const context = useContext(AppStateContext);
    if (!context) {
        throw new Error('useAppState must be used within a StateProvider');
    }
    return context;
};
