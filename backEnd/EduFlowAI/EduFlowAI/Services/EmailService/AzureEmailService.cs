using Azure;
using Azure.Communication.Email;
using EduFlowAI.Configurations;
using EduFlowAI.DTO.Email;
using Microsoft.Extensions.Options;

namespace EduFlowAI.Services.EmailService
{
    public sealed class AzureEmailService : IEmailService
    {
        private readonly EmailClient _client;
        private readonly AzureEmailSettings _settings;
        
        public AzureEmailService(EmailClient client, IOptions<AzureEmailSettings> settings)
        {
            _client = client;
            _settings = settings.Value;
        }

        public async Task SendMailAsync(EmailDTO email,CancellationToken cancellation)
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
                _settings.SenderAddress,
                recipeint,
                emailContent
            );

            await _client.SendAsync(WaitUntil.Completed, message,cancellation);
        }
    }
}
