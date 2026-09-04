import React, { useState } from "react";
import { Link } from "react-router-dom";

function WishlistInner() {
    // Sample wishlist items (could be fetched from API or context)
    const [wishlistItems, setWishlistItems] = useState([
        {
            id: 58,
            name: "Beach Casual-Shoe",
            price: 45.0,
            image: "assets/img/product/product_1_1.png",
            link: "/shop/1",
            dateAdded: "November 21, 2025",
            inStock: true,
        },
        {
            id: 60,
            name: "Beach Football",
            price: 18.0,
            oldPrice: 20.0,
            image: "assets/img/product/product_1_2.png",
            link: "/shop/2",
            dateAdded: "November 21, 2025",
            inStock: true,
        },
        {
            id: 61,
            name: "Hamok",
            price: 18.0,
            oldPrice: 20.0,
            image: "assets/img/product/product_1_3.png",
            link: "/shop/3",
            dateAdded: "November 21, 2025",
            inStock: true,
        },
    ]);

    // Function to remove item from wishlist
    const removeItem = (id) => {
        setWishlistItems(wishlistItems.filter((item) => item.id !== id));
    };

    return (
        <div className="space">
            <div className="container">
                <div className="tinv-wishlist woocommerce tinv-wishlist-clear">
                    <div className="tinv-header">
                        <h2 className="mb-30">Wishlist</h2>
                    </div>

                    <form action="#" method="post" autoComplete="off">
                        <table className="tinvwl-table-manage-list">
                            <thead>
                                <tr>
                                    <th className="product-cb">
                                        <input type="checkbox" className="global-cb" title="Select all" />
                                    </th>
                                    <th className="product-remove" />
                                    <th className="product-thumbnail">&nbsp;</th>
                                    <th className="product-name">Product Name</th>
                                    <th className="product-price">Unit Price</th>
                                    <th className="product-date">Date Added</th>
                                    <th className="product-stock">Stock Status</th>
                                    <th className="product-action">&nbsp;</th>
                                </tr>
                            </thead>
                            <tbody>
                                {wishlistItems.map((item) => (
                                    <tr key={item.id} className="wishlist_item">
                                        <td className="product-cb">
                                            <input type="checkbox" name="wishlist_pr[]" value={item.id} title="Select for bulk action" />
                                        </td>
                                        <td className="product-remove">
                                            <button type="button" onClick={() => removeItem(item.id)} title="Remove">
                                                <i className="fal fa-times" />
                                            </button>
                                        </td>
                                        <td className="product-thumbnail">
                                            <Link to={item.link}>
                                                <img src={item.image} alt={item.name} className="attachment-woocommerce_thumbnail" />
                                            </Link>
                                        </td>
                                        <td className="product-name">
                                            <Link to={item.link}>{item.name}</Link>
                                        </td>
                                        <td className="product-price">
                                            <span className="woocommerce-Price-amount amount">
                                                <bdi>
                                                    <span className="woocommerce-Price-currencySymbol">$</span>
                                                    {item.price.toFixed(2)}
                                                </bdi>
                                            </span>
                                            {item.oldPrice && (
                                                <del>
                                                    <span className="woocommerce-Price-amount amount">
                                                        <bdi>
                                                            <span className="woocommerce-Price-currencySymbol">$</span>
                                                            {item.oldPrice.toFixed(2)}
                                                        </bdi>
                                                    </span>
                                                </del>
                                            )}
                                        </td>
                                        <td className="product-date">
                                            <time className="entry-date">{item.dateAdded}</time>
                                        </td>
                                        <td className="product-stock">
                                            <p className={`stock ${item.inStock ? "in-stock" : "out-of-stock"}`}>
                                                <i className="fas fa-check" /> {item.inStock ? "In stock" : "Out of stock"}
                                            </p>
                                        </td>
                                        <td className="product-action">
                                            <Link to="/cart" className="button th-btn" title="Add to Cart">
                                                <i className="fal fa-shopping-cart" />
                                                <span>Add to Cart</span>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </form>

                    {/* Social Share Buttons */}
                    <div className="social-buttons">
                        <span>Share on</span>
                        <ul>
                            <li>
                                <Link to="https://www.facebook.com/sharer/sharer.php?u=permalink" className="social social-facebook" aria-label="Share on Facebook">
                                    <i className="fab fa-facebook-f" />
                                </Link>
                            </li>
                            <li>
                                <Link to="https://twitter.com/share?url=permalink" className="social social-twitter" aria-label="Share on Twitter">
                                    <i className="fab fa-twitter" />
                                </Link>
                            </li>
                            <li>
                                <Link to="http://pinterest.com/pin/create/button/?url=permalink" className="social social-pinterest" aria-label="Share on Pinterest">
                                    <i className="fab fa-pinterest-p" />
                                </Link>
                            </li>
                            <li>
                                <Link to="https://api.whatsapp.com/send?text=permalink" className="social social-whatsapp" aria-label="Share on WhatsApp">
                                    <i className="fab fa-whatsapp" />
                                </Link>
                            </li>
                            <li>
                                <Link to="mailto:?body=permalink" className="social social-email" aria-label="Share via Email">
                                    <i className="far fa-envelope" />
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WishlistInner;
