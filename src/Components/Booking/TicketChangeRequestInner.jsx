import React, { useState } from 'react';
import axios from 'axios';
import { AlertTriangle, CheckCircle, Info, XCircle, FileEdit } from 'lucide-react';

function TicketChangeRequestInner() {
    const [bookingId, setBookingId] = useState('');
    const [requestType, setRequestType] = useState('1'); // 1 = Cancellation by default
    const [cancellationType, setCancellationType] = useState('3'); // 3 = No Show (as per user example)
    const [remarks, setRemarks] = useState('');
    const [ticketIds, setTicketIds] = useState('');
    const [sectorOrigin, setSectorOrigin] = useState('');
    const [sectorDestination, setSectorDestination] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);

    const handleInitialSubmit = (e) => {
        e.preventDefault();
        if (!bookingId || !requestType || !cancellationType) {
            setError('Please provide Booking ID, Request Type, and Cancellation Type.');
            return;
        }
        setShowConfirm(true);
        setError('');
        setSuccessMsg('');
    };

    const confirmRequest = async () => {
        setLoading(true);
        setError('');
        
        try {
            const payload = {
                BookingId: parseInt(bookingId),
                RequestType: parseInt(requestType),
                CancellationType: parseInt(cancellationType),
                Remarks: remarks
            };

            if (ticketIds.trim()) {
                payload.TicketId = ticketIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
            }

            if (sectorOrigin.trim() && sectorDestination.trim()) {
                payload.Sectors = [{
                    Origin: sectorOrigin.trim().toUpperCase(),
                    Destination: sectorDestination.trim().toUpperCase()
                }];
            }

            const response = await axios.post(`${process.env.REACT_APP_FLIGHT_API_BASE_URL}/send-change-request`, payload);

            if (response.data && response.data.Response && (response.data.Response.ResponseStatus === 1 || response.data.Response.ResponseStatus === 4)) {
                setSuccessMsg('Your change request has been successfully submitted to the airline.');
                setShowConfirm(false);
            } else {
                setError('Failed to submit change request. Invalid response from server.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error communicating with the cancellation service.');
            setShowConfirm(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="change-request-area pt-120 pb-120" style={{ backgroundColor: '#f4f6f9' }}>
            <style>{`
                .cr-form-container {
                    background: #fff;
                    padding: 45px;
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
                    max-width: 650px;
                    margin: 0 auto;
                    border-top: 4px solid #f57f17; /* warning color */
                }
                .cr-form-group {
                    margin-bottom: 22px;
                }
                .cr-form-group label {
                    font-weight: 600;
                    margin-bottom: 8px;
                    display: block;
                    color: #0d1b2a;
                    font-size: 15px;
                }
                .cr-form-group input, .cr-form-group select, .cr-form-group textarea {
                    width: 100%;
                    padding: 14px 16px;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    font-size: 15px;
                    color: #333;
                    transition: border-color 0.3s;
                    background: #fafafa;
                }
                .cr-form-group input:focus, .cr-form-group select:focus, .cr-form-group textarea:focus {
                    border-color: #f57f17;
                    outline: none;
                    background: #fff;
                }
                .cr-btn-warning {
                    background: #f57f17;
                    color: #fff;
                    width: 100%;
                    padding: 16px;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: 0.3s;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 10px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .cr-btn-warning:hover {
                    background: #e65100;
                }
                .cr-btn-danger {
                    background: #d32f2f;
                    color: #fff;
                    width: 100%;
                    padding: 16px;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: 0.3s;
                    margin-bottom: 12px;
                }
                .cr-btn-danger:hover {
                    background: #b71c1c;
                }
                .cr-btn-outline {
                    background: transparent;
                    color: #555;
                    border: 1px solid #ccc;
                    width: 100%;
                    padding: 14px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: 0.3s;
                }
                .cr-btn-outline:hover {
                    background: #f5f5f5;
                    color: #111;
                }
                .cr-alert-box {
                    padding: 18px;
                    border-radius: 8px;
                    margin-bottom: 25px;
                    font-size: 14px;
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    line-height: 1.6;
                }
                .cr-alert-info {
                    background: #e3f2fd;
                    color: #0d47a1;
                    border: 1px solid #bbdefb;
                }
                .cr-alert-error {
                    background: #ffebee;
                    color: #c62828;
                    border: 1px solid #ffcdd2;
                }
                .cr-alert-success {
                    background: #e8f5e9;
                    color: #2e7d32;
                    border: 1px solid #c8e6c9;
                }
                .cr-confirm-overlay {
                    background: #fffbf2;
                    padding: 35px;
                    border-radius: 12px;
                    text-align: center;
                    border: 1px solid #ffeeba;
                }
            `}</style>

            <div className="container">
                <div className="cr-form-container">
                    <div className="text-center mb-40">
                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '34px', fontWeight: 800, color: '#0d1b2a', margin: '0 0 10px 0' }}>
                            Modify / Cancel Ticket
                        </h2>
                        <p style={{ color: '#666', fontSize: '15px' }}>Submit a formal change or cancellation request for a confirmed ticket.</p>
                    </div>

                    {!showConfirm && !successMsg && (
                        <div className="cr-alert-box cr-alert-info">
                            <Info size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
                            <div>
                                <strong>Notice:</strong> Submitting a change request will notify the airline. Depending on the airline's policy, penalties or fare differences may apply.
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="cr-alert-box cr-alert-error">
                            <XCircle size={24} style={{ flexShrink: 0 }} />
                            <div>{error}</div>
                        </div>
                    )}

                    {successMsg && (
                        <div className="cr-alert-box cr-alert-success" style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '50px 20px' }}>
                            <CheckCircle size={65} color="#2e7d32" style={{ marginBottom: '20px' }} />
                            <h3 style={{ margin: '0 0 15px 0', color: '#2e7d32', fontWeight: 800 }}>Request Submitted!</h3>
                            <p style={{ margin: 0, fontSize: '16px', color: '#388e3c' }}>{successMsg}</p>
                            <button className="cr-btn-outline" style={{ marginTop: '35px', width: 'auto', padding: '12px 35px' }} onClick={() => { setSuccessMsg(''); setBookingId(''); setRemarks(''); }}>
                                Submit Another Request
                            </button>
                        </div>
                    )}

                    {!successMsg && !showConfirm && (
                        <form onSubmit={handleInitialSubmit}>
                            <div className="cr-form-group">
                                <label>TBO Booking ID <span style={{ color: '#d32f2f' }}>*</span></label>
                                <input 
                                    type="number" 
                                    placeholder="e.g. 1907823" 
                                    value={bookingId} 
                                    onChange={(e) => setBookingId(e.target.value)}
                                    required 
                                />
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="cr-form-group">
                                        <label>Request Type <span style={{ color: '#d32f2f' }}>*</span></label>
                                        <select value={requestType} onChange={(e) => setRequestType(e.target.value)} required>
                                            <option value="1">Cancellation (1)</option>
                                            <option value="2">Modification / Reissuance (2)</option>
                                            <option value="3">Void (3)</option>
                                            <option value="4">Sector Cancellation (4)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="cr-form-group">
                                        <label>Cancellation Type <span style={{ color: '#d32f2f' }}>*</span></label>
                                        <select value={cancellationType} onChange={(e) => setCancellationType(e.target.value)} required>
                                            <option value="1">Full Cancellation (1)</option>
                                            <option value="2">Partial Cancellation (2)</option>
                                            <option value="3">No Show (3)</option>
                                            <option value="4">Unaccompanied Minor (4)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {(requestType === '2' || requestType === '4') && (
                                <div className="cr-alert-box cr-alert-info mt-10 mb-20" style={{ display: 'block' }}>
                                    <h4 style={{ fontSize: '15px', color: '#0d47a1', margin: '0 0 10px 0' }}>Advanced Partial Options (Optional)</h4>
                                    
                                    <div className="cr-form-group">
                                        <label style={{ color: '#0d47a1' }}>Specific Ticket IDs (Comma separated)</label>
                                        <input 
                                            type="text" 
                                            placeholder="e.g. 1567415, 1567416" 
                                            value={ticketIds} 
                                            onChange={(e) => setTicketIds(e.target.value)}
                                            style={{ borderColor: '#bbdefb' }}
                                        />
                                        <small style={{ color: '#555', display: 'block', marginTop: '5px' }}>Leave blank to apply to all passengers.</small>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="cr-form-group" style={{ marginBottom: '10px' }}>
                                                <label style={{ color: '#0d47a1' }}>Sector Origin</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="e.g. DEL" 
                                                    value={sectorOrigin} 
                                                    onChange={(e) => setSectorOrigin(e.target.value)}
                                                    style={{ borderColor: '#bbdefb', textTransform: 'uppercase' }}
                                                    maxLength="3"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="cr-form-group" style={{ marginBottom: '10px' }}>
                                                <label style={{ color: '#0d47a1' }}>Sector Destination</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="e.g. SVO" 
                                                    value={sectorDestination} 
                                                    onChange={(e) => setSectorDestination(e.target.value)}
                                                    style={{ borderColor: '#bbdefb', textTransform: 'uppercase' }}
                                                    maxLength="3"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <small style={{ color: '#555', display: 'block' }}>Leave blank to apply to the entire journey.</small>
                                </div>
                            )}

                            <div className="cr-form-group">
                                <label>Remarks / Reason for change</label>
                                <textarea 
                                    placeholder="Enter your remarks or reason for this change request..." 
                                    value={remarks} 
                                    onChange={(e) => setRemarks(e.target.value)}
                                    rows="4"
                                    required
                                />
                            </div>

                            <button type="submit" className="cr-btn-warning mt-10">
                                <FileEdit size={20} /> Review Change Request
                            </button>
                        </form>
                    )}

                    {showConfirm && (
                        <div className="cr-confirm-overlay">
                            <AlertTriangle size={55} color="#d32f2f" style={{ marginBottom: '20px' }} />
                            <h3 style={{ margin: '0 0 15px 0', color: '#0d1b2a', fontSize: '26px', fontWeight: 800 }}>Confirm Submission</h3>
                            <p style={{ color: '#444', marginBottom: '30px', fontSize: '15px', lineHeight: 1.6 }}>
                                You are about to send a formal <strong>{requestType === '1' ? 'Cancellation' : 'Modification'} Request</strong> for Booking ID <strong>{bookingId}</strong>. This action will notify the airline and may incur penalty charges.
                            </p>
                            
                            <button 
                                onClick={confirmRequest} 
                                className="cr-btn-danger" 
                                disabled={loading}
                            >
                                {loading ? 'Submitting Request...' : 'Yes, Submit Request'}
                            </button>
                            
                            <button 
                                onClick={() => setShowConfirm(false)} 
                                className="cr-btn-outline"
                                disabled={loading}
                            >
                                No, Go Back
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default TicketChangeRequestInner;
