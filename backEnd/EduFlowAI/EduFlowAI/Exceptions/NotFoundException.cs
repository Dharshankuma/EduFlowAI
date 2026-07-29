using System.Net;


namespace EduFlowAI.Exceptions
{
    public sealed class NotFoundException : CustomException
    {
        public NotFoundException(string message) : base(message, HttpStatusCode.NotFound)
        {
        }

        public NotFoundException(string message, Exception innerException) : base(message, innerException, HttpStatusCode.NotFound)
        {
        }
    }
}
