namespace EduFlowAI.Extensions
{
    public static class CorsExtensions
    {
        private const string corsPolicy = "AllowReactApp";
        public static IServiceCollection AddCorsConfiguration(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy(corsPolicy, policy =>
                {
                    policy
                        .AllowAnyOrigin()
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
