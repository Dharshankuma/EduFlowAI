namespace EduFlowAI.Repositories.Dashboard.Models
{
    public sealed class DashboardSnapshotQueryModel
    {
        public string UserName { get; set; } = string.Empty;
        public int ActiveGoals { get; set; }
        public int CompletedTasksToday { get; set; }
        public List<DashboardScheduleQueryModel> TodaySchedules { get; set; } = new();
        public List<DashboardScheduleQueryModel> YesterdaySchedules { get; set; } = new();
        public List<DashboardScheduleQueryModel> UpcomingSchedules { get; set; } = new();
        public List<DashboardGoalQueryModel> Goals { get; set; } = new();
        public List<DashboardActivityQueryModel> Activities { get; set; } = new();
        public List<DateTime> CompletedStudyDays { get; set; } = new();
        public List<DateTime> DaysWithSessions { get; set; } = new();
    }

    public sealed class DashboardScheduleQueryModel
    {
        public int ScheduleId { get; set; }
        public string TaskName { get; set; } = string.Empty;
        public string? TaskDescription { get; set; }
        public string GoalTitle { get; set; } = string.Empty;
        public DateTime Start { get; set; }
        public decimal PlannedHours { get; set; }
        public string? Priority { get; set; }
        public string? Status { get; set; }
    }

    public sealed class DashboardGoalQueryModel
    {
        public int GoalId { get; set; }
        public string GoalIdentifier { get; set; } = string.Empty;
        public string GoalTitle { get; set; } = string.Empty;
        public string GoalType { get; set; } = string.Empty;
        public DateTime TargetDate { get; set; }
        public int TotalTasks { get; set; }
        public int CompletedTasks { get; set; }
    }

    public sealed class DashboardActivityQueryModel
    {
        public int ActivityId { get; set; }
        public string Message { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
