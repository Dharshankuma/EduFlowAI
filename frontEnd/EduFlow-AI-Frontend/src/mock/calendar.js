export const MOCK_EVENTS = [
    // October 2026 events
    {
        id: 1,
        title: "DS Algorithms",
        course: "Placement Preparation",
        date: "2026-10-01",
        time: "10:00 AM - 12:00 PM",
        type: "Study Session",
        status: "Upcoming",
        description: "Intensive practice on Tree traversals, Graph BFS/DFS, and dynamic programming patterns.",
        priority: "High"
    },
    {
        id: 2,
        title: "OS Quiz Prep",
        course: "Computer Science Core",
        date: "2026-10-08",
        time: "02:00 PM - 04:00 PM",
        type: "Revision",
        status: "Completed",
        completed: true,
        description: "Review memory management, virtual paging, segmentation, and page replacement algorithms.",
        priority: "Medium"
    },
    {
        id: 3,
        title: "Final Review",
        course: "Discrete Math",
        date: "2026-10-24",
        time: "09:00 AM - 11:00 AM",
        type: "Exam",
        status: "Incomplete",
        description: "Comprehensive review of Set Theory, Relations, Graph coloring, and Propositional Logic proofs.",
        priority: "High"
    },
    {
        id: 4,
        title: "Linear Algebra",
        course: "Math Advanced",
        date: "2026-10-24",
        time: "11:30 AM - 01:30 PM",
        type: "Study Session",
        status: "Incomplete",
        description: "Matrix decompositions, Eigenvalues, Eigenvectors, and Singular Value Decomposition (SVD).",
        priority: "Medium"
    },
    {
        id: 5,
        title: "Group Discussion",
        course: "Soft Skills Prep",
        date: "2026-10-24",
        time: "03:00 PM - 04:30 PM",
        type: "Revision",
        status: "Incomplete",
        description: "Mock group discussion session on emerging tech trends and collaborative problem solving.",
        priority: "Low"
    },
    {
        id: 6,
        title: "DB Lab Report",
        course: "Information Systems",
        date: "2026-10-25",
        time: "08:00 AM - 10:00 AM",
        type: "Assignment",
        status: "Incomplete",
        urgent: true,
        description: "Complete normalization proofs and SQL optimization benchmarks for the database lab assignment.",
        priority: "High"
    },
    {
        id: 7,
        title: "Python Machine Learning",
        course: "Artificial Intelligence",
        date: "2026-10-25",
        time: "02:00 PM - 04:00 PM",
        type: "Study Session",
        status: "Upcoming",
        description: "Implement regression pipelines, loss functions, and evaluation metrics using PyTorch.",
        priority: "Medium"
    },
    {
        id: 8,
        title: "Graph Theory Revision",
        course: "Computer Science Core",
        date: "2026-10-28",
        time: "10:00 AM - 12:00 PM",
        type: "Revision",
        status: "Upcoming",
        description: "Eulerian paths, Hamiltonian circuits, and bipartite matching algorithms review.",
        priority: "Medium"
    },

    // November 2026 events
    {
        id: 14,
        title: "AI Ethics & Alignment",
        course: "Artificial Intelligence",
        date: "2026-11-03",
        time: "09:00 AM - 11:00 AM",
        type: "Study Session",
        status: "Upcoming",
        description: "Safety benchmarks, RLHF alignment methods, and ethical reasoning in automated decision systems.",
        priority: "High"
    },
    {
        id: 15,
        title: "Cloud Architecture",
        course: "Distributed Systems",
        date: "2026-11-10",
        time: "02:00 PM - 04:00 PM",
        type: "Study Session",
        status: "Upcoming",
        description: "Microservices design, event-driven architectures, Kafka pipelines, and container orchestration.",
        priority: "Medium"
    },
    {
        id: 16,
        title: "Compiler Design Lab",
        course: "Computer Science Core",
        date: "2026-11-18",
        time: "10:00 AM - 12:00 PM",
        type: "Assignment",
        status: "Upcoming",
        urgent: true,
        description: "Build abstract syntax trees and implement intermediate code generation in LLVM.",
        priority: "High"
    },

    // September 2026 events
    {
        id: 17,
        title: "Algorithms Analysis Kickoff",
        course: "Placement Preparation",
        date: "2026-09-15",
        time: "10:00 AM - 12:00 PM",
        type: "Study Session",
        status: "Completed",
        completed: true,
        description: "Asymptotic notation, Master Theorem, and divide-and-conquer recurrences.",
        priority: "High"
    },

    // January 2027 events
    {
        id: 18,
        title: "Midterm Prep: Security",
        course: "Network Security",
        date: "2027-01-14",
        time: "09:00 AM - 11:00 AM",
        type: "Exam",
        status: "Upcoming",
        description: "Public key cryptography, RSA proofs, TLS handshakes, and cryptographic hash functions.",
        priority: "High"
    },

    // February 2027 events
    {
        id: 19,
        title: "Software Engineering",
        course: "Computer Science Core",
        date: "2027-02-10",
        time: "01:00 PM - 03:00 PM",
        type: "Study Session",
        status: "Upcoming",
        description: "Design patterns: Factory, Singleton, Observer, Strategy, and architectural layers.",
        priority: "Medium"
    },

    // Dedicated Week View mock events (June 2026)
    {
        id: 10,
        title: "Calculus Review",
        course: "Math Basics",
        date: "2026-06-23",
        time: "08:00 AM - 10:00 AM",
        type: "Revision",
        status: "Missed",
        description: "Review vector calculus theorems and double integrals to prepare for incoming quiz.",
        priority: "Medium"
    },
    {
        id: 11,
        title: "Arrays Practice",
        course: "Placement Preparation",
        date: "2026-06-24",
        time: "09:00 AM - 11:00 AM",
        type: "Study Session",
        status: "Completed",
        completed: true,
        description: "Intensive session focusing on multi-dimensional arrays and sliding window techniques.",
        priority: "High"
    },
    {
        id: 12,
        title: "Neural Networks",
        course: "Advanced AI",
        date: "2026-06-24",
        time: "02:00 PM - 04:00 PM",
        type: "Study Session",
        status: "Incomplete",
        description: "Deep dive into backpropagation algorithms and gradient descent optimization equations.",
        priority: "Medium"
    },
    {
        id: 13,
        title: "Database Indexing",
        course: "Information Systems",
        date: "2026-06-25",
        time: "10:00 AM - 12:00 PM",
        type: "Study Session",
        status: "Upcoming",
        description: "Learn about B-Trees, B+ Trees, hash indexing and query optimization layouts.",
        priority: "Medium"
    },

    // Dedicated Day View mock events (June 2023)
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
