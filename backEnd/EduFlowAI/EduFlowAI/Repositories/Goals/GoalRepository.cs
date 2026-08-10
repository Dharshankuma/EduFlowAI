using EduFlowAI.Data;
using EduFlowAI.DTO.Goals.Requests;
using EduFlowAI.Helpers;
using EduFlowAI.Models;
using EduFlowAI.Repositories.Goals.Models;
using Microsoft.EntityFrameworkCore;

namespace EduFlowAI.Repositories.Goals
{
    public sealed class GoalRepository : IGoalRepository
    {
        private readonly EduFlowDbContext _context;

        public GoalRepository(EduFlowDbContext context)
        {
            _context = context;
        }


        public async Task<List<GoalGridQueryModel>> GetGoalGridAsync(int userId,GoalsGridRequestDTO objdto,CancellationToken cancellation)
        {
            var query =  _context.Goalmanagements.AsNoTracking().Where(x => x.Userid == userId);

            //implementing the search
            var search = objdto.GoalSearch;
            if (!string.IsNullOrEmpty(search)){
                search = search.ToLower().Trim();

                query = query.Where(x => x.Goaltitle.Contains(search) || (x.Goaldescription != null & x.Goaldescription.Contains(search)));
            }

            //Status filter
            var statusId = objdto.StatusId;
            if (!statusId.HasValue)
            {
                query = query.Where(x => x.Statusid == statusId);
            }

            //goalType Filter
            var goalTypeId = objdto.GoalType;
            if (!goalTypeId.HasValue)
            {
                query = query.Where(x => x.Goaltypeid == goalTypeId);
            }

            //priority filter
            var priorityId = objdto.PriorityId;
            if (!priorityId.HasValue)
            {
                query = query.Where(x => x.Prioritytypeid == priorityId);
            }


            //projectedQuery to calculate the total tasks, completed tasks, progress , next sessions
            var projectedQuery = query.Select(x => new GoalGridQueryModel
            {
                GoalId = x.Goalid,
                GoalIdentifier = x.Goalidentifier,
                GoalTitle = x.Goaltitle,
                GoalType = x.Goaltype.Goaltype,
                Priority = x.Prioritytype.Priority,
                Status = x.Status.Status,
                TargetDate = x.Targetdate,
                CreatedAt = x.Createdat,

                TotalTasks = x.Taskmanagements.Count(),
                CompletedTasks = x.Taskmanagements.Count(x => x.Statusid == 3),
                RemainingTasks = x.Taskmanagements.Count(x => x.Statusid != 3),

                ProgressPercentage = x.Taskmanagements.Count() == 0 ? 0 :
                                                        Math.Round(
                                                        (decimal)x.Taskmanagements.Count(t => t.Statusid == 3) * 100 / x.Taskmanagements.Count(), 2),

                NextSession = x.Schedulemanagements.Where(s => s.Scheduleddate >= DateTime.UtcNow)
                                                    .OrderBy(s => s.Scheduleddate).Select(s => (DateTime?)s.Scheduleddate).FirstOrDefault()
            });


            //sorting
            var sortBy = objdto.SortBy;
            projectedQuery = sortBy.ToLower() switch
            {
                "oldest" => projectedQuery.OrderBy(x => x.CreatedAt),

                "newest" => projectedQuery.OrderByDescending(x=>x.CreatedAt),

                "progress" => projectedQuery.OrderByDescending(x=>x.ProgressPercentage).ThenByDescending(x=>x.CreatedAt),

                "duedate" => projectedQuery.OrderBy(x=>x.TargetDate).ThenByDescending(x=>x.CreatedAt),

                "priority" => projectedQuery
                                   .OrderBy(x =>
                                         x.Priority == "High" ? 1 :
                                         x.Priority == "Medium" ? 2 :
                                         x.Priority == "Low" ? 3 : 4)
                                         .ThenByDescending(x => x.CreatedAt),
                                   _ =>
                                      projectedQuery
                                        .OrderByDescending(x => x.CreatedAt)
            };

            var skip = (objdto.PageNumber - 1) * objdto.PageSize;

            return await projectedQuery.Skip(skip).Take(objdto.PageSize).ToListAsync(cancellation);
        }
    }
}
