import React from 'react'

function FaqContact() {
    return (
        <div
            className="bg-top-center space overflow-hidden"
            style={{ background: "url(/assets/img/bg/tour_bg_3.jpg)", backgroundRepeat: "no-repeat", position: "relative", zIndex: "1" }}
        >
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-11">
                        <div className="">
                            <div className="title-area text-center mb-30">
                                <span className="sub-title style1">Contact Us</span>
                                <h2 className="sec-title text-white">Booking & Support Information</h2>
                            </div>
                            <div className="contact-form ajax-contact text-center">
                                <p className="mb-40" style={{ fontSize: '16px', color: '#666', lineHeight: '1.8' }}>
                                    For custom customizations, institutional/student group bookings, and real-time B2B quotes, please reach out directly to Jiyo Life Travels Private Limited, New Delhi.
                                </p>
                                <div className="row justify-content-center">
                                    <div className="col-md-4 mb-3">
                                        <div style={{ padding: '25px 15px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', height: '100%' }}>
                                            <i className="fa-solid fa-phone" style={{ fontSize: '32px', color: '#16B4EF', marginBottom: '15px' }}></i>
                                            <h5 className="mb-2">Hotline</h5>
                                            <p className="mb-0 text-dark" style={{ fontWeight: '600', fontSize: '18px' }}>+91-9289228555</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <div style={{ padding: '25px 15px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', height: '100%' }}>
                                            <i className="fa-brands fa-whatsapp" style={{ fontSize: '32px', color: '#25D366', marginBottom: '15px' }}></i>
                                            <h5 className="mb-2">WhatsApp</h5>
                                            <p className="mb-0 text-dark" style={{ fontWeight: '600', fontSize: '18px' }}>+91-7982426916</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <div style={{ padding: '25px 15px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', height: '100%' }}>
                                            <i className="fa-solid fa-envelope" style={{ fontSize: '32px', color: '#ea4335', marginBottom: '15px' }}></i>
                                            <h5 className="mb-2">Email</h5>
                                            <p className="mb-0 text-dark" style={{ fontWeight: '600', fontSize: '16px' }}>director.jiyolife@gmail.com</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default FaqContact
