import React, { useState } from 'react';
import axios from 'axios';
import { Plane, Users, CreditCard, AlertCircle, CheckCircle, ArrowRight, Building2, MapPin, Calendar, XCircle } from 'lucide-react';

const HOTEL_API = process.env.REACT_APP_HOTEL_API_BASE_URL || 'http://localhost:8009/api/hotel';
const FLIGHT_API = process.env.REACT_APP_FLIGHT_API_BASE_URL || 'http://localhost:8009/api/flight';

function ManageBookingInner() {
    const [bookingType, setBookingType] = useState('flight'); // 'flight' or 'hotel'
    
    // Flight Search States
    const [searchMode, setSearchMode] = useState('bookingId');
    const [pnr, setPnr] = useState('');
    const [bookingId, setBookingId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [traceId, setTraceId] = useState('');
    
    // Hotel Search States
    const [hotelBookingId, setHotelBookingId] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [bookingData, setBookingData] = useState(null);

    const handleFlightSearch = async () => {
        if (searchMode !== 'traceId' && !pnr) return setError('Please enter PNR');
        if (searchMode === 'bookingId' && !bookingId) return setError('Please enter Booking ID');
        if (searchMode === 'name' && (!firstName || !lastName)) return setError('Please enter both First Name and Last Name');
        if (searchMode === 'traceId' && !traceId) return setError('Please enter Trace ID');

        const payload = {};
        if (searchMode === 'bookingId') { payload.PNR = pnr; payload.BookingId = bookingId; }
        else if (searchMode === 'name') { payload.PNR = pnr; payload.FirstName = firstName; payload.LastName = lastName; }
        else if (searchMode === 'traceId') { payload.TraceId = traceId; }

        try {
            const response = await axios.post(`${FLIGHT_API}/booking-details`, payload);
            if (response.data?.Response?.FlightItinerary) {
                setBookingData({ type: 'flight', data: response.data.Response.FlightItinerary });
            } else {
                setError('Booking details not found or invalid response.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch flight booking details.');
        }
    };

    const handleHotelSearch = async () => {
        if (!hotelBookingId) return setError('Please enter your Hotel Booking ID');
        
        try {
            const response = await axios.post(`${HOTEL_API}/booking-detail`, { BookingId: hotelBookingId });
            const result = response.data?.HotelBookingDetailResponse || response.data?.GetBookingDetailResult;
            if (result && result.ResponseStatus === 1) {
                setBookingData({ type: 'hotel', data: result });
            } else {
                setError(result?.Error?.ErrorMessage || 'Hotel booking details not found.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch hotel booking details.');
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMsg('');
        setBookingData(null);
        
        if (bookingType === 'flight') await handleFlightSearch();
        else await handleHotelSearch();
        
        setLoading(false);
    };

    const handleCancelHotel = async () => {
        if (!window.confirm('Are you sure you want to request cancellation for this hotel booking?')) return;
        
        setCancelling(true);
        setError('');
        setSuccessMsg('');
        try {
            const response = await axios.post(`${HOTEL_API}/cancel-booking`, {
                BookingId: bookingData.data.BookingId,
                RequestType: 4, // 4 for Cancellation
                Remarks: 'Customer requested cancellation via Manage Booking portal'
            });
            const result = response.data;
            if (result?.Status?.Code === 200 || result?.Status?.Code === 1 || result?.HotelChangeRequestStatusResult?.Status?.Code === 1) {
                setSuccessMsg('Cancellation request submitted successfully. It is currently being processed.');
                // Refresh booking data
                await handleHotelSearch();
            } else {
                setError(result?.Status?.Description || 'Failed to submit cancellation request.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to cancel hotel booking.');
        } finally {
            setCancelling(false);
        }
    };

    return (
        <section className="manage-booking-area pt-120 pb-120">
            <style>{`
                .manage-booking-form { background: #fff; padding: 40px; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.08); max-width: 600px; margin: 0 auto; }
                .type-tabs { display: flex; gap: 15px; margin-bottom: 30px; justify-content: center; }
                .type-tab { padding: 12px 24px; border-radius: 30px; font-weight: 700; cursor: pointer; transition: 0.2s; border: 2px solid transparent; display: flex; align-items: center; gap: 8px; }
                .type-tab.flight { background: #f1f5f9; color: #475569; }
                .type-tab.flight.active { background: #e0f2fe; color: #0284c7; border-color: #7dd3fc; }
                .type-tab.hotel { background: #f1f5f9; color: #475569; }
                .type-tab.hotel.active { background: #fef2f2; color: #e8151b; border-color: #fca5a5; }
                
                .search-tabs { display: flex; gap: 10px; margin-bottom: 25px; border-bottom: 1px solid #eee; padding-bottom: 15px; }
                .search-tab { background: transparent; border: none; font-size: 16px; font-weight: 600; color: #666; padding: 8px 16px; cursor: pointer; position: relative; transition: 0.3s; }
                .search-tab.active { color: #e8151b; }
                .search-tab.active::after { content: ''; position: absolute; bottom: -16px; left: 0; width: 100%; height: 2px; background: #e8151b; }
                
                .form-group label { font-weight: 600; margin-bottom: 8px; display: block; color: #0d1b2a; }
                .form-group input { width: 100%; padding: 12px 15px; border: 1px solid #e0e0e0; border-radius: 8px; margin-bottom: 20px; font-size: 16px; }
                .form-group input:focus { border-color: #e8151b; outline: none; }
                .btn-search { background: #e8151b; color: #fff; width: 100%; padding: 14px; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: 0.3s; }
                .btn-search:hover { background: #c11217; }
                
                .error-msg { color: #d32f2f; background: #ffebee; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 14px; display: flex; align-items: center; gap: 10px; }
                .success-msg { color: #15803d; background: #f0fdf4; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 14px; display: flex; align-items: center; gap: 10px; border: 1px solid #bbf7d0; }
                
                /* Results Card */
                .results-card { background: #fff; border-radius: 16px; box-shadow: 0 15px 50px rgba(0,0,0,0.05); overflow: hidden; margin-top: 50px; }
                .results-header { background: #0d1b2a; color: #fff; padding: 25px 30px; display: flex; justify-content: space-between; align-items: center; }
                .results-body { padding: 30px; }
                
                .status-badge { background: #e8f5e9; color: #2e7d32; padding: 6px 15px; border-radius: 30px; font-weight: 600; font-size: 14px; display: inline-flex; align-items: center; gap: 6px; }
                .status-badge.pending { background: #fff8e1; color: #f57f17; }
                .status-badge.cancelled { background: #ffebee; color: #c62828; }
                
                .section-title { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 700; color: #0d1b2a; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #eee; }
                .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
                .info-item { background: #f8f9fa; padding: 15px; border-radius: 8px; }
                .info-item span { display: block; font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 5px; }
                .info-item strong { font-size: 16px; color: #0d1b2a; }
                
                .passenger-list { list-style: none; padding: 0; margin: 0; }
                .passenger-list li { display: flex; align-items: center; gap: 15px; padding: 15px; border: 1px solid #eee; border-radius: 8px; margin-bottom: 10px; }
                .passenger-icon { width: 40px; height: 40px; background: rgba(232,21,27,0.1); color: #e8151b; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
                
                .btn-cancel { background: #fff; color: #dc2626; border: 1px solid #fca5a5; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: 0.2s; display: inline-flex; align-items: center; gap: 6px; }
                .btn-cancel:hover { background: #fef2f2; }
                .btn-cancel:disabled { opacity: 0.5; cursor: not-allowed; }
            `}</style>
            
            <div className="container">
                <div className="manage-booking-form">
                    <div className="text-center mb-40">
                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: '#0d1b2a', margin: '0 0 10px 0' }}>Manage Your Booking</h2>
                        <p style={{ color: '#666' }}>Select the booking type and enter your details to view or manage your itinerary.</p>
                    </div>

                    <div className="type-tabs">
                        <div className={`type-tab flight ${bookingType === 'flight' ? 'active' : ''}`} onClick={() => { setBookingType('flight'); setBookingData(null); setError(''); setSuccessMsg(''); }}>
                            <Plane size={18} /> Flights
                        </div>
                        <div className={`type-tab hotel ${bookingType === 'hotel' ? 'active' : ''}`} onClick={() => { setBookingType('hotel'); setBookingData(null); setError(''); setSuccessMsg(''); }}>
                            <Building2 size={18} /> Hotels
                        </div>
                    </div>

                    {error && <div className="error-msg"><AlertCircle size={20} /> {error}</div>}
                    {successMsg && <div className="success-msg"><CheckCircle size={20} /> {successMsg}</div>}

                    <form onSubmit={handleSearch}>
                        {bookingType === 'flight' ? (
                            <>
                                <div className="search-tabs">
                                    <button className={`search-tab ${searchMode === 'bookingId' ? 'active' : ''}`} onClick={() => setSearchMode('bookingId')} type="button">Booking ID</button>
                                    <button className={`search-tab ${searchMode === 'name' ? 'active' : ''}`} onClick={() => setSearchMode('name')} type="button">Name</button>
                                    <button className={`search-tab ${searchMode === 'traceId' ? 'active' : ''}`} onClick={() => setSearchMode('traceId')} type="button">Trace ID</button>
                                </div>
                                {searchMode !== 'traceId' && (
                                    <div className="form-group"><label>PNR Number</label><input type="text" placeholder="e.g. BBM64K" value={pnr} onChange={(e) => setPnr(e.target.value.toUpperCase())} required={searchMode !== 'traceId'} /></div>
                                )}
                                {searchMode === 'bookingId' ? (
                                    <div className="form-group"><label>Booking ID</label><input type="text" placeholder="e.g. 1288956" value={bookingId} onChange={(e) => setBookingId(e.target.value)} required={searchMode === 'bookingId'} /></div>
                                ) : searchMode === 'name' ? (
                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        <div className="form-group" style={{ flex: 1 }}><label>First Name</label><input type="text" placeholder="e.g. Riya" value={firstName} onChange={(e) => setFirstName(e.target.value)} required={searchMode === 'name'} /></div>
                                        <div className="form-group" style={{ flex: 1 }}><label>Last Name</label><input type="text" placeholder="e.g. Sinha" value={lastName} onChange={(e) => setLastName(e.target.value)} required={searchMode === 'name'} /></div>
                                    </div>
                                ) : (
                                    <div className="form-group"><label>Trace ID</label><input type="text" placeholder="e.g. caef5986..." value={traceId} onChange={(e) => setTraceId(e.target.value)} required={searchMode === 'traceId'} /></div>
                                )}
                            </>
                        ) : (
                            <div className="form-group">
                                <label>Hotel Booking ID</label>
                                <input type="text" placeholder="e.g. 1288956 or HBL..." value={hotelBookingId} onChange={(e) => setHotelBookingId(e.target.value)} required />
                            </div>
                        )}
                        <button type="submit" className="btn-search" disabled={loading}>{loading ? 'Searching...' : 'Find Booking'}</button>
                    </form>
                </div>

                {/* RESULTS */}
                {bookingData && bookingData.type === 'flight' && (
                    <div className="results-card">
                        <div className="results-header">
                            <div><h3 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>PNR: {bookingData.data.PNR}</h3><span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>Booking ID: {bookingData.data.BookingId}</span></div>
                            <div>
                                {bookingData.data.TicketStatus === 1 ? <div className="status-badge"><CheckCircle size={16} /> Confirmed</div>
                                : bookingData.data.TicketStatus === 2 ? <div className="status-badge pending"><AlertCircle size={16} /> Pending</div>
                                : <div className="status-badge cancelled"><XCircle size={16} /> Cancelled</div>}
                            </div>
                        </div>
                        <div className="results-body">
                            <h4 className="section-title"><Users size={20} style={{ marginRight: '10px', color: '#e8151b' }} /> Passenger Details</h4>
                            <ul className="passenger-list mb-40">
                                {bookingData.data.Passenger?.map((pax, index) => (
                                    <li key={index}><div className="passenger-icon"><i className="fa-solid fa-user"></i></div><div><strong style={{ display: 'block', fontSize: '16px', color: '#0d1b2a' }}>{pax.Title} {pax.FirstName} {pax.LastName}</strong><span style={{ fontSize: '13px', color: '#666' }}>Ticket No: {pax.Ticket?.TicketNumber || 'Pending'}</span></div></li>
                                ))}
                            </ul>
                            <h4 className="section-title"><Plane size={20} style={{ marginRight: '10px', color: '#e8151b' }} /> Flight Itinerary</h4>
                            <div className="info-grid mb-40">
                                <div className="info-item"><span>Origin</span><strong>{bookingData.data.Origin}</strong></div>
                                <div className="info-item"><span>Destination</span><strong>{bookingData.data.Destination}</strong></div>
                            </div>
                            {bookingData.data.Segments?.map((seg, idx) => (
                                <div key={idx} style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', marginBottom: '10px', background: '#fafafa' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div><strong style={{ display: 'block', fontSize: '16px' }}>{seg.Airline?.AirlineName}</strong><span style={{ fontSize: '13px', color: '#666' }}>{seg.Airline?.AirlineCode}-{seg.Airline?.FlightNumber}</span></div>
                                        <div className="text-end"><strong style={{ fontSize: '18px', color: '#e8151b' }}>{new Date(seg.Origin?.DepTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong><span style={{ display: 'block', fontSize: '13px', color: '#666' }}>{seg.Origin?.Airport?.AirportCode}</span></div>
                                        <ArrowRight size={24} color="#ccc" />
                                        <div><strong style={{ fontSize: '18px', color: '#e8151b' }}>{new Date(seg.Destination?.ArrTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong><span style={{ display: 'block', fontSize: '13px', color: '#666' }}>{seg.Destination?.Airport?.AirportCode}</span></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {bookingData && bookingData.type === 'hotel' && (
                    <div className="results-card">
                        <div className="results-header" style={{ background: '#059669' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>TBO Booking ID: {bookingData.data.BookingId}</h3>
                                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>Confirmation No: {bookingData.data.ConfirmationNo || 'Pending from Hotel'}</span>
                            </div>
                            <div>
                                {bookingData.data.BookingStatus === 1 ? <div className="status-badge"><CheckCircle size={16} /> Confirmed</div>
                                : bookingData.data.BookingStatus === 2 ? <div className="status-badge pending"><AlertCircle size={16} /> Pending</div>
                                : bookingData.data.BookingStatus === 3 ? <div className="status-badge cancelled"><XCircle size={16} /> Cancelled</div>
                                : <div className="status-badge" style={{ background: '#fff' }}><AlertCircle size={16} color="#059669" /> {bookingData.data.BookingStatus}</div>}
                            </div>
                        </div>
                        <div className="results-body">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                <h4 className="section-title" style={{ margin: 0, border: 'none', padding: 0 }}><Building2 size={20} style={{ marginRight: '10px', color: '#059669' }} /> Hotel Details</h4>
                                
                                {bookingData.data.BookingStatus !== 3 && bookingData.data.BookingStatus !== 'Cancelled' && (
                                    <button className="btn-cancel" onClick={handleCancelHotel} disabled={cancelling}>
                                        {cancelling ? 'Processing...' : <><XCircle size={16} /> Request Cancellation</>}
                                    </button>
                                )}
                            </div>
                            
                            <div className="info-grid mb-40">
                                <div className="info-item"><span>Hotel Name</span><strong>{bookingData.data.HotelName}</strong></div>
                                <div className="info-item"><span>City</span><strong>{bookingData.data.CityId || 'Confirmed'}</strong></div>
                                <div className="info-item"><span>Guest Name</span><strong>{bookingData.data.HotelRoomsDetails?.[0]?.HotelPassenger?.[0]?.FirstName} {bookingData.data.HotelRoomsDetails?.[0]?.HotelPassenger?.[0]?.LastName}</strong></div>
                            </div>

                            <h4 className="section-title"><Calendar size={20} style={{ marginRight: '10px', color: '#059669' }} /> Stay Itinerary</h4>
                            {bookingData.data.HotelRoomsDetails?.map((room, idx) => (
                                <div key={idx} style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', marginBottom: '10px', background: '#fafafa' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <div>
                                            <strong style={{ display: 'block', fontSize: '16px', color: '#059669', marginBottom: '6px' }}>{room.RoomTypeName}</strong>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#475569' }}>
                                                <Users size={14} /> Adults: {room.HotelPassenger?.length || 1}
                                            </div>
                                        </div>
                                        <div>
                                            <strong style={{ display: 'block', fontSize: '14px', color: '#64748b', textTransform: 'uppercase' }}>Amount</strong>
                                            <div style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a2e' }}>₹{room.Price?.PublishedPrice || room.Price?.OfferedPriceRoundedOff || 'N/A'}</div>
                                        </div>
                                    </div>
                                    {room.CancellationPolicies?.length > 0 && (
                                        <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #cbd5e1', fontSize: '13px', color: '#64748b' }}>
                                            <strong style={{ color: '#475569' }}>Cancellation Policy:</strong><br/>
                                            {room.CancellationPolicies.map((cp, i) => (
                                                <div key={i}>Charge {cp.Charge}% from {cp.FromDate?.split('T')[0]} to {cp.ToDate?.split('T')[0]}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

export default ManageBookingInner;
