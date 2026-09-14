using System.Security.Claims;
using EduFlowAI.Exceptions;
using EduFlowAI.PlannerEngine;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EduFlowAI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PlannerController : BaseController
    {
        private readonly IPlannerEngine _planner;
        private readonly EduFlowAI.Data.EduFlowDbContext _context;

        public PlannerController(IPlannerEngine planner, EduFlowAI.Data.EduFlowDbContext context)
        {
            _planner = planner;
            _context = context;
        }

        [HttpPost]
        [Route("generate")]
        public async Task<IActionResult> GenerateSchedule(CancellationToken cancellation)
        {
            var userId = await GetCurrentUserIdAsync(cancellation);
            var result = await _planner.RunPlannerAsync(userId, EduFlowAI.Enums.PlannerEngine.PlannerEngineType.AvailabilityUpdated, cancellation);
            return Success(result, "Planner executed");
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
