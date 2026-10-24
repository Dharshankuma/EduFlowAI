using EduFlowAI.Data;
using EduFlowAI.Models;
using EduFlowAI.Repositories.Calendar.Models;
using Microsoft.EntityFrameworkCore;

namespace EduFlowAI.Repositories.Calendar
{
    public sealed class CalendarRepository : ICalendarRepository
    {
        private readonly EduFlowDbContext _context;

        public CalendarRepository(EduFlowDbContext context)
        {
            _context = context;
        }

        public async Task<List<CalendarScheduleQueryModel>> GetEventsAsync(int userId, DateTime from, DateTime to, CancellationToken cancellation)
        {
            return await _context.Schedulemanagements
                .AsNoTracking()
                .Where(s => s.Createdby == userId
                    && s.Scheduleddate < to
                    && s.Scheduleddate.AddHours((double)s.Plannedhours) > from)
                .OrderBy(s => s.Scheduleddate)
                .Select(s => new CalendarScheduleQueryModel
                {
                    ScheduleId = s.Scheduleid,
                    ScheduleIdentifier = s.Scheduleidentifier,
                    TaskId = s.Taskid,
                    GoalId = s.Goalid,
                    TaskTitle = s.Task.Taskname,
                    TaskDescription = s.Task.Taskdescription,
                    GoalTitle = s.Goal.Goaltitle,
                    Priority = s.Goal.Prioritytype.Priority,
                    Status = s.Status == null ? null : s.Status.Status,
                    Start = s.Scheduleddate,
                    PlannedHours = s.Plannedhours
                })
                .ToListAsync(cancellation);
        }

        public Task<Schedulemanagement?> GetScheduleForUserAsync(int userId, int scheduleId, CancellationToken cancellation)
        {
            return _context.Schedulemanagements
                .FirstOrDefaultAsync(s => s.Scheduleid == scheduleId && s.Createdby == userId, cancellation);
        }

        public async Task<int?> GetStatusIdByNameAsync(string statusName, CancellationToken cancellation)
        {
            var status = await _context.Statusmasters
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Status == statusName || s.Statusidentifier == statusName, cancellation);

            return status?.Statusid;
        }

        public Task<Useravailability?> GetAvailabilityAsync(int userId, int dayOfWeek, CancellationToken cancellation)
        {
            return _context.Useravailabilities
                .AsNoTracking()
                .FirstOrDefaultAsync(a => a.Userid == userId && a.DayOfWeek == dayOfWeek && a.Isenable, cancellation);
        }

        public Task<bool> HasScheduleConflictAsync(int userId, int scheduleId, DateTime start, DateTime end, int? cancelledStatusId, CancellationToken cancellation)
        {
            return _context.Schedulemanagements
                .AsNoTracking()
                .AnyAsync(s => s.Createdby == userId
                    && s.Scheduleid != scheduleId
                    && (!cancelledStatusId.HasValue || s.Statusid != cancelledStatusId.Value)
                    && s.Scheduleddate < end
                    && s.Scheduleddate.AddHours((double)s.Plannedhours) > start, cancellation);
        }

        public Task SaveChangesAsync(CancellationToken cancellation)
        {
            return _context.SaveChangesAsync(cancellation);
        }
    }
}
