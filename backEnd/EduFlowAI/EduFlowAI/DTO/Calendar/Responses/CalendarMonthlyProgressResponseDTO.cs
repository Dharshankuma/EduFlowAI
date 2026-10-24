namespace EduFlowAI.DTO.Calendar.Responses
{
    public sealed class CalendarMonthlyProgressResponseDTO
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public decimal TotalStudyHours { get; set; }
        public decimal CompletedHours { get; set; }
        public decimal UpcomingHours { get; set; }
        public int CompletedSessions { get; set; }
        public int UpcomingSessions { get; set; }
        public int MissedSessions { get; set; }
    }
}
