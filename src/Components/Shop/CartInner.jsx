import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function CartInner() {
    const [cartItems, setCartItems] = useState([
        { id: 1, name: 'Beach Casual Shoe', price: 18, quantity: 1, image: 'assets/img/product/product_1_1.png' },
        { id: 2, name: 'Beach Football', price: 18, quantity: 1, image: 'assets/img/product/product_1_2.png' },
        { id: 3, name: 'Hammock', price: 18, quantity: 1, image: 'assets/img/product/product_1_3.png' }
    ]);

    const updateQuantity = (id, amount) => {
        setCartItems(cartItems.map(item => 
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
        ));
    };

    const removeItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <div className="th-cart-wrapper space-top space-extra-bottom">
            <div className="container">
                <div className="woocommerce-notices-wrapper">
                    <div className="woocommerce-message">Shipping costs updated.</div>
                </div>
                <form action="#" className="woocommerce-cart-form">
                    <table className="cart_table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <th>Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map(item => (
                                <tr className="cart_item" key={item.id}>
                                    <td>
                                        <Link className="cart-productimage" to={`/shop/${item.id}`}>
                                            <img width={91} height={91} src={item.image} alt={item.name} />
                                        </Link>
                                    </td>
                                    <td>
                                        <Link className="cart-productname" to={`/shop/${item.id}`}>
                                            {item.name}
                                        </Link>
                                    </td>
                                    <td>
                                        <span className="amount"><bdi><span>$</span>{item.price}</bdi></span>
                                    </td>
                                    <td>
                                        <div className="quantity">
                                            <button className="quantity-minus qty-btn" type="button" onClick={() => updateQuantity(item.id, -1)}>
                                                <i className="far fa-minus" />
                                            </button>
                                            <input type="number" className="qty-input" value={item.quantity} readOnly />
                                            <button className="quantity-plus qty-btn" type="button" onClick={() => updateQuantity(item.id, 1)}>
                                                <i className="far fa-plus" />
                                            </button>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="amount"><bdi><span>$</span>{item.price * item.quantity}</bdi></span>
                                    </td>
                                    <td>
                                        <button onClick={() => removeItem(item.id)} className="remove">
                                            <i className="fal fa-trash-alt" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan={6} className="actions">
                                    <div className="th-cart-coupon">
                                        <input type="text" className="form-control" placeholder="Coupon Code..." />
                                        <button type="submit" className="th-btn">Apply Coupon</button>
                                    </div>
                                    <button type="submit" className="th-btn">Update cart</button>
                                    <Link to="/shop" className="th-btn">Continue Shopping</Link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
                <div className="row justify-content-end">
                    <div className="col-md-8 col-lg-7 col-xl-6">
                        <h2 className="h4 summary-title">Cart Totals</h2>
                        <table className="cart_totals">
                            <tbody>
                                <tr>
                                    <td>Cart Subtotal</td>
                                    <td>
                                        <span className="amount"><bdi><span>$</span>{cartTotal}</bdi></span>
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr className="order-total">
                                    <td>Order Total</td>
                                    <td>
                                        <strong>
                                            <span className="amount"><bdi><span>$</span>{cartTotal}</bdi></span>
                                        </strong>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                        <div className="wc-proceed-to-checkout mb-30">
                            <Link to="/checkout" className="th-btn">Proceed to checkout</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartInner;
