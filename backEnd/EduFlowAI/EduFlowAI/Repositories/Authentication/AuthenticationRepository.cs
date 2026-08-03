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
        public async Task<User?> GetUserByEmailAsync(string email,CancellationToken cancellation)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Emailid == email,cancellation);
        }

        public async Task<User> CreateUserAsync(User user, CancellationToken cancellation)
        {
            await _context.Users.AddAsync(user,cancellation);

            await _context.SaveChangesAsync(cancellation);

            return user;
        }

        public async Task UpdateUserLogin(User user, CancellationToken cancellation)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync(cancellation);
        }

        public async Task SaveRefreshTokenAsync(Refreshtoken refresh, CancellationToken cancellation)
        {
            await _context.Refreshtokens.AddAsync(refresh,cancellation);

            await _context.SaveChangesAsync(cancellation);
        }

        public async Task UpdateRefershTokenAsync(Refreshtoken refresh, CancellationToken cancellation)
        {
             _context.Refreshtokens.Update(refresh);

            await _context.SaveChangesAsync(cancellation);
        }

        public async Task RevokeRefreshTokenAsync(string refreshToken, CancellationToken cancellation)
        {
            var refreshTokenEntity = await _context.Refreshtokens.FirstOrDefaultAsync(r => r.Refreshtoken1 == refreshToken,cancellation);
            if(refreshTokenEntity == null)
            {
                throw new NotFoundException("Refresh token not found");
            }

            refreshTokenEntity.Isrevoked = true;
            _context.Refreshtokens.Update(refreshTokenEntity);
            await _context.SaveChangesAsync(cancellation);
        }

        public async Task<Refreshtoken> GetRefreshTokenByValue(string refreshToken, CancellationToken cancellation)
        {
            var token = await _context.Refreshtokens.Include(x => x.User).FirstOrDefaultAsync(x => x.Refreshtoken1 == refreshToken,cancellation);

            if(token == null)
            {
                throw new NotFoundException("Refresh token not found");
            }

            return token;
        }

        public async Task CreateUserEmailVerificationAsync(Emailverification email, CancellationToken cancellation)
        {
            await _context.Emailverifications.AddAsync(email,cancellation);
            await _context.SaveChangesAsync(cancellation);
        }

        public async Task<Emailverification> GetUserEmailVerificationAsync(string token, CancellationToken cancellation)
        {
            var emailDetails = await _context.Emailverifications.Include(x => x.User).FirstOrDefaultAsync(x => x.Token == token,cancellation);

            return emailDetails;
        }
        
        public async Task<Emailverification> GetEmailVerificationByUserId(int userId, CancellationToken cancellation)
        {
            var emailDetails = await _context.Emailverifications.Include(x => x.User).FirstOrDefaultAsync(x => x.Userid == userId,cancellation);
            return emailDetails;
        }

        public async Task UpdateEmailVerificationAsync(Emailverification email, CancellationToken cancellation)
        {
            _context.Emailverifications.Update(email);
            await _context.SaveChangesAsync(cancellation);
        }

        public async Task<User?> GetUserByPasswordToken(string token, CancellationToken cancellation)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Passwordresettoken == token, cancellation);
            return user;
        }
    }
}
 