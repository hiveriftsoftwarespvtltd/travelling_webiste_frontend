import React, { useRef, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

const testimonials = [
  { name: "Poonam Khera", rating: 5, time: "2 months ago", color: "#1967d2", text: "Reena, you are absolutely amazing! Every single detail of our vacation was perfectly organized and executed. We are so incredibly thankful to you for arranging what truly felt like a dream-come-true trip for us. We are definitely looking forward to booking more future holidays managed by you and only you." },
  { name: "Anita Gakhar", rating: 5, time: "3 months ago", color: "#ea4335", text: "Thanks a lot, dear Reena! Because of your dedication, our recent family trip was absolutely wonderful. Every single facility we availed was top-notch, and we all had a genuinely excellent time together. We are highly eager to plan many more customized holiday trips with your team in the future." },
  { name: "Andy Doyle", rating: 5, time: "4 months ago", color: "#fbbc04", text: "Reena was highly responsive, professional, and clear with all information before and during the tour. She went out of his way to arrange great food and packed each day with unforgettable experiences. The entire layout of the journey was exceptionally well-organized from the moment we arrived." },
  { name: "R. Chhabra", rating: 5, time: "5 months ago", color: "#34a853", text: "Dear Reena ji, Namaskar. Thank you so much for putting together a customized holiday itinerary for us. The entire experience turned out to be thoroughly enjoyable, smooth, and entirely seamless throughout. We truly appreciate the incredible personal care and hard work put into managing our group." },
  { name: "Diane Isaac", rating: 5, time: "5 months ago", color: "#1967d2", text: "We had a wonderful time visiting the Taj Mahal! Everything was perfectly organized from start to finish. Both our tour guide and driver were fantastic - highly knowledgeable, professional, and very friendly. They made the entire sightseeing experience incredibly smooth and memorable for our family." },
  { name: "Kirsten Whitley", rating: 5, time: "6 months ago", color: "#ea4335", text: "Jiyo Life provides excellent travel services and very comfortable hospitality accommodations for guests. Their field guides are incredibly knowledgeable, patient, and kind throughout the daily excursions. We especially had a fantastic time in Jaipur with our local guide, who went entirely out of his way." },
  { name: "Jatin Choudhary", rating: 5, time: "7 months ago", color: "#fbbc04", text: "This was a very comfortable and beautifully planned trip across the beautiful state of Kerala. The premium hotels selected for us were nice, clean, and welcoming across all the various destinations. Our resort stay and the traditional luxury houseboat cruise will be completely unforgettable." },
  { name: "Aashish (Manali)", rating: 5, time: "8 months ago", color: "#34a853", text: "We planned a large college group tour to the mountains of Manali, Solang Valley, and scenic Kasol. The entire logistics setup, itinerary flow, and schedule were handled perfectly by Jiyo Life. Both the hotel quality and the adventure riverside camp quality were very good for our group." },
  { name: "Dolly Kakkar", rating: 5, time: "9 months ago", color: "#1967d2", text: "It was an absolutely wonderful vacation experience for our group during our recent trip to Vietnam. All of the on-ground arrangements and customized sightseeing tours were entirely up to the mark. The hotel selections were great and the local private transport arrangements were excellent." },
  { name: "RUC HI (Group)", rating: 5, time: "10 months ago", color: "#ea4335", text: "We had such a great experience with Jiyo Life! We traveled as a massive group of 25 people. We received the absolute best package price combined with truly top-tier customer service on the ground. Switzerland is beautiful, but the journey was made even better by the support of Reena." },
  { name: "Ritu Roy", rating: 5, time: "11 months ago", color: "#fbbc04", text: "Had a really good experience booking our recent group vacation with Jiyolife Travels Private Limited. Their operational team managed our large group smoothly and remained highly supportive throughout. The hotels, airport transfers, and daily coordination were all well-handled and completely stress-free." },
  { name: "Sonia Chhillar", rating: 5, time: "11 months ago", color: "#34a853", text: "Dear Jio Life Team, we had an amazing trip thanks to your excellent organization and planning. Everything was incredibly well-planned, and the local support team was super helpful at all times. We received exactly what was promised in our package and will definitely travel with you again." },
  { name: "Deepa Lohani", rating: 5, time: "1 year ago", color: "#1967d2", text: "Jiyolife arranged the absolute perfect, made-to-order vacation for us with no glitches or issues. From our initial arrival at the airport to our final departure, everything was fully taken care of. It was an incredibly relaxing experience that allowed us to just enjoy our holiday to the fullest." },
  { name: "V. K. Gupta", rating: 5, time: "1 year ago", color: "#ea4335", text: "Every single detail that was promised in our custom itinerary was fully covered by the agency. Authentic Indian food options were provided to us at all times during our travels across the circuit. The local guides were highly knowledgeable, and the accommodations were comfortable throughout." },
  { name: "Kakkar Atul", rating: 5, time: "1 year ago", color: "#fbbc04", text: "The level of personal care provided by the backend management team is truly commendable and rare. Being in constant touch to check on our comfort while the tour was actively going on was great. That dedicated live tracking support made our entire family feel incredibly safe and valued." },
  { name: "Renu Katyal", rating: 5, time: "1 year ago", color: "#34a853", text: "We had a very good experience traveling with Jiyo Life on our recent domestic vacation tour. The on-ground service was highly efficient, and the hospitality accommodations met all our needs. I would certainly recommend their package deals to anyone looking for a hassle-free holiday." },
  { name: "Keerti Raj", rating: 4, time: "1 year ago", color: "#1967d2", text: "The tour was well-planned overall. The hotels chosen were comfortable and the guides cooperative. Except for a few minor operational hitches along the way, the entire schedule went very well. I am quite happy with the services provided by Jio Travels and would use them again." },
  { name: "Nikita Antil", rating: 2, time: "2 years ago", color: "#ea4335", text: "The condition of the bus provided for our long journey was not good or clean at all. The trip suffered from multiple major delays which significantly ruined the overall travel experience. Furthermore, the staff members on the ground were unapproachable and lacked local knowledge." },
  { name: "Piyush Pandey", rating: 1, time: "2 years ago", color: "#fbbc04", text: "I am very disappointed with the low level of service we received during our recent family trip. There was a complete lack of guidance, direction, or basic coordination from the tour planner. We felt entirely left on our own without any professional backup support from the company." },
  { name: "Anjali Saini", rating: 1, time: "2 years ago", color: "#34a853", text: "This booking turned out to be a complete waste of money and a highly frustrating experience. There was zero coordination between the main office and the actual local transport operators. I would highly advise travelers to look elsewhere for a reliable, organized travel agency." }
];

const GOOGLE_G = "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg";

/* --- tiny helper -- no state, pure render --- */
const Stars = ({ rating, size = 14 }) => (
  <>
    {[...Array(5)].map((_, i) => (
      <i
        key={i}
        className={i < rating ? "fa-solid fa-star" : "fa-regular fa-star"}
        style={{ marginRight: 2, color: "#fbbc04", fontSize: size }}
      />
    ))}
  </>
);

/* --- card -- no state --- */
const ReviewCard = React.memo(({ item, onReadMore }) => {
  const isLong = item.text.length > 130;
  const preview = isLong ? item.text.slice(0, 130) + "..." : item.text;

  return (
    <div style={{
      background: "#fff", borderRadius: 12, padding: 24,
      boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
      height: "100%", display: "flex", flexDirection: "column",
    }}>
      {/* profile */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
        <div style={{ position: "relative", marginRight: 14, flexShrink: 0 }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            background: item.color, color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, fontWeight: "bold",
          }}>
            {item.name[0].toUpperCase()}
          </div>
          <div style={{
            position: "absolute", bottom: -4, right: -4,
            width: 20, height: 20, borderRadius: "50%",
            background: "#fff", display: "flex", alignItems: "center",
            justifyContent: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
          }}>
            <img src={GOOGLE_G} alt="G" style={{ width: 12 }} />
          </div>
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <strong style={{ fontSize: 15, color: "#202124", fontFamily: "Arial,sans-serif" }}>
              {item.name}
            </strong>
            <i className="fa-solid fa-circle-check" style={{ color: "#1a73e8", fontSize: 13 }} />
          </div>
          <span style={{ fontSize: 12, color: "#70757a", fontFamily: "Arial,sans-serif" }}>
            {item.time}
          </span>
        </div>
      </div>

      {/* stars */}
      <div style={{ marginBottom: 10 }}>
        <Stars rating={item.rating} />
      </div>

      {/* text */}
      <p style={{
        fontSize: 14, color: "#3c4043", lineHeight: 1.55,
        margin: 0, flexGrow: 1, fontFamily: "Arial,sans-serif"
      }}>
        {preview}
        {isLong && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onReadMore(item);
            }}
            style={{
              color: "#1a73e8", cursor: "pointer",
              marginLeft: 4, fontWeight: 500
            }}
          >
            Read more
          </span>
        )}
      </p>
    </div>
  );
});

/* ---------------------------------------------------------
   MAIN COMPONENT
   Key insight: modal is pre-rendered in the DOM (display:none).
   We NEVER call setState -- we mutate the DOM directly via refs.
   Swiper never sees a React re-render -> autoplay never stops.
--------------------------------------------------------- */
function TestimonialOne() {

  /* modal DOM refs */
  const overlayRef = useRef(null);
  const avatarRef = useRef(null);
  const nameRef = useRef(null);
  const timeRef = useRef(null);
  const starsRef = useRef(null);
  const textRef = useRef(null);
  const swiperRef = useRef(null); /* Reference to Swiper instance */

  /* open: populate DOM, then show overlay -- zero React state */
  const openModal = useCallback((item) => {
    if (!overlayRef.current) return;

    avatarRef.current.textContent = item.name[0].toUpperCase();
    avatarRef.current.style.backgroundColor = item.color;
    nameRef.current.textContent = item.name;
    timeRef.current.textContent = item.time;
    textRef.current.textContent = item.text;
    starsRef.current.innerHTML = [...Array(5)]
      .map((_, i) =>
        `<i class="${i < item.rating ? "fa-solid" : "fa-regular"} fa-star"
             style="margin-right:2px;color:#fbbc04;font-size:15px;"></i>`)
      .join("");

    overlayRef.current.style.display = "flex";
    document.body.style.overflow = "hidden";
  }, []);

  /* close: hide overlay -- zero React state */
  const closeModal = useCallback(() => {
    if (!overlayRef.current) return;
    overlayRef.current.style.display = "none";
    document.body.style.overflow = "";
    
    // Forcefully restart the continuous scroll if it paused
    if (swiperRef.current && swiperRef.current.autoplay) {
      swiperRef.current.autoplay.start();
    }
  }, []);

  return (
    <>
      {/* --- SECTION --- */}
      <section
        className="testi-area overflow-hidden shape-mockup-wrap"
        id="testi-sec"
        style={{ backgroundColor: "#f8f9fa", padding: "30px 0" }}
      >
        <div className="container-fluid p-0">

          {/* heading */}
          <div className="title-area mb-40 text-center">
            <span style={{ color: '#e8151b', fontWeight: 700, fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '8px', fontFamily: "'Inter', sans-serif" }}>Testimonial</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 700, color: '#0d1b2a', marginBottom: '10px', lineHeight: 1.2 }}>What Clients Say About Us</h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#e8151b' }}>
               <div style={{ width: '30px', height: '1.5px', background: '#e8151b' }}></div>
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(45deg)' }}><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.5l-1.3 1.5c-.3.3-.3.8 0 1.1L7 13l-4 4-1.5-.5c-.3 0-.6.1-.8.4l-.4.4c-.2.2-.2.6 0 .8l2.5 2.5 2.5 2.5c.2.2.6.2.8 0l.4-.4c.3-.2.4-.5.4-.8l-.5-1.5 4-4 3.7 4.6c.3.4.8.4 1.1 0l1.5-1.3c.3-.2.6-.6.5-1.1z"/></svg>
            </div>
            <div style={{
              display: "flex", alignItems: "center",
              justifyContent: "center", marginTop: 10, gap: 8
            }}>
              <span style={{ fontSize: 18, fontWeight: 600 }}>4.8</span>
              <div style={{ color: "#fbbc04", fontSize: 16 }}>
                {[...Array(4)].map((_, i) =>
                  <i key={i} className="fa-solid fa-star" style={{ marginRight: 2 }} />
                )}
                <i className="fa-solid fa-star-half-stroke" />
              </div>
              <span style={{ fontSize: 13, color: "#70757a" }}>Based on 452 reviews</span>
            </div>
          </div>

          {/* slider */}
          <div style={{ padding: "0 20px" }}>
            {testimonials.length > 0 && (
            <Swiper
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              modules={[Autoplay, FreeMode]}
              spaceBetween={24}
              loop={true}
              freeMode={true}
              speed={4500}
              allowTouchMove={false}
              autoplay={{ delay: 0, disableOnInteraction: false, pauseOnMouseEnter: false }}
              breakpoints={{
                0: { slidesPerView: 1 },
                576: { slidesPerView: 1.5 },
                767: { slidesPerView: 2 },
                992: { slidesPerView: 3 },
                1200: { slidesPerView: 4 },
              }}
              style={{ paddingBottom: 20 }}
            >
              {testimonials.map((item, idx) => (
                <SwiperSlide key={item._id || idx} style={{ height: "auto" }}>
                  <ReviewCard item={item} onReadMore={() => openModal(item)} />
                </SwiperSlide>
              ))}
            </Swiper>
            )}
          </div>

        </div>

        <div className="shape-mockup d-none d-xl-block"
          style={{ bottom: "-2%", right: "0%", opacity: 0.5 }}>
          <img src="/assets/img/shape/line2.png" alt="shape" />
        </div>
        <div className="shape-mockup movingX d-none d-xl-block"
          style={{ top: "30%", left: "5%", opacity: 0.5 }}>
          <img src="/assets/img/shape/shape_7.png" alt="shape" />
        </div>
      </section>

      {/* --- MODAL (pre-rendered, hidden via display:none) ---
          Lives outside the section, uses refs, never causes
          a React re-render. Swiper is completely unaffected.
      --------------------------------------------------------- */}
      <div
        ref={overlayRef}
        onClick={closeModal}
        style={{
          display: "none",        /* toggled directly via DOM */
          position: "fixed", top: 0, left: 0,
          width: "100vw", height: "100vh",
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(4px)",
          zIndex: 99999,
          alignItems: "center", justifyContent: "center",
          padding: 20,
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%", maxWidth: 500,
            background: "#fff", borderRadius: 14,
            padding: 28, position: "relative",
            boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
          }}
        >
          {/* close btn */}
          <button
            onClick={closeModal}
            style={{
              position: "absolute", top: 12, right: 14,
              background: "transparent", border: "none",
              fontSize: 20, color: "#70757a", cursor: "pointer",
            }}
          >
            <i className="fa-solid fa-xmark" />
          </button>

          {/* profile */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
            <div style={{ position: "relative", marginRight: 14 }}>
              <div
                ref={avatarRef}
                style={{
                  width: 52, height: 52, borderRadius: "50%",
                  color: "#fff", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 24, fontWeight: "bold",
                }}
              />
              <div style={{
                position: "absolute", bottom: -4, right: -4,
                width: 20, height: 20, borderRadius: "50%",
                background: "#fff", display: "flex", alignItems: "center",
                justifyContent: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
              }}>
                <img src={GOOGLE_G} alt="G" style={{ width: 12 }} />
              </div>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <strong ref={nameRef}
                  style={{
                    fontSize: 17, color: "#202124",
                    fontFamily: "Arial,sans-serif"
                  }} />
                <i className="fa-solid fa-circle-check"
                  style={{ color: "#1a73e8", fontSize: 14 }} />
              </div>
              <span ref={timeRef}
                style={{
                  fontSize: 13, color: "#70757a",
                  fontFamily: "Arial,sans-serif"
                }} />
            </div>
          </div>

          {/* stars (filled by JS) */}
          <div ref={starsRef} style={{ marginBottom: 14 }} />

          {/* full review text */}
          <p ref={textRef}
            style={{
              fontSize: 15, color: "#3c4043", lineHeight: 1.7,
              margin: 0, fontFamily: "Arial,sans-serif"
            }} />
        </div>
      </div>
    </>
  );
}

export default TestimonialOne;
