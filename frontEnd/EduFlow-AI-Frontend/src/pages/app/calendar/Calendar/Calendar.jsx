import React, { useState } from 'react';
import CalendarMonthView from '../../../../components/app/calendar/CalendarMonthView/CalendarMonthView';
import CalendarWeekView from '../../../../components/app/calendar/CalendarWeekView/CalendarWeekView';
import CalendarDayView from '../../../../components/app/calendar/CalendarDayView/CalendarDayView';
import './Calendar.css';

// Initial state mock events list
const initialEvents = [
    // Month / Week events
    {
        id: 1,
        title: "DS Algorithms",
        course: "Placement Preparation",
        date: "2026-10-01",
        time: "10:00 AM - 12:00 PM",
        type: "Study Session",
        status: "Upcoming"
    },
    {
        id: 2,
        title: "OS Quiz Prep",
        course: "Computer Science Core",
        date: "2026-10-08",
        time: "02:00 PM - 04:00 PM",
        type: "Revision",
        status: "Completed",
        completed: true
    },
    {
        id: 3,
        title: "Final Review",
        course: "Discrete Math",
        date: "2026-10-24",
        time: "09:00 AM - 11:00 AM",
        type: "Exam",
        status: "Incomplete"
    },
    {
        id: 4,
        title: "Linear Algebra",
        course: "Math Advanced",
        date: "2026-10-24",
        time: "11:30 AM - 01:30 PM",
        type: "Study Session",
        status: "Incomplete"
    },
    {
        id: 5,
        title: "Group Discussion",
        course: "Soft Skills Prep",
        date: "2026-10-24",
        time: "03:00 PM - 04:30 PM",
        type: "Revision",
        status: "Incomplete"
    },
    {
        id: 6,
        title: "DB Lab Report",
        course: "Information Systems",
        date: "2026-10-25",
        time: "08:00 AM - 10:00 AM",
        type: "Assignment",
        status: "Incomplete",
        urgent: true
    },
    // Dedicated Week View mock events (represented by June 23-29, 2026 dates)
    {
        id: 10,
        title: "Calculus Review",
        course: "Math Basics",
        date: "2026-06-23",
        time: "08:00 AM - 10:00 AM",
        type: "Revision",
        status: "Missed"
    },
    {
        id: 11,
        title: "Arrays Practice",
        course: "Placement Preparation",
        date: "2026-06-24",
        time: "09:00 AM - 11:00 AM",
        type: "Study Session",
        status: "Completed",
        completed: true
    },
    {
        id: 12,
        title: "Neural Networks",
        course: "Advanced AI",
        date: "2026-06-24",
        time: "02:00 PM - 04:00 PM",
        type: "Study Session",
        status: "Incomplete"
    },
    {
        id: 13,
        title: "Database Indexing",
        course: "Information Systems",
        date: "2026-06-25",
        time: "10:00 AM - 12:00 PM",
        type: "Study Session",
        status: "Upcoming"
    },
    // Dedicated Day View mock events (represented by June 12, 2023 dates)
    {
        id: 20,
        title: "Arrays Practice",
        course: "Placement Preparation",
        date: "2023-06-12",
        time: "09:00 AM - 11:00 AM",
        description: "Intensive session focusing on multi-dimensional arrays, sliding window techniques, and...",
        priority: "High",
        type: "Study Session",
        status: "Incomplete"
    },
    {
        id: 21,
        title: "Neural Networks",
        course: "Advanced AI",
        date: "2023-06-12",
        time: "02:00 PM - 04:00 PM",
        description: "Focus on backpropagation algorithms, training processes, and neural network tuning techniques.",
        priority: "Low",
        type: "Study Session",
        status: "Completed"
    },
    {
        id: 22,
        title: "Operating Systems",
        course: "Computer Science Core",
        date: "2023-06-12",
        time: "06:00 PM - 08:00 PM",
        description: "Deep dive into Process Synchronization and Deadlocks. Covering Semaphores, Monitors, and classical synchronization problems.",
        priority: "Medium",
        type: "Study Session",
        status: "Incomplete"
    }
];

export const Calendar = () => {
    // 1. Controller view switcher state
    const [activeView, setActiveView] = useState("Month"); // "Month", "Week", "Day"

    // 2. Mock state variables
    const [selectedDate, setSelectedDate] = useState("Monday, June 12, 2023");
    const [selectedWeek, setSelectedWeek] = useState("June 23 - 29, 2026");
    const [selectedMonth, setSelectedMonth] = useState("October");
    const [selectedYear] = useState(2026);

    const [calendarEvents, setCalendarEvents] = useState(initialEvents);

    const [todaySummary] = useState({
        studyGoal: 85,
        concentrationScore: 92
    });

    const [monthlyProgress] = useState({
        totalStudyHours: 124,
        completedSessions: 42,
        upcomingSessions: 18
    });

    const [plannerInsight, setPlannerInsight] = useState({
        recommendation: "Your workload is concentrated on Oct 24-25. Would you like to distribute some tasks to the 26th for better retention?"
    });

    // 3. Callback handlers to coordinate user interactions
    const handleViewChange = (newView) => {
        setActiveView(newView);
        // Dynamically adjust planner insight copies depending on view context to mirror mockup feel
        if (newView.toLowerCase() === 'day') {
            setPlannerInsight({
                recommendation: "Your workload is concentrated on today's afternoon sessions. Consider moving one revision session to tomorrow for better retention."
            });
        } else if (newView.toLowerCase() === 'week') {
            setPlannerInsight({
                recommendation: "Your workload is concentrated on Tuesday afternoon. Consider moving one revision session to Thursday for better retention."
            });
        } else {
            setPlannerInsight({
                recommendation: "Your workload is concentrated on Oct 24-25. Would you like to distribute some tasks to the 26th for better retention?"
            });
        }
    };

    const handleToday = () => {
        // Reset selections back to standard mock anchoring dates
        setSelectedDate("Monday, June 12, 2023");
        setSelectedWeek("June 23 - 29, 2026");
        setSelectedMonth("October");
    };

    const handleDateClick = (dateObj) => {
        console.log("Selected Date in Page Controller:", dateObj);
    };

    const handleEventClick = (event) => {
        console.log("Active event selected:", event);
    };

    const handleViewGoal = (event) => {
        alert(`Navigating to study goal tracker for course: ${event.course || 'Core Study'}`);
    };

    const handleMarkComplete = (event) => {
        // Reactive local update: mark complete and set completed status indicators
        setCalendarEvents(prevEvents =>
            prevEvents.map(e =>
                e.id === event.id
                    ? { ...e, status: "Completed", completed: true }
                    : e
            )
        );
    };

    const handleReschedule = (event) => {
        const confirmChange = window.confirm(`Reschedule requested for "${event.title}". Would you like the AI Planner Engine to recommend alternative slots?`);
        if (confirmChange) {
            alert(`Rescheduled successfully! The new schedule has been updated in the database layout.`);
        }
    };

    const handleAdjustSchedule = () => {
        alert("AI Planner: Optimization in progress... Adjusting session distributions dynamically.");
    };

    // 4. View router assembly based on active state (renders one component at a time)
    const renderActiveCalendarView = () => {
        const viewType = activeView.toLowerCase();
        
        // Pass coordinated props to views
        const commonProps = {
            events: calendarEvents,
            todaySummary,
            monthlyProgress,
            plannerInsight,
            activeView,
            onViewChange: handleViewChange,
            onToday: handleToday,
            onEventClick: handleEventClick,
            onViewGoal: handleViewGoal,
            onMarkComplete: handleMarkComplete,
            onReschedule: handleReschedule,
            onAdjustSchedule: handleAdjustSchedule
        };

        switch (viewType) {
            case 'week':
                return (
                    <CalendarWeekView
                        {...commonProps}
                        selectedWeek={selectedWeek}
                    />
                );
            case 'day':
                return (
                    <CalendarDayView
                        {...commonProps}
                        selectedDate={selectedDate}
                    />
                );
            case 'month':
            default:
                return (
                    <CalendarMonthView
                        {...commonProps}
                        currentMonth={selectedMonth}
                        currentYear={selectedYear}
                        onDateClick={handleDateClick}
                    />
                );
        }
    };

    return (
        <div className="calendar-page-wrapper">
            {renderActiveCalendarView()}
        </div>
    );
};

export default Calendar;
