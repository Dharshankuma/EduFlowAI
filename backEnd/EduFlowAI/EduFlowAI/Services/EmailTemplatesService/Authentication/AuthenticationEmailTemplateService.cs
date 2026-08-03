using EduFlowAI.DTO.Email;
using EduFlowAI.Services.EmailTemplatesService;

namespace EduFlowAI.Services.EmailTemplatesService.Authentication
{
    public sealed class AuthenticationEmailTemplateService : IAuthenticationEmailTemplateService
    {
        private readonly IWebHostEnvironment _environment;
        private const string LinkUrl = "http://localhost:5173/";
        public AuthenticationEmailTemplateService(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        public async Task<EmailDTO> GetVerificationEmailTemplateAsync(string email,string verificationLink)
        {
            var templatePath = Path.Combine(_environment.ContentRootPath, "Services","Templates", "EmailTemplates", "VerifyEmailTemplate.html");

            var html = await File.ReadAllTextAsync(templatePath);

            html = html.Replace("{{VerificationLink}}", verificationLink);

            return new EmailDTO
            {
                ToEmail = email,
                Subject = "Verify Your EduFlowAI Account",
                Body = html

            };
        }

        public async Task<EmailDTO> GetResetPasswordEmailTemplateAsync(string email,string userName, string resetLink)
        {
            var templatePath = Path.Combine(_environment.ContentRootPath, "Templates", "EmailTemplates", "ResetPasswordTemplate.html");
            var html = await File.ReadAllTextAsync(templatePath);

            html = html.Replace("{{UserName}}", userName);
            html = html.Replace("{{ResetLink}}", resetLink);

            return new EmailDTO
            {
                ToEmail = email,
                Subject = "Reset Your EduFlowAI Password",
                Body = html
            };
        }
    }
}
