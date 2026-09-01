import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';

function FooterOne() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: '', text: '' });
    const [settings, setSettings] = React.useState({
        facebookUrl: 'https://www.facebook.com/share/1asni32Bye/',
        instagramUrl: 'https://www.instagram.com/jiyolife_travel/',
        youtubeUrl: 'https://youtube.com',
        linkedinUrl: 'https://linkedin.com'
    });

    React.useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/settings`)
            .then(res => {
                if (res.data) {
                    setSettings(res.data);
                }
            })
            .catch(err => console.error('Failed to fetch settings for footer:', err));
    }, []);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/newsletter/subscribe`, { email });
            if (res.status === 200 || res.status === 201) {
                setStatus({ type: 'success', text: 'Subscribed successfully!' });
                setEmail('');
            }
        } catch (err) {
            console.error('Newsletter error:', err);
            setStatus({ type: 'danger', text: err.response?.data?.message || 'Subscription failed.' });
        } finally {
            setTimeout(() => setStatus({ type: '', text: '' }), 5000);
        }
    };

    return (
        <footer className="footer-wrapper" style={{ backgroundColor: '#fff', borderTop: '1px solid #f1f5f9', fontFamily: "'Inter', sans-serif", marginTop: '80px' }}>
            <style>{`
                .professional-footer {
                    padding: 20px 0 15px;
                    color: #4b5563;
                }
                
                /* Top Features Bar */
                .ft-features-row {
                    display: flex;
                    justify-content: center;
                    gap: 90px;
                    padding-bottom: 15px;
                    margin-bottom: 25px;
                    border-bottom: 1px solid #f8fafc;
                }
                .ft-feature {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .ft-feature i {
                    color: #e8151b;
                    font-size: 18px;
                }
                .ft-feature span {
                    font-size: 12px;
                    font-weight: 700;
                    color: #0f172a;
                }
 
                /* Footer Widgets */
                .ft-widget-title {
                    font-size: 14px;
                    font-weight: 800;
                    color: #0f172a;
                    margin-bottom: 15px;
                    line-height: 1;
                }
                .ft-links {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                .ft-links li {
                    margin-bottom: 10px;
                    line-height: 1;
                }
                .ft-links a {
                    color: #64748b;
                    text-decoration: none;
                    font-size: 12px;
                    font-weight: 500;
                    transition: color 0.2s ease;
                }
                .ft-links a:hover {
                    color: #e8151b;
                }
 
                /* Newsletter */
                .ft-newsletter-text {
                    font-size: 12px;
                    line-height: 1.5;
                    color: #64748b;
                    margin-bottom: 12px;
                }
                .ft-newsletter-form {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    margin-bottom: 15px;
                }
                .ft-newsletter-form input {
                    flex: 1;
                    height: 36px;
                    border: 1px solid #e2e8f0;
                    border-radius: 4px;
                    padding: 0 12px;
                    font-size: 12px;
                    outline: none;
                    color: #333;
                }
                .ft-newsletter-form input::placeholder {
                    color: #94a3b8;
                }
                .ft-newsletter-form input:focus {
                    border-color: #cbd5e1;
                }
                .ft-newsletter-form button {
                    height: 36px;
                    width: 40px;
                    background-color: #e8151b;
                    border: none;
                    border-radius: 4px;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .ft-newsletter-form button:hover {
                    background-color: #c11217;
                }
 
                /* Socials */
                .ft-socials {
                    display: flex;
                    gap: 8px;
                }
                .ft-socials a {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background-color: #f1f5f9;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #334155;
                    font-size: 12px;
                    text-decoration: none;
                    transition: all 0.2s ease;
                }
                .ft-socials a:hover {
                    background-color: #e8151b;
                    color: #fff;
                }
 
                /* Bottom */
                .ft-bottom {
                    text-align: center;
                    font-size: 11px;
                    color: #94a3b8;
                    padding-top: 0px;
                    margin-top: -25px;
                }
 
                /* Mobile overrides */
                @media (max-width: 991px) {
                    .ft-features-row {
                        flex-direction: column;
                        gap: 15px;
                    }
                    .footer-widget {
                        margin-bottom: 30px;
                    }
                }
            `}</style>

            <div className="container professional-footer" style={{ paddingLeft: '8%', paddingRight: '8%' }}>

                {/* Main Content */}
                <div className="row">
                    {/* Brand Col */}
                    <div className="col-lg-3 col-md-6 footer-widget">
                        <div style={{ marginBottom: '12px', marginTop: '-10px' }}>
                            <Link to="/">
                                <img src="/assets/img/logo-main-jiyo.png" alt="Jiyo Life" style={{ height: '55px', objectFit: 'contain' }} />
                            </Link>
                        </div>
                        <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#64748b', maxWidth: '240px', margin: 0, paddingLeft: '4px' }}>
                            Making every destination easy to reach, memorable to experience, and extraordinary to remember.
                        </p>
                    </div>

                    {/* Company Col */}
                    <div className="col-lg-2 col-md-3 col-6 footer-widget">
                        <h4 className="ft-widget-title">Company</h4>
                        <ul className="ft-links">
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/destination">Destination</Link></li>
                            <li><Link to="/service">Service</Link></li>
                            <li><Link to="/blog">Blog</Link></li>
                        </ul>
                    </div>

                    {/* Support Col */}
                    <div className="col-lg-2 col-md-3 col-6 footer-widget">
                        <h4 className="ft-widget-title">Support</h4>
                        <ul className="ft-links">
                            <li><Link to="/faq">Help Center</Link></li>
                            <li><Link to="/contact">Contact Us</Link></li>
                            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                            <li><Link to="/terms-booking-policies">Terms & Conditions</Link></li>
                            <li><Link to="/refund-policy">Refund Policy</Link></li>
                        </ul>
                    </div>

                    {/* Destinations Col */}
                    <div className="col-lg-2 col-md-4 col-6 footer-widget">
                        <h4 className="ft-widget-title">Popular Destinations</h4>
                        <ul className="ft-links">
                            <li><Link to="/destination">Switzerland</Link></li>
                            <li><Link to="/destination">Bali</Link></li>
                            <li><Link to="/destination">Maldives</Link></li>
                            <li><Link to="/destination">Paris</Link></li>
                            <li><Link to="/destination">Dubai</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter Col */}
                    <div className="col-lg-3 col-md-8 footer-widget">
                        <h4 className="ft-widget-title">Newsletter</h4>
                        <p className="ft-newsletter-text">
                            Subscribe to get exclusive deals and travel inspiration.
                        </p>

                        {status.text && (
                            <div className={`alert alert-${status.type} p-1 mb-2`} style={{ fontSize: '11px', borderRadius: '4px' }}>
                                {status.text}
                            </div>
                        )}

                        <form className="ft-newsletter-form" onSubmit={handleSubscribe}>
                            <input
                                type="email" placeholder="Enter your email"
                                value={email} onChange={(e) => setEmail(e.target.value)} required
                            />
                            <button type="submit">
                                <i className="fa-solid fa-arrow-up" style={{ transform: 'rotate(45deg)', fontSize: '14px' }} />
                            </button>
                        </form>
                        <div className="ft-socials">
                            {settings.facebookUrl && <a href={settings.facebookUrl} target="_blank" rel="noreferrer"><i className="fab fa-facebook-f" /></a>}
                            {settings.instagramUrl && <a href={settings.instagramUrl} target="_blank" rel="noreferrer"><i className="fab fa-instagram" /></a>}
                            {settings.linkedinUrl && <a href={settings.linkedinUrl} target="_blank" rel="noreferrer"><i className="fab fa-linkedin-in" /></a>}
                            {settings.youtubeUrl && <a href={settings.youtubeUrl} target="_blank" rel="noreferrer"><i className="fab fa-youtube" /></a>}
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="ft-bottom" style={{ paddingBottom: '15px' }}>
                    © 2024 Jiyo Life Travels. All rights reserved. <span style={{ margin: '0 8px' }}>|</span> Designed & Developed by <a href="https://hiverift.com" target="_blank" rel="noreferrer" style={{ color: '#e8151b', fontWeight: '600', textDecoration: 'none' }}>Hiverift Software Pvt. Ltd.</a>
                </div>
            </div>
        </footer>
    )
}

export default FooterOne
