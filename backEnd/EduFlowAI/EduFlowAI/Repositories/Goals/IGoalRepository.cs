using EduFlowAI.DTO.Goals.Requests;
using EduFlowAI.Models;
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
        Task<Goalmanagement> CreateGoalAsync(Goalmanagement goal, CancellationToken cancellation);
        Task<Goalmanagement> CreateGoalWithTasksAsync(Goalmanagement goal, List<Taskmanagement> tasks, CancellationToken cancellation);
        Task<Goalmanagement?> GetGoalForUserAsync(int userId, string goalIdentifier, CancellationToken cancellationToken);
        Task<List<Taskmanagement>> GetGoalTasksForUpdateAsync(int goalId, CancellationToken cancellationToken);
        Task SaveGoalTaskChangesAsync(List<Taskmanagement> tasksToAdd, List<Taskmanagement> tasksToUpdate, List<Taskmanagement> tasksToDelete, CancellationToken cancellationToken);
        Task UpdateGoalStatusAsync(int goalId, int statusId, int updatedBy, CancellationToken cancellation);
        Task<int?> GetGoalTypeIdAsync(string identifier, CancellationToken cancellation);
        Task<int?> GetPriorityIdAsync(string identifier, CancellationToken cancellation);

    }
}
