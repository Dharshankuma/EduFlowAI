using EduFlowAI.Configurations;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace EduFlowAI.Extensions
{
    public static class AuthenticationExtenstion
    {
        public static IServiceCollection AddJwtAuthentication(this IServiceCollection services,IConfiguration configuration,IWebHostEnvironment environment)
        {
            bool isDevelopment = environment.IsDevelopment();
            var jwtSettings = new JwtSettings();

            configuration.GetSection(JwtSettings.SectionName).Bind(jwtSettings);

            services.Configure<JwtSettings>(
                configuration.GetSection(JwtSettings.SectionName));

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = !isDevelopment;
                options.SaveToken = true;

                options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,

                    ValidIssuer = jwtSettings.Issuer,
                    ValidAudience = jwtSettings.Audience,

                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SecretKey)),

                    ClockSkew = TimeSpan.Zero
                };
            });

            services.AddAuthorization();


            return services;
                
        }
    }
}
