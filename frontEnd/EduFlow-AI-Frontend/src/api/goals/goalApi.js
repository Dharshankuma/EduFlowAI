import axiosClient from '../client/axiosClient';

/**
 * Helper to convert dd-MM-yyyy (or other common backend date formats) into yyyy-MM-dd
 * required by HTML date inputs (<input type="date">).
 *
 * @param {string} dateStr - Date string from API (e.g. "30-11-2026")
 * @returns {string} Formatted date string (e.g. "2026-11-30")
 */
export const formatDateForInput = (dateStr) => {
    if (!dateStr || typeof dateStr !== 'string') return '';
    const cleanStr = dateStr.trim();
    if (!cleanStr) return '';

    // If ISO date string (e.g. "2026-11-30T00:00:00")
    if (cleanStr.includes('T')) {
        return cleanStr.split('T')[0];
    }

    // If dd-MM-yyyy format
    if (cleanStr.includes('-')) {
        const parts = cleanStr.split('-');
        if (parts.length === 3) {
            // dd-MM-yyyy: day <= 2 chars, year 4 chars
            if (parts[0].length <= 2 && parts[2].length === 4) {
                const day = parts[0].padStart(2, '0');
                const month = parts[1].padStart(2, '0');
                const year = parts[2];
                return `${year}-${month}-${day}`;
            }
            // Already yyyy-MM-dd
            if (parts[0].length === 4 && parts[2].length <= 2) {
                return cleanStr;
            }
        }
    }

    // If dd/MM/yyyy format
    if (cleanStr.includes('/')) {
        const parts = cleanStr.split('/');
        if (parts.length === 3) {
            if (parts[0].length <= 2 && parts[2].length === 4) {
                const day = parts[0].padStart(2, '0');
                const month = parts[1].padStart(2, '0');
                const year = parts[2];
                return `${year}-${month}-${day}`;
            }
        }
    }

    return cleanStr;
};

/**
 * Helper to convert date strings (e.g. "2026-11-30" or "30-11-2026") into
 * backend DateTime format "yyyy-MM-ddTHH:mm:ss" accepted by ASP.NET Core DateTime.
 *
 * @param {string} dateStr - Date string from HTML input or state
 * @returns {string|null} Formatted date string (e.g. "2026-11-30T00:00:00")
 */
export const formatDateForBackend = (dateStr) => {
    if (!dateStr || typeof dateStr !== 'string') return null;
    const cleanStr = dateStr.trim();
    if (!cleanStr) return null;

    if (cleanStr.includes('T')) {
        return cleanStr;
    }

    // Convert dd-MM-yyyy or dd/MM/yyyy to yyyy-MM-dd if necessary
    const ymd = formatDateForInput(cleanStr);
    if (ymd && /^\d{4}-\d{2}-\d{2}$/.test(ymd)) {
        return `${ymd}T00:00:00`;
    }

    return `${cleanStr}T00:00:00`;
};

/**
 * Normalizes an individual goal item from the backend response into
 * the format expected by GoalCard component.
 * 
 * @param {Object} item - Raw goal item from API response
 * @returns {Object} Normalized goal object
 */
export const normalizeGoalItem = (item) => {
    if (!item) return null;

    const goalIdentifier = item.goalIdentifier ?? item.GoalIdentifier ?? item.identifier ?? item.Identifier ?? item.goalId ?? item.GoalId ?? item.id ?? item.Id;
    const id = goalIdentifier;
    const title = item.title ?? item.goalTitle ?? item.Title ?? item.GoalTitle ?? 'Untitled Goal';
    const category = item.category ?? item.goalType ?? item.Category ?? item.GoalType ?? item.goalTypeName ?? 'General';
    const priority = item.priority ?? item.priorityName ?? item.Priority ?? item.PriorityName ?? (item.priorityId ? `Priority ${item.priorityId}` : 'Normal');
    const progress = Number(item.progress ?? item.Progress ?? item.progressPercentage ?? item.progressPercent ?? 0);
    const totalTasks = Number(item.totalTasks ?? item.TotalTasks ?? item.totalTaskCount ?? 0);
    const completedTasks = Number(item.completedTasks ?? item.CompletedTasks ?? item.completedTaskCount ?? 0);
    const remainingTasks = Number(item.remainingTasks ?? item.RemainingTasks ?? item.remainingTaskCount ?? Math.max(0, totalTasks - completedTasks));

    // Format targetDate if it's an ISO date string
    let targetDate = item.targetDate ?? item.TargetDate ?? item.targetCompletionDate ?? item.endDate ?? '';
    if (targetDate && typeof targetDate === 'string' && targetDate.includes('T')) {
        try {
            const parsed = new Date(targetDate);
            if (!isNaN(parsed.getTime())) {
                targetDate = parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            }
        } catch {
            // Keep original date if parsing fails
        }
    }

    const nextSession = item.nextSession ?? item.NextSession ?? item.nextSessionTime ?? '';
    const status = item.status ?? item.Status ?? item.statusIdentifier ?? item.StatusIdentifier ?? item.statusName ?? 'Active';

    return {
        ...item,
        id,
        goalIdentifier,
        title,
        category,
        priority,
        progress,
        totalTasks,
        completedTasks,
        remainingTasks,
        targetDate,
        nextSession,
        status
    };
};

/**
 * Normalizes the API response from POST /api/goal/grid.
 * 
 * @param {Object|Array} data - Data received from the endpoint
 * @returns {Object} Normalized grid result containing items, totalCount, totalPages, statistics
 */
export const normalizeGridResponse = (data) => {
    if (!data) {
        return { items: [], totalCount: 0, totalPages: 1, pageNumber: 1, pageSize: 10, statistics: null, raw: null };
    }

    if (Array.isArray(data)) {
        return {
            items: data.map(normalizeGoalItem),
            totalCount: data.length,
            totalPages: 1,
            pageNumber: 1,
            pageSize: data.length,
            statistics: null,
            raw: data
        };
    }

    const rawItems = data.items || data.Items || data.goals || data.Goals || data.data || data.Data || data.results || (Array.isArray(data.result) ? data.result : data.result?.items) || [];
    const items = Array.isArray(rawItems) ? rawItems.map(normalizeGoalItem) : [];
    const pageSize = Number(data.pageSize ?? data.PageSize ?? 10);
    const totalCount = Number(data.totalCount ?? data.TotalCount ?? data.totalItems ?? data.TotalItems ?? data.totalRecords ?? data.TotalRecords ?? data.total ?? items.length);
    const totalPages = Number(data.totalPages ?? data.TotalPages ?? Math.max(1, Math.ceil(totalCount / (pageSize || 10))));
    const pageNumber = Number(data.pageNumber ?? data.PageNumber ?? 1);
    const statistics = data.statistics || data.Statistics || data.summary || data.Summary || null;

    return {
        items,
        totalCount,
        totalPages,
        pageNumber,
        pageSize,
        statistics,
        raw: data
    };
};

/**
 * Sends a POST request to /api/goal/grid to retrieve paginated goals.
 * Uses the shared axiosClient which handles authentication tokens and interceptors.
 *
 * Default payload structure:
 * {
 *   "goalSearch": "",
 *   "statusIdentifier": null,
 *   "goalType": null,
 *   "priorityId": null,
 *   "sortBy": "Newest",
 *   "pageNumber": 1,
 *   "pageSize": 10
 * }
 *
 * @param {Object} [params={}] - Grid query parameters
 * @returns {Promise<Object>} API response payload
 */
export const getGoalsGrid = async (params = {}) => {
    const payload = {
        goalSearch: params.goalSearch !== undefined && params.goalSearch !== null ? params.goalSearch : '',
        statusIdentifier: params.statusIdentifier ?? null,
        goalType: params.goalType ?? null,
        priorityId: params.priorityId ?? null,
        sortBy: params.sortBy || 'Newest',
        pageNumber: params.pageNumber ?? 1,
        pageSize: params.pageSize ?? 10
    };

    const response = await axiosClient.post('/goal/grid', payload);

    // Support standard .NET wrapped success response format: response.data.data
    // Fall back to response.data if there's no data envelope
    if (response && response.data) {
        if (response.data.data !== undefined) {
            return response.data.data;
        }
        return response.data;
    }

    throw new Error('Invalid response received from the server.');
};

/**
 * Fetches goal details by goalIdentifier from the backend endpoint:
 * POST /api/goal/{goalIdentifier}/getGoalDetails
 *
 * @param {string|number} goalIdentifier - The unique identifier of the goal
 * @returns {Promise<Object>} The GoalViewResponseDTO payload
 */
export const getGoalDetails = async (goalIdentifier) => {
    if (!goalIdentifier && goalIdentifier !== 0) {
        throw new Error('Goal identifier is required to fetch goal details.');
    }

    const encodedIdentifier = encodeURIComponent(String(goalIdentifier).trim());
    const response = await axiosClient.post(`/goal/${encodedIdentifier}/getGoalDetails`);

    // Support standard .NET wrapped success response format: response.data.data
    // Fall back to response.data if there's no data envelope
    if (response && response.data) {
        if (response.data.data !== undefined) {
            return response.data.data;
        }
        return response.data;
    }

    throw new Error('Invalid response received from the server.');
};

/**
 * Sends a POST request to /api/goal/create-with-tasks to create a goal along with its tasks.
 * Uses the shared axiosClient which handles authentication tokens and base URL.
 *
 * Payload shape follows CreateGoalWithTasksRequestDTO:
 * {
 *   "goalTitle": "string",
 *   "goalDescription": "string|null",
 *   "goalTypeIdentifier": "string",
 *   "goalTypeId": null,
 *   "priorityIdentifier": "string",
 *   "priorityId": null,
 *   "targetDate": "yyyy-MM-ddTHH:mm:ss",
 *   "tasks": [
 *     {
 *       "taskName": "string",
 *       "description": "string|null",
 *       "estimatedHours": number,
 *       "dueDate": "yyyy-MM-ddTHH:mm:ss",
 *       "statusIdentifier": "string"
 *     }
 *   ]
 * }
 *
 * @param {Object} payload - CreateGoalWithTasksRequestDTO payload
 * @returns {Promise<Object>} The created goal payload from the server
 */
export const createGoalWithTasks = async (payload) => {
    if (!payload) {
        throw new Error('Goal payload is required to create a goal with tasks.');
    }

    const response = await axiosClient.post('/goal/create-with-tasks', payload, {
        skipLoader: true // Use local PlannerLoading UI instead of global full-screen spinner
    });

    // Support standard .NET wrapped success response format: response.data.data
    // Fall back to response.data if there's no data envelope
    if (response && response.data) {
        if (response.data.data !== undefined) {
            return response.data.data;
        }
        return response.data;
    }

    throw new Error('Invalid response received from the server.');
};

