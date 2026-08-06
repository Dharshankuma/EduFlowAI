export const DEFAULT_TASKS = [
    {
        id: 1,
        taskName: 'Attention Mechanisms Paper Review',
        description: 'Review attention mechanisms paper (Vaswani et al.) and write a brief summary.',
        estimatedHours: 4,
        dueDate: '2024-11-05',
        priority: 'High',
        status: 'Completed'
    },
    {
        id: 2,
        taskName: 'ViT Coding Implementation',
        description: 'Code a Vision Transformer block from scratch in PyTorch.',
        estimatedHours: 8,
        dueDate: '2024-11-12',
        priority: 'Medium',
        status: 'In Progress'
    }
];

export const MOCK_TASKS_BY_GOAL = {
    1: [
        { id: 1, taskName: 'Practice 20 Array questions', description: 'Solve sliding window and two-pointer array questions on LeetCode.', estimatedHours: 10, dueDate: '2026-08-10', priority: 'High', status: 'Completed' },
        { id: 2, taskName: 'Revise System Design basics', description: 'Study load balancers, caching strategies, and CDN architecture.', estimatedHours: 6, dueDate: '2026-08-14', priority: 'Medium', status: 'In Progress' },
        { id: 3, taskName: 'Update Resume', description: 'Add latest projects and skills. Get review from peers.', estimatedHours: 4, dueDate: '2026-08-15', priority: 'High', status: 'Pending' }
    ],
    2: [
        { id: 1, taskName: 'Graph Algorithms revision', description: 'Practice BFS, DFS, Dijkstra, and Kruskals.', estimatedHours: 8, dueDate: '2025-12-05', priority: 'High', status: 'Completed' },
        { id: 2, taskName: 'Segment Trees tutorial', description: 'Read tutorial and solve basic range query exercises.', estimatedHours: 6, dueDate: '2025-12-12', priority: 'Medium', status: 'Pending' }
    ],
    3: [
        { id: 1, taskName: 'Complete VPC lessons', description: 'Learn subnetting, route tables, internet gateways, NAT gateways, and VPC peering.', estimatedHours: 12, dueDate: '2026-02-28', priority: 'High', status: 'Completed' },
        { id: 2, taskName: 'DynamoDB practice sessions', description: 'Understand partition keys, sort keys, GSIs, and LSIs.', estimatedHours: 8, dueDate: '2026-03-05', priority: 'Medium', status: 'Pending' }
    ]
};

export const MOCK_UPCOMING_TASKS = [
    { id: 1, title: "OS Lab Submission", subject: "OS", dueDate: "Today", dueTime: "04:00 PM", priority: "High", status: "Pending", icon: "bi-file-earmark-code" },
    { id: 2, title: "DS Algo Practice", subject: "DSA", dueDate: "Tomorrow", dueTime: "10:00 AM", priority: "Medium", status: "Pending", icon: "bi-laptop" },
    { id: 3, title: "Azure Mock Test", subject: "Cloud", dueDate: "Sep 12", dueTime: "06:00 PM", priority: "Low", status: "Pending", icon: "bi-shield-check" }
];
