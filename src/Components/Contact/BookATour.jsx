import React from 'react';

function BookATour() {
    return (
        <div className="contact-form-map-section" style={{ padding: '0px 0 100px', backgroundColor: '#e2e8f0' }}>
            <style>{`
                .cfm-wrapper {
                    display: flex;
                    flex-wrap: wrap;
                    background: #fff;
                    border-radius: 20px;
                    box-shadow: 0 15px 40px rgba(0,0,0,0.06);
                    overflow: hidden;
                }
                .cfm-form-side {
                    flex: 1;
                    min-width: 50%;
                    padding: 50px;
                    position: relative;
                }
                .cfm-map-side {
                    flex: 1;
                    min-width: 50%;
                    padding: 15px;
                    background: #fff;
                }
                .cfm-map-container {
                    width: 100%;
                    height: 100%;
                    min-height: 400px;
                    border-radius: 16px;
                    overflow: hidden;
                }
                
                .cfm-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 28px;
                    font-weight: 700;
                    color: #0b1a2d;
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .cfm-title-icon {
                    width: 36px;
                    height: 36px;
                    background: #eef4ff;
                    color: red;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                }
                .cfm-subtitle {
                    color: #555;
                    font-size: 15px;
                    margin-bottom: 30px;
                    font-family: 'Inter', sans-serif;
                }
                
                .cfm-input-group {
                    margin-bottom: 20px;
                }
                .cfm-control {
                    width: 100%;
                    padding: 14px 20px;
                    border: 1px solid #eaeaea;
                    border-radius: 12px;
                    font-size: 14px;
                    color: #333;
                    font-family: 'Inter', sans-serif;
                    background: #fff;
                    outline: none;
                    transition: border-color 0.3s ease;
                }
                .cfm-control:focus {
                    border-color: #1967d2;
                }
                .cfm-control::placeholder {
                    color: #999;
                }
                select.cfm-control {
                    appearance: none;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 15px center;
                }
                input[type="date"].cfm-control {
                    color: #999;
                }
                input[type="date"].cfm-control::-webkit-calendar-picker-indicator {
                    opacity: 0.5;
                }
                
                .cfm-submit-btn {
                    background: #e8151b;
                    color: #fff;
                    font-size: 16px;
                    font-weight: 600;
                    padding: 14px 32px;
                    border: none;
                    border-radius: 12px;
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-family: 'Inter', sans-serif;
                    position: relative;
                    z-index: 2;
                }
                .cfm-submit-btn:hover {
                    background: #c70e13;
                    transform: translateY(-2px);
                }
                
                .cfm-plane-decor {
                    position: absolute;
                    bottom: 20px;
                    right: 20px;
                    width: 120px;
                    height: 80px;
                    opacity: 0.8;
                    pointer-events: none;
                }
                
                @media (max-width: 991px) {
                    .cfm-form-side, .cfm-map-side {
                        min-width: 100%;
                    }
                    .cfm-form-side {
                        padding: 30px 20px;
                    }
                    .cfm-map-container {
                        min-height: 350px;
                    }
                }
            `}</style>
            <div className="container">
                <div className="cfm-wrapper">
                    {/* LEFT: FORM */}
                    <div className="cfm-form-side">
                        <div className="cfm-title">
                            <div className="cfm-title-icon"><i className="fa-solid fa-plane" style={{ transform: 'rotate(-45deg)' }}></i></div>
                            Start Planning Your Adventure
                        </div>
                        <div className="cfm-subtitle">
                            Fill out the form and our team will get back to you shortly.
                        </div>

                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="row">
                                <div className="col-md-6 cfm-input-group">
                                    <input type="text" className="cfm-control" placeholder="Full Name" required />
                                </div>
                                <div className="col-md-6 cfm-input-group">
                                    <input type="email" className="cfm-control" placeholder="Email Address" required />
                                </div>

                                <div className="col-md-6 cfm-input-group">
                                    <select className="cfm-control" defaultValue="">
                                        <option value="" disabled>Where do you want to go?</option>
                                        <option value="Asia">Asia</option>
                                        <option value="Europe">Europe</option>
                                        <option value="Africa">Africa</option>
                                        <option value="Americas">Americas</option>
                                    </select>
                                </div>
                                <div className="col-md-6 cfm-input-group">
                                    <input type="text" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }} className="cfm-control" placeholder="Travel Date" />
                                </div>

                                <div className="col-md-6 cfm-input-group">
                                    <select className="cfm-control" defaultValue="">
                                        <option value="" disabled>Number of Travelers</option>
                                        <option value="1">1 Traveler</option>
                                        <option value="2">2 Travelers</option>
                                        <option value="3-5">3 - 5 Travelers</option>
                                        <option value="6+">6+ Travelers</option>
                                    </select>
                                </div>
                                <div className="col-md-6 cfm-input-group">
                                    <input type="text" className="cfm-control" placeholder="Budget (Optional)" />
                                </div>

                                <div className="col-12 cfm-input-group">
                                    <textarea className="cfm-control" placeholder="Message" rows="4"></textarea>
                                </div>

                                <div className="col-12 mt-2">
                                    <button type="submit" className="cfm-submit-btn">
                                        <i className="fa-regular fa-paper-plane"></i> Send Enquiry
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* Decorative dotted plane line */}
                        <div className="cfm-plane-decor">
                            <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
                                <path d="M 10 80 Q 70 100, 110 50 T 180 20" fill="transparent" stroke="red" strokeWidth="3.5" strokeDasharray="8,8" strokeLinecap="round" />
                                <foreignObject x="165" y="-5" width="40" height="40">
                                    <i className="fa-solid fa-plane" style={{ color: 'red', fontSize: '26px', transform: 'rotate(-15deg)' }}></i>
                                </foreignObject>
                            </svg>
                        </div>
                    </div>

                    {/* RIGHT: MAP */}
                    <div className="cfm-map-side">
                        <div className="cfm-map-container">
                            <iframe
                                src="https://maps.google.com/maps?q=Jiyo+Life+Travels+Private+Limited+New+Delhi&output=embed"
                                allowFullScreen=""
                                loading="lazy"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookATour
