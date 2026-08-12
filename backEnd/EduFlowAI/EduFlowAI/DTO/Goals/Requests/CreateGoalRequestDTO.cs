namespace EduFlowAI.DTO.Goals.Requests
{
    public sealed class CreateGoalRequestDTO
    {
        public string GoalTitle { get; set; } = string.Empty;

        public string? GoalDescription { get; set; }

        public int GoalTypeId { get; set; }

        public int PriorityId { get; set; }

        public DateTime TargetDate { get; set; }
    }
}
