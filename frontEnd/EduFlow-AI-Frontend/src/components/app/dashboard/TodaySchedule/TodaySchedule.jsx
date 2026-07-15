import React from 'react';
import DashboardCard from '../../../common/DashboardCard/DashboardCard';
import CardHeader from '../../../common/CardHeader/CardHeader';
import ScheduleTimeline from './ScheduleTimeline';
import './TodaySchedule.css';

export const TodaySchedule = ({ scheduleItems = [], onEditSchedule }) => {
    return (
        <DashboardCard className="today-schedule-card" hover={false} shadow={true} padding="24px">
            <CardHeader
                title="Today's Schedule"
                actionText="Edit Schedule"
                onActionClick={onEditSchedule}
            />
            <div className="today-schedule-body">
                {scheduleItems.length > 0 ? (
                    <ScheduleTimeline items={scheduleItems} />
                ) : (
                    <p className="no-schedule-text">No study events scheduled for today.</p>
                )}
            </div>
        </DashboardCard>
    );
};

export default TodaySchedule;
