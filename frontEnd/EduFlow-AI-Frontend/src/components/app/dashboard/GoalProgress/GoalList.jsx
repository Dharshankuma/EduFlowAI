import React from 'react';
import GoalItem from './GoalItem';
import './GoalList.css';

export const GoalList = ({ goals = [], onCreateNewGoal }) => {
    return (
        <div className="goal-list-component">
            <div className="row g-3">
                {/* Loop active list */}
                {goals.map((goal, index) => (
                    <div key={goal.id || index} className="col-12 col-md-6">
                        <GoalItem
                            title={goal.title}
                            category={goal.category}
                            progress={goal.progress}
                            dueDate={goal.dueDate}
                            status={goal.status}
                        />
                    </div>
                ))}
                
                {/* Dotted border dashboard trigger placeholder for creating new goals */}
                <div className="col-12 col-md-6">
                    <button 
                        className="create-goal-placeholder-card" 
                        onClick={onCreateNewGoal}
                        type="button"
                        aria-label="Create New Goal"
                    >
                        <i className="bi bi-plus-circle-dotted create-goal-icon"></i>
                        <span className="create-goal-text">Create New Goal</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GoalList;
