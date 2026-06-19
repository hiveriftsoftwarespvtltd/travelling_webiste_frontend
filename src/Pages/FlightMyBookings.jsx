import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plane, Calendar, User, Hash, Clock, XCircle, CheckCircle } from 'lucide-react';
import HeaderOne from '../Components/Header/HeaderOne';
import FooterOne from '../Components/Footer/FooterOne';

function FlightMyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('Upcoming');
    const navigate = useNavigate();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const userData = localStorage.getItem("user");
            let userId = null;
            if (userData) {
                const parsed = JSON.parse(userData);
                userId = parsed._id;
            }

            if (!userId) {
                setBookings([]);
                setLoading(false);
                return;
            }

            const response = await axios.post(`${process.env.REACT_APP_FLIGHT_API_BASE_URL}/my-bookings`, {
                userId
            });
            if (response.data && response.data.success) {
                setBookings(response.data.data);
            } else {
                setError('Failed to load bookings.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching bookings.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const isCancelled = status === 3 || status === 'Cancelled' || status === '3';
        const isConfirmed = status === 1 || status === 2 || status === 'Confirmed' || status === '1' || status === '2';
        if (isConfirmed) return <span className="badge bg-success px-3 py-2" style={{borderRadius: '20px'}}><CheckCircle size={14} className="me-1"/> Confirmed</span>;
        if (isCancelled) return <span className="badge bg-danger px-3 py-2" style={{borderRadius: '20px'}}><XCircle size={14} className="me-1"/> Cancelled</span>;
        return <span className="badge bg-warning text-dark px-3 py-2" style={{borderRadius: '20px'}}><Clock size={14} className="me-1"/> Processing</span>;
    };

    const filteredBookings = bookings.filter(booking => {
        const segments = Array.isArray(booking.flightDetails?.Segments) ? booking.flightDetails.Segments.flat() : [];
        const dateRaw = segments?.[0]?.Origin?.DepTime;
        const depDate = dateRaw ? new Date(dateRaw) : new Date(0); // fallback to past date if missing
        const now = new Date();

        // Normalize TBO Status (1/2 = Confirmed, 3 = Cancelled)
        const isCancelled = booking.status === 3 || booking.status === 'Cancelled' || booking.status === '3';
        const isConfirmed = booking.status === 1 || booking.status === 2 || booking.status === 'Confirmed' || booking.status === '1' || booking.status === '2';
        
        let normalizedStatus = 'Processing';
        if (isCancelled) normalizedStatus = 'Cancelled';
        else if (isConfirmed) normalizedStatus = 'Confirmed';

        if (activeTab === 'Upcoming') {
            return normalizedStatus === 'Confirmed' && depDate >= now;
        } else if (activeTab === 'Completed') {
            return normalizedStatus === 'Confirmed' && depDate < now;
        } else if (activeTab === 'Cancelled') {
            return normalizedStatus === 'Cancelled';
        } else if (activeTab === 'Processing') {
            return normalizedStatus === 'Processing';
        }
        return true;
    });

    return (
        <div className="fmb-wrapper" style={{ backgroundColor: '#fff', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.04)' }}>
            <style>{`
                .fmb-wrapper { font-family: 'Inter', sans-serif; padding: 40px; box-sizing: border-box; width: 100%; overflow: hidden; }
                .fmb-title { font-family: 'Outfit', sans-serif; font-weight: 800; color: '#0f172a'; margin-bottom: 24px; font-size: 28px; letter-spacing: -0.5px; }
                
                /* --- TABS --- */
                .fmb-tabs-container {
                    display: flex; gap: 12px; margin-bottom: 30px; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px;
                    overflow-x: auto; white-space: nowrap;
                }
                .fmb-tabs-container::-webkit-scrollbar { display: none; }
                .fmb-tab {
                    padding: 10px 20px; border-radius: 30px; font-weight: 600; font-size: 14px;
                    border: none; background: transparent; color: #64748b; cursor: pointer; transition: 0.2s;
                }
                .fmb-tab:hover { background: #f8fafc; color: #0f172a; }
                .fmb-tab.active { background: #fee2e2; color: #E8151B; box-shadow: 0 4px 12px rgba(232,21,27,0.1); }
                
                /* --- BOOKING CARD --- */
                .fmb-card {
                    background: #fff; border-radius: 16px; border: 1px solid #e2e8f0;
                    margin-bottom: 24px; overflow: hidden; transition: 0.3s;
                }
                .fmb-card:hover { border-color: #cbd5e1; box-shadow: 0 10px 30px rgba(0,0,0,0.04); }
                
                .fmb-card-header {
                    background: #f8fafc; padding: 16px 24px; border-bottom: 1px solid #e2e8f0;
                    display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap;
                }
                .fmb-card-body { padding: 24px; }
                
                .fmb-grid {
                    display: grid; grid-template-columns: minmax(200px, 1.5fr) minmax(180px, 1fr) minmax(160px, auto);
                    gap: 30px; align-items: center;
                }
                
                /* Route Visual */
                .fmb-route { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
                .fmb-city { font-size: 24px; font-weight: 800; color: #0f172a; line-height: 1.2; }
                .fmb-date { font-size: 13px; color: #64748b; margin-top: 4px; display: flex; align-items: center; gap: 4px; }
                .fmb-line { flex: 1; height: 2px; background: repeating-linear-gradient(90deg, #cbd5e1 0, #cbd5e1 4px, transparent 4px, transparent 8px); position: relative; }
                .fmb-line-icon { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #E8151B; background: #fff; padding: 0 8px; }
                
                /* Details Grid */
                .fmb-details { display: flex; flex-direction: column; gap: 12px; padding-left: 30px; border-left: 1px solid #f1f5f9; }
                .fmb-detail-row { display: flex; justify-content: space-between; align-items: center; font-size: 14px; }
                .fmb-detail-label { color: #64748b; }
                .fmb-detail-val { font-weight: 600; color: #0f172a; }
                
                /* Action Area */
                .fmb-action { display: flex; flex-direction: column; align-items: flex-end; gap: 16px; padding-left: 30px; border-left: 1px solid #f1f5f9; }
                .fmb-price { font-size: 26px; font-weight: 800; color: #0f172a; font-family: 'Outfit', sans-serif; }
                .fmb-btn {
                    padding: 12px 24px; border-radius: 12px; background: #E8151B; color: #fff;
                    font-weight: 700; border: none; width: 100%; transition: 0.2s; font-size: 15px;
                }
                .fmb-btn:hover { background: #dc2626; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(232, 21, 27, 0.2); }
                
                /* Status Badges */
                .badge-soft-success { background: #dcfce7; color: #166534; }
                .badge-soft-danger { background: #fee2e2; color: #991b1b; }
                .badge-soft-warning { background: #fef9c3; color: #854d0e; }
                
                @media (max-width: 992px) {
                    .fmb-grid { grid-template-columns: 1fr; gap: 24px; }
                    .fmb-details { padding-left: 0; border-left: none; padding-top: 24px; border-top: 1px solid #f1f5f9; }
                    .fmb-action { padding-left: 0; border-left: none; padding-top: 24px; border-top: 1px solid #f1f5f9; align-items: stretch; }
                    .fmb-action .fmb-price { text-align: center; margin-bottom: 8px; }
                }
                @media (max-width: 576px) {
                    .fmb-wrapper { padding: 24px 20px; }
                    .fmb-card-header { flex-direction: column; align-items: flex-start; gap: 12px; }
                    .fmb-city { font-size: 20px; }
                }
            `}</style>

            <h2 className="fmb-title">My Flight Bookings</h2>
            
            {/* TABS UI */}
            <div className="fmb-tabs-container">
                {['Upcoming', 'Completed', 'Cancelled', 'Processing'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`fmb-tab ${activeTab === tab ? 'active' : ''}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {loading && <div className="text-center py-5"><h4 style={{color: '#64748b'}}>Loading your bookings...</h4></div>}
            {error && <div className="alert alert-danger" style={{borderRadius: '12px'}}>{error}</div>}
            
            {!loading && !error && filteredBookings.length === 0 && (
                <div className="text-center py-5" style={{ background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                    <div style={{ width: '80px', height: '80px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <Plane size={40} color="#cbd5e1" />
                    </div>
                    <h4 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#0f172a' }}>No {activeTab} Bookings Found</h4>
                    <p style={{ color: '#64748b', maxWidth: '400px', margin: '0 auto' }}>You haven't made any flight bookings that match this status. Start exploring!</p>
                    <Link to="/" className="btn btn-primary mt-4 px-4 py-2" style={{ borderRadius: '12px', background: '#0f172a', border: 'none', fontWeight: 600 }}>Search Flights</Link>
                </div>
            )}

            {!loading && !error && filteredBookings.length > 0 && (
                <div className="booking-list">
                    {filteredBookings.map(booking => {
                        const segments = Array.isArray(booking.flightDetails?.Segments) ? booking.flightDetails.Segments.flat() : [];
                        const dateRaw = segments?.[0]?.Origin?.DepTime;
                        const origin = segments?.[0]?.Origin?.Airport?.CityCode || 'N/A';
                        const destination = segments?.[segments.length - 1]?.Destination?.Airport?.CityCode || 'N/A';
                        const date = dateRaw ? new Date(dateRaw).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A';

                        // Status Badge Re-design
                        const isCancelled = booking.status === 3 || booking.status === 'Cancelled' || booking.status === '3';
                        const isConfirmed = booking.status === 1 || booking.status === 2 || booking.status === 'Confirmed' || booking.status === '1' || booking.status === '2';
                        let badgeClass = 'badge-soft-warning';
                        let badgeIcon = <Clock size={14} className="me-1"/>;
                        let badgeText = 'Processing';
                        if (isConfirmed) { badgeClass = 'badge-soft-success'; badgeIcon = <CheckCircle size={14} className="me-1"/>; badgeText = 'Confirmed'; }
                        if (isCancelled) { badgeClass = 'badge-soft-danger'; badgeIcon = <XCircle size={14} className="me-1"/>; badgeText = 'Cancelled'; }

                        return (
                            <div key={booking._id} className="fmb-card">
                                <div className="fmb-card-header">
                                    <div style={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Hash size={16} />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>Booking ID</div>
                                            <div style={{ fontSize: '15px' }}>{booking.bookingId}</div>
                                        </div>
                                    </div>
                                    <span className={`badge px-3 py-2 ${badgeClass}`} style={{ borderRadius: '30px', fontSize: '13px', fontWeight: 600 }}>
                                        {badgeIcon} {badgeText}
                                    </span>
                                </div>
                                
                                <div className="fmb-card-body">
                                    <div className="fmb-grid">
                                        
                                        {/* 1. Route */}
                                        <div>
                                            <div className="fmb-route">
                                                <div style={{ textAlign: 'center' }}>
                                                    <div className="fmb-city">{origin}</div>
                                                </div>
                                                <div className="fmb-line">
                                                    <div className="fmb-line-icon"><Plane size={20} /></div>
                                                </div>
                                                <div style={{ textAlign: 'center' }}>
                                                    <div className="fmb-city">{destination}</div>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'center', marginTop: '12px' }}>
                                                <div className="fmb-date justify-content-center"><Calendar size={14} /> {date}</div>
                                            </div>
                                        </div>

                                        {/* 2. Details */}
                                        <div className="fmb-details">
                                            <div className="fmb-detail-row">
                                                <span className="fmb-detail-label">PNR</span>
                                                <span className="fmb-detail-val">{booking.pnr || 'Pending'}</span>
                                            </div>
                                            <div className="fmb-detail-row">
                                                <span className="fmb-detail-label">Passengers</span>
                                                <span className="fmb-detail-val" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <User size={14}/> {booking.passengers?.length || 0}
                                                </span>
                                            </div>
                                            <div className="fmb-detail-row">
                                                <span className="fmb-detail-label">Booked On</span>
                                                <span className="fmb-detail-val">{new Date(booking.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        {/* 3. Action */}
                                        <div className="fmb-action">
                                            <div className="fmb-price">₹{booking.fareDetails?.OfferedFare || 0}</div>
                                            <button 
                                                onClick={() => navigate(`/user-profile/flight-booking/${booking.bookingId}`)}
                                                className="fmb-btn"
                                            >
                                                {activeTab === 'Upcoming' ? 'Manage Booking' : activeTab === 'Processing' ? 'Track Status' : 'View Details'}
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default FlightMyBookings;
