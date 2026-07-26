import React from 'react';
import GoalCard from './GoalCard';
import './GoalGrid.css';

export const GoalGrid = ({
    goals = [],
    onView,
    onEdit,
    onDelete
}) => {
    return (
        <div className="goal-grid-container container-fluid p-0">
            <div className="row g-4">
                {goals.map((goal) => (
                    <div key={goal.id} className="col-12 col-md-6 col-lg-4">
                        <GoalCard
                            goal={goal}
                            onView={onView}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GoalGrid;
