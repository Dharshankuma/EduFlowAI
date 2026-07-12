import React from 'react';
import { Link } from 'react-router-dom';
import { ButtonComponent } from '../../common/ButtonComponent';
import './Hero.css';

export const Hero = () => {
    return (
        <section id="hero" className="hero_section">
            {/* Decorative background blurs */}
            <div className="hero_blur_circles">
                <div className="blur_circle blur_purple"></div>
                <div className="blur_circle blur_blue"></div>
            </div>

            <div className="container position-relative">
                <div className="row align-items-center min-vh-75-row">
                    {/* Left Column: Main Content */}
                    <div className="col-lg-6 col-12 text-center text-lg-start hero_content_col">
                        <div className="announcement_badge">
                            <i className="bi bi-sparkles badge_icon"></i>
                            <span className="badge_text">NEW: AI STUDY COACH</span>
                        </div>

                        <h1 className="hero_heading">
                            <span className="heading_line line_dark">Plan Smarter with AI.</span>
                            <span className="heading_line line_primary">Stay Consistent.</span>
                            <span className="heading_line line_dark">Achieve Your Goals.</span>
                        </h1>

                        <p className="hero_description">
                            EduFlow AI automatically creates personalized study schedules, tracks your progress, and helps students achieve academic and career goals.
                        </p>

                        <div className="hero_cta_wrapper">
                            <Link to="/register">
                                <ButtonComponent
                                    text="Get Started"
                                    type="button"
                                    className="type_1_btn"
                                />
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Spacing / Placeholder for illustrations */}
                    <div className="col-lg-6 col-12 d-none d-lg-block hero_decor_col">
                        {/* Keeps space for decorative elements and blurs on the right side */}
                    </div>
                </div>
            </div>
        </section>
    );
};

