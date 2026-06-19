import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    X, 
    Home, 
    Info, 
    MapPin, 
    Plane, 
    Building2, 
    Tag, 
    BookOpen, 
    Phone,
    LogIn,
    Ticket
} from 'lucide-react';

function MobileMenu({ isOpen, onClose, onLoginClick }) {
    const location = useLocation();

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const navLinks = [
        { path: '/', label: 'Home', icon: <Home size={20} /> },
        { path: '/about', label: 'About Us', icon: <Info size={20} /> },
        { path: '/destination', label: 'Destinations', icon: <MapPin size={20} /> },
        { path: '/service', label: 'Services', icon: <Tag size={20} /> },
        // { path: '/manage-booking', label: 'Manage Booking', icon: <Ticket size={20} /> },
        // { path: '/release-booking', label: 'Cancel Booking', icon: <Ticket size={20} /> },
        // { path: '/cancellation-charges', label: 'Check Penalties', icon: <Ticket size={20} /> },
        // { path: '/ticket-change-request', label: 'Modify Ticket', icon: <Ticket size={20} /> },
        // { path: '/track-change-request', label: 'Track Request', icon: <Ticket size={20} /> },
        { path: '/blog', label: 'Blog', icon: <BookOpen size={20} /> },
        { path: '/contact', label: 'Contact Us', icon: <Phone size={20} /> },
    ];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

                /* ===== BACKDROP ===== */
                .custom-mobile-backdrop {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(4px);
                    z-index: 999998;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .custom-mobile-backdrop.is-open {
                    opacity: 1;
                    visibility: visible;
                }

                /* ===== SIDEBAR WRAPPER ===== */
                .custom-mobile-sidebar {
                    position: fixed;
                    top: 0;
                    right: 0;
                    width: 340px;
                    max-width: 85vw;
                    height: 100vh;
                    background: #0d1b2a;
                    z-index: 999999;
                    transform: translateX(100%);
                    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s;
                    display: flex;
                    flex-direction: column;
                    box-shadow: none;
                    font-family: 'Inter', sans-serif;
                    overflow-y: auto;
                    overflow-x: hidden;
                }
                .custom-mobile-sidebar.is-open {
                    transform: translateX(0);
                    box-shadow: -10px 0 30px rgba(0,0,0,0.5);
                }
                
                /* Custom scrollbar for sidebar */
                .custom-mobile-sidebar::-webkit-scrollbar {
                    width: 5px;
                }
                .custom-mobile-sidebar::-webkit-scrollbar-track {
                    background: rgba(255,255,255,0.05);
                }
                .custom-mobile-sidebar::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.2);
                    border-radius: 10px;
                }

                /* ===== HEADER AREA ===== */
                .cm-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 24px 28px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                }
                .cm-logo {
                    max-height: 40px;
                }
                .cm-close-btn {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .cm-close-btn:hover {
                    background: #e8151b;
                    border-color: #e8151b;
                    transform: rotate(90deg);
                }

                /* ===== NAVIGATION LIST ===== */
                .cm-nav-list {
                    list-style: none;
                    margin: 0;
                    padding: 24px 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    flex: 1;
                }
                .cm-nav-item {
                    display: block;
                }
                .cm-nav-link {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 12px 16px;
                    border-radius: 12px;
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 16px;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    position: relative;
                    overflow: hidden;
                }
                .cm-nav-link::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    height: 100%;
                    width: 0;
                    background: rgba(232, 21, 27, 0.1);
                    border-radius: 12px;
                    transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    z-index: 0;
                }
                .cm-nav-link span, .cm-nav-link svg {
                    position: relative;
                    z-index: 1;
                }
                
                /* Hover & Active States */
                .cm-nav-link:hover, .cm-nav-link.active {
                    color: #fff;
                    transform: translateX(6px);
                }
                .cm-nav-link:hover::before, .cm-nav-link.active::before {
                    width: 100%;
                }
                .cm-nav-link:hover svg, .cm-nav-link.active svg {
                    color: #e8151b;
                }

                /* ===== BOTTOM WIDGET ===== */
                .cm-bottom-widget {
                    padding: 30px 28px;
                    background: rgba(255, 255, 255, 0.03);
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                    margin-top: auto;
                }
                .cm-contact-title {
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: rgba(255, 255, 255, 0.5);
                    font-weight: 700;
                    margin-bottom: 16px;
                }
                .cm-contact-info {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    margin-bottom: 24px;
                }
                .cm-contact-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: #fff;
                    font-size: 15px;
                    font-weight: 600;
                    text-decoration: none;
                }
                .cm-contact-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: rgba(232, 21, 27, 0.15);
                    color: #e8151b;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .cm-socials {
                    display: flex;
                    gap: 10px;
                }
                .cm-social-btn {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.08);
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s;
                    text-decoration: none;
                }
                .cm-social-btn:hover {
                    background: #e8151b;
                    color: #fff;
                    transform: translateY(-3px);
                }
            `}</style>

            {/* Backdrop */}
            <div 
                className={`custom-mobile-backdrop ${isOpen ? 'is-open' : ''}`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className={`custom-mobile-sidebar ${isOpen ? 'is-open' : ''}`}>
                
                {/* Header */}
                <div className="cm-header">
                    <img src="/assets/img/logo-main-jiyo.png" alt="Jiyo Life" className="cm-logo" />
                    <button className="cm-close-btn" onClick={onClose} aria-label="Close Menu">
                        <X size={20} />
                    </button>
                </div>

                {/* Nav Links */}
                <ul className="cm-nav-list">
                    {navLinks.map((link, idx) => (
                        <li key={idx} className="cm-nav-item">
                            <Link 
                                to={link.path} 
                                className={`cm-nav-link ${location.pathname === link.path ? 'active' : ''}`}
                                onClick={onClose}
                            >
                                {link.icon}
                                <span>{link.label}</span>
                            </Link>
                        </li>
                    ))}
                    <li className="cm-nav-item">
                        <button 
                            className="cm-nav-link" 
                            onClick={onLoginClick} 
                            style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}
                        >
                            <LogIn size={20} />
                            <span>Login / Sign Up</span>
                        </button>
                    </li>
                </ul>

                {/* Bottom Widget */}
                <div className="cm-bottom-widget">
                    <div className="cm-contact-title">Need Help?</div>
                    
                    <div className="cm-contact-info">
                        <a href="tel:+918287869655" className="cm-contact-item">
                            <div className="cm-contact-icon">
                                <Phone size={14} />
                            </div>
                            +91-82878 69655
                        </a>
                    </div>

                    <div className="cm-contact-title" style={{ marginTop: '24px' }}>Follow Us</div>
                    <div className="cm-socials">
                        <a href="#" className="cm-social-btn"><i className="fab fa-facebook-f"></i></a>
                        <a href="#" className="cm-social-btn"><i className="fab fa-twitter"></i></a>
                        <a href="#" className="cm-social-btn"><i className="fab fa-instagram"></i></a>
                        <a href="#" className="cm-social-btn"><i className="fab fa-youtube"></i></a>
                    </div>
                </div>

            </div>
        </>
    );
}

export default MobileMenu;

