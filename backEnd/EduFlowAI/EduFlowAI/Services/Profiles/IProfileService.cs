using EduFlowAI.DTO.Profiles.Responses;

namespace EduFlowAI.Services.Profiles
{
    public interface IProfileService
    {
        Task<ProfileResponseDTO> GetProfileAsync(int userId, CancellationToken cancellation);
    }
}
