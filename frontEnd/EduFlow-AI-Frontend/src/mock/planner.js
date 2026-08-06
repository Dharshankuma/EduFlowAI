export const DEFAULT_PLANNER_STEPS = [
    'Reading Goal Information',
    'Organizing Tasks',
    'Checking Deadlines',
    'Reading Study Availability',
    'Calculating Priorities',
    'Distributing Study Hours',
    'Creating Weekly Schedule...'
];

export const MOCK_AI_RECOMMENDATIONS = [
    {
        id: 1,
        title: "Distribute Weekend Workload",
        description: "Your OS Revision session is scheduled on Saturday afternoon. Shifting it to Friday evening could prevent study fatigue.",
        impact: "Medium Impact",
        type: "Scheduling"
    },
    {
        id: 2,
        title: "Focus on High Priority DSA",
        description: "You have 3 High priority tasks pending under 'Placement Preparation'. Try starting with 'Practice 20 Array questions' to kickstart your weekly target.",
        impact: "High Impact",
        type: "Goal Priority"
    },
    {
        id: 3,
        title: "Consistent Early Morning Learning",
        description: "Analysis shows your concentration score is 15% higher when studying before 11:00 AM. Try scheduling tougher topics early.",
        impact: "High Impact",
        type: "Efficiency"
    }
];

export const MOCK_PLANNER_INSIGHTS = {
    weeklyWorkloadIndex: "Optimal (0.85)",
    predictedCompletionRate: "92%",
    suggestedBreakTime: "15 mins every 1.5 hours of study"
};
