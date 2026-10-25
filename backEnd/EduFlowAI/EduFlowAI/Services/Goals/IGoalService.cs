using EduFlowAI.DTO.Goals.Requests;
using EduFlowAI.DTO.Goals.Responses;

namespace EduFlowAI.Services.Goals
{
    public interface IGoalService
    {
        Task<GoalsGridResponseDTO> GetGoalsGridDataAsync(int userId, GoalsGridRequestDTO objdto, CancellationToken cancellation);
        Task<GoalViewResponseDTO> GetParticularGoalAsync(int userId, string taskIdentifier, CancellationToken cancellation);
        Task<CreateGoalResponseDTO> CreateGoalAsync(int userId, CreateGoalRequestDTO dto, CancellationToken cancellation);
        Task<CreateGoalWithTasksResponseDTO> CreateGoalWithTasksAsync(int userId, CreateGoalWithTasksRequestDTO dto, CancellationToken cancellation);
        Task<SaveGoalTasksResponseDTO> SaveGoalTasksAsync(int userId, string goalIdentifier, SaveGoalTasksRequestDTO dto, CancellationToken cancellation);
        Task CompleteGoalAsync(int userId, string goalIdentifier, CancellationToken cancellation);
    }
}
