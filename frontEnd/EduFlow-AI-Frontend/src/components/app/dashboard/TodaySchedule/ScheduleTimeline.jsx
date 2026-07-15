import React from 'react';
import ScheduleItem from './ScheduleItem';
import './ScheduleTimeline.css';

export const ScheduleTimeline = ({ items = [] }) => {
    return (
        <div className="schedule-timeline-el">
            {items.map((item, index) => (
                <ScheduleItem
                    key={item.id || index}
                    time={item.time}
                    subject={item.subject}
                    topic={item.topic}
                    status={item.status}
                    isLast={index === items.length - 1}
                />
            ))}
        </div>
    );
};

export default ScheduleTimeline;
