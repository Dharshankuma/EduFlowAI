namespace EduFlowAI.PlannerEngine
{
    public sealed class PlannerOptions
    {
        // Session duration in minutes for each plan chunk
        public int SessionDurationMinutes { get; set; } = 60;

        // How many days into the future to plan by default
        public int PlanningHorizonDays { get; set; } = 14;

        // Window in days before deadline to consider starvation boosting
        public int StarvationWindowDays { get; set; } = 3;
    }
}
