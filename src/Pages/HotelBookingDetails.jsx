import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Building2, MapPin, Calendar, Users, CreditCard, ChevronLeft, AlertCircle, FileText } from 'lucide-react';

const HOTEL_API = process.env.REACT_APP_HOTEL_API_BASE_URL || 'http://localhost:8009/api/hotel';

export default function HotelBookingDetails() {
    const { id } = useParams();
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.post(`${HOTEL_API}/booking-detail`, { BookingId: id });
                
                // The TBO API wraps details in HotelBookingDetailResponse
                const data = response.data?.GetBookingDetailResult || response.data?.HotelBookingDetailResponse || response.data;
                if (!data || (data.ResponseStatus !== 1 && data.Status?.Code !== 1)) {
                    throw new Error(data?.Error?.ErrorMessage || data?.Status?.Description || 'Failed to fetch booking details');
                }
                setDetails(data);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchDetails();
    }, [id]);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                <div style={{ display: 'inline-block', width: '30px', height: '30px', border: '3px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <div style={{ marginTop: '16px', fontWeight: '500' }}>Loading booking details...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', background: '#fff', borderRadius: '16px', border: '1px solid #fecaca' }}>
                <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 16px' }} />
                <h2 style={{ fontFamily: "'Outfit', sans-serif", color: '#1e293b' }}>Oops, something went wrong</h2>
                <p style={{ color: '#64748b', marginTop: '8px' }}>{error}</p>
                <Link to="/user-profile/hotel-bookings" style={{ display: 'inline-block', marginTop: '20px', padding: '10px 24px', background: '#e8151b', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontWeight: '600' }}>Back to My Bookings</Link>
            </div>
        );
    }

    if (!details) return null;

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
    };

    const getStatusLabel = (statusStr, statusInt) => {
        if (statusStr) {
            const s = statusStr.toLowerCase();
            if (s === 'confirmed') return { label: 'Confirmed', color: '#166534', bg: '#dcfce7' };
            if (s === 'cancelled') return { label: 'Cancelled', color: '#475569', bg: '#f1f5f9' };
            if (s === 'pending') return { label: 'Pending', color: '#92400e', bg: '#fef3c7' };
            if (s === 'vouchered') return { label: 'Vouchered', color: '#166534', bg: '#dcfce7' };
        }
        switch(statusInt) {
            case 1: return { label: 'Vouchered', color: '#166534', bg: '#dcfce7' };
            case 2: return { label: 'Confirmed', color: '#166534', bg: '#dcfce7' };
            case 3: return { label: 'Cancelled', color: '#475569', bg: '#f1f5f9' };
            default: return { label: statusStr || 'Unknown', color: '#475569', bg: '#f1f5f9' };
        }
    };

    const statusObj = getStatusLabel(details.HotelBookingStatus, details.BookingStatus);
    const rooms = details.Rooms || details.HotelRoomsDetails || [];
    const guests = rooms.length > 0 ? rooms[0].HotelPassenger : [];
    const leadGuest = guests.find(g => g.LeadPassenger) || guests[0];

    return (
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                <Link to="/user-profile/hotel-bookings" style={{ color: '#64748b', display: 'flex', alignItems: 'center' }}>
                    <ChevronLeft size={24} />
                </Link>
                <div>
                    <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: 0 }}>Booking Details</h1>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                        Booking ID: {details.BookingId} | Confirmation: {details.ConfirmationNo || 'Pending'} | Date: {formatDate(details.BookingDate)}
                    </div>
                </div>
                <div style={{ marginLeft: 'auto', background: statusObj.bg, color: statusObj.color, padding: '6px 16px', borderRadius: '20px', fontWeight: '700', fontSize: '13px', textTransform: 'uppercase' }}>
                    {statusObj.label}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#3b82f6' }}>
                        <Building2 size={20} />
                        <h3 style={{ margin: 0, fontFamily: "'Outfit', sans-serif", color: '#1e293b', fontSize: '18px' }}>Hotel Info</h3>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>{details.HotelName}</div>
                    <div style={{ fontSize: '14px', color: '#64748b', display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                        <MapPin size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                        <span>{details.AddressLine1}, {details.City}, {details.CountryCode}</span>
                    </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#3b82f6' }}>
                        <Calendar size={20} />
                        <h3 style={{ margin: 0, fontFamily: "'Outfit', sans-serif", color: '#1e293b', fontSize: '18px' }}>Stay Dates</h3>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Check In</div>
                            <div style={{ fontSize: '15px', fontWeight: '600', color: '#1e293b' }}>{formatDate(details.CheckInDate)}</div>
                        </div>
                        <div style={{ padding: '0 10px', color: '#cbd5e1' }}>→</div>
                        <div>
                            <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Check Out</div>
                            <div style={{ fontSize: '15px', fontWeight: '600', color: '#1e293b' }}>{formatDate(details.CheckOutDate)}</div>
                        </div>
                    </div>
                </div>
            </div>

            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '18px', color: '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={20} color="#3b82f6" /> Guest & Room Details
            </h3>
            
            {rooms.map((room, idx) => (
                <div key={idx} style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <div style={{ fontWeight: '600', color: '#1e293b' }}>Room {idx + 1}: {room.RoomTypeName || 'Standard Room'}</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                        {room.HotelPassenger.map((p, pIdx) => (
                            <div key={pIdx} style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', fontSize: '14px' }}>
                                <div style={{ fontWeight: '600', color: '#334155' }}>{p.Title} {p.FirstName} {p.LastName} {p.LeadPassenger && <span style={{ fontSize: '10px', background: '#3b82f6', color: '#fff', padding: '2px 6px', borderRadius: '10px', marginLeft: '6px' }}>LEAD</span>}</div>
                                {p.Age && <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>Age: {p.Age}</div>}
                                {p.Email && <div style={{ color: '#64748b', fontSize: '12px', marginTop: '2px' }}>Email: {p.Email}</div>}
                                {p.Phoneno && <div style={{ color: '#64748b', fontSize: '12px', marginTop: '2px' }}>Phone: {p.Phoneno}</div>}
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '32px' }}>
                <div>
                    <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '18px', color: '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={20} color="#3b82f6" /> Cancellation Policy
                    </h3>
                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '16px', borderRadius: '12px', color: '#991b1b', fontSize: '14px', lineHeight: '1.5' }}>
                        {rooms.length > 0 && rooms[0].CancelPolicies && rooms[0].CancelPolicies.length > 0 ? (
                            <ul style={{ margin: 0, paddingLeft: '16px' }}>
                                {rooms[0].CancelPolicies.map((cp, idx) => (
                                    <li key={idx} style={{ marginBottom: '4px' }}>
                                        Charge <b>{cp.ChargeType === 1 ? `₹${cp.CancellationCharge}` : `${cp.CancellationCharge}%`}</b> from {cp.FromDate} to {cp.ToDate}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ margin: 0 }}>{rooms.length > 0 ? rooms[0].CancellationPolicy : 'Non-refundable.'}</p>
                        )}
                    </div>
                </div>

                <div>
                    <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '18px', color: '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CreditCard size={20} color="#3b82f6" /> Payment Summary
                    </h3>
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '20px', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#475569', fontSize: '14px' }}>
                            <span>Total Amount</span>
                            <span style={{ fontWeight: '600' }}>₹{Math.round(details.InvoiceAmount || details.NetAmount || 0).toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #cbd5e1', paddingTop: '12px', color: '#1e293b', fontSize: '16px', fontWeight: '700' }}>
                            <span>Amount Paid</span>
                            <span style={{ color: '#166534' }}>₹{Math.round(details.InvoiceAmount || details.NetAmount || 0).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {details.QRCode && (
                <div style={{ marginTop: '32px', textAlign: 'center', padding: '20px', borderTop: '1px solid #e2e8f0' }}>
                    <img src={details.QRCode} alt="Booking QR" style={{ width: '120px', height: '120px', borderRadius: '8px' }} />
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>Scan for booking details</div>
                </div>
            )}
        </div>
    );
}
