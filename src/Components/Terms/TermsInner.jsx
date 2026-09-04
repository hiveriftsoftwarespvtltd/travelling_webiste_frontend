import React from "react";

function TermsInner() {
    return (
        <section className="space-top space-extra-bottom" style={{ backgroundColor: "#f3f6f9" }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xxl-10 col-lg-11">
                        
                        {/* Title Section */}
                        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "15px", backgroundColor: "#ffffff" }}>
                            <div className="card-body p-5 text-center">
                                <span className="sub-title">Terms & Policies</span>
                                <h2 className="sec-title mt-2">Standard Commercial Terms & Booking Policies</h2>
                                <p className="blog-text mt-2 mb-0" style={{ fontWeight: '600', color: '#16B4EF' }}>Jiyo Life Travels Private Limited</p>
                            </div>
                        </div>

                        {/* Intro Section */}
                        <div className="card border-0 shadow-sm mb-4 policy-card" style={{ borderRadius: "15px", backgroundColor: "#ffffff" }}>
                            <div className="card-body p-5">
                                <p className="blog-text mb-30" style={{ fontSize: "1.1rem" }}>
                                    All binding contractual correspondences regarding itinerary execution, booking modifications, or service cancellations must be placed in written communication directed explicitly to Jiyo Life Travels Private Limited.
                                </p>
                                <div className="row">
                                    <div className="col-md-4 mb-4 mb-md-0">
                                        <div className="p-4 h-100 border" style={{ borderRadius: "10px", borderColor: "#e9ecef" }}>
                                            <h5 className="mb-3 text-primary"><i className="fa-solid fa-money-bill-wave me-2"></i>Initial Deposit</h5>
                                            <p className="blog-text mb-0 fs-6">A minimum operational deposit of 25% of total gross contract values must be processed to confirm itineraries.</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4 mb-4 mb-md-0">
                                        <div className="p-4 h-100 border" style={{ borderRadius: "10px", borderColor: "#e9ecef" }}>
                                            <h5 className="mb-3 text-primary"><i className="fa-solid fa-scale-balanced me-2"></i>Balance Settlement</h5>
                                            <p className="blog-text mb-0 fs-6">The remaining 75% must be fully remitted a minimum of 15 days prior to the scheduled service date.</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="p-4 h-100 border" style={{ borderRadius: "10px", borderColor: "#e9ecef" }}>
                                            <h5 className="mb-3 text-primary"><i className="fa-solid fa-star me-2"></i>High-Season</h5>
                                            <p className="blog-text mb-0 fs-6">Reservations during peak seasons or luxury bookings require absolute 100% upfront financial clearance.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Remittance Infrastructure */}
                        <div className="card border-0 shadow-sm mb-4 policy-card" style={{ borderRadius: "15px", backgroundColor: "#ffffff" }}>
                            <div className="card-body p-5">
                                <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
                                    <div className="icon-box text-white d-flex align-items-center justify-content-center me-4 shadow-sm" style={{ width: "55px", height: "55px", borderRadius: "12px", flexShrink: 0, backgroundColor: "#16B4EF" }}>
                                        <i className="fa-solid fa-building-columns fs-4"></i>
                                    </div>
                                    <h3 className="h4 mb-0" style={{ color: "#1a1a1a", fontWeight: "700" }}>Authorized Remittance Infrastructure</h3>
                                </div>
                                <div className="table-responsive">
                                    <table className="table table-hover table-bordered" style={{ fontSize: "16px", color: "#666" }}>
                                        <thead className="table-dark">
                                            <tr>
                                                <th className="p-3 text-white">Remittance Domain</th>
                                                <th className="p-3 text-white">Approved Transaction Formats & Channels</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="p-4" style={{ fontWeight: '600', verticalAlign: 'middle', color: '#333', backgroundColor: "#f8f9fa" }}>Domestic Transacting (Within India)</td>
                                                <td className="p-4">
                                                    <ul className="mb-0 blog-text" style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                                                        <li className="mb-2">Liquid Cash / Corporate Checked Instruments / Demand Drafts</li>
                                                        <li className="mb-2">Real Time Gross Settlement (RTGS) & National Electronic Funds Transfer (NEFT)</li>
                                                        <li className="mb-2">Mail Authorization Overlays (American Express, Visa, MasterCard)</li>
                                                        <li className="mb-0">Integrated Online Payment Gateways & Secure Debit Verification Protocols</li>
                                                    </ul>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="p-4" style={{ fontWeight: '600', verticalAlign: 'middle', color: '#333', backgroundColor: "#f8f9fa" }}>Overseas / International Transacting</td>
                                                <td className="p-4">
                                                    <ul className="mb-0 blog-text" style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                                                        <li className="mb-2">Direct Swift-backed International Bank Wire Transfers</li>
                                                        <li className="mb-2">Mail Authorization Overlays (American Express, Visa, MasterCard)</li>
                                                        <li className="mb-0">Verified Gateway Routing & 3D Secure Credit/Debit Portals</li>
                                                    </ul>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                
                                <div className="alert mt-4 mb-0 d-flex align-items-center shadow-sm" style={{ backgroundColor: "#fff3cd", border: "1px solid #ffeeba", borderRadius: "10px" }} role="alert">
                                    <i className="fa-solid fa-circle-exclamation fs-3 text-warning me-3"></i>
                                    <p className="blog-text mb-0" style={{ color: "#856404" }}>
                                        <strong>Important Credit Note:</strong> Credit card transactions carry an automatic bank processing surcharge of 3.0%. All global remittances must be clean, free of intermediate bank transit fees.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Cancellation Framework */}
                        <div className="card border-0 shadow-sm mb-4 policy-card" style={{ borderRadius: "15px", backgroundColor: "#ffffff" }}>
                            <div className="card-body p-5">
                                <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
                                    <div className="icon-box text-white d-flex align-items-center justify-content-center me-4 shadow-sm" style={{ width: "55px", height: "55px", borderRadius: "12px", flexShrink: 0, backgroundColor: "#16B4EF" }}>
                                        <i className="fa-solid fa-calendar-xmark fs-4"></i>
                                    </div>
                                    <h3 className="h4 mb-0" style={{ color: "#1a1a1a", fontWeight: "700" }}>Standard Progressive Cancellation Fee Framework</h3>
                                </div>
                                <div className="row g-4 mt-2">
                                    <div className="col-md-6">
                                        <div className="card h-100 border-0" style={{ backgroundColor: "#fff5f5", borderRadius: "12px" }}>
                                            <div className="card-body p-4 text-center">
                                                <div className="mb-3">
                                                    <span className="badge bg-danger px-3 py-2 fs-6 rounded-pill">60+ Days Prior</span>
                                                </div>
                                                <h5 className="mb-3" style={{ color: "#dc3545" }}>10% Penalty</h5>
                                                <p className="blog-text mb-0">10% forfeiture of Total Contracted Tour/Service Value</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="card h-100 border-0" style={{ backgroundColor: "#fff3cd", borderRadius: "12px" }}>
                                            <div className="card-body p-4 text-center">
                                                <div className="mb-3">
                                                    <span className="badge bg-warning text-dark px-3 py-2 fs-6 rounded-pill">59 to 30 Days Prior</span>
                                                </div>
                                                <h5 className="mb-3" style={{ color: "#856404" }}>20% Penalty</h5>
                                                <p className="blog-text mb-0">20% forfeiture of Total Contracted Tour/Service Value</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}

export default TermsInner;
