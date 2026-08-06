export const MOCK_SETTINGS = {
    notifications: [
        { id: 1, title: 'Email Notifications', enabled: true },
        { id: 2, title: 'Daily Study Reminders', enabled: true },
        { id: 3, title: 'Planner Notifications', enabled: false }
    ],
    security: {
        twoFactorEnabled: false,
        actions: [
            { id: 1, title: 'Active Devices' },
            { id: 2, title: 'Login History' },
            { id: 3, title: 'Change Password' }
        ]
    },
    account: {
        actions: [
            { id: 1, title: 'Export Study Data' },
            { id: 2, title: 'Download Schedule' }
        ]
    }
};
