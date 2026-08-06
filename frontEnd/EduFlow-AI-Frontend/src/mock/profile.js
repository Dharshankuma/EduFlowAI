export const MOCK_PROFILE_STATS = [
    { id: 1, title: 'STUDY HOURS', value: '125 Hours', icon: 'bi-clock', description: 'Total study time', trendType: 'success' },
    { id: 2, title: 'COMPLETED TASKS', value: '482', icon: 'bi-check-circle', description: 'Successfully completed', trendType: 'success' },
    { id: 3, title: 'ACTIVE GOALS', value: '12', icon: 'bi-bullseye', description: 'Currently active', trendType: 'success' },
    { id: 4, title: 'STUDY STREAK', value: '15 Days', icon: 'bi-fire', description: 'Current streak', trendType: 'success' }
];

export const MOCK_STUDY_AVAILABILITY = [
    { day: 'Monday', enabled: true, startTime: '09:00', endTime: '17:00' },
    { day: 'Tuesday', enabled: true, startTime: '09:00', endTime: '17:00' },
    { day: 'Wednesday', enabled: true, startTime: '09:00', endTime: '17:00' },
    { day: 'Thursday', enabled: true, startTime: '09:00', endTime: '17:00' },
    { day: 'Friday', enabled: true, startTime: '09:00', endTime: '17:00' },
    { day: 'Saturday', enabled: true, startTime: '09:00', endTime: '17:00' },
    { day: 'Sunday', enabled: false, startTime: '00:00', endTime: '00:00' }
];

export const MOCK_STUDY_PREFERENCES = {
    sessionLength: '60',
    studyTime: 'Evening'
};

export const MOCK_QUICK_ACTIONS = [
    { id: 1, title: 'Create Goal', icon: 'bullseye', route: '/goals/create' },
    { id: 2, title: 'Generate Tasks', icon: 'stars', route: '/goals/create' }, // Routes to wizard
    { id: 3, title: 'Export Report', icon: 'download', route: '/analytics' }, // Routes to analytics
    { id: 4, title: 'Progress Log', icon: 'graph-up', route: '/analytics' } // Routes to analytics
];
