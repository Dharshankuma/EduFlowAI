import React from 'react';
import DashboardCard from '../../../common/DashboardCard/DashboardCard';
import CardHeader from '../../../common/CardHeader/CardHeader';
import ActivityFeed from './ActivityFeed';
import './RecentActivity.css';

export const RecentActivity = ({ 
    activities = [], 
    onViewAllActivities 
}) => {
    return (
        <DashboardCard className="recent-activity-card" hover={false} shadow={true} padding="24px">
            <CardHeader
                title="Recent Activity"
                actionText="View All"
                onActionClick={onViewAllActivities}
            />
            
            <div className="recent-activity-body">
                {activities.length > 0 ? (
                    <ActivityFeed activities={activities} />
                ) : (
                    <p className="no-activity-text">No recent activities recorded.</p>
                )}
            </div>
        </DashboardCard>
    );
};

export default RecentActivity;
