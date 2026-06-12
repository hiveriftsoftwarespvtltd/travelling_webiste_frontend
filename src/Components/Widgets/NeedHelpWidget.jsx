import React from 'react';
import { Headphones, Phone, ArrowRight, Plane } from 'lucide-react';
import { Link } from 'react-router-dom';

function NeedHelpWidget() {
    return (
        <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '400px',
            minHeight: '420px',
            borderRadius: '12px',
            overflow: 'hidden',
            fontFamily: "'Inter', sans-serif",
            boxShadow: '0 15px 40px rgba(0,0,0,0.2)'
        }}>
            {/* Background Image (Right side) */}
            <img 
                src="/assets/img/bg/need_help.jpg" 
                alt="Background" 
                style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '70%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'right'
                }} 
            />

            {/* Dark Blue Shape Overlay with SVG */}
            <svg preserveAspectRatio="none" viewBox="0 0 100 100" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
                {/* Red curve shadow/border */}
                <path d="M0,0 L77,0 C42,40 47,70 67,100 L0,100 Z" fill="#E8151B" />
                {/* Dark Blue shape */}
                <path d="M0,0 L75,0 C40,40 45,70 65,100 L0,100 Z" fill="#071529" />
            </svg>

            {/* Content Layer */}
            <div style={{
                position: 'relative',
                zIndex: 2,
                padding: '35px 30px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}>
                {/* Top Header */}
                <div style={{ position: 'relative' }}>
                    <h3 style={{ color: '#E8151B', fontSize: '24px', fontWeight: 800, margin: '0 0 5px 0' }}>Need Help?</h3>
                    <h2 style={{ color: '#fff', fontSize: '32px', fontWeight: 800, margin: '0 0 15px 0', lineHeight: '1.2' }}>We Are Here<br/>To Help You</h2>
                    <div style={{ width: '40px', height: '3px', backgroundColor: '#E8151B', marginBottom: '15px' }}></div>
                    
                    {/* Dashed Plane Path */}
                    <div style={{ position: 'absolute', top: '15px', right: '-15px', width: '160px', height: '100px' }}>
                        <svg viewBox="0 0 150 100" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                            <path d="M0,90 Q50,70 140,20" fill="none" stroke="#fff" strokeWidth="1.5" strokeDasharray="5 5" />
                        </svg>
                        <div style={{ position: 'absolute', top: '6px', right: '-8px', transform: 'rotate(45deg)', color: '#E8151B' }}>
                            <Plane size={24} fill="#E8151B" />
                        </div>
                    </div>
                </div>

                {/* Logo Box */}
                <div style={{
                    background: '#fff',
                    borderRadius: '50px',
                    padding: '12px 25px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '15px 0 25px 0',
                    width: '85%',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
                }}>
                    <img src="/assets/img/logo-main-jiyo.png" alt="Jiyo Life" style={{ maxHeight: '40px', width: 'auto' }} />
                </div>

                {/* Support Contact */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                    <div style={{
                        width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
                    }}>
                        <Headphones color="#E8151B" size={28} />
                    </div>
                    <div>
                        <p style={{ color: '#e2e8f0', margin: '0 0 4px 0', fontSize: '15px' }}>You Get Online Support</p>
                        <a href="tel:+256214203215" style={{
                            color: '#fff', fontSize: '20px', fontWeight: 800, textDecoration: 'none',
                            display: 'flex', alignItems: 'center', gap: '6px'
                        }}>
                            <Phone size={18} color="#E8151B" /> +256 214 203 215
                        </a>
                    </div>
                </div>

                {/* Separator Line */}
                <div style={{ position: 'relative', width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.15)', margin: '0 0 25px 0' }}>
                    <div style={{ position: 'absolute', top: '-3px', left: '30%', transform: 'translateX(-50%)', width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#E8151B' }}></div>
                </div>

                {/* Action Button */}
                <div>
                    <Link to="/contact" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '12px',
                        background: '#E8151B', color: '#fff', padding: '12px 28px',
                        borderRadius: '30px', textDecoration: 'none', fontWeight: 700, fontSize: '15px',
                        transition: '0.3s', border: '1px solid #E8151B'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.querySelector('.arrow-circle').style.background = '#E8151B'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = '#E8151B'; e.currentTarget.querySelector('.arrow-circle').style.background = 'transparent'; }}
                    >
                        <span className="arrow-circle" style={{
                            width: '26px', height: '26px', borderRadius: '50%',
                            border: '1.5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: '0.3s'
                        }}>
                            <ArrowRight size={14} strokeWidth={2.5} />
                        </span>
                        READ MORE
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NeedHelpWidget;
