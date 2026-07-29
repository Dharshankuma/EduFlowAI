namespace EduFlowAI.Extensions
{
    public static class OpenAPIExtensions
    {
        public static IServiceCollection AddOpenApiDocumentation(this IServiceCollection services)
        {
            services.AddOpenApi();
            return services;
        }

        public static WebApplication UseOpenApiDocumentation(this WebApplication app)
        {
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            return app;
        }
    }
}
