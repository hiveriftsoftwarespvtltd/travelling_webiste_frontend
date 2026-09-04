import React, { useState } from 'react';
import axios from 'axios';
import { AlertCircle, Loader2, Info, Users, CheckCircle, X } from 'lucide-react';

export default function FlightCancellationModal({ booking, onClose, onSuccess }) {
    const [step, setStep] = useState(1); // 1: Select Type, 2: Calculate/View Charges, 3: Processing
    const [cancelType, setCancelType] = useState('full'); // 'full' or 'partial'
    const [selectedTickets, setSelectedTickets] = useState([]);
    const [selectedSectors, setSelectedSectors] = useState([]);
    
    const [charges, setCharges] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');



    const pax = booking.Passenger || [];
    
    // Safely parse segments
    const segmentsArray = Array.isArray(booking.Segments) ? booking.Segments.flat() : [];

    // Extract unique sectors from all segments (e.g., DEL-BLR)
    const uniqueSectors = Array.from(new Set(
        segmentsArray.map(seg => {
            const org = seg?.Origin?.Airport?.CityCode || '';
            const dest = seg?.Destination?.Airport?.CityCode || '';
            return org && dest ? `${org}-${dest}` : '';
        }).filter(Boolean)
    ));

    const handleCalculateCharges = async () => {
        if (cancelType === 'partial' && selectedTickets.length === 0 && selectedSectors.length === 0) {
            setError('Please select at least one passenger or sector to cancel.');
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            const payload = {
                BookingId: booking.BookingId,
                RequestType: cancelType === 'full' ? 1 : 2,
                BookingMode: 5, // Auto Cancellation mode for TBO
            };
            
            const response = await axios.post(`${process.env.REACT_APP_FLIGHT_API_BASE_URL}/cancellation-charges`, payload);
            
            if (response.data?.Response?.ResponseStatus === 1) {
                setCharges(response.data.Response);
                setStep(2);
            } else {
                setCharges({
                    CancellationCharge: 'TBD',
                    RefundAmount: 'TBD',
                    IsFallback: true,
                    Message: response.data?.Response?.Error?.ErrorMessage || 'Unable to fetch dynamic charges. The airline will calculate them offline.'
                });
                setStep(2);
            }
        } catch (err) {
            setCharges({
                CancellationCharge: 'TBD',
                RefundAmount: 'TBD',
                IsFallback: true,
                Message: err.response?.data?.details?.ErrorMessage || err.response?.data?.message || 'Error fetching charges. The airline will calculate them offline.'
            });
            setStep(2);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmCancellation = async () => {
        setStep(3); // Show processing state
        setError('');
        
        try {
            const payload = {
                BookingId: booking.BookingId,
                RequestType: cancelType === 'full' ? 1 : 2,
                CancellationType: 3, // 3 is usually 'No Show / Cancellation'
            };

            if (cancelType === 'partial') {
                if (selectedTickets.length > 0) payload.TicketId = selectedTickets;
                if (selectedSectors.length > 0) payload.Sectors = selectedSectors;
            }

            const response = await axios.post(`${process.env.REACT_APP_FLIGHT_API_BASE_URL}/send-change-request`, payload);
            
            if (response.data?.Response?.ResponseStatus === 1 || response.data?.Response?.ResponseStatus === 4) {
                // Wait for a few seconds to let backend save, then trigger success
                setTimeout(() => {
                    onSuccess();
                }, 2000);
            } else {
                setError(response.data?.Response?.Error?.ErrorMessage || 'Failed to submit cancellation request.');
                setStep(2); // Go back to charges view
            }
        } catch (err) {
            setError(err.response?.data?.details?.ErrorMessage || err.response?.data?.message || 'Error processing cancellation.');
            setStep(2);
        }
    };

    const toggleTicketSelection = (ticketId) => {
        if (selectedTickets.includes(ticketId)) {
            setSelectedTickets(selectedTickets.filter(id => id !== ticketId));
        } else {
            setSelectedTickets([...selectedTickets, ticketId]);
        }
    };

    const toggleSectorSelection = (sectorStr) => {
        if (selectedSectors.includes(sectorStr)) {
            setSelectedSectors(selectedSectors.filter(s => s !== sectorStr));
        } else {
            setSelectedSectors([...selectedSectors, sectorStr]);
        }
    };

    return (
        <div className="flight-cancel-modal-wrapper d-flex justify-content-center align-items-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 999999, padding: '20px', backdropFilter: 'blur(5px)' }}>
            <div className="bg-white rounded-4 overflow-hidden w-100 position-relative" style={{ maxWidth: '550px', zIndex: 9999999, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                
                {/* Header */}
                <div className="bg-white px-4 py-4 d-flex justify-content-between align-items-center border-bottom">
                    <div>
                        <h4 className="m-0 fw-bold text-dark d-flex align-items-center gap-2">
                            <div className="bg-danger bg-opacity-10 text-danger p-2 rounded-circle d-flex align-items-center justify-content-center">
                                <AlertCircle size={24} />
                            </div>
                            Cancel Flight Booking
                        </h4>
                        <p className="text-secondary small m-0 mt-1">Please select your cancellation preferences.</p>
                    </div>
                    {step !== 3 && (
                        <button className="btn btn-light border-0 rounded-circle d-flex align-items-center justify-content-center hover-shadow text-dark" onClick={onClose} aria-label="Close" style={{ transition: 'all 0.2s', width: '36px', height: '36px', padding: 0 }}>
                            <X size={20} strokeWidth={2.5} />
                        </button>
                    )}
                </div>

                <div className="p-4 bg-light bg-opacity-50" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                    {error && (
                        <div className="alert alert-danger border-danger border-opacity-50 d-flex align-items-start mb-4 shadow-sm">
                            <AlertCircle size={20} className="me-2 flex-shrink-0 mt-1"/>
                            <div className="fw-medium">{error}</div>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="step-1-content">
                            <h6 className="fw-bold mb-3 text-dark fs-5">What would you like to do?</h6>
                            
                            <div 
                                className="p-3 rounded-4 mb-3 d-flex align-items-start gap-3 border shadow-sm bg-white border-light-subtle"
                                onClick={() => setCancelType('full')}
                                style={{cursor: 'pointer', transition: 'all 0.2s', transform: cancelType === 'full' ? 'translateY(-2px)' : 'none'}}
                            >
                                <div className={`rounded-circle border d-flex justify-content-center align-items-center flex-shrink-0 mt-1 ${cancelType === 'full' ? 'border-primary bg-primary' : 'border-secondary'}`} style={{width: 24, height: 24}}>
                                    {cancelType === 'full' && <div className="bg-white rounded-circle" style={{width: 10, height: 10}}></div>}
                                </div>
                                <div>
                                    <h6 className={`fw-bold mb-1 fs-6 ${cancelType === 'full' ? 'text-primary' : 'text-dark'}`}>Cancel Entire Booking</h6>
                                    <p className="text-secondary small m-0">Cancel all passengers for this booking. Standard cancellation charges will apply.</p>
                                </div>
                            </div>

                            <div 
                                className="p-3 rounded-4 mb-4 d-flex align-items-start gap-3 border shadow-sm bg-white border-light-subtle"
                                onClick={() => setCancelType('partial')}
                                style={{cursor: 'pointer', transition: 'all 0.2s', transform: cancelType === 'partial' ? 'translateY(-2px)' : 'none'}}
                            >
                                <div className={`rounded-circle border d-flex justify-content-center align-items-center flex-shrink-0 mt-1 ${cancelType === 'partial' ? 'border-primary bg-primary' : 'border-secondary'}`} style={{width: 24, height: 24}}>
                                    {cancelType === 'partial' && <div className="bg-white rounded-circle" style={{width: 10, height: 10}}></div>}
                                </div>
                                <div>
                                    <h6 className={`fw-bold mb-1 fs-6 ${cancelType === 'partial' ? 'text-primary' : 'text-dark'}`}>Partial Cancellation</h6>
                                    <p className="text-secondary small m-0">Select specific passengers or sectors to cancel. Useful if only some travelers are dropping out.</p>
                                </div>
                            </div>

                            {cancelType === 'partial' && (
                                <div className="passengers-list mb-4 bg-white p-3 rounded-4 border shadow-sm">
                                    <h6 className="fw-bold mb-3 fs-6 text-dark d-flex align-items-center gap-2">
                                        <Users size={18} className="text-primary"/> Select Passengers
                                    </h6>
                                    <div className="d-flex flex-column gap-2">
                                        {pax.map((p, idx) => {
                                            const tId = p.Ticket?.TicketId;
                                            if (!tId) return null; // Cannot cancel without ticket ID
                                            const isSelected = selectedTickets.includes(tId);
                                            return (
                                                <div key={idx} className="p-3 rounded-3 border bg-white border-light-subtle d-flex align-items-center gap-3" onClick={() => toggleTicketSelection(tId)} style={{cursor: 'pointer', transition: 'all 0.2s'}}>
                                                    <div className={`rounded d-flex justify-content-center align-items-center border ${isSelected ? 'bg-primary border-primary' : 'bg-white border-secondary'}`} style={{width: 24, height: 24}}>
                                                        {isSelected && <CheckCircle size={16} className="text-white"/>}
                                                    </div>
                                                    <div>
                                                        <div className={`fw-bold ${isSelected ? 'text-primary' : 'text-dark'}`}>{p.Title} {p.FirstName} {p.LastName}</div>
                                                        <div className="small text-secondary fw-medium">Ticket: <span className="text-dark">{p.Ticket.TicketNumber}</span></div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {cancelType === 'partial' && uniqueSectors.length > 0 && (
                                <div className="sectors-list mb-4 bg-white p-3 rounded-4 border shadow-sm">
                                    <h6 className="fw-bold mb-3 fs-6 text-dark">Select Sectors</h6>
                                    <div className="d-flex flex-column gap-2">
                                        {uniqueSectors.map((sector, idx) => {
                                            const isSelected = selectedSectors.includes(sector);
                                            return (
                                                <div key={idx} className="p-3 rounded-3 border bg-white border-light-subtle d-flex align-items-center gap-3" onClick={() => toggleSectorSelection(sector)} style={{cursor: 'pointer', transition: 'all 0.2s'}}>
                                                    <div className={`rounded d-flex justify-content-center align-items-center border ${isSelected ? 'bg-primary border-primary' : 'bg-white border-secondary'}`} style={{width: 24, height: 24}}>
                                                        {isSelected && <CheckCircle size={16} className="text-white"/>}
                                                    </div>
                                                    <div className={`fw-bold ${isSelected ? 'text-primary' : 'text-dark'}`}>{sector}</div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="d-grid mt-4 pt-2">
                                <button className="btn btn-primary btn-lg rounded-pill fw-bold shadow-sm d-flex justify-content-center align-items-center gap-2" onClick={handleCalculateCharges} disabled={loading} style={{ padding: '14px 24px', letterSpacing: '0.5px' }}>
                                    {loading ? <Loader2 size={20} className="spin"/> : 'Calculate Cancellation Charges'}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && charges && (
                        <div className="step-2-content">
                            <div className="bg-warning bg-opacity-10 border border-warning border-opacity-50 p-3 rounded-4 mb-4 d-flex align-items-start gap-3 shadow-sm">
                                <Info size={24} className="text-warning flex-shrink-0 mt-1"/>
                                <div>
                                    <h6 className="fw-bold text-dark mb-1">Review Charges</h6>
                                    <p className="small text-secondary m-0">
                                        The final refund amount depends on the airline's policy and processing time. Please review carefully before confirming.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-4 border shadow-sm mb-4">
                                <h6 className="fw-bold mb-4 fs-5 text-dark border-bottom pb-3">Refund Estimate Overview</h6>
                                
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="text-secondary fw-medium fs-6">Booking Total Amount</span>
                                    <span className="fw-bold text-dark fs-6">₹{booking.Fare?.OfferedFare || 0}</span>
                                </div>
                                
                                {charges.IsFallback ? (
                                    <div className="alert alert-warning m-0">
                                        <strong>Note:</strong> {charges.Message} <br />
                                        If you proceed with cancellation, the refund (if applicable) will be processed as per airline policy.
                                    </div>
                                ) : (
                                    <>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <span className="text-secondary fw-medium fs-6">Airline Cancellation Charges</span>
                                            <span className="fw-bold text-danger fs-6">- ₹{charges.CancellationCharge || 0}</span>
                                        </div>

                                        <div className="d-flex justify-content-between align-items-center mb-4">
                                            <span className="text-secondary fw-medium fs-6">Agency Amendment Charges</span>
                                            <span className="fw-bold text-danger fs-6">- ₹{charges.B2BAmendmentCharges || 0}</span>
                                        </div>

                                        <div className="d-flex justify-content-between align-items-center pt-3 border-top border-2 border-success border-opacity-25 mt-2 bg-success bg-opacity-10 p-3 rounded-3">
                                            <span className="fw-bold fs-5 text-success">Estimated Refund</span>
                                            <span className="fw-bold fs-4 text-success">₹{charges.RefundAmount || 0}</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="d-flex gap-3">
                                <button className="btn btn-light btn-lg rounded-pill fw-bold text-dark flex-grow-1 shadow-sm" onClick={() => setStep(1)} disabled={loading} style={{ border: '1px solid #dee2e6' }}>
                                    Go Back
                                </button>
                                <button className="btn btn-danger btn-lg rounded-pill fw-bold shadow-sm d-flex justify-content-center align-items-center gap-2 flex-grow-1" onClick={handleConfirmCancellation} disabled={loading}>
                                    {loading ? <Loader2 size={20} className="spin"/> : 'Confirm Cancellation'}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="step-3-content text-center py-5 px-3 bg-white rounded-4 shadow-sm border">
                            <div className="mb-4">
                                <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                            <h3 className="fw-bold text-dark mb-3">Processing Cancellation...</h3>
                            <p className="text-secondary fs-6 px-4">
                                Please wait while we securely submit your cancellation request to the airline. <br/>
                                <strong className="text-danger">Do not close or refresh this page.</strong>
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
