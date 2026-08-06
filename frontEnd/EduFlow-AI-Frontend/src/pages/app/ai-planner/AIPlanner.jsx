import React, { useState } from 'react';
import { MOCK_AI_RECOMMENDATIONS, MOCK_PLANNER_INSIGHTS } from '../../../mock/planner';
import DashboardCard from '../../../components/common/DashboardCard/DashboardCard';
import { ButtonComponent } from '../../../components/common/CommonComponents/ButtonComponent';
import './AIPlanner.css';

export const AIPlanner = () => {
    const [recommendations, setRecommendations] = useState(MOCK_AI_RECOMMENDATIONS);
    const [insights, setInsights] = useState(MOCK_PLANNER_INSIGHTS);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const handleApplyRecommendation = (id) => {
        setRecommendations(prev => prev.filter(r => r.id !== id));
        alert("Recommendation applied! Scheduling slots adjusted.");
    };

    const handleOptimize = () => {
        setIsOptimizing(true);
        setSuccessMsg('');
        setTimeout(() => {
            setIsOptimizing(false);
            setSuccessMsg('Planner Engine optimized your study blocks successfully! Peak hours are balanced.');
            setTimeout(() => setSuccessMsg(''), 4000);
        }, 2000);
    };

    return (
        <div className="ai-planner-page-container container-fluid p-0">
            {/* Page Header */}
            <div className="ai-planner-page-header text-start mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                    <h1 className="ai-planner-page-title m-0">AI Planner Assistant</h1>
                    <p className="ai-planner-page-subtitle mt-1 mb-0">
                        Smart study recommendations based on your habits and tasks difficulty.
                    </p>
                </div>
                <ButtonComponent
                    type="button"
                    text={isOptimizing ? "Optimizing Study Slots..." : "Run Global Optimization"}
                    className="btn type_1_btn"
                    onclick={handleOptimize}
                    disabled={isOptimizing}
                />
            </div>

            {successMsg && (
                <div className="alert alert-success py-2 px-3 mb-4 text-start small w-100" role="alert">
                    <i className="bi bi-patch-check-fill me-2"></i>
                    {successMsg}
                </div>
            )}

            <div className="row g-4">
                {/* Recommendations list */}
                <div className="col-12 col-lg-8">
                    <h3 className="section-title-custom text-start mb-3">AI Suggestions</h3>
                    {recommendations.length > 0 ? (
                        <div className="d-flex flex-column gap-3">
                            {recommendations.map(rec => (
                                <DashboardCard key={rec.id} hover={true} padding="20px" className="rec-card text-start">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="badge bg-primary-subtle text-primary">{rec.type}</span>
                                            <span className={`badge ${rec.impact === 'High Impact' ? 'bg-danger-subtle text-danger' : 'bg-warning-subtle text-warning'}`}>
                                                {rec.impact}
                                            </span>
                                        </div>
                                        <button 
                                            className="btn btn-sm btn-outline-primary px-3 fw-semibold"
                                            onClick={() => handleApplyRecommendation(rec.id)}
                                        >
                                            Apply
                                        </button>
                                    </div>
                                    <h4 className="rec-title fw-bold m-0 mb-1">{rec.title}</h4>
                                    <p className="rec-desc text-secondary small m-0">{rec.description}</p>
                                </DashboardCard>
                            ))}
                        </div>
                    ) : (
                        <DashboardCard padding="40px" className="text-center">
                            <i className="bi bi-emoji-smile text-success fs-1 mb-2 d-block"></i>
                            <h4 className="fw-semibold">All caught up!</h4>
                            <p className="text-secondary small m-0">No pending suggestions. Your schedule is fully optimal.</p>
                        </DashboardCard>
                    )}
                </div>

                {/* Insights Panel */}
                <div className="col-12 col-lg-4">
                    <h3 className="section-title-custom text-start mb-3">Planner Insights</h3>
                    <div className="d-flex flex-column gap-3">
                        <DashboardCard padding="20px" hover={false} className="text-start">
                            <div className="mb-4">
                                <span className="text-secondary small d-block mb-1">WEEKLY WORKLOAD INDEX</span>
                                <span className="fs-5 fw-bold text-primary">{insights.weeklyWorkloadIndex}</span>
                            </div>
                            <div className="mb-4">
                                <span className="text-secondary small d-block mb-1">PREDICTED COMPLETION RATE</span>
                                <span className="fs-5 fw-bold text-success">{insights.predictedCompletionRate}</span>
                            </div>
                            <div className="mb-2">
                                <span className="text-secondary small d-block mb-1">RECOMMENDED BREAK TIME</span>
                                <span className="fs-5 fw-bold text-warning">{insights.suggestedBreakTime}</span>
                            </div>
                        </DashboardCard>

                        <DashboardCard padding="20px" hover={false} className="insight-features-box text-start">
                            <h5 className="fw-bold mb-3"><i className="bi bi-stars text-primary me-2"></i>Planner Engine Rules</h5>
                            <ul className="small text-secondary list-unstyled d-flex flex-column gap-2 m-0 p-0">
                                <li className="d-flex align-items-start gap-2">
                                    <i className="bi bi-check-circle text-success mt-1"></i>
                                    <span>Prioritize tasks due within 48 hours.</span>
                                </li>
                                <li className="d-flex align-items-start gap-2">
                                    <i className="bi bi-check-circle text-success mt-1"></i>
                                    <span>Distribute hours according to peak performance intervals.</span>
                                </li>
                                <li className="d-flex align-items-start gap-2">
                                    <i className="bi bi-check-circle text-success mt-1"></i>
                                    <span>Insert active break slots for retention buffering.</span>
                                </li>
                            </ul>
                        </DashboardCard>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIPlanner;
