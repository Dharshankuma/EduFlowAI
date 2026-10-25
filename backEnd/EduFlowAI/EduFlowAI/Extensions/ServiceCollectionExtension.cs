using EduFlowAI.Helpers;
using EduFlowAI.Repositories.Authentication;
using EduFlowAI.Repositories.Goals;
using EduFlowAI.Repositories.Profiles;
using EduFlowAI.Services.Authentication;
using EduFlowAI.Services.EmailTemplatesService;
using EduFlowAI.Services.EmailTemplatesService.Authentication;
using EduFlowAI.Services.Goals;
using EduFlowAI.Services.Profiles;
using EduFlowAI.PlannerEngine;
using EduFlowAI.Validators;
using FluentValidation;
using FluentValidation.AspNetCore;
using EduFlowAI.Services.Schedules;
using EduFlowAI.Services.Configuration;
using EduFlowAI.Repositories.Calendar;
using EduFlowAI.Services.Calendar;
using EduFlowAI.Repositories.Dashboard;
using EduFlowAI.Services.Dashboard;

namespace EduFlowAI.Extensions
{
    public static class ServiceCollectionExtension
    {
        public static IServiceCollection RegisterApplicationServices(this IServiceCollection services)
        {

            //Fluent Validation 
            services.AddFluentValidationAutoValidation();
            services.AddValidatorsFromAssemblyContaining<LoginRequestValidators>();


            //Helpers 
            services.AddScoped<JWTHelper>();

            //Repositories
            services.AddScoped<IAuthenticationRepository,AuthenticationRepository>();
            services.AddScoped<IProfileRepository, ProfileRepository>();
            services.AddScoped<IGoalRepository, GoalRepository>();
            services.AddScoped<ICalendarRepository, CalendarRepository>();
            services.AddScoped<IDashboardRepository, DashboardRepository>();


            //Services
            services.AddScoped<IAuthenticationService, AuthenticationService>();
            services.AddScoped<IAuthenticationEmailTemplateService, AuthenticationEmailTemplateService>();
            services.AddScoped<IProfileService, ProfileService>();
            services.AddScoped<IGoalService, GoalService>();
            services.AddScoped<ICalendarService, CalendarService>();
            services.AddScoped<IDashboardService, DashboardService>();

            // Planner Engine
            services.AddScoped<IPlannerRepository, PlannerRepository>();
            services.AddScoped<IPlannerEngine, PlannerEngineService>();
            services.AddSingleton(new PlannerOptions());
            // Schedule service for status updates
            services.AddScoped<IScheduleService, ScheduleService>();
            services.AddScoped<IConfigurationService, ConfigurationService>();


            return services;
        }
    }
}
