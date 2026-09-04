import React from 'react';
import { Link } from 'react-router-dom';

function ShopCardThree({ shopID, shopImage, shopTitle, shopPrice }) {
    return (
        <>
            <div className="th-product product-grid">
                <div className="product-img">
                    <img
                        src={`/assets/img/product/${shopImage}`}
                        alt="Product"
                    />
                    <span className="product-tag">Sale</span>
                    <div className="actions">
                        <Link to="/cart" className="icon-btn">
                            <i className="far fa-cart-plus" />
                        </Link>
                        <Link to="/wishlist" className="icon-btn">
                            <i className="far fa-heart" />
                        </Link>
                    </div>
                </div>
                <div className="product-content">
                    <h3 className="product-title">
                        <Link to={`/shop/${shopID}`}>{shopTitle ? shopTitle : 'Beach casual-shoe'}</Link>
                    </h3>
                    <span className="price">{shopPrice ? shopPrice : '$35.00'}</span>
                    <div className="woocommerce-product-rating">
                        <span className="count">(5.00 Review)</span>
                        <div
                            className="star-rating"
                            role="img"
                            aria-label="Rated 5.00 out of 5"
                        >
                            <span>
                                Rated <strong className="rating">5.00</strong> out of 5
                                based on <span className="rating">1</span> customer
                                rating
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ShopCardThree
