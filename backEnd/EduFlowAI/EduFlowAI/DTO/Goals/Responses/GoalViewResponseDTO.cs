namespace EduFlowAI.DTO.Goals.Responses
{
    public class GoalViewResponseDTO
    {
        public string GoalTitle { get; set; } = string.Empty;
        public string TargetDate { get; set; } = string.Empty;
        public string GoalDescription { get; set;  } = string.Empty;
        public string GoalType { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public GoalStatisticsResponseDTO Statistics { get; set; } = new();
        public decimal? ProgressPercentage { get; set; }
        public List<GoalViewItemResponseDTO> TaskItems { get; set; } = new List<GoalViewItemResponseDTO>();

    }    


    public class GoalStatisticsResponseDTO
    {
        public int CompletedTasks { get; set; }
        public int TotalTasks { get; set; }
        public decimal CompletedStudyHours { get; set; }
        public decimal TotalStudyHours { get; set; }
    }
}
