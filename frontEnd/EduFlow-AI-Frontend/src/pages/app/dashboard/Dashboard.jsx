import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../../context/StateContext';
import { getDashboard } from '../../../api/dashboard/dashboardApi';
import TodayStudyPlan from '../../../components/app/dashboard/TodayStudyPlan/TodayStudyPlan';
import Statistics from '../../../components/app/dashboard/Statistics/Statistics';
import TodaySchedule from '../../../components/app/dashboard/TodaySchedule/TodaySchedule';
// import FocusSession from '../../../components/app/dashboard/FocusSession/FocusSession';
// import CalendarWidget from '../../../components/app/dashboard/CalendarWidget/CalendarWidget';
import GoalProgress from '../../../components/app/dashboard/GoalProgress/GoalProgress';
import UpcomingTasks from '../../../components/app/dashboard/UpcomingTasks/UpcomingTasks';
import RecentActivity from '../../../components/app/dashboard/RecentActivity/RecentActivity';
import StudyNowCanvas from '../../../components/app/dashboard/StudyNowCanvas/StudyNowCanvas';
import './Dashboard.css';

export const Dashboard = () => {
    const navigate = useNavigate();
    const { setCurrentUser } = useAppState();

    // Dashboard data & request states
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate] = useState(null);

    // Guard against race conditions and stale async responses
    const activeRequestIdRef = useRef(0);

    // Study Now canvas state
    const [studyNowOpen, setStudyNowOpen] = useState(false);

    useEffect(() => {
        const handleOpen = () => setStudyNowOpen(true);
        window.addEventListener('open-study-now', handleOpen);
        return () => window.removeEventListener('open-study-now', handleOpen);
    }, []);

    // Primary data fetcher
    const fetchDashboardData = useCallback(async (dateAnchor) => {
        const requestId = ++activeRequestIdRef.current;
        setIsLoading(true);
        setError(null);

        try {
            const data = await getDashboard(dateAnchor);
            if (requestId === activeRequestIdRef.current && data) {
                setDashboardData(data);

                // Update current user greeting name if returned
                if (data.userName && setCurrentUser) {
                    setCurrentUser(prev => ({
                        ...prev,
                        userName: data.userName,
                        firstName: data.userName.split(' ')[0] || data.userName
                    }));
                }
            }
        } catch (err) {
            if (requestId === activeRequestIdRef.current) {
                console.error("Failed to load dashboard data:", err);
                setError("Unable to load your dashboard data. Please check your connection and try again.");
            }
        } finally {
            if (requestId === activeRequestIdRef.current) {
                setIsLoading(false);
            }
        }
    }, [setCurrentUser]);

    // Fetch on initial mount and when selectedDate changes
    useEffect(() => {
        fetchDashboardData(selectedDate);
    }, [fetchDashboardData, selectedDate]);

    // Navigation and Action Handlers
    const handleCreateGoal = () => navigate('/goals/create');
    const handleGeneratePlan = () => navigate('/ai-planner');
    const handleEditSchedule = () => navigate('/calendar');
    const handleViewAllGoals = () => navigate('/goals');
    const handleViewAllActivities = () => navigate('/notifications');
    const handleViewAllTasks = () => navigate('/calendar');
    const handleTaskClick = () => navigate('/calendar');
    const handleViewFullSchedule = () => navigate('/calendar');

    // Date selection handler from CalendarWidget (currently hidden)
    // const handleDayClick = (date) => {
    //     setSelectedDate(date);
    // };

    // Study Now Canvas session actions (local UI triggers)
    const handleStartSession = (sessionId) => {
        console.log(`Start Session requested for ID: ${sessionId}`);
    };
    const handleMarkComplete = (sessionId) => {
        console.log(`Mark Session complete requested for ID: ${sessionId}`);
    };
    const handleViewSession = () => {
        navigate('/calendar');
    };
    const handleReschedule = () => {
        navigate('/calendar');
    };

    // Derive Study Now Canvas items from actual dashboard schedule
    const canvasSessions = (dashboardData?.schedule || []).map(s => ({
        id: s.id,
        subject: s.subject,
        type: s.topic,
        startTime: s.time,
        endTime: '',
        status: s.status?.toLowerCase() || 'pending'
    }));

    const canvasSummary = {
        sessions: canvasSessions.length,
        completed: canvasSessions.filter(s => s.status === 'completed').length,
        inProgress: canvasSessions.filter(s => s.status === 'in-progress' || s.status === 'current').length,
        timeLeft: dashboardData?.studyPlan?.studyHours || '0h 00m'
    };

    // Initial Loading State
    if (isLoading && !dashboardData) {
        return (
            <div className="dashboard-page-container">
                <div className="dashboard-loading-wrapper">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p>Loading your study dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page-container">
            {/* Error banner with retry trigger */}
            {error && (
                <div className="dashboard-error-banner" role="alert">
                    <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-exclamation-triangle-fill"></i>
                        <span>{error}</span>
                    </div>
                    <button
                        type="button"
                        className="dashboard-retry-btn"
                        onClick={() => fetchDashboardData(selectedDate)}
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Refreshing state indicator when switching dates */}
            {isLoading && dashboardData && (
                <div className="dashboard-status-bar">
                    <div className="dashboard-loading-badge">
                        <span className="spinner-border spinner-border-sm text-primary" role="status" aria-hidden="true"></span>
                        <span>Refreshing dashboard data...</span>
                    </div>
                </div>
            )}

            {dashboardData && (
                <>
                    {/* Top Row: Daily study plan metrics */}
                    <div className="dashboard-section">
                        <TodayStudyPlan
                            userName={dashboardData.userName}
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
                                <UpcomingTasks
                                    tasks={dashboardData.upcomingTasks}
                                    onViewAllTasks={handleViewAllTasks}
                                    onTaskClick={handleTaskClick}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Study Now Canvas drawer */}
                    <StudyNowCanvas
                        isOpen={studyNowOpen}
                        todaySummary={canvasSummary}
                        progress={dashboardData.studyPlan.dailyBrief.progressToday}
                        sessions={canvasSessions}
                        onClose={() => setStudyNowOpen(false)}
                        onStartSession={handleStartSession}
                        onMarkComplete={handleMarkComplete}
                        onViewSession={handleViewSession}
                        onReschedule={handleReschedule}
                        onViewFullSchedule={handleViewFullSchedule}
                    />
                </>
            )}
        </div>
    );
};

export default Dashboard;
