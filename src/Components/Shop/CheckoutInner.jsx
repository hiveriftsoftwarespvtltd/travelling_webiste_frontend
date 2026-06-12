import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CreditCard, 
  Headphones, 
  Lock, 
  RotateCcw, 
  BadgeCheck, 
  Star, 
  Globe2,
  ChevronDown,
  Wallet,
  Landmark
} from 'lucide-react';
import './CheckoutNew.css';

function CheckoutInner() {
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [step, setStep] = useState(1);

  return (
    <div className="checkout-redesign-wrapper">
      <div className="checkout-redesign-container">
        
        {/* Top Features Bar */}
        <div className="ch-top-features">
          <div className="ch-feature-item">
            <div className="ch-feature-icon">
              <ShieldCheck size={24} />
            </div>
            <div className="ch-feature-text">
              <h4>Secure Checkout</h4>
              <p>Your data is protected</p>
            </div>
          </div>
          <div className="ch-feature-item">
            <div className="ch-feature-icon">
              <CreditCard size={24} />
            </div>
            <div className="ch-feature-text">
              <h4>Flexible Payment</h4>
              <p>Multiple payment options</p>
            </div>
          </div>
          <div className="ch-feature-item">
            <div className="ch-feature-icon">
              <Headphones size={24} />
            </div>
            <div className="ch-feature-text">
              <h4>24/7 Support</h4>
              <p>We're here to help</p>
            </div>
          </div>
        </div>

        <div className="ch-main-grid">
          {/* Left Column */}
          <div className="ch-left-col">
            
            {/* Progress Indicator */}
            <div className="ch-progress">
              <div className="ch-progress-step">
                <div className="ch-step-num active">1</div>
                <div className="ch-step-label active">Billing Details</div>
              </div>
              <div className="ch-progress-step">
                <div className="ch-step-num inactive">2</div>
                <div className="ch-step-label inactive">Payment</div>
              </div>
              <div className="ch-progress-step">
                <div className="ch-step-num inactive">3</div>
                <div className="ch-step-label inactive">Confirmation</div>
              </div>
            </div>

            {/* Billing Details Form */}
            <h2 className="ch-section-title">Billing Details</h2>
            <p className="ch-section-subtitle">Please fill in your details to complete your booking.</p>

            <div className="ch-form-grid full">
              <div className="ch-form-group">
                <label>Country / Region</label>
                <div style={{ position: 'relative' }}>
                  <select className="ch-select" defaultValue="uk" style={{ appearance: 'none' }}>
                    <option value="uk">United Kingdom (UK)</option>
                    <option value="us">United States (US)</option>
                    <option value="in">India (IN)</option>
                  </select>
                  <ChevronDown size={16} color="#6b7280" style={{ position: 'absolute', right: '16px', top: '14px', pointerEvents: 'none' }} />
                </div>
              </div>
            </div>

            <div className="ch-form-grid">
              <div className="ch-form-group">
                <label>First Name</label>
                <input type="text" className="ch-input" placeholder="Enter first name" />
              </div>
              <div className="ch-form-group">
                <label>Last Name</label>
                <input type="text" className="ch-input" placeholder="Enter last name" />
              </div>
            </div>

            <div className="ch-form-grid full">
              <div className="ch-form-group">
                <label>Company Name (Optional)</label>
                <input type="text" className="ch-input" placeholder="Enter company name" />
              </div>
            </div>

            <div className="ch-form-grid full">
              <div className="ch-form-group">
                <label>Address</label>
                <input type="text" className="ch-input" placeholder="Street address, apartment, suite, etc." />
              </div>
            </div>

            <div className="ch-form-grid full">
              <div className="ch-form-group">
                <label>Town / City</label>
                <input type="text" className="ch-input" placeholder="Enter town or city" />
              </div>
            </div>

            <div className="ch-form-grid">
              <div className="ch-form-group">
                <label>Postcode / ZIP</label>
                <input type="text" className="ch-input" placeholder="Postcode / ZIP" />
              </div>
              <div className="ch-form-group">
                <label>Country</label>
                <div style={{ position: 'relative' }}>
                  <select className="ch-select" defaultValue="" style={{ appearance: 'none', color: '#9ca3af' }}>
                    <option value="" disabled>Select country</option>
                    <option value="uk">United Kingdom (UK)</option>
                    <option value="us">United States (US)</option>
                    <option value="in">India (IN)</option>
                  </select>
                  <ChevronDown size={16} color="#6b7280" style={{ position: 'absolute', right: '16px', top: '14px', pointerEvents: 'none' }} />
                </div>
              </div>
            </div>

            <div className="ch-form-grid">
              <div className="ch-form-group">
                <label>Email Address</label>
                <input type="email" className="ch-input" placeholder="Enter email address" />
              </div>
              <div className="ch-form-group">
                <label>Phone Number</label>
                <input type="tel" className="ch-input" placeholder="Enter phone number" />
              </div>
            </div>

            <div className="ch-checkbox-group">
              <input type="checkbox" id="create-account" className="ch-checkbox" />
              <div>
                <label htmlFor="create-account" className="ch-checkbox-label">Create an account?</label>
                <div className="ch-checkbox-sub">Create an account for faster booking next time.</div>
              </div>
            </div>

            <div className="ch-form-grid full">
              <div className="ch-form-group">
                <label>Order Notes (Optional)</label>
                <textarea className="ch-textarea" rows="3" placeholder="Add a note about your order, e.g. special requests for delivery."></textarea>
              </div>
            </div>

            {/* Payment Methods */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '40px', marginBottom: '8px' }}>
              <div className="ch-step-num active" style={{ width: '24px', height: '24px', fontSize: '12px' }}>2</div>
              <h2 className="ch-section-title" style={{ margin: 0 }}>Payment Method</h2>
            </div>
            <p className="ch-section-subtitle">Choose your preferred payment method.</p>

            <div className="ch-payment-methods">
              <div className={`ch-payment-card ${paymentMethod === 'credit' ? 'active' : ''}`} onClick={() => setPaymentMethod('credit')}>
                <input type="radio" checked={paymentMethod === 'credit'} readOnly />
                <CreditCard size={18} color={paymentMethod === 'credit' ? '#e8151b' : '#6b7280'} />
                <span>Credit Card</span>
              </div>
              <div className={`ch-payment-card ${paymentMethod === 'debit' ? 'active' : ''}`} onClick={() => setPaymentMethod('debit')}>
                <input type="radio" checked={paymentMethod === 'debit'} readOnly />
                <Wallet size={18} color={paymentMethod === 'debit' ? '#e8151b' : '#6b7280'} />
                <span>Debit Card</span>
              </div>
              <div className={`ch-payment-card ${paymentMethod === 'paypal' ? 'active' : ''}`} onClick={() => setPaymentMethod('paypal')}>
                <input type="radio" checked={paymentMethod === 'paypal'} readOnly />
                <span style={{ fontSize: '14px', fontWeight: 900, fontStyle: 'italic', color: paymentMethod === 'paypal' ? '#003087' : '#6b7280' }}>P</span>
                <span>PayPal</span>
              </div>
              <div className={`ch-payment-card ${paymentMethod === 'bank' ? 'active' : ''}`} onClick={() => setPaymentMethod('bank')}>
                <input type="radio" checked={paymentMethod === 'bank'} readOnly />
                <Landmark size={18} color={paymentMethod === 'bank' ? '#e8151b' : '#6b7280'} />
                <span>Bank Transfer</span>
              </div>
            </div>

            <button type="button" className="ch-submit-btn">
              <div className="ch-submit-left">
                <div className="ch-submit-step">3</div>
                <span>Place Order</span>
              </div>
              <div className="ch-submit-right">
                <Lock size={16} />
                <span>Secure Checkout</span>
              </div>
            </button>

          </div>

          {/* Right Column */}
          <div className="ch-right-col">
            <div className="ch-order-summary">
              <div className="ch-order-header">
                <h3>Your Order</h3>
                <a href="#edit" className="ch-edit-cart">Edit Cart</a>
              </div>

              <div className="ch-order-item">
                <img src="/assets/img/destination/dest_1_1.jpg" alt="Beach" className="ch-item-img" onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" }} />
                <div className="ch-item-details">
                  <h4 className="ch-item-title">Beach Paradise Getaway</h4>
                  <p className="ch-item-subtitle">2 Nights</p>
                </div>
                <div className="ch-item-price-col">
                  <h4 className="ch-item-price">$599</h4>
                  <p className="ch-item-qty">x 1</p>
                </div>
              </div>

              <div className="ch-summary-row">
                <span>Subtotal</span>
                <span className="val">$599</span>
              </div>
              <div className="ch-summary-row discount">
                <span>Discount</span>
                <span className="val">- $50</span>
              </div>
              <div className="ch-summary-row shipping">
                <span>Shipping</span>
                <span className="val">Free</span>
              </div>

              <div className="ch-total-row">
                <span className="ch-total-label">Total</span>
                <span className="ch-total-value">$549</span>
              </div>

              <div className="ch-price-guarantee">
                <div className="ch-pg-icon">
                  <ShieldCheck size={24} />
                </div>
                <div className="ch-pg-text">
                  <h5>Price Guarantee</h5>
                  <p>We guarantee the best price. Found it cheaper? We'll match it!</p>
                </div>
              </div>
            </div>

            <div className="ch-sidebar-badges">
              <div className="ch-sb-badge">
                <div className="ch-sb-icon">
                  <RotateCcw size={20} />
                </div>
                <div className="ch-sb-text">
                  <h5>Free Cancellation</h5>
                  <p>Cancel up to 24 hours before check-in</p>
                </div>
              </div>
              <div className="ch-sb-badge">
                <div className="ch-sb-icon">
                  <BadgeCheck size={20} />
                </div>
                <div className="ch-sb-text">
                  <h5>Best Price Guarantee</h5>
                  <p>We match any lower price</p>
                </div>
              </div>
              <div className="ch-sb-badge">
                <div className="ch-sb-icon">
                  <CreditCard size={20} />
                </div>
                <div className="ch-sb-text">
                  <h5>Secure Payment</h5>
                  <p>Your payment information is safe</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Badges */}
        <div className="ch-footer-badges">
          <div className="ch-fb-item">
            <div className="ch-fb-icon"><Star size={24} /></div>
            <div className="ch-fb-text">
              <h5>Trusted by 10,000+</h5>
              <p>Happy travelers</p>
            </div>
          </div>
          <div className="ch-fb-item">
            <div className="ch-fb-icon"><Star size={24} /></div>
            <div className="ch-fb-text">
              <h5>4.8/5 Rating</h5>
              <p>From our customers</p>
            </div>
          </div>
          <div className="ch-fb-item">
            <div className="ch-fb-icon"><Headphones size={24} /></div>
            <div className="ch-fb-text">
              <h5>24/7 Support</h5>
              <p>We're here to help</p>
            </div>
          </div>
          <div className="ch-fb-item">
            <div className="ch-fb-icon"><Globe2 size={24} /></div>
            <div className="ch-fb-text">
              <h5>Global Coverage</h5>
              <p>100+ destinations</p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="ch-footer-bottom">
          <div className="ch-copyright">
            © 2024 Wanderlust. All rights reserved.
          </div>
          <div className="ch-payment-icons">
            {/* Simple colored blocks for icons in mockup */}
            <span style={{color: '#1a1f71', fontWeight: 800, fontStyle: 'italic'}}>VISA</span>
            <span style={{display: 'flex'}}>
              <span style={{width: '16px', height: '16px', borderRadius: '50%', background: '#eb001b', marginRight: '-6px', zIndex: 1}}></span>
              <span style={{width: '16px', height: '16px', borderRadius: '50%', background: '#f79e1b'}}></span>
            </span>
            <span style={{color: '#003087', fontWeight: 800, fontStyle: 'italic'}}>PayPal</span>
            <span style={{fontWeight: 800}}>Apple Pay</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CheckoutInner;
