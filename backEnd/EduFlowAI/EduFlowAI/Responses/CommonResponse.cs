namespace EduFlowAI.Responses
{
    public class CommonResponse
    {
        public int? responseCode { get; set; }
        public string? responseMessage { get; set; }
        public string? responseStatus { get; set; }
        public DateTime? responseDateTime { get; set; }
        public dynamic? data { get; set; }
    }
}
