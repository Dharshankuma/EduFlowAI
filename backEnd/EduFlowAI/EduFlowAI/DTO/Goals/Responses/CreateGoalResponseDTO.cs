namespace EduFlowAI.DTO.Goals.Responses
{
    public sealed class CreateGoalResponseDTO
    {
        public int GoalId { get; set; }

        public string GoalIdentifier { get; set; } = string.Empty;

        public string GoalTitle { get; set; } = string.Empty;
    }
}
