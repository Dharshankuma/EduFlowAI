export const MOCK_STATISTICS = [
    { id: 1, title: 'TOTAL', value: 12, description: 'Global objectives', icon: 'bi-flag' },
    { id: 2, title: 'ACTIVE', value: 4, description: 'In progress now', icon: 'bi-lightning-charge' },
    { id: 3, title: 'COMPLETED', value: 8, description: 'Milestones reached', icon: 'bi-check-circle' },
    { id: 4, title: 'URGENT', value: 2, description: 'Upcoming deadlines', icon: 'bi-calendar-event' }
];

export const MOCK_GOALS = [
    {
        id: 1,
        title: 'Placement Preparation',
        category: 'Placement',
        priority: 'High',
        progress: 75,
        totalTasks: 20,
        completedTasks: 15,
        remainingTasks: 5,
        targetDate: '2026-08-15',
        nextSession: 'Tomorrow, 10:00 AM',
        status: 'Active',
        description: 'Prepare comprehensively for placements. Covers DSA, system design, mock interviews, and resume building.'
    },
    {
        id: 2,
        title: 'Advanced DS & Algo',
        category: 'Academic',
        priority: 'Medium',
        progress: 45,
        totalTasks: 12,
        completedTasks: 5,
        remainingTasks: 7,
        targetDate: '2025-12-20',
        nextSession: 'Today, 4:00 PM',
        status: 'Active',
        description: 'Advanced data structures and algorithms course, covering graphs, dynamic programming, segment trees, and network flow.'
    },
    {
        id: 3,
        title: 'AWS Solutions Architect',
        category: 'Skill Up',
        priority: 'High',
        progress: 15,
        totalTasks: 45,
        completedTasks: 7,
        remainingTasks: 38,
        targetDate: '2026-03-10',
        nextSession: 'Tomorrow, 2:00 PM',
        status: 'On Hold',
        description: 'AWS Certified Solutions Architect - Associate preparation. Focuses on VPC, EC2, IAM, S3, RDS, DynamoDB, Serverless, and IAM policies.'
    }
];

export const DEFAULT_GOAL = {
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
