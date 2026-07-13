import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import HeroSearchFilter from './HeroSearchFilter';

function BannerOne() {
  const [slides, setSlides] = useState([
    {
      title: 'Explore the World',
      subTitle: 'Discover new places, create unforgettable memories and experience the world.',
      bgImage: '/assets/img/hero/hero_1_1.png',
      buttonText: '',
      buttonLink: '',
    }
  ]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/banner`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const activeSlides = data.filter(slide => slide.status !== 'Inactive');
          if (activeSlides.length > 0) {
            setSlides(activeSlides);
          }
        }
      })
      .catch(err => console.error('Failed to fetch banners:', err));
  }, []);

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
            rgba(255,255,255,0.45) 0%,
            rgba(255,255,255,0.2) 50%,
            rgba(255,255,255,0) 100%
          );
          pointer-events: none;
        }

        /* ===== INNER CONTENT ===== */
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
          padding-bottom: 20px;
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
          margin: 0 0 20px;
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

        /* ===== FILTER BOX ===== */
        .hero-filter-box {
          width: 100%;
          position: relative;
          z-index: 10;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1199px) {
          .hero-inner-content { padding: 120px 28px 0 28px; }
        }
        @media (max-width: 991px) {
          .hero-inner-content { padding: 110px 20px 0 20px; }
          .hero-text-block { padding-bottom: 22px; }
        }
        @media (max-width: 576px) {
          .hero-inner-content { padding: 100px 12px 0 12px; }
          .hero-text-block { padding-bottom: 16px; }
        }
      `}</style>

      {/* SWIPER BACKGROUND & CONTENT SLIDER */}
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        loop={slides.length > 1}
        autoplay={slides.length > 1 ? { delay: 6000, disableOnInteraction: false } : false}
        style={{ width: '100%', minHeight: '650px' }}
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={slide._id || idx}>
            <div className="hero-slide-wrap" style={{ position: 'relative', width: '100%', minHeight: '650px', display: 'flex', alignItems: 'center' }}>
              <div
                className="hero-slide"
                style={{
                  backgroundImage: `url(${slide.bgImage})`,
                  position: 'absolute',
                  inset: 0,
                  zIndex: 1
                }}
              />
              <div className="hero-overlay" style={{ zIndex: 2, position: 'absolute', inset: 0 }} />
              <div className="hero-inner-content container" style={{ position: 'relative', zIndex: 3, paddingBottom: '140px', paddingTop: '100px' }}>
                <div className="hero-text-block">
                  <h1 className="hero-title">
                    {slide.title}
                  </h1>
                  <p className="hero-subtitle">
                    {slide.subTitle}
                  </p>
                  
                  {slide.buttonText ? (
                    <div style={{ marginTop: '10px' }}>
                      <Link
                        to={slide.buttonLink || '/destination'}
                        className="th-btn"
                        style={{
                          background: '#e8151b',
                          color: '#fff',
                          padding: '12px 28px',
                          borderRadius: '8px',
                          fontWeight: '700',
                          fontSize: '15px',
                          textDecoration: 'none',
                          boxShadow: '0 4px 15px rgba(232, 21, 27, 0.35)',
                          display: 'inline-block'
                        }}
                      >
                        {slide.buttonText}
                      </Link>
                    </div>
                  ) : (
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
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* FLOATING FILTER CARD ABOVE SLIDER */}
      <div className="container" style={{ position: 'absolute', bottom: '-40px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, width: '100%', padding: '0 15px' }}>
        <div className="hero-filter-box">
          <HeroSearchFilter />
        </div>
      </div>
    </div>
  );
}

export default BannerOne;

