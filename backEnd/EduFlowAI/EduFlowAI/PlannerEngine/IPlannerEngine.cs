using EduFlowAI.Enums.PlannerEngine;
using EduFlowAI.PlannerEngine.Models;
using System.Threading;
using System.Threading.Tasks;

namespace EduFlowAI.PlannerEngine
{
    public interface IPlannerEngine
    {
        // Existing global planner run
        Task<PlannerResult> RunPlannerAsync(int userId, PlannerEngineType trigger, CancellationToken cancellation);

        // Scoped planner run for a specific goal (nullable task/goal context allowed)
        Task<PlannerResult> RunPlannerForGoalAsync(int userId, int goalId, PlannerEngineType trigger, CancellationToken cancellation);
    }
}
