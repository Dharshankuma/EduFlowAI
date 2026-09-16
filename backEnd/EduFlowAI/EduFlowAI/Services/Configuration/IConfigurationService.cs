using EduFlowAI.DTO.Configuration;

namespace EduFlowAI.Services.Configuration
{
    public interface IConfigurationService
    {
        Task<ConfigurationResponse> GetConfigurationDetails(CancellationToken cancellation);
    }
}
