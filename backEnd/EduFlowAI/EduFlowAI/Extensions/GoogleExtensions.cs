using EduFlowAI.Configurations;

namespace EduFlowAI.Extensions
{
    public static class GoogleExtensions
    {
        public static IServiceCollection AddGoogleAuthentication(this IServiceCollection services, IConfiguration configuration)
        {

            services.Configure<GoogleConfigurationSettings>(
                configuration.GetSection(GoogleConfigurationSettings.SectionName));

            return services;
        }
    }
}
