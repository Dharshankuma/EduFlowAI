using EduFlowAI.Data;
using EduFlowAI.DTO.Profiles.Responses;
using EduFlowAI.Models;
using Microsoft.EntityFrameworkCore;

namespace EduFlowAI.Repositories.Profiles
{
    public class ProfileRepository : IProfileRepository
    {
        private readonly EduFlowDbContext _context;

        public ProfileRepository(EduFlowDbContext context)
        {
            _context = context;
        }

        public async Task<User> GetUserDetailsByIdAsync(int userId,CancellationToken cancellation)
        {
            return await _context.Users.AsNoTracking().FirstOrDefaultAsync(x => x.Userid == userId,cancellation);
        }

        public async Task<ProfileSummaryResponseDTO> GetProfileSummaryResponseAsync(int userId,CancellationToken cancellation)
        {
            var completedTasksCount = await _context.Taskmanagements.AsNoTracking().CountAsync(x => x.Createdby == userId && x.Statusid == 3, cancellation);


            var activeGoalsCount = await _context.Goalmanagements.AsNoTracking().CountAsync(x => x.Userid == userId && x.Statusid == 3, cancellation);


            var totalStudyHours = await _context.Schedulemanagements.AsNoTracking().Where(x => x.Createdby == userId).SumAsync(x => (decimal?)x.Plannedhours, cancellation) ?? 0;


            return new ProfileSummaryResponseDTO
            {
                TotalActiveGoals = activeGoalsCount,
                TotalCompletedTasks = completedTasksCount,
                TotalStudyHours = totalStudyHours
            };
        }

        public async Task<List<DailyStudyStatusResponseDTO>> GetDailyStudyStatusAsync(int userId, CancellationToken cancellation)
        {
            return await _context.Schedulemanagements.AsNoTracking()
                       .Where(x => x.Createdby == userId).GroupBy(x => x.Scheduleddate.Date)
                       .Select(group => new DailyStudyStatusResponseDTO
                       {
                           StudyDate = group.Key,
                           IsCompleted = group.All(x => x.Statusid == 3)
                       })
                       .OrderByDescending(x => x.StudyDate).ToListAsync(cancellation);
        }

        public async Task<List<Useravailability>> GetWeekAvailabilityAsync(int userId, CancellationToken cancellation)
        {
            return await _context.Useravailabilities.AsNoTracking().Where(x => x.Userid == userId).OrderBy(x => x.Availabilityid).ToListAsync(cancellation);
        }

    }
}
