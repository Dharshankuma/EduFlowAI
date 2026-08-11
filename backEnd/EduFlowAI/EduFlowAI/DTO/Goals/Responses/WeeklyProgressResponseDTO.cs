namespace EduFlowAI.DTO.Goals.Responses
{
    public class WeeklyProgressResponseDTO
    {
        public string Day { get; set; } = string.Empty;

        public decimal PlannedHours { get; set; }

        public decimal CompletedHours { get; set; }
    }
}
