import React, { useState, useEffect } from "react";

function LoginForm({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState("login"); // login | signup | forgot_password | reset_password | verify_signup
    const [showPass, setShowPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);

    // Form States
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [mobile, setMobile] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [agreeTerms, setAgreeTerms] = useState(false);

    // UI States
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    // ESC key close & body scroll lock
    useEffect(() => {
        if (!isOpen) return;
        document.body.style.overflow = "hidden";
        const onEsc = (e) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", onEsc);
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", onEsc);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const API_BASE = "http://localhost:8009/api/auth";

    const showMessage = (text, type = "error") => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: "", type: "" }), 5000);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("token", data.access_token);
                localStorage.setItem("user", JSON.stringify(data.user));
                window.dispatchEvent(new Event('authChange'));
                showMessage("Login successful!", "success");
                setTimeout(onClose, 1500);
            } else {
                showMessage(data.message || "Login failed");
            }
        } catch (err) {
            showMessage("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!agreeTerms) {
            showMessage("You must agree to the Terms of Service and Privacy Policy.");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, firstName, lastName, mobile }),
            });
            const data = await res.json();
            if (res.ok) {
                // Log OTP for easy testing
                if (data.otp) {
                    console.log(`%c🔐 OTP RECEIVED: ${data.otp}`, "color: white; background: #E8151B; font-size: 16px; padding: 4px 8px; border-radius: 4px;");
                }
                showMessage("Registration successful! Please check your email for the OTP.", "success");
                setActiveTab("verify_signup");
            } else {
                showMessage(data.message || "Registration failed");
            }
        } catch (err) {
            showMessage("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifySignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/verify-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });
            const data = await res.json();
            if (res.ok) {
                showMessage("Email verified successfully! You can now login.", "success");
                setActiveTab("login");
                setOtp(""); // clear otp
            } else {
                showMessage(data.message || "Verification failed");
            }
        } catch (err) {
            showMessage("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (res.ok) {
                // Log OTP for easy testing
                if (data.otp) {
                    console.log(`%c🔐 FORGOT PASSWORD OTP RECEIVED: ${data.otp}`, "color: white; background: #E8151B; font-size: 16px; padding: 4px 8px; border-radius: 4px;");
                }
                showMessage("OTP sent to your email!", "success");
                setActiveTab("reset_password");
            } else {
                showMessage(data.message || "Failed to send OTP");
            }
        } catch (err) {
            showMessage("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, newPassword }),
            });
            const data = await res.json();
            if (res.ok) {
                showMessage("Password reset successfully! Please login.", "success");
                setActiveTab("login");
            } else {
                showMessage(data.message || "Failed to reset password");
            }
        } catch (err) {
            showMessage("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: "fixed", inset: 0, zIndex: 99998,
                    background: "rgba(0,0,0,0.6)", backdropFilter: "blur(5px)",
                    animation: "fadeIn 0.2s ease",
                }}
            />

            {/* Modal */}
            <div style={{
                position: "fixed", top: "50%", left: "50%",
                transform: "translate(-50%,-50%)",
                zIndex: 99999, width: "95%", maxWidth: 900,
                maxHeight: "90vh",
                display: "flex",
                background: "#fff", borderRadius: 24,
                boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
                animation: "modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                fontFamily: "'Inter', sans-serif",
                overflow: "hidden"
            }}>
                <style>{`
                    @keyframes fadeIn { from{opacity:0} to{opacity:1} }
                    @keyframes modalIn { from{opacity:0;transform:translate(-50%,-44%) scale(0.96)} to{opacity:1;transform:translate(-50%,-50%) scale(1)} }
                    .auth-inp:focus { border-color: #E8151B !important; background: #fff !important; }
                    
                    /* Left Panel Styles */
                    .auth-left-panel {
                        width: 42%;
                        background: url('/assets/img/login.jpg') center/cover no-repeat;
                        position: relative;
                        padding: 40px;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        color: #fff;
                    }
                    .auth-left-panel::before {
                        content: '';
                        position: absolute;
                        inset: 0;
                        background: linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 100%);
                    }
                    .auth-left-content { position: relative; z-index: 2; }
                    .auth-badge {
                        display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px;
                        text-shadow: 0 2px 8px rgba(0,0,0,0.5);
                    }
                    .auth-badge i { font-size: 20px; color: #fff; }
                    .auth-badge span { font-size: 11px; font-weight: 500; opacity: 0.95; }

                    /* Right Panel Styles */
                    .auth-right-panel {
                        width: 58%;
                        padding: 40px 50px;
                        background: #fff;
                        overflow-y: auto;
                        position: relative;
                        scrollbar-width: thin;
                        scrollbar-color: #ddd transparent;
                    }
                    .auth-right-panel::-webkit-scrollbar { width: 6px; }
                    .auth-right-panel::-webkit-scrollbar-thumb { background: #ddd; border-radius: 10px; }
                    
                    .auth-close-btn {
                        position: absolute; top: 20px; right: 20px;
                        width: 32px; height: 32px; border-radius: 50%;
                        background: #f5f5f5; border: none; cursor: pointer;
                        display: flex; align-items: center; justify-content: center;
                        color: #555; transition: 0.2s;
                    }
                    .auth-close-btn:hover { background: #e0e0e0; color: #111; }

                    /* Toggle Switch */
                    .auth-toggle-wrapper {
                        display: flex; background: #f5f5f5; border-radius: 30px; padding: 4px;
                        margin-bottom: 30px; position: relative; width: max-content;
                    }
                    .auth-toggle-btn {
                        padding: 10px 24px; border: none; background: transparent;
                        border-radius: 30px; font-weight: 600; font-size: 14px;
                        color: #666; cursor: pointer; transition: 0.3s;
                        position: relative; z-index: 2; display: flex; align-items: center; gap: 8px;
                    }
                    .auth-toggle-btn.active { color: #E8151B; }
                    .auth-toggle-slider {
                        position: absolute; top: 4px; bottom: 4px; left: 4px;
                        background: #fff; border-radius: 30px; transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        z-index: 1; box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                    }

                    /* Input Styles */
                    .auth-input-group { position: relative; margin-bottom: 20px; }
                    .auth-input-icon {
                        position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
                        color: #999; font-size: 16px;
                    }
                    .auth-inp-with-icon {
                        width: 100%; box-sizing: border-box;
                        border: 1px solid #e0e0e0; border-radius: 12px;
                        padding: 14px 16px 14px 44px;
                        font-size: 14px; color: #111; outline: none; background: #fff;
                        transition: all 0.2s ease; font-family: 'Inter', sans-serif;
                    }
                    .auth-inp-with-icon:focus { border-color: #E8151B; box-shadow: 0 0 0 4px rgba(232,21,27,0.1); }
                    
                    /* Social Buttons */
                    .social-btn {
                        display: flex; align-items: center; justify-content: center; gap: 10px;
                        width: 100%; padding: 12px 0; border: 1px solid #e0e0e0;
                        border-radius: 10px; background: #fff; cursor: pointer;
                        font-weight: 600; font-size: 14px; color: #333; transition: 0.2s;
                        font-family: 'Inter', sans-serif;
                    }
                    .social-btn:hover { background: #f9f9f9; border-color: #ccc; }
                    
                    @media (max-width: 768px) {
                        .auth-left-panel { display: none; }
                        .auth-right-panel { width: 100%; padding: 30px 20px; }
                        .auth-toggle-wrapper { width: 100%; }
                        .auth-toggle-btn { flex: 1; justify-content: center; }
                    }
                `}</style>

                {/* --- LEFT PANEL --- */}
                <div className="auth-left-panel">
                    <div className="auth-left-content">
                        <div style={{ marginBottom: 40 }}>
                            <img src="/assets/img/logo-main-jiyo.png" alt="Jiyo Life" style={{ height: '60px', objectFit: 'contain', filter: 'brightness(0) invert(1) drop-shadow(0 4px 12px rgba(0,0,0,0.6))' }} />
                        </div>
                        
                        <h2 style={{ color: "#fff", fontSize: 42, fontWeight: 700, lineHeight: 1.2, marginBottom: 16, fontFamily: "'Playfair Display', serif", textShadow: "0 4px 15px rgba(0,0,0,0.8)" }}>
                            Explore More.<br/>Live More.
                        </h2>
                        <p style={{ color: "#fff", fontSize: 15, lineHeight: 1.6, maxWidth: 280, textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>
                            Log in to continue your journey and explore amazing destinations.
                        </p>
                    </div>
                    
                    <div className="auth-left-content" style={{ display: "flex", justifyContent: "space-between", paddingRight: 20 }}>
                        <div className="auth-badge">
                            <i className="fa-solid fa-tags"></i>
                            <span>Best Prices<br/>Guaranteed</span>
                        </div>
                        <div className="auth-badge">
                            <i className="fa-solid fa-map-location-dot"></i>
                            <span>Handpicked<br/>Experiences</span>
                        </div>
                        <div className="auth-badge">
                            <i className="fa-solid fa-headset"></i>
                            <span>24/7<br/>Support</span>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT PANEL --- */}
                <div className="auth-right-panel">
                    <button type="button" className="auth-close-btn" onClick={onClose}>✕</button>
                    
                    <h2 style={{ fontSize: 32, fontWeight: 700, color: "#111", marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>
                        {activeTab === 'login' ? 'Welcome Back!' : activeTab === 'signup' ? 'Create an Account' : activeTab === 'verify_signup' ? 'Verify Email' : 'Reset Password'}
                    </h2>
                    <p style={{ color: "#666", fontSize: 14, marginBottom: 30 }}>
                        {activeTab === 'login' ? 'Login to your Jiyo Life Travels account' : activeTab === 'signup' ? 'Join millions of travelers today' : 'Follow the steps to recover your account'}
                    </p>

                    {/* Toggle Switch */}
                    {(activeTab === "login" || activeTab === "signup") && (
                        <div className="auth-toggle-wrapper">
                            <div className="auth-toggle-slider" style={{
                                width: activeTab === "login" ? "106px" : "120px",
                                transform: activeTab === "login" ? "translateX(0)" : "translateX(106px)"
                            }}></div>
                            <button type="button" className={`auth-toggle-btn ${activeTab === 'login' ? 'active' : ''}`} onClick={() => setActiveTab('login')}>
                                <i className="fa-solid fa-right-to-bracket"></i> Login
                            </button>
                            <button type="button" className={`auth-toggle-btn ${activeTab === 'signup' ? 'active' : ''}`} onClick={() => setActiveTab('signup')}>
                                <i className="fa-regular fa-user"></i> Sign Up
                            </button>
                        </div>
                    )}

                    {/* Message Alert */}
                    {message.text && (
                        <div style={{ padding: "12px", borderRadius: 8, marginBottom: 20, fontSize: 13, fontWeight: 600, textAlign: "center", background: message.type === "success" ? "#e6f4ea" : "#fce8e8", color: message.type === "success" ? "#1e8e3e" : "#d93025" }}>
                            {message.text}
                        </div>
                    )}

                    {/* ── LOGIN FORM ── */}
                    {activeTab === "login" && (
                        <form onSubmit={handleLogin}>
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 8 }}>Email Address</label>
                                <div className="auth-input-group">
                                    <i className="fa-regular fa-envelope auth-input-icon"></i>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="auth-inp-with-icon" placeholder="Enter your email" required />
                                </div>
                            </div>

                            <div style={{ marginBottom: 20 }}>
                                <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 8 }}>Password</label>
                                <div className="auth-input-group" style={{ marginBottom: 12 }}>
                                    <i className="fa-solid fa-lock auth-input-icon"></i>
                                    <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="auth-inp-with-icon" style={{ paddingRight: 44 }} placeholder="Enter your password" required />
                                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#999", padding: 0 }}>
                                        <i className={`fa-regular ${showPass ? "fa-eye-slash" : "fa-eye"}`} style={{ fontSize: 15 }} />
                                    </button>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, color: "#666" }}>
                                        <input type="checkbox" style={{ accentColor: "#E8151B", width: 14, height: 14 }} />
                                        Remember me
                                    </label>
                                    <button type="button" onClick={() => setActiveTab("forgot_password")} style={{ fontSize: 13, color: "#E8151B", textDecoration: "none", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0 }}>Forgot Password?</button>
                                </div>
                            </div>

                            <button type="submit" disabled={loading} style={{
                                width: "100%", padding: "14px 0", border: "none", borderRadius: 12,
                                background: "#E8151B", color: "#fff",
                                fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Inter', sans-serif",
                                boxShadow: "0 6px 20px rgba(232,21,27,0.25)", marginBottom: 24, opacity: loading ? 0.7 : 1, transition: "0.2s"
                            }}>
                                {loading ? "Logging in..." : <><i className="fa-solid fa-right-to-bracket" style={{ marginRight: 8 }} /> Login</>}
                            </button>

                        </form>
                    )}

                    {/* ── SIGNUP FORM ── */}
                    {activeTab === "signup" && (
                        <form onSubmit={handleSignup}>
                            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 8 }}>First Name</label>
                                    <div className="auth-input-group" style={{ marginBottom: 0 }}>
                                        <i className="fa-regular fa-user auth-input-icon"></i>
                                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="auth-inp-with-icon" placeholder="First name" required />
                                    </div>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 8 }}>Last Name</label>
                                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="auth-inp-with-icon" style={{ paddingLeft: 16 }} placeholder="Last name" required />
                                </div>
                            </div>

                            <div style={{ marginBottom: 16 }}>
                                <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 8 }}>Email Address</label>
                                <div className="auth-input-group" style={{ marginBottom: 0 }}>
                                    <i className="fa-regular fa-envelope auth-input-icon"></i>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="auth-inp-with-icon" placeholder="Enter your email" required />
                                </div>
                            </div>

                            <div style={{ marginBottom: 16 }}>
                                <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 8 }}>Mobile Number</label>
                                <div className="auth-input-group" style={{ marginBottom: 0 }}>
                                    <i className="fa-solid fa-phone auth-input-icon"></i>
                                    <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} className="auth-inp-with-icon" placeholder="+91 XXXXX XXXXX" />
                                </div>
                            </div>

                            <div style={{ marginBottom: 20 }}>
                                <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 8 }}>Password</label>
                                <div className="auth-input-group" style={{ marginBottom: 12 }}>
                                    <i className="fa-solid fa-lock auth-input-icon"></i>
                                    <input type={showNewPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="auth-inp-with-icon" style={{ paddingRight: 44 }} placeholder="Create a password" required />
                                    <button type="button" onClick={() => setShowNewPass(!showNewPass)} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#999", padding: 0 }}>
                                        <i className={`fa-regular ${showNewPass ? "fa-eye-slash" : "fa-eye"}`} style={{ fontSize: 15 }} />
                                    </button>
                                </div>
                            </div>

                            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 24, cursor: "pointer" }} onClick={(e) => { e.preventDefault(); setAgreeTerms(!agreeTerms); }}>
                                {agreeTerms ? (
                                    <i className="fa-solid fa-square-check" style={{ color: "#E8151B", fontSize: 18, flexShrink: 0 }} />
                                ) : (
                                    <i className="fa-regular fa-square" style={{ color: "#ccc", fontSize: 18, flexShrink: 0 }} />
                                )}
                                <span style={{ fontSize: 12, color: "#666", lineHeight: 1.5, marginTop: 2 }}>
                                    I agree to the <a href="#" style={{ color: "#E8151B", textDecoration: "none", fontWeight: 600 }}>Terms of Service</a> and <a href="#" style={{ color: "#E8151B", textDecoration: "none", fontWeight: 600 }}>Privacy Policy</a>
                                </span>
                            </label>

                            <button type="submit" disabled={loading} style={{
                                width: "100%", padding: "14px 0", border: "none", borderRadius: 12,
                                background: "#E8151B", color: "#fff",
                                fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Inter', sans-serif",
                                boxShadow: "0 6px 20px rgba(232,21,27,0.25)", opacity: loading ? 0.7 : 1, transition: "0.2s"
                            }}>
                                {loading ? "Creating..." : "Create Account"}
                            </button>
                        </form>
                    )}

                    {/* ── FORGOT PASSWORD ── */}
                    {activeTab === "forgot_password" && (
                        <form onSubmit={handleForgotPassword}>
                            <div style={{ marginBottom: 24 }}>
                                <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 8 }}>Email Address</label>
                                <div className="auth-input-group">
                                    <i className="fa-regular fa-envelope auth-input-icon"></i>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="auth-inp-with-icon" placeholder="Enter your registered email" required />
                                </div>
                            </div>
                            <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px 0", border: "none", borderRadius: 12, background: "#E8151B", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 6px 20px rgba(232,21,27,0.25)", marginBottom: 20 }}>
                                {loading ? "Sending OTP..." : "Send OTP"}
                            </button>
                            <p style={{ textAlign: "center", fontSize: 13, color: "#666", margin: 0 }}>
                                Remember your password? <button type="button" onClick={() => setActiveTab("login")} style={{ color: "#E8151B", fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontSize: 13, padding: 0 }}>Login here</button>
                            </p>
                        </form>
                    )}

                    {/* ── RESET PASSWORD ── */}
                    {activeTab === "reset_password" && (
                        <form onSubmit={handleResetPassword}>
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 8 }}>OTP</label>
                                <div className="auth-input-group">
                                    <i className="fa-solid fa-key auth-input-icon"></i>
                                    <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="auth-inp-with-icon" placeholder="Enter 6-digit OTP" required />
                                </div>
                            </div>
                            <div style={{ marginBottom: 24 }}>
                                <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 8 }}>New Password</label>
                                <div className="auth-input-group">
                                    <i className="fa-solid fa-lock auth-input-icon"></i>
                                    <input type={showNewPass ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="auth-inp-with-icon" style={{ paddingRight: 44 }} placeholder="Create a new password" required />
                                    <button type="button" onClick={() => setShowNewPass(!showNewPass)} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#999", padding: 0 }}>
                                        <i className={`fa-regular ${showNewPass ? "fa-eye-slash" : "fa-eye"}`} style={{ fontSize: 15 }} />
                                    </button>
                                </div>
                            </div>
                            <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px 0", border: "none", borderRadius: 12, background: "#E8151B", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 6px 20px rgba(232,21,27,0.25)" }}>
                                {loading ? "Resetting..." : "Reset Password"}
                            </button>
                        </form>
                    )}

                    {/* ── VERIFY SIGNUP OTP ── */}
                    {activeTab === "verify_signup" && (
                        <form onSubmit={handleVerifySignup}>
                            <p style={{ color: "#666", fontSize: 13, marginBottom: 24, padding: "12px", background: "#f9f9f9", borderRadius: 8, border: "1px solid #eee" }}>
                                We've sent a 6-digit OTP to <strong>{email}</strong>. Please enter it below.
                            </p>
                            <div style={{ marginBottom: 24 }}>
                                <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 8 }}>OTP</label>
                                <div className="auth-input-group">
                                    <i className="fa-solid fa-shield-halved auth-input-icon"></i>
                                    <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="auth-inp-with-icon" placeholder="Enter 6-digit OTP" required />
                                </div>
                            </div>
                            <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px 0", border: "none", borderRadius: 12, background: "#E8151B", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 6px 20px rgba(232,21,27,0.25)" }}>
                                {loading ? "Verifying..." : "Verify Account"}
                            </button>
                        </form>
                    )}

                </div>
            </div>
        </>
    );
}

export default LoginForm;

