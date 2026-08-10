using EduFlowAI.DTO.Goals.Requests;
using EduFlowAI.Models;
using EduFlowAI.Repositories.Goals.Models;

namespace EduFlowAI.Repositories.Goals
{
    public sealed class IGoalRepository
    {
        Task<List<GoalGridQueryModel>> GetGoalGridAsync(int userId, GoalsGridRequestDTO objdto, CancellationToken cancellation);
    }
}
