using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EduFlowAI.Enums.PlannerEngine;
using EduFlowAI.PlannerEngine.Models;
using EduFlowAI.Models;
using EduFlowAI.Helpers;
using EduFlowAI.Constants;

namespace EduFlowAI.PlannerEngine
{
    public sealed class PlannerEngineService : IPlannerEngine
    {
        private readonly IPlannerRepository _repo;
        private readonly PlannerOptions _options;

        public PlannerEngineService(IPlannerRepository repo, PlannerOptions options)
        {
            _repo = repo;
            _options = options;
        }

        public async Task<PlannerResult> RunPlannerAsync(int userId, PlannerEngineType trigger, CancellationToken cancellation)
        {
            return await RunInternalPlannerAsync(userId, null, trigger, cancellation);
        }

        public async Task<PlannerResult> RunPlannerForGoalAsync(int userId, int goalId, PlannerEngineType trigger, CancellationToken cancellation)
        {
            return await RunInternalPlannerAsync(userId, goalId, trigger, cancellation);
        }

        private async Task<PlannerResult> RunInternalPlannerAsync(int userId, int? targetGoalId, PlannerEngineType trigger, CancellationToken cancellation)
        {
            var result = new PlannerResult();

            // 1. Load planning context
            var context = new PlanningContext
            {
                UserId = userId,
                Options = _options,
                Availability = await _repo.GetWeekAvailabilityAsync(userId, cancellation),
                ActiveGoals = await _repo.GetActiveGoalsWithTasksAsync(userId, cancellation),
                ExistingFutureSchedules = await _repo.GetFutureSchedulesAsync(userId, DateTime.UtcNow.Date, cancellation)
            };

            // 2. Build task plan models and compute remaining work
            var allTasks = context.ActiveGoals.SelectMany(g => g.Taskmanagements ?? Enumerable.Empty<Taskmanagement>()).ToList();
            var taskIds = allTasks.Select(t => t.Taskid).ToList();
            var completedHoursMap = await _repo.GetCompletedHoursForTasksAsync(taskIds, cancellation);
            var completedStatusId = await _repo.GetStatusIdByNameAsync(StatusConstants.Completed, cancellation);

            var tasks = new List<TaskPlanModel>();
            foreach (var goal in context.ActiveGoals)
            {
                // If targetGoalId is provided, only plan tasks for that specific goal
                if (targetGoalId.HasValue && goal.Goalid != targetGoalId.Value) continue;

                foreach (var task in goal.Taskmanagements ?? Enumerable.Empty<Taskmanagement>())
                {
                    if (completedStatusId.HasValue && task.Statusid == completedStatusId.Value) continue;

                    var estimated = task.EstimatedHours ?? 0m;
                    var completedHours = completedHoursMap.ContainsKey(task.Taskid) ? completedHoursMap[task.Taskid] : 0m;
                    var remaining = estimated - completedHours;

                    if (remaining <= 0) continue;

                    tasks.Add(new TaskPlanModel
                    {
                        TaskId = task.Taskid,
                        TaskIdentifier = task.Taskidentifier,
                        TaskName = task.Taskname,
                        DueDate = task.Duedate,
                        EstimatedHours = estimated,
                        RemainingHours = remaining,
                        PriorityTypeId = goal.Prioritytypeid,
                        StatusId = task.Statusid,
                        GoalId = goal.Goalid,
                        GoalPriority = goal.Prioritytype?.Priority
                    });
                }
            }

            if (!tasks.Any())
            {
                result.Message = "No plannable tasks with remaining work found for the specified scope.";
                return result;
            }

            // 3. Generate available time slots
            var now = DateTimeHelper.GetDateTimeNow();
            var startDate = now.Date;
            var horizon = _options.PlanningHorizonDays;

            var freeIntervals = new List<AvailableSlot>();
            for (int i = 0; i < horizon; i++)
            {
                cancellation.ThrowIfCancellationRequested();
                var date = startDate.AddDays(i);
                int dow = date.DayOfWeek == DayOfWeek.Sunday ? 7 : (int)date.DayOfWeek;

                var availability = context.Availability.FirstOrDefault(a => a.DayOfWeek == dow && a.Isenable);
                if (availability == null || !availability.StartTime.HasValue || !availability.EndTime.HasValue) continue;

                var slotStart = date.Add(availability.StartTime.Value.ToTimeSpan());
                var slotEnd = date.Add(availability.EndTime.Value.ToTimeSpan());
                if (slotEnd <= slotStart) continue;

                var dayOccupied = context.ExistingFutureSchedules
                    .Where(s => s.Scheduleddate.Date == date.Date)
                    .Select(s => (Start: s.Scheduleddate, End: s.Scheduleddate.AddHours((double)s.Plannedhours)))
                    .ToList();

                var dayFree = new List<AvailableSlot> { new AvailableSlot { Start = slotStart, End = slotEnd } };

                foreach (var occ in dayOccupied)
                {
                    var nextFree = new List<AvailableSlot>();
                    foreach (var free in dayFree)
                    {
                        if (occ.End <= free.Start || occ.Start >= free.End)
                        {
                            nextFree.Add(free);
                        }
                        else
                        {
                            if (occ.Start > free.Start)
                                nextFree.Add(new AvailableSlot { Start = free.Start, End = occ.Start });
                            if (occ.End < free.End)
                                nextFree.Add(new AvailableSlot { Start = occ.End, End = free.End });
                        }
                    }
                    dayFree = nextFree;
                }
                freeIntervals.AddRange(dayFree);
            }

            // 4. Chunk free intervals into sessions
            var sessionMinutes = _options.SessionDurationMinutes;
            var chunkSlots = new List<AvailableSlot>();
            foreach (var free in freeIntervals.OrderBy(f => f.Start))
            {
                var cursor = free.Start;
                while (cursor.AddMinutes(sessionMinutes) <= free.End)
                {
                    chunkSlots.Add(new AvailableSlot { Start = cursor, End = cursor.AddMinutes(sessionMinutes) });
                    cursor = cursor.AddMinutes(sessionMinutes);
                }
                if (cursor < free.End)
                    chunkSlots.Add(new AvailableSlot { Start = cursor, End = free.End });
            }

            // 5. Priority Scoring
            foreach (var t in tasks)
            {
                var basePriority = 4;
                var p = t.GoalPriority?.Trim().ToLower();
                if (p == "high") basePriority = 1;
                else if (p == "medium") basePriority = 2;
                else if (p == "low") basePriority = 3;

                var daysUntilDue = (t.DueDate.Date - startDate).Days;
                var boost = 0;
                if (daysUntilDue <= _options.StarvationWindowDays)
                    boost = Math.Max(0, _options.StarvationWindowDays - daysUntilDue + 1);

                t.PriorityTypeId = Math.Max(1, basePriority - boost);
            }

            var orderedTasks = tasks.OrderBy(t => t.DueDate)
                                    .ThenBy(t => t.PriorityTypeId)
                                    .ThenByDescending(t => t.RemainingHours)
                                    .ToList();

            var drafts = new List<ScheduleDraft>();
            var availableChunks = chunkSlots.OrderBy(c => c.Start).ToList();

            // 6. Allocation Loop
            foreach (var task in orderedTasks)
            {
                var remaining = task.RemainingHours;
                
                for (int i = 0; i < availableChunks.Count && remaining > 0; i++)
                {
                    var chunk = availableChunks[i];
                    if (chunk.Start.Date > task.DueDate.Date) break;

                    var chunkHours = chunk.DurationHours;
                    if (chunkHours <= 0) continue;

                    var allocate = Math.Min(chunkHours, remaining);

                    drafts.Add(new ScheduleDraft
                    {
                        TaskId = task.TaskId,
                        ScheduledDate = chunk.Start,
                        PlannedHours = allocate
                    });

                    remaining -= allocate;

                    var newStart = chunk.Start.AddHours((double)allocate);
                    availableChunks[i] = new AvailableSlot { Start = newStart, End = chunk.End };

                    if (remaining > 0 && availableChunks[i].DurationHours > 0)
                    {
                        i--; 
                    }
                }

                if (remaining > 0)
                    result.Warnings.Add($"Task {task.TaskName} (id:{task.TaskId}) could not be fully scheduled. Unscheduled hours: {remaining}.");
            }

            // 7. Persistence
            var schedulesToSave = new List<Schedulemanagement>();
            var plannedStatusId = await _repo.GetStatusIdByNameAsync(StatusConstants.Planned, cancellation);
            var nowTime = DateTimeHelper.GetDateTimeNow();

            foreach (var d in drafts)
            {
                var taskEntity = allTasks.FirstOrDefault(t => t.Taskid == d.TaskId);
                if (taskEntity == null) continue;

                schedulesToSave.Add(new Schedulemanagement
                {
                    Scheduleidentifier = Guid.NewGuid().ToString(),
                    Taskid = d.TaskId,
                    Goalid = taskEntity.Goalid,
                    Scheduleddate = d.ScheduledDate,
                    Plannedhours = d.PlannedHours,
                    Statusid = plannedStatusId,
                    Createdby = userId,
                    Createdat = nowTime
                });
            }

            await _repo.SaveSchedulesAsync(schedulesToSave, cancellation);
            result.CreatedSchedules = drafts;
            result.Message = "Planning complete.";
            return result;
        }
    }
}
