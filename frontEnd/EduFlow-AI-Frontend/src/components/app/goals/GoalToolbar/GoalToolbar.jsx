import React from 'react';
import DashboardCard from '../../../common/DashboardCard/DashboardCard';
import { InputComponent } from '../../../common/CommonComponents/InputComponent';
import { SelectComponent } from '../../../common/CommonComponents/SelectComponent';
import { ButtonComponent } from '../../../common/CommonComponents/ButtonComponent';
import './GoalToolbar.css';

const STATUS_OPTIONS = [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'on-hold', label: 'On Hold' },
    { value: 'archived', label: 'Archived' }
];

const TYPE_OPTIONS = [
    { value: '', label: 'Goal Type' },
    { value: 'academic', label: 'Academic' },
    { value: 'placement', label: 'Placement' },
    { value: 'certification', label: 'Certification' },
    { value: 'personal', label: 'Personal' },
    { value: 'skill-up', label: 'Skill Up' }
];

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'progress', label: 'Progress' },
    { value: 'due-date', label: 'Due Date' },
    { value: 'priority', label: 'Priority' }
];

export const GoalToolbar = ({
    searchValue = '',
    onSearchChange,
    selectedStatus = '',
    onStatusChange,
    selectedGoalType = '',
    onGoalTypeChange,
    selectedSort = 'newest',
    onSortChange,
    onCreateGoal
}) => {
    return (
        <DashboardCard className="goal-toolbar-card" hover={false} shadow={true} padding="16px 24px">
            <div className="goal-toolbar-container d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3">
                {/* Search Input (Left Section) */}
                <div className="goal-toolbar-search flex-grow-1">
                    <InputComponent
                        name="searchGoals"
                        placeholder="Search goals..."
                        value={searchValue}
                        onChange={onSearchChange}
                        icon={<i className="bi bi-search"></i>}
                    />
                </div>

                {/* Filters and Actions (Right Section) */}
                <div className="goal-toolbar-actions d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2 gap-md-3">
                    {/* Status Filter Dropdown */}
                    <div className="goal-select-wrapper">
                        <SelectComponent
                            name="statusFilter"
                            className="goal-filter-select"
                            value={selectedStatus}
                            onChange={onStatusChange}
                            options={STATUS_OPTIONS}
                        />
                    </div>

                    {/* Goal Type Filter Dropdown */}
                    <div className="goal-select-wrapper">
                        <SelectComponent
                            name="typeFilter"
                            className="goal-filter-select"
                            value={selectedGoalType}
                            onChange={onGoalTypeChange}
                            options={TYPE_OPTIONS}
                        />
                    </div>

                    {/* Sort Dropdown */}
                    <div className="goal-select-wrapper">
                        <SelectComponent
                            name="sortFilter"
                            className="goal-filter-select"
                            value={selectedSort}
                            onChange={onSortChange}
                            options={SORT_OPTIONS}
                        />
                    </div>

                    {/* Create Goal Button */}
                    {/* <div className="goal-create-btn-wrapper">
                        <ButtonComponent
                            type="button"
                            text="+ Create Goal"
                            className="btn goal-create-btn"
                            onclick={onCreateGoal}
                        />
                    </div> */}
                </div>
            </div>
        </DashboardCard>
    );
};

export default GoalToolbar;
