import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function GetInTouch() {
    const [settings, setSettings] = useState({
        phone: '+91-92892 28555',
        email: 'info@jiyolifetravels.com',
        address: 'Tower 21 Pocket 14, Sector 24, Rohini, Delhi, India',
        whatsappNumber: '+91-92892 28555'
    });

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/settings`)
            .then(res => res.json())
            .then(data => {
                if (data) {
                    setSettings(data);
                }
            })
            .catch(err => console.error('Failed to fetch settings for GetInTouch:', err));
    }, []);

    return (
        <div className="contact-cards-section">
            <style>{`
                .contact-cards-section {
                    font-family: 'Inter', sans-serif;
                    padding: 40px 0 80px;
                    position: relative;
                    z-index: 1;
                    background: transparent;
                }
                .c-title-area {
                    text-align: center;
                    margin-bottom: 50px;
                }
                .c-subtitle {
                    color: #e8151b;
                    font-size: 14px;
                    font-weight: 700;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    margin-bottom: 15px;
                }
                .dashes {
                    display: inline-block;
                    width: 40px;
                    height: 0px;
                    border-bottom: 2px dashed rgba(232,21,27,0.4);
                }
                .c-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(2.2rem, 4vw, 48px);
                    font-weight: 700;
                    color: #0b1a2d;
                    margin-bottom: 15px;
                }
                .c-desc {
                    color: #555;
                    font-size: 16px;
                    line-height: 1.6;
                    max-width: 500px;
                    margin: 0 auto 20px;
                }
                .c-title-ornament {
                    color: #e8151b;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }
                .solid-line {
                    display: inline-block;
                    width: 50px;
                    height: 2px;
                    background: #e8151b;
                }
                
                .c-card {
                    background: #fff;
                    border-radius: 20px;
                    padding: 45px 30px 40px;
                    text-align: center;
                    box-shadow: 0 15px 40px rgba(0,0,0,0.04);
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                .c-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 20px 50px rgba(0,0,0,0.08);
                }
                .c-icon-wrap {
                    width: 85px;
                    height: 85px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 34px;
                    margin-bottom: 25px;
                    position: relative;
                }
                .c-icon-wrap::before {
                    content: '';
                    position: absolute;
                    inset: -8px;
                    border-radius: 50%;
                    opacity: 0.6;
                    z-index: 0;
                    filter: blur(10px);
                }
                .c-icon-wrap i {
                    position: relative;
                    z-index: 1;
                }
                .c-card h4 {
                    font-size: 21px;
                    font-weight: 700;
                    color: #111;
                    font-family: 'Playfair Display', serif;
                    margin-bottom: 18px;
                }
                .c-card p {
                    color: #666;
                    font-size: 15px;
                    line-height: 1.7;
                    margin-bottom: 0;
                    flex-grow: 1;
                }
                .c-divider {
                    width: 100%;
                    height: 1px;
                    background: #f0f0f0;
                    margin: 25px 0;
                }
                .c-link {
                    font-weight: 600;
                    font-size: 15px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    text-decoration: none;
                    transition: all 0.2s ease;
                }
                .c-link i {
                    font-size: 14px;
                    transition: transform 0.2s ease;
                }
                .c-link:hover i {
                    transform: translateX(4px);
                }
                
                /* Colors per card */
                /* Card 1: Blue */
                .c-card.blue { border-bottom: 4px solid #2575fc; }
                .c-card.blue .c-icon-wrap { background: #eef4ff; color: #2575fc; }
                .c-card.blue .c-icon-wrap::before { background: #2575fc; opacity: 0.15; }
                .c-card.blue .c-link { color: #2575fc; }
                .c-card.blue .c-link:hover { color: #1a5bbd; }
                
                /* Card 2: Green */
                .c-card.green { border-bottom: 4px solid #28a745; }
                .c-card.green .c-icon-wrap { background: #eef9f0; color: #28a745; }
                .c-card.green .c-icon-wrap::before { background: #28a745; opacity: 0.15; }
                .c-card.green .c-link { color: #28a745; }
                .c-card.green .c-link:hover { color: #1e7e34; }
                
                /* Card 3: Orange */
                .c-card.orange { border-bottom: 4px solid #ff5722; }
                .c-card.orange .c-icon-wrap { background: #fff2ed; color: #ff5722; }
                .c-card.orange .c-icon-wrap::before { background: #ff5722; opacity: 0.15; }
                .c-card.orange .c-link { color: #ff5722; }
                .c-card.orange .c-link:hover { color: #d84518; }
                
            `}</style>
            
            <div className="container">
                <div className="c-title-area">
                    <div className="c-subtitle">
                        <span className="dashes"></span>
                        <i className="fa-solid fa-plane"></i>
                        GET IN TOUCH
                        <i className="fa-solid fa-plane"></i>
                        <span className="dashes"></span>
                    </div>
                    <h2 className="c-title">We'd Love To Hear From You</h2>
                    <p className="c-desc">
                        Have questions or need help planning your trip?<br/>
                        Our travel experts are just a message away.
                    </p>
                    <div className="c-title-ornament">
                        <span className="solid-line"></span>
                        <i className="fa-solid fa-plane"></i>
                    </div>
                </div>

                <div className="row g-4 justify-content-center">
                    {/* Card 1 */}
                    <div className="col-lg-4 col-md-6">
                        <div className="c-card blue">
                            <div className="c-icon-wrap">
                                <i className="fa-solid fa-location-dot"></i>
                            </div>
                            <h4>Visit Our Office</h4>
                            <p style={{ whiteSpace: 'pre-line' }}>
                                {settings.address || `Tower 21 Pocket 14, Sector 24\nRohini, Delhi\nIndia`}
                            </p>
                            <div className="c-divider"></div>
                            <Link to="/contact" className="c-link">
                                Get Direction <i className="fa-solid fa-arrow-right"></i>
                            </Link>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="col-lg-4 col-md-6">
                        <div className="c-card green">
                            <div className="c-icon-wrap">
                                <i className="fa-solid fa-phone-volume"></i>
                            </div>
                            <h4>Talk To Travel Expert</h4>
                            <p>
                                {settings.phone || '+91-92892 28555'}<br/>
                                {settings.whatsappNumber && settings.whatsappNumber !== settings.phone ? settings.whatsappNumber : '+91-82878 69655'}
                            </p>
                            <div className="c-divider"></div>
                            <Link to={`tel:${settings.phone ? settings.phone.replace(/[^+\d]/g, '') : '+919289228555'}`} className="c-link">
                                Call Us Now <i className="fa-solid fa-arrow-right"></i>
                            </Link>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="col-lg-4 col-md-6">
                        <div className="c-card orange">
                            <div className="c-icon-wrap">
                                <i className="fa-solid fa-envelope"></i>
                            </div>
                            <h4>Email Us Anytime</h4>
                            <p>
                                {settings.email || 'info@jiyolifetravels.com'}<br/>
                                {settings.email ? `support@${settings.email.split('@')[1]}` : 'support@jiyolifetravels.com'}
                            </p>
                            <div className="c-divider"></div>
                            <Link to={`mailto:${settings.email || 'info@jiyolifetravels.com'}`} className="c-link">
                                Send Email <i className="fa-solid fa-arrow-right"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GetInTouch
