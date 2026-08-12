namespace EduFlowAI.DTO.Goals.Responses
{
    public sealed class SavedGoalTaskResponseDTO
    {
        public int TaskId { get; set; }

        public string TaskIdentifier { get; set; } = string.Empty;

        public string TaskName { get; set; } = string.Empty;
    }
}
