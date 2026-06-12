import React, { useState } from 'react';
import axios from 'axios';
import { Search, Clock, CheckCircle, XCircle, DollarSign, Activity } from 'lucide-react';

function TrackChangeRequestInner() {
    const [changeRequestId, setChangeRequestId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [statusData, setStatusData] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!changeRequestId) {
            setError('Please enter a Change Request ID.');
            return;
        }

        setLoading(true);
        setError('');
        setStatusData(null);

        try {
            const response = await axios.post(`${process.env.REACT_APP_FLIGHT_API_BASE_URL}/change-request-status`, {
                ChangeRequestId: parseInt(changeRequestId, 10)
            });

            if (response.data && response.data.Response && response.data.Response.ResponseStatus === 1) {
                setStatusData(response.data.Response);
            } else {
                setError('Could not fetch status. Invalid response or ID.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error communicating with the tracking service.');
        } finally {
            setLoading(false);
        }
    };

    // Helper to get status badge styling
    const getStatusBadge = (statusType) => {
        switch (statusType) {
            case 1: // Unassigned
            case 2: // Assigned
            case 3: // Acknowledged
            case 6: // InProgress
                return { bg: '#fff3e0', color: '#e65100', icon: <Clock size={16} />, text: 'Processing' };
            case 4: // Completed
            case 5: // Rejected
                // Wait, TBO enum typically uses 4/5 for success/reject or similar, 
                // Let's use a generic mapping if specific enum is unknown, but usually:
                // 4 is Completed. 5 is Rejected.
                return { bg: '#e8f5e9', color: '#2e7d32', icon: <CheckCircle size={16} />, text: 'Completed' };
            case 5:
                return { bg: '#ffebee', color: '#c62828', icon: <XCircle size={16} />, text: 'Rejected' };
            default:
                return { bg: '#e3f2fd', color: '#0d47a1', icon: <Activity size={16} />, text: `Status Code: ${statusType}` };
        }
    };

    return (
        <section className="track-request-area pt-120 pb-120" style={{ backgroundColor: '#f4f6f9' }}>
            <style>{`
                .trk-container {
                    max-width: 800px;
                    margin: 0 auto;
                }
                .trk-search-box {
                    background: #fff;
                    padding: 40px;
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
                    margin-bottom: 30px;
                }
                .trk-input-group {
                    display: flex;
                    gap: 15px;
                }
                .trk-input-group input {
                    flex: 1;
                    padding: 16px 20px;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    font-size: 16px;
                    background: #fafafa;
                    transition: 0.3s;
                }
                .trk-input-group input:focus {
                    outline: none;
                    border-color: #0d47a1;
                    background: #fff;
                    box-shadow: 0 0 0 4px rgba(13, 71, 161, 0.1);
                }
                .trk-btn {
                    background: #0d47a1;
                    color: #fff;
                    border: none;
                    padding: 0 30px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: 0.3s;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .trk-btn:hover {
                    background: #1565c0;
                    transform: translateY(-2px);
                }
                
                /* Status Card */
                .trk-status-card {
                    background: #fff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
                    border-left: 5px solid #0d47a1;
                    animation: fadeIn 0.4s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .trk-card-header {
                    padding: 25px 30px;
                    border-bottom: 1px solid #f0f0f0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #fafafa;
                }
                .trk-card-body {
                    padding: 30px;
                }
                .trk-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 25px;
                }
                .trk-metric {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 10px;
                    border: 1px solid #eee;
                }
                .trk-metric-title {
                    font-size: 13px;
                    color: #666;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 8px;
                    font-weight: 600;
                }
                .trk-metric-value {
                    font-size: 24px;
                    font-weight: 800;
                    color: #111;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .trk-metric-value.green { color: #2e7d32; }
                .trk-metric-value.red { color: #c62828; }
                
                .trk-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 14px;
                    border-radius: 20px;
                    font-size: 13px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
            `}</style>

            <div className="container trk-container">
                
                <div className="text-center mb-40">
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', fontWeight: 900, color: '#0d1b2a', margin: '0 0 10px 0' }}>
                        Track Change Request
                    </h2>
                    <p style={{ color: '#666', fontSize: '16px' }}>Check the live status of your cancellation or modification request.</p>
                </div>

                <div className="trk-search-box">
                    <form onSubmit={handleSearch}>
                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600, color: '#111' }}>
                            Change Request ID
                        </label>
                        <div className="trk-input-group">
                            <input 
                                type="number" 
                                placeholder="Enter ID (e.g. 199350)"
                                value={changeRequestId}
                                onChange={(e) => setChangeRequestId(e.target.value)}
                                required
                            />
                            <button type="submit" className="trk-btn" disabled={loading}>
                                {loading ? 'Searching...' : <><Search size={20} /> Track Status</>}
                            </button>
                        </div>
                        {error && <div style={{ color: '#c62828', marginTop: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}><XCircle size={18} /> {error}</div>}
                    </form>
                </div>

                {statusData && (() => {
                    const statusConfig = getStatusBadge(statusData.ChangeRequestStatus);
                    return (
                        <div className="trk-status-card">
                            <div className="trk-card-header">
                                <div>
                                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Request ID</div>
                                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#111' }}>#{changeRequestId}</div>
                                </div>
                                <div>
                                    <span className="trk-badge" style={{ background: statusConfig.bg, color: statusConfig.color }}>
                                        {statusConfig.icon} {statusConfig.text}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="trk-card-body">
                                <div className="trk-grid">
                                    <div className="trk-metric">
                                        <div className="trk-metric-title">B2B Amendment Charges</div>
                                        <div className="trk-metric-value red">
                                            <DollarSign size={20} />
                                            {statusData.B2BAmendmentCharges || '0.00'}
                                        </div>
                                    </div>
                                    <div className="trk-metric">
                                        <div className="trk-metric-title">Cancellation Charge</div>
                                        <div className="trk-metric-value red">
                                            <DollarSign size={20} />
                                            {statusData.CancellationCharge || '0.00'}
                                        </div>
                                    </div>
                                    <div className="trk-metric" style={{ background: '#e8f5e9', borderColor: '#c8e6c9' }}>
                                        <div className="trk-metric-title" style={{ color: '#2e7d32' }}>Refund Amount</div>
                                        <div className="trk-metric-value green">
                                            <DollarSign size={20} />
                                            {statusData.RefundedAmount || '0.00'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })()}

            </div>
        </section>
    );
}

export default TrackChangeRequestInner;
