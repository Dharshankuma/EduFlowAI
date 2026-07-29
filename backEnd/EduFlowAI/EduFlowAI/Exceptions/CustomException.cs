using System.Net;

namespace EduFlowAI.Exceptions
{
    public abstract class CustomException : Exception
    {
        public HttpStatusCode StatusCode { get; }
        protected CustomException(string message, HttpStatusCode statusCode) : base(message)
        {
            StatusCode = statusCode;
        }

        protected CustomException(string message, Exception innerException, HttpStatusCode statusCode)
            : base(message, innerException)
        {
            StatusCode = statusCode;
        }
    }
}
