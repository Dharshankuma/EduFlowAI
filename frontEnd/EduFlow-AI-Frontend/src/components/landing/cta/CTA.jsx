import React from 'react';
import { Link } from 'react-router-dom';
import { ButtonComponent } from '../../common/ButtonComponent';
import './CTA.css';

export const CTA = () => {
    return (
        <section className="cta_section">
            <div className="container">
                <div className="cta_card">
                    <div className="cta_content text-center">
                        <h2 className="cta_heading">
                            Ready to Transform Your Study Routine?
                        </h2>
                        <p className="cta_subtitle">
                            Join thousands of students who are achieving their goals faster with AI-powered focus.
                        </p>
                        <div className="cta_button_container">
                            <Link to="/register" className="cta_btn_link">
                                <ButtonComponent
                                    text="Get Started"
                                    type="button"
                                    className="cta_btn"
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
