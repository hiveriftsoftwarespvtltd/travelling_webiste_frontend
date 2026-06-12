import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FooterOne from '../Components/Footer/FooterOne';
import HeaderOne from '../Components/Header/HeaderOne';
import {
  Building2, MapPin, Calendar, Users, Star, ShieldCheck,
  Coffee, User, Phone, Mail, ShieldAlert, Loader2, CheckCircle2,
  ChevronDown, ChevronUp, ArrowLeft, ArrowRight, CreditCard, Info
} from 'lucide-react';

const HOTEL_API = process.env.REACT_APP_HOTEL_API_BASE_URL || 'http://localhost:8009/api/hotel';
const MEAL_TYPES = { 0: 'Room Only', 1: 'Breakfast Included', 2: 'Half Board', 3: 'Full Board', 4: 'All Inclusive' };

function StarRating({ rating }) {
  const stars = Math.round(rating || 0);
  return (
    <span style={{ display: 'inline-flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={13} fill={i <= stars ? '#f59e0b' : 'none'} color={i <= stars ? '#f59e0b' : '#d1d5db'} />
      ))}
    </span>
  );
}

const InputField = ({ label, id, required, children, hint }) => (
  <div style={{ marginBottom: '16px' }}>
    <label htmlFor={id} style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
      {label} {required && <span style={{ color: '#e8151b' }}>*</span>}
    </label>
    {children}
    {hint && <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>{hint}</div>}
  </div>
);

const inputStyle = {
  width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px',
  fontSize: '14px', outline: 'none', fontFamily: "'Inter', sans-serif", boxSizing: 'border-box',
  transition: 'border-color 0.15s', color: '#1a1a2e', background: '#fff'
};

export default function HotelCheckout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [state, setState] = useState(null);
  const [isPreBooking, setIsPreBooking] = useState(true);
  const [preBookData, setPreBookData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [showCancellationPolicy, setShowCancellationPolicy] = useState(false);

  // Guest details
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Build guest rooms from state
  const [guestRooms, setGuestRooms] = useState([]);

  // Initialize from location.state or sessionStorage
  useEffect(() => {
    let s = location.state;
    if (!s || !s.hotel) {
      try {
        const saved = sessionStorage.getItem('hotelCheckoutState');
        if (saved) s = JSON.parse(saved);
      } catch (_) {}
    }
    if (!s || !s.hotel) { navigate('/'); return; }

    try { sessionStorage.setItem('hotelCheckoutState', JSON.stringify(s)); } catch (_) {}
    setState(s);

    // Initialize guestRooms based on rooms & adults count
    const numRooms = s.rooms || 1;
    const adultsPerRoom = Math.ceil((s.adults || 2) / numRooms);
    const rooms = Array.from({ length: numRooms }, (_, ri) => ({
      roomIndex: ri,
      guests: Array.from({ length: adultsPerRoom }, (_, gi) => ({
        guestIndex: gi,
        Title: 'Mr',
        FirstName: '',
        LastName: '',
        Age: 30,
        IsLeadGuest: ri === 0 && gi === 0,
      })),
    }));
    setGuestRooms(rooms);
  }, [location.state, navigate]);

  // Pre-book when state is ready
  useEffect(() => {
    if (!state?.selectedRoom?.BookingCode) {
      setIsPreBooking(false);
      return;
    }

    const doPreBook = async () => {
      setIsPreBooking(true);
      try {
        const res = await fetch(`${HOTEL_API}/pre-book`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            TraceId: state.traceId,
            ResultIndex: Number(state.hotel.ResultIndex),
            HotelCode: state.hotel.HotelCode,
            BookingCode: state.selectedRoom.BookingCode,
            PaymentMode: 'Limit',
            NoOfRooms: state.rooms || 1,
            RoomIndex: state.selectedRoom.RoomIndex,
            RoomTypeCode: state.selectedRoom.RoomTypeCode,
            RoomTypeName: state.selectedRoom.RoomTypeName,
            Price: state.selectedRoom.Price,
          }),
        });
        const data = await res.json();
        const preBook = data?.PreBookResult || data;
        setPreBookData(preBook);

        // Check for price change
        const newRate = preBook?.HotelResult?.Rooms?.[0]?.TotalFare;
        if (newRate && state.selectedRoom.TotalFare && Math.abs(newRate - state.selectedRoom.TotalFare) > 1) {
          setState(prev => ({
            ...prev,
            selectedRoom: { ...prev.selectedRoom, TotalFare: newRate },
          }));
        }
      } catch (err) {
        console.error('PreBook error:', err);
        // Non-fatal — continue with cached price
      } finally {
        setIsPreBooking(false);
      }
    };

    doPreBook();
  }, [state?.selectedRoom?.BookingCode]);

  const updateGuest = (roomIdx, guestIdx, field, value) => {
    setGuestRooms(prev => {
      const updated = prev.map((room, ri) => {
        if (ri !== roomIdx) return room;
        return {
          ...room,
          guests: room.guests.map((g, gi) => {
            if (gi !== guestIdx) return g;
            const updated = { ...g, [field]: value };
            if (field === 'Title') updated.Gender = (value === 'Mr') ? 'Male' : 'Female';
            return updated;
          }),
        };
      });
      return updated;
    });
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setIsBooking(true);
    setErrorMsg('');

    try {
      // Validate
      for (const room of guestRooms) {
        for (const guest of room.guests) {
          if (!guest.FirstName.trim() || !guest.LastName.trim()) {
            throw new Error(`Please fill in First Name and Last Name for all guests.`);
          }
        }
      }
      if (!contactEmail || !contactPhone) {
        throw new Error('Please provide contact email and phone number.');
      }

      // Build HotelRoomsDetails for TBO
      const hotelRoomsDetails = guestRooms.map((room, ri) => {
        const latestRoom = preBookData?.HotelResult?.Rooms?.[0] || state.selectedRoom;
        return {
          RoomIndex: latestRoom?.RoomIndex || ri + 1,
          RoomTypeCode: latestRoom?.RoomTypeCode || state.selectedRoom?.RoomTypeCode || '',
          RoomTypeName: latestRoom?.RoomTypeName || state.selectedRoom?.RoomTypeName || 'Standard Room',
          RatePlanCode: latestRoom?.RatePlanCode || state.selectedRoom?.RatePlanCode || '',
          Price: latestRoom?.Price || state.selectedRoom?.Price || null,
          BedTypeCode: null,
          SmokingPreference: 0,
          Supplements: null,
        HotelPassenger: room.guests.map((g, gi) => ({
          Title: g.Title || 'Mr',
          FirstName: g.FirstName,
          LastName: g.LastName,
          PaxType: 1, // 1 = Adult (simplified)
          LeadPassenger: ri === 0 && gi === 0,
          Age: g.Age || 30,
          Email: contactEmail,
          Phoneno: contactPhone,
          CountryCode: 'IN',
          CountryName: 'India',
        })),
        };
      });

      const bookingCode = preBookData?.HotelResult?.Rooms?.[0]?.BookingCode
        || state.selectedRoom?.BookingCode;

      const res = await fetch(`${HOTEL_API}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          TraceId: state.traceId,
          ResultIndex: Number(state.hotel.ResultIndex),
          HotelCode: state.hotel.HotelCode,
          BookingCode: bookingCode,
          IsVoucherBooking: true,
          GuestNationality: state.GuestNationality || 'IN',
          NetAmount: state.selectedRoom?.TotalFare || 0,
          RequestedBookingMode: 5,
          NoOfRooms: state.rooms || 1,
          HotelRoomsDetails: hotelRoomsDetails,
        }),
      });

      const data = await res.json();
      const bookResult = data?.BookResult || data;
      const bookingId = bookResult?.BookingId || bookResult?.HotelBookingId;

      if (!bookingId && !bookResult?.IsSuccess) {
        const errMsg = bookResult?.Error?.ErrorMessage
          || bookResult?.Status?.Description
          || data?.message || 'Booking failed. Please try again.';
        throw new Error(errMsg);
      }

      // Generate voucher
      let voucherData = null;
      try {
        const vRes = await fetch(`${HOTEL_API}/generate-voucher`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ BookingId: bookingId }),
        });
        voucherData = await vRes.json();
      } catch (_) { /* voucher is non-fatal */ }

      navigate('/hotel-confirmation', {
        state: {
          bookingId,
          bookResult,
          voucherData,
          hotel: state.hotel,
          selectedRoom: state.selectedRoom,
          checkIn: state.checkIn,
          checkOut: state.checkOut,
          rooms: state.rooms,
          adults: state.adults,
          nights: state.nights,
          contactEmail,
          contactPhone,
          leadGuest: guestRooms[0]?.guests[0],
        }
      });
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Booking failed. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  if (!state) return null;

  const hotel = state.hotel || {};
  const room = state.selectedRoom || hotel.Rooms?.[0] || {};
  const nights = state.nights || 1;
  const price = room.TotalFare || hotel.MinPrice || 0;
  const pricePerNight = nights > 0 ? Math.round(price / nights) : price;
  const mealType = MEAL_TYPES[room.MealType] || 'Room Only';
  const taxes = Math.round(price * 0.12); // Approximate 12% GST
  const grandTotal = price + taxes;

  // Cancellation policy text
  const cancelPolicy = preBookData?.HotelResult?.Rooms?.[0]?.CancellationPolicies
    || room.CancellationPolicies || [];

  return (
    <>
      <HeaderOne />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800&display=swap');
        .hco-page { background: #f1f5f9; min-height: 100vh; font-family: 'Inter', sans-serif; padding-top: 80px; }
        .hco-container { max-width: 1200px; margin: 0 auto; padding: 32px 20px 60px; }
        .hco-grid { display: grid; grid-template-columns: 1fr 380px; gap: 28px; }
        @media(max-width: 960px) { .hco-grid { grid-template-columns: 1fr; } }
        .hco-card { background: #fff; border-radius: 18px; padding: 28px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); margin-bottom: 20px; }
        .hco-section-title { font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 700; color: #1a1a2e; margin: 0 0 20px; display: flex; align-items: center; gap: 8px; }
        .hco-hotel-img { width: 100%; height: 200px; object-fit: cover; border-radius: 12px; margin-bottom: 16px; }
        .hco-price-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        .hco-price-row:last-child { border-bottom: none; }
        .hco-price-label { color: #64748b; font-weight: 500; }
        .hco-price-value { color: #1a1a2e; font-weight: 600; }
        .hco-total-row { display: flex; justify-content: space-between; align-items: center; padding: 16px 0 0; border-top: 2px solid #f1f5f9; margin-top: 8px; }
        .hco-total-label { font-family: 'Outfit', sans-serif; font-size: 16px; font-weight: 700; color: #1a1a2e; }
        .hco-total-price { font-family: 'Outfit', sans-serif; font-size: 26px; font-weight: 800; color: #e8151b; }
        .hco-book-btn { width: 100%; padding: 16px; background: linear-gradient(135deg, #e8151b, #c8101a); color: #fff; border: none; border-radius: 14px; font-size: 16px; font-weight: 700; cursor: pointer; font-family: 'Outfit', sans-serif; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.2s; }
        .hco-book-btn:hover:not(:disabled) { box-shadow: 0 8px 30px rgba(232,21,27,0.35); transform: translateY(-2px); }
        .hco-book-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .hco-room-tag { display: inline-flex; align-items: center; gap: 5px; background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 20px; margin-bottom: 8px; }
        .hco-input { width: 100%; padding: 11px 14px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 14px; outline: none; font-family: 'Inter', sans-serif; box-sizing: border-box; transition: border-color 0.15s; color: #1a1a2e; }
        .hco-input:focus { border-color: #e8151b; }
        .hco-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6,9 12,15 18,9'%3E%3C/polyline%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; background-size: 16px; padding-right: 36px; }
        .hco-room-divider { border: none; border-top: 2px dashed #e2e8f0; margin: 24px 0; }
        .hco-guest-header { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; color: #475569; margin-bottom: 16px; }
        .hco-error { background: #fef2f2; border: 1px solid #fee2e2; padding: 16px 20px; border-radius: 12px; color: #b91c1c; font-size: 14px; font-weight: 500; display: flex; gap: 10px; align-items: flex-start; margin-bottom: 20px; }
        .hco-policy-btn { background: none; border: none; color: #0ea5e9; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 4px; padding: 0; }
        .hco-policy-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; margin-top: 10px; font-size: 13px; color: #475569; }
        .hco-secure-badge { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #64748b; justify-content: center; margin-top: 12px; }
        
        /* Responsive Grids */
        .hco-summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px; background: #f8fafc; padding: 16px; border-radius: 12px; }
        .hco-contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .hco-guest-grid { display: grid; grid-template-columns: 120px 1fr 1fr; gap: 12px; margin-bottom: 8px; }
        
        @media(max-width: 600px) {
          .hco-summary-grid { grid-template-columns: 1fr; }
          .hco-contact-grid { grid-template-columns: 1fr; }
          .hco-guest-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="hco-page">
        <div className="hco-container">
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '14px', color: '#64748b' }}>
            <span style={{ cursor: 'pointer', color: '#0ea5e9' }} onClick={() => navigate('/')}>Home</span>
            <span>›</span>
            <span style={{ cursor: 'pointer', color: '#0ea5e9' }} onClick={() => navigate(-1)}>Hotels in {state.cityName}</span>
            <span>›</span>
            <span style={{ color: '#1a1a2e', fontWeight: '600' }}>Checkout</span>
          </div>

          {/* Pre-booking loading overlay */}
          {isPreBooking && (
            <div style={{ background: '#fff', borderRadius: '18px', padding: '40px', textAlign: 'center', marginBottom: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'inline-block', width: '48px', height: '48px', border: '4px solid #f1f5f9', borderTopColor: '#e8151b', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: '16px' }}></div>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '700', fontSize: '18px', color: '#1a1a2e' }}>Confirming Availability...</div>
              <div style={{ color: '#64748b', fontSize: '14px', marginTop: '6px' }}>Fetching latest pricing and room details.</div>
            </div>
          )}

          {!isPreBooking && (
            <form onSubmit={handleBook}>
              <div className="hco-grid">
                {/* ── Left Column ── */}
                <div>
                  {/* Error */}
                  {errorMsg && (
                    <div className="hco-error">
                      <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div><strong>Booking Failed:</strong> {errorMsg}</div>
                    </div>
                  )}

                  {/* Hotel Summary */}
                  <div className="hco-card">
                    <div className="hco-section-title"><Building2 size={20} color="#e8151b" /> Hotel Summary</div>
                    <img
                      src={hotel.HotelPicture && !hotel.HotelPicture.includes('HotelNA') ? hotel.HotelPicture : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&h=300'}
                      alt={hotel.HotelName}
                      className="hco-hotel-img"
                      onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&h=300'; }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '800', fontSize: '20px', color: '#1a1a2e', marginBottom: '4px' }}>{hotel.HotelName}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '13px', marginBottom: '10px' }}>
                          <MapPin size={13} /> {hotel.HotelAddress || state.cityName}
                        </div>
                        <StarRating rating={hotel.HotelRating} />
                      </div>
                      <span className="hco-room-tag"><Coffee size={11} /> {mealType}</span>
                    </div>

                    <div className="hco-summary-grid">
                      <div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>Check-in</div>
                        <div style={{ fontWeight: '700', fontSize: '16px', color: '#1a1a2e' }}>{state.checkIn}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>After 12:00 PM</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>Check-out</div>
                        <div style={{ fontWeight: '700', fontSize: '16px', color: '#1a1a2e' }}>{state.checkOut}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Before 11:00 AM</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>Duration</div>
                        <div style={{ fontWeight: '700', fontSize: '16px', color: '#1a1a2e' }}>{nights} Night{nights > 1 ? 's' : ''}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>Rooms</div>
                        <div style={{ fontWeight: '700', fontSize: '16px', color: '#1a1a2e' }}>{state.rooms} Room · {state.adults} Adult{state.adults > 1 ? 's' : ''}</div>
                      </div>
                    </div>

                    {/* Room type */}
                    <div style={{ marginTop: '16px', padding: '14px', background: '#fffbeb', borderRadius: '10px', border: '1px solid #fde68a' }}>
                      <div style={{ fontWeight: '700', color: '#92400e', fontSize: '14px' }}>📋 {room.RoomTypeName || 'Standard Room'}</div>
                      {room.IsRefundable && (
                        <div style={{ fontSize: '12px', color: '#15803d', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <ShieldCheck size={12} /> Free Cancellation Available
                        </div>
                      )}
                    </div>

                    {/* Cancellation Policy */}
                    {cancelPolicy.length > 0 && (
                      <div style={{ marginTop: '16px' }}>
                        <button type="button" className="hco-policy-btn" onClick={() => setShowCancellationPolicy(p => !p)}>
                          <Info size={14} /> Cancellation Policy
                          {showCancellationPolicy ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                        {showCancellationPolicy && (
                          <div className="hco-policy-box">
                            {cancelPolicy.map((cp, i) => (
                              <div key={i} style={{ marginBottom: '6px' }}>
                                <strong>{cp.FromDate?.split('T')[0]} – {cp.ToDate?.split('T')[0]}:</strong>{' '}
                                {cp.Charge}% cancellation charge
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Contact Details */}
                  <div className="hco-card">
                    <div className="hco-section-title"><Phone size={20} color="#e8151b" /> Contact Details</div>
                    <div className="hco-contact-grid">
                      <InputField label="Email Address" id="contactEmail" required>
                        <input
                          id="contactEmail" type="email" className="hco-input"
                          placeholder="your@email.com" value={contactEmail}
                          onChange={e => setContactEmail(e.target.value)} required
                        />
                      </InputField>
                      <InputField label="Phone Number" id="contactPhone" required>
                        <input
                          id="contactPhone" type="tel" className="hco-input"
                          placeholder="+91 98765 43210" value={contactPhone}
                          onChange={e => setContactPhone(e.target.value)} required
                        />
                      </InputField>
                    </div>
                  </div>

                  {/* Guest Details per Room */}
                  <div className="hco-card">
                    <div className="hco-section-title"><Users size={20} color="#e8151b" /> Guest Details</div>
                    <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#0369a1' }}>
                      <strong>Note:</strong> Names must match your government-issued ID exactly. Lead guest must be 18+ years old.
                    </div>

                    {guestRooms.map((room, ri) => (
                      <div key={ri}>
                        {guestRooms.length > 1 && (
                          <>
                            {ri > 0 && <hr className="hco-room-divider" />}
                            <div className="hco-guest-header">
                              <Building2 size={16} color="#64748b" /> Room {ri + 1}
                            </div>
                          </>
                        )}

                        {room.guests.map((guest, gi) => (
                          <div key={gi}>
                            {room.guests.length > 1 && (
                              <div style={{ fontSize: '13px', fontWeight: '600', color: '#94a3b8', marginBottom: '12px', marginTop: gi > 0 ? '16px' : 0 }}>
                                Guest {gi + 1} {guest.IsLeadGuest ? '(Lead Guest)' : ''}
                              </div>
                            )}
                            <div className="hco-guest-grid">
                              <InputField label="Title" id={`title-${ri}-${gi}`} required>
                                <select
                                  id={`title-${ri}-${gi}`}
                                  className="hco-input hco-select"
                                  value={guest.Title}
                                  onChange={e => updateGuest(ri, gi, 'Title', e.target.value)}
                                >
                                  <option value="Mr">Mr</option>
                                  <option value="Mrs">Mrs</option>
                                  <option value="Ms">Ms</option>
                                  <option value="Dr">Dr</option>
                                </select>
                              </InputField>
                              <InputField label="First Name" id={`fname-${ri}-${gi}`} required>
                                <input
                                  id={`fname-${ri}-${gi}`} type="text" className="hco-input"
                                  placeholder="First name" value={guest.FirstName}
                                  onChange={e => updateGuest(ri, gi, 'FirstName', e.target.value)} required
                                />
                              </InputField>
                              <InputField label="Last Name" id={`lname-${ri}-${gi}`} required>
                                <input
                                  id={`lname-${ri}-${gi}`} type="text" className="hco-input"
                                  placeholder="Last name" value={guest.LastName}
                                  onChange={e => updateGuest(ri, gi, 'LastName', e.target.value)} required
                                />
                              </InputField>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Special Requests */}
                  <div className="hco-card">
                    <div className="hco-section-title"><Info size={20} color="#e8151b" /> Special Requests (Optional)</div>
                    <textarea
                      className="hco-input"
                      rows={3}
                      placeholder="Early check-in, high floor, smoking/non-smoking preference, etc."
                      style={{ resize: 'vertical', minHeight: '80px' }}
                    />
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
                      Special requests are subject to availability and cannot be guaranteed.
                    </div>
                  </div>
                </div>

                {/* ── Right Column (Price Summary + Book) ── */}
                <div>
                  <div className="hco-card" style={{ position: 'sticky', top: '90px' }}>
                    <div className="hco-section-title"><CreditCard size={20} color="#e8151b" /> Price Summary</div>

                    <div className="hco-price-row">
                      <span className="hco-price-label">₹{pricePerNight.toLocaleString()} × {nights} night{nights > 1 ? 's' : ''}</span>
                      <span className="hco-price-value">₹{price.toLocaleString()}</span>
                    </div>
                    <div className="hco-price-row">
                      <span className="hco-price-label">{state.rooms} room{state.rooms > 1 ? 's' : ''} × {nights} nights</span>
                      <span className="hco-price-value" style={{ color: '#10b981' }}>Included</span>
                    </div>
                    <div className="hco-price-row">
                      <span className="hco-price-label">Taxes & Fees (GST ~12%)</span>
                      <span className="hco-price-value">₹{taxes.toLocaleString()}</span>
                    </div>
                    <div className="hco-total-row">
                      <span className="hco-total-label">Total Amount</span>
                      <span className="hco-total-price">₹{grandTotal.toLocaleString()}</span>
                    </div>

                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px', marginTop: '16px', marginBottom: '20px', fontSize: '13px', color: '#15803d' }}>
                      ✅ <strong>No hidden charges.</strong> The amount above is the total you'll pay.
                    </div>

                    <button type="submit" className="hco-book-btn" disabled={isBooking}>
                      {isBooking ? (
                        <><div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }}></div> Booking...</>
                      ) : (
                        <><CreditCard size={18} /> Confirm & Book · ₹{grandTotal.toLocaleString()}</>
                      )}
                    </button>

                    <div className="hco-secure-badge">
                      <ShieldCheck size={14} color="#10b981" /> Secure 256-bit encrypted booking
                    </div>

                    <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                      <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.6' }}>
                        By clicking "Confirm & Book" you agree to our{' '}
                        <span style={{ color: '#0ea5e9', cursor: 'pointer' }} onClick={() => navigate('/terms-booking-policies')}>Terms & Conditions</span>
                        {' '}and{' '}
                        <span style={{ color: '#0ea5e9', cursor: 'pointer' }} onClick={() => navigate('/privacy-policy')}>Privacy Policy</span>.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      <FooterOne />
    </>
  );
}
