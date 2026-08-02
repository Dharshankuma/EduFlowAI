
using Azure.Communication.Email;
using EduFlowAI.Configurations;
using EduFlowAI.Services.Email;
using Microsoft.Extensions.Options;
using System.Runtime.CompilerServices;

namespace EduFlowAI.Extensions
{
    public static class EmailExtensions
    {
        public static IServiceCollection AddEmailServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<AzureEmailSettings>(
                configuration.GetSection(AzureEmailSettings.SectionName));

            services.AddSingleton(sp =>
            {
                var settings = sp.GetRequiredService<IOptions<AzureEmailSettings>>().Value;

                return new EmailClient(settings.ConnectionString);

            });

            services.AddScoped<IEmailService, AzureEmailService>();

            return services;
        }
    }
}
