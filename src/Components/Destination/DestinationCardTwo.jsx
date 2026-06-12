import { ArrowRight } from 'lucide-react';
﻿import React from 'react'
import { Link } from 'react-router-dom'

function DestinationCardTwo(props) {
    const { destinationID, destinationImage, destinationTitle, destinationPrice, destinationDuration } = props;
    return (
        <div className="tour-box style-flex th-ani">
            <div className="tour-box_img global-img">
                <img src={destinationImage && destinationImage.startsWith('data:') ? destinationImage : (destinationImage && destinationImage.startsWith('http') ? destinationImage : `/assets/img/tour/${destinationImage}`)} alt="Destination" style={{ width: '300px', height: '250px', objectFit: 'cover' }} />
            </div>
            <div className="tour-content">
                <h3 className="box-title">
                    <Link to={`/destination/${destinationID}`}>{destinationTitle ? destinationTitle : 'Dubai'}</Link>
                </h3>
                <div className="tour-rating">
                    <div
                        className="star-rating"
                        role="img"
                        aria-label="Rated 5.00 out of 5"
                    >
                        <span style={{ width: "100%" }}>
                            Rated
                            <strong className="rating">5.00</strong> out of 5
                            based on <span className="rating">4.8</span>(4.8
                            Rating)
                        </span>
                    </div>
                    <Link
                        to={`/destination/${destinationID}`}
                        className="woocommerce-review-link"
                    >
                        (<span className="count">4.8</span>
                        Rating)
                    </Link>
                </div>
                <h4 className="tour-box_price">
                    <span className="currency">{destinationPrice ? destinationPrice : '$980.00'}</span>/Person
                </h4>
                <div className="tour-action">
                    <span>
                        <i className="fa-light fa-clock" />{destinationDuration || '7 Days'}
                    </span>
                    <Link to="/checkout" className="th-btn style4 " style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>Book Now <ArrowRight size={16} /></Link>
                </div>
            </div>
        </div>
    )
}

export default DestinationCardTwo
