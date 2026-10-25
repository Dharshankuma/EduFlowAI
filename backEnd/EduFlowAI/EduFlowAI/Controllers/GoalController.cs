using System.Security.Claims;
using EduFlowAI.Services.Goals;
using EduFlowAI.DTO.Goals.Requests;
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
        [Route("grid")]
        public async Task<IActionResult> GetGoalsGrid([FromBody] GoalsGridRequestDTO dto, CancellationToken cancellation)
        {
            var userId = await GetCurrentUserIdAsync(cancellation);
            var goals = await _service.GetGoalsGridDataAsync(userId, dto, cancellation);
            return Success(goals, "Goals retrieved successfully");
        }

        [HttpPost]
        [Route("create-goal")]
        public async Task<IActionResult> CreateGoal([FromBody] CreateGoalRequestDTO dto, CancellationToken cancellation)
        {
            var userId = await GetCurrentUserIdAsync(cancellation);
            var goal = await _service.CreateGoalAsync(userId, dto, cancellation);
            return CreatedResponse(goal, "Goal created successfully");
        }

        [HttpPost]
        [Route("create-with-tasks")]
        public async Task<IActionResult> CreateGoalWithTasks([FromBody] CreateGoalWithTasksRequestDTO dto, CancellationToken cancellation)
        {
            var userId = await GetCurrentUserIdAsync(cancellation);
            var goal = await _service.CreateGoalWithTasksAsync(userId, dto, cancellation);
            return CreatedResponse(goal, "Goal and tasks created successfully");
        }

        [HttpPut]
        [Route("{goalIdentifier}/tasks")]
        public async Task<IActionResult> SaveGoalTasks(string goalIdentifier, [FromBody] SaveGoalTasksRequestDTO dto, CancellationToken cancellation)
        {
            var userId = await GetCurrentUserIdAsync(cancellation);
            var tasks = await _service.SaveGoalTasksAsync(userId, goalIdentifier, dto, cancellation);
            return Success(tasks, "Goal tasks saved successfully");
        }

        [HttpPost]
        [Route("{goalIdentifier}/getGoalDetails")]
        public async Task<IActionResult> GetParticularGoalDetails(string goalIdentifier,CancellationToken cancellation)
        {
            var userid = await GetCurrentUserIdAsync(cancellation);
            var data = await _service.GetParticularGoalAsync(userid, goalIdentifier, cancellation);
            return Success(data, "Goals Details Fetched succesfully");
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
