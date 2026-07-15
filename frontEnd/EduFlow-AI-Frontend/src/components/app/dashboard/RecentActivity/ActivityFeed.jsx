import React from 'react';
import ActivityItem from './ActivityItem';
import './ActivityFeed.css';

export const ActivityFeed = ({ activities = [] }) => {
    return (
        <div className="activity-feed-component">
            {/* Loop activity items */}
            {activities.map((activity, index) => (
                <ActivityItem
                    key={activity.id || index}
                    type={activity.type}
                    title={activity.title}
                    description={activity.description}
                    time={activity.time}
                    status={activity.status}
                    icon={activity.icon}
                />
            ))}
        </div>
    );
};

export default ActivityFeed;
