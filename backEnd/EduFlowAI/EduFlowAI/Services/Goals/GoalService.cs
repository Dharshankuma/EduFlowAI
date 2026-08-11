using EduFlowAI.DTO.Goals.Requests;
using EduFlowAI.DTO.Goals.Responses;
using EduFlowAI.Exceptions;
using EduFlowAI.Helpers;
using EduFlowAI.Repositories.Goals;
using System.Runtime.Serialization;

namespace EduFlowAI.Services.Goals
{
    public sealed class GoalService : IGoalService
    {
        private readonly IGoalRepository _repo;


        public GoalService(IGoalRepository repo)
        {
            _repo = repo;
        }



        public async Task<GoalsGridResponseDTO> GetGoalsGridDataAsync(int userId,GoalsGridRequestDTO objdto,CancellationToken cancellation)
        {
            if(objdto.PageNumber < 1)
            {
                objdto.PageNumber = 1;
            }

            if (objdto.PageSize < 1)
            {
                objdto.PageSize = 10;
            }

            if (objdto.PageSize > 100)
            {
                objdto.PageSize = 100;
            }

            var goals = await _repo.GetGoalGridAsync(userId, objdto, cancellation);

            var totalRecords = await _repo.GetFilteredGoalCountAsync(userId, objdto, cancellation);

            var summaryRecords = await _repo.GetGoalGridSummaryAsync(userId, cancellation);

            var totalPages = totalRecords == 0 ? 0 : (int)Math.Ceiling(
                    totalRecords / (double)objdto.PageSize);

            var response = new GoalsGridResponseDTO
            {
                TotalGoals = summaryRecords.TotalGoals,
                ActiveGoals = summaryRecords.ActiveGoals,
                CompletedGoals = summaryRecords.CompletedGoals,
                TotalRecords = totalRecords,
                PageNumber = objdto.PageNumber,
                PageSize = objdto.PageSize,
                TotalPages = totalPages,
                Goals = goals.Select(x =>
                    new GoalsGridItemResponseDTO
                    {

                        GoalIdentifier =x.GoalIdentifier,
                        GoalName =x.GoalTitle,
                        GoalType =x.GoalType,
                        GoalPriority =x.Priority,
                        Status =x.Status,
                        GoalDeadline = DateTimeHelper.FormatDateString(x.TargetDate),
                        TotalTasks =x.TotalTasks,
                        CompletedTasks =x.CompletedTasks,
                        ProgressPercentage =x.ProgressPercentage.ToString(),
                        NextSession =DateTimeHelper.FormatLastLogin(x.NextSession)
                    })
                    .ToList()
            };

            return response;
        }

        public async Task<GoalViewResponseDTO> GetParticularGoalAsync(int userId, string taskIdentifier,CancellationToken cancellation)
        {
            var goalDetails = await _repo.GetGoalDetailsAsync(userId, taskIdentifier, cancellation);

            if(goalDetails == null)
            {
                throw new NotFoundException("Goal not found");
            }

            var tasks = await _repo.GetGoalTasksAsync(userId, goalDetails.GoalId, cancellation);

            var progressPercentage = goalDetails.TotalTasks == 0 ? 0 : Math.Round(
                                                                 (decimal)goalDetails.CompletedTasks / goalDetails.TotalTasks * 100, 2);

            var response = new GoalViewResponseDTO
            {
                GoalDescription = goalDetails.GoalDescription,
                GoalTitle = goalDetails.GoalTitle,
                GoalType = goalDetails.GoalType,
                Priority = goalDetails.Priority,
                Status = goalDetails.Status,
                TargetDate = DateTimeHelper.FormatDateString(goalDetails.TargetDate),
                ProgressPercentage = progressPercentage,
                Statistics = new GoalStatisticsResponseDTO
                {
                    TotalStudyHours = goalDetails.TotalStudyHours,
                    CompletedStudyHours = goalDetails.CompletedStudyHours,
                    TotalTasks = goalDetails.TotalTasks,
                    CompletedTasks = goalDetails.CompletedTasks
                },
                TaskItems = tasks.Select(x => new GoalViewItemResponseDTO
                {
                    TaskDescription = x.TaskDescription,
                    TaskName = x.TaskName,
                    TaskDueDate = DateTimeHelper.FormatDateString(x.DueDate),
                    TaskStatus = x.Status,
                    TaskEstimatedHours = x.EstimatedHours,
                    TaskIdentifier = x.TaskIdentifier,
                    TaskStatusIdentifier = x.StatusIdentifier
                }).ToList()
            };

            return response;
        }
    }
}
