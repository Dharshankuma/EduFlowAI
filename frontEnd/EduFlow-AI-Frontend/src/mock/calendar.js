export const MOCK_EVENTS = [
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

export const MOCK_TODAY_SUMMARY = {
    studyGoal: 85,
    concentrationScore: 92
};

export const MOCK_MONTHLY_PROGRESS = {
    totalStudyHours: 124,
    completedSessions: 42,
    upcomingSessions: 18
};

export const MOCK_PLANNER_INSIGHT = {
    recommendation: "Your workload is concentrated on Oct 24-25. Would you like to distribute some tasks to the 26th for better retention?"
};
