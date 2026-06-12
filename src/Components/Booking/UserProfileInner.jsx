import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation, Outlet } from 'react-router-dom';
import { User, Ticket, Activity, CreditCard, LogOut, ArrowRight, ShieldCheck, Mail, Phone, Plane } from 'lucide-react';

function UserProfileInner() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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
        { title: 'Check Penalties', icon: <CreditCard size={20} />, link: '/user-profile/cancellation-charges' },
        { title: 'Cancel Booking', icon: <Ticket size={20} />, link: '/user-profile/release-booking' },
        { title: 'Modify Ticket', icon: <Activity size={20} />, link: '/user-profile/ticket-change-request' },
        { title: 'Track Request', icon: <ShieldCheck size={20} />, link: '/user-profile/track-change-request' }
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <section style={{ backgroundColor: '#F5F7FA', minHeight: '80vh', padding: '60px 0', fontFamily: "'Inter', sans-serif" }}>
            <style>{`
                .prof-container { width: 100%; margin: 0; padding: 0; display: flex; align-items: flex-start; min-height: calc(100vh - 100px); }
                
                /* --- SIDEBAR --- */
                .prof-sidebar {
                    width: 320px; background: #fff; padding: 40px 25px;
                    border-right: 1px solid #e2e8f0; flex-shrink: 0; position: sticky; top: 80px; height: calc(100vh - 80px); overflow-y: auto;
                }
                .prof-avatar-wrap { text-align: center; margin-bottom: 35px; }
                .prof-avatar {
                    width: 90px; height: 90px; border-radius: 50%; margin: 0 auto 16px auto;
                    background: #E8151B; color: #fff;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 36px; font-weight: 700; box-shadow: 0 10px 25px rgba(232, 21, 27, 0.25);
                }
                .prof-name { font-size: 20px; font-weight: 700; color: #111; margin: 0 0 4px 0; font-family: 'Playfair Display', serif; }
                .prof-email { font-size: 14px; color: #666; margin: 0; word-break: break-all; }
                
                .prof-nav { display: flex; flex-direction: column; gap: 6px; }
                .prof-nav-item {
                    display: flex; align-items: center; gap: 14px; padding: 14px 18px;
                    border-radius: 12px; color: #444; font-weight: 600; font-size: 15px;
                    text-decoration: none; transition: all 0.3s ease; position: relative;
                }
                .prof-nav-item:hover { background: #f9f9f9; color: #E8151B; }
                .prof-nav-item.active { background: #fff4f4; color: #E8151B; }
                .prof-nav-item.active::before {
                    content: ''; position: absolute; left: 0; top: 10%; height: 80%; width: 4px;
                    background: #E8151B; border-radius: 0 4px 4px 0;
                }
                
                .prof-logout {
                    margin-top: 35px; display: flex; align-items: center; justify-content: center; gap: 10px;
                    width: 100%; padding: 14px; background: transparent; border: 1px solid #ddd;
                    border-radius: 12px; color: #555; font-weight: 700; font-size: 15px;
                    cursor: pointer; transition: 0.3s;
                }
                .prof-logout:hover { background: #f5f5f5; color: #111; border-color: #ccc; }

                /* --- MAIN CONTENT --- */
                .prof-main {
                    flex: 1; padding: 40px 60px;
                }
                
                @media (max-width: 992px) {
                    .prof-container { flex-direction: column; }
                    .prof-sidebar { width: 100%; position: static; height: auto; border-right: none; border-bottom: 1px solid #e2e8f0; }
                    .prof-main { padding: 30px 20px; }
                }
            `}</style>

            <div className="prof-container">
                {/* SIDEBAR */}
                <aside className="prof-sidebar">
                    <div className="prof-avatar-wrap">
                        <div className="prof-avatar">
                            {user.firstName ? user.firstName.charAt(0).toUpperCase() : <User />}
                        </div>
                        <h2 className="prof-name">{user.firstName} {user.lastName}</h2>
                        <p className="prof-email">{user.email}</p>
                        {user.mobile && <p className="prof-email" style={{ marginTop: '6px' }}>{user.mobile}</p>}
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#111', fontWeight: 800, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', paddingLeft: '8px' }}>
                            <Plane size={16} color="#E8151B" /> Flight Bookings
                        </div>
                        <nav className="prof-nav">
                            {flightLinks.map((link, idx) => (
                                <Link to={link.link} key={idx} className={`prof-nav-item ${isActive(link.link) ? 'active' : ''}`}>
                                    {link.icon} {link.title}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <button className="prof-logout" onClick={() => setShowLogoutConfirm(true)}>
                        <LogOut size={18} /> Sign Out
                    </button>
                </aside>

                {/* MAIN CONTENT */}
                <main className="prof-main">
                    <Outlet />
                </main>
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
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '24px', fontWeight: 800, color: '#111', fontFamily: "'Playfair Display', serif" }}>Sign Out</h3>
                        <p style={{ margin: '0 0 30px 0', color: '#666', fontSize: '15px', lineHeight: '1.5' }}>Are you sure you want to sign out of your account?</p>
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
