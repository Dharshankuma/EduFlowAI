using EduFlowAI.DTO.Dashboard.Responses;

namespace EduFlowAI.Services.Dashboard
{
    public interface IDashboardService
    {
        Task<DashboardResponseDTO> GetDashboardAsync(int userId, DateTime date, CancellationToken cancellation);
    }
}
