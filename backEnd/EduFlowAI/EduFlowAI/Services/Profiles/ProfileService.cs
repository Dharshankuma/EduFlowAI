using EduFlowAI.DTO.Profiles.Responses;
using EduFlowAI.Exceptions;
using EduFlowAI.Helpers;
using EduFlowAI.Models;
using EduFlowAI.Repositories.Profiles;

namespace EduFlowAI.Services.Profiles
{
    public class ProfileService : IProfileService
    {
        private readonly IProfileRepository _repo;

        public ProfileService(IProfileRepository repo)
        {
            _repo = repo;
        }

        public async Task<ProfileResponseDTO> GetProfileAsync(int userId, CancellationToken cancellation)
        {
            var userTask = _repo.GetUserDetailsByIdAsync(userId, cancellation);

            var availabilityTask = _repo.GetWeekAvailabilityAsync(userId, cancellation);

            var summaryTask = _repo.GetProfileSummaryResponseAsync(userId, cancellation);

            var studyStatusTask = _repo.GetDailyStudyStatusAsync(userId, cancellation);

            await Task.WhenAll(userTask, availabilityTask, summaryTask, studyStatusTask);

            var user = await userTask;

            if(user == null)
            {
                throw new NotFoundException("User Not Found");
            }

            var availability = await availabilityTask;
            var summary = await summaryTask;
            var studyStatus = await studyStatusTask;

            var response = new ProfileResponseDTO
            {
                ProfileHeader = new ProfileHeaderResponseDTO
                {
                    FullName = $"{user.Firstname} {user.Lastname}",
                    MemberSince = DateTimeHelper.FormatMemberSince(user.Createdat),
                    LastLogin = DateTimeHelper.FormatLastLogin(user.Lastloginat),
                },

                PersonalInformation = new PersonalInformationResponseDTO
                {
                    FirstName = user.Firstname,
                    LastName = user.Lastname,
                    UserName = user.Lastname,
                    EmailId = user.Emailid,
                    TimeZoneOffset = user.Usertimezone
                },

                WeeklyAvailability = availability.Select(x => new WeeklyAvailabilityResponseDTO
                {
                    DayOfWeek = Enum.Parse<DayOfWeek>(x.Dayofweek),
                    IsEnable = x.Isenable,
                    StartTime = x.StartTime,
                    EndTime = x.EndTime,
                    AvailableHours = x.Availablehours
                }).ToList(),

                ProfileSummary = new ProfileSummaryResponseDTO
                {
                    TotalActiveGoals = summary.TotalActiveGoals,
                    TotalCompletedTasks = summary.TotalCompletedTasks,
                    TotalStudyHours = summary.TotalStudyHours,
                    TotalStudyStreak = CalculateStudyStreak(studyStatus),
                    TotalWeeklyHours = CalculateWeeklyHours(availability),
                    TotalActiveStudyDays = CalculateActiveDays(availability),
                    AverageDailyStudy = CalculateAverageDailyStudy(availability)
                }
            };

            return response;
        }

        private static int CalculateStudyStreak(List<DailyStudyStatusResponseDTO> studyDays)
        {
            if (!studyDays.Any())
            {
                return 0;
            }

            int streak = 0;

            DateTime expectedDate = DateTime.Now;

            foreach(var day in studyDays)
            {
                if (day.StudyDate != expectedDate)
                    break;

                if (!day.IsCompleted)
                    break;

                streak++;

                expectedDate = expectedDate.AddDays(-1);
            }

            return streak;
        }

        private static decimal CalculateWeeklyHours(List<Useravailability> availability)
        {
            return availability.Where(x => x.Isenable).Sum(x => x.Availablehours);
        }

        private static int CalculateActiveDays(List<Useravailability> availability)
        {
            return availability.Count(x => x.Isenable);
        }

        private static decimal CalculateAverageDailyStudy(List<Useravailability> availability)
        {
            var activeDays = availability.Count(x => x.Isenable);

            if(activeDays == 0)
            {
                return 0;
            }

            var totalHours = availability.Where(x=> x.Isenable).Sum(y => y.Availablehours);


            return totalHours / activeDays;
        } 
    }
}
