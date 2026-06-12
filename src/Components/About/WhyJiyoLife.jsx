import React from 'react';
import { Plane, ShieldCheck, Globe, Headset, User, Calendar, Gem } from 'lucide-react';

function WhyJiyoLife() {
  return (
    <section className="why-jiyo-area">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap');

        .why-jiyo-area {
          padding: 100px 0;
          background: #fff;
          font-family: 'Inter', sans-serif;
          overflow: hidden;
        }

        .why-top-title {
          text-align: center;
          margin-bottom: 60px;
        }

        .why-main-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 3.5vw, 2.8rem);
          font-weight: 700;
          color: #0d1b2a;
          margin: 0 0 10px;
        }

        .why-title-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: #e8151b;
        }

        .why-title-divider .line {
          width: 30px;
          height: 1.5px;
          background: #e8151b;
        }

        .why-jiyo-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
        }

        .why-left-col, .why-right-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 50px;
        }

        .why-center-col {
          flex: 0 0 400px;
          display: flex;
          justify-content: center;
          position: relative;
        }

        /* Center Image Card */
        .why-image-card {
          width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 20px;
          position: relative;
        }

        .why-image-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 20px;
        }

        /* 10K+ Badge */
        .why-traveler-badge {
          position: absolute;
          bottom: -25px;
          left: 50%;
          transform: translateX(-50%);
          background: #fff;
          padding: 18px 25px;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          white-space: nowrap;
          z-index: 10;
        }
        .badge-text {
          font-size: 13px;
          font-weight: 700;
          color: #444;
        }
        .badge-avatars {
          display: flex;
          align-items: center;
        }
        .badge-avatars img {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 2px solid #fff;
          margin-left: -12px;
          object-fit: cover;
        }
        .badge-avatars img:first-child {
          margin-left: 0;
        }

        /* Feature Item */
        .why-feature-item {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }

        .why-feature-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: #e8151b;
          color: #fff;
          transition: 0.3s;
        }

        .why-feature-item:hover .why-feature-icon {
          box-shadow: 0 8px 20px rgba(232, 21, 27, 0.3);
          transform: translateY(-2px);
        }

        .why-feature-content {
          flex: 1;
        }

        .why-feature-title {
          font-size: 16px;
          font-weight: 700;
          color: #222;
          margin: 0 0 8px;
        }

        .why-feature-desc {
          font-size: 13px;
          color: #666;
          line-height: 1.6;
          margin: 0;
          font-weight: 500;
        }

        @media (max-width: 991px) {
          .why-jiyo-container {
            flex-direction: column;
            gap: 60px;
          }
          .why-center-col {
            order: -1;
            flex: 0 0 auto;
            width: 100%;
            max-width: 400px;
            margin-top: 20px;
          }
          .why-left-col, .why-right-col {
            width: 100%;
          }
        }
      `}</style>

      <div className="why-top-title">
        <h2 className="why-main-title">Why Jiyo Life Travels?</h2>
        <div className="why-title-divider">
          <div className="line"></div>
          <Plane size={14} fill="currentColor" style={{ transform: 'rotate(45deg)' }} />
        </div>
      </div>

      <div className="why-jiyo-container">
        
        {/* Left Column */}
        <div className="why-left-col">
          <div className="why-feature-item">
            <div className="why-feature-icon">
              <ShieldCheck size={24} />
            </div>
            <div className="why-feature-content">
              <h4 className="why-feature-title">Trip Personalization</h4>
              <p className="why-feature-desc">We customize your trip to match your style and preferences.</p>
            </div>
          </div>

          <div className="why-feature-item">
            <div className="why-feature-icon">
              <Globe size={24} />
            </div>
            <div className="why-feature-content">
              <h4 className="why-feature-title">Worldwide Coverage</h4>
              <p className="why-feature-desc">Access thousands of destinations across the globe.</p>
            </div>
          </div>

          <div className="why-feature-item">
            <div className="why-feature-icon">
              <Headset size={24} />
            </div>
            <div className="why-feature-content">
              <h4 className="why-feature-title">Top Notch Support</h4>
              <p className="why-feature-desc">Our travel experts are available 24/7 to assist you.</p>
            </div>
          </div>
        </div>

        {/* Center Column - Image */}
        <div className="why-center-col">
          <div className="why-image-card">
            <img src="/assets/img/hero/hero_bg_1_1.jpeg" alt="Why Jiyo Life" />
          </div>
        </div>

        {/* Right Column */}
        <div className="why-right-col">
          <div className="why-feature-item">
            <div className="why-feature-icon">
              <User size={24} />
            </div>
            <div className="why-feature-content">
              <h4 className="why-feature-title">Best Tour Guide</h4>
              <p className="why-feature-desc">Expert local guides to show you the real culture and history.</p>
            </div>
          </div>

          <div className="why-feature-item">
            <div className="why-feature-icon">
              <Calendar size={24} />
            </div>
            <div className="why-feature-content">
              <h4 className="why-feature-title">Hassle-Free Bookings</h4>
              <p className="why-feature-desc">Book your trip in minutes with easy and secure process.</p>
            </div>
          </div>

          <div className="why-feature-item">
            <div className="why-feature-icon">
              <Gem size={24} />
            </div>
            <div className="why-feature-content">
              <h4 className="why-feature-title">Authentic Experiences</h4>
              <p className="why-feature-desc">Handpicked activities and stays that connect you to the real world.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default WhyJiyoLife;
