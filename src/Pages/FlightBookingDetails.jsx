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

    return (
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#111', margin: 0 }}>Booking #{booking.BookingId}</h2>
                <button onClick={() => window.history.back()} className="btn btn-outline-secondary btn-sm" style={{ borderRadius: '8px' }}>
                    &larr; Back to Bookings
                </button>
            </div>
            
            <div className="row">
                        {/* Main Info */}
                        <div className="col-lg-8">
                            <div className="card shadow-sm border-0 mb-4 rounded-4">
                                <div className="card-header bg-white border-bottom py-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h4 className="m-0 fw-bold">Flight Itinerary</h4>
                                        <div>
                                            <span className={`badge ${isCancelled ? 'bg-danger' : 'bg-success'} px-3 py-2`} style={{borderRadius: '20px', fontSize: '14px'}}>
                                                {isCancelled ? <><XCircle size={16} className="me-1"/> Cancelled</> : <><CheckCircle size={16} className="me-1"/> Confirmed</>}
                                            </span>
                                        </div>
                                    </div>
                                    {booking.IsRefundable !== undefined && (
                                        <div className="mt-2 text-muted" style={{fontSize: '13px'}}>
                                            {booking.IsRefundable ? '✓ Refundable' : '⚠ Non-Refundable'}
                                        </div>
                                    )}
                                </div>
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                                        <div>
                                            <div className="text-muted small">PNR</div>
                                            <div className="fs-5 fw-bold text-dark">{booking.PNR || 'Pending'}</div>
                                        </div>
                                        <div>
                                            <div className="text-muted small">Booking ID</div> 
                                            <div className="fs-5 fw-bold text-dark">{booking.BookingId}</div>
                                        </div>
                                    </div>

                                    {segments.map((segment, idx) => (
                                        <div key={idx} className="flight-segment mb-4 bg-light p-3 rounded-3">
                                            {/* Airline Header - BULLETPROOF GRID LAYOUT */}
                                            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '12px', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                                                {/* 1. Image */}
                                                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                                    <img
                                                        src={`https://tbo-flight-images.s3.ap-south-1.amazonaws.com/AirlineLogo/${segment.Airline.AirlineCode}.png`}
                                                        alt={segment.Airline.AirlineCode}
                                                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                                        onError={(e) => e.target.style.display = 'none'}
                                                    />
                                                </div>
                                                
                                                {/* 2. Airline Name & Number (Truncated if too long) */}
                                                <div style={{ minWidth: 0, overflow: 'hidden' }}>
                                                    <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {segment.Airline.AirlineName}
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                                                        {segment.Airline.AirlineCode} - {segment.Airline.FlightNumber}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Route Row */}
                                            <div className="d-flex align-items-center gap-2" style={{ width: '100%' }}>
                                                {/* Origin */}
                                                <div style={{ textAlign: 'left', minWidth: 80 }}>
                                                    <div className="fs-5 fw-bold text-dark">{new Date(segment.Origin.DepTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                    <div className="fw-bold" style={{ fontSize: 14 }}>{segment.Origin.Airport.CityCode}</div>
                                                    <div className="text-muted" style={{ fontSize: 11 }}>{new Date(segment.Origin.DepTime).toLocaleDateString()}</div>
                                                    <div className="text-muted" style={{ fontSize: 11, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{segment.Origin.Airport.AirportName}</div>
                                                </div>

                                                {/* Flight line */}
                                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                                    <div className="text-muted" style={{ fontSize: 11 }}>
                                                        <Clock size={11} style={{ marginRight: 2 }} />
                                                        {Math.floor(segment.Duration / 60)}h {segment.Duration % 60}m
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 4 }}>
                                                        <div style={{ flex: 1, height: 2, background: '#cbcde1ff', borderRadius: 2 }} />
                                                        <Plane size={18} style={{ color: '#3b82f6', flexShrink: 0 }} />
                                                        <div style={{ flex: 1, height: 2, background: '#cbd5e1', borderRadius: 2 }} />
                                                    </div>
                                                    <div className="text-muted" style={{ fontSize: 11 }}>Direct</div>
                                                </div>

                                                {/* Destination */}
                                                <div style={{ textAlign: 'right', minWidth: 80 }}>
                                                    <div className="fs-5 fw-bold text-dark">{new Date(segment.Destination.ArrTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                    <div className="fw-bold" style={{ fontSize: 14 }}>{segment.Destination.Airport.CityCode}</div>
                                                    <div className="text-muted" style={{ fontSize: 11 }}>{new Date(segment.Destination.ArrTime).toLocaleDateString()}</div>
                                                    <div className="text-muted" style={{ fontSize: 11, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: 'auto' }}>{segment.Destination.Airport.AirportName}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="card shadow-sm border-0 mb-4 rounded-4">
                                <div className="card-header bg-white border-bottom py-3">
                                    <h5 className="m-0 fw-bold">Passenger Details</h5>
                                </div>
                                <div className="card-body p-0">
                                    <div className="table-responsive">
                                        <table className="table table-borderless table-striped m-0">
                                            <thead className="bg-light text-muted small">
                                                <tr>
                                                    <th className="ps-4">Name</th>
                                                    <th>Type</th>
                                                    <th>Ticket Number</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pax.map((p, idx) => (
                                                    <tr key={idx}>
                                                        <td className="ps-4 fw-medium text-dark">{p.Title} {p.FirstName} {p.LastName}</td>
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

                        {/* Sidebar */}
                        <div className="col-lg-4">
                            <div className="card shadow-sm border-0 mb-4 rounded-4">
                                <div className="card-header bg-white border-bottom py-3">
                                    <h5 className="m-0 fw-bold">Fare Summary</h5>
                                </div>
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Base Fare</span>
                                        <span className="fw-medium">₹{fare.BaseFare}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Taxes & Fees</span>
                                        <span className="fw-medium">₹{fare.Tax + fare.OtherCharges}</span>
                                    </div>
                                    <hr className="my-3"/>
                                    <div className="d-flex justify-content-between mb-3">
                                        <span className="fw-bold fs-5">Total Paid</span>
                                        <span className="fw-bold fs-5 text-primary">₹{fare.OfferedFare}</span>
                                    </div>

                                    {!isCancelled && !cancellationInfo && (
                                        <div className="d-grid mt-4">
                                            <button 
                                                className="btn btn-outline-danger py-2 d-flex align-items-center justify-content-center"
                                                onClick={() => {

                                                    setShowCancelModal(true);
                                                }}
                                                style={{ borderRadius: '8px', fontWeight: 'bold' }}
                                            >
                                                <AlertTriangle size={18} className="me-2"/> Cancel Booking
                                            </button>
                                        </div>
                                    )}

                                    {cancellationInfo && (
                                        <div className="mt-4 pt-4 border-top">
                                            <h6 className="fw-bold mb-3 text-dark">Cancellation Status</h6>
                                            
                                            {/* Timeline UI */}
                                            <div className="timeline mb-4 position-relative px-2">
                                                <div className="position-absolute" style={{left: '16px', top: '10px', bottom: '10px', width: '2px', backgroundColor: '#e9ecef', zIndex: 0}}></div>
                                                
                                                <div className="d-flex mb-3 position-relative z-1">
                                                    <div className="bg-primary rounded-circle d-flex justify-content-center align-items-center flex-shrink-0" style={{width: 14, height: 14, marginTop: 4, zIndex: 1}}/>
                                                    <div className="ms-3">
                                                        <div className="fw-bold small text-dark">Cancellation Requested</div>
                                                        <div className="text-muted" style={{fontSize: '0.75rem'}}>Request submitted successfully</div>
                                                    </div>
                                                </div>

                                                <div className="d-flex mb-3 position-relative z-1">
                                                    <div className={`rounded-circle d-flex justify-content-center align-items-center flex-shrink-0 ${cancellationInfo.status === 'Pending' || cancellationInfo.status === 'Processing' ? 'bg-primary' : cancellationInfo.status === 'Completed' ? 'bg-primary' : 'bg-secondary'}`} style={{width: 14, height: 14, marginTop: 4, zIndex: 1}}/>
                                                    <div className="ms-3">
                                                        <div className={`fw-bold small ${cancellationInfo.status === 'Completed' || cancellationInfo.status === 'Processing' ? 'text-dark' : 'text-muted'}`}>Processing</div>
                                                        <div className="text-muted" style={{fontSize: '0.75rem'}}>Reviewing with airline</div>
                                                    </div>
                                                </div>

                                                {cancellationInfo.status === 'Rejected' ? (
                                                    <div className="d-flex position-relative z-1">
                                                        <div className="bg-danger rounded-circle d-flex justify-content-center align-items-center flex-shrink-0" style={{width: 14, height: 14, marginTop: 4, zIndex: 1}}/>
                                                        <div className="ms-3">
                                                            <div className="fw-bold small text-danger">Rejected</div>
                                                            <div className="text-muted" style={{fontSize: '0.75rem'}}>Airline rejected request</div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="d-flex position-relative z-1">
                                                        <div className={`rounded-circle d-flex justify-content-center align-items-center flex-shrink-0 ${cancellationInfo.status === 'Completed' ? 'bg-success' : 'bg-secondary'}`} style={{width: 14, height: 14, marginTop: 4, zIndex: 1}}/>
                                                        <div className="ms-3">
                                                            <div className={`fw-bold small ${cancellationInfo.status === 'Completed' ? 'text-success' : 'text-muted'}`}>Completed & Refunded</div>
                                                            <div className="text-muted" style={{fontSize: '0.75rem'}}>Refund initiated if applicable</div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Refund Details Card */}
                                            <div className="p-3 bg-light rounded border">
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span className="small text-muted">Cancellation Status</span>
                                                    <span className={`fw-bold ${cancellationInfo.status === 'Completed' ? 'text-success' : cancellationInfo.status === 'Rejected' ? 'text-danger' : 'text-primary'}`}>{cancellationInfo.status}</span>
                                                </div>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span className="small text-muted">Refund Status</span>
                                                    <span className={`fw-bold ${cancellationInfo.status === 'Completed' ? 'text-success' : 'text-warning text-dark'}`}>
                                                        {cancellationInfo.status === 'Completed' ? 'Refund Completed' : cancellationInfo.status === 'Rejected' ? 'No Refund' : 'Refund Processing'}
                                                    </span>
                                                </div>
                                                {cancellationInfo.status === 'Completed' && (
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span className="small text-muted">Expected Refund Date</span>
                                                    <span className="fw-medium text-dark">{new Date(new Date().setDate(new Date().getDate() + 3)).toLocaleDateString()}</span>
                                                </div>
                                                )}
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span className="small text-muted">Req ID</span>
                                                    <span className="fw-medium">{cancellationInfo.changeRequestId}</span>
                                                </div>
                                                <hr className="my-2"/>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span className="small text-muted">Original Fare</span>
                                                    <span className="fw-medium">₹{fare.OfferedFare}</span>
                                                </div>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span className="small text-muted">Cancellation Charges</span>
                                                    <span className="fw-medium text-danger">- ₹{cancellationInfo.cancellationCharge || 0}</span>
                                                </div>
                                                {cancellationInfo.refundDetails?.B2BAmendmentCharges ? (
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span className="small text-muted">Agency Fees</span>
                                                    <span className="fw-medium text-danger">- ₹{cancellationInfo.refundDetails.B2BAmendmentCharges}</span>
                                                </div>
                                                ) : null}
                                                <hr className="my-2"/>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <span className="small fw-bold text-dark">Total Refund Amount</span>
                                                    <span className="fw-bold fs-5 text-success">₹{cancellationInfo.refundAmount || 0}</span>
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
