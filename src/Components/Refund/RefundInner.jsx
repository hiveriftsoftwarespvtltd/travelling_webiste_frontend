import React from "react";

function RefundInner() {
    return (
        <section className="space-top space-extra-bottom" style={{ backgroundColor: "#f3f6f9" }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xxl-10 col-lg-11">
                        
                        {/* Title Section */}
                        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "15px", backgroundColor: "#ffffff" }}>
                            <div className="card-body p-5 text-center">
                                <span className="sub-title">Refund Policy</span>
                                <h2 className="sec-title mt-2">Refund & Cancellation Policy</h2>
                                <p className="blog-text mt-2 mb-0" style={{ fontWeight: '600', color: '#16B4EF' }}>Jiyolife Travel Pvt. Ltd.</p>
                            </div>
                        </div>

                        {/* Intro Section */}
                        <div className="card border-0 shadow-sm mb-4 policy-card" style={{ borderRadius: "15px", backgroundColor: "#ffffff" }}>
                            <div className="card-body p-5">
                                <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
                                    <div className="icon-box text-white d-flex align-items-center justify-content-center me-4 shadow-sm" style={{ width: "55px", height: "55px", borderRadius: "12px", flexShrink: 0, backgroundColor: "#16B4EF" }}>
                                        <i className="fa-solid fa-handshake-angle fs-4"></i>
                                    </div>
                                    <h3 className="h4 mb-0" style={{ color: "#1a1a1a", fontWeight: "700" }}>Our Commitment</h3>
                                </div>
                                <p className="blog-text mb-30">
                                    At Jiyolife Travel Pvt Ltd, we are committed to providing our customers with a seamless and satisfying travel experience. However, we understand that unforeseen circumstances can arise, leading to changes in travel plans. Our Refund and Cancellation Policy is designed to be clear, fair, and transparent, ensuring that you are fully informed about the terms and conditions associated with booking cancellations, amendments, and subsequent refunds.
                                </p>
                                <div className="p-4" style={{ backgroundColor: "#e8f7ff", borderLeft: "4px solid #16B4EF", borderRadius: "10px" }}>
                                    <p className="blog-text mb-0" style={{ color: "#004085" }}>
                                        <strong>Acknowledgment Note:</strong> By completing a booking with Jiyolife Travel Pvt Ltd, customers acknowledge that they have read, understood, and agreed to be bound by the terms outlined in this Refund and Cancellation Policy.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Section 1 */}
                        <div className="card border-0 shadow-sm mb-4 policy-card" style={{ borderRadius: "15px", backgroundColor: "#ffffff" }}>
                            <div className="card-body p-5">
                                <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
                                    <div className="icon-box text-white d-flex align-items-center justify-content-center me-4 shadow-sm" style={{ width: "55px", height: "55px", borderRadius: "12px", flexShrink: 0, backgroundColor: "#16B4EF" }}>
                                        <i className="fa-solid fa-ban fs-4"></i>
                                    </div>
                                    <h3 className="h4 mb-0" style={{ color: "#1a1a1a", fontWeight: "700" }}>1. General Cancellation Policy</h3>
                                </div>
                                <p className="blog-text mb-15">
                                    <strong>1.1 Booking Cancellation Requests:</strong> Cancellation requests must be submitted explicitly in writing via registered email to our official customer support team. Verbal or telephonic cancellations will not be accepted or processed. Cancellations are subject to formal approval, and the final applicable refund amount will depend on the precise timing of the request and the specific type of travel booking.
                                </p>
                                <p className="blog-text mb-15">
                                    <strong>1.2 Refund Processing Timeline:</strong> Approved refunds will be processed within 7 to 14 business days after the cancellation request is formally confirmed by our team. All refunds will be credited back exclusively to the original mode of payment unless an alternative arrangement is explicitly agreed upon in writing by both parties.
                                </p>
                                <p className="blog-text mb-0">
                                    <strong>1.3 Non-Refundable Bookings:</strong> Certain high-discount or promotional reservations, including promotional offers, flash sales, last-minute deals, or specific custom services marked as non-refundable by third-party suppliers, are entirely ineligible for refunds or credits.
                                </p>
                            </div>
                        </div>

                        {/* Section 2 */}
                        <div className="card border-0 shadow-sm mb-4 policy-card" style={{ borderRadius: "15px", backgroundColor: "#ffffff" }}>
                            <div className="card-body p-5">
                                <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
                                    <div className="icon-box text-white d-flex align-items-center justify-content-center me-4 shadow-sm" style={{ width: "55px", height: "55px", borderRadius: "12px", flexShrink: 0, backgroundColor: "#16B4EF" }}>
                                        <i className="fa-solid fa-file-invoice-dollar fs-4"></i>
                                    </div>
                                    <h3 className="h4 mb-0" style={{ color: "#1a1a1a", fontWeight: "700" }}>2. Standard Cancellation Charges</h3>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-4">
                                        <div className="p-4 h-100" style={{ backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
                                            <h5 className="mb-3"><i className="fa-solid fa-plane-departure text-primary me-2"></i>Air Tickets</h5>
                                            <p className="blog-text mb-0">Cancellation charges strictly adhere to dynamic fare rules and policies of the respective airline. Jiyolife Travel Pvt Ltd applies a standard administrative service fee for processing ticket cancellations.</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <div className="p-4 h-100" style={{ backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
                                            <h5 className="mb-3"><i className="fa-solid fa-hotel text-primary me-2"></i>Hotel Reservations</h5>
                                            <p className="blog-text mb-0">Charges vary based on the hotel's policy, room rate tier, and timing. Under standard terms, no refunds will be processed for any hotel cancellations made within 48 hours of the scheduled check-in date.</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <h5 className="mb-3 mt-3"><i className="fa-solid fa-umbrella-beach text-primary me-2"></i>Tour & Holiday Packages</h5>
                                <p className="blog-text mb-3">The breakdown for holiday package cancellations is structured as follows:</p>
                                <ul className="list-style1 mb-0">
                                    <li className="blog-text"><i className="fa-solid fa-check-circle text-success me-2"></i> <strong>30 days or more before travel date:</strong> Full refund of package cost minus administrative and booking fees.</li>
                                    <li className="blog-text"><i className="fa-solid fa-exclamation-circle text-warning me-2"></i> <strong>15 - 29 days before travel date:</strong> 50% refund of the total package cost.</li>
                                    <li className="blog-text"><i className="fa-solid fa-times-circle text-danger me-2"></i> <strong>Less than 15 days before travel date:</strong> No refund will be provided.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Section 3 */}
                        <div className="card border-0 shadow-sm mb-4 policy-card" style={{ borderRadius: "15px", backgroundColor: "#ffffff" }}>
                            <div className="card-body p-5">
                                <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
                                    <div className="icon-box text-white d-flex align-items-center justify-content-center me-4 shadow-sm" style={{ width: "55px", height: "55px", borderRadius: "12px", flexShrink: 0, backgroundColor: "#16B4EF" }}>
                                        <i className="fa-solid fa-cloud-bolt fs-4"></i>
                                    </div>
                                    <h3 className="h4 mb-0" style={{ color: "#1a1a1a", fontWeight: "700" }}>3. Force Majeure & Exceptional Circumstances</h3>
                                </div>
                                <p className="blog-text mb-15">
                                    <strong>3.1 Definition & Scope:</strong> Jiyolife Travel Pvt Ltd will not be held liable or responsible for cancellations, delays, or structural alterations caused by unforeseen circumstances or Force Majeure events. These include, but are not limited to, natural disasters, acts of God, war, civil unrest, government regulations, border closures, strikes, epidemics, or pandemics.
                                </p>
                                <p className="blog-text mb-0">
                                    <strong>3.2 Supplier Policy Alignment:</strong> In such instances, our team will make every reasonable effort to offer flexible rescheduling options or travel vouchers. Cash refunds may not be possible if our underlying suppliers (airlines, hotels, local operators) do not provide direct compensation or waivers.
                                </p>
                            </div>
                        </div>

                        {/* Section 4 */}
                        <div className="card border-0 shadow-sm mb-4 policy-card" style={{ borderRadius: "15px", backgroundColor: "#ffffff" }}>
                            <div className="card-body p-5">
                                <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
                                    <div className="icon-box text-white d-flex align-items-center justify-content-center me-4 shadow-sm" style={{ width: "55px", height: "55px", borderRadius: "12px", flexShrink: 0, backgroundColor: "#16B4EF" }}>
                                        <i className="fa-solid fa-pen-to-square fs-4"></i>
                                    </div>
                                    <h3 className="h4 mb-0" style={{ color: "#1a1a1a", fontWeight: "700" }}>4. Booking Amendment Policy</h3>
                                </div>
                                <p className="blog-text mb-15">
                                    <strong>4.1 Amendments Requested by Customer:</strong> Any requested changes to a confirmed bookingâ€”including travel dates, destinations, names, or specific servicesâ€”are strictly subject to real-time availability and supplementary charges. All amendment requests must be submitted in writing and formally approved by our support team before taking effect.
                                </p>
                                <p className="blog-text mb-0">
                                    <strong>4.2 Amendments Initiated by the Company:</strong> If operational constraints, safety concerns, or supplier schedule shifts necessitate an amendment from our side, we will inform affected customers promptly and make every effort to provide suitable, equivalent alternative arrangements.
                                </p>
                            </div>
                        </div>
                        
                        {/* More Sections */}
                        <div className="row">
                            <div className="col-md-6 mb-4">
                                <div className="card border-0 shadow-sm h-100 policy-card" style={{ borderRadius: "15px", backgroundColor: "#ffffff" }}>
                                    <div className="card-body p-5">
                                        <h4 className="h5 mb-4 border-bottom pb-3"><i className="fa-solid fa-passport text-primary me-2"></i> 5. Special Contingencies</h4>
                                        <p className="blog-text mb-15"><strong>Visa Denial:</strong> In cases where a customer's visa application is delayed or denied, standard cancellation policies strictly apply. It is the sole responsibility of the customer to ensure all relevant visa requirements are met.</p>
                                        <p className="blog-text mb-0"><strong>No-Show Policy:</strong> If a customer fails to appear ('No-Show'), the booking will be treated as fully utilized, and absolutely no refunds or re-bookings will be permitted.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 mb-4">
                                <div className="card border-0 shadow-sm h-100 policy-card" style={{ borderRadius: "15px", backgroundColor: "#ffffff" }}>
                                    <div className="card-body p-5">
                                        <h4 className="h5 mb-4 border-bottom pb-3"><i className="fa-solid fa-users text-primary me-2"></i> 6. Group Bookings</h4>
                                        <p className="blog-text mb-15"><strong>Custom Group Terms:</strong> Reservations categorized as group bookings are subject to distinct cancellation schedules and terms, which are explicitly communicated at the time of reservation contract signing.</p>
                                        <p className="blog-text mb-0"><strong>Upfront Commitments:</strong> A significantly higher cancellation fee structure often applies to group reservations due to structural bulk-blocking rules and substantial upfront financial commitments.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 mb-4">
                                <div className="card border-0 shadow-sm h-100 policy-card" style={{ borderRadius: "15px", backgroundColor: "#ffffff" }}>
                                    <div className="card-body p-5">
                                        <h4 className="h5 mb-4 border-bottom pb-3"><i className="fa-solid fa-circle-minus text-primary me-2"></i> 7. Refund Exclusions</h4>
                                        <p className="blog-text mb-15"><strong>Non-Inclusive Services:</strong> Refunds are restricted solely to components booked directly through Jiyolife Travel Pvt Ltd. No liability for independent arrangements.</p>
                                        <p className="blog-text mb-0"><strong>Partial Use of Services:</strong> No partial or pro-rata refunds will be granted for voluntarily or involuntarily unutilized services once travel has commenced.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 mb-4">
                                <div className="card border-0 shadow-sm h-100 policy-card" style={{ borderRadius: "15px", backgroundColor: "#ffffff" }}>
                                    <div className="card-body p-5">
                                        <h4 className="h5 mb-4 border-bottom pb-3"><i className="fa-solid fa-user-check text-primary me-2"></i> 8. Customer Responsibilities</h4>
                                        <p className="blog-text mb-15"><strong>Accuracy of Information:</strong> Customers are entirely responsible for providing precise information at the time of booking. Typographical errors may lead to immediate cancellation charges.</p>
                                        <p className="blog-text mb-0"><strong>Adherence to Rules:</strong> Customers must strictly abide by the terms, safety regulations, and check-in policies of the respective end-service providers.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Support */}
                        <div className="card border-0 shadow-sm mb-4 policy-card" style={{ borderRadius: "15px", backgroundColor: "#ffffff", overflow: "hidden" }}>
                            <div className="row g-0">
                                <div className="col-md-5 bg-primary text-white p-5 d-flex flex-column justify-content-center" style={{ backgroundColor: "#16B4EF" }}>
                                    <h3 className="h4 text-white mb-3">Customer Support</h3>
                                    <p className="mb-4 text-white opacity-75">For all cancellation requests, amendment applications, or refund status queries, please reach out to our dedicated compliance team.</p>
                                </div>
                                <div className="col-md-7 p-5 d-flex flex-column justify-content-center">
                                    <ul className="list-style1 mb-0">
                                        <li className="blog-text mb-3 d-flex align-items-center">
                                            <div className="icon-box text-white d-flex align-items-center justify-content-center me-3 rounded-circle shadow-sm" style={{ width: "40px", height: "40px", backgroundColor: "#16B4EF" }}>
                                                <i className="fa-solid fa-phone"></i>
                                            </div> 
                                            <strong>Phone:</strong> <span className="ms-2">+91-9289228555</span>
                                        </li>
                                        <li className="blog-text mb-0 d-flex align-items-center">
                                            <div className="icon-box text-white d-flex align-items-center justify-content-center me-3 rounded-circle shadow-sm" style={{ width: "40px", height: "40px", backgroundColor: "#16B4EF" }}>
                                                <i className="fa-solid fa-envelope"></i>
                                            </div> 
                                            <strong>Email:</strong> <span className="ms-2">director.jiyolife@gmail.com</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}

export default RefundInner;
