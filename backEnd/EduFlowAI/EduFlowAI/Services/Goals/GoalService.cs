using EduFlowAI.DTO.Goals.Responses;
using EduFlowAI.Repositories.Goals;

namespace EduFlowAI.Services.Goals
{
    public sealed class GoalService : IGoalService
    {
        private readonly IGoalRepository _repo;


        public GoalService(IGoalRepository repo)
        {
            _repo = repo;
        }



        //public async Task<GoalsGridResponseDTO> GetGoalsGridDataAsync(GoalsGridResponseDTO objdot)
        //{

        //}
    }
}
