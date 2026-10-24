namespace EduFlowAI.DTO.Calendar.Responses
{
    public sealed class CalendarTodaySummaryResponseDTO
    {
        public DateTime Date { get; set; }
        public decimal PlannedHours { get; set; }
        public decimal CompletedHours { get; set; }
        public decimal RemainingHours { get; set; }
        public int TotalSessions { get; set; }
        public int CompletedSessions { get; set; }
        public int MissedSessions { get; set; }
        public decimal StudyGoalReachedPercentage { get; set; }
        public int? ConcentrationScore { get; set; }
    }
}
