using EduFlowAI.DTO.Authentiation.Requests;
using EduFlowAI.DTO.Authentiation.Responses;
using EduFlowAI.Exceptions;
using EduFlowAI.Helpers;
using EduFlowAI.Models;
using EduFlowAI.Repositories.Authentication;
using Microsoft.AspNetCore.Components.Web;

namespace EduFlowAI.Services.Authentication
{
    public sealed class AuthenticationService : IAuthenticationService
    {
        private readonly IAuthenticationRepository _repo;
        private readonly JWTHelper _helper;

        public AuthenticationService(IAuthenticationRepository repo,JWTHelper helper)
        {
            _repo = repo;
            _helper = helper;
        }

        public async Task RegisterUserAsync(RegisterRequestDTO objdto)
        {
            var existingUser = await _repo.GetUserByEmailAsync(objdto.EmailId);
            if (existingUser != null)
            {
                throw new BadRequestException("Email already exists");
            }
            var passwordHash = PasswordHelper.HashPassword(objdto.Password);
            var newUser = new User
            {
                Useridentifier = Guid.NewGuid().ToString(),
                Username = objdto.Username,
                Emailid = objdto.EmailId,
                Passwordhash = passwordHash,
                Autuhprovider = objdto.authProvider
            };

            await _repo.CreateUserAsync(newUser);
        }

        public async Task<LoginResponseDTO> LoginAsync(LoginRequestDTO objdto)
        {
            var userDetails = await _repo.GetUserByEmailAsync(objdto.Email);

            if(userDetails == null)
            {
                throw new UnauthorizedException("Invalid Email or Password");
            }

            var isPasswordValid = PasswordHelper.VerifyPassword(objdto.Password, userDetails.Passwordhash);

            if(!isPasswordValid)
            {
                throw new UnauthorizedException("Invalid Email or Password");
            }

            var accessToken = _helper.GenerateAccessToken(userDetails);
            var refreshToken = _helper.GenerateRefreshToken();

            var currentTime = DateTimeHelper.GetDateTimeNow();

            var refreshTokenEntity = new Refreshtoken
            {
                Refreshtoken1 = refreshToken,
                Userid = userDetails.Userid,
                Isrevoked = false,
                Createdat = currentTime,
                Refreshexpiry = currentTime.AddDays(7)
            };

            await _repo.SaveRefreshTokenAsync(refreshTokenEntity);

            var userData = new UserLoginDetailsResponse
            {
                UserIdentifier = userDetails.Useridentifier,
                FirstName = userDetails.Firstname,
                LastName = userDetails.Lastname,
                UserName = userDetails.Username,
                EmailId = userDetails.Emailid
            };

            var response = new LoginResponseDTO
            {
                RefreshToken = refreshToken,
                Token = accessToken,
                UserData = userData
            };

            return response;
        }

        public async Task LogOutUser(string refreshToken)
        {
            await _repo.RevokeRefreshTokenAsync(refreshToken);
        }

        public async Task<LoginResponseDTO> RefreshTokenAsync(string refreshToken)
        {
            var refreshTokenEntity = await _repo.GetRefreshTokenByValue(refreshToken);
            if(refreshTokenEntity ==  null || refreshTokenEntity.Isrevoked == true || refreshTokenEntity.Refreshexpiry > Helpers.DateTimeHelper.GetDateTimeNow())
            {
                throw new UnauthorizedException("Invalid or Expired Refresh Token. Please Login Again");
            }


            var userDetails = refreshTokenEntity.User;

            if(userDetails == null)
            {
                throw new NotFoundException("User not found for the provided refresh token.");
            }

            var newAccessToken = _helper.GenerateAccessToken(userDetails);
            var newRefreshToken = _helper.GenerateRefreshToken();

            await _repo.RevokeRefreshTokenAsync(refreshToken);

            var newRefreshTokenEntity = new Refreshtoken
            {
                Refreshtoken1 = newRefreshToken,
                Userid = userDetails.Userid,
                Isrevoked = false,
                Createdat = DateTimeHelper.GetDateTimeNow(),
                Refreshexpiry = DateTimeHelper.GetDateTimeNow().AddDays(7)
            };

            await _repo.SaveRefreshTokenAsync(newRefreshTokenEntity);

            var userData = new UserLoginDetailsResponse
            {
                UserIdentifier = userDetails.Useridentifier,
                FirstName = userDetails.Firstname,
                LastName = userDetails.Lastname,
                UserName = userDetails.Username,
                EmailId = userDetails.Emailid
            };

            var response = new LoginResponseDTO
            {
                Token = newAccessToken,
                RefreshToken = newRefreshToken,
                UserData = userData
            };

            return response;
        }
    }
}
