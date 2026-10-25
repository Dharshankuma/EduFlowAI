import axiosClient from '../client/axiosClient';

/**
 * Formats a Date object or date string into a local ISO DateTime format:
 * "yyyy-MM-ddTHH:mm:ss" avoiding timezone offset skews.
 *
 * @param {Date|string} date - Date object or date string
 * @returns {string} Formatted DateTime string
 */
export const toDateTimeParam = (date) => {
    if (!date) return '';
    if (typeof date === 'string') {
        const cleanStr = date.trim();
        if (cleanStr.includes('T')) return cleanStr;
        return `${cleanStr}T00:00:00`;
    }
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

/**
 * Formats a start and end ISO datetime into "HH:mm AM/PM - HH:mm AM/PM"
 * string expected by the calendar views.
 *
 * @param {string} start - ISO start datetime
 * @param {string} end - ISO end datetime
 * @returns {string} Formatted range string (e.g. "09:00 AM - 10:00 AM")
 */
export const formatTimeRangeFromIso = (start, end) => {
    if (!start) return '09:00 AM - 10:00 AM';
    try {
        const formatTimePart = (isoStr) => {
            const d = new Date(isoStr);
            if (isNaN(d.getTime())) return null;
            let hours = d.getHours();
            const minutes = String(d.getMinutes()).padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // 0 becomes 12
            const strHours = String(hours).padStart(2, '0');
            return `${strHours}:${minutes} ${ampm}`;
        };

        const startTime = formatTimePart(start);
        const endTime = end ? formatTimePart(end) : null;

        if (startTime && endTime) {
            return `${startTime} - ${endTime}`;
        }
        if (startTime) {
            return startTime;
        }
    } catch {
        // Fall back to default
    }
    return '09:00 AM - 10:00 AM';
};

/**
 * Normalizes an individual calendar event from backend response into the format
 * expected by CalendarMonthView, CalendarWeekView, and CalendarDayView.
 *
 * @param {Object} raw - Raw calendar event from backend
 * @returns {Object} Normalized event object
 */
export const normalizeCalendarEvent = (raw) => {
    if (!raw) return null;

    const scheduleId = raw.scheduleId ?? raw.ScheduleId ?? raw.id ?? raw.Id;
    const scheduleIdentifier = raw.scheduleIdentifier ?? raw.ScheduleIdentifier ?? String(scheduleId);
    const taskId = raw.taskId ?? raw.TaskId;
    const goalId = raw.goalId ?? raw.GoalId;
    const goalIdentifier = raw.goalIdentifier ?? raw.GoalIdentifier ?? (goalId ? String(goalId) : null);
    const title = raw.title ?? raw.Title ?? raw.taskTitle ?? raw.TaskTitle ?? 'Study Session';
    const description = raw.description ?? raw.Description ?? raw.taskDescription ?? raw.TaskDescription ?? '';
    const goalTitle = raw.goalTitle ?? raw.GoalTitle ?? 'General Study';
    const priority = raw.priority ?? raw.Priority ?? 'Medium';
    const status = raw.status ?? raw.Status ?? 'Planned';
    const start = raw.start ?? raw.Start ?? '';
    const end = raw.end ?? raw.End ?? '';
    const plannedHours = Number(raw.plannedHours ?? raw.PlannedHours ?? 1);

    // Date key for isSameDay comparison (e.g. "2026-10-26")
    const date = start ? (start.includes('T') ? start.split('T')[0] : start) : '';

    // Human-readable time range
    const time = formatTimeRangeFromIso(start, end);

    const isCompleted = String(status).toLowerCase() === 'completed';

    return {
        id: scheduleId,
        scheduleId,
        scheduleIdentifier,
        taskId,
        goalId,
        goalIdentifier,
        title,
        description,
        goalTitle,
        course: goalTitle,
        priority,
        status,
        start,
        end,
        plannedHours,
        date,
        time,
        completed: isCompleted,
        type: isCompleted ? 'Revision' : 'Study Session'
    };
};

/**
 * Fetches calendar events between 'from' and 'to' datetime boundaries.
 * Endpoint: GET /api/calendar/events?from={from}&to={to}
 *
 * @param {Date|string} from - Start datetime
 * @param {Date|string} to - End datetime
 * @returns {Promise<Array>} List of normalized calendar events
 */
export const getCalendarEvents = async (from, to) => {
    const fromParam = toDateTimeParam(from);
    const toParam = toDateTimeParam(to);

    const response = await axiosClient.get('/calendar/events', {
        params: {
            from: fromParam,
            to: toParam
        }
    });

    const data = response?.data?.data !== undefined ? response.data.data : response.data;
    const rawEvents = data?.events ?? data?.Events ?? (Array.isArray(data) ? data : []);

    return Array.isArray(rawEvents) ? rawEvents.map(normalizeCalendarEvent).filter(Boolean) : [];
};

/**
 * Fetches single-day events for a specific date.
 * Endpoint: GET /api/calendar/day?date={date}
 *
 * @param {Date|string} date - Date to fetch
 * @returns {Promise<Array>} List of normalized calendar events
 */
export const getCalendarDay = async (date) => {
    const dateParam = toDateTimeParam(date);

    const response = await axiosClient.get('/calendar/day', {
        params: {
            date: dateParam
        }
    });

    const data = response?.data?.data !== undefined ? response.data.data : response.data;
    const rawEvents = data?.events ?? data?.Events ?? (Array.isArray(data) ? data : []);

    return Array.isArray(rawEvents) ? rawEvents.map(normalizeCalendarEvent).filter(Boolean) : [];
};

/**
 * Fetches daily summary metrics for a specific date.
 * Endpoint: GET /api/calendar/today-summary?date={date}
 *
 * @param {Date|string} [date] - Optional date
 * @returns {Promise<Object>} Today summary metrics
 */
export const getCalendarTodaySummary = async (date) => {
    const params = {};
    if (date) {
        params.date = toDateTimeParam(date);
    }

    const response = await axiosClient.get('/calendar/today-summary', {
        params
    });

    const data = response?.data?.data !== undefined ? response.data.data : response.data;
    if (!data) return null;

    return {
        date: data.date ?? data.Date ?? '',
        plannedHours: Number(data.plannedHours ?? data.PlannedHours ?? 0),
        completedHours: Number(data.completedHours ?? data.CompletedHours ?? 0),
        remainingHours: Number(data.remainingHours ?? data.RemainingHours ?? 0),
        totalSessions: Number(data.totalSessions ?? data.TotalSessions ?? 0),
        completedSessions: Number(data.completedSessions ?? data.CompletedSessions ?? 0),
        missedSessions: Number(data.missedSessions ?? data.MissedSessions ?? 0),
        studyGoalReachedPercentage: data.studyGoalReachedPercentage !== undefined && data.studyGoalReachedPercentage !== null
            ? Number(data.studyGoalReachedPercentage)
            : (data.StudyGoalReachedPercentage !== undefined && data.StudyGoalReachedPercentage !== null ? Number(data.StudyGoalReachedPercentage) : 0),
        concentrationScore: data.concentrationScore !== undefined && data.concentrationScore !== null
            ? Number(data.concentrationScore)
            : (data.ConcentrationScore !== undefined && data.ConcentrationScore !== null ? Number(data.ConcentrationScore) : null)
    };
};

/**
 * Fetches monthly progress statistics for a given year and month (1-based).
 * Endpoint: GET /api/calendar/monthly-progress?year={year}&month={month}
 *
 * @param {number} year - Four-digit year (e.g. 2026)
 * @param {number} month - 1-based month (1 to 12)
 * @returns {Promise<Object>} Monthly progress statistics
 */
export const getCalendarMonthlyProgress = async (year, month) => {
    const response = await axiosClient.get('/calendar/monthly-progress', {
        params: {
            year,
            month
        }
    });

    const data = response?.data?.data !== undefined ? response.data.data : response.data;
    if (!data) return null;

    return {
        year: Number(data.year ?? data.Year ?? year),
        month: Number(data.month ?? data.Month ?? month),
        totalStudyHours: Number(data.totalStudyHours ?? data.TotalStudyHours ?? 0),
        completedHours: Number(data.completedHours ?? data.CompletedHours ?? 0),
        upcomingHours: Number(data.upcomingHours ?? data.UpcomingHours ?? 0),
        completedSessions: Number(data.completedSessions ?? data.CompletedSessions ?? 0),
        upcomingSessions: Number(data.upcomingSessions ?? data.UpcomingSessions ?? 0),
        missedSessions: Number(data.missedSessions ?? data.MissedSessions ?? 0)
    };
};
