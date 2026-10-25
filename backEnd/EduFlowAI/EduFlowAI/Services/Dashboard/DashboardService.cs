using EduFlowAI.Constants;
using EduFlowAI.DTO.Dashboard.Responses;
using EduFlowAI.Repositories.Dashboard;
using EduFlowAI.Repositories.Dashboard.Models;

namespace EduFlowAI.Services.Dashboard
{
    public sealed class DashboardService : IDashboardService
    {
        private readonly IDashboardRepository _repository;

        public DashboardService(IDashboardRepository repository)
        {
            _repository = repository;
        }

        public async Task<DashboardResponseDTO> GetDashboardAsync(int userId, DateTime date, CancellationToken cancellation)
        {
            var selectedDate = date.Date;
            var snapshot = await _repository.GetSnapshotAsync(userId, selectedDate, cancellation);
            var completedSchedules = snapshot.TodaySchedules.Where(s => HasStatus(s.Status, StatusConstants.Completed)).ToList();
            var plannedSchedules = snapshot.TodaySchedules.Where(s => HasStatus(s.Status, StatusConstants.Planned)).ToList();
            var completedHours = completedSchedules.Sum(s => s.PlannedHours);
            var plannedHours = snapshot.TodaySchedules.Sum(s => s.PlannedHours);
            var yesterdayCompletedHours = snapshot.YesterdaySchedules
                .Where(s => HasStatus(s.Status, StatusConstants.Completed))
                .Sum(s => s.PlannedHours);
            var streak = CalculateStreak(snapshot.CompletedStudyDays, selectedDate);

            return new DashboardResponseDTO
            {
                Date = selectedDate,
                UserName = snapshot.UserName,
                StudyPlan = new DashboardStudyPlanResponseDTO
                {
                    StudySessions = snapshot.TodaySchedules.Count,
                    PlannedMinutes = ToMinutes(plannedHours),
                    ActiveGoals = snapshot.ActiveGoals,
                    NextSessionMinutes = plannedSchedules.Count == 0 ? 0 : ToMinutes(plannedSchedules[0].PlannedHours),
                    StudyStreakDays = streak,
                    ProgressTodayPercentage = plannedHours == 0 ? 0 : Math.Round(completedHours / plannedHours * 100, 2),
                    Recommendations = plannedSchedules.Take(4).Select(s => new DashboardRecommendationResponseDTO
                    {
                        ScheduleId = s.ScheduleId,
                        TaskName = s.TaskName,
                        GoalTitle = s.GoalTitle,
                        Start = s.Start,
                        PlannedMinutes = ToMinutes(s.PlannedHours),
                        Priority = s.Priority
                    }).ToList(),
                    Focus = BuildFocus(plannedSchedules, completedHours, plannedHours),
                    QuickTip = plannedSchedules.Count == 0
                        ? "Your study plan is clear. Review your goals or plan your next session."
                        : "Start with the earliest planned session and focus on one task at a time."
                },
                Metrics = new DashboardMetricsResponseDTO
                {
                    StudyHoursToday = completedHours,
                    StudyHoursChangePercentage = CalculateChangePercentage(completedHours, yesterdayCompletedHours),
                    CompletedTasksToday = snapshot.CompletedTasksToday,
                    ActiveGoals = snapshot.ActiveGoals,
                    StudyStreakDays = streak
                },
                TodaySchedule = snapshot.TodaySchedules.Select(ToScheduleResponse).ToList(),
                GoalProgress = snapshot.Goals.Select(g => ToGoalResponse(g, selectedDate)).ToList(),
                UpcomingTasks = snapshot.UpcomingSchedules.Select(ToScheduleResponse).ToList(),
                RecentActivity = snapshot.Activities.Select(a => new DashboardActivityResponseDTO
                {
                    ActivityId = a.ActivityId,
                    Type = "Notification",
                    Message = a.Message,
                    CreatedAt = a.CreatedAt
                }).ToList(),
                MiniCalendar = new DashboardMiniCalendarResponseDTO
                {
                    Year = selectedDate.Year,
                    Month = selectedDate.Month,
                    DaysWithSessions = snapshot.DaysWithSessions.OrderBy(d => d).ToList()
                },
                FocusSession = new DashboardFocusSessionResponseDTO
                {
                    // Focus sessions need their own persistence table; the UI timer can remain client-side for now.
                    IsTrackingSupported = false,
                    DefaultDurationMinutes = 25,
                    ActiveTaskName = null
                }
            };
        }

        private static DashboardScheduleItemResponseDTO ToScheduleResponse(DashboardScheduleQueryModel schedule) => new()
        {
            ScheduleId = schedule.ScheduleId,
            TaskName = schedule.TaskName,
            TaskDescription = schedule.TaskDescription,
            GoalTitle = schedule.GoalTitle,
            Start = schedule.Start,
            End = schedule.Start.AddHours((double)schedule.PlannedHours),
            PlannedHours = schedule.PlannedHours,
            Priority = schedule.Priority,
            Status = schedule.Status
        };

        private static DashboardGoalProgressResponseDTO ToGoalResponse(DashboardGoalQueryModel goal, DateTime date)
        {
            var progress = goal.TotalTasks == 0
                ? 0
                : Math.Round((decimal)goal.CompletedTasks / goal.TotalTasks * 100, 2);

            return new DashboardGoalProgressResponseDTO
            {
                GoalId = goal.GoalId,
                GoalIdentifier = goal.GoalIdentifier,
                GoalTitle = goal.GoalTitle,
                GoalType = goal.GoalType,
                ProgressPercentage = progress,
                ProgressState = goal.TargetDate.Date < date ? "At Risk" : progress >= 100 ? "Completed" : "On Track",
                TargetDate = goal.TargetDate
            };
        }

        private static int CalculateStreak(IEnumerable<DateTime> completedStudyDays, DateTime date)
        {
            var completedDates = completedStudyDays.Select(d => d.Date).ToHashSet();
            var cursor = date.Date;

            // A user who has not yet finished today's session retains yesterday's streak.
            if (!completedDates.Contains(cursor))
                cursor = cursor.AddDays(-1);

            var streak = 0;
            while (completedDates.Contains(cursor))
            {
                streak++;
                cursor = cursor.AddDays(-1);
            }

            return streak;
        }

        private static decimal CalculateChangePercentage(decimal current, decimal previous)
        {
            if (previous == 0) return current == 0 ? 0 : 100;
            return Math.Round((current - previous) / previous * 100, 2);
        }

        private static int ToMinutes(decimal hours) => (int)Math.Round(hours * 60, MidpointRounding.AwayFromZero);

        private static bool HasStatus(string? actual, string expected) =>
            string.Equals(actual, expected, StringComparison.OrdinalIgnoreCase);

        private static string BuildFocus(IReadOnlyCollection<DashboardScheduleQueryModel> plannedSchedules, decimal completedHours, decimal plannedHours)
        {
            if (plannedSchedules.Count == 0)
                return "No pending sessions remain for today.";

            if (completedHours > 0 && plannedHours > completedHours)
                return "Keep your momentum by completing the next planned session.";

            return "Begin with your earliest planned study session.";
        }
    }
}
