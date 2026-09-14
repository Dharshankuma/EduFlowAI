namespace EduFlowAI.Extensions
{
    public static class CorsExtensions
    {
        private const string corsPolicy = "AllowReactApp";
        public static IServiceCollection AddCorsConfiguration(this IServiceCollection services,IConfiguration configuration)
        {

            var allowedOrigins = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();

            services.AddCors(options =>
            {
                options.AddPolicy(corsPolicy, policy =>
                {
                    policy
                        .WithOrigins(allowedOrigins ?? [])
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });            

            return services;
        }


        public static WebApplication UseCorsConfiguration(this WebApplication app)
        {
            app.UseCors(corsPolicy);

            return app;
        }
    }
}
