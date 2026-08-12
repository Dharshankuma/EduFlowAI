namespace EduFlowAI.DTO.Goals.Requests
{
    public sealed class SaveTaskRequestDTO
    {
        public string? TaskIdentifier { get; set; }

        public string TaskName { get; set; } = string.Empty;

        public string? Description { get; set; }

        public decimal EstimatedHours { get; set; }

        public DateTime DueDate { get; set; }

        public int PriorityId { get; set; }

        public int? StatusId { get; set; }
    }
}
