using EduFlowAI.PlannerEngine;
using EduFlowAI.PlannerEngine.Models;
using EduFlowAI.Services.Schedules;
using EduFlowAI.Helpers;
using EduFlowAI.Constants;

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

            // The frontend submits STATUSIDENTIFIER, so compare the resolved database IDs.
            var missedStatusId = await _plannerRepo.GetStatusIdByNameAsync(StatusConstants.Missed, cancellation);
            if (missedStatusId.HasValue && statusId.Value == missedStatusId.Value)
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
