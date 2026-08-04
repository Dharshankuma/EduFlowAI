namespace EduFlowAI.DTO.Profiles.Responses
{
    public class ProfileSummaryResponseDTO
    {
        public decimal TotalStudyHours { get; set; } = 0;
        public int TotalCompletedTasks { get; set; } = 0;
        public int TotalActiveGoals { get; set; } = 0;
        public int TotalStudyStreak { get; set; } = 0;
        public decimal TotalWeeklyHours { get; set; } = 0; 
        public int TotalActiveStudyDays { get; set; } = 0;
        public decimal AverageDailyStudy { get; set;  } = 0;
    }
}
