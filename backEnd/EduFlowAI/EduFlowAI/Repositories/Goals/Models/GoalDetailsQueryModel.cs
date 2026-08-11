namespace EduFlowAI.Repositories.Goals.Models
{
    public sealed class GoalDetailsQueryModel
    {
        public int GoalId { get; set; }

        public string GoalIdentifier { get; set; } = string.Empty;

        public string GoalTitle { get; set; } = string.Empty;

        public string? GoalDescription { get; set; }

        public string GoalType { get; set; } = string.Empty;

        public string Priority { get; set; } = string.Empty;

        public string Status { get; set; } = string.Empty;

        public DateTime TargetDate { get; set; }

        public int TotalTasks { get; set; }

        public int CompletedTasks { get; set; }

        public decimal TotalStudyHours { get; set; }

        public decimal CompletedStudyHours { get; set; }

        public DateTime? NextSession { get; set; }
    }
}
