import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FooterOne from '../Components/Footer/FooterOne';
import HeaderOne from '../Components/Header/HeaderOne';
import { CheckCircle2, Building2, MapPin, Calendar, Users, Mail, Phone, ShieldCheck, Printer, Download, CreditCard, ChevronRight, Hash } from 'lucide-react';

export default function HotelConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  useEffect(() => {
    if (!state || (!state.bookingId && !state.bookResult)) {
      navigate('/');
    }
  }, [state, navigate]);

  if (!state) return null;

  const {
    bookingId,
    bookResult,
    voucherData,
    hotel,
    selectedRoom,
    checkIn,
    checkOut,
    rooms,
    adults,
    nights,
    contactEmail,
    contactPhone,
    leadGuest
  } = state;

  const bookingStatus = bookResult?.Status?.Description || 'Confirmed';
  const confirmationNo = bookResult?.ConfirmationNo || voucherData?.Voucher?.ConfirmationNo || 'Pending from Hotel';
  const price = selectedRoom?.TotalFare || hotel?.MinPrice || 0;
  const taxes = Math.round(price * 0.12);
  const grandTotal = price + taxes;

  return (
    <>
      <HeaderOne />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800&display=swap');
        .hc-page { background: #f1f5f9; min-height: 100vh; font-family: 'Inter', sans-serif; padding-top: 80px; padding-bottom: 60px; }
        .hc-container { max-width: 900px; margin: 0 auto; padding: 0 20px; }
        
        .hc-banner { background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 24px; padding: 40px; color: #fff; text-align: center; margin-bottom: 24px; box-shadow: 0 10px 30px rgba(16,185,129,0.2); position: relative; overflow: hidden; }
        .hc-banner::after { content: ''; position: absolute; top: 0; right: 0; bottom: 0; left: 0; background: url('data:image/svg+xml;utf8,<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="2" cy="2" r="2" fill="rgba(255,255,255,0.05)"/></svg>') repeat; opacity: 0.5; pointer-events: none; }
        .hc-banner-icon { width: 80px; height: 80px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; position: relative; z-index: 2; }
        .hc-banner h1 { font-family: 'Outfit', sans-serif; font-size: clamp(2rem, 4vw, 2.5rem); font-weight: 800; margin: 0 0 8px; position: relative; z-index: 2; }
        .hc-banner p { font-size: 16px; color: rgba(255,255,255,0.9); margin: 0; position: relative; z-index: 2; }
        
        .hc-card { background: #fff; border-radius: 18px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); margin-bottom: 24px; }
        .hc-section-title { font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 700; color: #1a1a2e; margin: 0 0 20px; display: flex; align-items: center; gap: 10px; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; }
        
        .hc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        @media(max-width: 600px) { .hc-grid { grid-template-columns: 1fr; } }
        
        .hc-detail-group { display: flex; flex-direction: column; gap: 4px; }
        .hc-detail-label { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
        .hc-detail-val { font-size: 15px; font-weight: 600; color: #1a1a2e; }
        
        .hc-hotel-box { display: flex; gap: 20px; background: #f8fafc; padding: 16px; border-radius: 14px; border: 1px solid #e2e8f0; align-items: center; }
        .hc-hotel-img { width: 100px; height: 100px; border-radius: 10px; object-fit: cover; flex-shrink: 0; }
        
        .hc-price-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px dashed #e2e8f0; font-size: 14px; }
        .hc-price-row:last-child { border-bottom: none; }
        .hc-total-row { display: flex; justify-content: space-between; padding-top: 16px; margin-top: 8px; border-top: 2px solid #f1f5f9; font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 800; color: #1a1a2e; }
        
        .hc-btn-group { display: flex; gap: 16px; margin-top: 32px; justify-content: center; flex-wrap: wrap; }
        .hc-btn { display: flex; align-items: center; gap: 8px; padding: 14px 28px; border-radius: 12px; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; font-family: 'Inter', sans-serif; border: none; }
        .hc-btn-primary { background: #1a1a2e; color: #fff; }
        .hc-btn-primary:hover { background: #0f0f1a; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(26,26,46,0.2); }
        .hc-btn-secondary { background: #fff; color: #1a1a2e; border: 1.5px solid #e2e8f0; }
        .hc-btn-secondary:hover { background: #f8fafc; border-color: #cbd5e1; }
      `}</style>

      <div className="hc-page">
        <div className="hc-container">
          
          {/* Success Banner */}
          <div className="hc-banner">
            <div className="hc-banner-icon">
              <CheckCircle2 size={40} color="#fff" strokeWidth={2.5} />
            </div>
            <h1>Booking {bookingStatus}</h1>
            <p>Your hotel reservation is confirmed. A copy has been sent to {contactEmail}</p>
          </div>

          {/* Booking Reference Details */}
          <div className="hc-card" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '24px', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '13px', color: '#166534', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>TBO Booking ID</div>
              <div style={{ fontSize: '24px', fontFamily: "'Outfit', sans-serif", fontWeight: '800', color: '#14532d', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                <Hash size={20} /> {bookingId}
              </div>
            </div>
            <div style={{ width: '1px', background: '#bbf7d0' }}></div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '13px', color: '#166534', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>Hotel Confirmation No.</div>
              <div style={{ fontSize: '24px', fontFamily: "'Outfit', sans-serif", fontWeight: '800', color: '#14532d' }}>
                {confirmationNo}
              </div>
            </div>
          </div>

          {/* Hotel Details */}
          <div className="hc-card">
            <div className="hc-section-title"><Building2 size={20} color="#0ea5e9" /> Hotel Details</div>
            <div className="hc-hotel-box">
              <img 
                src={hotel?.HotelPicture || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&h=400'} 
                alt="Hotel" 
                className="hc-hotel-img" 
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&h=400'; }}
              />
              <div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '20px', fontWeight: '800', color: '#1a1a2e', marginBottom: '6px' }}>{hotel?.HotelName}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#64748b', marginBottom: '10px' }}>
                  <MapPin size={14} /> {hotel?.HotelAddress || 'Address not provided'}
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fff', border: '1px solid #e2e8f0', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', color: '#475569' }}>
                  <ShieldCheck size={14} color="#10b981" /> Confirmed Booking
                </div>
              </div>
            </div>

            <div className="hc-grid" style={{ marginTop: '24px' }}>
              <div className="hc-detail-group">
                <span className="hc-detail-label">Check-in</span>
                <span className="hc-detail-val" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={16} color="#64748b" /> {checkIn}</span>
              </div>
              <div className="hc-detail-group">
                <span className="hc-detail-label">Check-out</span>
                <span className="hc-detail-val" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={16} color="#64748b" /> {checkOut}</span>
              </div>
              <div className="hc-detail-group">
                <span className="hc-detail-label">Duration</span>
                <span className="hc-detail-val">{nights} Night{nights > 1 ? 's' : ''}</span>
              </div>
              <div className="hc-detail-group">
                <span className="hc-detail-label">Room Type</span>
                <span className="hc-detail-val">{selectedRoom?.RoomTypeName || 'Standard Room'}</span>
              </div>
            </div>
          </div>

          {/* Guest & Contact Details */}
          <div className="hc-card">
            <div className="hc-section-title"><Users size={20} color="#8b5cf6" /> Guest Details</div>
            <div className="hc-grid">
              <div className="hc-detail-group">
                <span className="hc-detail-label">Lead Guest</span>
                <span className="hc-detail-val">{leadGuest?.Title} {leadGuest?.FirstName} {leadGuest?.LastName}</span>
              </div>
              <div className="hc-detail-group">
                <span className="hc-detail-label">Total Guests</span>
                <span className="hc-detail-val">{adults} Adult{adults > 1 ? 's' : ''} in {rooms} Room{rooms > 1 ? 's' : ''}</span>
              </div>
              <div className="hc-detail-group">
                <span className="hc-detail-label">Email Address</span>
                <span className="hc-detail-val" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={16} color="#64748b" /> {contactEmail}</span>
              </div>
              <div className="hc-detail-group">
                <span className="hc-detail-label">Phone Number</span>
                <span className="hc-detail-val" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={16} color="#64748b" /> {contactPhone}</span>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="hc-card">
            <div className="hc-section-title"><CreditCard size={20} color="#f59e0b" /> Payment Summary</div>
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px' }}>
              <div className="hc-price-row">
                <span style={{ color: '#64748b', fontWeight: '500' }}>Room Charges ({nights} Night{nights > 1 ? 's' : ''})</span>
                <span style={{ color: '#1a1a2e', fontWeight: '600' }}>₹{price.toLocaleString()}</span>
              </div>
              <div className="hc-price-row">
                <span style={{ color: '#64748b', fontWeight: '500' }}>Taxes & Fees</span>
                <span style={{ color: '#1a1a2e', fontWeight: '600' }}>₹{taxes.toLocaleString()}</span>
              </div>
              <div className="hc-total-row">
                <span>Total Amount Paid</span>
                <span style={{ color: '#e8151b' }}>₹{grandTotal.toLocaleString()}</span>
              </div>
              <div style={{ marginTop: '16px', fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                <ShieldCheck size={14} color="#10b981" /> Payment successful and securely processed
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="hc-btn-group">
            <button className="hc-btn hc-btn-primary" onClick={() => window.print()}>
              <Printer size={18} /> Print Voucher
            </button>
            <button className="hc-btn hc-btn-secondary" onClick={() => navigate('/manage-booking')}>
              <Building2 size={18} /> Manage Booking
            </button>
            <button className="hc-btn hc-btn-secondary" onClick={() => navigate('/')}>
              Home <ChevronRight size={18} />
            </button>
          </div>

        </div>
      </div>
      <FooterOne />
    </>
  );
}
