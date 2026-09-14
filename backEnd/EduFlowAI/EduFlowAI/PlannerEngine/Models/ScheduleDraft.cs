using System;

namespace EduFlowAI.PlannerEngine.Models
{
    public sealed class ScheduleDraft
    {
        public int TaskId { get; set; }

        public DateTime ScheduledDate { get; set; }

        public decimal PlannedHours { get; set; }
    }
}
