namespace EduFlowAI.DTO.Calendar.Responses
{
    public sealed class CalendarEventResponseDTO
    {
        public int ScheduleId { get; set; }
        public string ScheduleIdentifier { get; set; } = string.Empty;
        public int TaskId { get; set; }
        public int GoalId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string GoalTitle { get; set; } = string.Empty;
        public string? Priority { get; set; }
        public string? Status { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public decimal PlannedHours { get; set; }
    }
}
