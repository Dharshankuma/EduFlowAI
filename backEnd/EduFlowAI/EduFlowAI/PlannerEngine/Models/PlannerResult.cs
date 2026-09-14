using System.Collections.Generic;

namespace EduFlowAI.PlannerEngine.Models
{
    public sealed class PlannerResult
    {
        public string Message { get; set; } = string.Empty;

        public List<ScheduleDraft> CreatedSchedules { get; set; } = new List<ScheduleDraft>();

        public List<string> Warnings { get; set; } = new List<string>();
    }
}
