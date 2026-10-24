using EduFlowAI.DTO.Calendar.Requests;
using EduFlowAI.DTO.Calendar.Responses;

namespace EduFlowAI.Services.Calendar
{
    public interface ICalendarService
    {
        Task<CalendarEventsResponseDTO> GetEventsAsync(int userId, DateTime from, DateTime to, CancellationToken cancellation);
        Task<CalendarTodaySummaryResponseDTO> GetTodaySummaryAsync(int userId, DateTime date, CancellationToken cancellation);
        Task<CalendarMonthlyProgressResponseDTO> GetMonthlyProgressAsync(int userId, int year, int month, CancellationToken cancellation);
        Task<CalendarEventResponseDTO> RescheduleAsync(int userId, int scheduleId, RescheduleCalendarEventRequestDTO request, CancellationToken cancellation);
    }
}
