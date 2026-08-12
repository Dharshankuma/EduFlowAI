namespace EduFlowAI.DTO.Goals.Requests
{
    public sealed class SaveGoalTasksRequestDTO
    {
        public List<SaveTaskRequestDTO> Tasks { get; set; } = [];
    }
}
