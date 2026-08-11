namespace EduFlowAI.Repositories.Goals.Models
{
    public class GoalTaskQueryModel
    {
        public string TaskIdentifier { get; set; } = string.Empty;
        public string TaskName { get; set;  } = string.Empty;
        public string TaskDescription { get; set; } = string.Empty;
        public decimal? EstimatedHours { get; set; }
        public DateTime? DueDate { get; set; }
        public string? Status { get; set; }
        public string? StatusIdentifier { get; set; }
        public string? Priority { get; set; }
        public string? PrioritIdentifer { get; set; }
    }
}
