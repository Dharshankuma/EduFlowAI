using System.Net;

namespace EduFlowAI.Exceptions
{
    public sealed class UnauthorizedException : CustomException
    {
        public UnauthorizedException(string message) : base(message, HttpStatusCode.Unauthorized)
        {
        }

        public UnauthorizedException(string message, Exception innerException) : base(message, innerException, HttpStatusCode.Unauthorized)
        {
        }
    }
}
