using EduFlowAI.Helpers;
using EduFlowAI.Repositories.Authentication;
using EduFlowAI.Services.Authentication;
using EduFlowAI.Services.EmailTemplatesService;
using EduFlowAI.Services.EmailTemplatesService.Authentication;
using EduFlowAI.Validators;
using FluentValidation;
using FluentValidation.AspNetCore;

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


            //Services
            services.AddScoped<IAuthenticationService, AuthenticationService>();
            services.AddScoped<IAuthenticationEmailTemplateService, AuthenticationEmailTemplateService>();


            return services;
        }
    }
}
