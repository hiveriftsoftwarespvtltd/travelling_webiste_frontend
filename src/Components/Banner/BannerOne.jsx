import React from 'react';
import HeroSearchFilter from './HeroSearchFilter';

function BannerOne() {
  const staticBg = '/assets/img/hero/hero_1_1.png';

  return (
    <div className="hero-section-wrap">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:wght@500;600;700;800&display=swap');

        /* ===== OUTER WRAPPER ===== */
        .hero-section-wrap {
          width: 100%;
          background: #0d1b2a;
          font-family: 'Inter', sans-serif;
          position: relative;
        }

        /* ===== BACKGROUND SLIDER ===== */
        .hero-bg-slider {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        /* ===== SLIDE = background image ===== */
        .hero-slide {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: top center;
          background-repeat: no-repeat;
          filter: brightness(1.1) contrast(1.1);
        }

        /* gradient overlay */
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(255,255,255,0.4) 0%,
            rgba(255,255,255,0.15) 50%,
            rgba(255,255,255,0) 100%
          );
          pointer-events: none;
          z-index: 2;
        }

        /* ===== INNER CONTENT (text + filter, same column) ===== */
        .hero-inner-content {
          position: relative;
          z-index: 3;
          display: flex;
          flex-direction: column;
          padding: 120px 15px 0 15px;
        }

        /* ===== TEXT BLOCK ===== */
        .hero-text-block {
          max-width: 680px;
          padding-bottom: 40px;
        }
        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(3rem, 5vw, 4.5rem);
          font-weight: 700;
          color: #0d1b2a;
          line-height: 1.1;
          margin: 0 0 15px;
          letter-spacing: -0.5px;
        }
        .hero-subtitle {
          font-size: clamp(1rem, 1.8vw, 1.25rem);
          font-weight: 500;
          color: #2b3a4a;
          margin: 0 0 35px;
          line-height: 1.5;
        }
        .hero-badges {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 15px;
        }
        .hero-badge-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #0d1b2a;
        }
        .hero-badge-icon {
          width: 32px;
          height: 32px;
          background: #e8151b;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .hero-badge-icon i { color: #fff; font-size: 13px; }
        .hero-badge-sep {
          width: 1px;
          height: 14px;
          background: rgba(0,0,0,0.15);
          margin: 0 16px;
        }

        /* ===== FILTER BOX (sits in the same flow as text) ===== */
        .hero-filter-box {
          width: 100%;
          margin-bottom: -60px;
          position: relative;
          z-index: 10;
        }

        /* ===== SWIPER ARROWS ===== */
        .hero-arrows {
          position: absolute;
          top: 45%;
          left: 0;
          right: 0;
          transform: translateY(-50%);
          z-index: 10;
          display: flex;
          justify-content: space-between;
          padding: 0 16px;
          pointer-events: none;
        }
        .hero-arrow-btn {
          pointer-events: auto;
          width: 36px;
          height: 36px;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          backdrop-filter: blur(4px);
          transition: 0.2s;
          color: #fff;
        }
        .hero-arrow-btn:hover { background: rgba(255,255,255,0.3); }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1199px) {
          .hero-inner-content { padding: 120px 28px 0 28px; }
        }
        @media (max-width: 991px) {
          .hero-inner-content { padding: 110px 20px 0 20px; }
          .hero-text-block { padding-bottom: 22px; }
          .hero-filter-box { padding-bottom: 24px; }
          .hero-badge-sep { margin: 0 10px; }
        }
        @media (max-width: 576px) {
          .hero-inner-content { padding: 100px 12px 0 12px; }
          .hero-text-block { padding-bottom: 16px; }
          .hero-filter-box { padding-bottom: 16px; }
          .hero-badge-sep { display: none; }
        }
      `}</style>

      {/* BACKGROUND STATIC IMAGE */}
      <div className="hero-bg-slider">
        <div
          className="hero-slide"
          style={{ backgroundImage: `url(${staticBg})` }}
        />
      </div>

      {/* FOREGROUND CONTENT (STATIC) */}
      <>
        {/* dark left-to-right gradient overlay */}
        <div className="hero-overlay" />

        {/* All static content sits inside the hero — above the slider */}
        <div className="hero-inner-content container">
          {/* TEXT BLOCK */}
          <div className="hero-text-block">
            <h1 className="hero-title"><span style={{ color: '#111' }}>Explore</span><br /><span style={{ color: '#e8151b' }}>the World</span></h1>
            <p className="hero-subtitle">Discover new places, create unforgettable<br />memories and experience the world.</p>
            <div className="hero-badges">
              <div className="hero-badge-item">
                <div className="hero-badge-icon"><i className="fa-solid fa-location-dot"></i></div>
                <div style={{ lineHeight: '1.2' }}>Best Price<br />Guarantee</div>
              </div>
              <div className="hero-badge-item">
                <div className="hero-badge-icon"><i className="fa-solid fa-headset"></i></div>
                <div style={{ lineHeight: '1.2' }}>24/7 Customer<br />Support</div>
              </div>
              <div className="hero-badge-item">
                <div className="hero-badge-icon"><i className="fa-solid fa-gem"></i></div>
                <div style={{ lineHeight: '1.2' }}>Handpicked<br />Experiences</div>
              </div>
            </div>
          </div>

          {/* FILTER CARD */}
          <div className="hero-filter-box">
            <HeroSearchFilter />
          </div>
        </div>
      </>
    </div>
  );
}

export default BannerOne

