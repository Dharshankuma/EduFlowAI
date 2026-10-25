import axiosClient from '../client/axiosClient';

/**
 * Formats a Date object or date string into an ISO DateTime parameter without timezone skew.
 *
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted DateTime string (e.g. "2026-10-26T00:00:00")
 */
export const toDateTimeParam = (date) => {
    if (!date) return '';
    if (typeof date === 'string') {
        const cleanStr = date.trim();
        if (cleanStr.includes('T')) return cleanStr;
        return `${cleanStr}T00:00:00`;
    }
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

/**
 * Formats total minutes into a human-readable "Xh Ym" string.
 *
 * @param {number|string} minutes - Total minutes
 * @returns {string} Formatted time string (e.g. "5h 20m")
 */
export const formatMinutesToHours = (minutes) => {
    if (minutes === null || minutes === undefined || isNaN(Number(minutes))) {
        return '0h 00m';
    }
    const totalMinutes = Math.max(0, Math.round(Number(minutes)));
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}h ${String(m).padStart(2, '0')}m`;
};

/**
 * Normalizes an individual schedule item from backend response into the format
 * expected by TodaySchedule / ScheduleTimeline.
 *
 * @param {Object} raw - Raw item from backend
 * @param {number} index - Fallback array index
 * @returns {Object} Normalized schedule item
 */
export const normalizeScheduleItem = (raw, index = 0) => {
    if (!raw) return null;
    const id = raw.id ?? raw.Id ?? raw.scheduleId ?? raw.ScheduleId ?? index;
    const time = raw.time ?? raw.Time ?? (raw.start ? String(raw.start).split('T')[1]?.substring(0, 5) : '09:00 AM');
    const subject = raw.subject ?? raw.Subject ?? raw.goalTitle ?? raw.GoalTitle ?? raw.course ?? 'Study Session';
    const topic = raw.topic ?? raw.Topic ?? raw.taskTitle ?? raw.TaskTitle ?? raw.title ?? raw.description ?? 'Scheduled Session';
    const status = raw.status ?? raw.Status ?? (raw.completed ? 'Completed' : 'Pending');

    return {
        id,
        time,
        subject,
        topic,
        status
    };
};

/**
 * Normalizes an individual goal item from backend response into the format
 * expected by GoalProgress / GoalList.
 *
 * @param {Object} raw - Raw goal item from backend
 * @param {number} index - Fallback array index
 * @returns {Object} Normalized goal item
 */
export const normalizeGoalProgressItem = (raw, index = 0) => {
    if (!raw) return null;
    const id = raw.id ?? raw.Id ?? raw.goalId ?? raw.GoalId ?? index;
    const goalIdentifier = raw.goalIdentifier ?? raw.GoalIdentifier ?? String(id);
    const title = raw.title ?? raw.Title ?? raw.goalTitle ?? raw.GoalTitle ?? 'Study Goal';
    const category = raw.category ?? raw.Category ?? raw.goalType ?? raw.GoalType ?? '';
    const progress = Math.max(0, Math.min(100, Math.round(Number(raw.progress ?? raw.Progress ?? raw.completionPercentage ?? raw.CompletionPercentage ?? 0))));
    
    let dueDate = raw.dueDate ?? raw.DueDate ?? '';
    if (!dueDate && (raw.targetDate || raw.TargetDate)) {
        const rawDate = raw.targetDate || raw.TargetDate;
        dueDate = `Due ${rawDate.includes('T') ? rawDate.split('T')[0] : rawDate}`;
    }

    let status = raw.status ?? raw.Status;
    if (!status) {
        if (progress >= 100) status = 'Completed';
        else if (progress > 50) status = 'On Track';
        else if (progress > 0) status = 'Steady';
        else status = 'Planned';
    }

    return {
        id,
        goalIdentifier,
        title,
        category,
        progress,
        dueDate,
        status
    };
};

/**
 * Normalizes an upcoming task item from backend response into the format
 * expected by UpcomingTasks / TaskList.
 *
 * @param {Object} raw - Raw task item from backend
 * @param {number} index - Fallback array index
 * @returns {Object} Normalized task item
 */
export const normalizeUpcomingTaskItem = (raw, index = 0) => {
    if (!raw) return null;
    const id = raw.id ?? raw.Id ?? raw.taskId ?? raw.TaskId ?? index;
    const title = raw.title ?? raw.Title ?? raw.taskName ?? raw.TaskName ?? 'Task';
    const subject = raw.subject ?? raw.Subject ?? raw.goalTitle ?? raw.GoalTitle ?? '';
    const dueDate = raw.dueDate ?? raw.DueDate ?? 'Upcoming';
    const dueTime = raw.dueTime ?? raw.DueTime ?? '';
    const priority = raw.priority ?? raw.Priority ?? 'Medium';
    const status = raw.status ?? raw.Status ?? (raw.completed ? 'Completed' : 'Pending');
    const icon = raw.icon ?? raw.Icon ?? 'bi-file-earmark-code';

    return {
        id,
        title,
        subject,
        dueDate,
        dueTime,
        priority,
        status,
        icon
    };
};

/**
 * Normalizes a recent activity item from backend response into the format
 * expected by RecentActivity / ActivityFeed.
 *
 * @param {Object} raw - Raw activity item from backend
 * @param {number} index - Fallback array index
 * @returns {Object} Normalized activity item
 */
export const normalizeRecentActivityItem = (raw, index = 0) => {
    if (!raw) return null;
    const id = raw.id ?? raw.Id ?? index;
    const type = (raw.type ?? raw.Type ?? 'task').toLowerCase();
    const title = raw.title ?? raw.Title ?? 'Activity';
    const description = raw.description ?? raw.Description ?? '';
    const time = raw.time ?? raw.Time ?? (raw.timestamp ? String(raw.timestamp) : 'Recently');
    const status = raw.status ?? raw.Status ?? null;

    return {
        id,
        type,
        title,
        description,
        time,
        status
    };
};

/**
 * Normalizes the full DashboardResponseDTO from backend.
 *
 * @param {Object} data - Raw data payload from API
 * @returns {Object} Normalized dashboard object
 */
export const normalizeDashboardResponse = (data) => {
    if (!data) return null;

    const rawPlan = data.studyPlan ?? data.StudyPlan ?? {};
    const rawMetrics = data.metrics ?? data.Metrics ?? {};
    const rawSchedule = data.todaySchedule ?? data.TodaySchedule ?? [];
    const rawGoals = data.goalProgress ?? data.GoalProgress ?? [];
    const rawUpcoming = data.upcomingTasks ?? data.UpcomingTasks ?? [];
    const rawActivities = data.recentActivity ?? data.RecentActivity ?? [];
    const rawCalendar = data.miniCalendar ?? data.MiniCalendar ?? {};
    const rawFocus = data.focusSession ?? data.FocusSession ?? {};

    // 1. Study Plan
    const studySessions = Number(rawPlan.studySessions ?? rawPlan.StudySessions ?? 0);
    const plannedMinutes = Number(rawPlan.plannedMinutes ?? rawPlan.PlannedMinutes ?? 0);
    const studyHoursFormatted = formatMinutesToHours(plannedMinutes);
    const activeGoalsCount = Number(rawPlan.activeGoals ?? rawPlan.ActiveGoals ?? rawMetrics.activeGoals ?? rawMetrics.ActiveGoals ?? 0);
    const nextSessionMinutes = rawPlan.nextSessionMinutes ?? rawPlan.NextSessionMinutes;
    const nextTaskFormatted = nextSessionMinutes !== undefined && nextSessionMinutes !== null
        ? `${nextSessionMinutes}m`
        : 'None';
    const studyStreakDays = Number(rawPlan.studyStreakDays ?? rawPlan.StudyStreakDays ?? rawMetrics.studyStreakDays ?? rawMetrics.StudyStreakDays ?? 0);
    const progressToday = Math.max(0, Math.min(100, Math.round(Number(rawPlan.progressTodayPercentage ?? rawPlan.ProgressTodayPercentage ?? 0))));

    const recommendations = Array.isArray(rawPlan.recommendations ?? rawPlan.Recommendations)
        ? (rawPlan.recommendations ?? rawPlan.Recommendations)
        : [];
    const studyFocus = rawPlan.focus ?? rawPlan.Focus ?? '';
    const quickTips = rawPlan.quickTip ?? rawPlan.QuickTip ?? '';

    // 2. Metrics -> Stat Cards
    const studyHoursToday = rawMetrics.studyHoursToday ?? rawMetrics.StudyHoursToday ?? 0;
    const formattedStudyHoursMetric = typeof studyHoursToday === 'number'
        ? (studyHoursToday > 0 ? `${studyHoursToday}h` : studyHoursFormatted)
        : String(studyHoursToday);

    const studyHoursChangePercentage = Number(rawMetrics.studyHoursChangePercentage ?? rawMetrics.StudyHoursChangePercentage ?? 0);
    const completedTasksToday = Number(rawMetrics.completedTasksToday ?? rawMetrics.CompletedTasksToday ?? 0);

    const statistics = [
        {
            title: "Study Hours Today",
            value: formattedStudyHoursMetric,
            description: "Cumulative study focus time",
            trend: `${studyHoursChangePercentage >= 0 ? '+' : ''}${studyHoursChangePercentage}% from yesterday`,
            trendType: studyHoursChangePercentage >= 0 ? "success" : "danger",
            icon: "bi-clock-fill"
        },
        {
            title: "Completed Tasks",
            value: String(completedTasksToday),
            description: "Checks finished today",
            trend: `+${completedTasksToday} today`,
            trendType: "success",
            icon: "bi-check-circle-fill"
        },
        {
            title: "Active Goals",
            value: String(activeGoalsCount),
            description: "In-progress academic milestones",
            trend: activeGoalsCount > 0 ? "On Track" : "No active goals",
            trendType: "info",
            icon: "bi-journal-bookmark-fill"
        },
        {
            title: "Study Streak",
            value: `${studyStreakDays} Days`,
            description: "Consecutive active learning days",
            trend: studyStreakDays > 0 ? "Active Streak" : "Start today",
            trendType: "warning",
            icon: "bi-fire"
        }
    ];

    // 3. Today's Schedule
    const schedule = Array.isArray(rawSchedule)
        ? rawSchedule.map(normalizeScheduleItem).filter(Boolean)
        : [];

    // 4. Goal Progress
    const goals = Array.isArray(rawGoals)
        ? rawGoals.map(normalizeGoalProgressItem).filter(Boolean)
        : [];

    // 5. Upcoming Tasks
    const upcomingTasks = Array.isArray(rawUpcoming)
        ? rawUpcoming.map(normalizeUpcomingTaskItem).filter(Boolean)
        : [];

    // 6. Recent Activity
    const recentActivities = Array.isArray(rawActivities)
        ? rawActivities.map(normalizeRecentActivityItem).filter(Boolean)
        : [];

    // 7. Mini Calendar
    const miniCalendar = {
        year: Number(rawCalendar.year ?? rawCalendar.Year ?? new Date().getFullYear()),
        month: Number(rawCalendar.month ?? rawCalendar.Month ?? (new Date().getMonth() + 1)),
        daysWithSessions: Array.isArray(rawCalendar.daysWithSessions ?? rawCalendar.DaysWithSessions)
            ? (rawCalendar.daysWithSessions ?? rawCalendar.DaysWithSessions)
            : []
    };

    // 8. Focus Session
    const isTrackingSupported = Boolean(rawFocus.isTrackingSupported ?? rawFocus.IsTrackingSupported ?? false);
    const defaultDurationMinutes = Number(rawFocus.defaultDurationMinutes ?? rawFocus.DefaultDurationMinutes ?? 25);
    const focusSession = {
        isTrackingSupported,
        duration: defaultDurationMinutes * 60, // in seconds for timer
        defaultDurationMinutes,
        subject: rawFocus.activeTaskName ?? rawFocus.ActiveTaskName ?? (goals[0]?.title || 'Study Session')
    };

    return {
        date: data.date ?? data.Date ?? '',
        userName: data.userName ?? data.UserName ?? '',
        studyPlan: {
            studySessions,
            studyHours: studyHoursFormatted,
            activeGoals: String(activeGoalsCount),
            nextTask: nextTaskFormatted,
            studyStreak: `${studyStreakDays} Days`,
            dailyBrief: {
                recommendations,
                studyFocus,
                quickTips,
                completionEstimate: formatMinutesToHours(plannedMinutes),
                progressToday
            }
        },
        statistics,
        schedule,
        goals,
        upcomingTasks,
        recentActivities,
        miniCalendar,
        focusSession
    };
};

/**
 * Fetches dashboard details from the backend for the authenticated user.
 * Endpoint: GET /api/dashboard?date={date}
 *
 * @param {Date|string} [date] - Optional date anchor (defaults to backend current date)
 * @returns {Promise<Object>} Normalized dashboard data
 */
export const getDashboard = async (date) => {
    const params = {};
    if (date) {
        const formattedDate = toDateTimeParam(date);
        if (formattedDate) {
            params.date = formattedDate;
        }
    }

    const response = await axiosClient.get('/dashboard', { params });
    const payload = response?.data?.data !== undefined ? response.data.data : response.data;

    return normalizeDashboardResponse(payload);
};
