namespace EduFlowAI.Constants
{
    /// <summary>
    /// Stable business meanings for entries in STATUSMASTER.
    /// Database primary keys must not be used as status values because they vary by environment.
    /// </summary>
    public static class StatusConstants
    {
        public const string Active = "Active";
        public const string Pending = "Pending";
        public const string InProgress = "In Progress";
        public const string Planned = "Planned";
        public const string Completed = "Completed";
        public const string Missed = "Missed";
        public const string Cancelled = "Cancelled";
    }
}
