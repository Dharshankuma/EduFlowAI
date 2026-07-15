import React from 'react';
import CardHeader from '../../../common/CardHeader/CardHeader';
import './CalendarHeader.css';

export const CalendarHeader = ({
    currentMonth,
    onPreviousMonth,
    onNextMonth
}) => {
    return (
        <div className="calendar-header-component">
            <CardHeader
                title={currentMonth}
                rightContent={
                    <div className="calendar-navigation">
                        <button 
                            className="cal-nav-btn" 
                            onClick={onPreviousMonth}
                            aria-label="Previous Month"
                            type="button"
                        >
                            <i className="bi bi-chevron-left"></i>
                        </button>
                        <button 
                            className="cal-nav-btn" 
                            onClick={onNextMonth}
                            aria-label="Next Month"
                            type="button"
                        >
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </div>
                }
            />
        </div>
    );
};

export default CalendarHeader;
