using EduFlowAI.DTO.Authentiation.Requests;
using FluentValidation;

namespace EduFlowAI.Validators
{
    public class RegisterRequestValidators : AbstractValidator<RegisterRequestDTO>
    {
        public RegisterRequestValidators()
        {

            RuleFor(x => x.EmailId).NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid Email Address");

            RuleFor(x => x.Password).NotEmpty().WithMessage("Password is required");

            RuleFor(x => x.Username).NotEmpty().WithMessage("Username is required")
                .MinimumLength(3).WithMessage("Username must be at least 3 characters long");


        }
    }
}
