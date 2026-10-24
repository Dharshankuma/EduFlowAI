using EduFlowAI.DTO.Calendar.Requests;
using EduFlowAI.DTO.Calendar.Responses;
using EduFlowAI.Exceptions;
using EduFlowAI.Helpers;
using EduFlowAI.Repositories.Calendar;
using EduFlowAI.Repositories.Calendar.Models;

namespace EduFlowAI.Services.Calendar
{
    public sealed class CalendarService : ICalendarService
    {
        private readonly ICalendarRepository _repository;

        public CalendarService(ICalendarRepository repository)
        {
            _repository = repository;
        }

        public async Task<CalendarEventsResponseDTO> GetEventsAsync(int userId, DateTime from, DateTime to, CancellationToken cancellation)
        {
            ValidateRange(from, to);

            var schedules = await _repository.GetEventsAsync(userId, from, to, cancellation);
            return new CalendarEventsResponseDTO
            {
                From = from,
                To = to,
                Events = schedules.Select(ToEventResponse).ToList()
            };
        }

        public async Task<CalendarTodaySummaryResponseDTO> GetTodaySummaryAsync(int userId, DateTime date, CancellationToken cancellation)
        {
            var dayStart = date.Date;
            var events = await _repository.GetEventsAsync(userId, dayStart, dayStart.AddDays(1), cancellation);

            var completedEvents = events.Where(e => IsStatus(e.Status, "Completed")).ToList();
            var missedEvents = events.Where(e => IsStatus(e.Status, "Missed")).ToList();
            var plannedHours = events.Sum(e => e.PlannedHours);
            var completedHours = completedEvents.Sum(e => e.PlannedHours);

            return new CalendarTodaySummaryResponseDTO
            {
                Date = dayStart,
                PlannedHours = plannedHours,
                CompletedHours = completedHours,
                RemainingHours = Math.Max(0, plannedHours - completedHours),
                TotalSessions = events.Count,
                CompletedSessions = completedEvents.Count,
                MissedSessions = missedEvents.Count,
                StudyGoalReachedPercentage = plannedHours == 0
                    ? 0
                    : Math.Round(completedHours / plannedHours * 100, 2),
                // The application does not yet persist focus or concentration measurements.
                ConcentrationScore = null
            };
        }

        public async Task<CalendarMonthlyProgressResponseDTO> GetMonthlyProgressAsync(int userId, int year, int month, CancellationToken cancellation)
        {
            if (year is < 2000 or > 2100)
                throw new BadRequestException("Year must be between 2000 and 2100.");

            if (month is < 1 or > 12)
                throw new BadRequestException("Month must be between 1 and 12.");

            var from = new DateTime(year, month, 1);
            var to = from.AddMonths(1);
            var now = DateTimeHelper.GetDateTimeNow();
            var events = await _repository.GetEventsAsync(userId, from, to, cancellation);

            var completedEvents = events.Where(e => IsStatus(e.Status, "Completed")).ToList();
            var missedEvents = events.Where(e => IsStatus(e.Status, "Missed")).ToList();
            var upcomingEvents = events.Where(e => IsStatus(e.Status, "Planned") && e.Start >= now).ToList();

            return new CalendarMonthlyProgressResponseDTO
            {
                Year = year,
                Month = month,
                TotalStudyHours = completedEvents.Sum(e => e.PlannedHours),
                CompletedHours = completedEvents.Sum(e => e.PlannedHours),
                UpcomingHours = upcomingEvents.Sum(e => e.PlannedHours),
                CompletedSessions = completedEvents.Count,
                UpcomingSessions = upcomingEvents.Count,
                MissedSessions = missedEvents.Count
            };
        }

        public async Task<CalendarEventResponseDTO> RescheduleAsync(int userId, int scheduleId, RescheduleCalendarEventRequestDTO request, CancellationToken cancellation)
        {
            if (request == null || request.ScheduledDate == default)
                throw new BadRequestException("A valid scheduled date and time is required.");

            var schedule = await _repository.GetScheduleForUserAsync(userId, scheduleId, cancellation);
            if (schedule == null)
                throw new NotFoundException("Calendar event not found.");

            var plannedStatusId = await _repository.GetStatusIdByNameAsync("Planned", cancellation);
            if (!plannedStatusId.HasValue || schedule.Statusid != plannedStatusId.Value)
                throw new BadRequestException("Only planned calendar events can be rescheduled.");

            var start = request.ScheduledDate;
            var end = start.AddHours((double)schedule.Plannedhours);
            if (start < DateTimeHelper.GetDateTimeNow())
                throw new BadRequestException("A calendar event cannot be rescheduled into the past.");

            var dayOfWeek = start.DayOfWeek == DayOfWeek.Sunday ? 7 : (int)start.DayOfWeek;
            var availability = await _repository.GetAvailabilityAsync(userId, dayOfWeek, cancellation);
            if (availability?.StartTime == null || availability.EndTime == null)
                throw new BadRequestException("The selected time is outside your enabled weekly availability.");

            var availabilityStart = start.Date.Add(availability.StartTime.Value.ToTimeSpan());
            var availabilityEnd = start.Date.Add(availability.EndTime.Value.ToTimeSpan());
            if (start < availabilityStart || end > availabilityEnd)
                throw new BadRequestException("The event must fit inside your weekly availability.");

            var cancelledStatusId = await _repository.GetStatusIdByNameAsync("Cancelled", cancellation);
            if (await _repository.HasScheduleConflictAsync(userId, scheduleId, start, end, cancelledStatusId, cancellation))
                throw new ConflictException("The selected time overlaps another calendar event.");

            schedule.Scheduleddate = start;
            schedule.Updatedat = DateTimeHelper.GetDateTimeNow();
            schedule.Updatedby = userId;
            await _repository.SaveChangesAsync(cancellation);

            var eventResult = await _repository.GetEventsAsync(userId, start.Date, start.Date.AddDays(1), cancellation);
            var rescheduledEvent = eventResult.FirstOrDefault(e => e.ScheduleId == scheduleId);
            if (rescheduledEvent == null)
                throw new NotFoundException("Rescheduled calendar event could not be loaded.");

            return ToEventResponse(rescheduledEvent);
        }

        private static void ValidateRange(DateTime from, DateTime to)
        {
            if (from == default || to == default || from >= to)
                throw new BadRequestException("'from' must be earlier than 'to'.");

            if ((to - from).TotalDays > 93)
                throw new BadRequestException("Calendar ranges cannot exceed 93 days.");
        }

        private static bool IsStatus(string? status, string expected) =>
            string.Equals(status, expected, StringComparison.OrdinalIgnoreCase);

        private static CalendarEventResponseDTO ToEventResponse(CalendarScheduleQueryModel schedule)
        {
            return new CalendarEventResponseDTO
            {
                ScheduleId = schedule.ScheduleId,
                ScheduleIdentifier = schedule.ScheduleIdentifier,
                TaskId = schedule.TaskId,
                GoalId = schedule.GoalId,
                Title = schedule.TaskTitle,
                Description = schedule.TaskDescription,
                GoalTitle = schedule.GoalTitle,
                Priority = schedule.Priority,
                Status = schedule.Status,
                Start = schedule.Start,
                End = schedule.Start.AddHours((double)schedule.PlannedHours),
                PlannedHours = schedule.PlannedHours
            };
        }
    }
}
