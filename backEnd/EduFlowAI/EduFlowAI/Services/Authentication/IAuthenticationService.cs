using EduFlowAI.DTO.Authentiation.Requests;
using EduFlowAI.DTO.Authentiation.Responses;

namespace EduFlowAI.Services.Authentication
{
    public interface IAuthenticationService
    {
        Task RegisterUserAsync(RegisterRequestDTO objdto, CancellationToken cancellation);
        Task VerifyUserEmailAsync(string token, CancellationToken cancellation);
        Task<LoginResponseDTO> LoginAsync(LoginRequestDTO objdto, CancellationToken cancellation);
        Task LogOutUser(string refreshToken, CancellationToken cancellation);
        Task<LoginResponseDTO> RefreshTokenAsync(string refreshToken, CancellationToken cancellation);
        Task ForgetPasswordAsync(string email, CancellationToken cancellation);
        Task ChangePasswordAsync(ResetPasswordRequestDTO reset, CancellationToken cancellation);

    }
}
