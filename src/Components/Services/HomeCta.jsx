import { ArrowRight, Plane } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router-dom'

function HomeCta() {
    return (
        <section
            className="cta-area"
            style={{
                position: 'relative',
                padding: '25px 0 25px', /* Extremely compressed padding */
                marginBottom: '40px',
                fontFamily: "'Inter', sans-serif"
            }}
        >
            {/* Background Image */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: "url(/assets/img/hero/hero_bg_1_1.jpeg)",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundPositionY: '30%',
                zIndex: 0,
            }} />

            {/* Dark Overlay */}
            <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to right, rgba(16, 24, 32, 0.95) 0%, rgba(16, 24, 32, 0.8) 50%, rgba(16, 24, 32, 0.6) 100%)',
                zIndex: 1,
            }} />

            {/* Top Content */}
            <div className="container" style={{ position: 'relative', zIndex: 3 }}>
                <div className="row align-items-center justify-content-between">
                    <div className="col-lg-7 mb-5 mb-lg-0 text-center text-lg-start">

                        {/* Pill Badge */}
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
                            padding: '4px 14px', borderRadius: '30px', marginBottom: '16px'
                        }}>
                            <i className="fa-solid fa-plane" style={{ color: '#E8151B', fontSize: '13px', transform: 'rotate(-45deg)' }}></i>
                            <span style={{ color: '#fff', fontSize: '12px', fontWeight: '600', letterSpacing: '0.5px' }}>Explore. Dream. Discover.</span>
                        </div>

                        {/* Heading */}
                        <h2 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 'clamp(32px, 4vw, 48px)',
                            lineHeight: '1.2',
                            fontWeight: '700',
                            marginBottom: '4px',
                            color: '#fff'
                        }}
                        >
                            Your Dream Trip Is<br />
                            <span style={{ color: '#E8151B' }}>One Click Away</span>
                        </h2>

                        {/* Subtext */}
                        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px', marginBottom: '0', fontWeight: 400, maxWidth: '420px', lineHeight: '1.6' }}>
                            Join thousands of happy travelers and start your journey today.
                        </p>
                    </div>

                    {/* Right Side: Button & Trail */}
                    <div className="col-lg-auto text-center text-lg-end" style={{ position: 'relative' }}>

                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <Link to="/destination" style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                padding: '15px 36px', borderRadius: '8px',
                                background: '#E8151B', color: '#fff',
                                fontWeight: 600, fontSize: '16px', textDecoration: 'none',
                                transition: 'all 0.3s ease', position: 'relative', zIndex: 3,
                                boxShadow: '0 8px 25px rgba(232, 21, 27, 0.4)'
                            }}
                                onMouseEnter={e => e.currentTarget.style.background = '#c11217'}
                                onMouseLeave={e => e.currentTarget.style.background = '#E8151B'}
                            >
                                Explore Tours <ArrowRight size={18} />
                            </Link>

                            {/* Removed plane icon as requested */}
                        </div>

                    </div>
                </div>
            </div>

            {/* Overlapping Bottom Features Card */}
            <div className="container" style={{ position: 'absolute', bottom: '0', left: '50%', transform: 'translate(-50%, 60%)', zIndex: 4 }}>
                <style>{`
                    .home-cta-features-card {
                        background: #E8151B;
                        border-radius: 12px;
                        padding: 18px 10px;
                        box-shadow: 0 10px 40px rgba(232, 21, 27, 0.2);
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        position: relative;
                        flex-wrap: wrap;
                        gap: 20px;
                    }
                    .home-cta-feature-item {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        flex: 1;
                        justify-content: center;
                        min-width: 200px;
                    }
                    .home-cta-icon-box {
                        display: flex; alignItems: center; justify-content: center;
                    }
                    .home-cta-title {
                        font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 0; font-family: 'Inter', sans-serif;
                    }
                    @media (max-width: 991px) {
                        .cta-area { padding-bottom: 120px !important; margin-bottom: 90px !important; }
                    }
                    @media (max-width: 575px) {
                        .home-cta-feature-item { justify-content: flex-start; padding-left: 20px; }
                        .cta-area { padding-bottom: 240px !important; margin-bottom: 210px !important; }
                    }
                `}</style>

                <div className="home-cta-features-card">
                    {/* Item 1 */}
                    <div className="home-cta-feature-item">
                        <div className="home-cta-icon-box">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.5 2C15 2 13 4 13 4C13 4 11 2 8.5 2C4.5 2 2 5.5 2 9.5C2 15 13 22 13 22C13 22 24 15 24 9.5C24 5.5 21.5 2 17.5 2Z" />
                            </svg>
                        </div>
                        <h4 className="home-cta-title">Trusted by 50K+ Travelers</h4>
                    </div>

                    {/* Item 2 */}
                    <div className="home-cta-feature-item">
                        <div className="home-cta-icon-box">
                            <i className="fa-solid fa-headset" style={{ color: '#fff', fontSize: 20 }}></i>
                        </div>
                        <h4 className="home-cta-title">24/7 Customer Support</h4>
                    </div>

                    {/* Item 3 */}
                    <div className="home-cta-feature-item">
                        <div className="home-cta-icon-box">
                            <i className="fa-regular fa-calendar-check" style={{ color: '#fff', fontSize: 20 }}></i>
                        </div>
                        <h4 className="home-cta-title">Secure & Easy Booking</h4>
                    </div>

                    {/* Item 4 */}
                    <div className="home-cta-feature-item">
                        <div className="home-cta-icon-box">
                            <i className="fa-solid fa-award" style={{ color: '#fff', fontSize: 20 }}></i>
                        </div>
                        <h4 className="home-cta-title">Handpicked Experiences</h4>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HomeCta

