import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderOne from '../Components/Header/HeaderOne';
import FooterOne from '../Components/Footer/FooterOne';
import { Search, MapPin, Calendar, Clock, CreditCard, ChevronRight, Hash, Building2, AlertCircle } from 'lucide-react';

const HOTEL_API = process.env.REACT_APP_HOTEL_API_BASE_URL || 'http://localhost:8009/api/hotel';

export default function HotelMyBookings() {
  const navigate = useNavigate();
  const [authData, setAuthData] = useState({ email: '', phone: '' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState('upcoming');

  // Load auth state from localStorage or sessionStorage
  useEffect(() => {
    const userDataStr = localStorage.getItem("user");
    if (userDataStr) {
      try {
        const parsedUser = JSON.parse(userDataStr);
        setAuthData({ email: parsedUser.email || '', phone: parsedUser.mobile || '', userId: parsedUser._id });
        setIsAuthenticated(true);
        fetchBookings(parsedUser.email, parsedUser.mobile, parsedUser._id);
        return;
      } catch(e) {}
    }

    const saved = sessionStorage.getItem('hotelBookingsAuth');
    if (saved) {
      const parsed = JSON.parse(saved);
      setAuthData(parsed);
      setIsAuthenticated(true);
      fetchBookings(parsed.email, parsed.phone, null);
    }
  }, []);

  const fetchBookings = async (email, phone, userId) => {
    setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams();
      if (email) query.append('email', email);
      if (phone) query.append('phone', phone);
      if (userId) query.append('userId', userId);

      const res = await fetch(`${HOTEL_API}/my-bookings?${query.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch bookings');
      
      const data = await res.json();
      setBookings(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!authData.email && !authData.phone) {
      setError('Please provide either an email or a phone number.');
      return;
    }
    sessionStorage.setItem('hotelBookingsAuth', JSON.stringify(authData));
    setIsAuthenticated(true);
    fetchBookings(authData.email, authData.phone, null);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('hotelBookingsAuth');
    setIsAuthenticated(false);
    setBookings([]);
    setAuthData({ email: '', phone: '' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return { bg: '#dcfce7', color: '#166534', label: 'Confirmed' };
      case 'PENDING_CONFIRMATION': return { bg: '#fef3c7', color: '#92400e', label: 'Processing' };
      case 'FAILED': return { bg: '#fee2e2', color: '#b91c1c', label: 'Failed' };
      case 'REFUND_INITIATED': return { bg: '#f3e8ff', color: '#6b21a8', label: 'Refund Initiated' };
      case 'CANCELLED': return { bg: '#f1f5f9', color: '#475569', label: 'Cancelled' };
      default: return { bg: '#f1f5f9', color: '#475569', label: status };
    }
  };

  const categorizedBookings = {
    upcoming: bookings.filter(b => ['CONFIRMED', 'PENDING_CONFIRMATION'].includes(b.status)),
    cancelled: bookings.filter(b => ['CANCELLED'].includes(b.status)),
    failed: bookings.filter(b => ['FAILED', 'REFUND_INITIATED'].includes(b.status)),
    completed: bookings.filter(b => ['COMPLETED'].includes(b.status)),
  };

  const currentList = categorizedBookings[activeTab] || [];

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@500;600;700;800&display=swap');
        
        /* Auth Screen */
        .hmb-auth-card { background: #fff; max-width: 480px; margin: 40px auto; padding: 40px; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.05); text-align: center; border: 1px solid #e2e8f0; }
        .hmb-auth-icon { width: 64px; height: 64px; background: #eff6ff; color: #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
        .hmb-title { font-family: 'Outfit', sans-serif; font-size: 28px; font-weight: 800; color: #1e293b; margin: 0 0 8px; }
        .hmb-subtitle { color: #64748b; font-size: 15px; margin-bottom: 32px; }
        .hmb-input-group { margin-bottom: 20px; text-align: left; }
        .hmb-label { display: block; font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 6px; }
        .hmb-input { width: 100%; padding: 12px 16px; border: 1.5px solid #e2e8f0; border-radius: 12px; font-size: 15px; outline: none; transition: all 0.2s; box-sizing: border-box; }
        .hmb-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
        .hmb-btn { width: 100%; padding: 14px; background: #e8151b; color: #fff; border: none; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.2s; font-family: 'Outfit', sans-serif; display: flex; justify-content: center; align-items: center; gap: 8px; }
        .hmb-btn:hover { background: #c8101a; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(232,21,27,0.25); }

        /* Dashboard */
        .hmb-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
        .hmb-header-title { font-family: 'Outfit', sans-serif; font-size: 32px; font-weight: 800; color: #1e293b; mragin: 0; }
        .hmb-user-badge { display: flex; align-items: center; gap: 12px; background: #f8fafc; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; color: #475569; border: 1px solid #e2e8f0; }
        .hmb-logout { color: #ef4444; cursor: pointer; font-weight: 700; font-size: 13px; }
        
        .hmb-tabs { display: flex; gap: 12px; margin-bottom: 24px; overflow-x: auto; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0; }
        .hmb-tab { padding: 10px 20px; border-radius: 12px 12px 0 0; font-size: 14px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: all 0.2s; border: none; background: transparent; color: #64748b; margin-bottom: -9px; border-bottom: 3px solid transparent; }
        .hmb-tab.active { color: #e8151b; border-bottom: 3px solid #e8151b; }
        .hmb-tab:not(.active):hover { color: #1e293b; }

        .hmb-card { background: #fff; border-radius: 16px; padding: 24px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 16px; transition: transform 0.2s; cursor: pointer; }
        .hmb-card:hover { transform: translateY(-4px); box-shadow: 0 10px 25px rgba(0,0,0,0.08); border-color: #cbd5e1; }
        
        .hmb-card-top { display: flex; justify-content: space-between; align-items: flex-start; }
        .hmb-hotel-name { font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 700; color: #1e293b; margin-bottom: 6px; }
        .hmb-hotel-loc { display: flex; align-items: center; gap: 4px; font-size: 14px; color: #64748b; }
        .hmb-status-badge { padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700; text-transform: uppercase; display: inline-flex; align-items: center; gap: 4px; }
        
        .hmb-card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; background: #f8fafc; padding: 16px; border-radius: 12px; margin-top: 8px; border: 1px solid #f1f5f9; }
        .hmb-grid-item { display: flex; flex-direction: column; gap: 4px; }
        .hmb-grid-label { font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
        .hmb-grid-value { font-size: 14px; font-weight: 600; color: #1e293b; display: flex; align-items: center; gap: 6px; }

        .hmb-empty { text-align: center; padding: 60px 20px; background: #f8fafc; border-radius: 16px; border: 1px dashed #cbd5e1; }
        .hmb-empty h3 { font-family: 'Outfit', sans-serif; font-size: 20px; color: #1e293b; margin: 16px 0 8px; }
        .hmb-empty p { color: #64748b; font-size: 15px; }

        @media(max-width: 600px) {
          .hmb-header { flex-direction: column; align-items: flex-start; gap: 16px; }
          .hmb-card-top { flex-direction: column; gap: 12px; }
        }
      `}</style>
          
      {!isAuthenticated ? (
        <div className="hmb-auth-card">
          <div className="hmb-auth-icon">
            <Search size={32} />
          </div>
          <h1 className="hmb-title">Find Your Bookings</h1>
          <p className="hmb-subtitle">Enter your email or phone number to view and manage your hotel reservations.</p>
          
          {error && <div style={{ color: '#ef4444', background: '#fef2f2', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', fontWeight: '500' }}>{error}</div>}
          
          <form onSubmit={handleLogin}>
            <div className="hmb-input-group">
              <label className="hmb-label">Email Address</label>
              <input type="email" className="hmb-input" placeholder="e.g. you@example.com" value={authData.email} onChange={e => setAuthData({...authData, email: e.target.value})} />
            </div>
            <div style={{ textAlign: 'center', margin: '10px 0', color: '#94a3b8', fontSize: '13px', fontWeight: '600' }}>OR</div>
            <div className="hmb-input-group">
              <label className="hmb-label">Phone Number</label>
              <input type="tel" className="hmb-input" placeholder="e.g. 9876543210" value={authData.phone} onChange={e => setAuthData({...authData, phone: e.target.value})} />
            </div>
            
            <button type="submit" className="hmb-btn">View My Bookings</button>
          </form>
        </div>
      ) : (
        <>
          <div className="hmb-header">
            <div>
              <h2 className="hmb-header-title">My Hotel Bookings</h2>
            </div>
            <div className="hmb-user-badge">
              <span>{authData.email || authData.phone}</span>
              <span style={{ color: '#cbd5e1' }}>|</span>
              <span className="hmb-logout" onClick={handleLogout}>Logout</span>
            </div>
          </div>

          <div className="hmb-tabs">
            {[
              { id: 'upcoming', label: 'Upcoming / Processing' },
              { id: 'completed', label: 'Completed' },
              { id: 'cancelled', label: 'Cancelled' },
              { id: 'failed', label: 'Failed / Refunds' },
            ].map(tab => (
              <button 
                key={tab.id} 
                className={`hmb-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label} ({categorizedBookings[tab.id]?.length || 0})
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
              <div style={{ display: 'inline-block', width: '30px', height: '30px', border: '3px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <div style={{ marginTop: '16px', fontWeight: '500' }}>Loading your bookings...</div>
            </div>
          ) : currentList.length === 0 ? (
            <div className="hmb-empty">
              <Building2 size={48} color="#cbd5e1" style={{ margin: '0 auto' }} />
              <h3>No {activeTab} bookings found</h3>
              <p>Looks like you don't have any bookings in this category.</p>
              <button onClick={() => navigate('/')} style={{ marginTop: '20px', padding: '10px 24px', background: '#e8151b', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Search Hotels</button>
            </div>
          ) : (
            <div>
              {currentList.map(booking => {
                const statusObj = getStatusColor(booking.status);
                const hotelName = booking.hotelDetails?.HotelName || 'Unknown Hotel';
                const city = booking.hotelDetails?.CityName || 'Unknown City';
                const guestName = booking.guestDetails?.[0]?.HotelPassenger?.[0]?.FirstName + ' ' + (booking.guestDetails?.[0]?.HotelPassenger?.[0]?.LastName || '');
                
                return (
                  <div className="hmb-card" key={booking._id} onClick={() => navigate('/hotel-confirmation', { state: { bookingId: booking.bookingId, bookResult: { Status: { Description: booking.status }, ConfirmationNo: booking.confirmationNo }, hotel: booking.hotelDetails, selectedRoom: booking.roomDetails, contactEmail: authData.email, contactPhone: authData.phone, voucherData: booking.voucherDetails } })}>
                    <div className="hmb-card-top">
                      <div>
                        <div className="hmb-hotel-name">{hotelName}</div>
                        <div className="hmb-hotel-loc"><MapPin size={14} /> {city}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="hmb-status-badge" style={{ background: statusObj.bg, color: statusObj.color }}>
                          {statusObj.label}
                        </div>
                        <div style={{ fontSize: '13px', color: '#64748b', marginTop: '6px', fontWeight: '600' }}>ID: {booking.bookingId}</div>
                      </div>
                    </div>

                    <div className="hmb-card-grid">
                      <div className="hmb-grid-item">
                        <span className="hmb-grid-label">Guest</span>
                        <span className="hmb-grid-value">{guestName}</span>
                      </div>
                      <div className="hmb-grid-item">
                        <span className="hmb-grid-label">Amount Paid</span>
                        <span className="hmb-grid-value" style={{ color: '#166534' }}>₹{booking.fareDetails?.NetAmount?.toLocaleString() || 0}</span>
                      </div>
                      <div className="hmb-grid-item">
                        <span className="hmb-grid-label">Payment ID</span>
                        <span className="hmb-grid-value" style={{ fontFamily: 'monospace' }}>{booking.razorpayPaymentId || 'N/A'}</span>
                      </div>
                    </div>
                    
                    {booking.status === 'REFUND_INITIATED' && (
                      <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', fontSize: '13px', color: '#475569', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <AlertCircle size={16} color="#eab308" />
                        <span>Your refund for ₹{booking.fareDetails?.NetAmount?.toLocaleString() || 0} is being processed and will reflect in your original payment method in 5-7 working days.</span>
                      </div>
                    )}
                    
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
