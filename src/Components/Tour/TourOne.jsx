import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Plane } from 'lucide-react';
import DestinationCard from '../Destination/DestinationCard';

function TourOne() {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/destinations`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const popularDestinations = data
            .filter(dest => dest.isPopularTour === true)
            .map(dest => ({
              _id: dest._id,
              title: dest.name || dest.pageTitle || 'Destination',
              image: dest.image,
              price: dest.price || 1980,
              duration: '7 Days',
              rating: 4.8,
              reviewsCount: dest.listings || Math.floor(Math.random() * 100 + 50),
            }));
          
          if (popularDestinations.length > 0) {
            setTours(popularDestinations);
          }
        }
      })
      .catch(err => console.log('Tour API fallback triggered:', err));
  }, []);

  return (
    <section className="tour-area" style={{ background: '#fff', fontFamily: "'Inter', sans-serif", paddingBottom: '3rem' }}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="title-area text-center mb-40">
              <h2 className="sec-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 700, color: '#0d1b2a', margin: '0 0 10px' }}>Top Rated Tours</h2>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#e8151b' }}>
                <div style={{ width: '30px', height: '1.5px', background: '#e8151b' }}></div>
                <Plane size={14} fill="currentColor" style={{ transform: 'rotate(45deg)' }} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="slider-area tour-slider">
          {tours.length > 0 && (
          <Swiper
            breakpoints={{
              0: { slidesPerView: 1 },
              576: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              992: { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
            }}
            spaceBetween={24}
            grabCursor={true}
            className="swiper th-slider has-shadow slider-drag-wrap"
            style={{ paddingBottom: '30px' }}
          >
            {tours.map((tour, index) => (
              <SwiperSlide key={tour._id || index}>
                <DestinationCard 
                  destinationID={tour._id}
                  destinationImage={tour.image}
                  destinationTitle={tour.title}
                  destinationPrice={tour.price}
                  destinationDuration={tour.duration}
                  rating={tour.rating}
                  reviewsCount={tour.reviewsCount}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          )}
        </div>
      </div>
    </section>
  );
}

export default TourOne;
