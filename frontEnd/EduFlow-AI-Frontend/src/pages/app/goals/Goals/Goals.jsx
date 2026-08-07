import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoalStatistics from '../../../../components/app/goals/GoalStatistics/GoalStatistics';
import GoalToolbar from '../../../../components/app/goals/GoalToolbar/GoalToolbar';
import GoalGrid from '../../../../components/app/goals/GoalGrid/GoalGrid';
import GoalEmptyState from '../../../../components/app/goals/GoalEmptyState/GoalEmptyState';
import GoalPagination from '../../../../components/app/goals/GoalPagination/GoalPagination';
import { ButtonComponent } from '../../../../components/common/CommonComponents/ButtonComponent';
import { useAppState } from '../../../../context/StateContext';
import './Goals.css';

// Mock statistics data
const MOCK_STATISTICS = [
    { id: 1, title: 'TOTAL', value: 12, description: 'Global objectives', icon: 'bi-flag' },
    { id: 2, title: 'ACTIVE', value: 4, description: 'In progress now', icon: 'bi-lightning-charge' },
    { id: 3, title: 'COMPLETED', value: 8, description: 'Milestones reached', icon: 'bi-check-circle' },
    { id: 4, title: 'URGENT', value: 2, description: 'Upcoming deadlines', icon: 'bi-calendar-event' }
];

// Mock goals data matching Figma exactly
const MOCK_GOALS = [
    {
        id: 1,
        title: 'Placement Preparation',
        category: 'Placement',
        priority: 'High',
        progress: 75,
        totalTasks: 20,
        completedTasks: 15,
        remainingTasks: 5,
        targetDate: 'Aug 15, 2026',
        nextSession: 'Tomorrow, 10:00 AM',
        status: 'Active'
    },
    {
        id: 2,
        title: 'Advanced DS & Algo',
        category: 'Academic',
        priority: 'Medium',
        progress: 45,
        totalTasks: 12,
        completedTasks: 5,
        remainingTasks: 7,
        targetDate: 'Dec 20, 2025',
        nextSession: 'Today, 4:00 PM',
        status: 'Active'
    },
    {
        id: 3,
        title: 'AWS Solutions Architect',
        category: 'Skill Up',
        priority: 'High',
        progress: 15,
        totalTasks: 45,
        completedTasks: 7,
        remainingTasks: 38,
        targetDate: 'Mar 10, 2026',
        nextSession: 'Tomorrow, 2:00 PM',
        status: 'On Hold'
    }
];

export const Goals = () => {
    const navigate = useNavigate();
    const { goals, deleteGoal } = useAppState();

    // Dynamically calculate statistics from global state
    const totalGoals = goals.length;
    const activeGoals = goals.filter(g => g.status === 'Active' || g.status === 'In Progress').length;
    const completedGoals = goals.filter(g => g.progress === 100 || g.status === 'Completed').length;
    const urgentGoals = goals.filter(g => g.priority === 'High').length;

    const statistics = [
        { id: 1, title: 'TOTAL', value: totalGoals, description: 'Global objectives', icon: 'bi-flag' },
        { id: 2, title: 'ACTIVE', value: activeGoals, description: 'In progress now', icon: 'bi-lightning-charge' },
        { id: 3, title: 'COMPLETED', value: completedGoals, description: 'Milestones reached', icon: 'bi-check-circle' },
        { id: 4, title: 'URGENT', value: urgentGoals, description: 'Upcoming deadlines', icon: 'bi-calendar-event' }
    ];

    // State management
    const [searchValue, setSearchValue] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedGoalType, setSelectedGoalType] = useState('');
    const [selectedSort, setSelectedSort] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    
    const filteredGoals = goals.filter(g => {
        const matchesSearch = g.title.toLowerCase().includes(searchValue.toLowerCase()) || 
                             g.category.toLowerCase().includes(searchValue.toLowerCase());
        const matchesStatus = !selectedStatus || g.status === selectedStatus;
        const matchesType = !selectedGoalType || g.category === selectedGoalType;
        return matchesSearch && matchesStatus && matchesType;
    });

    const totalItems = filteredGoals.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    // Callback event handlers
    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
        console.log(`Search value updated to: ${e.target.value}`);
    };

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
        console.log(`Selected status filter: ${e.target.value}`);
    };

    const handleGoalTypeChange = (e) => {
        setSelectedGoalType(e.target.value);
        console.log(`Selected goal type filter: ${e.target.value}`);
    };

    const handleSortChange = (e) => {
        setSelectedSort(e.target.value);
        console.log(`Selected sort criteria: ${e.target.value}`);
    };
    const handleCreateGoal = () => {
        navigate('/goals/create');
    };

    const handleViewGoal = (id) => {
        navigate(`/goals/${id}`);
    };

    const handleEditGoal = (id) => {
        navigate(`/goals/${id}/edit`);
    };

    const handleDeleteGoal = (id) => {
        console.log(`Delete goal action triggered (ID: ${id})`);
        deleteGoal(id);
    };

    const handlePageChange = (pageNum) => {
        setCurrentPage(pageNum);
        console.log(`Navigated to page: ${pageNum}`);
    };

    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        setCurrentPage(1); // Standard: reset page index on size changes
        console.log(`Page size adjusted to: ${newSize}`);
    };

    return (
        <div className="goals-page-container container-fluid p-0">
            {/* Page Header */}
            <div className="goals-page-header d-flex justify-content-between align-items-center mb-4">
                <div className="text-start">
                    <h1 className="goals-page-title m-0">Goal Management</h1>
                    <p className="goals-page-desc mt-1 mb-0">
                        Manage your learning goals. Every goal becomes a personalized study schedule using the Planner Engine.
                    </p>
                </div>
                <div className="d-none d-md-block">
                    <ButtonComponent
                        type="button"
                        text="+ Create Goal"
                        className="btn goals-header-create-btn"
                        onclick={handleCreateGoal}
                    />
                </div>
            </div>

            {/* Layout Stack (Consistent spacing via flex column gap) */}
            <div className="goals-layout-stack d-flex flex-column">
                {/* 1. Goal Statistics Section */}
                <div className="goals-layout-section">
                    <GoalStatistics statistics={statistics} />
                </div>

                {/* 2. Goal Toolbar Section */}
                <div className="goals-layout-section">
                    <GoalToolbar
                        searchValue={searchValue}
                        onSearchChange={handleSearchChange}
                        selectedStatus={selectedStatus}
                        onStatusChange={handleStatusChange}
                        selectedGoalType={selectedGoalType}
                        onGoalTypeChange={handleGoalTypeChange}
                        selectedSort={selectedSort}
                        onSortChange={handleSortChange}
                        onCreateGoal={handleCreateGoal}
                    />
                </div>

                {/* 3. Goal Grid or Empty State Section */}
                <div className="goals-layout-section">
                    {filteredGoals.length > 0 ? (
                        <GoalGrid
                            goals={filteredGoals}
                            onView={handleViewGoal}
                            onEdit={handleEditGoal}
                            onDelete={handleDeleteGoal}
                        />
                    ) : (
                        <GoalEmptyState onCreateGoal={handleCreateGoal} />
                    )}
                </div>

                {/* 4. Goal Pagination Section (Only when goals exist) */}
                {filteredGoals.length > 0 && (
                    <div className="goals-layout-section">
                        <GoalPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            pageSize={pageSize}
                            totalItems={totalItems}
                            onPageChange={handlePageChange}
                            onPageSizeChange={handlePageSizeChange}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Goals;
