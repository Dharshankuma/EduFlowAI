using EduFlowAI.Data;
using EduFlowAI.Exceptions;
using EduFlowAI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;

namespace EduFlowAI.Repositories.Authentication
{
    public class AuthenticationRepository : IAuthenticationRepository
    {
        private readonly EduFlowDbContext _context;
        public AuthenticationRepository(EduFlowDbContext context)
        {
            _context = context;
        }
        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Emailid == email);
        }

        public async Task<User> CreateUserAsync(User user)
        {
            await _context.Users.AddAsync(user);

            await _context.SaveChangesAsync();

            return user;
        }

        public async Task SaveRefreshTokenAsync(Refreshtoken refresh)
        {
            await _context.Refreshtokens.AddAsync(refresh);

            await _context.SaveChangesAsync();
        }

        public async Task UpdateRefershTokenAsync(Refreshtoken refresh)
        {
             _context.Refreshtokens.Update(refresh);

            await _context.SaveChangesAsync();
        }

        public async Task RevokeRefreshTokenAsync(string refreshToken)
        {
            var refreshTokenEntity = await _context.Refreshtokens.FirstOrDefaultAsync(r => r.Refreshtoken1 == refreshToken);
            if(refreshTokenEntity == null)
            {
                throw new NotFoundException("Refresh token not found");
            }

            refreshTokenEntity.Isrevoked = true;
            _context.Refreshtokens.Update(refreshTokenEntity);
            await _context.SaveChangesAsync();
        }

        public async Task<Refreshtoken> GetRefreshTokenByValue(string refreshToken)
        {
            var token = await _context.Refreshtokens.Include(x => x.User).FirstOrDefaultAsync(x => x.Refreshtoken1 == refreshToken);

            if(token == null)
            {
                throw new NotFoundException("Refresh token not found");
            }

            return token;
        }
    }
}
 