using EduFlowAI.DTO.Goals.Requests;
using EduFlowAI.DTO.Goals.Responses;

namespace EduFlowAI.Services.Goals
{
    public interface IGoalService
    {
        Task<GoalsGridResponseDTO> GetGoalsGridDataAsync(int userId, GoalsGridRequestDTO objdto, CancellationToken cancellation);
        Task<GoalViewResponseDTO> GetParticularGoalAsync(int userId, string taskIdentifier, CancellationToken cancellation);
    }
}
