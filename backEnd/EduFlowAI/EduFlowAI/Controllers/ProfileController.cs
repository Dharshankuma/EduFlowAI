using System.Security.Claims;
using EduFlowAI.Data;
using EduFlowAI.DTO.Profiles.Requests;
using EduFlowAI.Services.Profiles;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EduFlowAI.Exceptions;

namespace EduFlowAI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProfileController : BaseController
    {
        private readonly IProfileService _service;
        private readonly EduFlowDbContext _context;

        public ProfileController(IProfileService service, EduFlowDbContext context)
        {
            _service = service;
            _context = context;
        }

        [HttpGet]
        [Route("get-profile")]
        public async Task<IActionResult> GetProfile(CancellationToken cancellation)
        {
            var userId = await GetCurrentUserIdAsync(cancellation);
            var profile = await _service.GetProfileAsync(userId, cancellation);
            return Success(profile, "Profile retrieved successfully");
        }

        [HttpPut]
        [Route("personal-information")]
        public async Task<IActionResult> UpdatePersonalInformation(PersonalInformationRequestDTO dto, CancellationToken cancellation)
        {
            var userId = await GetCurrentUserIdAsync(cancellation);
            await _service.UpdatePersonalInformationAsync(userId, dto, cancellation);
            return NoContentResponse("Personal information updated successfully");
        }

        [HttpPut]
        [Route("weekly-availability")]
        public async Task<IActionResult> UpdateWeeklyAvailability(WeeklyAvailabilityRequestDTO dto, CancellationToken cancellation)
        {
            var userId = await GetCurrentUserIdAsync(cancellation);
            await _service.UpdateWeekAvailability(userId, dto, cancellation);
            return NoContentResponse("Weekly availability updated successfully");
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
