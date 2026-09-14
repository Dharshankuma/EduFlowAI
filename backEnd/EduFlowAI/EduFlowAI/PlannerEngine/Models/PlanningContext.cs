using EduFlowAI.Models;
using System.Collections.Generic;

namespace EduFlowAI.PlannerEngine.Models
{
    public sealed class PlanningContext
    {
        public int UserId { get; set; }

        public PlannerOptions Options { get; set; } = new PlannerOptions();

        public List<Useravailability> Availability { get; set; } = new List<Useravailability>();

        public List<Goalmanagement> ActiveGoals { get; set; } = new List<Goalmanagement>();

        public List<Schedulemanagement> ExistingFutureSchedules { get; set; } = new List<Schedulemanagement>();
    }
}
