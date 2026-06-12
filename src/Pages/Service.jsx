import React from 'react';
import { Link } from 'react-router-dom';
import HeaderOne from '../Components/Header/HeaderOne';
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb';
import FooterOne from "../Components/Footer/FooterOne";
import ScrollToTop from '../Components/ScrollToTop';

const servicesData = [
    {
        id: "01 / 04",
        title: "Flight Bookings",
        description: "Seamless domestic and international flight reservations at the best prices.\n\nWhether you are planning a corporate trip or a family vacation, our platform provides real-time access to global airlines, exclusive deals, and seamless online booking with premium customer support.",
        features: [
            "Global Airline Networks & Low-Cost Carriers",
            "Exclusive Deals & B2B Fares",
            "Real-Time Seat & Meal Selection (SSR)",
            "24/7 Premium Customer Support"
        ],
        image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        reverse: false
    },
    {
        id: "02 / 04",
        title: "Luxury Hotel Stays",
        description: "Experience world-class hospitality curated for your ultimate comfort.\n\nFrom boutique resorts to 5-star international hotel chains, we handpick accommodations that offer exceptional amenities, breathtaking views, and verified quality standards for every traveler.",
        features: [
            "Verified Premium & Luxury Hotels",
            "Best Price Guarantee Worldwide",
            "Corporate Stays & Group Bookings",
            "Instant Confirmations & Flexible Cancellations"
        ],
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        reverse: true
    },
    {
        id: "03 / 04",
        title: "Curated Holiday Packages",
        description: "Bespoke itineraries tailored to your pace, preferences, and dreams.\n\nFrom spiritual pilgrimages and romantic honeymoons to thrilling adventures and corporate retreats, we craft tailor-made journeys with verified premium transport and exclusive guided experiences.",
        features: [
            "Tailored Domestic & International Curations",
            "Luxury Honeymoons & Family Retreats",
            "Premium Private Transport Options",
            "Expert Local Guides at Every Destination"
        ],
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        reverse: false
    },
    {
        id: "04 / 04",
        title: "Visa & Travel Insurance",
        description: "Hassle-free documentation and complete security for your peace of mind.\n\nNavigate global travel requirements effortlessly with our fast-track visa processing assistance and comprehensive travel insurance plans covering delays, medical emergencies, and cancellations.",
        features: [
            "Fast-Track Visa Processing Assistance",
            "Comprehensive Global Travel Insurance",
            "Passport & Documentation Support",
            "24/7 Medical & Emergency Concierge"
        ],
        image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        reverse: true
    }
];

function Service() {
    return (
        <div style={{ backgroundColor: '#faf9f5', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
            <HeaderOne />
            <Breadcrumb
                title="Our Services"
                bgImage='/assets/img/bg/service.png'
                titleColor='#e8151b'
            />
            
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 20px' }}>
                {servicesData.map((service, index) => (
                    <div 
                        key={index} 
                        style={{ 
                            display: 'flex', 
                            flexDirection: service.reverse ? 'row-reverse' : 'row',
                            alignItems: 'center',
                            gap: '80px',
                            marginBottom: index === servicesData.length - 1 ? '0' : '120px'
                        }}
                        className="service-row-mobile"
                    >
                        {/* Image Section */}
                        <div style={{ flex: '1', position: 'relative' }}>
                            <div style={{ 
                                width: '100%', 
                                paddingBottom: '75%', 
                                position: 'relative', 
                                borderRadius: '16px', 
                                overflow: 'hidden',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.08)'
                            }}>
                                <img 
                                    src={service.image} 
                                    alt={service.title} 
                                    style={{
                                        position: 'absolute',
                                        top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Content Section */}
                        <div style={{ flex: '1', padding: '20px 0' }}>
                            {/* Step Indicator */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                <div style={{ 
                                    width: '36px', height: '36px', borderRadius: '50%', 
                                    backgroundColor: '#f3ead8', display: 'flex', alignItems: 'center', justifyContent: 'center' 
                                }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e8151b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
                                    </svg>
                                </div>
                                <span style={{ color: '#e8151b', fontWeight: '700', fontSize: '13px', letterSpacing: '2px' }}>
                                    {service.id}
                                </span>
                            </div>

                            {/* Title */}
                            <h2 style={{ 
                                fontFamily: "'Playfair Display', serif", 
                                fontSize: 'clamp(32px, 4vw, 48px)', 
                                fontWeight: '500', 
                                color: '#1a202c',
                                marginBottom: '24px',
                                lineHeight: '1.2'
                            }}>
                                {service.title}
                            </h2>

                            {/* Description */}
                            <p style={{ 
                                fontSize: '15px', 
                                color: '#4a5568', 
                                lineHeight: '1.8', 
                                marginBottom: '32px',
                                whiteSpace: 'pre-line'
                            }}>
                                {service.description}
                            </p>

                            {/* Features List */}
                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {service.features.map((feature, fIndex) => (
                                    <li key={fIndex} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '14px', color: '#2d3748', fontWeight: '500' }}>
                                        <div style={{ marginTop: '4px' }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="#e8151b">
                                                <circle cx="12" cy="12" r="8"></circle>
                                            </svg>
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            {/* Button */}
                            <Link 
                                to="/contact"
                                style={{
                                    backgroundColor: '#102a24',
                                    color: '#ffffff',
                                    textDecoration: 'none',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '16px 32px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    letterSpacing: '1px',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    transition: 'background-color 0.3s ease'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e8151b'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#102a24'}
                            >
                                INQUIRE NOW
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path>
                                </svg>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Inline styles for mobile responsiveness */}
            <style dangerouslySetInnerHTML={{__html: `
                @media (max-width: 991px) {
                    .service-row-mobile {
                        flex-direction: column !important;
                        gap: 40px !important;
                    }
                }
            `}} />

            <FooterOne />
            <ScrollToTop />
        </div>
    );
}

export default Service;
