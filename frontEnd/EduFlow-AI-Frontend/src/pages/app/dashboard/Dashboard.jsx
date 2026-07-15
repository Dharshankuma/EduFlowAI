import React, { useState } from 'react';
import TodayStudyPlan from '../../../components/app/dashboard/TodayStudyPlan/TodayStudyPlan';
import Statistics from '../../../components/app/dashboard/Statistics/Statistics';
import TodaySchedule from '../../../components/app/dashboard/TodaySchedule/TodaySchedule';
import FocusSession from '../../../components/app/dashboard/FocusSession/FocusSession';
import CalendarWidget from '../../../components/app/dashboard/CalendarWidget/CalendarWidget';
import GoalProgress from '../../../components/app/dashboard/GoalProgress/GoalProgress';
import UpcomingTasks from '../../../components/app/dashboard/UpcomingTasks/UpcomingTasks';
import RecentActivity from '../../../components/app/dashboard/RecentActivity/RecentActivity';
import './Dashboard.css';

export const Dashboard = () => {

    // 2. Mock Data aligned with Figma requirements
    const dashboardData = {
        studyPlan: {
            studyHours: "5h 20m",
            activeGoals: "3",
            nextTask: "5h 20m", // Est. Time
            studyStreak: "12 Days",
            dailyBrief: {
                recommendations: [
                    "Complete Data Structures (45 min)",
                    "Revise Operating Systems (30 min)",
                    "Practice 2 DSA Problems",
                    "Continue Azure AZ-104 (30 min)"
                ],
                studyFocus: "Today's Recommendations",
                quickTips: "AI Daily Brief",
                completionEstimate: "Est. 2h 15m",
                progressToday: 40
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
                value: "18",
                description: "Checks finished today",
                trend: "+6 today",
                trendType: "success",
                icon: "bi-check-circle-fill"
            },
            {
                title: "Active Goals",
                value: "5",
                description: "In-progress academic milestones",
                trend: "2 due this week",
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
        schedule: [
            { id: 1, time: "09:00", subject: "Data Structures", topic: "Sorting algorithms & Hash Maps", status: "Current" },
            { id: 2, time: "11:00", subject: "Operating Systems", topic: "Process synchronization & Semaphores", status: "Completed" },
            { id: 3, time: "14:00", subject: "Mini Project", topic: "UI/UX implementation phase", status: "Pending" },
            { id: 4, time: "16:00", subject: "Azure Certification", topic: "Cloud fundamental practices", status: "Pending" },
            { id: 5, time: "18:00", subject: "Gym 🏋️", topic: "Physical well-being break", status: "Pending" }
        ],
        focusSession: {
            subject: "Data Structures",
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
        goals: [
            { id: 1, title: "Placement Preparation", category: "DSA + Aptitude", progress: 75, dueDate: "Due Jul 30", status: "On Track" },
            { id: 2, title: "Semester Exams", category: "Academic Preparation", progress: 40, dueDate: "Due Nov 15", status: "At Risk" },
            { id: 3, title: "Azure AZ-104", category: "Cloud Certification", progress: 60, dueDate: "Due Oct 05", status: "Steady" }
        ],
        upcomingTasks: [
            { id: 1, title: "OS Lab Submission", subject: "OS", dueDate: "Today", dueTime: "04:00 PM", priority: "High", status: "Pending", icon: "bi-file-earmark-code" },
            { id: 2, title: "DS Algo Practice", subject: "DSA", dueDate: "Tomorrow", dueTime: "10:00 AM", priority: "Medium", status: "Pending", icon: "bi-laptop" },
            { id: 3, title: "Azure Mock Test", subject: "Cloud", dueDate: "Sep 12", dueTime: "06:00 PM", priority: "Low", status: "Pending", icon: "bi-shield-check" }
        ],
        recentActivities: [
            { id: 1, type: "task", title: "Task Completed", description: "Completed Sorting Algorithms Quiz with 95% score.", time: "20 minutes ago" },
            { id: 2, type: "goal", title: "Goal Created", description: "Added new goal: System Design Mastery.", time: "2 hours ago" },
            { id: 3, type: "study session", title: "Study Session Completed", description: "Finished a 45-minute Deep Focus session on Python.", time: "4 hours ago" }
        ]
    };

    // 3. Action Click callbacks (Backend Ready triggers)
    const handleCreateGoal = () => console.log("Trigger: Create Goal");
    const handleGeneratePlan = () => console.log("Trigger: Generate Plan");
    const handleEditSchedule = () => console.log("Trigger: Edit Schedule");
    const handleViewAllGoals = () => console.log("Trigger: View All Goals");
    const handleViewAllActivities = () => console.log("Trigger: View All Activities");
    const handleViewAllTasks = () => console.log("Trigger: View All Tasks");
    
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
        </div>
    );
};

export default Dashboard;
