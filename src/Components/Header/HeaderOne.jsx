import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import MobileMenu from './MobileMenu';
import LoginForm from './LoginForm';
import { Plane, Building2, BusFront, TrainFront, ArrowRight, MapPin, Clock, Globe, Headphones, User, ChevronDown, LogOut } from 'lucide-react';

function HeaderOne() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const [langOpen, setLangOpen] = useState(false);
    const [lang, setLang] = useState('English');
    const [isSticky, setIsSticky] = useState(false);
    const [user, setUser] = useState(null);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    const checkAuth = () => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        if (token && userData) {
            try { setUser(JSON.parse(userData)); } catch { setUser(null); }
        } else {
            setUser(null);
        }
    };

    useEffect(() => {
        checkAuth();
        window.addEventListener('authChange', checkAuth);
        
        const openLogin = () => setIsLoginFormOpen(true);
        window.addEventListener('openLoginModal', openLogin);
        
        const handleClickOutside = (e) => {
            if (!e.target.closest('.hdr-profile-menu')) {
                setProfileDropdownOpen(false);
            }
        };
        window.addEventListener('click', handleClickOutside);
        
        return () => {
            window.removeEventListener('authChange', checkAuth);
            window.removeEventListener('openLoginModal', openLogin);
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 500) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Initialize active tab from location state if available, but only if on Home page
    const [activeHeaderTab, setActiveHeaderTab] = useState(
        location.pathname === '/' ? (location.state?.activeTabId || 'flights') : null
    );

    useEffect(() => {
        if (location.pathname === '/') {
            if (location.state?.activeTabId) {
                setActiveHeaderTab(location.state.activeTabId);
            } else if (!activeHeaderTab) {
                setActiveHeaderTab('flights');
            }
        } else {
            setActiveHeaderTab(null);
        }
    }, [location.pathname, location.state?.activeTabId]);

    useEffect(() => {
        const handleGlobalTabChange = (e) => {
            if (e.detail && e.detail.tabId) {
                setActiveHeaderTab(e.detail.tabId);
            }
        };
        window.addEventListener('globalServiceTabChange', handleGlobalTabChange);
        return () => window.removeEventListener('globalServiceTabChange', handleGlobalTabChange);
    }, []);

    const handleTabClick = (tabId) => {
        if (tabId === 'bus') {
            window.open("https://www.redbus.in/", '_blank');
            return;
        }
        if (tabId === 'trains') {
            window.open("https://www.irctc.co.in/", '_blank');
            return;
        }

        if (location.pathname !== '/') {
            navigate('/', { state: { activeTabId: tabId } });
        }

        setActiveHeaderTab(tabId);
        window.dispatchEvent(new CustomEvent('globalServiceTabChange', { detail: { tabId } }));

        // Smooth scroll to filter center
        setTimeout(() => {
            const filterEl = document.querySelector('.search-filter-wrapper');
            if (filterEl) {
                filterEl.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }, location.pathname !== '/' ? 300 : 50);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event('authChange'));
        navigate('/');
    };

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/about', label: 'About Us' },
        { to: '/destination', label: 'Destinations' },
        { to: '/service', label: 'Services' },
        // { to: '/manage-booking', label: 'Manage Booking' },
        // { to: '/release-booking', label: 'Cancel Booking' },
        // { to: '/cancellation-charges', label: 'Check Penalties' },
        // { to: '/ticket-change-request', label: 'Modify Ticket' },
        // { to: '/track-change-request', label: 'Track Request' },
        { to: '/blog', label: 'Blog' },
        { to: '/contact', label: 'Contact Us' },
    ];

    const serviceTabs = [
        { id: 'flights', icon: <Plane size={20} />, label: 'Flights' },
        { id: 'hotels', icon: <Building2 size={20} />, label: 'Hotels' },
        { id: 'bus', icon: <BusFront size={20} />, label: 'Bus' },
        { id: 'trains', icon: <TrainFront size={20} />, label: 'Trains' },
    ];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                
                * { box-sizing: border-box; }

                /* ===== TOP BAR ===== */
                .hdr-topbar {
                    display: none !important;
                }
                .hdr-topbar-left, .hdr-topbar-right {
                    display: flex;
                    align-items: center;
                    gap: 18px;
                }
                .hdr-topbar-item {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    color: #555;
                }
                .hdr-topbar-item svg { color: #e8151b; flex-shrink: 0; }
                .hdr-divider { width: 1px; height: 16px; background: #e0e0e0; }
                .hdr-topbar-link {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    color: #555;
                    text-decoration: none;
                    cursor: pointer;
                    transition: color 0.2s;
                }
                .hdr-topbar-link:hover { color: #e8151b; }
                .hdr-lang-wrap { position: relative; }
                .hdr-lang-btn {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 500;
                    color: #555;
                    font-family: 'Inter', sans-serif;
                    padding: 2px 0;
                }
                .hdr-lang-dropdown {
                    position: absolute;
                    right: 0;
                    top: calc(100% + 5px);
                    background: #fff;
                    border: 1px solid #eee;
                    border-radius: 8px;
                    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
                    min-width: 110px;
                    z-index: 999;
                    overflow: hidden;
                }
                .hdr-lang-option {
                    padding: 9px 16px;
                    font-size: 13px;
                    cursor: pointer;
                    transition: background 0.15s;
                }
                .hdr-lang-option:hover { background: #fdf5f5; color: #e8151b; }

                /* ===== MAIN HEADER ===== */
                .hdr-main-bar {
                    background: transparent;
                    padding: 15px 40px;
                    display: flex;
                    align-items: center;
                    border-bottom: none;
                    position: absolute;
                    width: 100%;
                    top: 0;
                    left: 0;
                    z-index: 999;
                    box-shadow: none;
                    min-height: 80px;
                    transition: padding 0.3s ease;
                }
                
                .hdr-main-bar.sticky {
                    position: fixed;
                    background: #ffffff;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    animation: slideDown 0.4s ease forwards;
                    padding: 10px 40px;
                }
                
                @keyframes slideDown {
                    from { transform: translateY(-100%); }
                    to { transform: translateY(0); }
                }

                /* ===== LOGO BLOCK ===== */
                .hdr-logo-block {
                    display: flex;
                    align-items: center;
                    padding-right: 24px;
                    border-right: 1px solid #f0f0f0;
                    min-width: fit-content;
                    text-decoration: none;
                }
                .hdr-logo-new {
                    max-height: 65px;
                    width: auto;
                    object-fit: contain;
                    max-width: 100%;
                    transform: scale(1.2);
                    transform-origin: left center;
                }

                /* ===== SERVICE TABS ===== */
                .hdr-service-tabs {
                    display: flex;
                    align-items: stretch;
                    padding: 0;
                    margin: 2px 14px;
                    background: #fff;
                    border-radius: 10px;
                    border: 1.5px solid #ebebeb;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.07), 0 1px 4px rgba(232,21,27,0.06);
                    gap: 2px;
                }
                .hdr-service-tab {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 2px;
                    padding: 2px 14px;
                    background: transparent;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.2s;
                    color: #666;
                    font-size: 11px;
                    font-weight: 600;
                    font-family: 'Inter', sans-serif;
                    min-width: 60px;
                    position: relative;
                }
                .hdr-service-tab svg { width: 16px; height: 16px; }
                .hdr-service-tab:hover { color: #e8151b; background: #fff5f5; }
                .hdr-service-tab.active {
                    color: #e8151b;
                    background: transparent;
                }
                .hdr-service-tab.active svg { color: #e8151b; }

                /* ===== NAV LINKS ===== */
                .hdr-nav {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 0 12px;
                    flex: 1;
                    justify-content: center;
                }
                .hdr-nav-link {
                    padding: 8px 12px;
                    font-size: 18px;
                    font-weight: 700;
                    color: #111;
                    text-decoration: none;
                    font-family: 'Inter', sans-serif;
                    border-radius: 6px;
                    transition: all 0.2s;
                    white-space: nowrap;
                    position: relative;
                }
                .hdr-nav-link:hover { color: #e8151b; background: transparent; }
                .hdr-nav-link.active { color: #e8151b; }
                .hdr-nav-link.active::after {
                    content: '';
                    position: absolute;
                    bottom: -1px;
                    left: 12px;
                    right: 12px;
                    height: 2px;
                    background: #e8151b;
                    border-radius: 2px;
                }

                /* ===== RIGHT SIDE ACTIONS ===== */
                .hdr-actions {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin-left: auto;
                }
                .hdr-usd-btn {
                    background: transparent;
                    border: none;
                    font-size: 14px;
                    font-weight: 700;
                    color: #111;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-family: 'Inter', sans-serif;
                }
                .hdr-signin-btn {
                    background: #fff;
                    color: #111;
                    font-size: 14px;
                    font-weight: 700;
                    padding: 8px 24px;
                    border-radius: 8px;
                    border: 1px solid #ddd;
                    cursor: pointer;
                    font-family: 'Inter', sans-serif;
                    transition: 0.2s;
                }
                .hdr-signin-btn:hover { background: #f9f9f9; }
                
                .hdr-avatar-btn {
                    width: 46px; height: 46px; border-radius: 50%;
                    background: #E8151B; /* Flat brand red */
                    color: #fff; font-size: 18px; font-weight: 700;
                    border: none; box-shadow: 0 8px 20px rgba(232,21,27,0.3);
                    cursor: pointer; display: flex; align-items: center; justify-content: center;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative; overflow: hidden;
                }
                .hdr-avatar-btn::before {
                    content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%);
                }
                .hdr-avatar-btn:hover { transform: translateY(-3px) scale(1.05); box-shadow: 0 12px 25px rgba(232,21,27,0.4); }
                
                .hdr-dropdown-item {
                    display: flex; align-items: center; gap: 8px; width: 100%;
                    padding: 10px 20px; font-size: 14px; font-weight: 600; color: #444;
                    background: none; border: none; cursor: pointer; transition: 0.2s;
                    text-decoration: none; font-family: 'Inter', sans-serif;
                }
                .hdr-dropdown-item:hover { background: #f8fafc; color: #e8151b; }
                
                .hdr-signup-btn {
                    background: #e8151b;
                    color: #fff;
                    font-size: 14px;
                    font-weight: 700;
                    padding: 8px 24px;
                    border-radius: 8px;
                    border: none;
                    cursor: pointer;
                    font-family: 'Inter', sans-serif;
                    transition: 0.2s;
                }
                .hdr-signup-btn:hover {
                    background: #c8101a;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(232,21,27,0.3);
                }
                .hdr-mobile-btn {
                    background: transparent;
                    border: none;
                    font-size: 22px;
                    color: #e8151b;
                    cursor: pointer;
                    padding: 8px;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    align-self: center;
                    margin-left: 12px;
                }

                /* ===== RESPONSIVE ===== */
                @media (max-width: 1200px) {
                    .hdr-nav { display: none; }
                    .hdr-service-tabs { display: none; }
                    .hdr-main-bar { padding: 12px 10px; }
                    .hdr-main-bar.sticky { padding: 12px 10px; }
                    .hdr-mobile-btn { display: flex !important; }
                    .hdr-logo-new { transform: scale(1.1) translateX(-15px); }
                }
                @media (max-width: 768px) {
                    .hdr-topbar { padding: 6px 16px; flex-direction: column; gap: 8px; text-align: center; }
                    .hdr-topbar-left { flex-wrap: wrap; justify-content: center; gap: 10px; }
                    .hdr-topbar-right { flex-wrap: wrap; justify-content: center; gap: 10px; }
                }
            `}</style>

            {/* TOP BAR */}
            <div className="hdr-topbar d-none d-xl-flex">
                <div className="hdr-topbar-left">
                    <div className="hdr-topbar-item">
                        <MapPin size={14} />
                        <span>Tower 21 Pocket 14, Sector 24, Rohini, Delhi</span>
                    </div>
                    <div className="hdr-divider"></div>
                    <div className="hdr-topbar-item">
                        <Clock size={14} />
                        <span>Mon to Sat: 10:00 am - 6:30 pm</span>
                    </div>
                </div>
                <div className="hdr-topbar-right">
                    <div className="hdr-lang-wrap">
                        <button className="hdr-lang-btn" onClick={() => setLangOpen(!langOpen)}>
                            <Globe size={14} color="#666" />
                            {lang}
                            <ChevronDown size={13} color="#888" />
                        </button>
                        {langOpen && (
                            <div className="hdr-lang-dropdown">
                                {['English', 'Hindi'].map(l => (
                                    <div key={l} className="hdr-lang-option" onClick={() => { setLang(l); setLangOpen(false); }}>{l}</div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="hdr-divider"></div>
                    <Link to="/faq" className="hdr-topbar-link">FAQ</Link>
                    <div className="hdr-divider"></div>
                    <Link to="/contact" className="hdr-topbar-link">
                        <Headphones size={14} color="#666" />
                        Support
                    </Link>
                </div>
            </div>

            {/* MAIN HEADER BAR */}
            <div className={`hdr-main-bar ${isSticky ? 'sticky' : ''}`}>
                {/* Logo */}
                <Link to="/" className="hdr-logo-block" style={{ borderRight: 'none' }}>
                    <img src="/assets/img/logo-main-jiyo.png" alt="Jiyo Life" className="hdr-logo-new" />
                </Link>

                {/* Nav Links */}
                <nav className="hdr-nav">
                    {navLinks.map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={'hdr-nav-link' + (location.pathname === link.to ? ' active' : '')}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Actions: USD, Sign In, Sign Up */}
                <div className="hdr-actions d-none d-xl-flex">
                    {user ? (
                        <div className="hdr-profile-menu" style={{ position: 'relative' }}>
                            <button className="hdr-avatar-btn" onClick={(e) => { e.stopPropagation(); setProfileDropdownOpen(!profileDropdownOpen); }}>
                                {user.firstName ? user.firstName.charAt(0).toUpperCase() : <User size={20} />}
                            </button>
                            {profileDropdownOpen && (
                                <div className="hdr-profile-dropdown" style={{
                                    position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                                    background: '#fff', borderRadius: '12px', minWidth: '220px',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9',
                                    zIndex: 1000, overflow: 'hidden', animation: 'fd 0.2s ease'
                                }}>
                                    <style>{`@keyframes fd { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
                                    <div style={{ padding: '16px 20px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                                        <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>{user.firstName} {user.lastName}</div>
                                        <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px', wordBreak: 'break-all' }}>{user.email}</div>
                                    </div>
                                    <div style={{ padding: '8px 0' }}>
                                        <Link to="/user-profile" className="hdr-dropdown-item" onClick={() => setProfileDropdownOpen(false)}>
                                            <User size={16} /> My Dashboard
                                        </Link>
                                        <button className="hdr-dropdown-item" onClick={handleLogout} style={{ color: '#dc2626' }}>
                                            <LogOut size={16} /> Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <button className="hdr-signin-btn" onClick={() => setIsLoginFormOpen(true)}>Login</button>
                            <button className="hdr-signup-btn" onClick={() => setIsLoginFormOpen(true)}>SignUp</button>
                        </>
                    )}
                </div>
                
                <div className="d-flex align-items-center ms-auto">
                    <button
                        className="hdr-mobile-btn"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <i className="far fa-bars" />
                    </button>
                </div>
            </div>

            <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} onLoginClick={() => { setIsMobileMenuOpen(false); setIsLoginFormOpen(true); }} />
            <LoginForm isOpen={isLoginFormOpen} onClose={() => setIsLoginFormOpen(false)} />
        </>
    )
}

export default HeaderOne

