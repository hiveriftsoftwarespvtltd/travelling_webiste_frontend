import React from 'react'
import { Link } from 'react-router-dom';

function ShopCardTwo(props) {
    const { shopID, shopImage, shopTitle, shopPrice } = props;
    return (
        <div className="th-product list-view">
            <div className="product-img">
                <img
                    src={`/assets/img/product/${shopImage}`}
                    alt="Product"
                />
                <div className="actions">
                    <Link to="/cart" className="icon-btn">
                        <i className="far fa-cart-plus" />
                    </Link>
                </div>
            </div>
            <div className="product-content">
                <span className="price">
                {shopPrice ? shopPrice : '$250.00<del>$550.00</del>'}
                </span>
                <h3 className="product-title">
                    <Link to={`/shop/${shopID}`}>{shopTitle ? shopTitle : 'Beach casual-shoe'}</Link>
                </h3>
                <div
                    className="star-rating"
                    role="img"
                    aria-label="Rated 5.00 out of 5"
                >
                    <span>
                        Rated <strong className="rating">5.00</strong> out of 5
                        based on <span className="rating">1</span> customer rating
                    </span>
                </div>
            </div>
        </div>
    )
}

export default ShopCardTwo
