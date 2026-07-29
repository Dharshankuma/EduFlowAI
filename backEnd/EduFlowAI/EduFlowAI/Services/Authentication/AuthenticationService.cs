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
    }
}
