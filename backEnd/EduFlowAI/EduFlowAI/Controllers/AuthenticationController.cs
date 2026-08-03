using EduFlowAI.DTO.Authentiation.Requests;
using EduFlowAI.Services.Authentication;
using Microsoft.AspNetCore.Mvc;

namespace EduFlowAI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : BaseController
    {
        private readonly IAuthenticationService _service;

        public AuthenticationController(IAuthenticationService service)
        {
            _service = service;
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login(LoginRequestDTO objdto, CancellationToken cancellation)
        {
            var result = await _service.LoginAsync(objdto, cancellation);
            return Success(result, "Login Successful");
        }


        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register(RegisterRequestDTO objdto, CancellationToken cancellation)
        {
            await _service.RegisterUserAsync(objdto, cancellation);
            return NoContentResponse("Registration Successful. Please check your email for verification.");
        }

        [HttpPost]
        [Route("verify-email")]
        public async Task<IActionResult> VerifyEmail(string token, CancellationToken cancellation)
        {
            await _service.VerifyUserEmailAsync(token, cancellation);
            return NoContentResponse("Email verification successful.");
        }

        [HttpPost]
        [Route("refresh-token")]
        public async Task<IActionResult> RefreshToken(string refreshToken, CancellationToken cancellation)
        {
            var result = await _service.RefreshTokenAsync(refreshToken, cancellation);
            return Success(result, "Token refreshed successfully.");
        }

        [HttpPost]
        [Route("logout")]
        public async Task<IActionResult> Logout(string refreshToken, CancellationToken cancellation)
        {
            await _service.LogOutUser(refreshToken, cancellation);
            return NoContentResponse("Logout successful.");
        }


        [HttpPost]
        [Route("forget-password")]
        public async Task<IActionResult> ForgetPassword(string email, CancellationToken cancellation)
        {
            await _service.ForgetPasswordAsync(email, cancellation);
            return NoContentResponse("Password reset link sent to your email.");
        }

        [HttpPost]
        [Route("change-password")]
        public async Task<IActionResult> ChangePassword(ResetPasswordRequestDTO reset, CancellationToken cancellation)
        {
            await _service.ChangePasswordAsync(reset, cancellation);
            return NoContentResponse("Password changed successfully. Navigate to the login page to sign in.");
        }
    }

}
