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

  const bookingStatusDesc = bookResult?.Status?.Description || 'Confirmed';
  const tboStatus = bookResult?.HotelBookingStatus || 'Confirmed';

  const isFailed = bookingStatusDesc.toLowerCase().includes('fail') || tboStatus === 'Failed' || tboStatus === 'Rejected';
  const isPending = tboStatus === 'Pending' || bookingStatusDesc.toLowerCase().includes('pending');
  const isConfirmed = !isFailed && !isPending;

  const confirmationNo = bookResult?.ConfirmationNo || voucherData?.Voucher?.ConfirmationNo || (isPending ? 'Pending from Hotel' : 'N/A');
  const price = selectedRoom?.TotalFare || hotel?.MinPrice || 0;
  const taxes = Math.round(price * 0.12);
  const grandTotal = price + taxes;

  // Banner styles based on status
  let bannerBg = 'linear-gradient(135deg, #0f766e 0%, #115e59 100%)';
  let bannerIcon = <CheckCircle2 size={44} color="#fff" strokeWidth={2.5} />;
  let bannerTitle = 'Booking Confirmed';
  let bannerDesc = `Your hotel reservation is confirmed. A copy has been sent to ${contactEmail}`;

  if (isFailed) {
    bannerBg = 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)';
    bannerIcon = <span style={{fontSize: '44px'}}>❌</span>;
    bannerTitle = 'Booking Could Not Be Confirmed';
    bannerDesc = 'Your payment was successful but the booking could not be confirmed. A full refund has been initiated and will reflect in 5-7 business days.';
  } else if (isPending) {
    bannerBg = 'linear-gradient(135deg, #b45309 0%, #92400e 100%)';
    bannerIcon = <span style={{fontSize: '44px'}}>⏳</span>;
    bannerTitle = 'Booking Under Process';
    bannerDesc = 'Your payment was successful. We are waiting for final confirmation from the hotel supplier.';
  }

  return (
    <>
      <HeaderOne />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800&display=swap');
        .hc-page { background: #f8fafc; min-height: 100vh; font-family: 'Inter', sans-serif; padding-top: 80px; padding-bottom: 60px; }
        .hc-container { max-width: 900px; margin: 0 auto; padding: 0 20px; }
        
        .hc-banner { background: linear-gradient(135deg, #0f766e 0%, #115e59 100%); border-radius: 20px; padding: 32px 40px; color: #fff; text-align: center; margin-top: 16px; margin-bottom: 24px; box-shadow: 0 12px 32px rgba(15,118,110,0.15); position: relative; overflow: hidden; }
        .hc-banner::after { content: ''; position: absolute; top: 0; right: 0; bottom: 0; left: 0; background: url('data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="2" cy="2" r="1.5" fill="rgba(255,255,255,0.06)"/></svg>') repeat; pointer-events: none; }
        .hc-banner-icon { width: 60px; height: 60px; background: rgba(255,255,255,0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; position: relative; z-index: 2; border: 1px solid rgba(255,255,255,0.2); }
        .hc-banner h1 { font-family: 'Outfit', sans-serif; font-size: clamp(1.8rem, 3vw, 2.2rem); font-weight: 800; margin: 0 0 8px; position: relative; z-index: 2; letter-spacing: -0.5px; }
        .hc-banner p { font-size: 15px; color: rgba(255,255,255,0.85); margin: 0; position: relative; z-index: 2; font-weight: 400; max-width: 600px; margin: 0 auto; line-height: 1.5; }
        
        .hc-main-card { background: #fff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 24px rgba(0,0,0,0.02); margin-bottom: 24px; border: 1px solid #f1f5f9; }
        .hc-section { margin-bottom: 32px; padding-bottom: 32px; border-bottom: 1px dashed #e2e8f0; }
        .hc-section:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
        
        .hc-section-title { font-family: 'Outfit', sans-serif; font-size: 19px; font-weight: 700; color: #0f172a; margin: 0 0 24px; display: flex; align-items: center; gap: 12px; }
        
        .hc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
        @media(max-width: 600px) { .hc-grid { grid-template-columns: 1fr; } }
        
        .hc-detail-group { display: flex; flex-direction: column; gap: 6px; }
        .hc-detail-label { font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.8px; }
        .hc-detail-val { font-size: 15px; font-weight: 600; color: #1e293b; }
        
        .hc-hotel-box { display: flex; gap: 24px; background: #fff; padding: 20px; border-radius: 12px; border: 1px solid #f1f5f9; align-items: center; }
        .hc-hotel-img { width: 110px; height: 110px; border-radius: 8px; object-fit: cover; flex-shrink: 0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        
        .hc-price-row { display: flex; justify-content: space-between; padding: 14px 0; border-bottom: 1px dashed #e2e8f0; font-size: 14px; }
        .hc-price-row:last-child { border-bottom: none; }
        .hc-total-row { display: flex; justify-content: space-between; padding-top: 20px; margin-top: 10px; border-top: 2px solid #f1f5f9; font-family: 'Outfit', sans-serif; font-size: 22px; font-weight: 800; color: #0f172a; }
        
        .hc-btn-group { display: flex; gap: 16px; margin-top: 40px; justify-content: center; flex-wrap: wrap; }
        .hc-btn { display: flex; align-items: center; gap: 8px; padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; font-family: 'Inter', sans-serif; border: none; }
        .hc-btn-primary { background: #0f172a; color: #fff; box-shadow: 0 4px 12px rgba(15,23,42,0.15); }
        .hc-btn-primary:hover { background: #1e293b; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(15,23,42,0.2); }
        .hc-btn-secondary { background: #fff; color: #334155; border: 1px solid #cbd5e1; }
        .hc-btn-secondary:hover { background: #f8fafc; border-color: #94a3b8; }

        .hc-ref-grid { display: flex; justify-content: space-around; flex-wrap: wrap; gap: 24px; }
        .hc-ref-item { text-align: center; flex: 1; min-width: 200px; }
        .hc-ref-label { font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
        .hc-ref-val { font-size: 26px; font-family: 'Outfit', sans-serif; font-weight: 800; color: #0f172a; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .hc-ref-divider { width: 1px; background: #e2e8f0; min-height: 50px; }
      `}</style>
      
      <div className="hc-page">
        <div className="hc-container">
          
          {/* Success / Failure / Pending Banner */}
          <div className="hc-banner" style={{ background: bannerBg }}>
            <div className="hc-banner-icon">
              {bannerIcon}
            </div>
            <h1>{bannerTitle}</h1>
            <p>{bannerDesc}</p>
          </div>

          {/* Main Content Box */}
          <div className="hc-main-card">
            
            {/* Booking Reference Details */}
            <div className="hc-section hc-ref-grid">
              <div className="hc-ref-item">
                <div className="hc-ref-label">TBO Booking ID</div>
                <div className="hc-ref-val">
                  <span style={{ color: '#94a3b8', fontSize: '20px', fontWeight: '400' }}>#</span> {bookingId}
                </div>
              </div>
              <div className="hc-ref-divider"></div>
              <div className="hc-ref-item">
                <div className="hc-ref-label">Hotel Confirmation No.</div>
                <div className="hc-ref-val">
                  {confirmationNo}
                </div>
              </div>
            </div>

            {/* Hotel Details */}
            <div className="hc-section">
              <div className="hc-section-title"><Building2 size={20} color="#0f766e" /> Hotel Details</div>
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
            <div className="hc-section">
              <div className="hc-section-title"><Users size={20} color="#8b5cf6" /> Guest Details</div>
              
              {/* All Guests List */}
              <div style={{ marginBottom: '24px' }}>
                <span className="hc-detail-label" style={{ display: 'block', marginBottom: '12px' }}>Guest Names</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                  {(state.guestRooms ? state.guestRooms.flatMap(r => r.guests) : [leadGuest]).map((p, idx) => p && (
                    <div key={idx} className="hc-detail-val" style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>{idx + 1}</div>
                      <div>
                        <div>{p.Title} {p.FirstName} {p.LastName}</div>
                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>{p.Age} Years</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hc-grid">
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
            <div className="hc-section">
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

          </div>

          {/* Action Buttons */}
          <div className="hc-btn-group">
            {isConfirmed && (
              <button className="hc-btn hc-btn-primary" onClick={() => window.print()}>
                <Printer size={18} /> Print Voucher
              </button>
            )}
            <button className="hc-btn hc-btn-secondary" onClick={() => navigate('/hotel-bookings')}>
              <Building2 size={18} /> My Bookings
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
