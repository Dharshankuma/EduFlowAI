using System.Net;

namespace EduFlowAI.Exceptions
{
    public sealed class ForbiddenException : CustomException
    {
        public ForbiddenException(string message) : base(message, HttpStatusCode.Forbidden)
        {
        }

        public ForbiddenException(string message, Exception innerException)
            : base(message, innerException, HttpStatusCode.Forbidden)
        {
        }
    }
}
