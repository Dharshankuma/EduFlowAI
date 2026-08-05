using EduFlowAI.DTO.Profiles.Requests;
using EduFlowAI.DTO.Profiles.Responses;
using EduFlowAI.Enums;
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

                WeeklyAvailability = availability.OrderBy(x => x.DayOfWeek).Select(x => new WeeklyAvailabilityResponseDTO
                {
                    DayOfWeek = ((WeekDays)x.DayOfWeek).ToString(),
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

        public async Task UpdatePersonalInformationAsync(int userId,PersonalInformationRequestDTO dto,CancellationToken cancellationToken)
        {
            var user = await _repo.GetUserDetailsByIdAsync(userId, cancellationToken);

            if (user == null)
            {
                throw new NotFoundException("User not found.");
            }

            var userName = dto.UserName.Trim();
            var firstName = dto.FirstName.Trim();
            var lastName = dto.LastName.Trim();

            // Check username uniqueness only if the username is changing
            if (!string.Equals(user.Username, userName, StringComparison.OrdinalIgnoreCase))
            {
                var existingUser = await _repo.GetUserDetailsByUserNameAsync(userName, cancellationToken);

                if (existingUser != null && existingUser.Userid != userId)
                {
                    throw new BadRequestException("Username already exists.");
                }

                user.Username = userName;
            }

            user.Firstname = firstName;
            user.Lastname = lastName;
            user.Updatedat = DateTimeHelper.GetDateTimeNow();
            user.Usertimezone = dto.UserTimeZone;

            await _repo.UpdateUserProfileAsync(user, cancellationToken);
        }

        public async Task UpdateWeekAvailability(int userId,WeeklyAvailabilityRequestDTO dto,CancellationToken cancellationToken)
        {
            var availability = await _repo.GetWeekAvailabilityAsync(
                userId,
                cancellationToken);

            if (!availability.Any())
            {
                throw new NotFoundException("Weekly availability not found.");
            }

            var availabilityLookup = availability.ToDictionary(
                x => x.DayOfWeek);

            var currentTime = DateTimeHelper.GetDateTimeNow();

            foreach (var request in dto.Availability)
            {
                var requestedDay = (int)request.DayOfWeek;

                if (!availabilityLookup.TryGetValue(requestedDay, out var day))
                {
                    throw new NotFoundException(
                        $"Availability for '{request.DayOfWeek}' was not found.");
                }

                if (!request.IsEnabled)
                {
                    day.Isenable = false;
                    day.StartTime = null;
                    day.EndTime = null;
                    day.Availablehours = 0;
                    day.Updatedat = currentTime;

                    continue;
                }

                if (!request.StartTime.HasValue)
                {
                    throw new BadRequestException(
                        $"Start time is required for {request.DayOfWeek}.");
                }

                if (!request.EndTime.HasValue)
                {
                    throw new BadRequestException(
                        $"End time is required for {request.DayOfWeek}.");
                }

                if (request.StartTime.Value >= request.EndTime.Value)
                {
                    throw new BadRequestException(
                        $"Start time must be earlier than End time for {request.DayOfWeek}.");
                }

                day.Isenable = true;
                day.StartTime = request.StartTime;
                day.EndTime = request.EndTime;
                day.Availablehours =
                    (decimal)(request.EndTime.Value - request.StartTime.Value).TotalHours;
                day.Updatedat = currentTime;
            }

            await _repo.UpdateWeeklyAvailability(availability,cancellationToken);
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

