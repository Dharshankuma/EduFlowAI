using EduFlowAI.Models;

namespace EduFlowAI.Repositories.Authentication
{
    public interface IAuthenticationRepository
    {
        Task<User?> GetUserByEmailAsync(string email, CancellationToken cancellation);
        Task<User> CreateUserAsync(User user, CancellationToken cancellation);
        Task UpdateUserLogin(User user, CancellationToken cancellation);
        Task SaveRefreshTokenAsync(Refreshtoken refresh, CancellationToken cancellation);
        Task UpdateRefershTokenAsync(Refreshtoken refresh, CancellationToken cancellation);
        Task RevokeRefreshTokenAsync(string refreshToken, CancellationToken cancellation);
        Task<Refreshtoken> GetRefreshTokenByValue(string refreshToken, CancellationToken cancellation);
        Task<Emailverification> GetUserEmailVerificationAsync(string token, CancellationToken cancellation);
        Task CreateUserEmailVerificationAsync(Emailverification email, CancellationToken cancellation);
        Task UpdateEmailVerificationAsync(Emailverification email, CancellationToken cancellation);
        Task<Emailverification> GetEmailVerificationByUserId(int userId, CancellationToken cancellation);
        Task<User?> GetUserByPasswordToken(string token, CancellationToken cancellation);

    }
}
