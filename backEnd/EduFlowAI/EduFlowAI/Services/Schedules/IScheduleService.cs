using System.Threading;

namespace EduFlowAI.Services.Schedules
{
    public interface IScheduleService
    {
        Task UpdateScheduleStatusAsync(int userId, int scheduleId, string newStatusIdentifier, CancellationToken cancellation);
    }
}
