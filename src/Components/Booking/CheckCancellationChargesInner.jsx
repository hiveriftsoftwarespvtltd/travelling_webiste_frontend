import React, { useState } from 'react';
import axios from 'axios';
import { Calculator, DollarSign, Info, XCircle, ArrowRight, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

function CheckCancellationChargesInner() {
    const [bookingId, setBookingId] = useState('');
    const [requestType, setRequestType] = useState('1'); // 1 = Cancellation
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [quoteData, setQuoteData] = useState(null);

    const handleCheckCharges = async (e) => {
        e.preventDefault();
        if (!bookingId) {
            setError('Please enter a Booking ID.');
            return;
        }

        setLoading(true);
        setError('');
        setQuoteData(null);

        try {
            const response = await axios.post(`${process.env.REACT_APP_FLIGHT_API_BASE_URL}/cancellation-charges`, {
                BookingId: parseInt(bookingId, 10),
                RequestType: parseInt(requestType, 10),
                BookingMode: 5 // As specified by user payload
            });

            if (response.data && response.data.Response && response.data.Response.ResponseStatus === 1) {
                setQuoteData(response.data.Response);
            } else {
                setError('Could not calculate charges. Invalid booking ID or rules do not allow this operation.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error communicating with the cancellation service.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="cancellation-charges-area pt-120 pb-120" style={{ backgroundColor: '#f4f6f9' }}>
            <style>{`
                .calc-container {
                    max-width: 650px;
                    margin: 0 auto;
                }
                .calc-box {
                    background: #fff;
                    padding: 40px;
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
                    border-top: 4px solid #4a148c;
                    margin-bottom: 30px;
                }
                .calc-form-group {
                    margin-bottom: 20px;
                }
                .calc-form-group label {
                    font-weight: 600;
                    margin-bottom: 8px;
                    display: block;
                    color: #111;
                    font-size: 15px;
                }
                .calc-form-group input, .calc-form-group select {
                    width: 100%;
                    padding: 14px 16px;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    font-size: 15px;
                    background: #fafafa;
                    transition: 0.3s;
                }
                .calc-form-group input:focus, .calc-form-group select:focus {
                    outline: none;
                    border-color: #4a148c;
                    background: #fff;
                }
                .calc-btn {
                    background: #4a148c;
                    color: #fff;
                    border: none;
                    width: 100%;
                    padding: 16px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: 0.3s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .calc-btn:hover {
                    background: #38006b;
                    transform: translateY(-2px);
                }
                
                /* Quote Card */
                .calc-quote-card {
                    background: #fff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
                    animation: slideUp 0.4s ease-out;
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .calc-quote-header {
                    padding: 25px 30px;
                    background: #fafafa;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                .calc-quote-body {
                    padding: 30px;
                }
                .calc-price-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px 0;
                    border-bottom: 1px dashed #e0e0e0;
                }
                .calc-price-row:last-child {
                    border-bottom: none;
                    padding-bottom: 0;
                }
                .calc-price-label {
                    font-size: 16px;
                    color: #555;
                    font-weight: 500;
                }
                .calc-price-val {
                    font-size: 20px;
                    font-weight: 800;
                    color: #111;
                    display: flex;
                    align-items: center;
                }
                .calc-price-val.red { color: #d32f2f; }
                .calc-price-val.green { color: #2e7d32; font-size: 24px; }
                
                .calc-action-bar {
                    padding: 20px 30px;
                    background: #f8f9fa;
                    border-top: 1px solid #eee;
                    text-align: center;
                }
                .calc-proceed-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: #d32f2f;
                    color: #fff;
                    padding: 12px 30px;
                    border-radius: 30px;
                    font-weight: 700;
                    text-decoration: none;
                    transition: 0.3s;
                }
                .calc-proceed-btn:hover {
                    background: #b71c1c;
                    color: #fff;
                    transform: translateY(-2px);
                }
            `}</style>

            <div className="container calc-container">
                <div className="calc-box">
                    <div className="text-center mb-30">
                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: 900, color: '#0d1b2a', margin: '0 0 10px 0' }}>
                            Check Penalties
                        </h2>
                        <p style={{ color: '#666', fontSize: '15px' }}>Find out the estimated cancellation charges and refund amount before you decide to cancel.</p>
                    </div>

                    <div style={{ backgroundColor: '#e3f2fd', border: '1px solid #bbdefb', padding: '15px', borderRadius: '8px', marginBottom: '25px', display: 'flex', gap: '10px', color: '#0d47a1', fontSize: '14px' }}>
                        <Info size={20} style={{ flexShrink: 0 }} />
                        <span>This tool only calculates the quote. <strong>It does NOT cancel your ticket.</strong></span>
                    </div>

                    {error && (
                        <div style={{ backgroundColor: '#ffebee', border: '1px solid #ffcdd2', padding: '15px', borderRadius: '8px', marginBottom: '25px', display: 'flex', gap: '10px', color: '#c62828', fontSize: '14px' }}>
                            <XCircle size={20} style={{ flexShrink: 0 }} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleCheckCharges}>
                        <div className="calc-form-group">
                            <label>TBO Booking ID</label>
                            <input 
                                type="number" 
                                placeholder="e.g. 1583080"
                                value={bookingId}
                                onChange={(e) => setBookingId(e.target.value)}
                                required
                            />
                        </div>
                        <div className="calc-form-group">
                            <label>What are you planning to do?</label>
                            <select value={requestType} onChange={(e) => setRequestType(e.target.value)}>
                                <option value="1">Cancel Ticket</option>
                                <option value="2">Modify / Change Ticket</option>
                            </select>
                        </div>

                        <button type="submit" className="calc-btn mt-10" disabled={loading}>
                            {loading ? 'Calculating...' : <><Calculator size={20} /> Get Estimated Quote</>}
                        </button>
                    </form>
                </div>

                {quoteData && (
                    <div className="calc-quote-card">
                        <div className="calc-quote-header">
                            <div style={{ background: '#e8eaf6', padding: '12px', borderRadius: '50%', color: '#3f51b5' }}>
                                <ShieldAlert size={28} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>Fare Quote Result</h3>
                                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>For Booking #{bookingId}</p>
                            </div>
                        </div>
                        <div className="calc-quote-body">
                            <div className="calc-price-row">
                                <span className="calc-price-label">Cancellation Penalty</span>
                                <span className="calc-price-val red">
                                    <DollarSign size={18} /> {quoteData.CancellationCharge || '0.00'}
                                </span>
                            </div>
                            <div className="calc-price-row">
                                <span className="calc-price-label">B2B Amendment Charges</span>
                                <span className="calc-price-val red">
                                    <DollarSign size={18} /> {quoteData.B2BAmendmentCharges || '0.00'}
                                </span>
                            </div>
                            <div className="calc-price-row" style={{ paddingTop: '25px', marginTop: '10px', borderTop: '2px solid #eee' }}>
                                <span className="calc-price-label" style={{ color: '#2e7d32', fontWeight: 700 }}>Estimated Refund</span>
                                <span className="calc-price-val green">
                                    <DollarSign size={24} /> {quoteData.RefundedAmount || '0.00'}
                                </span>
                            </div>
                        </div>
                        <div className="calc-action-bar">
                            <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>If you agree with these charges, you can proceed to officially submit a cancellation request.</p>
                            <Link to="/ticket-change-request" className="calc-proceed-btn">
                                Proceed to Cancel Ticket <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

export default CheckCancellationChargesInner;
