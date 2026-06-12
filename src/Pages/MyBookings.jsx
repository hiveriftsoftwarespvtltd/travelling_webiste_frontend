import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderOne from '../Components/Header/HeaderOne';
import FooterOne from '../Components/Footer/FooterOne';
import { Search, MapPin, Calendar, Users, Building2, Download, XCircle, AlertCircle, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';

const HOTEL_API = process.env.REACT_APP_HOTEL_API_BASE_URL || 'http://localhost:8009/api/hotel';

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookingId, setBookingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Cancellation States
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  const fetchBookingDetail = async (e) => {
    if (e) e.preventDefault();
    if (!bookingId.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setBookingData(null);
    try {
      const res = await fetch(`${HOTEL_API}/booking-detail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ BookingId: bookingId.trim() }),
      });
      const data = await res.json();
      
      const bData = data?.HotelBookingDetailResponse || data;

      if (!bData || bData.Status?.Code !== 1 && bData.Status?.Code !== 200) {
        throw new Error(bData?.Status?.Description || 'Could not find booking with this ID.');
      }
      setBookingData(bData.BookingDetail);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to fetch booking details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadVoucher = async () => {
    try {
      const res = await fetch(`${HOTEL_API}/generate-voucher`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ BookingId: bookingData?.BookingId }),
      });
      const data = await res.json();
      const voucherUrl = data?.GenerateVoucherResult?.VoucherUrl || data?.VoucherUrl;
      if (voucherUrl) {
        window.open(voucherUrl, '_blank');
      } else {
        alert('Voucher not available yet or could not be generated.');
      }
    } catch (err) {
      alert('Failed to generate voucher. Please try again.');
    }
  };

  const handleCancelBooking = async () => {
    setIsCancelling(true);
    try {
      const res = await fetch(`${HOTEL_API}/cancel-booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          BookingId: bookingData?.BookingId,
          RequestType: 1, // Cancellation
          Remarks: cancelReason || 'Customer requested cancellation',
        }),
      });
      const data = await res.json();
      
      const statusRes = data?.HotelChangeRequestStatusResult || data;
      if (statusRes?.Status?.Code === 1 || statusRes?.Status?.Code === 200) {
        alert('Cancellation request submitted successfully. It may take some time to process.');
        setShowCancelModal(false);
        fetchBookingDetail(); // refresh data
      } else {
        throw new Error(statusRes?.Status?.Description || 'Cancellation failed.');
      }
    } catch (err) {
      alert(err.message || 'Failed to submit cancellation request.');
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusBadge = (statusId) => {
    switch (statusId) {
      case 1: return <span className="mb-badge confirmed"><CheckCircle2 size={12}/> Confirmed</span>;
      case 2: return <span className="mb-badge cancelled"><XCircle size={12}/> Cancelled</span>;
      case 3: return <span className="mb-badge pending"><AlertCircle size={12}/> Pending / Processing</span>;
      default: return <span className="mb-badge pending">Status ID: {statusId}</span>;
    }
  };

  return (
    <>
      <HeaderOne />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800&display=swap');
        .mb-page { background: #f1f5f9; min-height: 100vh; font-family: 'Inter', sans-serif; padding-top: 80px; padding-bottom: 60px; }
        .mb-container { max-width: 900px; margin: 0 auto; padding: 0 20px; }
        
        .mb-search-box { background: #fff; border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); margin-bottom: 24px; text-align: center; }
        .mb-title { font-family: 'Outfit', sans-serif; font-size: 28px; font-weight: 800; color: #1a1a2e; margin-bottom: 12px; }
        
        .mb-input-group { display: flex; max-width: 500px; margin: 24px auto 0; gap: 12px; position: relative; }
        .mb-input { flex: 1; padding: 14px 16px 14px 44px; border: 1.5px solid #e2e8f0; border-radius: 12px; font-size: 15px; outline: none; font-family: 'Inter', sans-serif; box-shadow: 0 2px 8px rgba(0,0,0,0.02); transition: border-color 0.2s; }
        .mb-input:focus { border-color: #e8151b; }
        .mb-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
        .mb-btn { background: #1a1a2e; color: #fff; border: none; border-radius: 12px; padding: 0 24px; font-size: 15px; font-weight: 700; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; gap: 8px; }
        .mb-btn:hover { background: #2a2a4a; }
        
        .mb-card { background: #fff; border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); margin-bottom: 24px; }
        .mb-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid #f1f5f9; }
        .mb-hotel-name { font-family: 'Outfit', sans-serif; font-size: 22px; font-weight: 800; color: #1a1a2e; margin-bottom: 8px; }
        .mb-address { display: flex; align-items: center; gap: 6px; color: #64748b; font-size: 14px; }
        
        .mb-badge { display: inline-flex; align-items: center; gap: 4px; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; }
        .mb-badge.confirmed { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
        .mb-badge.cancelled { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
        .mb-badge.pending { background: #fef9c3; color: #854d0e; border: 1px solid #fde047; }
        
        .mb-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .mb-info-box { background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #f1f5f9; }
        .mb-info-label { font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; margin-bottom: 6px; }
        .mb-info-val { font-size: 15px; color: #1a1a2e; font-weight: 600; display: flex; align-items: center; gap: 8px; }
        
        .mb-actions { display: flex; gap: 16px; margin-top: 24px; padding-top: 24px; border-top: 1px solid #f1f5f9; }
        .mb-action-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 14px; border-radius: 12px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; font-family: 'Inter', sans-serif; }
        .mb-action-btn.primary { background: #10b981; color: #fff; border: none; }
        .mb-action-btn.primary:hover { background: #059669; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(16,185,129,0.3); }
        .mb-action-btn.danger { background: #fff; color: #e8151b; border: 1px solid #e8151b; }
        .mb-action-btn.danger:hover { background: #fff5f5; }

        /* Modal */
        .mb-modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.6); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 20px; }
        .mb-modal { background: #fff; width: 100%; max-width: 480px; border-radius: 20px; padding: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
        .mb-modal h3 { font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 700; color: #1a1a2e; margin-bottom: 12px; }
        .mb-textarea { width: 100%; padding: 12px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-family: 'Inter', sans-serif; font-size: 14px; min-height: 100px; resize: vertical; margin: 16px 0; outline: none; box-sizing: border-box; }
        .mb-textarea:focus { border-color: #e8151b; }
      `}</style>

      <div className="mb-page">
        <div className="mb-container">
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '14px', color: '#64748b' }}>
            <span style={{ cursor: 'pointer', color: '#0ea5e9' }} onClick={() => navigate('/')}>Home</span>
            <span>›</span>
            <span style={{ color: '#1a1a2e', fontWeight: '600' }}>My Bookings</span>
          </div>

          <div className="mb-search-box">
            <h1 className="mb-title">Find Your Booking</h1>
            <p style={{ color: '#64748b', fontSize: '15px' }}>Enter your TBO Booking ID to view details, download vouchers, or request cancellations.</p>
            
            <form onSubmit={fetchBookingDetail} className="mb-input-group">
              <Search size={20} className="mb-search-icon" />
              <input
                type="text"
                className="mb-input"
                placeholder="e.g. TBOH-12345678"
                value={bookingId}
                onChange={e => setBookingId(e.target.value)}
                required
              />
              <button type="submit" className="mb-btn" disabled={loading}>
                {loading ? <Loader2 size={18} className="spin" /> : 'Track Booking'}
              </button>
            </form>
            {errorMsg && (
              <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginTop: '16px', fontSize: '14px', fontWeight: '500' }}>
                {errorMsg}
              </div>
            )}
          </div>

          {bookingData && (
            <div className="mb-card">
              <div className="mb-header">
                <div>
                  <h2 className="mb-hotel-name">{bookingData.HotelName}</h2>
                  <div className="mb-address">
                    <MapPin size={16} color="#e8151b" /> {bookingData.City || 'Hotel Location'}
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>
                    <strong>Booking ID:</strong> {bookingData.BookingId}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {getStatusBadge(bookingData.BookingStatus)}
                  <div style={{ marginTop: '8px', fontSize: '14px', color: '#475569', fontWeight: '600' }}>
                    Reference: {bookingData.BookingRefNo || bookingData.BookingReferenceNo || 'N/A'}
                  </div>
                </div>
              </div>

              <div className="mb-grid">
                <div className="mb-info-box">
                  <div className="mb-info-label">Check-in</div>
                  <div className="mb-info-val"><Calendar size={18} color="#e8151b"/> {bookingData.CheckInDate?.split('T')[0]}</div>
                </div>
                <div className="mb-info-box">
                  <div className="mb-info-label">Check-out</div>
                  <div className="mb-info-val"><Calendar size={18} color="#e8151b"/> {bookingData.CheckOutDate?.split('T')[0]}</div>
                </div>
                <div className="mb-info-box">
                  <div className="mb-info-label">Guest Details</div>
                  <div className="mb-info-val">
                    <Users size={18} color="#e8151b"/> 
                    {bookingData.HotelRoomsDetails?.[0]?.HotelPassenger?.[0]?.FirstName || 'Lead Guest'} 
                    {bookingData.HotelRoomsDetails?.[0]?.HotelPassenger?.[0]?.LastName || ''}
                  </div>
                </div>
                <div className="mb-info-box">
                  <div className="mb-info-label">Rooms</div>
                  <div className="mb-info-val"><Building2 size={18} color="#e8151b"/> {bookingData.NoOfRooms || bookingData.HotelRoomsDetails?.length || 1} Room(s)</div>
                </div>
              </div>

              <div className="mb-actions">
                <button className="mb-action-btn primary" onClick={handleDownloadVoucher}>
                  <Download size={18} /> Download Voucher
                </button>
                {bookingData.BookingStatus !== 2 && ( // Not already cancelled
                  <button className="mb-action-btn danger" onClick={() => setShowCancelModal(true)}>
                    <XCircle size={18} /> Cancel Booking
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {showCancelModal && (
        <div className="mb-modal-overlay">
          <div className="mb-modal">
            <h3>Cancel Booking</h3>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.5' }}>
              Are you sure you want to cancel your booking for <strong>{bookingData.HotelName}</strong>? Cancellation charges may apply as per the hotel's policy.
            </p>
            <textarea
              className="mb-textarea"
              placeholder="Reason for cancellation (optional)"
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowCancelModal(false)} style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}>Keep Booking</button>
              <button onClick={handleCancelBooking} disabled={isCancelling} style={{ flex: 1, padding: '12px', background: '#e8151b', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {isCancelling ? <Loader2 size={16} className="spin" /> : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}

      <FooterOne />
    </>
  );
}
