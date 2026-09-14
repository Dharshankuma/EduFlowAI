using System;

namespace EduFlowAI.PlannerEngine.Models
{
    public sealed class TaskPlanModel
    {
        public int TaskId { get; set; }

        public string TaskIdentifier { get; set; } = string.Empty;

        public string TaskName { get; set; } = string.Empty;

        public DateTime DueDate { get; set; }

        public decimal EstimatedHours { get; set; }

        public decimal RemainingHours { get; set; }

        public int? PriorityTypeId { get; set; }

        public int? StatusId { get; set; }

        public int GoalId { get; set; }

        public string? GoalPriority { get; set; }
    }
}
