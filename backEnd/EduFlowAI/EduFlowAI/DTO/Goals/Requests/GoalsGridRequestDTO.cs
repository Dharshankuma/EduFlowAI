namespace EduFlowAI.DTO.Goals.Requests
{
    public sealed class GoalsGridRequestDTO
    {
        public string GoalSearch { get; set; } = string.Empty;
        public int? StatusId { get; set; }
        public int? GoalType { get; set; }
        public int? PriorityId { get; set; }
        public string SortBy { get; set; } = "Newest";
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }
}
