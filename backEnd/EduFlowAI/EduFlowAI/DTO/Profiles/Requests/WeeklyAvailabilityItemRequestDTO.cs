using EduFlowAI.Enums;

namespace EduFlowAI.DTO.Profiles.Requests
{
    public sealed class WeeklyAvailabilityItemRequestDTO
    {
        public WeekDays DayOfWeek { get; set; } 

        public bool IsEnabled { get; set; }

        public TimeOnly? StartTime { get; set; }

        public TimeOnly? EndTime { get; set; }
    }
}
