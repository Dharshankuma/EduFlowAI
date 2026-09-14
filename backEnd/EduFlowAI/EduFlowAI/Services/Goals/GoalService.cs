using EduFlowAI.DTO.Goals.Requests;
using EduFlowAI.DTO.Goals.Responses;
using EduFlowAI.Exceptions;
using EduFlowAI.Helpers;
using EduFlowAI.Models;
using EduFlowAI.PlannerEngine;
using EduFlowAI.Repositories.Goals;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Runtime.Serialization;

namespace EduFlowAI.Services.Goals
{
    public sealed class GoalService : IGoalService
    {
        private readonly IGoalRepository _repo;
        private readonly IPlannerEngine _plannerEngine;
        private readonly IPlannerRepository _plannerRepo;


        private readonly Microsoft.Extensions.Logging.ILogger<GoalService> _logger;

        public GoalService(IGoalRepository repo, IPlannerEngine plannerEngine, IPlannerRepository plannerRepo, Microsoft.Extensions.Logging.ILogger<GoalService> logger)
        {
            _repo = repo;
            _plannerEngine = plannerEngine;
            _plannerRepo = plannerRepo;
            _logger = logger;
        }

        public async Task CompleteGoalAsync(int userId, string goalIdentifier, CancellationToken cancellation)
        {
            if (string.IsNullOrWhiteSpace(goalIdentifier))
                throw new BadRequestException("Goal identifier is required.");

            var goal = await _repo.GetGoalForUserAsync(userId, goalIdentifier, cancellation);
            if (goal == null) throw new NotFoundException("Goal not found.");

            var completedStatusId = await _plannerRepo.GetStatusIdByNameAsync("Completed", cancellation);
            if (!completedStatusId.HasValue) throw new BadRequestException("Completed status not configured.");

            // Mark goal completed
            await _repo.UpdateGoalStatusAsync(goal.Goalid, completedStatusId.Value, userId, cancellation);

            // Cancel future planned schedules for that goal
            await _plannerRepo.CancelFuturePlannedSchedulesForGoalAsync(goal.Goalid, userId, cancellation);

            // Re-run planner for remaining active goals; log failures but do not block completion
            try
            {
                await _plannerEngine.RunPlannerAsync(userId, EduFlowAI.Enums.PlannerEngine.PlannerEngineType.GoalCompleted, cancellation);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Planner Run failed during CompleteGoalAsync for user {UserId}, goal {GoalIdentifier}", userId, goalIdentifier);
            }
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

        public async Task<CreateGoalResponseDTO> CreateGoalAsync(int userId,CreateGoalRequestDTO dto,CancellationToken cancellationToken)
        {
            if (dto == null)
            {
                throw new BadRequestException(
                    "Goal information is required.");
            }

            if (string.IsNullOrWhiteSpace(dto.GoalTitle))
            {
                throw new BadRequestException(
                    "Goal title is required.");
            }

            if (dto.GoalTitle.Trim().Length > 200)
            {
                throw new BadRequestException(
                    "Goal title cannot exceed 200 characters.");
            }

            if (dto.TargetDate.Date < DateTime.UtcNow.Date)
            {
                throw new BadRequestException(
                    "Target date cannot be in the past.");
            }


            var currentDateTime = DateTimeHelper.GetDateTimeNow();

            var goal = new Goalmanagement
            {
                Goalidentifier =
                    Guid.NewGuid().ToString(),

                Userid = userId,
                Goaltitle = dto.GoalTitle.Trim(),
                Goaldescription = string.IsNullOrWhiteSpace(dto.GoalDescription) ? null : dto.GoalDescription.Trim(),
                Goaltypeid = dto.GoalTypeId,
                Prioritytypeid = dto.PriorityId,
                Targetdate = dto.TargetDate.Date,
                Statusid = 2,
                Createdat = currentDateTime,
                Updatedat = currentDateTime
            };

            goal = await _repo.CreateGoalAsync(goal,cancellationToken);

            return new CreateGoalResponseDTO
            {
                GoalId = goal.Goalid,
                GoalIdentifier =goal.Goalidentifier,
                GoalTitle =goal.Goaltitle
            };
        }

        public async Task<SaveGoalTasksResponseDTO> SaveGoalTasksAsync(int userId,string goalIdentifier,SaveGoalTasksRequestDTO dto,CancellationToken cancellationToken)
        {
            if (dto == null)
            {
                throw new BadRequestException(
                    "Task information is required.");
            }

            if (string.IsNullOrWhiteSpace(goalIdentifier))
            {
                throw new BadRequestException(
                    "Goal identifier is required.");
            }

            var goal = await _repo.GetGoalForUserAsync(
                userId,
                goalIdentifier,
                cancellationToken);

            if (goal == null)
            {
                throw new NotFoundException(
                    "Goal not found.");
            }

            var existingTasks =
                await _repo.GetGoalTasksForUpdateAsync(
                    goal.Goalid,
                    cancellationToken);

            // --------------------------------------------------
            // Validate duplicate task identifiers
            // --------------------------------------------------

            var existingIdentifiers = dto.Tasks
                .Where(x => !string.IsNullOrWhiteSpace(x.TaskIdentifier))
                .Select(x => x.TaskIdentifier!)
                .ToList();

            if (existingIdentifiers.Count !=
                existingIdentifiers.Distinct(
                    StringComparer.OrdinalIgnoreCase).Count())
            {
                throw new BadRequestException(
                    "Duplicate task identifiers were found.");
            }

            // --------------------------------------------------
            // Validate tasks
            // --------------------------------------------------

            foreach (var task in dto.Tasks)
            {
                if (string.IsNullOrWhiteSpace(task.TaskName))
                {
                    throw new BadRequestException(
                        "Task name is required.");
                }

                if (task.EstimatedHours <= 0)
                {
                    throw new BadRequestException(
                        $"Estimated hours must be greater than zero for '{task.TaskName}'.");
                }

                if (task.DueDate.Date < DateTime.UtcNow.Date)
                {
                    throw new BadRequestException(
                        $"Due date cannot be in the past for '{task.TaskName}'.");
                }

                if (task.DueDate.Date > goal.Targetdate.Date)
                {
                    throw new BadRequestException(
                        $"Due date for '{task.TaskName}' cannot be after the goal target date.");
                }

                if (!string.IsNullOrWhiteSpace(task.TaskIdentifier))
                {
                    var existingTask = existingTasks.FirstOrDefault(
                        x => x.Taskidentifier.Equals(
                            task.TaskIdentifier,
                            StringComparison.OrdinalIgnoreCase));

                    if (existingTask == null)
                    {
                        throw new BadRequestException(
                            $"Task '{task.TaskIdentifier}' does not belong to this goal.");
                    }
                }
            }

            var now = DateTimeHelper.GetDateTimeNow();

            var tasksToAdd = new List<Taskmanagement>();

            var tasksToUpdate = new List<Taskmanagement>();

            var requestIdentifiers = new HashSet<string>(
                StringComparer.OrdinalIgnoreCase);

            // --------------------------------------------------
            // Process request
            // --------------------------------------------------

            foreach (var request in dto.Tasks)
            {
                // ----------------------------------------------
                // NEW TASK
                // ----------------------------------------------

                if (string.IsNullOrWhiteSpace(request.TaskIdentifier))
                {
                    var newTask = new Taskmanagement
                    {
                        Taskidentifier = Guid.NewGuid().ToString(),
                        Goalid = goal.Goalid,
                        Taskname = request.TaskName.Trim(),
                        Taskdescription = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim(),
                        Duedate = request.DueDate.Date,
                        Statusid = request.StatusId,
                        Isaigenerated = false,
                        Createdat = now,
                        Updatedat = now,
                        EstimatedHours = request.EstimatedHours
                        
                    };

                    tasksToAdd.Add(newTask);

                    continue;
                }

                // ----------------------------------------------
                // EXISTING TASK
                // ----------------------------------------------

                requestIdentifiers.Add(
                    request.TaskIdentifier);

                var existingTaskToUpdate =
                    existingTasks.First(x =>
                        x.Taskidentifier.Equals(
                            request.TaskIdentifier,
                            StringComparison.OrdinalIgnoreCase));

                existingTaskToUpdate.Taskname = request.TaskName.Trim();
                existingTaskToUpdate.Taskdescription = string.IsNullOrWhiteSpace(request.Description)? null : request.Description.Trim();
                existingTaskToUpdate.Duedate = request.DueDate.Date;
                existingTaskToUpdate.Updatedat = now;

                tasksToUpdate.Add(existingTaskToUpdate);
            }

            // --------------------------------------------------
            // Detect deleted tasks
            // --------------------------------------------------

            var tasksToDelete = existingTasks.Where(existingTask =>!requestIdentifiers.Contains(existingTask.Taskidentifier)) .ToList();

            // --------------------------------------------------
            // Save everything atomically
            // --------------------------------------------------

            await _repo.SaveGoalTaskChangesAsync(tasksToAdd,tasksToUpdate,tasksToDelete,cancellationToken);

            // Trigger planner: if new tasks added -> TaskAdded, else if updated -> TaskUpdated
            try
            {
                if (tasksToAdd.Count > 0)
                {
                    try
                    {
                        await _plannerEngine.RunPlannerForGoalAsync(userId, goal.Goalid, EduFlowAI.Enums.PlannerEngine.PlannerEngineType.TaskAdded, cancellationToken);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Planner Run failed during SaveGoalTasksAsync (TaskAdded) for user {UserId}, goal {GoalIdentifier}", userId, goal.Goalidentifier);
                    }
                }
                else if (tasksToUpdate.Count > 0)
                {
                    try
                    {
                        await _plannerEngine.RunPlannerForGoalAsync(userId, goal.Goalid, EduFlowAI.Enums.PlannerEngine.PlannerEngineType.TaskUpdated, cancellationToken);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Planner Run failed during SaveGoalTasksAsync (TaskUpdated) for user {UserId}, goal {GoalIdentifier}", userId, goal.Goalidentifier);
                    }
                }
            }
            catch
            {
                // planner failures should not block task save
            }

            // --------------------------------------------------
            // Return the complete current task list
            // --------------------------------------------------

            var responseTasks =
                tasksToAdd
                    .Select(x => new SavedGoalTaskResponseDTO
                    {
                        TaskId = x.Taskid,
                        TaskIdentifier =x.Taskidentifier,
                        TaskName =x.Taskname
                    })
                    .Concat(
                        tasksToUpdate.Select(x =>
                            new SavedGoalTaskResponseDTO
                            {
                                TaskId = x.Taskid,
                                TaskIdentifier =x.Taskidentifier,
                                TaskName =x.Taskname
                            }))
                    .ToList();

            return new SaveGoalTasksResponseDTO
            {
                Tasks = responseTasks
            };
        }
    }
}
