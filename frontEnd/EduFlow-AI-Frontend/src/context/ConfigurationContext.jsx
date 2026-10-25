import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from './AuthContext';
import { getConfiguration } from '../api/configuration/configurationApi';

const ConfigurationContext = createContext(null);

// Fallback defaults in case network is delayed or server is unreachable
const DEFAULT_PRIORITY_OPTIONS = [
    { value: '', label: 'Select Priority' },
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' }
];

const DEFAULT_TYPE_OPTIONS = [
    { value: '', label: 'Select Goal Type' },
    { value: 'Academic', label: 'Academic' },
    { value: 'Placement', label: 'Placement' },
    { value: 'Skill Acquisition', label: 'Skill Acquisition' },
    { value: 'Certification', label: 'Certification' },
    { value: 'Personal', label: 'Personal' }
];

const DEFAULT_STATUS_SELECT_OPTIONS = [
    { value: '', label: 'Select Status' },
    { value: 'Pending', label: 'Pending' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' }
];

const DEFAULT_STATUS_FILTER_OPTIONS = [
    { value: '', label: 'All Statuses' },
    { value: 'Active', label: 'Active' },
    { value: 'Completed', label: 'Completed' },
    { value: 'On Hold', label: 'On Hold' },
    { value: 'Archived', label: 'Archived' }
];

const DEFAULT_TYPE_FILTER_OPTIONS = [
    { value: '', label: 'Goal Type' },
    { value: 'Academic', label: 'Academic' },
    { value: 'Placement', label: 'Placement' },
    { value: 'Skill Acquisition', label: 'Skill Acquisition' },
    { value: 'Certification', label: 'Certification' },
    { value: 'Personal', label: 'Personal' }
];

const DEFAULT_PRIORITY_LIST = [
    { identifier: '1', name: 'Low' },
    { identifier: '2', name: 'Medium' },
    { identifier: '3', name: 'High' }
];

const DEFAULT_GOAL_TYPE_LIST = [
    { identifier: '1', name: 'Academic' },
    { identifier: '2', name: 'Placement' },
    { identifier: '3', name: 'Skill Acquisition' },
    { identifier: '4', name: 'Certification' },
    { identifier: '5', name: 'Personal' }
];

const DEFAULT_STATUS_LIST = [
    { identifier: '1', name: 'Pending' },
    { identifier: '2', name: 'In Progress' },
    { identifier: '3', name: 'Completed' }
];

/**
 * Safely extracts an array from various response wrapper shapes
 * (e.g. data.statusData, configurationDetails.StatusData, etc.)
 */
const extractList = (config, ...keys) => {
    if (!config) return [];
    const candidates = [
        config,
        config?.configurationDetails,
        config?.ConfigurationDetails,
        config?.data,
        config?.data?.configurationDetails,
        config?.data?.ConfigurationDetails
    ];

    for (const candidate of candidates) {
        if (!candidate || typeof candidate !== 'object') continue;
        for (const key of keys) {
            if (Array.isArray(candidate[key]) && candidate[key].length > 0) {
                return candidate[key];
            }
        }
    }
    return [];
};

export const ConfigurationProvider = ({ children }) => {
    const { isAuthenticated, isInitializing } = useAuth();
    const [configuration, setConfiguration] = useState(null);
    const [isLoadingConfig, setIsLoadingConfig] = useState(false);
    const [configError, setConfigError] = useState(null);
    const hasFetchedRef = useRef(false);

    /**
     * Fetches configuration details from the backend.
     * @param {boolean} force - If true, ignores the cached ref and forces a reload
     */
    const loadConfiguration = useCallback(async (force = false) => {
        if (!force && hasFetchedRef.current) {
            return;
        }

        setIsLoadingConfig(true);
        setConfigError(null);

        try {
            const data = await getConfiguration();
            setConfiguration(data);
            hasFetchedRef.current = true;
            return data;
        } catch (error) {
            console.error('Failed to load application configuration:', error);
            setConfigError(error.message || 'Failed to load configuration');
        } finally {
            setIsLoadingConfig(false);
        }
    }, []);

    // Automatically trigger configuration fetch when user is authenticated
    // (on app launch with saved tokens, on login, or on restored session)
    useEffect(() => {
        if (isAuthenticated) {
            loadConfiguration();
        } else if (!isInitializing) {
            // Clear configuration state on logout
            setConfiguration(null);
            hasFetchedRef.current = false;
        }
    }, [isAuthenticated, isInitializing, loadConfiguration]);

    // Normalized lookup lists (handling all field casing & naming variations)
    const statusList = useMemo(() => {
        const raw = extractList(
            configuration,
            'statusData', 'StatusData', 'statusList', 'StatusList', 'statuses', 'Statuses'
        );
        if (raw.length === 0) return DEFAULT_STATUS_LIST;
        return raw.map(item => ({
            identifier: item.statusidentifier ?? item.Statusidentifier ?? item.statusIdentifier ?? item.statusId ?? item.StatusId ?? item.id ?? item.identifier ?? '',
            name: item.status ?? item.Status ?? item.statusName ?? item.StatusName ?? item.name ?? item.title ?? ''
        }));
    }, [configuration]);

    const priorityList = useMemo(() => {
        const raw = extractList(
            configuration,
            'priorityData', 'PriorityData', 'priorityList', 'PriorityList', 'priorities', 'Priorities'
        );
        if (raw.length === 0) return DEFAULT_PRIORITY_LIST;
        return raw.map(item => ({
            identifier: item.priorityidentifier ?? item.Priorityidentifier ?? item.priorityIdentifier ?? item.priorityId ?? item.PriorityId ?? item.id ?? item.identifier ?? '',
            name: item.priority ?? item.Priority ?? item.priorityName ?? item.PriorityName ?? item.name ?? item.title ?? ''
        }));
    }, [configuration]);

    const goalTypeList = useMemo(() => {
        const raw = extractList(
            configuration,
            'goalTypeData', 'GoalTypeData', 'goalTypeList', 'GoalTypeList', 'goalTypes', 'GoalTypes'
        );
        if (raw.length === 0) return DEFAULT_GOAL_TYPE_LIST;
        return raw.map(item => ({
            identifier: item.goaltypeidentifier ?? item.Goaltypeidentifier ?? item.goalTypeIdentifier ?? item.goalTypeId ?? item.GoalTypeId ?? item.id ?? item.identifier ?? '',
            name: item.goaltype ?? item.Goaltype ?? item.goalType ?? item.goalTypeName ?? item.GoalTypeName ?? item.name ?? item.title ?? ''
        }));
    }, [configuration]);

    // Lookup helper functions (bidirectional lookup by Identifier or Name)
    const getGoalTypeName = useCallback((val) => {
        if (!val && val !== 0) return '';
        const strVal = String(val).trim().toLowerCase();
        const item = goalTypeList.find(g =>
            String(g.identifier).toLowerCase() === strVal ||
            String(g.name).toLowerCase() === strVal ||
            strVal.startsWith(String(g.name).toLowerCase())
        );
        return item ? item.name : val;
    }, [goalTypeList]);

    const getGoalTypeIdentifier = useCallback((val) => {
        if (!val && val !== 0) return '';
        const strVal = String(val).trim().toLowerCase();
        const item = goalTypeList.find(g =>
            String(g.identifier).toLowerCase() === strVal ||
            String(g.name).toLowerCase() === strVal ||
            strVal.startsWith(String(g.name).toLowerCase())
        );
        return item ? item.identifier : val;
    }, [goalTypeList]);

    const getPriorityName = useCallback((val) => {
        if (!val && val !== 0) return '';
        const strVal = String(val).trim().toLowerCase();
        const item = priorityList.find(p =>
            String(p.identifier).toLowerCase() === strVal ||
            String(p.name).toLowerCase() === strVal ||
            strVal.startsWith(String(p.name).toLowerCase())
        );
        return item ? item.name : val;
    }, [priorityList]);

    const getPriorityIdentifier = useCallback((val) => {
        if (!val && val !== 0) return '';
        const strVal = String(val).trim().toLowerCase();
        const item = priorityList.find(p =>
            String(p.identifier).toLowerCase() === strVal ||
            String(p.name).toLowerCase() === strVal ||
            strVal.startsWith(String(p.name).toLowerCase())
        );
        return item ? item.identifier : val;
    }, [priorityList]);

    const getStatusName = useCallback((val) => {
        if (!val && val !== 0) return '';
        const strVal = String(val).trim().toLowerCase();
        const item = statusList.find(s =>
            String(s.identifier).toLowerCase() === strVal ||
            String(s.name).toLowerCase() === strVal ||
            strVal.startsWith(String(s.name).toLowerCase())
        );
        return item ? item.name : val;
    }, [statusList]);

    const getStatusIdentifier = useCallback((val) => {
        if (!val && val !== 0) return '';
        const strVal = String(val).trim().toLowerCase();
        const item = statusList.find(s =>
            String(s.identifier).toLowerCase() === strVal ||
            String(s.name).toLowerCase() === strVal ||
            strVal.startsWith(String(s.name).toLowerCase())
        );
        return item ? item.identifier : val;
    }, [statusList]);

    // Dropdown options for GoalToolbar (filter with "All Statuses" / "Goal Type")
    const statusFilterOptions = useMemo(() => {
        return [
            { value: '', label: 'All Statuses' },
            ...statusList.map(s => ({
                value: String(s.identifier),
                label: s.name
            }))
        ];
    }, [statusList]);

    const goalTypeFilterOptions = useMemo(() => {
        return [
            { value: '', label: 'Goal Type' },
            ...goalTypeList.map(g => ({
                value: String(g.identifier),
                label: g.name
            }))
        ];
    }, [goalTypeList]);

    // Dropdown options for Forms / Create Goal / Task Creation (value = Master Identifier)
    const statusSelectOptions = useMemo(() => {
        return [
            { value: '', label: 'Select Status' },
            ...statusList.map(s => ({
                value: String(s.identifier),
                label: s.name
            }))
        ];
    }, [statusList]);

    const goalTypeSelectOptions = useMemo(() => {
        return [
            { value: '', label: 'Select Goal Type' },
            ...goalTypeList.map(g => ({
                value: String(g.identifier),
                label: g.name
            }))
        ];
    }, [goalTypeList]);

    const prioritySelectOptions = useMemo(() => {
        return [
            { value: '', label: 'Select Priority' },
            ...priorityList.map(p => ({
                value: String(p.identifier),
                label: p.name
            }))
        ];
    }, [priorityList]);

    return (
        <ConfigurationContext.Provider
            value={{
                configuration,
                isLoadingConfig,
                configError,
                loadConfiguration,
                // Normalized data lists
                statusList,
                priorityList,
                goalTypeList,
                // Lookup helpers
                getGoalTypeName,
                getGoalTypeIdentifier,
                getPriorityName,
                getPriorityIdentifier,
                getStatusName,
                getStatusIdentifier,
                // Prepared dropdown options
                statusFilterOptions,
                goalTypeFilterOptions,
                statusSelectOptions,
                goalTypeSelectOptions,
                prioritySelectOptions
            }}
        >
            {children}
        </ConfigurationContext.Provider>
    );
};

export const useConfiguration = () => {
    const context = useContext(ConfigurationContext);
    if (!context) {
        throw new Error('useConfiguration must be used within a ConfigurationProvider');
    }
    return context;
};

export default ConfigurationContext;
