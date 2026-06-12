import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Tent, Building, Users, Star } from 'lucide-react'

function AboutOne() {
    return (
        <div className="featured-tour-area" style={{ background: '#fff', fontFamily: "'Inter', sans-serif", paddingBottom: '3rem', marginTop: '-100px' }}>
            <div className="container">
                <div className="row align-items-center">
                    {/* Left Image Column */}
                    <div className="col-lg-5 mb-4 mb-lg-0">
                        <div className="featured-img-box">
                            <img 
                                src="/assets/img/hero/hero_bg_1_1.jpeg" 
                                alt="Himalayan Highlights" 
                                style={{ 
                                    width: '100%', 
                                    height: '400px', 
                                    objectFit: 'cover', 
                                    borderRadius: '20px' 
                                }} 
                            />
                        </div>
                    </div>

                    {/* Center Text Column */}
                    <div className="col-lg-4 mb-4 mb-lg-0 px-lg-4">
                        <div className="featured-content">
                            <span style={{ color: '#e8151b', fontWeight: 700, fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                                FEATURED TOUR
                            </span>
                            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: 700, color: '#0d1b2a', marginBottom: '15px', lineHeight: 1.2 }}>
                                Himalayan Highlights
                            </h2>
                            <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.6, marginBottom: '30px' }}>
                                Experience the breathtaking beauty of the Himalayas with our carefully crafted 7-day adventure tour.
                            </p>

                            <div className="featured-features" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '35px' }}>
                                {/* Feature 1 */}
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e8151b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Tent size={18} color="#fff" />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#111', margin: '0 0 4px' }}>Exciting Treks</h4>
                                        <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>Guided treks through scenic trails.</p>
                                    </div>
                                </div>
                                {/* Feature 2 */}
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e8151b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Building size={18} color="#fff" />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#111', margin: '0 0 4px' }}>Premium Stays</h4>
                                        <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>Handpicked hotels and mountain lodges.</p>
                                    </div>
                                </div>
                                {/* Feature 3 */}
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e8151b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Users size={18} color="#fff" />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#111', margin: '0 0 4px' }}>Local Experiences</h4>
                                        <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>Meet locals and explore authentic culture.</p>
                                    </div>
                                </div>
                            </div>

                            <Link to="/destination" style={{ 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '8px', 
                                background: '#111', 
                                color: '#fff', 
                                padding: '12px 28px', 
                                borderRadius: '50px', 
                                fontSize: '14px', 
                                fontWeight: 600, 
                                textDecoration: 'none' 
                            }}>
                                Learn More <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>

                    {/* Right Image Column */}
                    <div className="col-lg-3 d-none d-lg-flex justify-content-center position-relative">
                        <img 
                            src="/assets/img/normal/about-slide-img.png" 
                            alt="Traveler" 
                            style={{ maxHeight: '480px', objectFit: 'contain' }} 
                        />

                        {/* Floating Rating Badge */}
                        <div style={{
                            position: 'absolute',
                            bottom: '25%',
                            left: '-20px',
                            background: '#fff',
                            padding: '12px 20px',
                            borderRadius: '12px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            zIndex: 2
                        }}>
                            <Star size={20} fill="#fbbc04" color="#fbbc04" />
                            <div>
                                <div style={{ fontSize: '18px', fontWeight: 800, color: '#111', lineHeight: 1.1 }}>4.9</div>
                                <div style={{ fontSize: '11px', color: '#666', fontWeight: 500 }}>Rating</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutOne
