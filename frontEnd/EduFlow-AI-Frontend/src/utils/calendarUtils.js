// Calendar Date Utilities and Helper Functions

export const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export const SHORT_MONTH_NAMES = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export const WEEKDAYS_SUN_FIRST = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const WEEKDAYS_MON_FIRST = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Design anchor date for EduFlowAI mock data (October 24, 2026)
export const TODAY_ANCHOR = new Date(2026, 9, 24);

/**
 * Safely parse a date value to avoid timezone offsets and formatting mismatches
 */
export const parseDateSafe = (dateVal) => {
    if (!dateVal) return new Date(TODAY_ANCHOR);
    if (dateVal instanceof Date) return new Date(dateVal.getTime());
    if (typeof dateVal === 'string') {
        const parts = dateVal.split('-');
        if (parts.length === 3) {
            return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        }
        return new Date(dateVal);
    }
    return new Date(dateVal);
};

/**
 * Check if two dates represent the exact same calendar day
 */
export const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    const date1 = parseDateSafe(d1);
    const date2 = parseDateSafe(d2);
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
};

/**
 * Format a Date object to "YYYY-MM-DD"
 */
export const formatDateKey = (date) => {
    const d = parseDateSafe(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};

/**
 * Format a Date object to "DayOfWeek, Month Day, Year"
 * Example: "Saturday, October 24, 2026"
 */
export const formatFullDate = (date) => {
    const d = parseDateSafe(date);
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return `${dayNames[d.getDay()]}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

/**
 * Format a Date object to "Month Day, Year"
 * Example: "October 24, 2026"
 */
export const formatShortDate = (date) => {
    const d = parseDateSafe(date);
    return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

/**
 * Generates the full 35-42 calendar days grid for a given year and month (Sunday - Saturday)
 */
export const generateMonthGrid = (year, monthIndex) => {
    const firstDayIndex = new Date(year, monthIndex, 1).getDay(); // 0 = Sun
    const daysInCurrentMonth = new Date(year, monthIndex + 1, 0).getDate();
    const lastDayPrevMonth = new Date(year, monthIndex, 0).getDate();

    const list = [];

    // Trailing days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
        const dayNum = lastDayPrevMonth - i;
        const prevMonthDate = new Date(
            monthIndex === 0 ? year - 1 : year,
            monthIndex === 0 ? 11 : monthIndex - 1,
            dayNum
        );
        list.push({
            day: dayNum,
            date: prevMonthDate,
            isToday: isSameDay(prevMonthDate, TODAY_ANCHOR),
            isCurrentMonth: false
        });
    }

    // Days in current month
    for (let dayNum = 1; dayNum <= daysInCurrentMonth; dayNum++) {
        const currentMonthDate = new Date(year, monthIndex, dayNum);
        list.push({
            day: dayNum,
            date: currentMonthDate,
            isToday: isSameDay(currentMonthDate, TODAY_ANCHOR),
            isCurrentMonth: true
        });
    }

    // Leading days from next month to complete standard 35 or 42 slots grid
    const targetSlots = list.length > 35 ? 42 : 35;
    const remainingSlots = targetSlots - list.length;
    for (let dayNum = 1; dayNum <= remainingSlots; dayNum++) {
        const nextMonthDate = new Date(
            monthIndex === 11 ? year + 1 : year,
            monthIndex === 11 ? 0 : monthIndex + 1,
            dayNum
        );
        list.push({
            day: dayNum,
            date: nextMonthDate,
            isToday: isSameDay(nextMonthDate, TODAY_ANCHOR),
            isCurrentMonth: false
        });
    }

    return list;
};

/**
 * Generates all Monday-to-Sunday 7-day weeks that belong to a specific month.
 * A week belongs to a month if its Thursday falls within that month (ISO-8601 rule).
 * This ensures no duplicate weeks across months and no missing weeks.
 */
export const getWeeksInMonth = (year, monthIndex) => {
    const firstOfMonth = new Date(year, monthIndex, 1);
    const firstDayOfWeek = firstOfMonth.getDay(); // 0 = Sun, 1 = Mon ...
    
    // Find the Thursday of the first week of this month
    // Offset to Thursday (day 4):
    // If Sun (0): +4 days -> Thu
    // If Mon (1): +3 days -> Thu
    // If Tue (2): +2 days -> Thu
    // If Wed (3): +1 day -> Thu
    // If Thu (4): 0 days -> Thu
    // If Fri (5): -1 day -> previous Thu
    // If Sat (6): -2 days -> previous Thu
    let dayOffsetToThu = 4 - firstDayOfWeek;
    if (dayOffsetToThu > 3) dayOffsetToThu -= 7;

    let firstThu = new Date(year, monthIndex, 1 + dayOffsetToThu);
    // If this Thursday is in the previous month, advance by 7 days
    if (firstThu.getMonth() !== monthIndex) {
        firstThu = new Date(firstThu.getFullYear(), firstThu.getMonth(), firstThu.getDate() + 7);
    }

    const weeks = [];
    let currentThu = new Date(firstThu);

    while (currentThu.getMonth() === monthIndex && currentThu.getFullYear() === year) {
        // Monday is 3 days before Thursday
        const monday = new Date(currentThu.getFullYear(), currentThu.getMonth(), currentThu.getDate() - 3);
        
        // Construct the 7 days of this week (Mon to Sun)
        const days = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
            const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            days.push({
                name: dayNames[d.getDay()],
                dayNumber: d.getDate(),
                date: d,
                isToday: isSameDay(d, TODAY_ANCHOR),
                isCurrentMonth: d.getMonth() === monthIndex
            });
        }

        const startDate = days[0].date;
        const endDate = days[6].date;

        let rangeLabel = "";
        if (startDate.getMonth() === endDate.getMonth()) {
            rangeLabel = `${SHORT_MONTH_NAMES[startDate.getMonth()]} ${startDate.getDate()} - ${endDate.getDate()}, ${endDate.getFullYear()}`;
        } else {
            rangeLabel = `${SHORT_MONTH_NAMES[startDate.getMonth()]} ${startDate.getDate()} - ${SHORT_MONTH_NAMES[endDate.getMonth()]} ${endDate.getDate()}, ${endDate.getFullYear()}`;
        }

        const weekNum = weeks.length + 1;
        weeks.push({
            weekIndex: weeks.length,
            weekNumber: weekNum,
            shortLabel: `Week ${weekNum}`,
            rangeLabel: rangeLabel,
            fullLabel: `Week ${weekNum} • ${rangeLabel}`,
            startDate,
            endDate,
            days
        });

        // Advance to next Thursday
        currentThu = new Date(currentThu.getFullYear(), currentThu.getMonth(), currentThu.getDate() + 7);
    }

    return weeks;
};
