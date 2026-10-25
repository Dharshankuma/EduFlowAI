import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import GoalStatistics from '../../../../components/app/goals/GoalStatistics/GoalStatistics';
import GoalToolbar from '../../../../components/app/goals/GoalToolbar/GoalToolbar';
import GoalGrid from '../../../../components/app/goals/GoalGrid/GoalGrid';
import GoalEmptyState from '../../../../components/app/goals/GoalEmptyState/GoalEmptyState';
import GoalPagination from '../../../../components/app/goals/GoalPagination/GoalPagination';
import DashboardCard from '../../../../components/common/DashboardCard/DashboardCard';
import { ButtonComponent } from '../../../../components/common/CommonComponents/ButtonComponent';
import { useAppState } from '../../../../context/StateContext';
import { getGoalsGrid, normalizeGridResponse } from '../../../../api/goals/goalApi';
import './Goals.css';

/**
 * Maps frontend sort keys to backend SortBy string values.
 */
const mapSortBy = (sortKey) => {
    switch (sortKey?.toLowerCase()) {
        case 'oldest': return 'Oldest';
        case 'progress': return 'Progress';
        case 'duedate': return 'DueDate';
        case 'priority': return 'Priority';
        case 'newest':
        default: return 'Newest';
    }
};

/**
 * Maps frontend status filter values to backend statusIdentifier.
 */
const mapStatusIdentifier = (val) => {
    if (!val) return null;
    switch (val.toLowerCase()) {
        case 'active': return 'Active';
        case 'completed': return 'Completed';
        case 'on-hold':
        case 'onhold': return 'On Hold';
        case 'archived': return 'Archived';
        default: return val;
    }
};

/**
 * Maps frontend goal type filter values to backend goalType.
 */
const mapGoalType = (val) => {
    if (!val) return null;
    switch (val.toLowerCase()) {
        case 'academic': return 'Academic';
        case 'placement': return 'Placement';
        case 'certification': return 'Certification';
        case 'personal': return 'Personal';
        case 'skill-up':
        case 'skillup': return 'Skill Up';
        default: return val;
    }
};

export const Goals = () => {
    const navigate = useNavigate();
    const { deleteGoal } = useAppState();

    // API Data state
    const [goalsList, setGoalsList] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [statsData, setStatsData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter, search, and pagination state
    const [searchValue, setSearchValue] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedGoalType, setSelectedGoalType] = useState('');
    const [selectedSort, setSelectedSort] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Debounce search input to avoid sending requests on every keystroke
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchValue);
        }, 350);

        return () => clearTimeout(handler);
    }, [searchValue]);

    // Fetch goals grid from the API
    const fetchGoalsGrid = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const responseData = await getGoalsGrid({
                goalSearch: debouncedSearch.trim(),
                statusIdentifier: mapStatusIdentifier(selectedStatus),
                goalType: mapGoalType(selectedGoalType),
                priorityId: null,
                sortBy: mapSortBy(selectedSort),
                pageNumber: currentPage,
                pageSize: pageSize
            });

            const normalized = normalizeGridResponse(responseData);
            setGoalsList(normalized.items);
            setTotalItems(normalized.totalCount);
            setTotalPages(normalized.totalPages);
            setStatsData(normalized.statistics || normalized.raw);
        } catch (err) {
            console.error('Failed to fetch goals grid:', err);
            setError(err.message || 'Failed to load goals. Please try again.');
            setGoalsList([]);
            setTotalItems(0);
            setTotalPages(1);
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch, selectedStatus, selectedGoalType, selectedSort, currentPage, pageSize]);

    useEffect(() => {
        fetchGoalsGrid();
    }, [fetchGoalsGrid]);

    // Calculate summary statistics from API response or fallback to loaded goals
    const totalGoals = statsData?.totalGoals ?? statsData?.TotalGoals ?? statsData?.total ?? statsData?.Total ?? totalItems;
    const activeGoals = statsData?.activeGoals ?? statsData?.ActiveGoals ?? statsData?.active ?? statsData?.Active ?? goalsList.filter(g => {
        const s = (g.status || '').toLowerCase();
        return s === 'active' || s === 'in progress' || s === 'inprogress';
    }).length;
    const completedGoals = statsData?.completedGoals ?? statsData?.CompletedGoals ?? statsData?.completed ?? statsData?.Completed ?? goalsList.filter(g => {
        const s = (g.status || '').toLowerCase();
        return g.progress === 100 || s === 'completed';
    }).length;
    const urgentGoals = statsData?.urgentGoals ?? statsData?.UrgentGoals ?? statsData?.urgent ?? statsData?.Urgent ?? goalsList.filter(g => {
        const p = (g.priority || '').toLowerCase();
        return p === 'high' || p === 'urgent';
    }).length;

    const statistics = [
        { id: 1, title: 'TOTAL', value: totalGoals, description: 'Global objectives', icon: 'bi-flag' },
        { id: 2, title: 'ACTIVE', value: activeGoals, description: 'In progress now', icon: 'bi-lightning-charge' },
        { id: 3, title: 'COMPLETED', value: completedGoals, description: 'Milestones reached', icon: 'bi-check-circle' },
        { id: 4, title: 'URGENT', value: urgentGoals, description: 'Upcoming deadlines', icon: 'bi-calendar-event' }
    ];

    // Event handlers
    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
        setCurrentPage(1);
    };

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
        setCurrentPage(1);
    };

    const handleGoalTypeChange = (e) => {
        setSelectedGoalType(e.target.value);
        setCurrentPage(1);
    };

    const handleSortChange = (e) => {
        setSelectedSort(e.target.value);
        setCurrentPage(1);
    };

    const handleCreateGoal = () => {
        navigate('/goals/create');
    };

    const handleViewGoal = (goalIdentifier) => {
        navigate(`/goals/${encodeURIComponent(goalIdentifier)}`);
    };

    const handleEditGoal = (goalIdentifier) => {
        navigate(`/goals/${encodeURIComponent(goalIdentifier)}/edit`);
    };

    const handleDeleteGoal = (id) => {
        console.log(`Delete goal action triggered (ID: ${id})`);
        if (deleteGoal) {
            deleteGoal(id);
        }
        setGoalsList(prev => prev.filter(g => g.id !== id));
    };

    const handlePageChange = (pageNum) => {
        setCurrentPage(pageNum);
    };

    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        setCurrentPage(1);
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

                {/* 3. Goal Grid, Loading, Error, or Empty State Section */}
                <div className="goals-layout-section">
                    {isLoading ? (
                        <DashboardCard className="goal-loading-card" hover={false} shadow={true} padding="48px 32px">
                            <div className="d-flex flex-column align-items-center justify-content-center text-center">
                                <div className="spinner-border text-primary mb-3" style={{ width: '2.5rem', height: '2.5rem' }} role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="text-muted mb-0">Loading goals...</p>
                            </div>
                        </DashboardCard>
                    ) : error ? (
                        <DashboardCard className="goal-error-card" hover={false} shadow={true} padding="48px 32px">
                            <div className="d-flex flex-column align-items-center justify-content-center text-center">
                                <div className="text-danger mb-3" style={{ fontSize: '2.5rem' }}>
                                    <i className="bi bi-exclamation-triangle"></i>
                                </div>
                                <h4 className="mb-2">Unable to Load Goals</h4>
                                <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '440px' }}>
                                    {error}
                                </p>
                                <ButtonComponent
                                    type="button"
                                    text="Try Again"
                                    className="btn btn-outline-primary"
                                    onclick={fetchGoalsGrid}
                                />
                            </div>
                        </DashboardCard>
                    ) : goalsList.length > 0 ? (
                        <GoalGrid
                            goals={goalsList}
                            onView={handleViewGoal}
                            onEdit={handleEditGoal}
                            onDelete={handleDeleteGoal}
                        />
                    ) : (
                        <GoalEmptyState onCreateGoal={handleCreateGoal} />
                    )}
                </div>

                {/* 4. Goal Pagination Section (Only when not loading, no error, and goals exist) */}
                {!isLoading && !error && goalsList.length > 0 && (
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
