using EduFlowAI.Data;
using EduFlowAI.Exceptions;
using EduFlowAI.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace EduFlowAI.Helpers
{
    public static class CommonHelper
    {
        
        public static string GenerateFixedGuidString(int range)
        {
            return Guid.NewGuid().ToString().Substring(0, range);
        }

        public static string GenerateGuidString()
        {
            return Guid.NewGuid().ToString();
        }

        
    }
}
