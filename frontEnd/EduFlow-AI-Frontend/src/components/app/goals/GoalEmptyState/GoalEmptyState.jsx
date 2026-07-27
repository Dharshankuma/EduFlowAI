import React from 'react';
import DashboardCard from '../../../common/DashboardCard/DashboardCard';
import { ButtonComponent } from '../../../common/CommonComponents/ButtonComponent';
import './GoalEmptyState.css';

export const GoalEmptyState = ({ onCreateGoal }) => {
    return (
        <DashboardCard className="goal-empty-state-card" hover={false} shadow={true} padding="48px 32px">
            <div className="goal-empty-state-content d-flex flex-column align-items-center justify-content-center text-center">
                {/* Large bullseye icon wrapper */}
                <div className="goal-empty-state-icon-container mb-4">
                    <i className="bi bi-bullseye"></i>
                </div>
                
                {/* Title and Description */}
                <h3 className="goal-empty-state-title mb-2">No Goals Found</h3>
                <p className="goal-empty-state-desc mb-4 mx-auto">
                    You haven't created any goals yet or no goals match your current search and filter criteria.
                </p>

                {/* Create Goal Action Button */}
                <div className="goal-empty-state-action">
                    <ButtonComponent
                        type="button"
                        text="+ Create Goal"
                        className="btn goal-empty-state-btn"
                        onclick={onCreateGoal}
                    />
                </div>
            </div>
        </DashboardCard>
    );
};

export default GoalEmptyState;
