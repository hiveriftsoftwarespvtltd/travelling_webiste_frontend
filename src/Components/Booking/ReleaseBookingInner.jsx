import React, { useState } from 'react';
import axios from 'axios';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

function ReleaseBookingInner() {
    const [bookingId, setBookingId] = useState('');
    const [source, setSource] = useState('4'); // Defaulting to 4 (LCC) as per user payload
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);

    const handleInitialSubmit = (e) => {
        e.preventDefault();
        if (!bookingId || !source) {
            setError('Please provide both Booking ID and Source.');
            return;
        }
        // Show confirmation step before actual API call
        setShowConfirm(true);
        setError('');
        setSuccessMsg('');
    };

    const confirmRelease = async () => {
        setLoading(true);
        setError('');
        
        try {
            const response = await axios.post(`${process.env.REACT_APP_FLIGHT_API_BASE_URL}/release-pnr`, {
                BookingId: bookingId,
                Source: parseInt(source)
            });

            if (response.data && response.data.Response && response.data.Response.ResponseStatus === 1) {
                setSuccessMsg('Booking has been successfully released / cancelled.');
                setShowConfirm(false);
            } else {
                setError('Failed to release booking. Invalid response from server.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error communicating with the cancellation service.');
            setShowConfirm(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="release-booking-area pt-120 pb-120" style={{ backgroundColor: '#f9f9f9' }}>
            <style>{`
                .release-form-container {
                    background: #fff;
                    padding: 40px;
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(232, 21, 27, 0.08); /* slight red shadow */
                    max-width: 600px;
                    margin: 0 auto;
                    border-top: 4px solid #e8151b;
                }
                .form-group label {
                    font-weight: 600;
                    margin-bottom: 8px;
                    display: block;
                    color: #0d1b2a;
                }
                .form-group input, .form-group select {
                    width: 100%;
                    padding: 12px 15px;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    font-size: 16px;
                }
                .form-group input:focus, .form-group select:focus {
                    border-color: #e8151b;
                    outline: none;
                }
                .btn-danger-action {
                    background: #e8151b;
                    color: #fff;
                    width: 100%;
                    padding: 14px;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: 0.3s;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 8px;
                }
                .btn-danger-action:hover {
                    background: #c11217;
                }
                .btn-outline {
                    background: transparent;
                    color: #666;
                    border: 1px solid #ccc;
                    width: 100%;
                    padding: 14px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: 0.3s;
                    margin-top: 10px;
                }
                .btn-outline:hover {
                    background: #f5f5f5;
                    color: #333;
                }
                .alert-box {
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 25px;
                    font-size: 14px;
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    line-height: 1.5;
                }
                .alert-warning {
                    background: #fff3cd;
                    color: #856404;
                    border: 1px solid #ffeeba;
                }
                .alert-error {
                    background: #ffebee;
                    color: #c62828;
                    border: 1px solid #ffcdd2;
                }
                .alert-success {
                    background: #e8f5e9;
                    color: #2e7d32;
                    border: 1px solid #c8e6c9;
                }
                .confirm-overlay {
                    background: #fff;
                    padding: 30px;
                    border-radius: 12px;
                    text-align: center;
                    border: 1px solid #ffeeba;
                    background: #fffbf2;
                }
            `}</style>

            <div className="container">
                <div className="release-form-container">
                    <div className="text-center mb-30">
                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: '#0d1b2a', margin: '0 0 10px 0' }}>
                            Cancel / Release Booking
                        </h2>
                        <p style={{ color: '#666' }}>Release blocked seats for un-ticketed PNRs.</p>
                    </div>

                    {!showConfirm && !successMsg && (
                        <div className="alert-box alert-warning">
                            <Info size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
                            <div>
                                <strong>Warning:</strong> This action will release the blocked seats back to the airline inventory. You should only do this if the ticket has not been issued yet and the customer wishes to cancel.
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="alert-box alert-error">
                            <XCircle size={24} style={{ flexShrink: 0 }} />
                            <div>{error}</div>
                        </div>
                    )}

                    {successMsg && (
                        <div className="alert-box alert-success" style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '40px 20px' }}>
                            <CheckCircle size={60} color="#2e7d32" style={{ marginBottom: '15px' }} />
                            <h3 style={{ margin: '0 0 10px 0', color: '#2e7d32' }}>Success</h3>
                            <p style={{ margin: 0, fontSize: '16px' }}>{successMsg}</p>
                            <button className="btn-outline" style={{ marginTop: '30px', width: 'auto', padding: '10px 30px' }} onClick={() => { setSuccessMsg(''); setBookingId(''); }}>
                                Release Another Booking
                            </button>
                        </div>
                    )}

                    {!successMsg && !showConfirm && (
                        <form onSubmit={handleInitialSubmit}>
                            <div className="form-group">
                                <label>Booking ID</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. 1288527" 
                                    value={bookingId} 
                                    onChange={(e) => setBookingId(e.target.value)}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Booking Source Code</label>
                                <select value={source} onChange={(e) => setSource(e.target.value)} required>
                                    <option value="1">Galileo (1)</option>
                                    <option value="2">Amadeus (2)</option>
                                    <option value="3">Sabre (3)</option>
                                    <option value="4">LCC / Low Cost Carrier (4)</option>
                                    <option value="5">Mystifly (5)</option>
                                </select>
                            </div>
                            <button type="submit" className="btn-danger-action">
                                <AlertTriangle size={18} /> Proceed to Release
                            </button>
                        </form>
                    )}

                    {showConfirm && (
                        <div className="confirm-overlay">
                            <AlertTriangle size={50} color="#f57f17" style={{ marginBottom: '15px' }} />
                            <h3 style={{ margin: '0 0 15px 0', color: '#0d1b2a' }}>Are you absolutely sure?</h3>
                            <p style={{ color: '#555', marginBottom: '25px', lineHeight: 1.6 }}>
                                You are about to release Booking ID <strong>{bookingId}</strong>. This will permanently cancel the hold on these seats. This action cannot be undone.
                            </p>
                            
                            <button 
                                onClick={confirmRelease} 
                                className="btn-danger-action" 
                                disabled={loading}
                            >
                                {loading ? 'Releasing...' : 'Yes, Release PNR Now'}
                            </button>
                            
                            <button 
                                onClick={() => setShowConfirm(false)} 
                                className="btn-outline"
                                disabled={loading}
                            >
                                Cancel & Go Back
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default ReleaseBookingInner;
