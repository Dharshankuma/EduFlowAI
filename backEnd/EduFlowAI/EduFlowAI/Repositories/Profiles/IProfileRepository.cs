using EduFlowAI.DTO.Profiles.Responses;
using EduFlowAI.Models;

namespace EduFlowAI.Repositories.Profiles
{
    public interface IProfileRepository
    {
        Task<User> GetUserDetailsByIdAsync(int userId, CancellationToken cancellation);
        Task<ProfileSummaryResponseDTO> GetProfileSummaryResponseAsync(int userId, CancellationToken cancellation);
        Task<List<DailyStudyStatusResponseDTO>> GetDailyStudyStatusAsync(int userId, CancellationToken cancellation);
        Task<List<Useravailability>> GetWeekAvailabilityAsync(int userId, CancellationToken cancellation);
    }
}
