using Azure;
using Azure.Communication.Email;
using EduFlowAI.Configurations;
using EduFlowAI.DTO.Email;

namespace EduFlowAI.Services.Email
{
    public sealed class AzureEmailService : IEmailService
    {
        private readonly EmailClient _client;
        private readonly AzureEmailSettings _settings;
        
        public AzureEmailService(EmailClient client,AzureEmailSettings settings)
        {
            _client = client;
            _settings = settings;
        }

        public async Task SendMailAsync(EmailDTO email)
        {
            var emailContent = new EmailContent(email.Subject)
            {
                Html = email.Body
            };

            var recipeint = new EmailRecipients(new List<EmailAddress>
            {
                new EmailAddress(email.ToEmail)
            });

            var message = new EmailMessage(
                _settings.SenderName,
                recipeint,
                emailContent
            );

            await _client.SendAsync(WaitUntil.Completed, message);
        }
    }
}
