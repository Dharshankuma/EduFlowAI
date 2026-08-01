namespace EduFlowAI.DTO.Authentiation.Requests
{
    public class RegisterRequestDTO
    {
        public string Username { get; set; } = string.Empty;
        public string EmailId { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string authProvider { get; set; } = string.Empty;
    }
}
