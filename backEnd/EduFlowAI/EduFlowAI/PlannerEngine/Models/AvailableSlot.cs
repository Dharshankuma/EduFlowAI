using System;

namespace EduFlowAI.PlannerEngine.Models
{
    public sealed class AvailableSlot
    {
        public DateTime Start { get; set; }

        public DateTime End { get; set; }

        public decimal DurationHours => (decimal)(End - Start).TotalHours;
    }
}
