namespace EduFlowAI.DTO.Goals.Responses
{
    public class GoalsGridResponseDTO
    {
        public int TotalGoals { get; set; }
        public int ActiveGoals { get; set; }
        public int CompletedGoals { get; set; }
        public int UrgentGoals { get; set; }
        public List<GoalsGridItemResponseDTO> Goals { get; set; } = new List<GoalsGridItemResponseDTO>();
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public int TotalRecords { get; set; }
    }
}
