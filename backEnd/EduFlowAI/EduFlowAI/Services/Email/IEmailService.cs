using EduFlowAI.DTO.Email;

namespace EduFlowAI.Services.Email
{
    public interface IEmailService
    {
        Task SendMailAsync(EmailDTO email);
    }
}
