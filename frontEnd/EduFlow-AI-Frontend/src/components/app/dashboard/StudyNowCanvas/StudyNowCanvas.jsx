import React from 'react';
import { ButtonComponent } from '../../../common/CommonComponents/ButtonComponent';
import './StudyNowCanvas.css';

export const StudyNowCanvas = ({
    isOpen = false,
    todaySummary = {
        sessions: 0,
        completed: 0,
        inProgress: 0,
        timeLeft: '0h 00m'
    },
    progress = 0,
    sessions = [],
    onClose,
    onStartSession,
    onMarkComplete,
    onViewSession,
    onReschedule,
    onViewFullSchedule
}) => {
    if (!isOpen) return null;

    // Helper to render the status badge dynamically
    const renderStatusBadge = (status) => {
        const normalized = status?.toLowerCase() || '';
        switch (normalized) {
            case 'pending':
                return <span className="status-badge status-pending">Pending</span>;
            case 'in-progress':
            case 'in_progress':
                return <span className="status-badge status-in-progress">In Progress</span>;
            case 'completed':
                return <span className="status-badge status-completed">Completed</span>;
            case 'missed':
                return <span className="status-badge status-missed">Missed</span>;
            default:
                return <span className="status-badge">{status}</span>;
        }
    };

    // Helper to render card action button based on state
    const renderSessionAction = (session) => {
        const status = session.status?.toLowerCase() || '';
        switch (status) {
            case 'pending':
                return (
                    <button
                        type="button"
                        className="session-action-btn btn-start-study"
                        onClick={() => onStartSession && onStartSession(session.id)}
                    >
                        <i className="bi bi-play-fill"></i> Start Study
                    </button>
                );
            case 'in-progress':
            case 'in_progress':
                return (
                    <button
                        type="button"
                        className="session-action-btn btn-mark-complete"
                        onClick={() => onMarkComplete && onMarkComplete(session.id)}
                    >
                        <i className="bi bi-check-circle"></i> Mark as Complete
                    </button>
                );
            case 'completed':
                return (
                    <button
                        type="button"
                        className="session-action-btn btn-completed"
                        disabled
                    >
                        <i className="bi bi-check-lg"></i> Completed
                    </button>
                );
            case 'missed':
                return (
                    <button
                        type="button"
                        className="session-action-btn btn-reschedule"
                        onClick={() => onReschedule && onReschedule(session.id)}
                    >
                        <i className="bi bi-arrow-clockwise"></i> Reschedule
                    </button>
                );
            default:
                return null;
        }
    };

    return (
        <>
            {/* Full-screen background dimmed overlay */}
            <div className="study-now-overlay" onClick={onClose} />

            {/* Slide-in canvas drawer */}
            <aside className="study-now-canvas" aria-label="Study Now Drawer">
                {/* Header */}
                <div className="canvas-header">
                    <div className="header-info-container">
                        <div className="header-icon-box">
                            <i className="bi bi-journal-check"></i>
                        </div>
                        <div>
                            <h2 className="header-title-text">Study Now</h2>
                            <p className="header-subtitle-text">Focus on today's personalized study sessions.</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="canvas-close-btn"
                        onClick={onClose}
                        aria-label="Close Study Now drawer"
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                {/* Content Area */}
                <div className="canvas-body">
                    {/* Summary Cards */}
                    <div className="container-fluid p-0">
                        <div className="row g-2 summary-cards-row">
                            <div className="col-6 summary-card-col">
                                <div className="summary-metric-card">
                                    <span className="summary-card-label">Sessions</span>
                                    <h4 className="summary-card-value">{todaySummary.sessions ?? 0}</h4>
                                </div>
                            </div>
                            <div className="col-6 summary-card-col">
                                <div className="summary-metric-card">
                                    <span className="summary-card-label">Completed</span>
                                    <h4 className="summary-card-value">{todaySummary.completed ?? 0}</h4>
                                </div>
                            </div>
                            <div className="col-6 summary-card-col">
                                <div className="summary-metric-card">
                                    <span className="summary-card-label">In Progress</span>
                                    <h4 className="summary-card-value">{todaySummary.inProgress ?? 0}</h4>
                                </div>
                            </div>
                            <div className="col-6 summary-card-col">
                                <div className="summary-metric-card">
                                    <span className="summary-card-label">Time Left</span>
                                    <h4 className="summary-card-value">{todaySummary.timeLeft || '0h 00m'}</h4>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Today's Progress */}
                    <div className="today-progress-section">
                        <div className="progress-info-row">
                            <span className="progress-label-text">Today's Progress</span>
                            <span className="progress-value-text">{progress}%</span>
                        </div>
                        <div className="custom-progress-track">
                            <div
                                className="custom-progress-fill"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Today's Study Sessions Title */}
                    <h3 className="sessions-section-title">Today's Study Sessions</h3>

                    {/* Study Sessions List */}
                    <div className="sessions-list-container">
                        {sessions && sessions.length > 0 ? (
                            sessions.map((session) => (
                                <div
                                    key={session.id}
                                    className="study-session-card"
                                    onClick={(e) => {
                                        // Trigger onViewSession callback only if background card body is clicked
                                        if (e.target.closest('.session-action-btn')) return;
                                        if (onViewSession) onViewSession(session.id);
                                    }}
                                >
                                    <div className="session-card-header">
                                        <div>
                                            <h4 className="session-subject-title">{session.subject}</h4>
                                            <p className="session-metadata-row">
                                                {session.type} &bull; {session.startTime} - {session.endTime}
                                            </p>
                                        </div>
                                        {renderStatusBadge(session.status)}
                                    </div>

                                    {/* Started at or Completed at text */}
                                    {session.status?.toLowerCase() === 'in-progress' && session.startedAt && (
                                        <p className="session-info-line">
                                            <span className="info-bullet"></span>
                                            Started at {session.startedAt}
                                        </p>
                                    )}
                                    {session.status?.toLowerCase() === 'completed' && session.completedAt && (
                                        <p className="session-info-line">
                                            <span className="info-bullet"></span>
                                            Completed at {session.completedAt}
                                        </p>
                                    )}

                                    {/* Action Button */}
                                    <div className="session-action-container mt-1">
                                        {renderSessionAction(session)}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-muted text-center py-3">No study sessions schedule for today.</p>
                        )}
                    </div>
                </div>

                {/* Footer Section */}
                <div className="canvas-footer">
                    <div className="btn-view-schedule-wrapper">
                        <ButtonComponent
                            type="button"
                            text={
                                <span className="d-flex align-items-center justify-content-center gap-2">
                                    <i className="bi bi-calendar-week"></i> View Full Schedule
                                </span>
                            }
                            onclick={onViewFullSchedule}
                        />
                    </div>
                    <p className="footer-info-text">
                        Your AI assistant has optimized these scheduled based on your current study preferences.
                    </p>
                </div>
            </aside>
        </>
    );
};

export default StudyNowCanvas;
