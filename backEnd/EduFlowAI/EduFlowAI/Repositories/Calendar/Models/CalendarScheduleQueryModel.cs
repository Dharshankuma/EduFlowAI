namespace EduFlowAI.Repositories.Calendar.Models
{
    public sealed class CalendarScheduleQueryModel
    {
        public int ScheduleId { get; set; }
        public string ScheduleIdentifier { get; set; } = string.Empty;
        public int TaskId { get; set; }
        public int GoalId { get; set; }
        public string TaskTitle { get; set; } = string.Empty;
        public string? TaskDescription { get; set; }
        public string GoalTitle { get; set; } = string.Empty;
        public string? Priority { get; set; }
        public string? Status { get; set; }
        public DateTime Start { get; set; }
        public decimal PlannedHours { get; set; }
    }
}
