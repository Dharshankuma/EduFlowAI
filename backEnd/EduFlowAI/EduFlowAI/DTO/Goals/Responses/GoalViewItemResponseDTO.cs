namespace EduFlowAI.DTO.Goals.Responses
{
    public class GoalViewItemResponseDTO
    {
        public string TaskIdentifier { get; set; } = string.Empty;
        public string TaskName { get; set; } = string.Empty;
        public string TaskDescription { get; set; } = string.Empty;
        public string TaskStatus { get; set; } = string.Empty;
        public string TaskStatusIdentifier { get; set; } = string.Empty;
        public decimal? TaskEstimatedHours { get; set; }
        public string TaskDueDate { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
    }
}
