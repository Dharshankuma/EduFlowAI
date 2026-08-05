using EduFlowAI.Data;
using EduFlowAI.DTO.Profiles.Responses;
using EduFlowAI.Enums;
using EduFlowAI.Helpers;
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

        public async Task UpdateUserProfileAsync(User user, CancellationToken cancellation)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync(cancellation);
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

        public async Task<User> GetUserDetailsByUserNameAsync(string userName, CancellationToken cancellation)
        {
            return await _context.Users.AsNoTracking().FirstOrDefaultAsync(x => x.Username == userName);
        }

        public async Task UpdateWeeklyAvailability(List<Useravailability> availablity,CancellationToken cancellation)
        {
            _context.Useravailabilities.UpdateRange(availablity);
            await _context.SaveChangesAsync(cancellation);
        }

        public async Task CreateDefaultAvailabilityAsync(int userId, CancellationToken cancellation)
        {
            var currentTime = DateTimeHelper.GetDateTimeNow();

            var weekAvailability = new List<Useravailability>();

            foreach(WeekDays day in Enum.GetValues<WeekDays>())
            {
                bool isWeekEnd = day == WeekDays.Saturday || day == WeekDays.Sunday;

                weekAvailability.Add(new Useravailability
                {
                    Userid = userId,
                    DayOfWeek = (int)day,
                    Isenable = !isWeekEnd,
                    StartTime = isWeekEnd ? null : new TimeOnly(9, 0),
                    EndTime = isWeekEnd ? null : new TimeOnly(17, 0),
                    Availablehours = isWeekEnd ? 0 : 8,
                    Createdat = DateTimeHelper.GetDateTimeNow(),
                    Createdby = userId
                });

                await _context.Useravailabilities.AddRangeAsync(weekAvailability,cancellation);
                await _context.SaveChangesAsync(cancellation);
            }
        }
    }
}
