namespace EduFlowAI.DTO.Calendar.Responses
{
    public sealed class CalendarEventsResponseDTO
    {
        public DateTime From { get; set; }
        public DateTime To { get; set; }
        public List<CalendarEventResponseDTO> Events { get; set; } = new();
    }
}
