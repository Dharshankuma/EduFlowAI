import React from 'react';
import DashboardCard from '../../../common/DashboardCard/DashboardCard';
import QuickActionItem from './QuickActionItem';
import './QuickActions.css';

export const QuickActions = ({ actions = [], onActionClick }) => {
    return (
        <DashboardCard className="quick-actions-card" hover={false} shadow={true} padding="24px">
            <h3 className="quick-actions-title mb-4">Quick Actions</h3>
            
            <div className="quick-actions-body">
                <div className="row g-3">
                    {/* Loop action rows */}
                    {actions.map((action, index) => (
                        <div key={action.id || index} className="col-12 col-sm-6">
                            <QuickActionItem
                                title={action.title}
                                icon={action.icon}
                                onClick={() => onActionClick && onActionClick(action)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </DashboardCard>
    );
};

export default QuickActions;
