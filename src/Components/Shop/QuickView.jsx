import React, { useState } from "react";

const QuickView = ({ shopID, shopImage, shopTitle, shopPrice, onClose }) => {
    const [quantity, setQuantity] = useState(1);

    const increaseQty = () => setQuantity((prev) => Math.min(prev + 1, 100));
    const decreaseQty = () => setQuantity((prev) => Math.max(prev - 1, 1));

    // Close when clicking outside the modal
    const handleOverlayClick = (e) => {
        if (e.target.classList.contains("quick-view-overlay")) {
            onClose(); // Close popup
        }
    };

    return (
        <div className="quick-view-overlay" onClick={handleOverlayClick}>
            <div className="quick-view-popup">
                <div className="container position-relative bg-white rounded-10">
                    <div className="row gx-60">
                        {/* Product Image */}
                        <div className="col-lg-6">
                            <div className="product-big-img">
                                <img src={`/assets/img/product/${shopImage}`} alt={shopTitle || "Product"} />
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="col-lg-6 align-self-center">
                            <div className="product-about">
                                <p className="price">{shopPrice || "$35.00"}</p>
                                <h2 className="product-title">{shopTitle || "Beach casual-shoe"}</h2>

                                <div className="product-rating">
                                    <div className="star-rating" role="img" aria-label="Rated 5.00 out of 5">
                                        <span style={{ width: "100%" }}>
                                            Rated <strong className="rating">5.00</strong> out of 5 based on{" "}
                                            <span className="rating">1</span> customer rating
                                        </span>
                                    </div>
                                    <a href="shop-details.html" className="woocommerce-review-link">
                                        (<span className="count">4</span> customer reviews)
                                    </a>
                                </div>
                                <p className="text">
                                    Bluetooth headphones are a popular choice for many people due to their
                                    convenience and wireless capabilities. They allow users to listen to music,
                                    podcasts, or make calls without being tethered to their device
                                </p>
                                <div className="mt-2 link-inherit">
                                    <p>
                                        <strong className="text-title me-3">Availability:</strong>
                                        <span className="stock in-stock">
                                            <i className="far fa-check-square me-2 ms-1" />
                                            In Stock
                                        </span>
                                    </p>
                                </div>
                                <div className="actions">
                                    <div className="quantity">
                                        <input type="number" className="qty-input" value={quantity} readOnly />
                                        <button className="quantity-plus qty-btn" onClick={increaseQty}>
                                            <i className="far fa-chevron-up"></i>
                                        </button>
                                        <button className="quantity-minus qty-btn" onClick={decreaseQty}>
                                            <i className="far fa-chevron-down"></i>
                                        </button>
                                    </div>
                                    <button className="th-btn">Add to Cart</button>
                                    <a href="/wishlist" className="icon-btn">
                                        <i className="far fa-heart"></i>
                                    </a>
                                </div>
                                <div className="product_meta">
                                    <span className="sku_wrapper">
                                        SKU: <span className="sku">BH-1001-BT</span>
                                    </span>
                                    <span className="posted_in">
                                        Category: <a href="shop.html"> sports, gaming, music listening</a>
                                    </span>
                                    <span>
                                        Tags: <a href="shop.html">Wireless</a>
                                        <a href="shop.html">Sports</a>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Close Button */}
                    <button className="quick-view-close" onClick={onClose}>
                        Ã—
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuickView;
