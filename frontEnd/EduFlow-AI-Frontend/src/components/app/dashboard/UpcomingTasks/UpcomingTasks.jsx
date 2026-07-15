import React from 'react';
import DashboardCard from '../../../common/DashboardCard/DashboardCard';
import CardHeader from '../../../common/CardHeader/CardHeader';
import TaskList from './TaskList';
import './UpcomingTasks.css';

export const UpcomingTasks = ({ 
    tasks = [], 
    onViewAllTasks,
    onTaskClick 
}) => {
    return (
        <DashboardCard className="upcoming-tasks-card" hover={false} shadow={true} padding="24px">
            {/* Header with View All action */}
            <CardHeader
                title="Upcoming Tasks"
                actionText="View All"
                onActionClick={onViewAllTasks}
            />
            
            {/* List panel */}
            <div className="upcoming-tasks-body">
                {tasks.length > 0 ? (
                    <TaskList tasks={tasks} onTaskClick={onTaskClick} />
                ) : (
                    <p className="no-tasks-text">No upcoming tasks scheduled.</p>
                )}
            </div>
        </DashboardCard>
    );
};

export default UpcomingTasks;
