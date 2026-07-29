namespace EduFlowAI.DTO.Authentiation.Responses
{
    public class LoginResponseDTO
    {
        public string Token { get; set; }
        public string RefreshToken { get; set; }
        public UserLoginDetailsResponse UserData { get; set; }
    }
}
