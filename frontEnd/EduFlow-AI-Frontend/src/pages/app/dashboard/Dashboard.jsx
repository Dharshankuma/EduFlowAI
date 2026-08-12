import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../../context/StateContext';
import TodayStudyPlan from '../../../components/app/dashboard/TodayStudyPlan/TodayStudyPlan';
import Statistics from '../../../components/app/dashboard/Statistics/Statistics';
import TodaySchedule from '../../../components/app/dashboard/TodaySchedule/TodaySchedule';
import FocusSession from '../../../components/app/dashboard/FocusSession/FocusSession';
import CalendarWidget from '../../../components/app/dashboard/CalendarWidget/CalendarWidget';
import GoalProgress from '../../../components/app/dashboard/GoalProgress/GoalProgress';
import UpcomingTasks from '../../../components/app/dashboard/UpcomingTasks/UpcomingTasks';
import RecentActivity from '../../../components/app/dashboard/RecentActivity/RecentActivity';
import StudyNowCanvas from '../../../components/app/dashboard/StudyNowCanvas/StudyNowCanvas';
import './Dashboard.css';

export const Dashboard = () => {
    const navigate = useNavigate();
    const { currentUser, goals, tasks, calendarEvents, notifications } = useAppState();
    
    // Study Now canvas state and integration
    const [studyNowOpen, setStudyNowOpen] = useState(false);

    useEffect(() => {
        const handleOpen = () => setStudyNowOpen(true);
        window.addEventListener('open-study-now', handleOpen);
        return () => window.removeEventListener('open-study-now', handleOpen);
    }, []);

    // Mock data for Study Now Canvas
    const mockTodaySummary = {
        sessions: 5,
        completed: 2,
        inProgress: 1,
        timeLeft: "3h 15m"
    };

    const mockSessions = [
        {
            id: 1,
            subject: "Data Structures",
            type: "Placement Preparation",
            startTime: "09:00",
            endTime: "10:00",
            status: "pending"
        },
        {
            id: 2,
            subject: "Operating Systems",
            type: "Placement Preparation",
            startTime: "11:00",
            endTime: "12:00",
            status: "in-progress",
            startedAt: "11:05 AM"
        },
        {
            id: 3,
            subject: "Mini Project",
            type: "Placement Preparation",
            startTime: "14:00",
            endTime: "15:00",
            status: "completed",
            completedAt: "2:05 PM"
        },
        {
            id: 4,
            subject: "Azure AZ-104",
            type: "Azure Certification",
            startTime: "16:00",
            endTime: "17:00",
            status: "pending"
        },
        {
            id: 5,
            subject: "DSA Practice",
            type: "Placement Preparation",
            startTime: "19:00",
            endTime: "20:00",
            status: "pending"
        }
    ];

    // Callbacks for Study Now Canvas
    const handleStartSession = (sessionId) => {
        console.log(`Callback: Start Session triggered for ID: ${sessionId}`);
    };
    const handleMarkComplete = (sessionId) => {
        console.log(`Callback: Mark Session as Complete triggered for ID: ${sessionId}`);
    };
    const handleViewSession = (sessionId) => {
        console.log(`Callback: View Session details triggered for ID: ${sessionId}`);
    };
    const handleReschedule = (sessionId) => {
        console.log(`Callback: Reschedule Session triggered for ID: ${sessionId}`);
    };
    const handleViewFullSchedule = () => {
        console.log("Callback: View Full Schedule triggered");
    };

    // 1. Compute dynamic metrics from global AppState
    const activeGoalsCount = goals.filter(g => g.status === 'Active' || g.status === 'In Progress').length;
    
    // Count all tasks from all goals
    let totalTasksCount = 0;
    let completedTasksCount = 0;
    Object.values(tasks).forEach(list => {
        totalTasksCount += list.length;
        completedTasksCount += list.filter(t => t.status === 'Completed').length;
    });

    const dashboardData = {
        studyPlan: {
            studyHours: "5h 20m",
            activeGoals: String(activeGoalsCount),
            nextTask: "45m",
            studyStreak: "12 Days",
            dailyBrief: {
                recommendations: [
                    "Complete Data Structures Practice (45 min)",
                    "Revise Operating Systems process sync (30 min)",
                    "Review AWS IAM policies (30 min)",
                    "Continue Azure AZ-104 (30 min)"
                ],
                studyFocus: "Today's Recommendations",
                quickTips: "AI Daily Brief",
                completionEstimate: "Est. 2h 15m",
                progressToday: totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 40
            }
        },
        statistics: [
            {
                title: "Study Hours Today",
                value: "5h 20m",
                description: "Cumulative study focus time",
                trend: "+18% from yesterday",
                trendType: "success",
                icon: "bi-clock-fill"
            },
            {
                title: "Completed Tasks",
                value: String(completedTasksCount > 0 ? completedTasksCount : 18),
                description: "Checks finished today",
                trend: `+${completedTasksCount} total`,
                trendType: "success",
                icon: "bi-check-circle-fill"
            },
            {
                title: "Active Goals",
                value: String(activeGoalsCount),
                description: "In-progress academic milestones",
                trend: "On Track",
                trendType: "info",
                icon: "bi-journal-bookmark-fill"
            },
            {
                title: "Study Streak",
                value: "12 Days",
                description: "Consecutive active learning days",
                trend: "Personal Best",
                trendType: "warning",
                icon: "bi-fire"
            }
        ],
        schedule: calendarEvents.slice(0, 5).map(event => ({
            id: event.id,
            time: event.time.split(' - ')[0],
            subject: event.course,
            topic: event.title,
            status: event.completed ? 'Completed' : 'Pending'
        })),
        focusSession: {
            subject: goals[0]?.title || "Data Structures",
            duration: 1500
        },
        calendar: {
            currentMonth: "September 2023",
            calendarDays: [
                { day: 27, isCurrentMonth: false },
                { day: 28, isCurrentMonth: false },
                { day: 29, isCurrentMonth: false },
                { day: 30, isCurrentMonth: false },
                { day: 31, isCurrentMonth: false },
                { day: 1, isCurrentMonth: true },
                { day: 2, isCurrentMonth: true },
                { day: 3, isCurrentMonth: true },
                { day: 4, isCurrentMonth: true },
                { day: 5, isCurrentMonth: true },
                { day: 6, isCurrentMonth: true },
                { day: 7, isCurrentMonth: true },
                { day: 8, isCurrentMonth: true, isToday: true, isSelected: true },
                { day: 9, isCurrentMonth: true },
                { day: 10, isCurrentMonth: true },
                { day: 11, isCurrentMonth: true, hasTask: true },
                { day: 12, isCurrentMonth: true },
                { day: 13, isCurrentMonth: true },
                { day: 14, isCurrentMonth: true, hasTask: true },
                { day: 15, isCurrentMonth: true }
            ]
        },
        goals: goals.map(g => ({
            id: g.id,
            title: g.title,
            category: g.category,
            progress: g.progress,
            dueDate: `Due ${g.targetDate}`,
            status: g.progress > 50 ? 'On Track' : 'Steady'
        })),
        upcomingTasks: calendarEvents.filter(e => !e.completed).slice(0, 3).map(e => ({
            id: e.id,
            title: e.title,
            subject: e.course.substring(0, 10),
            dueDate: "Upcoming",
            dueTime: e.time.split(' - ')[0],
            priority: "Medium",
            status: "Pending",
            icon: "bi-file-earmark-code"
        })),
        recentActivities: notifications.slice(0, 3).map(n => ({
            id: n.id,
            type: n.type,
            title: n.type === 'success' ? 'Task Completed' : 'Goal Alert',
            description: n.text,
            time: n.time
        }))
    };

    // 3. Action Click callbacks (Backend Ready triggers)
    const handleCreateGoal = () => navigate('/goals/create');
    const handleGeneratePlan = () => navigate('/goals/create');
    const handleEditSchedule = () => navigate('/calendar');
    const handleViewAllGoals = () => navigate('/goals');
    const handleViewAllActivities = () => navigate('/notifications');
    const handleViewAllTasks = () => navigate('/calendar');
    
    const handlePrevMonth = () => console.log("Trigger: Prev Month");
    const handleNextMonth = () => console.log("Trigger: Next Month");
    const handleDayClick = (dayData) => console.log("Clicked day: ", dayData);
    const handleTaskClick = (taskData) => console.log("Clicked task: ", taskData);

    const handlePlayFocus = () => console.log("Focus timer started");
    const handlePauseFocus = () => console.log("Focus timer paused");
    const handlePrevFocus = () => console.log("Focus subject previous");
    const handleNextFocus = () => console.log("Focus subject next");

    return (
        <div className="dashboard-page-container">
            {/* Top Row: Daily study plan metrics */}
            <div className="dashboard-section">
                <TodayStudyPlan
                    studyHours={dashboardData.studyPlan.studyHours}
                    activeGoals={dashboardData.studyPlan.activeGoals}
                    nextTask={dashboardData.studyPlan.nextTask}
                    studyStreak={dashboardData.studyPlan.studyStreak}
                    dailyBrief={dashboardData.studyPlan.dailyBrief}
                    onCreateGoal={handleCreateGoal}
                    onGeneratePlan={handleGeneratePlan}
                />
            </div>

            {/* Statistics row */}
            <div className="dashboard-section">
                <Statistics stats={dashboardData.statistics} />
            </div>

            {/* Responsive grid split (left: wider columns, right: side widget bar) */}
            <div className="container-fluid p-0">
                <div className="row g-4">
                    {/* Left Column Stack */}
                    <div className="col-12 col-lg-8 dashboard-grid-column">
                        <TodaySchedule
                            scheduleItems={dashboardData.schedule}
                            onEditSchedule={handleEditSchedule}
                        />
                        <GoalProgress
                            goals={dashboardData.goals}
                            onViewAllGoals={handleViewAllGoals}
                            onCreateNewGoal={handleCreateGoal}
                        />
                        <RecentActivity
                            activities={dashboardData.recentActivities}
                            onViewAllActivities={handleViewAllActivities}
                        />
                    </div>

                    {/* Right Column Stack */}
                    <div className="col-12 col-lg-4 dashboard-grid-column">
                        <FocusSession
                            subject={dashboardData.focusSession.subject}
                            duration={dashboardData.focusSession.duration}
                            onPlay={handlePlayFocus}
                            onPause={handlePauseFocus}
                            onPrevious={handlePrevFocus}
                            onNext={handleNextFocus}
                        />
                        <CalendarWidget onDaySelect={handleDayClick} />
                        <UpcomingTasks
                            tasks={dashboardData.upcomingTasks}
                            onViewAllTasks={handleViewAllTasks}
                            onTaskClick={handleTaskClick}
                        />
                    </div>
                </div>
            </div>

            <StudyNowCanvas
                isOpen={studyNowOpen}
                todaySummary={mockTodaySummary}
                progress={60}
                sessions={mockSessions}
                onClose={() => setStudyNowOpen(false)}
                onStartSession={handleStartSession}
                onMarkComplete={handleMarkComplete}
                onViewSession={handleViewSession}
                onReschedule={handleReschedule}
                onViewFullSchedule={handleViewFullSchedule}
            />
        </div>
    );
};

export default Dashboard;
