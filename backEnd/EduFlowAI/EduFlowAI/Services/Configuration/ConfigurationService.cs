using EduFlowAI.Data;
using EduFlowAI.DTO.Configuration;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace EduFlowAI.Services.Configuration
{
    public class ConfigurationService : IConfigurationService
    {
        private readonly EduFlowDbContext _context;


        public ConfigurationService(EduFlowDbContext context)
        {
            _context = context;
        }

        public async Task<ConfigurationResponse> GetConfigurationDetails(CancellationToken cancellation)
        {
            var statusData = await _context.Statusmasters
                .Select(x => new { x.Statusidentifier, x.Status })
                .ToListAsync(cancellation);

            var priorityData = await _context.Prioritymasters
                .Select(x => new { x.Priorityidentifier, x.Priority })
                .ToListAsync(cancellation);
    
            var goalTypeData = await _context.Prioritymasters   
                .Select(x => new { x.Priorityidentifier, x.Priority })
                .ToListAsync(cancellation);


            return new ConfigurationResponse
            {
                ConfigurationDetails = new
                {
                    StatusData = statusData,
                    PriorityData = priorityData,
                    GoalTypeData = goalTypeData
                }
            };
        }
    }
}
