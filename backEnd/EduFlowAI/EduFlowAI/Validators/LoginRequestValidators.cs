using EduFlowAI.DTO.Authentiation.Requests;
using FluentValidation;

namespace EduFlowAI.Validators
{
    public sealed class LoginRequestValidators : AbstractValidator<LoginRequestDTO>
    {
        public LoginRequestValidators()
        {
            RuleFor(x => x.Email).NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid Email Address");

            RuleFor(x => x.Password).NotEmpty().WithMessage("Password is required");
        }
    }
}
