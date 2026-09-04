import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Plane, Calendar, User, Clock, CheckCircle, XCircle, FileText, AlertTriangle } from 'lucide-react';
import HeaderOne from '../Components/Header/HeaderOne';
import FooterOne from '../Components/Footer/FooterOne';
import FlightCancellationModal from '../Components/Booking/FlightCancellationModal';

export default function FlightBookingDetails() {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [showCancelModal, setShowCancelModal] = useState(false);

    const [cancellationInfo, setCancellationInfo] = useState(null);

    useEffect(() => {
        fetchBookingDetails();
    }, [id]);

    // Polling logic for cancellation status
    useEffect(() => {
        let interval;
        if (cancellationInfo && (cancellationInfo.status === 'Pending' || cancellationInfo.status === 'Processing')) {
            interval = setInterval(async () => {
                try {
                    const cancelRes = await axios.post(`${process.env.REACT_APP_FLIGHT_API_BASE_URL}/cancellation-by-booking`, {
                        BookingId: id
                    });
                    if (cancelRes.data?.success && cancelRes.data?.data) {
                        setCancellationInfo(cancelRes.data.data);
                        // If status updated to Completed or Rejected, stop polling and refresh booking
                        if (cancelRes.data.data.status === 'Completed' || cancelRes.data.data.status === 'Rejected') {
                            clearInterval(interval);
                            fetchBookingDetails();
                        }
                    }
                } catch(e) {
                    console.error("Polling failed", e);
                }
            }, 30000); // Poll every 30 seconds
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [cancellationInfo?.status, id]);

    const fetchBookingDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.post(`${process.env.REACT_APP_FLIGHT_API_BASE_URL}/booking-details`, {
                BookingId: id,
                PNR: ""
            });

            if (response.data && response.data.Response && response.data.Response.ResponseStatus === 1) {
                setBooking(response.data.Response.FlightItinerary);
                
                // Fetch cancellation info if any
                try {
                    const cancelRes = await axios.post(`${process.env.REACT_APP_FLIGHT_API_BASE_URL}/cancellation-by-booking`, {
                        BookingId: id
                    });
                    if (cancelRes.data?.success && cancelRes.data?.data) {
                        setCancellationInfo(cancelRes.data.data);
                    }
                } catch(e) {
                    console.error("Failed to fetch cancellation info", e);
                }

            } else {
                setError(response.data?.Response?.Error?.ErrorMessage || 'Failed to load booking details from API.');
            }
        } catch (err) {
            setError(err.response?.data?.details?.ErrorMessage || err.response?.data?.message || 'Error fetching booking details.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="py-5 text-center" style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}><h4>Loading booking details...</h4></div>
    );

    if (error) return (
        <div className="py-5" style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}><div className="alert alert-danger mx-4">{error}</div></div>
    );

    if (!booking) return (
        <div className="py-5 text-center" style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}><h4>Booking not found.</h4></div>
    );

    const segments = Array.isArray(booking.Segments) ? booking.Segments.flat() : [];
    const pax = booking.Passenger || [];
    const fare = booking.Fare || {};

    const isCancelled = booking.Status === 3 || booking.Status === 'Cancelled'; // Depending on TBO status code
    const isConfirmed = booking.Status === 1 || booking.Status === 'Confirmed' || booking.Status === 2; // Assuming 1/2 are confirmed

    const firstSegment = segments[0];
    const isPastFlight = firstSegment && new Date(firstSegment.Origin.DepTime) < new Date();

    return (
        <div className="fbd-wrapper">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@500;600;700;800&display=swap');
                .fbd-wrapper { font-family: 'Inter', sans-serif; background: #fff; border-radius: 24px; padding: 32px; box-shadow: 0 10px 40px rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.04); }
                .fbd-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; flex-wrap: wrap; gap: 16px; }
                .fbd-title { font-family: 'Outfit', sans-serif; font-size: 32px; font-weight: 800; color: #0f172a; margin: 0; }
                .fbd-back-btn { padding: 10px 18px; border-radius: 12px; font-size: 14px; font-weight: 600; background: #f8fafc; color: #475569; border: 1px solid #e2e8f0; cursor: pointer; transition: 0.2s; text-decoration: none; display: flex; align-items: center; gap: 8px; border: none; }
                .fbd-back-btn:hover { background: #e2e8f0; color: #0f172a; }
                
                .fbd-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 30px; }
                @media(max-width: 992px) { .fbd-grid { grid-template-columns: 1fr; } }
                
                .fbd-card { background: #fff; border-radius: 20px; border: 1px solid #e2e8f0; margin-bottom: 24px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
                .fbd-card-header { padding: 20px 24px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
                .fbd-card-title { font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 700; color: #0f172a; margin: 0; display: flex; align-items: center; gap: 8px; }
                .fbd-card-body { padding: 24px; }
                
                .fbd-badge { padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; }
                .fbd-badge.success { background: #dcfce7; color: #166534; }
                .fbd-badge.danger { background: #fee2e2; color: #991b1b; }
                
                /* Segment Styles */
                .fbd-segment { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-top: 16px; position: relative; overflow: hidden; }
                .fbd-segment::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: #0f172a; }
                .fbd-airline-row { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px dashed #e2e8f0; }
                .fbd-airline-logo { width: 48px; height: 48px; border-radius: 12px; border: 1px solid #f1f5f9; padding: 4px; object-fit: contain; }
                .fbd-airline-name { font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 2px 0; }
                .fbd-airline-code { font-size: 13px; color: #64748b; margin: 0; font-weight: 500; }
                
                .fbd-route-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
                .fbd-time-box { text-align: left; min-width: 80px; }
                .fbd-time-box.right { text-align: right; }
                .fbd-time { font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 800; color: #0f172a; line-height: 1.2; }
                .fbd-city { font-size: 16px; font-weight: 700; color: #334155; margin: 4px 0 2px 0; }
                .fbd-date { font-size: 13px; color: #64748b; font-weight: 500; }
                .fbd-airport { font-size: 11px; color: #94a3b8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 120px; margin-top: 2px; }
                
                .fbd-duration-box { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 0 16px; }
                .fbd-duration { font-size: 12px; font-weight: 600; color: #64748b; margin-bottom: 8px; background: #f8fafc; padding: 4px 12px; border-radius: 20px; border: 1px solid #f1f5f9; display: flex; align-items: center; gap: 4px; }
                .fbd-line { width: 100%; height: 2px; background: #e2e8f0; position: relative; }
                .fbd-plane-icon { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); color: #0f172a; background: #fff; padding: 0 8px; }
                
                /* Passengers */
                .fbd-pax-table { width: 100%; border-collapse: collapse; }
                .fbd-pax-table th { text-align: left; padding: 12px 16px; font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; background: #f8fafc; }
                .fbd-pax-table th:first-child { border-top-left-radius: 12px; border-bottom-left-radius: 12px; }
                .fbd-pax-table th:last-child { border-top-right-radius: 12px; border-bottom-right-radius: 12px; }
                .fbd-pax-table td { padding: 16px; font-size: 14px; font-weight: 600; color: #0f172a; border-bottom: 1px solid #f1f5f9; }
                .fbd-pax-table tr:last-child td { border-bottom: none; }
                
                /* Fare Summary */
                .fbd-fare-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; }
                .fbd-fare-label { font-size: 14px; color: #475569; font-weight: 500; }
                .fbd-fare-value { font-size: 15px; font-weight: 600; color: #0f172a; }
                .fbd-fare-total { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-top: 1px dashed #cbd5e1; margin-top: 10px; }
                .fbd-fare-total-label { font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 800; color: #0f172a; }
                .fbd-fare-total-value { font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 800; color: #0f172a; }
                
                .fbd-cancel-btn { width: 100%; padding: 14px; background: #fff; color: #ef4444; border: 1.5px solid #ef4444; border-radius: 12px; font-size: 15px; font-weight: 700; cursor: pointer; transition: 0.2s; display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 20px; }
                .fbd-cancel-btn:hover { background: #fef2f2; }
                
                .fbd-timeline-item { display: flex; margin-bottom: 16px; position: relative; }
                .fbd-timeline-item::before { content: ''; position: absolute; left: 11px; top: 24px; bottom: -16px; width: 2px; background: #e2e8f0; }
                .fbd-timeline-item:last-child::before { display: none; }
                .fbd-timeline-icon { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; z-index: 1; }
                .fbd-timeline-icon.primary { background: #3b82f6; border: 4px solid #eff6ff; }
                .fbd-timeline-icon.success { background: #22c55e; border: 4px solid #dcfce7; }
                .fbd-timeline-icon.danger { background: #ef4444; border: 4px solid #fee2e2; }
                .fbd-timeline-icon.gray { background: #cbd5e1; border: 4px solid #f8fafc; }
                .fbd-timeline-content { margin-left: 16px; }
                .fbd-timeline-title { font-size: 14px; font-weight: 700; color: #0f172a; margin: 0 0 4px 0; }
                .fbd-timeline-desc { font-size: 12px; color: #64748b; margin: 0; }
            `}</style>

            <div className="fbd-header">
                <h2 className="fbd-title">Booking #{booking.BookingId}</h2>
                <button onClick={() => window.history.back()} className="fbd-back-btn">
                    &larr; Back to Bookings
                </button>
            </div>
            
            <div className="fbd-grid">
                <div className="fbd-main-col">
                    <div className="fbd-card">
                        <div className="fbd-card-header">
                            <h4 className="fbd-card-title"><Plane size={20} color="#0f172a" /> Flight Itinerary</h4>
                            <div className={`fbd-badge ${isCancelled ? 'danger' : 'success'}`}>
                                {isCancelled ? <><XCircle size={14} /> Cancelled</> : <><CheckCircle size={14} /> Confirmed</>}
                            </div>
                        </div>
                        <div className="fbd-card-body">
                            <div style={{ display: 'flex', gap: '40px', marginBottom: '20px' }}>
                                <div>
                                    <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>PNR</div>
                                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', letterSpacing: '1px' }}>{booking.PNR || 'Pending'}</div>
                                </div>
                                {booking.IsRefundable !== undefined && (
                                    <div>
                                        <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>Type</div>
                                        <div style={{ fontSize: '14px', fontWeight: 600, color: booking.IsRefundable ? '#166534' : '#991b1b', background: booking.IsRefundable ? '#dcfce7' : '#fee2e2', padding: '4px 10px', borderRadius: '8px' }}>
                                            {booking.IsRefundable ? 'Refundable' : 'Non-Refundable'}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {segments.map((segment, idx) => (
                                <div key={idx} className="fbd-segment">
                                    <div className="fbd-airline-row">
                                        <img
                                            src={`https://tbo-flight-images.s3.ap-south-1.amazonaws.com/AirlineLogo/${segment.Airline.AirlineCode}.png`}
                                            alt={segment.Airline.AirlineCode}
                                            className="fbd-airline-logo"
                                            onError={(e) => e.target.style.display = 'none'}
                                        />
                                        <div>
                                            <p className="fbd-airline-name">{segment.Airline.AirlineName}</p>
                                            <p className="fbd-airline-code">{segment.Airline.AirlineCode} - {segment.Airline.FlightNumber}</p>
                                        </div>
                                    </div>

                                    <div className="fbd-route-row">
                                        <div className="fbd-time-box">
                                            <div className="fbd-time">{new Date(segment.Origin.DepTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                            <div className="fbd-city">{segment.Origin.Airport.CityCode}</div>
                                            <div className="fbd-date">{new Date(segment.Origin.DepTime).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                            <div className="fbd-airport">{segment.Origin.Airport.AirportName}</div>
                                        </div>

                                        <div className="fbd-duration-box">
                                            <div className="fbd-duration">
                                                <Clock size={12} />
                                                {Math.floor(segment.Duration / 60)}h {segment.Duration % 60}m
                                            </div>
                                            <div className="fbd-line">
                                                <Plane size={16} className="fbd-plane-icon" />
                                            </div>
                                        </div>

                                        <div className="fbd-time-box right">
                                            <div className="fbd-time">{new Date(segment.Destination.ArrTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                            <div className="fbd-city">{segment.Destination.Airport.CityCode}</div>
                                            <div className="fbd-date">{new Date(segment.Destination.ArrTime).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                            <div className="fbd-airport">{segment.Destination.Airport.AirportName}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="fbd-card">
                        <div className="fbd-card-header">
                            <h4 className="fbd-card-title"><User size={20} color="#0f172a" /> Passenger Details</h4>
                        </div>
                        <div className="fbd-card-body" style={{ padding: '16px 24px' }}>
                            <div style={{ overflowX: 'auto' }}>
                                <table className="fbd-pax-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Type</th>
                                            <th>Ticket Number</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pax.map((p, idx) => (
                                            <tr key={idx}>
                                                <td>{p.Title} {p.FirstName} {p.LastName}</td>
                                                <td>{p.PaxType === 1 ? 'Adult' : p.PaxType === 2 ? 'Child' : 'Infant'}</td>
                                                <td>{p.Ticket?.TicketNumber || 'Pending'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="fbd-sidebar-col">
                    <div className="fbd-card">
                        <div className="fbd-card-header">
                            <h4 className="fbd-card-title"><FileText size={20} color="#0f172a" /> Fare Summary</h4>
                        </div>
                        <div className="fbd-card-body">
                            <div className="fbd-fare-row">
                                <span className="fbd-fare-label">Base Fare</span>
                                <span className="fbd-fare-value">₹{fare.BaseFare}</span>
                            </div>
                            <div className="fbd-fare-row">
                                <span className="fbd-fare-label">Taxes & Fees</span>
                                <span className="fbd-fare-value">₹{fare.Tax + (fare.OtherCharges || 0)}</span>
                            </div>
                            
                            <div className="fbd-fare-total">
                                <span className="fbd-fare-total-label">Total Paid</span>
                                <span className="fbd-fare-total-value">₹{fare.OfferedFare}</span>
                            </div>

                            {!isCancelled && !cancellationInfo && !isPastFlight && (
                                <button 
                                    className="fbd-cancel-btn"
                                    onClick={() => setShowCancelModal(true)}
                                >
                                    <AlertTriangle size={18} /> Cancel Booking
                                </button>
                            )}

                            {cancellationInfo && (
                                <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
                                    <h5 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>Cancellation Status</h5>
                                    
                                    <div className="fbd-timeline-item">
                                        <div className="fbd-timeline-icon primary"></div>
                                        <div className="fbd-timeline-content">
                                            <h6 className="fbd-timeline-title">Cancellation Requested</h6>
                                            <p className="fbd-timeline-desc">Request submitted successfully</p>
                                        </div>
                                    </div>
                                    <div className="fbd-timeline-item">
                                        <div className={`fbd-timeline-icon ${cancellationInfo.status === 'Pending' || cancellationInfo.status === 'Processing' ? 'primary' : cancellationInfo.status === 'Completed' ? 'primary' : 'gray'}`}></div>
                                        <div className="fbd-timeline-content">
                                            <h6 className="fbd-timeline-title">Processing</h6>
                                            <p className="fbd-timeline-desc">Reviewing with airline</p>
                                        </div>
                                    </div>
                                    <div className="fbd-timeline-item">
                                        <div className={`fbd-timeline-icon ${cancellationInfo.status === 'Completed' ? 'success' : cancellationInfo.status === 'Rejected' ? 'danger' : 'gray'}`}></div>
                                        <div className="fbd-timeline-content">
                                            <h6 className="fbd-timeline-title">{cancellationInfo.status === 'Rejected' ? 'Rejected' : 'Completed & Refunded'}</h6>
                                            <p className="fbd-timeline-desc">{cancellationInfo.status === 'Rejected' ? 'Airline rejected request' : 'Refund initiated if applicable'}</p>
                                        </div>
                                    </div>

                                    <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', marginTop: '20px', border: '1px solid #e2e8f0' }}>
                                        <div className="fbd-fare-row">
                                            <span className="fbd-fare-label">Original Fare</span>
                                            <span className="fbd-fare-value">₹{fare.OfferedFare}</span>
                                        </div>
                                        <div className="fbd-fare-row">
                                            <span className="fbd-fare-label">Cancellation Charges</span>
                                            <span className="fbd-fare-value" style={{ color: '#ef4444' }}>- ₹{cancellationInfo.cancellationCharge || 0}</span>
                                        </div>
                                        {cancellationInfo.refundDetails?.B2BAmendmentCharges ? (
                                        <div className="fbd-fare-row">
                                            <span className="fbd-fare-label">Agency Fees</span>
                                            <span className="fbd-fare-value" style={{ color: '#ef4444' }}>- ₹{cancellationInfo.refundDetails.B2BAmendmentCharges}</span>
                                        </div>
                                        ) : null}
                                        <div className="fbd-fare-total" style={{ borderTop: '1px dashed #cbd5e1', marginTop: '8px', paddingTop: '12px', paddingBottom: '0' }}>
                                            <span className="fbd-fare-total-label" style={{ fontSize: '15px' }}>Total Refund</span>
                                            <span className="fbd-fare-total-value" style={{ fontSize: '20px', color: '#166534' }}>₹{cancellationInfo.refundAmount || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showCancelModal && (
                <FlightCancellationModal 
                    booking={booking} 
                    onClose={() => setShowCancelModal(false)} 
                    onSuccess={() => {
                        setShowCancelModal(false);
                        fetchBookingDetails();
                    }}
                />
            )}
        </div>
    );
}
