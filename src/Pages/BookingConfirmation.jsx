import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import HeaderOne from '../Components/Header/HeaderOne';
import FooterOne from '../Components/Footer/FooterOne';
import { CheckCircle2, XCircle, Printer, Download, Plane, MapPin, Calendar, Clock, User, Info, Building } from 'lucide-react';

function BookingConfirmation() {
    const location = useLocation();
    const navigate = useNavigate();

    const { bookingData, itinerary } = location.state || {};

    if (!bookingData) {
        return (
            <>
                <HeaderOne />
                <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                    <XCircle size={64} color="#ef4444" style={{ marginBottom: '16px' }} />
                    <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '800', color: '#1a1a2e' }}>Booking Data Not Found</h2>
                    <p style={{ color: '#64748b', marginBottom: '24px' }}>It seems you landed here by mistake or your session expired.</p>
                    <Link to="/" className="th-btn" style={{ padding: '12px 30px', borderRadius: '30px', background: '#e8151b', color: '#fff', textDecoration: 'none', fontWeight: '700' }}>
                        Go to Home
                    </Link>
                </div>
                <FooterOne />
            </>
        );
    }

    const innerResponse = bookingData.Response || bookingData;
    const isSuccess = bookingData.ResponseStatus === 1 || innerResponse.PNR;
    const pnr = innerResponse.PNR;
    const bookingId = innerResponse.BookingId;

    const flightDetails = innerResponse.FlightItinerary || itinerary;
    const segments = flightDetails?.Segments?.[0] || [];
    const firstLeg = segments[0];
    const lastLeg = segments[segments.length - 1];

    const formatTime = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <>
            <HeaderOne />
            <section style={{ background: '#f4f7fa', padding: '60px 0', minHeight: '80vh', fontFamily: "'Inter', sans-serif" }}>
                <div className="container">
                    
                    {/* Status Header */}
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        {isSuccess ? (
                            <>
                                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', background: '#dcfce7', borderRadius: '50%', marginBottom: '20px' }}>
                                    <CheckCircle2 size={48} color="#16a34a" />
                                </div>
                                <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '800', color: '#1a1a2e', fontSize: '36px', margin: '0 0 10px 0' }}>Booking Confirmed!</h1>
                                <p style={{ color: '#475569', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
                                    Your flight ticket has been successfully booked. An email confirmation has been sent to your registered email address.
                                </p>
                            </>
                        ) : (
                            <>
                                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', background: '#fee2e2', borderRadius: '50%', marginBottom: '20px' }}>
                                    <XCircle size={48} color="#ef4444" />
                                </div>
                                <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '800', color: '#1a1a2e', fontSize: '36px', margin: '0 0 10px 0' }}>Booking Pending/Failed</h1>
                                <p style={{ color: '#475569', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
                                    Your booking could not be fully confirmed at this moment. Please check your email or contact support.
                                </p>
                            </>
                        )}
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            {/* The Ticket UI */}
                            <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', position: 'relative' }}>
                                {/* Top Color Band */}
                                <div style={{ height: '8px', background: 'linear-gradient(90deg, #e8151b 0%, #ff4b4b 100%)' }}></div>
                                
                                <div style={{ padding: '30px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px dashed #e2e8f0', paddingBottom: '24px', marginBottom: '24px' }}>
                                        <div>
                                            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Booking Reference (PNR)</div>
                                            <div style={{ fontSize: '28px', fontWeight: '800', color: '#e8151b', letterSpacing: '2px' }}>{pnr || 'PENDING'}</div>
                                            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Booking ID: {bookingId}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <img src="/assets/img/logo-main-jiyo.png" alt="Logo" style={{ height: '40px' }} />
                                            <div style={{ marginTop: '8px', fontSize: '12px', fontWeight: '600', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                                                <CheckCircle2 size={14} /> Confirmed
                                            </div>
                                        </div>
                                    </div>

                                    {/* Flight Info */}
                                    {firstLeg && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', background: '#f8fafc', padding: '20px', borderRadius: '12px' }}>
                                            <div style={{ width: '130px' }}>
                                                <div style={{ fontSize: '28px', fontWeight: '800', color: '#1a1a2e' }}>{firstLeg.Origin?.Airport?.CityCode}</div>
                                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#334155', marginTop: '4px' }}>{formatTime(firstLeg.Origin?.DepTime)}</div>
                                                <div style={{ fontSize: '13px', color: '#64748b' }}>{formatDate(firstLeg.Origin?.DepTime)}</div>
                                            </div>

                                            <div style={{ flex: 1, textAlign: 'center', padding: '0 20px', position: 'relative' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                                                    <div style={{ width: '40px', height: '40px', background: '#fff', borderRadius: '50%', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#e8151b', fontSize: '12px' }}>
                                                        {firstLeg.Airline?.AirlineCode}
                                                    </div>
                                                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>
                                                        {firstLeg.Airline?.AirlineName} <br/> {firstLeg.Airline?.FlightNumber}
                                                    </div>
                                                </div>
                                                <div style={{ height: '2px', background: '#cbd5e1', width: '100%', position: 'relative' }}>
                                                    <Plane size={16} color="#94a3b8" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#f8fafc', padding: '0 4px' }} />
                                                </div>
                                            </div>

                                            <div style={{ width: '130px', textAlign: 'right' }}>
                                                <div style={{ fontSize: '28px', fontWeight: '800', color: '#1a1a2e' }}>{lastLeg?.Destination?.Airport?.CityCode}</div>
                                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#334155', marginTop: '4px' }}>{formatTime(lastLeg?.Destination?.ArrTime)}</div>
                                                <div style={{ fontSize: '13px', color: '#64748b' }}>{formatDate(lastLeg?.Destination?.ArrTime)}</div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Passengers */}
                                    <div>
                                        <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a2e', marginBottom: '16px', borderBottom: '1px solid #f0f0f0', paddingBottom: '8px' }}>
                                            Passenger Information
                                        </h4>
                                        <div className="row">
                                            {flightDetails?.Passenger?.map((pax, idx) => (
                                                <div className="col-md-6 mb-3" key={idx}>
                                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                                        <div style={{ background: '#f1f5f9', padding: '10px', borderRadius: '8px' }}>
                                                            <User size={20} color="#64748b" />
                                                        </div>
                                                        <div>
                                                            <div style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a2e' }}>{pax.Title} {pax.FirstName} {pax.LastName}</div>
                                                            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>Ticket No: {pax.Ticket?.TicketNumber || 'Pending'}</div>
                                                            {pax.SegmentAdditionalInfo && pax.SegmentAdditionalInfo.length > 0 && (
                                                                <div style={{ fontSize: '12px', color: '#0ea5e9', fontWeight: '600', marginTop: '4px' }}>
                                                                    Seat: {pax.SegmentAdditionalInfo[0].Seat || 'Unassigned'} | Meal: {pax.SegmentAdditionalInfo[0].Meal || 'None'}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                                
                                {/* Bottom Action Bar */}
                                <div style={{ background: '#f8fafc', padding: '20px 30px', borderTop: '1px dashed #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Info size={14} /> Please carry a valid ID proof for travel.
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button onClick={() => window.print()} className="th-btn th-btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', color: '#334155', fontWeight: '600', cursor: 'pointer' }}>
                                            <Printer size={16} /> Print
                                        </button>
                                        <Link to="/" className="th-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', background: '#1a1a2e', color: '#fff', fontWeight: '600', textDecoration: 'none' }}>
                                            Back to Home
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default BookingConfirmation;

