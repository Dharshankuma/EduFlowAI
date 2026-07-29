using System.Net;
using System.Text.Json;
using EduFlowAI.Exceptions;
using EduFlowAI.Responses;

namespace EduFlowAI.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(
            RequestDelegate next,
            ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception exception)
            {
                _logger.LogError(
                    exception,
                    "An unhandled exception occurred.");

                await HandleExceptionAsync(context, exception);
            }
        }

        private static async Task HandleExceptionAsync(
            HttpContext context,
            Exception exception)
        {
            var response = new ErrorResponse
            {
                Success = false,
                TraceId = context.TraceIdentifier
            };

            if (exception is CustomException baseException)
            {
                response.StatusCode = (int)baseException.StatusCode;
                response.Message = baseException.Message;

                context.Response.StatusCode = response.StatusCode;
            }
            else
            {
                response.StatusCode = (int)HttpStatusCode.InternalServerError;
                response.Message = "An unexpected error occurred.";

                context.Response.StatusCode = response.StatusCode;
            }

            context.Response.ContentType = "application/json";

            await context.Response.WriteAsync(
                JsonSerializer.Serialize(response));
        }
    }
}