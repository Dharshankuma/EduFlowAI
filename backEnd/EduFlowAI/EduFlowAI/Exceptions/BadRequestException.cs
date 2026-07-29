using System.Net;

namespace EduFlowAI.Exceptions
{
    public sealed class BadRequestException : CustomException
    {
        public BadRequestException(string message)
            : base(message, HttpStatusCode.BadRequest)
        {
        }

        public BadRequestException(string message, Exception innerException) : base(message,innerException,HttpStatusCode.BadRequest)
        {
        }
    }
}
