using EduFlowAI.Repositories.Dashboard.Models;

namespace EduFlowAI.Repositories.Dashboard
{
    public interface IDashboardRepository
    {
        Task<DashboardSnapshotQueryModel> GetSnapshotAsync(int userId, DateTime date, CancellationToken cancellation);
    }
}
