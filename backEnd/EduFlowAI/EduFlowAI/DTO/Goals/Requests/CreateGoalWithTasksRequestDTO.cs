namespace EduFlowAI.DTO.Goals.Requests
{
    public sealed class CreateGoalWithTasksRequestDTO
    {
        public string GoalTitle { get; set; } = string.Empty;
        public string? GoalDescription { get; set; }
        public string? GoalTypeIdentifier { get; set; }
        public int? GoalTypeId { get; set; }
        public string? PriorityIdentifier { get; set; }
        public int? PriorityId { get; set; }
        public DateTime TargetDate { get; set; }
        public List<CreateGoalTaskRequestDTO> Tasks { get; set; } = [];
    }

    public sealed class CreateGoalTaskRequestDTO
    {
        public string TaskName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal EstimatedHours { get; set; }
        public DateTime DueDate { get; set; }
        public string? StatusIdentifier { get; set; }
    }
}
