import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HeaderOne from '../Components/Header/HeaderOne';
import FooterOne from '../Components/Footer/FooterOne';
import { MapPin, Star, Building2, ChevronRight, Info, ShieldCheck, CalendarDays, Loader2, Coffee, CheckCircle2, Ban, Check } from 'lucide-react';
import HotelAmenitiesParser from '../Components/Hotel/HotelAmenitiesParser';

const HOTEL_API = process.env.REACT_APP_HOTEL_API_BASE_URL || 'http://localhost:8009/api/hotel';

const MEAL_TYPES = { 0: 'Room Only', 1: 'Breakfast Included', 2: 'Half Board', 3: 'Full Board', 4: 'All Inclusive' };

function StarRating({ rating }) {
  const stars = Math.round(rating || 0);
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={16} fill={i <= stars ? '#f59e0b' : 'none'} color={i <= stars ? '#f59e0b' : '#d1d5db'} />
      ))}
    </div>
  );
}

export default function HotelDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  const [hotelStatic, setHotelStatic] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState(location.state?.hotel?.Rooms || []);
  const [isRoomsLoading, setIsRoomsLoading] = useState(!location.state?.hotel?.Rooms?.length);

  const hotelDynamic = state?.hotel;

  useEffect(() => {
    if (!state || !hotelDynamic) {
      navigate('/');
      return;
    }
    window.scrollTo(0, 0);

    const fetchStaticDetails = async () => {
      try {
        const res = await fetch(`${HOTEL_API}/hotel-details`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ Hotelcodes: [hotelDynamic.HotelCode] })
        });
        const data = await res.json();
        if (data?.HotelDetails?.[0]) {
          setHotelStatic(data.HotelDetails[0]);
        }
      } catch (err) {
        console.error('Failed to fetch static details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchRooms = async () => {
      if (hotelDynamic?.Rooms?.length) {
        setIsRoomsLoading(false);
        return;
      }
      setIsRoomsLoading(true);
      try {
        const res = await fetch(`${HOTEL_API}/rooms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ResultIndex: hotelDynamic.ResultIndex,
            HotelCode: hotelDynamic.HotelCode,
            TraceId: state.traceId
          })
        });
        const data = await res.json();
        const roomResult = data?.GetHotelRoomResult;
        if (roomResult?.HotelRoomsDetails) {
          setRooms(roomResult.HotelRoomsDetails);
        } else {
          console.warn('No room details found in response:', data);
        }
      } catch (err) {
        console.error('Failed to fetch rooms:', err);
      } finally {
        setIsRoomsLoading(false);
      }
    };

    fetchStaticDetails();
    fetchRooms();
  }, [state, navigate, hotelDynamic]);

  if (!state || !hotelDynamic) return null;

  const handleRoomSelect = (room) => {
    navigate('/hotel-checkout', {
      state: {
        ...state,
        selectedRoom: room
      }
    });
  };

  const images = hotelStatic?.Images || [hotelDynamic.HotelPicture || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&h=600'];
  const name = hotelStatic?.HotelName || hotelDynamic.HotelName;
  const address = hotelStatic?.Address || hotelDynamic.HotelAddress || hotelDynamic.HotelLocation;
  const description = hotelStatic?.Description || 'Enjoy a wonderful stay at this premium property offering best-in-class amenities and exceptional hospitality.';
  
  const nights = state.nights || 1;
  const minPrice = hotelDynamic.MinPrice || hotelDynamic.Rooms?.[0]?.TotalFare || 0;

  return (
    <>
      <HeaderOne />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap');
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .hd-page { background: #f8fafc; min-height: 100vh; font-family: 'Inter', sans-serif; padding-top: 80px; padding-bottom: 60px; }
        .hd-container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        
        /* Breadcrumb */
        .hd-breadcrumb { font-size: 13px; color: #64748b; margin: 20px 0; display: flex; align-items: center; gap: 8px; font-weight: 500; }
        .hd-breadcrumb span.active { color: #1a1a2e; font-weight: 600; }
        
        /* Header */
        .hd-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; flex-wrap: wrap; gap: 20px; }
        .hd-title { font-family: 'Outfit', sans-serif; font-size: 32px; font-weight: 800; color: #1a1a2e; margin: 0 0 8px; line-height: 1.2; }
        .hd-address { display: flex; align-items: center; gap: 6px; font-size: 14px; color: #475569; }
        .hd-header-right { text-align: right; }
        
        @media(max-width: 768px) {
          .hd-header { flex-direction: column; }
          .hd-header-right { text-align: left; background: #fff; padding: 16px; border-radius: 12px; width: 100%; box-shadow: 0 2px 10px rgba(0,0,0,0.05); box-sizing: border-box; }
          .hd-title { font-size: 26px; }
        }

        /* Gallery Grid */
        .hd-gallery { display: grid; grid-template-columns: 2fr 1fr; grid-template-rows: 200px 200px; gap: 12px; border-radius: 20px; overflow: hidden; margin-bottom: 40px; }
        .hd-gallery-main { grid-row: span 2; position: relative; }
        .hd-gallery-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; cursor: pointer; }
        .hd-gallery-img:hover { transform: scale(1.02); }
        .hd-gallery-box { overflow: hidden; position: relative; }
        
        @media(max-width: 768px) { 
          .hd-gallery { grid-template-columns: 1fr 1fr; grid-template-rows: 250px 120px; gap: 8px; border-radius: 12px; } 
          .hd-gallery-main { grid-column: span 2; grid-row: span 1; } 
        }
        @media(max-width: 480px) {
          .hd-gallery { grid-template-rows: 200px 100px; }
        }

        /* Content Layout */
        .hd-content { display: grid; grid-template-columns: 2fr 1fr; gap: 32px; }
        @media(max-width: 900px) { .hd-content { grid-template-columns: 1fr; } }
        
        /* Sections */
        .hd-section { background: #fff; border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); margin-bottom: 24px; }
        @media(max-width: 768px) { .hd-section { padding: 20px; } }
        .hd-section-title { font-family: 'Outfit', sans-serif; font-size: 22px; font-weight: 700; color: #1a1a2e; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
        .hd-desc { font-size: 15px; color: #475569; line-height: 1.7; }
        
        /* Rooms Section */
        .hd-rooms-title { font-family: 'Outfit', sans-serif; font-size: 28px; font-weight: 800; color: #1a1a2e; margin: 40px 0 20px; }
        .hd-room-card { background: #fff; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 16px; display: grid; grid-template-columns: 1fr auto; gap: 24px; align-items: center; transition: all 0.2s; }
        .hd-room-card:hover { border-color: #cbd5e1; box-shadow: 0 12px 30px rgba(0,0,0,0.06); transform: translateY(-2px); }
        .hd-room-info h3 { font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 700; color: #1a1a2e; margin: 0 0 12px; }
        .hd-room-tags { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; }
        .hd-tag { display: inline-flex; align-items: center; gap: 6px; background: #f1f5f9; color: #475569; font-size: 12px; font-weight: 600; padding: 6px 12px; border-radius: 8px; }
        .hd-tag.success { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
        .hd-tag.warning { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
        
        .hd-room-price { text-align: right; }
        .hd-price-night { font-size: 13px; color: #64748b; font-weight: 500; margin-bottom: 4px; }
        .hd-price-big { font-family: 'Outfit', sans-serif; font-size: 32px; font-weight: 800; color: #1a1a2e; line-height: 1; margin-bottom: 6px; }
        .hd-price-total { font-size: 13px; color: #64748b; margin-bottom: 16px; }
        
        .hd-select-btn { background: linear-gradient(135deg, #e8151b, #c8101a); color: #fff; border: none; border-radius: 12px; padding: 14px 32px; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; width: 100%; font-family: 'Inter', sans-serif; }
        .hd-select-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(232,21,27,0.35); }
        
        @media(max-width: 600px) { 
          .hd-room-card { grid-template-columns: 1fr; padding: 16px; } 
          .hd-room-price { text-align: left; border-top: 1px dashed #e2e8f0; padding-top: 20px; display: flex; flex-direction: column; gap: 4px; } 
          .hd-price-night { display: none; }
          .hd-price-total { margin-bottom: 16px; }
          .hd-select-btn { width: 100%; } 
        }
      `}</style>

      <div className="hd-page">
        <div className="hd-container">
          
          <div className="hd-breadcrumb">
            <span style={{cursor:'pointer'}} onClick={()=>navigate('/')}>Home</span> <ChevronRight size={14}/>
            <span style={{cursor:'pointer'}} onClick={()=>navigate(-1)}>Hotels</span> <ChevronRight size={14}/>
            <span className="active">{name}</span>
          </div>

          <div className="hd-header">
            <div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                <StarRating rating={hotelDynamic.HotelRating} />
                {hotelDynamic.IsRefundable && (
                  <span style={{ background: '#10b981', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={12}/> Refundable
                  </span>
                )}
              </div>
              <h1 className="hd-title">{name}</h1>
              <div className="hd-address"><MapPin size={16} color="#e8151b" /> {address}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Starting from</div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '36px', fontWeight: '800', color: '#e8151b', lineHeight: '1' }}>
                ₹{Math.round(minPrice / nights).toLocaleString()}
              </div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>per night</div>
            </div>
          </div>

          <div className="hd-gallery">
            <div className="hd-gallery-box hd-gallery-main">
              <img src={images[0] && !images[0].includes('HotelNA') ? images[0] : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&h=600'} alt="Hotel Main" className="hd-gallery-img" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&h=600'; }} />
            </div>
            <div className="hd-gallery-box">
              <img src={images[1] && !images[1].includes('HotelNA') ? images[1] : 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&h=400'} alt="Hotel Sub" className="hd-gallery-img" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&h=400'; }} />
            </div>
            <div className="hd-gallery-box">
              <img src={images[2] && !images[2].includes('HotelNA') ? images[2] : 'https://images.unsplash.com/photo-1542314831-c6a4d14d837e?auto=format&fit=crop&w=600&h=400'} alt="Hotel Sub" className="hd-gallery-img" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1542314831-c6a4d14d837e?auto=format&fit=crop&w=600&h=400'; }} />
            </div>
          </div>

          <div className="hd-content">
            <div className="hd-main">
              <div className="hd-section">
                <h2 className="hd-section-title"><Info size={24} color="#e8151b"/> About the Property</h2>
                {isLoading ? (
                  <div style={{ color: '#94a3b8' }}>Loading description...</div>
                ) : (
                  <div className="hd-desc" dangerouslySetInnerHTML={{ __html: description }} />
                )}
              </div>

              <div className="hd-section">
                <h2 className="hd-section-title"><Building2 size={24} color="#e8151b"/> Amenities & Facilities</h2>
                <HotelAmenitiesParser 
                  hotelStatic={hotelStatic} 
                  hotelDynamic={hotelDynamic} 
                  rooms={rooms}
                  hotelName={name}
                />
              </div>
            </div>

            <div className="hd-sidebar">
               <div className="hd-section" style={{ position: 'sticky', top: '100px' }}>
                 <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Your Search Details</h3>
                 <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', background: '#f8fafc', borderRadius: '12px', marginBottom: '12px' }}>
                   <CalendarDays size={20} color="#64748b" />
                   <div>
                     <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Check-in & Check-out</div>
                     <div style={{ fontSize: '14px', color: '#1a1a2e', fontWeight: '600' }}>{state.checkIn} → {state.checkOut}</div>
                   </div>
                 </div>
                 <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', background: '#f8fafc', borderRadius: '12px' }}>
                   <Building2 size={20} color="#64748b" />
                   <div>
                     <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Guests & Rooms</div>
                     <div style={{ fontSize: '14px', color: '#1a1a2e', fontWeight: '600' }}>{state.rooms} Room, {state.adults} Adult{state.adults > 1 ? 's' : ''}</div>
                   </div>
                 </div>
                 
                 <button onClick={() => window.scrollTo({ top: document.getElementById('rooms-section').offsetTop - 80, behavior: 'smooth'})} 
                         style={{ width: '100%', padding: '14px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '14px', marginTop: '20px', cursor: 'pointer' }}>
                   View Available Rooms
                 </button>

                 {/* Dynamic Hotel Contact Details */}
                 {hotelStatic && (hotelStatic.HotelContactNo || hotelStatic.Email || hotelStatic.FaxNumber || hotelStatic.Website) && (
                   <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
                     <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '16px', fontWeight: '700', color: '#1a1a2e', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <Info size={18} color="#e8151b" /> Contact & Info
                     </h3>
                     <div style={{ fontSize: '13px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                       {hotelStatic.HotelContactNo && <div><strong>Phone:</strong> {hotelStatic.HotelContactNo}</div>}
                       {hotelStatic.Email && <div><strong>Email:</strong> {hotelStatic.Email}</div>}
                       {hotelStatic.FaxNumber && <div><strong>Fax:</strong> {hotelStatic.FaxNumber}</div>}
                       {hotelStatic.Website && (
                         <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                           <strong>Website:</strong> <a href={hotelStatic.Website.startsWith('http') ? hotelStatic.Website : `http://${hotelStatic.Website}`} target="_blank" rel="noreferrer" style={{ color: '#0ea5e9', textDecoration: 'none' }}>{hotelStatic.Website.replace(/^https?:\/\//, '')}</a>
                         </div>
                       )}
                       {hotelStatic.PinCode && <div><strong>Pin Code:</strong> {hotelStatic.PinCode}</div>}
                     </div>
                   </div>
                 )}
               </div>
            </div>
          </div>

          {/* Rooms Section */}
          <div id="rooms-section">
            <h2 className="hd-rooms-title">Available Rooms</h2>
            {isRoomsLoading ? (
              <div className="hd-section" style={{ textAlign: 'center', padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <Loader2 className="spin" size={36} color="#e8151b" />
                <h3 style={{ color: '#64748b', margin: 0 }}>Fetching latest room availability and rates...</h3>
              </div>
            ) : rooms.length === 0 ? (
              <div className="hd-section" style={{ textAlign: 'center', padding: '60px 20px' }}>
                <h3 style={{ color: '#64748b' }}>No detailed room data available for this hotel.</h3>
              </div>
            ) : (
              rooms.map((room, idx) => {
                const isRefundable = room.IsRefundable;
                const pricePerNight = Math.round(room.TotalFare / nights);
                const roomName = Array.isArray(room.Name) ? room.Name.join(', ') : (room.Name || room.RoomTypeName || 'Standard Room');
                const inclusion = room.Inclusion || MEAL_TYPES[room.MealType] || 'Room Only';

                return (
                  <div key={idx} className="hd-room-card">
                    <div className="hd-room-info">
                      <h3>{roomName}</h3>
                      <div className="hd-room-tags">
                        <span className="hd-tag"><Coffee size={14}/> {inclusion}</span>
                        {isRefundable ? (
                          <span className="hd-tag success"><ShieldCheck size={14}/> Refundable</span>
                        ) : (
                          <span className="hd-tag warning">Non-Refundable</span>
                        )}
                        <span className="hd-tag"><CheckCircle2 size={14}/> Instant Confirmation</span>
                        {(room.SmokingPreference === 'NonSmoking' || room.SmokingPreference === 'NoPreference') && (
                          <span className="hd-tag"><Ban size={14}/> Non-Smoking</span>
                        )}
                      </div>

                      {room.Amenities && room.Amenities.length > 0 && (
                        <div style={{ marginTop: '12px', fontSize: '12px', color: '#475569', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {room.Amenities.slice(0, 6).map((am, i) => (
                            <span key={i} style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Check size={12} color="#10b981" /> {am}
                            </span>
                          ))}
                          {room.Amenities.length > 6 && (
                            <span style={{ padding: '3px 8px', color: '#64748b', fontStyle: 'italic' }}>+{room.Amenities.length - 6} more</span>
                          )}
                        </div>
                      )}

                      {room.RoomPromotion && room.RoomPromotion.length > 0 && (
                        <div style={{ fontSize: '13px', color: '#ef6614', fontWeight: '600', marginTop: '12px', marginBottom: '8px' }}>
                          🎁 {room.RoomPromotion.join(', ')}
                        </div>
                      )}
                      
                      {(room.CancelPolicies || room.CancellationPolicies) && (room.CancelPolicies || room.CancellationPolicies).length > 0 && (
                        <details style={{ marginTop: '12px', fontSize: '13px', color: '#64748b' }}>
                          <summary style={{ cursor: 'pointer', outline: 'none', color: '#0ea5e9', fontWeight: '500', userSelect: 'none' }}>
                            View Cancellation Policy
                          </summary>
                          <div style={{ marginTop: '6px', padding: '8px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                            {(room.CancelPolicies || room.CancellationPolicies).map((cp, i) => (
                              <div key={i} style={{ marginBottom: '4px' }}>
                                <strong>From {cp.FromDate?.split(' ')[0]}:</strong>{' '}
                                {cp.ChargeType === 'Percentage' ? `${cp.CancellationCharge}%` : `₹${cp.CancellationCharge}`} cancellation charge
                              </div>
                            ))}
                          </div>
                        </details>
                      )}
                    </div>
                    <div className="hd-room-price">
                      <div className="hd-price-night">Price per night</div>
                      <div className="hd-price-big">₹{pricePerNight.toLocaleString()}</div>
                      <div className="hd-price-total">₹{room.TotalFare.toLocaleString()} total for {nights} night{nights > 1 ? 's' : ''}</div>
                      <button className="hd-select-btn" onClick={() => handleRoomSelect(room)}>Select Room</button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      </div>
      <FooterOne />
    </>
  );
}
