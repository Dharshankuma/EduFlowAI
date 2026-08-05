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
        Task UpdateUserProfileAsync(User user, CancellationToken cancellation);
        Task<User> GetUserDetailsByUserNameAsync(string userName, CancellationToken cancellation);
        Task CreateDefaultAvailabilityAsync(int userId,CancellationToken cancellationToken);
        Task UpdateWeeklyAvailability(List<Useravailability> availablity, CancellationToken cancellation);
    }
}
