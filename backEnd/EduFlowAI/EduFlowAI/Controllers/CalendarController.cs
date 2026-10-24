using System.Security.Claims;
using EduFlowAI.Data;
using EduFlowAI.DTO.Calendar.Requests;
using EduFlowAI.Exceptions;
using EduFlowAI.Helpers;
using EduFlowAI.Services.Calendar;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EduFlowAI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public sealed class CalendarController : BaseController
    {
        private readonly ICalendarService _service;
        private readonly EduFlowDbContext _context;

        public CalendarController(ICalendarService service, EduFlowDbContext context)
        {
            _service = service;
            _context = context;
        }

        [HttpGet("events")]
        public async Task<IActionResult> GetEvents([FromQuery] DateTime from, [FromQuery] DateTime to, CancellationToken cancellation)
        {
            var userId = await GetCurrentUserIdAsync(cancellation);
            var events = await _service.GetEventsAsync(userId, from, to, cancellation);
            return Success(events, "Calendar events retrieved successfully");
        }

        [HttpGet("day")]
        public async Task<IActionResult> GetDay([FromQuery] DateTime date, CancellationToken cancellation)
        {
            var userId = await GetCurrentUserIdAsync(cancellation);
            var events = await _service.GetEventsAsync(userId, date.Date, date.Date.AddDays(1), cancellation);
            return Success(events, "Calendar day retrieved successfully");
        }

        [HttpGet("today-summary")]
        public async Task<IActionResult> GetTodaySummary([FromQuery] DateTime? date, CancellationToken cancellation)
        {
            var userId = await GetCurrentUserIdAsync(cancellation);
            var summary = await _service.GetTodaySummaryAsync(userId, date ?? DateTimeHelper.GetDateTimeNow(), cancellation);
            return Success(summary, "Calendar summary retrieved successfully");
        }

        [HttpGet("monthly-progress")]
        public async Task<IActionResult> GetMonthlyProgress([FromQuery] int year, [FromQuery] int month, CancellationToken cancellation)
        {
            var userId = await GetCurrentUserIdAsync(cancellation);
            var progress = await _service.GetMonthlyProgressAsync(userId, year, month, cancellation);
            return Success(progress, "Monthly progress retrieved successfully");
        }

        [HttpPut("events/{scheduleId:int}/reschedule")]
        public async Task<IActionResult> Reschedule(int scheduleId, [FromBody] RescheduleCalendarEventRequestDTO request, CancellationToken cancellation)
        {
            var userId = await GetCurrentUserIdAsync(cancellation);
            var calendarEvent = await _service.RescheduleAsync(userId, scheduleId, request, cancellation);
            return Success(calendarEvent, "Calendar event rescheduled successfully");
        }

        private async Task<int> GetCurrentUserIdAsync(CancellationToken cancellation)
        {
            var identifier = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrWhiteSpace(identifier))
                throw new UnauthorizedException("Invalid or missing user identifier in token.");

            var user = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Useridentifier == identifier, cancellation);

            if (user == null)
                throw new UnauthorizedException("User not found.");

            return user.Userid;
        }
    }
}
