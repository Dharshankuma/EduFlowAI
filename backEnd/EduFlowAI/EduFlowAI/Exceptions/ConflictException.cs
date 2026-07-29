using System.Net;

namespace EduFlowAI.Exceptions
{
    public sealed class ConflictException : CustomException
    {
        public ConflictException(string message) : base(message, HttpStatusCode.Conflict)
        {
        }

        public ConflictException(string message, Exception innerException) : base(message, innerException, HttpStatusCode.Conflict)
        {
        }
    }
}
