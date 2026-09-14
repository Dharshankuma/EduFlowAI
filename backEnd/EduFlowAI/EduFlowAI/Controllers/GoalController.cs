using System.Security.Claims;
using EduFlowAI.Services.Goals;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EduFlowAI.Exceptions;

namespace EduFlowAI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class GoalController : BaseController
    {
        private readonly IGoalService _service;
        private readonly EduFlowAI.Data.EduFlowDbContext _context;

        public GoalController(IGoalService service, EduFlowAI.Data.EduFlowDbContext context)
        {
            _service = service;
            _context = context;
        }

        [HttpPost]
        [Route("{goalIdentifier}/complete")]
        public async Task<IActionResult> CompleteGoal(string goalIdentifier, CancellationToken cancellation)
        {
            var userId = await GetCurrentUserIdAsync(cancellation);
            await _service.CompleteGoalAsync(userId, goalIdentifier, cancellation);
            return NoContentResponse("Goal completed and planner re-run successfully");
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
