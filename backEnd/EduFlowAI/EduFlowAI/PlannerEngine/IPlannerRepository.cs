using EduFlowAI.Models;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace EduFlowAI.PlannerEngine
{
    public interface IPlannerRepository
    {
        Task<List<Useravailability>> GetWeekAvailabilityAsync(int userId, CancellationToken cancellation);

        Task<List<Goalmanagement>> GetActiveGoalsWithTasksAsync(int userId, CancellationToken cancellation);

        Task<List<Schedulemanagement>> GetFutureSchedulesAsync(int userId, DateTime fromDate, CancellationToken cancellation);

        Task SaveSchedulesAsync(List<Schedulemanagement> schedules, CancellationToken cancellation);

        Task<Dictionary<int, decimal>> GetCompletedHoursForTasksAsync(IEnumerable<int> taskIds, CancellationToken cancellation);

        Task<int?> GetStatusIdByNameAsync(string statusName, CancellationToken cancellation);

        Task CancelFuturePlannedSchedulesForGoalAsync(int goalId, int userId, CancellationToken cancellation);

        Task UpdateScheduleStatusAsync(int scheduleId, int statusId, int updatedBy, CancellationToken cancellation);
    }
}
