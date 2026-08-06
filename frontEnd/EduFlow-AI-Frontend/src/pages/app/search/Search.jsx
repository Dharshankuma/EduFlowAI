import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppState } from '../../../context/StateContext';
import DashboardCard from '../../../components/common/DashboardCard/DashboardCard';
import StatusBadge from '../../../components/common/StatusBadge/StatusBadge';
import ProgressBar from '../../../components/common/ProgressBar/ProgressBar';
import './Search.css';

export const Search = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { goals } = useAppState();

    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q') || '';

    // Filter goals
    const filteredGoals = goals.filter(g => 
        g.title.toLowerCase().includes(query.toLowerCase()) || 
        g.category.toLowerCase().includes(query.toLowerCase()) ||
        (g.description && g.description.toLowerCase().includes(query.toLowerCase()))
    );

    const handleViewGoal = (id) => {
        navigate(`/goals/${id}`);
    };

    return (
        <div className="search-page-container container-fluid p-0">
            {/* Page Header */}
            <div className="search-page-header text-start mb-4">
                <h1 className="search-page-title m-0">Search Results</h1>
                <p className="search-page-subtitle mt-1">
                    Showing results for: <strong>"{query}"</strong> ({filteredGoals.length} match{filteredGoals.length !== 1 ? 'es' : ''})
                </p>
            </div>

            <div className="row g-4">
                {filteredGoals.length > 0 ? (
                    filteredGoals.map(goal => (
                        <div key={goal.id} className="col-12 col-md-6 col-lg-4">
                            <DashboardCard hover={true} className="search-result-card h-100 text-start d-flex flex-column justify-content-between" padding="20px">
                                <div>
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <span className="badge bg-primary-subtle text-primary">{goal.category}</span>
                                        <span className={`badge ${goal.priority === 'High' ? 'bg-danger-subtle text-danger' : 'bg-secondary-subtle text-secondary'}`}>
                                            {goal.priority} Priority
                                        </span>
                                    </div>
                                    <h4 className="goal-card-title fw-bold mb-2">{goal.title}</h4>
                                    <p className="goal-card-desc text-secondary small mb-4 line-clamp-3">
                                        {goal.description || 'No description provided.'}
                                    </p>
                                </div>

                                <div>
                                    <div className="mb-3">
                                        <div className="d-flex justify-content-between text-secondary small mb-1">
                                            <span>Progress</span>
                                            <span>{goal.progress}%</span>
                                        </div>
                                        <ProgressBar progress={goal.progress} />
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                                        <span className="small text-secondary"><i className="bi bi-calendar-event me-1"></i>{goal.targetDate}</span>
                                        <button 
                                            className="btn btn-primary btn-sm px-3 fw-semibold"
                                            onClick={() => handleViewGoal(goal.id)}
                                        >
                                            Open Goal
                                        </button>
                                    </div>
                                </div>
                            </DashboardCard>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <DashboardCard padding="64px" className="text-center">
                            <i className="bi bi-search text-light fs-1 mb-2 d-block"></i>
                            <h4 className="fw-semibold">No results found</h4>
                            <p className="text-secondary small m-0">Try searching for other words, category, or title terms.</p>
                        </DashboardCard>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
