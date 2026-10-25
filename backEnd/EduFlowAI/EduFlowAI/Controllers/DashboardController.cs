using System.Security.Claims;
using EduFlowAI.Data;
using EduFlowAI.Exceptions;
using EduFlowAI.Helpers;
using EduFlowAI.Services.Dashboard;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EduFlowAI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public sealed class DashboardController : BaseController
    {
        private readonly IDashboardService _service;
        private readonly EduFlowDbContext _context;

        public DashboardController(IDashboardService service, EduFlowDbContext context)
        {
            _service = service;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetDashboard([FromQuery] DateTime? date, CancellationToken cancellation)
        {
            var userId = await GetCurrentUserIdAsync(cancellation);
            var dashboard = await _service.GetDashboardAsync(userId, date ?? DateTimeHelper.GetDateTimeNow(), cancellation);
            return Success(dashboard, "Dashboard retrieved successfully");
        }

        private async Task<int> GetCurrentUserIdAsync(CancellationToken cancellation)
        {
            var identifier = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrWhiteSpace(identifier))
                throw new UnauthorizedException("Invalid or missing user identifier in token.");

            var user = await _context.Users.AsNoTracking()
                .FirstOrDefaultAsync(u => u.Useridentifier == identifier, cancellation);
            if (user == null)
                throw new UnauthorizedException("User not found.");

            return user.Userid;
        }
    }
}
