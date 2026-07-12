import React from 'react';
import './About.css';

export const About = () => {
    return (
        <section id="about" className="about_section">
            <div className="container">
                <div className="row g-5 align-items-center">
                    {/* Left Column: Content, Mission and Vision */}
                    <div className="col-lg-6 col-12 text-center text-lg-start about_content_col">
                        <div className="about_badge">
                            <span className="badge_text">ABOUT EDUFLOW AI</span>
                        </div>

                        <h2 className="about_heading">
                            Transforming the way students learn with <span className="highlight_text">AI</span>.
                        </h2>

                        <p className="about_description">
                            EduFlow AI is an intelligent study planning platform designed to help students organize their academic journey, build consistent study habits, and achieve their educational goals using artificial intelligence.
                        </p>

                        {/* Mission and Vision Grid */}
                        <div className="row g-4 about_cards_row">
                            <div className="col-sm-6 col-12">
                                <div className="about_info_card">
                                    <div className="about_card_icon">
                                        <i className="bi bi-bullseye"></i>
                                    </div>
                                    <h4 className="about_card_title">Our Mission</h4>
                                    <p className="about_card_desc">
                                        Empower every student with personalized AI-powered planning that removes uncertainty and improves learning efficiency.
                                    </p>
                                </div>
                            </div>

                            <div className="col-sm-6 col-12">
                                <div className="about_info_card">
                                    <div className="about_card_icon">
                                        <i className="bi bi-eye-fill"></i>
                                    </div>
                                    <h4 className="about_card_title">Our Vision</h4>
                                    <p className="about_card_desc">
                                        To become the most trusted AI companion for students by making academic success simple, organized, and accessible.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Floating Stats Cards and Background Blurs */}
                    <div className="col-lg-6 col-12 about_visual_col">
                        <div className="about_visual_container">
                            {/* Decorative Gradient Blurs */}
                            <div className="about_blur_circle blur_purple"></div>
                            <div className="about_blur_circle blur_blue"></div>

                            {/* Floating Stat Card 1 */}
                            <div className="stat_card float_card_1">
                                <div className="stat_icon_box icon_purple">
                                    <i className="bi bi-sliders"></i>
                                </div>
                                <div className="stat_content">
                                    <h3 className="stat_number">100%</h3>
                                    <p className="stat_label">Personalized Plan</p>
                                </div>
                            </div>

                            {/* Floating Stat Card 2 */}
                            <div className="stat_card float_card_2">
                                <div className="stat_icon_box icon_teal">
                                    <i className="bi bi-lightning-charge-fill"></i>
                                </div>
                                <div className="stat_content">
                                    <h3 className="stat_number">2 Mins</h3>
                                    <p className="stat_label">Quick Setup</p>
                                </div>
                            </div>

                            {/* Floating Stat Card 3 */}
                            <div className="stat_card float_card_3">
                                <div className="stat_icon_box icon_blue">
                                    <i className="bi bi-cpu-fill"></i>
                                </div>
                                <div className="stat_content">
                                    <h3 className="stat_number">24/7</h3>
                                    <p className="stat_label">AI Study Coach</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
