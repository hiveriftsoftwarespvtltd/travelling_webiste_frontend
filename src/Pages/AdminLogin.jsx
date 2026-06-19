import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed. Please check your credentials.');
            }

            localStorage.setItem('admin_token', data.access_token);
            localStorage.setItem('admin_email', data.user.email);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-wrapper"
            style={{ 
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                padding: '40px 20px',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Background elements */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap');
                .admin-login-wrapper {
                    font-family: 'Roboto', sans-serif !important;
                }
            `}</style>
            <span style={{ position: 'absolute', top: '-100px', left: '-100px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(0,113,244,0.15)', filter: 'blur(80px)' }} />
            <span style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(0,113,244,0.1)', filter: 'blur(80px)' }} />

            <div 
                style={{
                    width: '100%',
                    maxWidth: '440px',
                    background: '#ffffff',
                    borderRadius: '16px',
                    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
                    padding: '40px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    position: 'relative',
                    zIndex: 2
                }}
            >
                <div className="text-center mb-30">
                    <Link to="/" style={{ display: 'inline-block', marginBottom: '20px' }}>
                        <img src="/assets/img/logo-main-jiyo.png" alt="Jiyo Life" style={{ height: '40px' }} />
                    </Link>
                    <span 
                        className="sub-title" 
                        style={{ 
                            color: '#0071F4', 
                            fontWeight: '700', 
                            textTransform: 'uppercase',
                            letterSpacing: '1.5px',
                            fontSize: '12px',
                            display: 'inline-block',
                            marginBottom: '8px'
                        }}
                    >
                        Secure Portal
                    </span>
                    <h3 
                        style={{ 
                            fontSize: '24px', 
                            fontWeight: '800', 
                            color: '#0F172A',
                            margin: 0
                        }}
                    >
                        Admin Login
                    </h3>
                </div>

                {error && (
                    <div 
                        style={{
                            background: '#FFF1F2',
                            border: '1px solid #FDA4AF',
                            color: '#E11D48',
                            borderRadius: '8px',
                            padding: '12px 16px',
                            fontSize: '14px',
                            fontWeight: '500',
                            marginBottom: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        <i className="fa-solid fa-triangle-exclamation" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label 
                            htmlFor="email"
                            style={{
                                display: 'block',
                                fontSize: '13px',
                                fontWeight: '600',
                                color: '#475569',
                                marginBottom: '8px'
                            }}
                        >
                            Email Address
                        </label>
                        <input 
                            id="email"
                            type="email" 
                            name="email"
                            className="form-control"
                            placeholder="admin@jiyolife.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                height: '52px',
                                borderRadius: '8px',
                                border: '1px solid #CBD5E1',
                                padding: '0 16px',
                                fontSize: '14px',
                                width: '100%',
                                outline: 'none',
                                boxShadow: 'none',
                                transition: 'border-color 0.2s ease'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '28px' }}>
                        <label 
                            htmlFor="password"
                            style={{
                                display: 'block',
                                fontSize: '13px',
                                fontWeight: '600',
                                color: '#475569',
                                marginBottom: '8px'
                            }}
                        >
                            Password
                        </label>
                        <input 
                            id="password"
                            type="password" 
                            className="form-control" 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                height: '52px',
                                borderRadius: '8px',
                                border: '1px solid #CBD5E1',
                                padding: '0 16px',
                                fontSize: '14px',
                                width: '100%',
                                outline: 'none',
                                boxShadow: 'none',
                                transition: 'border-color 0.2s ease'
                            }}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="th-btn style1 w-100" 
                        disabled={loading}
                        style={{
                            height: '52px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            fontSize: '15px',
                            fontWeight: '700',
                            textTransform: 'none',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {loading ? (
                            <>
                                <i className="fa-solid fa-spinner fa-spin" />
                                Verifying...
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-lock-open" />
                                Login to Workspace
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center mt-24">
                    <Link to="/" style={{ fontSize: '13px', color: '#64748b', fontWeight: '500', textDecoration: 'none' }}>
                        <i className="fa-solid fa-arrow-left me-2" />
                        Back to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;

