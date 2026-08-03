using EduFlowAI.DTO.Email;

namespace EduFlowAI.Services.EmailTemplatesService
{
    public interface IEmailTemplateService
    {
        Task<EmailDTO> GetVerificationEmailTemplateAsync(string email, string verificationLink);
        Task<EmailDTO> GetResetPasswordEmailTemplateAsync(string email, string userName, string resetLink);
    }
}
