using EduFlowAI.Models;

namespace EduFlowAI.Repositories.Authentication
{
    public interface IAuthenticationRepository
    {
        Task<User?> GetUserByEmailAsync(string email);
        Task<User> CreateUserAsync(User user);
        Task SaveRefreshTokenAsync(Refreshtoken refresh);
        Task UpdateRefershTokenAsync(Refreshtoken refresh);
        Task RevokeRefreshTokenAsync(string refreshToken);
        Task<Refreshtoken> GetRefreshTokenByValue(string refreshToken);
    }
}
