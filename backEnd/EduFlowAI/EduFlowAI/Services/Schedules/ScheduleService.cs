using EduFlowAI.PlannerEngine;
using EduFlowAI.PlannerEngine.Models;
using EduFlowAI.Services.Schedules;
using EduFlowAI.Helpers;

namespace EduFlowAI.Services.Schedules
{
    public class ScheduleService : IScheduleService
    {
        private readonly IPlannerRepository _plannerRepo;
        private readonly IPlannerEngine _plannerEngine;
        private readonly Microsoft.Extensions.Logging.ILogger<ScheduleService> _logger;

        public ScheduleService(IPlannerRepository plannerRepo, IPlannerEngine plannerEngine, Microsoft.Extensions.Logging.ILogger<ScheduleService> logger)
        {
            _plannerRepo = plannerRepo;
            _plannerEngine = plannerEngine;
            _logger = logger;
        }

        public async Task UpdateScheduleStatusAsync(int userId, int scheduleId, string newStatusIdentifier, CancellationToken cancellation)
        {
            // look up status id
            var statusId = await _plannerRepo.GetStatusIdByNameAsync(newStatusIdentifier, cancellation);
            if (!statusId.HasValue) return;

            await _plannerRepo.UpdateScheduleStatusAsync(scheduleId, statusId.Value, userId, cancellation);

            // If schedule marked as Missed, trigger replanning for the user
            if (string.Equals(newStatusIdentifier, "Missed", StringComparison.OrdinalIgnoreCase))
            {
                try
                {
                    await _plannerEngine.RunPlannerAsync(userId, EduFlowAI.Enums.PlannerEngine.PlannerEngineType.ScheduleMissed, cancellation);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Planner run failed during UpdateScheduleStatusAsync for user {UserId}, schedule {ScheduleId}", userId, scheduleId);
                }
            }
        }
    }
}
