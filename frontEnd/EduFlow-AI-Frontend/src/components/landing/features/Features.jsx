import React from 'react';
import './Features.css';

export const Features = () => {
    const featureData = [
        {
            id: 1,
            type: 'planner',
            icon: 'bi-calendar3',
            iconBg: 'rgba(79, 70, 229, 0.08)',
            iconColor: 'var(--primary-color)',
            title: 'Smart Planner',
            description: 'AI-driven scheduling that adapts to your pace. Life happens—our algorithms recalculate your study blocks in real time when you miss a session.'
        },
        {
            id: 2,
            type: 'ai_coach',
            icon: 'bi-stars',
            iconBg: 'rgba(13, 148, 136, 0.08)',
            iconColor: '#0D9488',
            title: 'AI Study Coach',
            description: 'Get instant guidance and study tips powered by LLMs. From explaining quantum physics to debugging React code, your coach is always ready.'
        },
        {
            id: 3,
            type: 'goal',
            icon: 'bi-flag-fill',
            iconBg: 'rgba(22, 163, 74, 0.08)',
            iconColor: '#16A34A',
            title: 'Goal Management',
            description: 'Set, track, and crush your academic milestones. Break long-term objectives into bite-sized, manageable tasks automatically.'
        },
        {
            id: 4,
            type: 'progress',
            icon: 'bi-activity',
            iconBg: 'rgba(79, 70, 229, 0.08)',
            iconColor: 'var(--primary-color)',
            title: 'Progress Tracking',
            description: 'Visualize your journey with detailed analytics. Understand your peak productivity hours and master subjects with data-driven confidence.'
        }
    ];

    return (
        <section id="features" className="features_section">
            <div className="container">
                {/* Section Header */}
                <div className="features_header text-center">
                    <h2 className="features_title">Tools Designed for Success</h2>
                    <p className="features_subtitle">
                        Powerful features built to handle the complexities of modern learning environments.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="row g-4">
                    {featureData.map((feature) => (
                        <div className="col-lg-6 col-md-6 col-12" key={feature.id}>
                            <div className={`feature_card card_${feature.type}`}>
                                {/* Card Top Row */}
                                <div className="card_top">
                                    <div
                                        className="feature_icon_box"
                                        style={{
                                            backgroundColor: feature.iconBg,
                                            color: feature.iconColor
                                        }}
                                    >
                                        <i className={`bi ${feature.icon}`}></i>
                                    </div>

                                    {/* AI Coach Head Silhouette (Absolute Top-Right Decorator) */}
                                    {/* {feature.type === 'ai_coach' && (
                                        <div className="ai_coach_decor">
                                            <div className="ai_head_outline">
                                                <div className="ai_gear">
                                                    <div className="ai_gear_tooth tooth_1"></div>
                                                    <div className="ai_gear_tooth tooth_2"></div>
                                                    <div className="ai_gear_tooth tooth_3"></div>
                                                    <div className="ai_gear_tooth tooth_4"></div>
                                                    <div className="ai_gear_tooth tooth_5"></div>
                                                    <div className="ai_gear_tooth tooth_6"></div>
                                                    <div className="ai_gear_tooth tooth_7"></div>
                                                    <div className="ai_gear_tooth tooth_8"></div>
                                                </div>
                                            </div>
                                        </div>
                                    )} */}
                                </div>

                                <h3 className="feature_card_title">{feature.title}</h3>
                                <p className="feature_card_description">{feature.description}</p>

                                {/* Conditional Preview Sections */}
                                {feature.type === 'planner' && (
                                    <div className="planner_preview">
                                        <div className="planner_task">
                                            <div className="task_left">
                                                <span className="task_dot dot_purple"></span>
                                                <span className="task_name">Data Structures Review</span>
                                            </div>
                                            <span className="task_time">2:00 PM</span>
                                        </div>
                                        <div className="planner_task">
                                            <div className="task_left">
                                                <span className="task_dot dot_teal"></span>
                                                <span className="task_name">Algorithm Practice</span>
                                            </div>
                                            <span className="task_time">4:30 PM</span>
                                        </div>
                                    </div>
                                )}

                                {feature.type === 'progress' && (
                                    <div className="chart_preview">
                                        <div className="chart_bar bar_1"></div>
                                        <div className="chart_bar bar_2"></div>
                                        <div className="chart_bar bar_3"></div>
                                        <div className="chart_bar bar_4"></div>
                                        <div className="chart_bar bar_5"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
