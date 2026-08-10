namespace EduFlowAI.Repositories.Goals.Models
{
    public sealed class GoalGridQueryModel
    {
        public int GoalId { get; set; }

        public string GoalIdentifier { get; set; } = string.Empty;

        public string GoalTitle { get; set; } = string.Empty;

        public string GoalType { get; set; } = string.Empty;

        public string Priority { get; set; } = string.Empty;

        public string Status { get; set; } = string.Empty;

        public DateTime TargetDate { get; set; }

        public DateTime CreatedAt { get; set; }

        public int TotalTasks { get; set; }

        public int CompletedTasks { get; set; }
        public int RemainingTasks { get; set; }

        public decimal ProgressPercentage { get; set; }

        public DateTime? NextSession { get; set; }
    }
}