namespace EduFlowAI.DTO.Dashboard.Responses
{
    public sealed class DashboardResponseDTO
    {
        public DateTime Date { get; set; }
        public string UserName { get; set; } = string.Empty;
        public DashboardStudyPlanResponseDTO StudyPlan { get; set; } = new();
        public DashboardMetricsResponseDTO Metrics { get; set; } = new();
        public List<DashboardScheduleItemResponseDTO> TodaySchedule { get; set; } = new();
        public List<DashboardGoalProgressResponseDTO> GoalProgress { get; set; } = new();
        public List<DashboardScheduleItemResponseDTO> UpcomingTasks { get; set; } = new();
        public List<DashboardActivityResponseDTO> RecentActivity { get; set; } = new();
        public DashboardMiniCalendarResponseDTO MiniCalendar { get; set; } = new();
        public DashboardFocusSessionResponseDTO FocusSession { get; set; } = new();
    }

    public sealed class DashboardStudyPlanResponseDTO
    {
        public int StudySessions { get; set; }
        public int PlannedMinutes { get; set; }
        public int ActiveGoals { get; set; }
        public int NextSessionMinutes { get; set; }
        public int StudyStreakDays { get; set; }
        public decimal ProgressTodayPercentage { get; set; }
        public List<DashboardRecommendationResponseDTO> Recommendations { get; set; } = new();
        public string Focus { get; set; } = string.Empty;
        public string QuickTip { get; set; } = string.Empty;
    }

    public sealed class DashboardRecommendationResponseDTO
    {
        public int ScheduleId { get; set; }
        public string TaskName { get; set; } = string.Empty;
        public string GoalTitle { get; set; } = string.Empty;
        public DateTime Start { get; set; }
        public int PlannedMinutes { get; set; }
        public string? Priority { get; set; }
    }

    public sealed class DashboardMetricsResponseDTO
    {
        public decimal StudyHoursToday { get; set; }
        public decimal StudyHoursChangePercentage { get; set; }
        public int CompletedTasksToday { get; set; }
        public int ActiveGoals { get; set; }
        public int StudyStreakDays { get; set; }
    }

    public sealed class DashboardScheduleItemResponseDTO
    {
        public int ScheduleId { get; set; }
        public string TaskName { get; set; } = string.Empty;
        public string? TaskDescription { get; set; }
        public string GoalTitle { get; set; } = string.Empty;
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public decimal PlannedHours { get; set; }
        public string? Priority { get; set; }
        public string? Status { get; set; }
    }

    public sealed class DashboardGoalProgressResponseDTO
    {
        public int GoalId { get; set; }
        public string GoalIdentifier { get; set; } = string.Empty;
        public string GoalTitle { get; set; } = string.Empty;
        public string GoalType { get; set; } = string.Empty;
        public decimal ProgressPercentage { get; set; }
        public string ProgressState { get; set; } = string.Empty;
        public DateTime TargetDate { get; set; }
    }

    public sealed class DashboardActivityResponseDTO
    {
        public int ActivityId { get; set; }
        public string Type { get; set; } = "Notification";
        public string Message { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public sealed class DashboardMiniCalendarResponseDTO
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public List<DateTime> DaysWithSessions { get; set; } = new();
    }

    public sealed class DashboardFocusSessionResponseDTO
    {
        public bool IsTrackingSupported { get; set; }
        public int DefaultDurationMinutes { get; set; }
        public string? ActiveTaskName { get; set; }
    }
}
