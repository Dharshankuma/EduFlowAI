namespace EduFlowAI.DTO.Profiles.Responses
{
    public class WeeklyAvailabilityResponseDTO
    {
        public DayOfWeek DayOfWeek { get; set; } = DayOfWeek.Monday;
        public bool IsEnable { get; set; }
        public TimeOnly? StartTime { get; set; }
        public TimeOnly? EndTime { get; set; }  
        public decimal AvailableHours { get; set; }
    }
}
