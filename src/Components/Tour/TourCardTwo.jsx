import React from 'react'
import { Link } from 'react-router-dom';

function TourCardTwo(props) {
    const { tourImage, tourTitle, tourPrice } = props;
    return (
        <div className="tour-box style-flex th-ani">
            <div className="tour-box_img global-img">
                <img src={`/assets/img/tour/${tourImage}`} alt="" />
            </div>
            <div className="tour-content">
                <h3 className="box-title">
                   <Link to="/tour-details">{tourTitle ? tourTitle : 'Greece Tour Package'}</Link>
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
                        to="/tour-details"
                        className="woocommerce-review-link"
                    >
                        (<span className="count">4.8</span>
                        Rating)
                    </Link>
                </div>
                <h4 className="tour-box_price">
                    <span className="currency">{tourPrice ? tourPrice : '$980.00'}</span>/Person
                </h4>
                <div className="tour-action">
                    <span>
                        <i className="fa-light fa-clock" />7 Days
                    </span>
                    <Link to="/tour-details" className="th-btn style4">
                        Detail View
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default TourCardTwo
