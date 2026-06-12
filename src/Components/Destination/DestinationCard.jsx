import { ArrowRight, Star } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router-dom';

function DestinationCard(props) {
    const { 
        destinationID, 
        destinationImage, 
        destinationTitle, 
        destinationPrice, 
        destinationDuration,
        rating,
        reviewsCount 
    } = props;

    const displayRating = rating || 4.9;
    const displayReviews = reviewsCount || Math.floor(Math.random() * 100 + 50);

    return (
        <div className="destination-card" style={{ 
            background: '#fff', 
            borderRadius: '16px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)', 
            overflow: 'hidden',
            fontFamily: "'Inter', sans-serif",
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        }}>
            <div className="destination-img" style={{ height: '220px', overflow: 'hidden' }}>
                <img 
                    src={destinationImage && destinationImage.startsWith('data:') ? destinationImage : (destinationImage && destinationImage.startsWith('http') ? destinationImage : `/assets/img/tour/${destinationImage || 'tour_box_1.jpg'}`)} 
                    alt={destinationTitle || 'Destination'} 
                    style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover', 
                        transition: 'transform 0.4s ease' 
                    }} 
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
            </div>
            <div className="destination-content" style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, textAlign: 'left', fontFamily: "'Inter', sans-serif" }}>
                <h3 className="box-title" style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 500, color: '#111', margin: '0 0 8px' }}>
                    <Link to={`/destination/${destinationID}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {destinationTitle ? destinationTitle : 'Swiss Alps Explorer'}
                    </Link>
                </h3>
                
                {/* <div className="tour-rating" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '15px' }}>
                    <Star size={14} color="#fbbc04" fill="#fbbc04" />
                    <span style={{ fontSize: '13px', color: '#666', fontWeight: 500 }}>
                        <strong style={{ color: '#111', fontWeight: 700 }}>{displayRating}</strong> ({displayReviews} Reviews)
                    </span>
                </div> */}
                
                <div className="tour-price" style={{ marginBottom: '20px' }}>
                    <span style={{ fontSize: '22px', fontWeight: 600, color: '#111' }}>
                        ₹{typeof destinationPrice === 'number' ? destinationPrice.toLocaleString() : (destinationPrice || '1,980')}
                    </span>
                    <span style={{ fontSize: '13px', color: '#666', fontWeight: 500 }}> /person</span>
                </div>
                
                <div className="tour-footer" style={{ 
                    marginTop: 'auto', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    borderTop: '1px solid #f0f0f0',
                    paddingTop: '15px'
                }}>
                    <div style={{ fontSize: '13px', color: '#666', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <i className="fa-regular fa-calendar" style={{ fontSize: '14px' }}></i>
                        {destinationDuration || '7 Days'}
                    </div>
                    
                    <Link to={`/destination/${destinationID}`} style={{ 
                        fontSize: '13px', 
                        fontWeight: 500, 
                        color: '#111', 
                        textDecoration: 'none', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        transition: 'color 0.3s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = '#e8151b'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#111'}
                    >
                        Book Now <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default DestinationCard
