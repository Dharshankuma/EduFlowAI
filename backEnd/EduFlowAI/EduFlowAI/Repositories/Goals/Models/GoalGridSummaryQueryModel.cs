namespace EduFlowAI.Repositories.Goals.Models
{
    public sealed class GoalGridSummaryQueryModel
    {
        public int TotalGoals { get; set; }

        public int ActiveGoals { get; set; }

        public int CompletedGoals { get; set; }
    }
}