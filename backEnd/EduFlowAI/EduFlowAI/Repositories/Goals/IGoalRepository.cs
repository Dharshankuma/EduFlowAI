using EduFlowAI.DTO.Goals.Requests;
using EduFlowAI.Repositories.Goals.Models;

namespace EduFlowAI.Repositories.Goals
{
    public interface IGoalRepository
    {
        Task<List<GoalGridQueryModel>> GetGoalGridAsync(int userId, GoalsGridRequestDTO objdto, CancellationToken cancellation);
        Task<int> GetFilteredGoalCountAsync(int userId, GoalsGridRequestDTO objdto, CancellationToken cancellation);
        Task<GoalGridSummaryQueryModel> GetGoalGridSummaryAsync(int userId, CancellationToken cancellation);
        Task<GoalDetailsQueryModel?> GetGoalDetailsAsync(int userId, string goalIdentifier, CancellationToken cancellation);
        Task<List<GoalTaskQueryModel>?> GetGoalTasksAsync(int userId, int goalId, CancellationToken cancellation);
    }
}
