import React from 'react';
import DashboardCard from '../../../common/DashboardCard/DashboardCard';
import CardHeader from '../../../common/CardHeader/CardHeader';
import GoalList from './GoalList';
import './GoalProgress.css';

export const GoalProgress = ({ 
    goals = [], 
    onViewAllGoals,
    onCreateNewGoal
}) => {
    return (
        <DashboardCard className="goal-progress-card" hover={false} shadow={true} padding="24px">
            {/* Reusable header template */}
            <CardHeader
                title="Goal Progress"
                actionText="View All"
                onActionClick={onViewAllGoals}
            />
            
            {/* Goals list grid */}
            <div className="goal-progress-body">
                <GoalList goals={goals} onCreateNewGoal={onCreateNewGoal} />
            </div>
        </DashboardCard>
    );
};

export default GoalProgress;
