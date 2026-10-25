using EduFlowAI.Configurations;
using EduFlowAI.DTO.Authentiation.Requests;
using EduFlowAI.DTO.Authentiation.Responses;
using EduFlowAI.Exceptions;
using EduFlowAI.Helpers;
using EduFlowAI.Models;
using EduFlowAI.Repositories.Authentication;
using EduFlowAI.Repositories.Profiles;
using EduFlowAI.Services.EmailService;
using EduFlowAI.Services.EmailTemplatesService;
using EduFlowAI.Services.EmailTemplatesService.Authentication;
using EduFlowAI.Services.Profiles;
using FluentValidation.Validators;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.Extensions.Options;

namespace EduFlowAI.Services.Authentication
{
    public sealed class AuthenticationService : IAuthenticationService
    {
        private readonly IAuthenticationRepository _repo;
        private readonly JWTHelper _helper;
        private readonly IEmailService _email;
        private readonly IAuthenticationEmailTemplateService _template;
        private readonly IProfileRepository _profile;
        private readonly GoogleConfigurationSettings _googleSettings;
        private const string LinkUrl = "http://localhost:5173/";

        public AuthenticationService(IAuthenticationRepository repo, JWTHelper helper,IEmailService email, IAuthenticationEmailTemplateService template, IProfileRepository profile,IOptions<GoogleConfigurationSettings> googleSettings)
        {
            _repo = repo;
            _helper = helper;
            _email = email;
            _template = template;
            _profile = profile;
            _googleSettings = googleSettings.Value;
        }

        public async Task RegisterUserAsync(RegisterRequestDTO objdto,CancellationToken cancellation)
        {
            var existingUser = await _repo.GetUserByEmailAsync(objdto.EmailId,cancellation);
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
                Emailverified = false,
                Createdat = DateTimeHelper.GetDateTimeNow(),
                
            };

            await _repo.CreateUserAsync(newUser,cancellation);

            // creates default user availability
            await _profile.CreateDefaultAvailabilityAsync(newUser.Userid, cancellation);

            //generate the email verifiaction token 

            await GenerateEmailVerificationToken(newUser,cancellation);
        }

        public async Task VerifyUserEmailAsync(string token,CancellationToken cancellation)
        {
            var emailDetails = await _repo.GetUserEmailVerificationAsync(token,cancellation);
            if (emailDetails == null)
            {
                throw new NotFoundException("Email verification token not found");
            }

            if (emailDetails.Expiresat < Helpers.DateTimeHelper.GetDateTimeNow())
            {
                await GenerateEmailVerificationToken(emailDetails.User,cancellation);
                throw new UnauthorizedException("The Link has been expired, Kindly check your email for a new verification link.");
            }

            if (emailDetails.Isused == true)
            {
                throw new BadRequestException("The Link has already been used and the mail has already been verified.");
            }

            emailDetails.Isused = true;

            emailDetails.User.Emailverified = true;

            await _repo.UpdateUserLogin(emailDetails.User,cancellation);
            await _repo.UpdateEmailVerificationAsync(emailDetails,cancellation);
        }

        public async Task<LoginResponseDTO> LoginAsync(LoginRequestDTO objdto,CancellationToken cancellation)
        {
            var userDetails = await _repo.GetUserByEmailAsync(objdto.Email,cancellation);

            if (userDetails == null)
            {
                throw new UnauthorizedException("Invalid Email or User Doesn't exist");
            }

            var isPasswordValid = PasswordHelper.VerifyPassword(objdto.Password, userDetails.Passwordhash);

            if (!isPasswordValid)
            {
                throw new UnauthorizedException("Invalid Email or Password");
            }

            if (userDetails.Emailverified == false)
            {
                var emailDetails = await _repo.GetEmailVerificationByUserId(userDetails.Userid,cancellation);

                if (emailDetails == null || emailDetails.Isused == true || emailDetails.Expiresat < DateTimeHelper.GetDateTimeNow())
                {
                    await GenerateEmailVerificationToken(userDetails,cancellation);
                }

                throw new BadRequestException("Email is not verified. Please verify your email before logging in.");
            }

            var accessToken = _helper.GenerateAccessToken(userDetails);
            var refreshToken = CommonHelper.GenerateFixedGuidString(32);

            //updating the user last login date and time for every login
            userDetails.Lastloginat = DateTimeHelper.GetDateTimeNow();

            await _repo.UpdateUserLogin(userDetails,cancellation);

            var currentTime = DateTimeHelper.GetDateTimeNow();

            var refreshTokenEntity = new Refreshtoken
            {
                Refreshtoken1 = refreshToken,
                Userid = userDetails.Userid,
                Isrevoked = false,
                Createdat = currentTime,
                Refreshexpiry = currentTime.AddDays(7)
            };

            await _repo.SaveRefreshTokenAsync(refreshTokenEntity,cancellation);

            var response = BuildLoginResponseDTO(userDetails, accessToken, refreshToken);

            return response;
        }

        public async Task<LoginResponseDTO> GoogleLoginAsync(GoogleLoginRequestDTO dto,CancellationToken cancellationToken)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.CredentialId))
            {
                throw new BadRequestException(
                    "Google credential is required.");
            }

            var googleUser = await ValidateGoogleTokenAsync(
                dto.CredentialId);

            if (!googleUser.EmailVerified)
            {
                throw new BadRequestException(
                    "Google email address is not verified.");
            }

            var user = await _repo.GetUserByGoogleIdAsync(
                googleUser.Subject,
                cancellationToken);


            if (user != null)
            {
                await LoginExistingGoogleUserAsync(
                    user,
                    cancellationToken);
            }
            else
            {
                user = await _repo.GetUserByEmailAsync(
                    googleUser.Email,
                    cancellationToken);

                if (user != null)
                {
                    throw new BadRequestException(
                        "An account already exists with this email. " +
                        "Please login using your existing authentication method.");
                }

                user = await CreateGoogleUserAsync(
                    googleUser,
                    cancellationToken);
            }

            var accessToken = _helper.GenerateAccessToken(user);
            var refreshToken = CommonHelper.GenerateFixedGuidString(32);

            var refreshTokenEntity = new Refreshtoken
            {
                Refreshtoken1 = refreshToken,
                Userid = user.Userid,
                Isrevoked = false,
                Createdat = DateTimeHelper.GetDateTimeNow(),
                Refreshexpiry = DateTimeHelper.GetDateTimeNow().AddDays(7)
            };

            await _repo.SaveRefreshTokenAsync(refreshTokenEntity, cancellationToken);

            return BuildLoginResponseDTO(user, accessToken, refreshToken);
        }

        public async Task LogOutUser(string refreshToken,CancellationToken cancellation)
        {
            await _repo.RevokeRefreshTokenAsync(refreshToken,cancellation);
        }

        public async Task<LoginResponseDTO> RefreshTokenAsync(string refreshToken,CancellationToken cancellation)
        {
            var refreshTokenEntity = await _repo.GetRefreshTokenByValue(refreshToken,cancellation);
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
            var newRefreshToken = CommonHelper.GenerateFixedGuidString(32);

            await _repo.RevokeRefreshTokenAsync(refreshToken,cancellation);

            var newRefreshTokenEntity = new Refreshtoken
            {
                Refreshtoken1 = newRefreshToken,
                Userid = userDetails.Userid,
                Isrevoked = false,
                Createdat = DateTimeHelper.GetDateTimeNow(),
                Refreshexpiry = DateTimeHelper.GetDateTimeNow().AddDays(7)
            };

            await _repo.SaveRefreshTokenAsync(newRefreshTokenEntity,cancellation);

            var response = BuildLoginResponseDTO(userDetails, newAccessToken, newRefreshToken);

            return response;
        }

        public async Task ForgetPasswordAsync(string email,CancellationToken cancellation)
        {
            var userDetails = await _repo.GetUserByEmailAsync(email, cancellation);
            if (userDetails == null)
            {
                throw new NotFoundException("User not found for the provided email.");
            }
            
            var forgetPasswordToken = CommonHelper.GenerateFixedGuidString(32);
            var forgetPasswordLink = $"{LinkUrl}reset-password?token={forgetPasswordToken}";

            userDetails.Passwordresettoken = forgetPasswordToken;
            userDetails.Passwordresettokenexpiry = DateTimeHelper.GetDateTimeNow().AddMinutes(10);

            await _repo.UpdateUserLogin(userDetails, cancellation);

            //mail sending process 
            var emailRequest = await _template.GetResetPasswordEmailTemplateAsync(userDetails.Emailid, userDetails.Username, forgetPasswordLink);

            await _email.SendMailAsync(emailRequest, cancellation);
        }

        public async Task ChangePasswordAsync(ResetPasswordRequestDTO reset,CancellationToken cancellation)
        {
            var userDetails = await _repo.GetUserByPasswordToken(reset.Token, cancellation);

            if(userDetails == null)
            {
                throw new NotFoundException("Invalid or expired password reset token.");
            }

            if(userDetails.Passwordresettokenexpiry < DateTimeHelper.GetDateTimeNow())
            {
                throw new UnauthorizedException("The password reset token has expired. Please request a new password reset.");
            }

            if (reset.NewPassword != reset.ConfirmPassword)
            {
                throw new BadRequestException("New password and confirm password do not match.");
            }

            var passwordHash = PasswordHelper.HashPassword(reset.NewPassword);

            userDetails.Passwordhash = passwordHash;
            userDetails.Updatedat = DateTimeHelper.GetDateTimeNow();

            await _repo.UpdateUserLogin(userDetails,cancellation);
        }

        private async Task GenerateEmailVerificationToken(User user,CancellationToken cancellation)
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

            await _repo.CreateUserEmailVerificationAsync(emailVerification,cancellation);

           //mail process will be done
            var verificationLink = $"{LinkUrl}verify-email?token={emailToken}";

            var emailRequest = await _template.GetVerificationEmailTemplateAsync(user.Emailid, verificationLink);

            await _email.SendMailAsync(emailRequest, cancellation);

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

        private async Task<GoogleJsonWebSignature.Payload> ValidateGoogleTokenAsync(string credential)
        {
            try
            {
                return await GoogleJsonWebSignature.ValidateAsync(credential, new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[]
                    {
                        _googleSettings.ClientId
                    }
                });
            }
            catch(InvalidJwtException)
            {
                throw new("Invalid Google Authentication");
            }
        }

        private async Task<User> CreateGoogleUserAsync(GoogleJsonWebSignature.Payload googleUser,CancellationToken cancellationToken)
        {
            var currentDateTime =
                DateTimeHelper.GetDateTimeNow();

            var user = new User
            {
                Useridentifier = CommonHelper.GenerateFixedGuidString(32),

                Emailid = googleUser.Email,

                Firstname = googleUser.GivenName,

                Lastname = googleUser.FamilyName,

                Profilepicturepath = googleUser.Picture,

                Googleid = googleUser.Subject,

                Autuhprovider = "Google",

                Emailverified = true,

                Isactive = true,

                Createdat = currentDateTime,

                Lastloginat = currentDateTime
            };

            user = await _repo.CreateUserAsync(
                user,
                cancellationToken);

            await _profile.CreateDefaultAvailabilityAsync(user.Userid, cancellationToken);

            return user;
        }
        
        private async Task LoginExistingGoogleUserAsync(User user,CancellationToken cancellationToken)
        {
            if (!user.Isactive)
            {
                throw new BadRequestException(
                    "Your account is inactive.");
            }

            user.Lastloginat = DateTimeHelper.GetDateTimeNow();

            await _repo.UpdateUserLogin(
                user,
                cancellationToken);
        }
    }
}