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

        public AuthenticationService(IAuthenticationRepository repo, JWTHelper helper)
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
                Useridentifier = CommonHelper.GenerateFixedGuidString(32),
                Username = objdto.Username,
                Emailid = objdto.EmailId,
                Passwordhash = passwordHash,
                Autuhprovider = objdto.authProvider,
                Emailverified = false
            };

            await _repo.CreateUserAsync(newUser);

            //generate the email verifiaction token 

            await GenerateEmailVerificationToken(newUser);
        }

        public async Task VerifyUserEmailAsync(string token)
        {
            var emailDetails = await _repo.GetUserEmailVerificationAsync(token);
            if (emailDetails == null)
            {
                throw new NotFoundException("Email verification token not found");
            }

            if (emailDetails.Expiresat < Helpers.DateTimeHelper.GetDateTimeNow())
            {
                await GenerateEmailVerificationToken(emailDetails.User);
                throw new UnauthorizedException("The Link has been expired, Kindly check your email for a new verification link.");
            }

            if (emailDetails.Isused == true)
            {
                throw new BadRequestException("The Link has already been used and the mail has already been verified.");
            }

            emailDetails.Isused = true;

            emailDetails.User.Emailverified = true;

            await _repo.UpdateUserLogin(emailDetails.User);
            await _repo.UpdateEmailVerificationAsync(emailDetails);
        }

        public async Task<LoginResponseDTO> LoginAsync(LoginRequestDTO objdto)
        {
            var userDetails = await _repo.GetUserByEmailAsync(objdto.Email);

            if (userDetails == null)
            {
                throw new UnauthorizedException("Invalid Email or Password");
            }

            var isPasswordValid = PasswordHelper.VerifyPassword(objdto.Password, userDetails.Passwordhash);

            if (!isPasswordValid)
            {
                throw new UnauthorizedException("Invalid Email or Password");
            }

            if (userDetails.Emailverified == false)
            {
                var emailDetails = await _repo.GetEmailVerificationByUserId(userDetails.Userid);

                if (emailDetails == null || emailDetails.Isused == true || emailDetails.Expiresat < DateTimeHelper.GetDateTimeNow())
                {
                    await GenerateEmailVerificationToken(userDetails);
                }

                throw new BadRequestException("Email is not verified. Please verify your email before logging in.");
            }

            var accessToken = _helper.GenerateAccessToken(userDetails);
            var refreshToken = _helper.GenerateRefreshToken();

            //updating the user last login date and time for every login
            userDetails.Lastloginat = DateTimeHelper.GetDateTimeNow();
            await _repo.UpdateUserLogin(userDetails);

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

            var response = BuildLoginResponseDTO(userDetails, accessToken, refreshToken);

            return response;
        }

        public async Task LogOutUser(string refreshToken)
        {
            await _repo.RevokeRefreshTokenAsync(refreshToken);
        }

        public async Task<LoginResponseDTO> RefreshTokenAsync(string refreshToken)
        {
            var refreshTokenEntity = await _repo.GetRefreshTokenByValue(refreshToken);
            if (refreshTokenEntity == null || refreshTokenEntity.Isrevoked == true || refreshTokenEntity.Refreshexpiry < Helpers.DateTimeHelper.GetDateTimeNow())
            {
                throw new UnauthorizedException("Invalid or Expired Refresh Token. Please Login Again");
            }


            var userDetails = refreshTokenEntity.User;

            if (userDetails == null)
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

            var response = BuildLoginResponseDTO(userDetails, newAccessToken, newRefreshToken);

            return response;
        }

        private async Task GenerateEmailVerificationToken(User user)
        {
            var emailToken = CommonHelper.GenerateFixedGuidString(32);

            var emailVerification = new Emailverification
            {
                Token = emailToken,
                Userid = user.Userid,
                Isused = false,
                Expiresat = DateTimeHelper.GetDateTimeNow().AddMinutes(10),
                Createdat = DateTimeHelper.GetDateTimeNow()
            };

            await _repo.CreateUserEmailVerificationAsync(emailVerification);

           //mail process will be done
        }

        private static UserLoginDetailsResponse BuildLoginUserData(User user)
        {
            return new UserLoginDetailsResponse
            {
                UserIdentifier = user.Useridentifier,
                FirstName = user.Firstname,
                LastName = user.Lastname,
                UserName = user.Username,
                EmailId = user.Emailid
            };
        }

        private static LoginResponseDTO BuildLoginResponseDTO(User user,string accessToken, string refreshToken)
        {
            return new LoginResponseDTO
            {
                Token = accessToken,
                RefreshToken = refreshToken,
                UserData = BuildLoginUserData(user)
            };
        }
    }
}