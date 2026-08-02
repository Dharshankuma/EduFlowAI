namespace EduFlowAI.Configurations
{
    public sealed class AzureEmailSettings
    {
        public const string SectionName = "AzureEmailSettings";

        public string ConnectionString { get; set; } = string.Empty;
        public string SenderAddress { get; set; } = string.Empty;
        public string SenderName { get; set; } = string.Empty;

    }
}
