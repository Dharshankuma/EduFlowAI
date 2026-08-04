namespace EduFlowAI.DTO.Profiles.Responses
{
    public class ProfileResponseDTO
    {
        public ProfileHeaderResponseDTO ProfileHeader { get; set; } = new();
        public PersonalInformationResponseDTO PersonalInformation { get; set; } = new();
        public List<WeeklyAvailabilityResponseDTO> WeeklyAvailability { get; set; } = new();
        public ProfileSummaryResponseDTO ProfileSummary { get; set; } = new();
    }
}
