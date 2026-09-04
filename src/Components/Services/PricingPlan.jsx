import React from 'react'
import { Link } from 'react-router-dom'

function PricingPlan({ className }) {
    return (
        <section className={`position-relative ${className}`}>
            <div className="container shape-mockup-wrap">
                <div className="title-area text-center">
                    <span className="sub-title">Let's Checkin</span>
                    <h2 className="sec-title">Affordable Pricing plans</h2>
                </div>
                <div className="row gy-4 justify-content-center">
                    <div className="col-xl-4 col-md-6">
                        <div className="price-card ">
                            <div className="offer-tag">Popular</div>
                            <div className="price-card_wrapp">
                                <div className="price-card_icon">
                                    <img src="assets/img/icon/price_1_1.svg" alt="img" />
                                </div>
                                <h3 className="box-title">Basic Plan</h3>
                            </div>
                            <div className="price-card_content">
                                <h4 className="price-card_price">
                                    $785.00<span className="duration">/Per Night</span>
                                </h4>
                                <p className="price-card_text">
                                    Essential services for basic and signle person seeking.
                                </p>
                                <div className="checklist">
                                    <ul>
                                        <li>Up to 2 members</li>
                                        <li>Room Service Fees</li>
                                        <li>Driver Service Feet</li>
                                        <li>Tour management</li>
                                        <li>Collaboration</li>
                                        <li>Entrance Fees</li>
                                        <li>Guide Fees in Destination</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="price-btn">
                                <Link to="/contact" className="th-btn style3 w-100">
                                    Get Started
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-md-6">
                        <div className="price-card active">
                            <div className="offer-tag">Popular</div>
                            <div className="price-card_wrapp">
                                <div className="price-card_icon">
                                    <img src="assets/img/icon/price_1_2.svg" alt="img" />
                                </div>
                                <h3 className="box-title">Advanced Plan</h3>
                            </div>
                            <div className="price-card_content">
                                <h4 className="price-card_price">
                                    $980.00<span className="duration">/Per Night</span>
                                </h4>
                                <p className="price-card_text">
                                    Essential services for basic and signle person seeking.
                                </p>
                                <div className="checklist">
                                    <ul>
                                        <li>Up to 2 members</li>
                                        <li>Room Service Fees</li>
                                        <li>Driver Service Feet</li>
                                        <li>Tour management</li>
                                        <li>Collaboration</li>
                                        <li>Entrance Fees</li>
                                        <li> Auto refresh ads</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="price-btn">
                                <Link to="/contact" className="th-btn style3 w-100">
                                    Get Started
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-md-6">
                        <div className="price-card ">
                            <div className="offer-tag">Popular</div>
                            <div className="price-card_wrapp">
                                <div className="price-card_icon">
                                    <img src="assets/img/icon/price_1_3.svg" alt="img" />
                                </div>
                                <h3 className="box-title">Premium Plan</h3>
                            </div>
                            <div className="price-card_content">
                                <h4 className="price-card_price">
                                    $1580.00<span className="duration">/Per Night</span>
                                </h4>
                                <p className="price-card_text">
                                    Essential services for basic and signle person seeking.
                                </p>
                                <div className="checklist">
                                    <ul>
                                        <li>Up to 2 members</li>
                                        <li>Room Service Fees</li>
                                        <li>Driver Service Feet</li>
                                        <li>Tour management</li>
                                        <li>Collaboration</li>
                                        <li>Entrance Fees</li>
                                        <li> Auto refresh ads</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="price-btn">
                                <Link to="/contact" className="th-btn style3 w-100">
                                    Get Started
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="shape-mockup movingX d-none d-xxl-block"
                    style={{ bottom: "0%", right: "-18%" }}
                >
                    <img
                        className="gmovingX"
                        src="assets/img/normal/about-slide-img.png"
                        alt="shape"
                    />
                </div>
                <div
                    className="shape-mockup d-none d-xl-block"
                    style={{ bottom: "-13%", left: "-16%" }}
                >
                    <img src="assets/img/shape/shape_6.png" alt="shape" />
                </div>
                <div
                    className="shape-mockup jump d-none d-xl-block"
                    style={{ top: "15%", left: "-10%" }}
                >
                    <img src="assets/img/shape/shape_2_2.png" alt="shape" />
                </div>
            </div>
        </section>

    )
}

export default PricingPlan
