using EduFlowAI.Models;
using EduFlowAI.Repositories.Calendar.Models;

namespace EduFlowAI.Repositories.Calendar
{
    public interface ICalendarRepository
    {
        Task<List<CalendarScheduleQueryModel>> GetEventsAsync(int userId, DateTime from, DateTime to, CancellationToken cancellation);
        Task<Schedulemanagement?> GetScheduleForUserAsync(int userId, int scheduleId, CancellationToken cancellation);
        Task<int?> GetStatusIdByNameAsync(string statusName, CancellationToken cancellation);
        Task<Useravailability?> GetAvailabilityAsync(int userId, int dayOfWeek, CancellationToken cancellation);
        Task<bool> HasScheduleConflictAsync(int userId, int scheduleId, DateTime start, DateTime end, int? cancelledStatusId, CancellationToken cancellation);
        Task SaveChangesAsync(CancellationToken cancellation);
    }
}
