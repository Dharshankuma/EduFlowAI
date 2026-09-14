using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EduFlowAI.Data;
using EduFlowAI.Models;
using Microsoft.EntityFrameworkCore;
using EduFlowAI.Helpers;

namespace EduFlowAI.PlannerEngine
{
    public sealed class PlannerRepository : IPlannerRepository
    {
        private readonly EduFlowDbContext _context;

        public PlannerRepository(EduFlowDbContext context)
        {
            _context = context;
        }

        public async Task<List<Useravailability>> GetWeekAvailabilityAsync(int userId, CancellationToken cancellation)
        {
            return await _context.Useravailabilities.AsNoTracking()
                .Where(x => x.Userid == userId && x.Isenable)
                .OrderBy(x => x.DayOfWeek)
                .ToListAsync(cancellation);
        }

        public async Task<List<Goalmanagement>> GetActiveGoalsWithTasksAsync(int userId, CancellationToken cancellation)
        {
            // Treat goals with Statusid != Completed as active
            var completedStatus = await GetStatusIdByNameAsync("Completed", cancellation);

            return await _context.Goalmanagements.AsNoTracking()
                .Where(g => g.Userid == userId && (!completedStatus.HasValue || g.Statusid != completedStatus.Value))
                .Include(g => g.Taskmanagements)
                .Include(g => g.Prioritytype)
                .ToListAsync(cancellation);
        }

        public async Task<List<Schedulemanagement>> GetFutureSchedulesAsync(int userId, DateTime fromDate, CancellationToken cancellation)
        {
            // Only treat schedules that occupy planner time: exclude Cancelled and other non-occupying statuses
            var cancelledStatus = await GetStatusIdByNameAsync("Cancelled", cancellation);

            return await _context.Schedulemanagements.AsNoTracking()
                .Where(s => s.Createdby == userId && s.Scheduleddate >= fromDate && (!cancelledStatus.HasValue || s.Statusid != cancelledStatus.Value))
                .ToListAsync(cancellation);
        }

        public async Task<Dictionary<int, decimal>> GetCompletedHoursForTasksAsync(IEnumerable<int> taskIds, CancellationToken cancellation)
        {
            var ids = taskIds.ToList();
            if (!ids.Any()) return new Dictionary<int, decimal>();

            var completedStatus = await GetStatusIdByNameAsync("Completed", cancellation);
            if (!completedStatus.HasValue) return new Dictionary<int, decimal>();

            var completed = await _context.Schedulemanagements.AsNoTracking()
                .Where(s => ids.Contains(s.Taskid) && s.Statusid == completedStatus.Value)
                .GroupBy(s => s.Taskid)
                .Select(g => new { TaskId = g.Key, Hours = g.Sum(x => x.Plannedhours) })
                .ToListAsync(cancellation);

            return completed.ToDictionary(x => x.TaskId, x => x.Hours);
        }

        public async Task<int?> GetStatusIdByNameAsync(string statusName, CancellationToken cancellation)
        {
            if (string.IsNullOrWhiteSpace(statusName)) return null;

            var status = await _context.Statusmasters.AsNoTracking()
                .FirstOrDefaultAsync(s => s.Status.Equals(statusName, StringComparison.OrdinalIgnoreCase) || s.Statusidentifier.Equals(statusName, StringComparison.OrdinalIgnoreCase), cancellation);

            return status?.Statusid;
        }

        public async Task SaveSchedulesAsync(List<Schedulemanagement> schedules, CancellationToken cancellation)
        {
            if (schedules == null || schedules.Count == 0) return;

            // Avoid duplicates: do not add schedules that already exist for same Taskid and Scheduleddate
            var toAdd = new List<Schedulemanagement>();
            foreach (var s in schedules)
            {
                // Normalize comparison to minute precision and only consider Planned schedules to avoid false duplicates
                var plannedStatus = await GetStatusIdByNameAsync("Planned", cancellation);
                DateTime incomingStart = s.Scheduleddate;
                incomingStart = new DateTime(incomingStart.Year, incomingStart.Month, incomingStart.Day, incomingStart.Hour, incomingStart.Minute, 0, DateTimeKind.Utc);
                var incomingEnd = incomingStart.AddHours((double)s.Plannedhours);

                var exists = await _context.Schedulemanagements.AsNoTracking()
                    .AnyAsync(x => x.Taskid == s.Taskid
                                   && (plannedStatus == null || x.Statusid == plannedStatus.Value)
                                   && (
                                        // overlapping interval check
                                        (x.Scheduleddate < incomingEnd && x.Scheduleddate.AddHours((double)x.Plannedhours) > incomingStart)
                                      ), cancellation);

                if (!exists) toAdd.Add(s);
            }

            if (toAdd.Count == 0) return;

            await _context.Schedulemanagements.AddRangeAsync(toAdd, cancellation);
            await _context.SaveChangesAsync(cancellation);
        }

        public async Task CancelFuturePlannedSchedulesForGoalAsync(int goalId, int userId, CancellationToken cancellation)
        {
            var plannedStatus = await GetStatusIdByNameAsync("Planned", cancellation);
            var cancelledStatus = await GetStatusIdByNameAsync("Cancelled", cancellation);

            if (!plannedStatus.HasValue || !cancelledStatus.HasValue) return;

            var now = DateTimeHelper.GetDateTimeNow();

            var futurePlanned = await _context.Schedulemanagements
                .Where(s => s.Goalid == goalId && s.Statusid == plannedStatus && s.Scheduleddate >= now)
                .ToListAsync(cancellation);

            if (!futurePlanned.Any()) return;

            foreach (var s in futurePlanned)
            {
                s.Statusid = cancelledStatus;
                s.Updatedat = now;
                s.Updatedby = userId;
            }

            _context.Schedulemanagements.UpdateRange(futurePlanned);
            await _context.SaveChangesAsync(cancellation);
        }

        public async Task UpdateScheduleStatusAsync(int scheduleId, int statusId, int updatedBy, CancellationToken cancellation)
        {
            // ensure ownership: only creator can update their schedule
            var sched = await _context.Schedulemanagements.FirstOrDefaultAsync(s => s.Scheduleid == scheduleId && s.Createdby == updatedBy, cancellation);
            if (sched == null) return;

            // If changing to Missed, ensure current status is Planned
            var missedStatus = await GetStatusIdByNameAsync("Missed", cancellation);
            var plannedStatus = await GetStatusIdByNameAsync("Planned", cancellation);

            if (missedStatus.HasValue && statusId == missedStatus.Value)
            {
                if (!plannedStatus.HasValue || sched.Statusid != plannedStatus.Value)
                {
                    // do not allow non-planned -> missed transition
                    return;
                }
            }

            sched.Statusid = statusId;
            sched.Updatedat = DateTimeHelper.GetDateTimeNow();
            sched.Updatedby = updatedBy;

            _context.Schedulemanagements.Update(sched);
            await _context.SaveChangesAsync(cancellation);
        }
    }
}
