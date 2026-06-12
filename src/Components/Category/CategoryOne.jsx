import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Link } from "react-router-dom";
import { Plane } from "lucide-react";

const CategoryOne = () => {
  const swiperRef = useRef(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from backend API
    fetch(`${process.env.REACT_APP_API_BASE_URL}/categories`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        }
      })
      .catch(err => console.log('Category API fallback triggered:', err));
  }, []);

  return (
    <section
      className="category-area"
      style={{ 
        background: "#fff",
        paddingTop: "30px",
        paddingBottom: "80px",
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <div className="container th-container">
        <div className="title-area text-center mb-40">
          <h2 className="sec-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 700, color: '#0d1b2a', margin: '0 0 10px' }}>Tour Categories</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#e8151b' }}>
            <div style={{ width: '30px', height: '1.5px', background: '#e8151b' }}></div>
            <Plane size={14} fill="currentColor" style={{ transform: 'rotate(45deg)' }} />
          </div>
        </div>

        <style>{`
          /* Ensure linear smooth scroll for Swiper */
          .categorySlider .swiper-wrapper {
            transition-timing-function: linear !important;
          }
          /* Force smaller font size for subtitle */
          .category-area .css-ur045q-sub {
            font-size: 12px !important;
            margin-bottom: 0 !important;
            display: inline-block !important;
          }
          /* Reduce space above the title */
          .category-area .sec-title {
            margin-top: 0 !important;
          }
        `}</style>

        {/* Re-render Swiper dynamically once categories loaded */}
        {categories.length > 0 && (
          <Swiper
            ref={swiperRef}
            modules={[Autoplay]}
            slidesPerView={1}
            breakpoints={{
              0: { slidesPerView: 1 },
              576: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              992: { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
            }}
            spaceBetween={24}
            loop={true}
            autoplay={{ delay: 0, disableOnInteraction: false }}
            speed={4000}
            allowTouchMove={true}
            className="th-slider has-shadow categorySlider"
            style={{ paddingBottom: '30px' }}
          >
            {categories.map((category, index) => (
              <SwiperSlide key={category._id || index}>
                <div className="category-card" style={{ background: '#fff', borderRadius: '15px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div className="box-img global-img" style={{ height: '220px', overflow: 'hidden', borderRadius: '0' }}>
                    <img
                      src={category.imgSrc || "/assets/img/normal/about_3_1.jpg"}
                      alt={category.title}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease', borderRadius: '0' }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </div>
                  <div style={{ padding: '20px 15px', textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <h3 className="box-title" style={{ fontSize: '16px', fontWeight: 700, color: '#111', margin: '0 0 8px', fontFamily: "'Inter', sans-serif" }}>
                      <Link to="/destination" style={{ color: 'inherit', textDecoration: 'none' }}>{category.title}</Link>
                    </h3>
                    <div style={{ color: '#1a73e8', fontSize: '13px', fontWeight: 600, marginBottom: '0' }}>{Math.floor(Math.random() * 100 + 50)}+ Tours</div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

      </div>
    </section>
  );
};

export default CategoryOne;
