import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FooterOne from '../Components/Footer/FooterOne';

import {
  Building2, MapPin, Calendar, Users, Star, ShieldCheck,
  Coffee, User, Phone, Mail, ShieldAlert, Loader2, CheckCircle2,
  ChevronDown, ChevronUp, ArrowLeft, ArrowRight, CreditCard, Info, Plane
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
  const [paymentStatus, setPaymentStatus] = useState('idle'); // 'idle' | 'paying' | 'verifying' | 'booking'
  const [showCancellationPolicy, setShowCancellationPolicy] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Prevent refresh during booking
  useEffect(() => {
    if (paymentStatus === 'booking') {
      const handleBeforeUnload = (e) => {
        e.preventDefault();
        e.returnValue = '';
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [paymentStatus]);

  // Load Razorpay checkout script dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Guest details
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactCountryCode, setContactCountryCode] = useState('+91');
  const [passportNumber, setPassportNumber] = useState('');
  
  const [isCorporateBooking, setIsCorporateBooking] = useState(false);
  const [gstName, setGstName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [gstAddress, setGstAddress] = useState('');
  const [gstPhone, setGstPhone] = useState('');
  const [gstEmail, setGstEmail] = useState('');

  const [arrType, setArrType] = useState('0');
  const [arrInfoId, setArrInfoId] = useState('');
  const [arrTime, setArrTime] = useState('');
  const [depType, setDepType] = useState('0');
  const [depInfoId, setDepInfoId] = useState('');
  const [depTime, setDepTime] = useState('');

  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);
  const [priceChangedAlert, setPriceChangedAlert] = useState(false);

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

    // Initialize guestRooms based on rooms, adults & children count
    const numRooms = s.rooms || 1;
    const totalAdults = s.adults || 2;
    const totalChildren = s.children || 0;
    const childrenAges = s.childrenAges || [];
    
    let ageIndexCounter = 0;
    
    const rooms = Array.from({ length: numRooms }, (_, ri) => {
      let adultsInRoom = Math.floor(totalAdults / numRooms);
      if (ri < totalAdults % numRooms) adultsInRoom += 1;
      
      let childrenInRoom = Math.floor(totalChildren / numRooms);
      if (ri < totalChildren % numRooms) childrenInRoom += 1;
      
      const guests = [];
      
      for(let gi=0; gi<adultsInRoom; gi++) {
         guests.push({
            guestIndex: guests.length,
            Title: 'Mr',
            FirstName: '',
            LastName: '',
            Age: 30,
            PaxType: 1, // Adult
            IsLeadGuest: ri === 0 && gi === 0,
            PAN: ''
         });
      }
      
      for(let ci=0; ci<childrenInRoom; ci++) {
         guests.push({
            guestIndex: guests.length,
            Title: 'Mstr',
            FirstName: '',
            LastName: '',
            Age: childrenAges[ageIndexCounter] || 5,
            PaxType: 2, // Child
            IsLeadGuest: false
         });
         ageIndexCounter++;
      }
      
      return { roomIndex: ri, guests };
    });
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
        const newRate = preBook?.HotelResult?.[0]?.Rooms?.[0]?.TotalFare;
        if (newRate && state.selectedRoom.TotalFare && Math.abs(newRate - state.selectedRoom.TotalFare) > 1) {
          setState(prev => ({
            ...prev,
            selectedRoom: { ...prev.selectedRoom, TotalFare: newRate },
          }));
          setPriceChangedAlert(true);
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

    if (!localStorage.getItem('token')) {
        setShowLoginPrompt(true);
        return;
    }

    setIsBooking(true);
    setPaymentStatus('idle');
    setErrorMsg('');

    try {
      // Validate Nationality for International Destinations
      const destinationCountry = state?.hotel?.CountryCode || 'IN';
      const guestNationality = state.GuestNationality || 'IN';
      if (destinationCountry !== 'IN' && guestNationality !== 'IN') {
         throw new Error('For international destinations, only Indian nationality is allowed as per TBO hotel policies.');
      }

      // Validate
      const isPanMandatory = preBookData?.ValidationInfo?.PanMandatory;
      if (isPanMandatory) {
        const panCountReq = preBookData?.ValidationInfo?.PanCountRequired || 1;
        const uniquePans = new Set();
        guestRooms.forEach(room => {
          room.guests.forEach(g => {
            if (g.PaxType === 1 && g.PAN?.trim()) {
              uniquePans.add(g.PAN.trim().toUpperCase());
            }
          });
        });
        if (uniquePans.size < panCountReq) {
          throw new Error(`This booking requires at least ${panCountReq} unique PAN card(s). Please provide them for adult guests.`);
        }
      }
      const isPassportMandatory = preBookData?.ValidationInfo?.PassportMandatory;
      if (isPassportMandatory && !passportNumber.trim()) {
        throw new Error('Passport Number is mandatory for this international booking.');
      }

      const guestNames = new Set();
      for (const room of guestRooms) {
        for (const guest of room.guests) {
          const fName = guest.FirstName.trim();
          const lName = guest.LastName.trim();
          if (!fName || !lName) {
            throw new Error(`Please fill in First Name and Last Name for all guests.`);
          }
          
          const fullName = `${fName} ${lName}`.toLowerCase();
          if (preBookData?.ValidationInfo?.SamePaxNameAllowed === false) {
             if (guestNames.has(fullName)) {
                throw new Error(`Duplicate guest name found: ${fName} ${lName}. The hotel does not allow guests to have exactly the same name.`);
             }
             guestNames.add(fullName);
          }

          if (preBookData?.ValidationInfo?.SpaceAllowed === false) {
             if (/\s/.test(fName) || /\s/.test(lName)) {
                throw new Error(`Spaces are not allowed in passenger names for this hotel. Please correct: ${fName} ${lName}`);
             }
          }

          if (preBookData?.ValidationInfo?.SpecialCharAllowed === false) {
             const specialCharRegex = /[^a-zA-Z0-9\s]/;
             if (specialCharRegex.test(fName) || specialCharRegex.test(lName)) {
                throw new Error(`Special characters are not allowed in passenger names for this hotel. Please correct: ${fName} ${lName}`);
             }
          }

          if (preBookData?.ValidationInfo?.CharLimit) {
             const minL = preBookData?.ValidationInfo?.PaxNameMinLength || 1;
             const maxL = preBookData?.ValidationInfo?.PaxNameMaxLength || 50;
             if (fName.length < minL || fName.length > maxL || lName.length < minL || lName.length > maxL) {
                throw new Error(`Names must be between ${minL} and ${maxL} characters long. Please correct: ${fName} ${lName}`);
             }
          }
        }
      }
      if (!contactEmail || !contactPhone) {
        throw new Error('Please provide contact email and phone number.');
      }

      if (preBookData?.ValidationInfo?.IsPackageDetailsMandatory) {
        if (!arrInfoId || !arrTime) throw new Error('Arrival transport details are mandatory for this package fare.');
      }
      if (preBookData?.ValidationInfo?.DepartureDetailsMandatory) {
        if (!depInfoId || !depTime) throw new Error('Departure transport details are mandatory for this package fare.');
      }
      if (contactPhone.length < 10) {
        throw new Error('Please enter a valid phone number (minimum 10 digits).');
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactEmail)) {
        throw new Error('Please enter a valid email address.');
      }

      // Calculate total amount to pay
      const amountToPay = preBookData?.HotelResult?.[0]?.Rooms?.[0]?.TotalFare || state.selectedRoom?.TotalFare || state.hotel?.Rooms?.[0]?.TotalFare || 0;

      // ─── STEP 1: Create Razorpay Order on Backend ───────────────────────────
      setPaymentStatus('paying');
      const backendBase = HOTEL_API.substring(0, HOTEL_API.lastIndexOf('/')); // → http://localhost:8009/api
      const paymentApiBase = `${backendBase}/payment`;

      const orderRes = await fetch(`${paymentApiBase}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountToPay,
          receipt: `JIYOLIFE-HOTEL-${Date.now()}`,
          currency: 'INR',
        }),
      });
      const orderData = await orderRes.json();

      if (!orderData.success || !orderData.orderId) {
        throw new Error(orderData.message || 'Failed to create payment order. Please try again.');
      }

      // ─── STEP 2: Open Razorpay Payment Modal ────────────────────────────────
      await new Promise((resolve, reject) => {
        if (!window.Razorpay) {
          reject(new Error('Razorpay SDK failed to load. Please refresh the page and try again.'));
          return;
        }

        const rzpOptions = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'Jiyo Life Travel',
          description: `Hotel Booking — ${state.hotel?.HotelName}`,
          order_id: orderData.orderId,
          prefill: {
            name: `${guestRooms[0]?.guests[0]?.FirstName || ''} ${guestRooms[0]?.guests[0]?.LastName || ''}`.trim(),
            email: contactEmail,
            contact: contactCountryCode + contactPhone,
          },
          theme: {
            color: '#e8151b',
          },
          config: {
            display: {
              blocks: {
                banks: { name: 'Pay via Net Banking', instruments: [{ method: 'netbanking' }] },
                upi:   { name: 'Pay via UPI', instruments: [{ method: 'upi' }] },
                card:  { name: 'Pay via Card', instruments: [{ method: 'card' }] },
                wallet:{ name: 'Pay via Wallet', instruments: [{ method: 'wallet' }] },
              },
              sequence: ['block.upi', 'block.card', 'block.banks', 'block.wallet'],
              preferences: { show_default_blocks: true },
            },
          },
          handler: async (response) => {
            try {
              setPaymentStatus('verifying');
              const verifyRes = await fetch(`${paymentApiBase}/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });
              const verifyData = await verifyRes.json();
              if (verifyData.success) {
                resolve(verifyData);
              } else {
                reject(new Error('Payment verification failed. Your money is safe and will be refunded.'));
              }
            } catch (err) {
              reject(new Error('Payment verification error: ' + err.message));
            }
          },
          modal: {
            ondismiss: () => {
              reject(new Error('Payment was cancelled. Your booking was not confirmed.'));
            },
          },
        };

        const rzp = new window.Razorpay(rzpOptions);
        rzp.on('payment.failed', (response) => {
          reject(new Error(`Payment failed: ${response.error?.description || 'Unknown error'}. Please try again.`));
        });
        rzp.open();
      });

      // ─── STEP 3: Payment Verified — Run TBO Booking ─────────────────────────
      setPaymentStatus('booking');

      // Build HotelRoomsDetails for TBO
      const hotelRoomsDetails = guestRooms.map((room, ri) => {
        const latestRoom = preBookData?.HotelResult?.[0]?.Rooms?.[0] || state.selectedRoom;
        return {
          RoomIndex: latestRoom?.RoomIndex || ri + 1,
          RoomTypeCode: latestRoom?.RoomTypeCode || state.selectedRoom?.RoomTypeCode || '',
          RoomTypeName: latestRoom?.RoomTypeName || state.selectedRoom?.RoomTypeName || 'Standard Room',
          RatePlanCode: latestRoom?.RatePlanCode || state.selectedRoom?.RatePlanCode || '',
          Price: latestRoom?.Price || state.selectedRoom?.Price || null,
          BedTypeCode: null,
          SmokingPreference: 0,
          Supplements: null,
        HotelPassenger: room.guests.map((g, gi) => {
          const isLead = ri === 0 && gi === 0;
          return {
            Title: g.Title || 'Mr',
            FirstName: g.FirstName,
            LastName: g.LastName,
            PaxType: g.PaxType || 1, // Dynamic PaxType
            LeadPassenger: isLead,
            Age: g.Age || 30,
            Email: contactEmail,
            Phoneno: contactPhone,
            CountryCode: 'IN',
            CountryName: 'India',
            ...(g.PAN ? { PAN: g.PAN } : {}),
            ...(isLead && passportNumber ? { PassportNo: passportNumber } : {}),
            ...(isLead && isCorporateBooking && preBookData?.ValidationInfo?.GSTAllowed ? {
              GSTCompanyAddress: gstAddress,
              GSTCompanyContactNumber: gstPhone,
              GSTCompanyName: gstName,
              GSTNumber: gstNumber,
              GSTCompanyEmail: gstEmail
            } : {})
          };
        }),
        };
      });

      const bookingCode = preBookData?.HotelResult?.[0]?.Rooms?.[0]?.BookingCode
        || state.selectedRoom?.BookingCode;

      const userDataStr = localStorage.getItem("user");
      let loggedInUserId = '';
      let loggedInEmail = '';
      if (userDataStr) {
          try {
              const parsedUser = JSON.parse(userDataStr);
              loggedInUserId = parsedUser._id || '';
              loggedInEmail = parsedUser.email || '';
          } catch(e) {}
      }

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
          NetAmount: preBookData?.HotelResult?.[0]?.Rooms?.[0]?.NetAmount || state.selectedRoom?.NetAmount || state.selectedRoom?.TotalFare || 0,
          RequestedBookingMode: 5,
          NoOfRooms: state.rooms || 1,
          HotelRoomsDetails: hotelRoomsDetails,
          IsCorporate: isCorporateBooking,
          ...(preBookData?.ValidationInfo?.IsPackageFare ? { IsPackageFare: true } : {}),
          ...(preBookData?.ValidationInfo?.IsPackageDetailsMandatory ? {
            ArrivalTransport: {
              ArrivalTransportType: parseInt(arrType),
              TransportInfoId: arrInfoId,
              Time: arrTime
            }
          } : {}),
          ...(preBookData?.ValidationInfo?.DepartureDetailsMandatory ? {
            DepartureTransport: {
              DepartureTransportType: parseInt(depType),
              TransportInfoId: depInfoId,
              Time: depTime
            }
          } : {}),
          userId: loggedInUserId,
          email: loggedInEmail,
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
      const message = err.message || 'Booking failed. Please try again.';
      // If payment was verified but booking failed, reassure the user
      if (paymentStatus === 'booking') {
        setErrorMsg(`Your payment was successful, but the hotel booking failed at the supplier: ${message}. Your money is safe and will be automatically refunded within 5-7 business days.`);
      } else {
        setErrorMsg(message);
      }
    } finally {
      setIsBooking(false);
      setPaymentStatus('idle');
    }
  };

  if (!state) return null;

  const hotel = state.hotel || {};
  const room = state.selectedRoom || hotel.Rooms?.[0] || {};
  const nights = state.nights || 1;
  const grandTotal = preBookData?.HotelResult?.[0]?.Rooms?.[0]?.TotalFare || room.TotalFare || hotel.MinPrice || 0;
  const taxes = preBookData?.HotelResult?.[0]?.Rooms?.[0]?.TotalTax || room.TotalTax || 0;
  const price = grandTotal - taxes;
  const pricePerNight = nights > 0 ? (price / nights) : price;
  const mealType = MEAL_TYPES[room.MealType] || 'Room Only';

  // Cancellation policy text
  const cancelPolicy = preBookData?.HotelResult?.[0]?.Rooms?.[0]?.CancellationPolicies
    || room.CancellationPolicies || [];

  return (
    <>
      {paymentStatus === 'booking' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#fff', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '80px', height: '80px', border: '6px solid #f1f5f9', borderTopColor: '#e8151b', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '32px' }}></div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '28px', color: '#1a1a2e', marginBottom: '12px' }}>Confirming Your Booking</h2>
          <p style={{ color: '#64748b', fontSize: '16px', maxWidth: '450px', textAlign: 'center', lineHeight: '1.6' }}>
            Your payment was successful. Please wait while we securely confirm your reservation with the hotel supplier.<br/><br/>
            <strong style={{ color: '#e8151b' }}>Do not refresh the page or press back.</strong>
          </p>
        </div>
      )}


      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800&display=swap');
        .hco-page { background: #f1f5f9; min-height: 100vh; font-family: 'Inter', sans-serif; padding-top: 20px; }
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
        .hco-hotel-name-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
        
        @media(max-width: 960px) {
          .hco-grid { grid-template-columns: 1fr; }
        }

        @media(max-width: 600px) {
          .hco-summary-grid { grid-template-columns: 1fr; }
          .hco-contact-grid { grid-template-columns: 1fr; }
          .hco-guest-grid { grid-template-columns: 100px 1fr; }
          .hco-guest-grid > *:nth-child(3) { grid-column: span 2; } /* Makes the last name input full width */
          .hco-card { padding: 20px; }
          .hco-hotel-img { height: 160px; }
          .hco-hotel-name-row { flex-direction: column; align-items: flex-start; }
          .hco-room-tag { align-self: flex-start; }
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
                    <div className="hco-hotel-name-row">
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
                        <div style={{ fontWeight: '700', fontSize: '16px', color: '#1a1a2e' }}>
                          {state.rooms} Room{state.rooms > 1 ? 's' : ''} · {state.adults} Adult{state.adults > 1 ? 's' : ''}
                          {state.children > 0 ? ` · ${state.children} Child${state.children > 1 ? 'ren' : ''}` : ''}
                        </div>
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

                    {priceChangedAlert && (
                      <div style={{ marginTop: '16px', padding: '12px 16px', background: '#fffbeb', border: '1px solid #f59e0b', borderRadius: '10px', color: '#b45309', fontSize: '14px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <ShieldAlert size={18} style={{ flexShrink: 0 }} />
                        <div><strong>Price Alert:</strong> The hotel has updated its pricing since your search. Please review the updated Total Amount before confirming.</div>
                      </div>
                    )}

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

                  {/* Hotel Policies & Important Information */}
                  {preBookData && (
                    <div className="hco-card">
                      <div className="hco-section-title"><ShieldCheck size={20} color="#e8151b" /> Important Policies & Rules</div>
                      {(() => {
                        const rateConditions = preBookData?.HotelResult?.[0]?.RateConditions || preBookData?.RateConditions || [];
                        if (!rateConditions || rateConditions.length === 0) {
                          return (
                            <div style={{ color: '#64748b', fontSize: '14px', fontStyle: 'italic' }}>
                              No special conditions specified by the hotel. Standard rules apply.
                            </div>
                          );
                        }
                        
                        // Decode HTML entities that TBO sends like &lt;ul&gt;
                        const decodeHtml = (html) => {
                          if (!html) return '';
                          return html.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
                        };

                        return (
                          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                            <ul style={{ margin: 0, paddingLeft: '20px', color: '#334155', fontSize: '13px', lineHeight: '1.6' }}>
                              {rateConditions.map((policy, idx) => (
                                <li key={idx} style={{ marginBottom: '10px' }} dangerouslySetInnerHTML={{ __html: decodeHtml(policy) }} />
                              ))}
                            </ul>
                          </div>
                        );
                      })()}
                    </div>
                  )}

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
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <select 
                            className="hco-input hco-select" 
                            style={{ width: '110px', flexShrink: 0, padding: '0 30px 0 10px' }}
                            value={contactCountryCode}
                            onChange={e => setContactCountryCode(e.target.value)}
                          >
                            <option value="+91">+91 (IN)</option>
                            <option value="+1">+1 (US)</option>
                            <option value="+44">+44 (UK)</option>
                            <option value="+971">+971 (AE)</option>
                            <option value="+61">+61 (AU)</option>
                          </select>
                          <input
                            id="contactPhone" type="tel" className="hco-input"
                            placeholder="9876543210" value={contactPhone}
                            onChange={e => {
                                const val = e.target.value.replace(/\D/g, '');
                                if (val.length <= 15) setContactPhone(val);
                            }} required
                          />
                        </div>
                      </InputField>

                      {preBookData?.ValidationInfo?.PassportMandatory && (
                        <InputField label="Passport Number" id="passportNumber" required>
                          <input
                            id="passportNumber" type="text" className="hco-input"
                            placeholder="A1234567" value={passportNumber}
                            onChange={e => setPassportNumber(e.target.value.toUpperCase())} required
                            style={{ textTransform: 'uppercase' }}
                          />
                        </InputField>
                      )}
                    </div>
                  </div>

                  {preBookData?.ValidationInfo?.CorporateBokingAllowed && (
                    <div className="hco-card">
                      <div className="hco-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span><Building2 size={20} color="#e8151b" /> Business Travel & GST (Optional)</span>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                          <input type="checkbox" checked={isCorporateBooking} onChange={e => setIsCorporateBooking(e.target.checked)} style={{ marginRight: '8px', transform: 'scale(1.2)' }} />
                          <span style={{ fontSize: '14px', fontWeight: '500' }}>I have a GST number for business travel</span>
                        </label>
                      </div>
                      
                      {isCorporateBooking && preBookData?.ValidationInfo?.GSTAllowed && (
                        <div style={{ marginTop: '16px', background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '12px' }}>GST Details (Optional)</div>
                          <div className="hco-contact-grid">
                            <InputField label="Company Name" id="gstName">
                              <input id="gstName" type="text" className="hco-input" placeholder="Company Pvt Ltd" value={gstName} onChange={e => setGstName(e.target.value)} />
                            </InputField>
                            <InputField label="GST Number" id="gstNumber">
                              <input id="gstNumber" type="text" className="hco-input" placeholder="22AAAAA0000A1Z5" value={gstNumber} onChange={e => setGstNumber(e.target.value.toUpperCase())} style={{ textTransform: 'uppercase' }} />
                            </InputField>
                            <InputField label="Company Address" id="gstAddress">
                              <input id="gstAddress" type="text" className="hco-input" placeholder="123 Business Park" value={gstAddress} onChange={e => setGstAddress(e.target.value)} />
                            </InputField>
                            <InputField label="Company Email" id="gstEmail">
                              <input id="gstEmail" type="email" className="hco-input" placeholder="accounts@company.com" value={gstEmail} onChange={e => setGstEmail(e.target.value)} />
                            </InputField>
                            <InputField label="Company Phone" id="gstPhone">
                              <input id="gstPhone" type="tel" className="hco-input" placeholder="9876543210" value={gstPhone} onChange={e => setGstPhone(e.target.value)} />
                            </InputField>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Transport Details (Package Fare) */}
                  {(preBookData?.ValidationInfo?.IsPackageDetailsMandatory || preBookData?.ValidationInfo?.DepartureDetailsMandatory) && (
                    <div className="hco-card">
                      <div className="hco-section-title"><Plane size={20} color="#e8151b" /> Travel & Transport Details</div>
                      <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                        {preBookData?.ValidationInfo?.IsPackageDetailsMandatory && (
                          <div style={{ marginBottom: preBookData?.ValidationInfo?.DepartureDetailsMandatory ? '20px' : '0' }}>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '12px' }}>Arrival Details</div>
                            <div className="hco-contact-grid">
                              <InputField label="Transport Type" id="arrType">
                                <select id="arrType" className="hco-input hco-select" value={arrType} onChange={e => setArrType(e.target.value)}>
                                  <option value="0">Flight</option>
                                  <option value="1">Surface / Train / Bus</option>
                                </select>
                              </InputField>
                              <InputField label="Flight/Train Number" id="arrInfoId">
                                <input id="arrInfoId" type="text" className="hco-input" placeholder="e.g. AI 101" value={arrInfoId} onChange={e => setArrInfoId(e.target.value)} />
                              </InputField>
                              <InputField label="Arrival Time" id="arrTime">
                                <input id="arrTime" type="datetime-local" className="hco-input" value={arrTime} onChange={e => setArrTime(e.target.value)} />
                              </InputField>
                            </div>
                          </div>
                        )}
                        {preBookData?.ValidationInfo?.DepartureDetailsMandatory && (
                          <div style={{ paddingTop: preBookData?.ValidationInfo?.IsPackageDetailsMandatory ? '20px' : '0', borderTop: preBookData?.ValidationInfo?.IsPackageDetailsMandatory ? '1px solid #cbd5e1' : 'none' }}>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '12px' }}>Departure Details</div>
                            <div className="hco-contact-grid">
                              <InputField label="Transport Type" id="depType">
                                <select id="depType" className="hco-input hco-select" value={depType} onChange={e => setDepType(e.target.value)}>
                                  <option value="0">Flight</option>
                                  <option value="1">Surface / Train / Bus</option>
                                </select>
                              </InputField>
                              <InputField label="Flight/Train Number" id="depInfoId">
                                <input id="depInfoId" type="text" className="hco-input" placeholder="e.g. AI 102" value={depInfoId} onChange={e => setDepInfoId(e.target.value)} />
                              </InputField>
                              <InputField label="Departure Time" id="depTime">
                                <input id="depTime" type="datetime-local" className="hco-input" value={depTime} onChange={e => setDepTime(e.target.value)} />
                              </InputField>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

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
                            {preBookData?.ValidationInfo?.PanMandatory && guest.PaxType === 1 && (
                                <div style={{ marginTop: '12px', display: 'flex', gap: '15px' }}>
                                  <div style={{ flex: 1 }}>
                                    <InputField label="PAN Card Number" id={`pan-${ri}-${gi}`}>
                                      <input
                                        id={`pan-${ri}-${gi}`} type="text" className="hco-input"
                                        placeholder="ABCDE1234F" value={guest.PAN || ''}
                                        onChange={e => updateGuest(ri, gi, 'PAN', e.target.value.toUpperCase())}
                                        style={{ textTransform: 'uppercase' }}
                                      />
                                    </InputField>
                                  </div>
                                </div>
                            )}
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
                      <span className="hco-price-label">{state.rooms} Room{state.rooms > 1 ? 's' : ''} × {nights} Night{nights > 1 ? 's' : ''} (Base Price)</span>
                      <span className="hco-price-value">₹{(grandTotal - taxes).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    
                    <div className="hco-price-row">
                      <span className="hco-price-label">Taxes & Fees</span>
                      <span className="hco-price-value">₹{taxes.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    
                    <div className="hco-total-row">
                      <span className="hco-total-label">Total Amount</span>
                      <span className="hco-total-price">₹{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>

                    {preBookData?.HotelResult?.[0]?.Rooms?.[0]?.Supplements && preBookData.HotelResult[0].Rooms[0].Supplements.length > 0 && (
                      <div style={{ marginTop: '16px', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '10px', padding: '12px' }}>
                        <div style={{ fontWeight: '600', color: '#be123c', fontSize: '13px', marginBottom: '8px' }}>At-Property Charges (Not included in total)</div>
                        {preBookData.HotelResult[0].Rooms[0].Supplements.map((sup, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#881337', marginBottom: '4px' }}>
                            <span>{sup.Type === 'AtProperty' ? 'Pay at Hotel' : sup.Type} - {sup.Description}</span>
                            <span style={{ fontWeight: '600' }}>{sup.Currency} {sup.Price}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {room.DayRates && room.DayRates.length > 0 && room.DayRates[0].length > 0 && (
                      <details style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', marginTop: '16px', border: '1px solid #e2e8f0', fontSize: '13px' }}>
                        <summary style={{ cursor: 'pointer', fontWeight: '600', color: '#0ea5e9', display: 'flex', alignItems: 'center', gap: '6px', outline: 'none', userSelect: 'none' }}>
                          <Info size={14} /> View Daily Price Breakdown
                        </summary>
                        <div style={{ marginTop: '12px', paddingLeft: '8px', paddingRight: '8px', display: 'flex', flexDirection: 'column', gap: '8px', color: '#475569' }}>
                          {room.DayRates[0].map((day, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #cbd5e1', paddingBottom: '4px' }}>
                              <span>Night {idx + 1}</span>
                              <span style={{ fontWeight: '600' }}>₹{day.BasePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}

                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px', marginTop: '16px', marginBottom: '20px', fontSize: '13px', color: '#15803d' }}>
                      ✅ <strong>No hidden charges.</strong> The amount above is the total you'll pay.
                    </div>

                    <button type="submit" className="hco-book-btn" disabled={isBooking}>
                      {isBooking ? (
                        <><div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }}></div> {
                          paymentStatus === 'paying' ? 'Opening Payment...'
                          : paymentStatus === 'verifying' ? 'Verifying Payment...'
                          : paymentStatus === 'booking' ? 'Confirming Booking...'
                          : 'Processing...'
                        }</>
                      ) : (
                        <><CreditCard size={18} /> Confirm & Pay · ₹{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</>
                      )}
                    </button>

                    <div style={{ marginTop: '16px', fontSize: '12px', color: '#64748b', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      <ShieldCheck size={14} color="#10b981" /> 100% Safe &amp; Secure Booking
                    </div>
                    <div style={{ marginTop: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>Accepted Payment Methods</div>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            {['UPI', 'Cards', 'Net Banking', 'Wallets', 'QR'].map(m => (
                                <span key={m} style={{ fontSize: '10px', fontWeight: '600', color: '#475569', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '2px 7px' }}>{m}</span>
                            ))}
                        </div>
                        <div style={{ marginTop: '8px', fontSize: '10px', color: '#b0bec5', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                            Powered by <span style={{ fontWeight: '800', color: '#528FF0' }}>Razorpay</span>
                        </div>
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
      {showLoginPrompt && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }}>
            <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', textAlign: 'center', maxWidth: '420px', width: '90%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', fontFamily: "'Inter', sans-serif" }}>
                <div style={{ width: '60px', height: '60px', background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <i className="fa-solid fa-lock" style={{ fontSize: '24px', color: '#e8151b' }}></i>
                </div>
                <h3 style={{ marginTop: 0, color: '#1a1a2e', fontSize: '22px', fontWeight: '700', marginBottom: '12px' }}>Login Required</h3>
                <p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
                    Please login or create an account to securely continue with your booking.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <button type="button" onClick={() => setShowLoginPrompt(false)} style={{ flex: 1, padding: '12px 0', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '15px', transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.background = '#e2e8f0'} onMouseLeave={e => e.target.style.background = '#f1f5f9'}>Cancel</button>
                    <button type="button" onClick={() => {
                        setShowLoginPrompt(false);
                        window.dispatchEvent(new Event('openLoginModal'));
                    }} style={{ flex: 1, padding: '12px 0', background: '#e8151b', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '15px', transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.background = '#d01217'} onMouseLeave={e => e.target.style.background = '#e8151b'}>Login / Sign Up</button>
                </div>
            </div>
        </div>
      )}

      <FooterOne />
    </>
  );
}
