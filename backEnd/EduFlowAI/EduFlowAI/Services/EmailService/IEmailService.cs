using EduFlowAI.DTO.Email;

namespace EduFlowAI.Services.EmailService
{
    public interface IEmailService
    {
        Task SendMailAsync(EmailDTO email, CancellationToken cancellation);
    }
}
