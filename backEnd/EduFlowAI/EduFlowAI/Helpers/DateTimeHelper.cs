namespace EduFlowAI.Helpers
{
    public static class DateTimeHelper
    {
        public static DateTime GetDateTimeNow()
        {
            return DateTime.Now;
        }
        public static string FormatMemberSince(DateTime createdAt)
        {
            return createdAt.ToString("MMMM yyyy");
        }

        public static string FormatLastLogin(DateTime? lastLogin)
        {
            if (!lastLogin.HasValue)
            {
                return "Never";
            }

            var loginTime = lastLogin.Value;

            var today = GetDateTimeNow().Date;

            if (loginTime.Date == today)
            {
                return $"Today • {loginTime:hh:mm tt}";
            }

            if (loginTime.Date == today.AddDays(-1))
            {
                return $"Yesterday • {loginTime:hh:mm tt}";
            }

            return loginTime.ToString("dd MMM yyyy • hh:mm tt");
        }

        public static string FormatTime(TimeOnly? time)
        {
            if (!time.HasValue)
            {
                return string.Empty;
            }

            return time.Value.ToString("HH\\:mm");
        }

    }
}
