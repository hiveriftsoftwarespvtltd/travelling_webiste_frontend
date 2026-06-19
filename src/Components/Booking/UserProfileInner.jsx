import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation, Outlet } from 'react-router-dom';
import { User, Ticket, Activity, CreditCard, LogOut, ArrowRight, ShieldCheck, Mail, Phone, Plane, ChevronDown, ChevronUp, Building2, Menu, X } from 'lucide-react';

function UserProfileInner() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [isFlightLinksOpen, setIsFlightLinksOpen] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (!token || !userData) {
            navigate('/');
        } else {
            try {
                setUser(JSON.parse(userData));
            } catch {
                navigate('/');
            }
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event('authChange'));
        setShowLogoutConfirm(false);
        navigate('/');
    };

    if (!user) return null;

    const flightLinks = [
        { title: 'My Flight Bookings', icon: <Plane size={20} />, link: '/user-profile/flight-bookings' },
        { title: 'My Hotel Bookings', icon: <Building2 size={20} />, link: '/user-profile/hotel-bookings' }
    ];

    const isActive = (path) => location.pathname === path || (location.pathname === '/user-profile' && path === '/user-profile');

    return (
        <section style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingTop: '100px', paddingBottom: '60px', fontFamily: "'Inter', sans-serif" }}>
            <style>{`
                .prof-wrapper { max-width: 100%; margin: 0; padding: 0 40px 0 0; box-sizing: border-box; overflow: hidden; }
                .prof-container { display: flex; align-items: flex-start; gap: 40px; box-sizing: border-box; width: 100%; }
                
                /* --- SIDEBAR --- */
                .prof-sidebar {
                    width: 340px; background: #fff; padding: 40px 30px;
                    border-radius: 0 24px 24px 0; flex-shrink: 0; position: sticky; top: 100px; 
                    box-shadow: 10px 10px 40px rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.04);
                    border-left: none;
                }
                .prof-avatar-wrap { text-align: center; margin-bottom: 30px; }
                .prof-avatar {
                    width: 90px; height: 90px; border-radius: 50%; margin: 0 auto 16px auto;
                    background: linear-gradient(135deg, #E8151B, #ff4b4f); color: #fff;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 36px; font-weight: 700; box-shadow: 0 10px 25px rgba(232, 21, 27, 0.25);
                    border: 4px solid #fff; outline: 2px solid #fee2e2;
                }
                .prof-name { font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; font-family: 'Outfit', sans-serif; letter-spacing: -0.5px; }
                .prof-email { font-size: 14px; color: #64748b; margin: 0; word-break: break-all; font-weight: 500; }
                
                .prof-nav { display: flex; flex-direction: column; gap: 8px; margin-bottom: 30px; }
                .prof-nav-item {
                    display: flex; align-items: center; gap: 14px; padding: 12px 18px;
                    border-radius: 12px; color: #475569; font-weight: 600; font-size: 15px;
                    text-decoration: none; transition: all 0.2s ease;
                }
                .prof-nav-item:hover { background: #f1f5f9; color: #0f172a; }
                .prof-nav-item.active { background: #fee2e2; color: #E8151B; box-shadow: inset 3px 0 0 #E8151B; }
                
                .prof-logout {
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                    width: 100%; padding: 14px; background: transparent; border: 1.5px dashed #cbd5e1;
                    border-radius: 12px; color: #64748b; font-weight: 700; font-size: 15px;
                    cursor: pointer; transition: 0.2s;
                }
                .prof-logout:hover { background: #fef2f2; color: #dc2626; border-color: #fecaca; }

                /* --- MAIN CONTENT --- */
                .prof-main { flex: 1; box-sizing: border-box; width: 100%; overflow: hidden; }
                
                .prof-dashboard-card {
                    background: #fff; border-radius: 20px; padding: 40px; 
                    box-shadow: 0 10px 40px rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.04);
                }
                
                .prof-action-card {
                    display: flex; flex-direction: column; gap: 16px; padding: 30px; 
                    background: #fff; border-radius: 16px; border: 1px solid #e2e8f0; 
                    text-decoration: none; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    position: relative; overflow: hidden;
                }
                .prof-action-card:hover {
                    border-color: #E8151B; transform: translateY(-4px); 
                    box-shadow: 0 12px 30px rgba(232,21,27,0.1);
                }
                .prof-action-icon {
                    width: 56px; height: 56px; border-radius: 14px; background: #fee2e2;
                    display: flex; align-items: center; justify-content: center; color: #E8151B;
                }
                .prof-action-arrow {
                    position: absolute; right: 24px; top: 50%; transform: translateY(-50%);
                    color: #cbd5e1; transition: 0.3s;
                }
                .prof-action-card:hover .prof-action-arrow { color: #E8151B; transform: translate(5px, -50%); }

                .prof-mobile-toggle { display: none; }
                .prof-overlay { display: none; }
                .prof-close-mobile { display: none; }

                @media (max-width: 1200px) {
                    .prof-wrapper { padding: 0 20px; }
                    .prof-container { flex-direction: column; gap: 0; }
                    
                    /* Offcanvas Sidebar for Mobile */
                    .prof-sidebar { 
                        position: fixed; top: 0; left: -340px; height: 100vh; z-index: 1000;
                        transition: left 0.3s cubic-bezier(0.16, 1, 0.3, 1); border-radius: 0; border-left: none;
                        box-shadow: 10px 0 40px rgba(0,0,0,0.15); width: 300px; padding: 30px 20px;
                        overflow-y: auto;
                    }
                    .prof-sidebar.open { left: 0; }
                    
                    .prof-overlay {
                        position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(2px);
                        z-index: 999; display: block; opacity: 0; visibility: hidden; transition: 0.3s;
                    }
                    .prof-overlay.show { opacity: 1; visibility: visible; }
                    
                    .prof-mobile-toggle {
                        display: flex; align-items: center; gap: 10px; background: #fff;
                        padding: 12px 20px; border-radius: 12px; border: 1px solid #e2e8f0;
                        color: #0f172a; font-weight: 700; cursor: pointer; margin-bottom: 20px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.03); width: fit-content;
                    }
                    
                    .prof-close-mobile {
                        display: flex; margin-left: auto; margin-bottom: 20px;
                        background: #f1f5f9; border: none; border-radius: 50%;
                        width: 36px; height: 36px; align-items: center; justify-content: center;
                        color: #475569; cursor: pointer;
                    }
                    
                    .prof-dashboard-card { padding: 30px 20px; }
                }
            `}</style>

            <div className="prof-wrapper">
                {/* Mobile Toggle Button */}
                <button className="prof-mobile-toggle" onClick={() => setIsMobileSidebarOpen(true)}>
                    <Menu size={20} /> Profile Menu
                </button>

                {/* Overlay */}
                <div className={`prof-overlay ${isMobileSidebarOpen ? 'show' : ''}`} onClick={() => setIsMobileSidebarOpen(false)}></div>

                <div className="prof-container">
                    {/* SIDEBAR */}
                    <aside className={`prof-sidebar ${isMobileSidebarOpen ? 'open' : ''}`}>
                        <button className="prof-close-mobile" onClick={() => setIsMobileSidebarOpen(false)}>
                            <X size={20} />
                        </button>
                        
                        <div className="prof-avatar-wrap">
                            <div className="prof-avatar">
                                {user.firstName ? user.firstName.charAt(0).toUpperCase() : <User />}
                            </div>
                            <h2 className="prof-name">{user.firstName} {user.lastName}</h2>
                            <p className="prof-email">{user.email}</p>
                        </div>

                        <nav className="prof-nav">
                            <Link to="/user-profile" onClick={() => setIsMobileSidebarOpen(false)} className={`prof-nav-item ${location.pathname === '/user-profile' ? 'active' : ''}`}>
                                <Activity size={20} /> Dashboard
                            </Link>
                            <Link to="/user-profile/flight-bookings" onClick={() => setIsMobileSidebarOpen(false)} className={`prof-nav-item ${isActive('/user-profile/flight-bookings') && location.pathname !== '/user-profile' ? 'active' : ''}`}>
                                <Plane size={20} /> Flight Bookings
                            </Link>
                            <Link to="/user-profile/hotel-bookings" onClick={() => setIsMobileSidebarOpen(false)} className={`prof-nav-item ${isActive('/user-profile/hotel-bookings') && location.pathname !== '/user-profile' ? 'active' : ''}`}>
                                <Building2 size={20} /> Hotel Bookings
                            </Link>
                        </nav>

                        <button className="prof-logout" onClick={() => setShowLogoutConfirm(true)}>
                            <LogOut size={18} /> Sign Out
                        </button>
                    </aside>

                    {/* MAIN CONTENT */}
                    <main className="prof-main">
                        {location.pathname === '/user-profile' ? (
                            <div className="prof-dashboard-card">
                                <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '28px', fontWeight: 800, color: '#0f172a', margin: '0 0 12px 0', letterSpacing: '-0.5px' }}>
                                    Welcome back, {user.firstName}! 👋
                                </h2>
                                <p style={{ color: '#64748b', fontSize: '16px', lineHeight: '1.6', margin: '0 0 40px 0', maxWidth: '600px' }}>
                                    Manage your account, track your upcoming adventures, and view your past bookings all in one place.
                                </p>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                                    <Link to="/user-profile/flight-bookings" className="prof-action-card">
                                        <div className="prof-action-icon"><Plane size={28} /></div>
                                        <div>
                                            <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Flight Bookings</h3>
                                            <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>View your upcoming and past flights</p>
                                        </div>
                                        <div className="prof-action-arrow"><ArrowRight size={24} /></div>
                                    </Link>
                                    <Link to="/user-profile/hotel-bookings" className="prof-action-card">
                                        <div className="prof-action-icon"><Building2 size={28} /></div>
                                        <div>
                                            <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Hotel Bookings</h3>
                                            <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Manage your stays and reservations</p>
                                        </div>
                                        <div className="prof-action-arrow"><ArrowRight size={24} /></div>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <Outlet />
                        )}
                    </main>
                </div>
            </div>

            {/* LOGOUT CONFIRMATION MODAL */}
            {showLogoutConfirm && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: 'fadeIn 0.2s ease'
                }}>
                    <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
                    <div style={{
                        background: '#fff', padding: '35px 30px', borderRadius: '20px',
                        maxWidth: '400px', width: '90%', textAlign: 'center',
                        boxShadow: '0 15px 50px rgba(0,0,0,0.15)',
                        transform: 'scale(1)', animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}>
                        <style>{`@keyframes popIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '50%', background: '#fee2e2',
                            color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 20px auto'
                        }}>
                            <LogOut size={32} />
                        </div>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '24px', fontWeight: 800, color: '#0f172a', fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.5px' }}>Sign Out</h3>
                        <p style={{ margin: '0 0 30px 0', color: '#64748b', fontSize: '15px', lineHeight: '1.5' }}>Are you sure you want to sign out of your account?</p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button onClick={() => setShowLogoutConfirm(false)} style={{
                                padding: '12px 20px', borderRadius: '10px', border: '1px solid #e2e8f0',
                                background: '#f8fafc', color: '#475569', fontWeight: 700, cursor: 'pointer', flex: 1,
                                transition: '0.2s', fontSize: '14px'
                            }} onMouseOver={(e) => e.target.style.background = '#e2e8f0'} onMouseOut={(e) => e.target.style.background = '#f8fafc'}>Cancel</button>
                            <button onClick={handleLogout} style={{
                                padding: '12px 20px', borderRadius: '10px', border: 'none',
                                background: '#E8151B', color: '#fff', fontWeight: 700, cursor: 'pointer', flex: 1,
                                transition: '0.2s', fontSize: '14px', boxShadow: '0 4px 12px rgba(232, 21, 27, 0.2)'
                            }} onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}>Yes, Sign Out</button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default UserProfileInner;
