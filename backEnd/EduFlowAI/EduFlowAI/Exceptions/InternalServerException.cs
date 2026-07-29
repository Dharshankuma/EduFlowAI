using System.Net;

namespace EduFlowAI.Exceptions
{
    public sealed class InternalServerException : CustomException
    {
        public InternalServerException(string message) : base(message, HttpStatusCode.InternalServerError)
        {

        }


        public InternalServerException(string message, Exception innerException) : base(message, innerException, HttpStatusCode.InternalServerError)
        {

        }
    }
}
