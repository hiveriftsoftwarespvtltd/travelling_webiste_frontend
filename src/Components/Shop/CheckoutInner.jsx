import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ShieldCheck, 
  Headphones, 
  MapPin, 
  Clock, 
  UserCheck, 
  PhoneCall, 
  CalendarDays, 
  FileText 
} from 'lucide-react';
import './CheckoutNew.css';

function CheckoutInner() {
  const location = useLocation();
  const navigate = useNavigate();

  // Try to get passed state (tour details)
  const initialTourId = location.state?.tourId || '';
  const initialTourName = location.state?.tourName || '';

  // Form Fields State
  const [tourId, setTourId] = useState(initialTourId);
  const [tourName, setTourName] = useState(initialTourName);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('India');
  const [specialRequirements, setSpecialRequirements] = useState('');

  // Auxiliary States
  const [toursList, setToursList] = useState([]);
  const [selectedTourDetails, setSelectedTourDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch tours if no tour was selected or to display information
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/destinations`)
      .then(res => {
        setToursList(res.data || []);
        // If we have an initialTourId, find details
        if (initialTourId) {
          const matched = (res.data || []).find(t => t._id === initialTourId);
          if (matched) {
            setSelectedTourDetails(matched);
          }
        }
      })
      .catch(err => console.error('Failed to fetch destinations/tours', err));
  }, [initialTourId]);

  // Handle dropdown change of tour
  const handleTourChange = (e) => {
    const selectedId = e.target.value;
    setTourId(selectedId);
    const matched = toursList.find(t => t._id === selectedId);
    if (matched) {
      setTourName(matched.name);
      setSelectedTourDetails(matched);
    } else {
      setTourName('');
      setSelectedTourDetails(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tourId || !tourName) {
      setErrorMsg('Please select a tour packages before submitting.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '.';

    const payload = {
      tourId,
      tourName,
      firstName,
      lastName,
      email,
      mobile,
      city,
      country,
      travelDate,
      adults: Number(adults),
      children: Number(children),
      rooms: Number(rooms),
      specialRequirements,
      status: 'New'
    };

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/bookings`, payload);
      if (res.status === 200 || res.status === 201) {
        setSuccess(true);
      } else {
        throw new Error('Server returned an unexpected status code');
      }
    } catch (err) {
      console.error('Failed to submit booking enquiry', err);
      setErrorMsg(err.response?.data?.message || 'Failed to submit booking request. Please check fields and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="checkout-redesign-wrapper" style={{ padding: '80px 0' }}>
        <div className="container text-center" style={{ maxWidth: '600px', background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
          <div style={{ width: '72px', height: '72px', background: '#ecfdf5', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContainer: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <UserCheck size={36} />
          </div>
          <h2 style={{ fontWeight: 800, color: '#111827', marginBottom: '12px' }}>Request Submitted!</h2>
          <p style={{ fontSize: '16px', color: '#4b5563', lineHeight: '1.6', marginBottom: '32px' }}>
            Thank you for your booking request. Our travel expert will contact you shortly.
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <Link to="/tour" className="th-btn" style={{ padding: '14px 28px', textDecoration: 'none' }}>
              Browse More Tours
            </Link>
            <Link to="/" className="th-btn style3" style={{ padding: '14px 28px', textDecoration: 'none' }}>
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
              <h4>Direct Enquiry</h4>
              <p>No Online Payment Required</p>
            </div>
          </div>
          <div className="ch-feature-item">
            <div className="ch-feature-icon">
              <PhoneCall size={24} />
            </div>
            <div className="ch-feature-text">
              <h4>Manual Callback</h4>
              <p>Team reaches out to coordinate</p>
            </div>
          </div>
          <div className="ch-feature-item">
            <div className="ch-feature-icon">
              <Headphones size={24} />
            </div>
            <div className="ch-feature-text">
              <h4>24/7 Agency Care</h4>
              <p>Personalized travel planning</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="ch-main-grid">
          {/* Left Column */}
          <div className="ch-left-col">
            <h2 className="ch-section-title">Book This Tour</h2>
            <p className="ch-section-subtitle">Please enter your contact and travel details to request a booking callback.</p>

            {errorMsg && (
              <div className="alert alert-danger mb-4" style={{ borderRadius: '8px', padding: '12px 16px', fontWeight: '500' }}>
                <i className="fa-solid fa-triangle-exclamation me-2" />
                {errorMsg}
              </div>
            )}

            {/* Tour selection dropdown */}
            <div className="ch-form-grid full">
              <div className="ch-form-group">
                <label>Select Tour Package *</label>
                <div style={{ position: 'relative' }}>
                  <select 
                    className="ch-select" 
                    value={tourId} 
                    onChange={handleTourChange}
                    required
                    style={{ paddingRight: '40px' }}
                  >
                    <option value="" disabled>-- Select Tour Package --</option>
                    {toursList.map(t => (
                      <option key={t._id} value={t._id}>{t.name} ({t.duration || 'N/A'})</option>
                    ))}
                  </select>
                  <MapPin size={16} color="#6b7280" style={{ position: 'absolute', right: '16px', top: '14px', pointerEvents: 'none' }} />
                </div>
              </div>
            </div>

            <div className="ch-form-grid">
              <div className="ch-form-group">
                <label>Full Name *</label>
                <input 
                  type="text" 
                  className="ch-input" 
                  placeholder="Enter your full name" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required 
                />
              </div>
              <div className="ch-form-group">
                <label>Mobile Number *</label>
                <input 
                  type="tel" 
                  className="ch-input" 
                  placeholder="Enter 10-digit mobile number" 
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="ch-form-grid">
              <div className="ch-form-group">
                <label>Email Address *</label>
                <input 
                  type="email" 
                  className="ch-input" 
                  placeholder="Enter email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="ch-form-group">
                <label>Travel Date *</label>
                <input 
                  type="date" 
                  className="ch-input" 
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="ch-form-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              <div className="ch-form-group">
                <label>Adults * (12+ Yrs)</label>
                <input 
                  type="number" 
                  className="ch-input" 
                  min="1" 
                  value={adults}
                  onChange={(e) => setAdults(e.target.value)}
                  required 
                />
              </div>
              <div className="ch-form-group">
                <label>Children (2-12 Yrs)</label>
                <input 
                  type="number" 
                  className="ch-input" 
                  min="0" 
                  value={children}
                  onChange={(e) => setChildren(e.target.value)}
                />
              </div>
              <div className="ch-form-group">
                <label>Rooms Required</label>
                <input 
                  type="number" 
                  className="ch-input" 
                  min="1" 
                  value={rooms}
                  onChange={(e) => setRooms(e.target.value)}
                />
              </div>
            </div>

            <div className="ch-form-grid">
              <div className="ch-form-group">
                <label>City</label>
                <input 
                  type="text" 
                  className="ch-input" 
                  placeholder="Your City" 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="ch-form-group">
                <label>Country</label>
                <input 
                  type="text" 
                  className="ch-input" 
                  placeholder="Your Country" 
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </div>

            <div className="ch-form-grid full">
              <div className="ch-form-group">
                <label>Special Requirements (Optional)</label>
                <textarea 
                  className="ch-textarea" 
                  rows="4" 
                  placeholder="Enter details about your preferences, food requirements, extra beds, etc."
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                ></textarea>
              </div>
            </div>

            <button type="submit" className="ch-submit-btn" disabled={loading} style={{ background: 'var(--theme-color)' }}>
              <div className="ch-submit-left">
                <CalendarDays size={18} />
                <span>{loading ? 'Submitting request...' : 'Submit Booking Request'}</span>
              </div>
              <div className="ch-submit-right">
                <FileText size={16} />
                <span>Enquiry Checkout</span>
              </div>
            </button>

          </div>

          {/* Right Column (Sidebar Summary card) */}
          <div className="ch-right-col">
            {selectedTourDetails ? (
              <div className="ch-order-summary">
                <div className="ch-order-header" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '15px' }}>
                  <h3>Package Overview</h3>
                </div>

                <div className="ch-order-item" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0, marginTop: '15px' }}>
                  <img 
                    src={selectedTourDetails.image ? (selectedTourDetails.image.startsWith('http') || selectedTourDetails.image.startsWith('/') ? selectedTourDetails.image : `/assets/img/destination/${selectedTourDetails.image}`) : '/assets/img/destination/destination_detail.png'} 
                    alt="Tour Thumb" 
                    className="ch-item-img" 
                    onError={(e) => { e.target.src = "/assets/img/destination/destination_detail.png" }} 
                    style={{ width: '80px', height: '80px', borderRadius: '8px' }}
                  />
                  <div className="ch-item-details">
                    <h4 className="ch-item-title" style={{ fontSize: '16px', color: '#1e293b' }}>{selectedTourDetails.name}</h4>
                    <span style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
                      <Clock size={14} /> {selectedTourDetails.duration || '7 Days'}
                    </span>
                    {selectedTourDetails.location && (
                      <span style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
                        <MapPin size={14} /> {selectedTourDetails.location}
                      </span>
                    )}
                  </div>
                </div>

                {selectedTourDetails.price && (
                  <div className="ch-total-row" style={{ marginTop: '20px', paddingTop: '15px' }}>
                    <span className="ch-total-label" style={{ fontSize: '16px' }}>Estimated Cost</span>
                    <span className="ch-total-value" style={{ fontSize: '20px', color: 'var(--theme-color)' }}>{selectedTourDetails.price}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="ch-order-summary text-center py-4" style={{ color: '#64748b' }}>
                <MapPin size={32} style={{ margin: '0 auto 10px', color: '#94a3b8' }} />
                <p style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>Choose a tour from the selection list to see duration and cost details.</p>
              </div>
            )}

            <div className="ch-sidebar-badges">
              <div className="ch-sb-badge">
                <div className="ch-sb-icon">
                  <UserCheck size={20} />
                </div>
                <div className="ch-sb-text">
                  <h5>Manual Booking Validation</h5>
                  <p>Our advisors coordinate details via Phone or WhatsApp before confirmation.</p>
                </div>
              </div>
              <div className="ch-sb-badge">
                <div className="ch-sb-icon">
                  <ShieldCheck size={20} />
                </div>
                <div className="ch-sb-text">
                  <h5>No Pre-payments Required</h5>
                  <p>Book risk-free. Modify details during consultation.</p>
                </div>
              </div>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}

export default CheckoutInner;
