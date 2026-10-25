namespace EduFlowAI.DTO.Goals.Responses
{
    public sealed class CreateGoalWithTasksResponseDTO
    {
        public int GoalId { get; set; }
        public string GoalIdentifier { get; set; } = string.Empty;
        public string GoalTitle { get; set; } = string.Empty;
        public List<SavedGoalTaskResponseDTO> Tasks { get; set; } = [];
    }
}
