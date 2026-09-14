using System.Security.Claims;
using EduFlowAI.Services.Schedules;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EduFlowAI.Exceptions;

namespace EduFlowAI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ScheduleController : BaseController
    {
        private readonly IScheduleService _service;
        private readonly EduFlowAI.Data.EduFlowDbContext _context;

        public ScheduleController(IScheduleService service, EduFlowAI.Data.EduFlowDbContext context)
        {
            _service = service;
            _context = context;
        }

        [HttpPut]
        [Route("status/{scheduleId}")]
        public async Task<IActionResult> UpdateStatus(int scheduleId, [FromQuery] string status, CancellationToken cancellation)
        {
            var userId = await GetCurrentUserIdAsync(cancellation);
            await _service.UpdateScheduleStatusAsync(userId, scheduleId, status, cancellation);
            return NoContentResponse("Schedule status updated successfully");
        }

        private async Task<int> GetCurrentUserIdAsync(CancellationToken cancellation)
        {
            var identifier = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrWhiteSpace(identifier))
            {
                throw new UnauthorizedException("Invalid or missing user identifier in token.");
            }

            var user = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Useridentifier == identifier, cancellation);

            if (user == null)
            {
                throw new UnauthorizedException("User not found.");
            }

            return user.Userid;
        }
    }
}
