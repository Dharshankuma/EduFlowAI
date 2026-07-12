import React from 'react';
import './HowItWorks.css';

// SVG Progress Ring for Metrics
const ProgressRing = ({ percentage, color }) => {
    const radius = 36;
    const strokeWidth = 6;
    const normalizedRadius = radius - strokeWidth;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <svg
            height={radius * 2}
            width={radius * 2}
            className="progress_ring"
        >
            {/* Background circle */}
            <circle
                stroke="var(--border-color)"
                fill="transparent"
                strokeWidth={strokeWidth}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
            />
            {/* Foreground progress circle */}
            <circle
                stroke={color}
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className="progress_ring_circle"
            />
            {/* Value text in center */}
            <text
                x="50%"
                y="50%"
                dy=".3em"
                textAnchor="middle"
                className="progress_ring_text"
            >
                {percentage}%
            </text>
        </svg>
    );
};

export const HowItWorks = () => {
    const stepsData = [
        {
            id: 1,
            number: 1,
            title: 'Create Account',
            description: 'Join our community of 50k+ ambitious learners.',
            isHighlighted: false
        },
        {
            id: 2,
            number: 2,
            title: 'Create Goals',
            description: 'Define your subjects, exams, or career targets.',
            isHighlighted: false
        },
        {
            id: 3,
            number: 3,
            title: 'Add Tasks',
            description: 'Input assignments, readings, or lecture dates.',
            isHighlighted: false
        },
        {
            id: 4,
            number: 4,
            title: 'AI Schedule',
            description: 'Our engine builds the perfect plan for you.',
            isHighlighted: true
        },
        {
            id: 5,
            number: 5,
            title: 'Track Progress',
            description: 'Watch your mastery levels grow every day.',
            isHighlighted: false
        }
    ];

    return (
        <section id="how-it-works" className="how_it_works_section">
            <div className="container">
                {/* Header Area */}
                <div className="how_it_works_header text-center">
                    <h2 className="how_it_works_title">Your Path to Mastery</h2>
                    <p className="how_it_works_subtitle">
                        Getting started with EduFlow is simple, intuitive, and takes less than two minutes.
                    </p>
                </div>

                {/* Timeline Grid Container */}
                <div className="timeline_wrapper">
                    {/* Horizontal/Vertical Connector Line drawn via CSS */}
                    <div className="timeline_line"></div>
                    
                    <div className="row g-4 justify-content-between timeline_row">
                        {stepsData.map((step) => (
                            <div 
                                className={`col-lg col-md-4 col-12 timeline_step_col ${step.isHighlighted ? 'highlighted_step' : ''}`}
                                key={step.id}
                            >
                                <div className="timeline_item">
                                    <div className="timeline_circle_container">
                                        <div className={`timeline_circle ${step.isHighlighted ? 'active' : ''}`}>
                                            {step.isHighlighted ? (
                                                <i className="bi bi-stars"></i>
                                            ) : (
                                                <span className="step_number">{step.number}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="timeline_text">
                                        <h3 className="step_title">{step.title}</h3>
                                        <p className="step_description">{step.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Insights at a Glance Sub-section */}
                <div className="insights_wrapper">
                    <div className="row g-5 align-items-center">
                        {/* Left Column: Content list */}
                        <div className="col-lg-6 col-12 text-center text-lg-start">
                            <h3 className="insights_title">Insights at a Glance</h3>
                            <p className="insights_description">
                                Our dashboard doesn't just show data; it shows your potential. Monitor study streaks, track ring completion, and see your focus score improve over time.
                            </p>
                            
                            <div className="insights_list">
                                <div className="insight_list_item">
                                    <div className="insight_icon_wrapper icon_teal">
                                        <i className="bi bi-lightning-charge-fill"></i>
                                    </div>
                                    <span className="insight_list_text">14-Day Study Streak (Top 5% of users)</span>
                                </div>
                                <div className="insight_list_item">
                                    <div className="insight_icon_wrapper icon_purple">
                                        <i className="bi bi-clock-history"></i>
                                    </div>
                                    <span className="insight_list_text">120+ Hours Saved with AI Scheduling</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Mini Subject Mastery Cards */}
                        <div className="col-lg-6 col-12">
                            <div className="row g-4 justify-content-center justify-content-lg-end">
                                <div className="col-sm-6 col-12 insight_card_col">
                                    <div className="insight_card">
                                        <div className="circle_wrapper">
                                            <ProgressRing percentage={80} color="var(--primary-color)" />
                                        </div>
                                        <p className="insight_card_label">
                                            Python<br />Mastery
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="col-sm-6 col-12 insight_card_col">
                                    <div className="insight_card">
                                        <div className="circle_wrapper">
                                            <ProgressRing percentage={60} color="var(--secondary-color, #06B6D4)" />
                                        </div>
                                        <p className="insight_card_label">
                                            Data Science
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

