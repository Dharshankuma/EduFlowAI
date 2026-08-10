using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;

namespace EduFlowAI.DTO.Goals.Responses
{
    public class GoalsGridItemResponseDTO
    {
        public string GoalIdentifier { get; set; } = string.Empty;
        public string GoalType { get; set; } = string.Empty;
        public string GoalName { get; set; } = string.Empty;
        public string GoalPriority { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public int TotalTasks { get; set; }
        public int CompletedTasks { get; set; }
        public int RemainingTask { get; set; }
        public string GoalDeadline { get; set; } = string.Empty;
        public string ProgressPercentage { get; set; } = string.Empty;
        public string NextSession { get; set; } = string.Empty;
    }
}
