using EduFlowAI.Constants;
using EduFlowAI.Data;
using EduFlowAI.Helpers;
using EduFlowAI.Repositories.Dashboard.Models;
using Microsoft.EntityFrameworkCore;

namespace EduFlowAI.Repositories.Dashboard
{
    public sealed class DashboardRepository : IDashboardRepository
    {
        private readonly EduFlowDbContext _context;

        public DashboardRepository(EduFlowDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardSnapshotQueryModel> GetSnapshotAsync(int userId, DateTime date, CancellationToken cancellation)
        {
            var dayStart = date.Date;
            var dayEnd = dayStart.AddDays(1);
            var monthStart = new DateTime(dayStart.Year, dayStart.Month, 1);
            var monthEnd = monthStart.AddMonths(1);
            var now = DateTimeHelper.GetDateTimeNow();

            var userName = await _context.Users.AsNoTracking()
                .Where(u => u.Userid == userId)
                .Select(u => u.Username)
                .FirstOrDefaultAsync(cancellation) ?? string.Empty;

            var activeGoals = await _context.Goalmanagements.AsNoTracking()
                .CountAsync(g => g.Userid == userId && g.Status != null
                    && (g.Status.Status == StatusConstants.Active || g.Status.Status == StatusConstants.InProgress), cancellation);

            var completedTasksToday = await _context.Taskmanagements.AsNoTracking()
                .CountAsync(t => t.Goal.Userid == userId
                    && t.Status != null
                    && t.Status.Status == StatusConstants.Completed
                    && t.Updatedat.HasValue
                    && t.Updatedat.Value >= dayStart
                    && t.Updatedat.Value < dayEnd, cancellation);

            var todaySchedules = await GetSchedulesAsync(userId, dayStart, dayEnd, cancellation);
            var yesterdaySchedules = await GetSchedulesAsync(userId, dayStart.AddDays(-1), dayStart, cancellation);

            var upcomingSchedules = await _context.Schedulemanagements.AsNoTracking()
                .Where(s => s.Createdby == userId
                    && s.Scheduleddate >= now
                    && s.Status != null
                    && s.Status.Status == StatusConstants.Planned)
                .OrderBy(s => s.Scheduleddate)
                .Take(5)
                .Select(s => new DashboardScheduleQueryModel
                {
                    ScheduleId = s.Scheduleid,
                    TaskName = s.Task.Taskname,
                    TaskDescription = s.Task.Taskdescription,
                    GoalTitle = s.Goal.Goaltitle,
                    Start = s.Scheduleddate,
                    PlannedHours = s.Plannedhours,
                    Priority = s.Goal.Prioritytype.Priority,
                    Status = s.Status == null ? null : s.Status.Status
                })
                .ToListAsync(cancellation);

            var goals = await _context.Goalmanagements.AsNoTracking()
                .Where(g => g.Userid == userId && g.Status != null
                    && (g.Status.Status == StatusConstants.Active || g.Status.Status == StatusConstants.InProgress))
                .OrderBy(g => g.Targetdate)
                .Take(3)
                .Select(g => new DashboardGoalQueryModel
                {
                    GoalId = g.Goalid,
                    GoalIdentifier = g.Goalidentifier,
                    GoalTitle = g.Goaltitle,
                    GoalType = g.Goaltype.Goaltype,
                    TargetDate = g.Targetdate,
                    TotalTasks = g.Taskmanagements.Count(),
                    CompletedTasks = g.Taskmanagements.Count(t => t.Status != null && t.Status.Status == StatusConstants.Completed)
                })
                .ToListAsync(cancellation);

            var activities = await _context.Notifications.AsNoTracking()
                .Where(n => n.Createdby == userId)
                .OrderByDescending(n => n.Createdat)
                .Take(5)
                .Select(n => new DashboardActivityQueryModel
                {
                    ActivityId = n.Notificationid,
                    Message = n.Notification1,
                    CreatedAt = n.Createdat
                })
                .ToListAsync(cancellation);

            var completedStudyDays = await _context.Schedulemanagements.AsNoTracking()
                .Where(s => s.Createdby == userId && s.Status != null && s.Status.Status == StatusConstants.Completed)
                .Select(s => s.Scheduleddate.Date)
                .Distinct()
                .ToListAsync(cancellation);

            var daysWithSessions = await _context.Schedulemanagements.AsNoTracking()
                .Where(s => s.Createdby == userId
                    && s.Scheduleddate >= monthStart
                    && s.Scheduleddate < monthEnd
                    && (s.Status == null || s.Status.Status != StatusConstants.Cancelled))
                .Select(s => s.Scheduleddate.Date)
                .Distinct()
                .ToListAsync(cancellation);

            return new DashboardSnapshotQueryModel
            {
                UserName = userName,
                ActiveGoals = activeGoals,
                CompletedTasksToday = completedTasksToday,
                TodaySchedules = todaySchedules,
                YesterdaySchedules = yesterdaySchedules,
                UpcomingSchedules = upcomingSchedules,
                Goals = goals,
                Activities = activities,
                CompletedStudyDays = completedStudyDays,
                DaysWithSessions = daysWithSessions
            };
        }

        private Task<List<DashboardScheduleQueryModel>> GetSchedulesAsync(int userId, DateTime from, DateTime to, CancellationToken cancellation)
        {
            return _context.Schedulemanagements.AsNoTracking()
                .Where(s => s.Createdby == userId
                    && s.Scheduleddate >= from
                    && s.Scheduleddate < to
                    && (s.Status == null || s.Status.Status != StatusConstants.Cancelled))
                .OrderBy(s => s.Scheduleddate)
                .Select(s => new DashboardScheduleQueryModel
                {
                    ScheduleId = s.Scheduleid,
                    TaskName = s.Task.Taskname,
                    TaskDescription = s.Task.Taskdescription,
                    GoalTitle = s.Goal.Goaltitle,
                    Start = s.Scheduleddate,
                    PlannedHours = s.Plannedhours,
                    Priority = s.Goal.Prioritytype.Priority,
                    Status = s.Status == null ? null : s.Status.Status
                })
                .ToListAsync(cancellation);
        }
    }
}
