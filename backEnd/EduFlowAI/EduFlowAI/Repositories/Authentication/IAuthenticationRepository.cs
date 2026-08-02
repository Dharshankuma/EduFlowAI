using EduFlowAI.Models;

namespace EduFlowAI.Repositories.Authentication
{
    public interface IAuthenticationRepository
    {
        Task<User?> GetUserByEmailAsync(string email);
        Task<User> CreateUserAsync(User user);
        Task UpdateUserLogin(User user);
        Task SaveRefreshTokenAsync(Refreshtoken refresh);
        Task UpdateRefershTokenAsync(Refreshtoken refresh);
        Task RevokeRefreshTokenAsync(string refreshToken);
        Task<Refreshtoken> GetRefreshTokenByValue(string refreshToken);
        Task<Emailverification> GetUserEmailVerificationAsync(string token);
        Task CreateUserEmailVerificationAsync(Emailverification email);
        Task UpdateEmailVerificationAsync(Emailverification email);
        Task<Emailverification> GetEmailVerificationByUserId(int userId);

    }
}
