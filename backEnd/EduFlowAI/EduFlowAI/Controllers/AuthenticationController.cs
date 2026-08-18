using EduFlowAI.DTO.Authentiation.Requests;
using EduFlowAI.DTO.Authentiation.Responses;
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

            Response.Cookies.Append("refresh-token", result.RefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.UtcNow.AddDays(7),
                Path = "/api/Authentication"
            });

            var response = new LoginResultDTO
            {
                Token = result.Token,
                UserData = result.UserData
            };

            return Success(response, "Login Successful");
        }

        [HttpPost]
        [Route("GoogleLogin")]
        public async Task<IActionResult> GoogleLoginAsync(GoogleLoginRequestDTO objdto, CancellationToken cancellation)
        {
            var result = await _service.GoogleLoginAsync(objdto, cancellation);
            return Success(result, "Login Successfull");
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
        public async Task<IActionResult> RefreshToken(CancellationToken cancellation)
        {
            if(!Request.Cookies.TryGetValue("refresh-token", out var refreshToken))
            {
                return Unauthorized(new
                {
                    message = "Refresh token not found"
                });
            }

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
