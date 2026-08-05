using EduFlowAI.DTO.Profiles.Requests;
using EduFlowAI.DTO.Profiles.Responses;

namespace EduFlowAI.Services.Profiles
{
    public interface IProfileService
    {
        Task<ProfileResponseDTO> GetProfileAsync(int userId, CancellationToken cancellation);
        Task UpdatePersonalInformationAsync(int userId, PersonalInformationRequestDTO dto, CancellationToken cancellationToken);
        Task UpdateWeekAvailability(int userId, WeeklyAvailabilityRequestDTO dto, CancellationToken cancellationToken);
    }
}
