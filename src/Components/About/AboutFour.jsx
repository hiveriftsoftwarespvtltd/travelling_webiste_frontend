import { Link } from 'react-router-dom'
import { Plane } from 'lucide-react'

function AboutFour() {
   return (
      <div className="about-area position-relative overflow-hidden py-5" id="about-sec">
         <div className="container shape-mockup-wrap">
            <div className="row align-items-center g-5">
               {/* LEFT: Content */}
               <div className="col-xl-6 col-lg-6">
                  <div className="title-area mb-20">
                     <span style={{ color: '#e8151b', fontWeight: 700, fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '8px', fontFamily: "'Inter', sans-serif" }}>About Jiyo Life Travels</span>
                     <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 700, color: '#0d1b2a', marginBottom: '15px', lineHeight: 1.2 }}>
                        Creating Memorable Travel Experiences for Over 15 Years
                     </h2>
                  </div>
                  <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px', fontFamily: "'Inter', sans-serif" }}>
                     Jiyo Life Travels Private Limited is a trusted travel company based in New Delhi, dedicated to creating unforgettable travel experiences across India and around the world. With over 15 years of expertise in the tourism and hospitality industry, we have helped thousands of travelers explore their dream destinations with confidence and ease.                  </p>
                  <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.6, marginBottom: '35px', fontFamily: "'Inter', sans-serif" }}>
                     Our experienced team specializes in designing personalized travel solutions that cater to families, couples, groups, corporate travelers, and adventure enthusiasts. From flight bookings and hotel reservations to complete holiday packages, we ensure a seamless and hassle-free travel experience from start to finish.                  </p>

               </div>

               {/* RIGHT: Single Image */}
               <div className="col-xl-6 col-lg-6">
                  <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
                     <img
                        src="/assets/img/normal/about_3_3.png"
                        alt="About Jiyo Life Travels"
                        style={{ width: '100%', height: '480px', objectFit: 'cover', display: 'block' }}
                     />
                     {/* Red accent badge */}
                     <div style={{
                        position: 'absolute', bottom: '28px', left: '28px',
                        background: 'linear-gradient(135deg, #e8192c, #ff4d5e)',
                        borderRadius: '14px', padding: '16px 24px',
                        color: '#fff', boxShadow: '0 8px 24px rgba(232,25,44,0.4)',
                     }}>
                        <div style={{ fontSize: '28px', fontWeight: '800', lineHeight: 1 }}>15+</div>
                        <div style={{ fontSize: '13px', fontWeight: '500', opacity: 0.9, marginTop: '4px' }}>Years of Experience</div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Mission & Vision Section */}
            <style>{`
               @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
               @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap');

               /* User requested resets */
               .about-area {
                  font-family: 'Inter', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
                  color: #111;
               }
               .about-area * {
                  box-sizing: border-box;
               }

               .mv-card {
                  background: #fff;
                  border-radius: 18px;
                  padding: 40px;
                  display: flex;
                  align-items: flex-start;
                  gap: 24px;
                  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
                  border: 1px solid #f0f0f0;
                  height: 100%;
                  transition: all 0.3s ease;
               }
               .mv-card:hover {
                  box-shadow: 0 12px 40px rgba(232,25,44,0.1);
                  transform: translateY(-5px);
                  border-color: #e8192c33;
               }
               .mv-icon {
                  width: 70px; height: 70px; min-width: 70px;
                  background: #fff5f5; /* Light red */
                  border-radius: 16px;
                  display: flex; align-items: center; justify-content: center;
                  font-size: 32px; color: #e8151b; /* Red */
                  transition: all 0.3s ease;
               }
               .mv-card:hover .mv-icon {
                  background: #e8151b; /* Red */
                  color: #fff;
                  box-shadow: 0 10px 20px rgba(232, 21, 27, 0.2);
                  transform: scale(1.05);
               }
               .mv-content h3 {
                  font-size: 22px;
                  font-weight: 700;
                  color: #111;
                  font-family: 'Inter', sans-serif;
               }
               .mv-content p {
                  color: #666;
                  line-height: 1.6;
                  font-size: 14px;
                  font-family: 'Inter', sans-serif;
               }
               @media (max-width: 576px) {
                  .mv-card { flex-direction: column; text-align: center; align-items: center; padding: 30px 20px; }
               }
            `}</style>
            <div className="row g-4 mt-2">
               {/* Mission */}
               <div className="col-lg-6">
                  <div className="mv-card">
                     <div className="mv-icon"><i className="fa-solid fa-rocket" /></div>
                     <div className="mv-content">
                        <h3 className="mb-2">Our Mission</h3>
                        <p className="mb-0">Our mission is to make travel simple, affordable, and memorable by providing exceptional service, carefully curated itineraries, and reliable support throughout every journey.</p>
                     </div>
                  </div>
               </div>

               {/* Vision */}
               <div className="col-lg-6">
                  <div className="mv-card">
                     <div className="mv-icon"><i className="fa-solid fa-eye" /></div>
                     <div className="mv-content">
                        <h3 className="mb-2">Our Vision</h3>
                        <p className="mb-0">Our vision is to be the most trusted and innovative travel partner globally, inspiring people to explore the world with passion while promoting sustainable and culturally enriching tourism.</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Strategic Service Verticals - Premium Red Theme */}
            <div style={{ marginTop: '80px', paddingTop: '0px' }}>
               <style>{`
                  .sv-card-wrapper {
                     position: relative;
                     height: 100%;
                     padding-bottom: 18px;
                  }
                  .sv-card {
                     background: #fff;
                     border-radius: 16px;
                     text-align: center;
                     box-shadow: 0 10px 30px rgba(0,0,0,0.06);
                     position: relative;
                     overflow: hidden;
                     height: 360px;
                     display: flex;
                     flex-direction: column;
                     transition: transform 0.4s ease, box-shadow 0.4s ease;
                  }
                  .sv-card:hover {
                     transform: translateY(-5px);
                     box-shadow: 0 15px 40px rgba(232,21,27,0.1);
                  }
                  .sv-card::before {
                     content: '';
                     position: absolute;
                     inset: 0;
                     z-index: 1;
                     background: linear-gradient(to bottom, #ffffff 0%, #ffffff 55%, rgba(255,255,255,0.5) 65%, rgba(255,255,255,0) 85%);
                     pointer-events: none;
                  }
                  .sv-card-bg {
                     position: absolute;
                     bottom: 0; left: 0; right: 0;
                     height: 45%; 
                     background-size: cover; 
                     background-position: center;
                     z-index: 0;
                     transition: transform 0.5s ease;
                     transform-origin: center;
                  }
                  .sv-card:hover .sv-card-bg {
                     transform: scale(1.05);
                  }
                  .sv-card-content {
                     position: relative;
                     z-index: 2;
                     padding: 30px 20px 0;
                     flex: 1;
                     display: flex;
                     flex-direction: column;
                     align-items: center;
                  }
                  .sv-icon-wrap {
                     width: 60px; height: 60px;
                     margin: 0 auto 12px;
                     border-radius: 50%;
                     border: 1px dashed rgba(232, 21, 27, 0.4);
                     display: flex; align-items: center; justify-content: center;
                     color: #e8151b;
                     font-size: 24px;
                     transition: all 0.3s ease;
                     box-shadow: 0 0 0 4px rgba(232, 21, 27, 0.03);
                  }
                  .sv-card:hover .sv-icon-wrap {
                     border-color: #e8151b;
                     box-shadow: 0 0 0 4px rgba(232, 21, 27, 0.08);
                  }
                  .sv-card h4 {
                     font-size: 16px;
                     font-weight: 700;
                     color: #111;
                     margin-bottom: 10px;
                     font-family: 'Inter', sans-serif;
                     line-height: 1.4;
                     padding: 0 10px;
                  }
                  .sv-separator {
                     width: 25px;
                     height: 2px;
                     background: #e8151b;
                     margin: 0 auto 10px;
                  }
                  .sv-card p {
                     font-size: 12.5px;
                     color: #777;
                     line-height: 1.6;
                     margin: 0;
                     font-family: 'Inter', sans-serif;
                     font-weight: 500;
                     padding: 0 15px;
                  }
                  .sv-card-badge {
                     position: absolute;
                     bottom: 0;
                     left: 50%;
                     transform: translateX(-50%);
                     width: 36px; height: 36px;
                     background: #e8151b;
                     border-radius: 50%;
                     color: #fff;
                     display: flex; align-items: center; justify-content: center;
                     font-size: 14px;
                     z-index: 3;
                     transition: transform 0.3s ease;
                     box-shadow: 0 4px 10px rgba(232,21,27,0.3);
                  }
                  .sv-card-wrapper:hover .sv-card-badge {
                     transform: translateX(-50%) translateY(-4px) scale(1.1);
                  }
               `}</style>

               <div className="title-area mb-50 text-center" style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
                     <div style={{ width: '30px', height: '1.5px', background: '#e8151b' }}></div>
                     <span style={{ color: '#e8151b', fontWeight: 700, fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif" }}>Why Choose Us</span>
                     <Plane size={16} color="#e8151b" style={{ transform: 'rotate(45deg)' }} />
                  </div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.2rem, 4vw, 42px)', fontWeight: 800, color: '#0d1b2a', marginBottom: '16px', lineHeight: 1.2 }}>
                     What Makes Us The Best Travel Agency
                  </h2>
               </div>

               <div className="row g-4">

                  {/* Card 1 */}
                  <div className="col-lg-4 col-md-6">
                     <div className="sv-card-wrapper">
                        <div className="sv-card">
                           <div className="sv-card-bg" style={{ backgroundImage: 'url(/assets/img/about_gallery/about-gallery.png)' }}></div>
                           <div className="sv-card-content">
                              <div className="sv-icon-wrap"><i className="fa-solid fa-map-location-dot" /></div>
                              <h4>Personalized Travel Planning</h4>
                              <div className="sv-separator"></div>
                              <p>We craft custom itineraries that match your unique preferences, budget, and travel style perfectly.</p>
                           </div>
                        </div>
                        <div className="sv-card-badge"><i className="fa-solid fa-heart" /></div>
                     </div>
                  </div>

                  {/* Card 2 */}
                  <div className="col-lg-4 col-md-6">
                     <div className="sv-card-wrapper">
                        <div className="sv-card">
                           <div className="sv-card-bg" style={{ backgroundImage: 'url(/assets/img/about_gallery/about-gallery-2.png)' }}></div>
                           <div className="sv-card-content">
                              <div className="sv-icon-wrap"><i className="fa-solid fa-plane" style={{ transform: 'rotate(-45deg)' }} /></div>
                              <h4>Domestic & International<br />Tour Packages</h4>
                              <div className="sv-separator"></div>
                              <p>Explore a wide variety of beautifully designed packages for breathtaking destinations across India and the globe.</p>
                           </div>
                        </div>
                        <div className="sv-card-badge"><i className="fa-solid fa-globe" /></div>
                     </div>
                  </div>

                  {/* Card 3 */}
                  <div className="col-lg-4 col-md-6">
                     <div className="sv-card-wrapper">
                        <div className="sv-card">
                           <div className="sv-card-bg" style={{ backgroundImage: 'url(/assets/img/about_gallery/about-gallery-3.png)' }}></div>
                           <div className="sv-card-content">
                              <div className="sv-icon-wrap"><i className="fa-solid fa-tags" /></div>
                              <h4>Competitive Pricing<br />& Best Value</h4>
                              <div className="sv-separator"></div>
                              <p>Enjoy premium services, luxury stays, and memorable activities at the most reasonable and transparent prices.</p>
                           </div>
                        </div>
                        <div className="sv-card-badge"><i className="fa-solid fa-tag" /></div>
                     </div>
                  </div>

                  {/* Card 4 */}
                  <div className="col-lg-4 col-md-6">
                     <div className="sv-card-wrapper">
                        <div className="sv-card">
                           <div className="sv-card-bg" style={{ backgroundImage: 'url(/assets/img/about_gallery/about-gallery-4.png)' }}></div>
                           <div className="sv-card-content">
                              <div className="sv-icon-wrap"><i className="fa-solid fa-headset" /></div>
                              <h4>24/7 Customer Support</h4>
                              <div className="sv-separator"></div>
                              <p>Our dedicated support team is always available around the clock to assist you before, during, and after your trip.</p>
                           </div>
                        </div>
                        <div className="sv-card-badge"><span style={{fontWeight: 800, fontSize: '10px', letterSpacing: '0.5px'}}>24/7</span></div>
                     </div>
                  </div>

                  {/* Card 5 */}
                  <div className="col-lg-4 col-md-6">
                     <div className="sv-card-wrapper">
                        <div className="sv-card">
                           <div className="sv-card-bg" style={{ backgroundImage: 'url(/assets/img/about_gallery/about-gallery-5.png)' }}></div>
                           <div className="sv-card-content">
                              <div className="sv-icon-wrap"><i className="fa-solid fa-building" /></div>
                              <h4>Trusted Network of Hotels<br />and Travel Partners</h4>
                              <div className="sv-separator"></div>
                              <p>We collaborate only with highly vetted, top-tier hotels and transport providers to ensure your comfort and safety.</p>
                           </div>
                        </div>
                        <div className="sv-card-badge"><i className="fa-solid fa-shield" /></div>
                     </div>
                  </div>

                  {/* Card 6 */}
                  <div className="col-lg-4 col-md-6">
                     <div className="sv-card-wrapper">
                        <div className="sv-card">
                           <div className="sv-card-bg" style={{ backgroundImage: 'url(/assets/img/about_gallery/about-gallery-6.png)' }}></div>
                           <div className="sv-card-content">
                              <div className="sv-icon-wrap"><i className="fa-solid fa-users" /></div>
                              <h4>Experienced<br />Travel Consultants</h4>
                              <div className="sv-separator"></div>
                              <p>Our team of seasoned travel experts brings years of field knowledge to guide you to the best experiences possible.</p>
                           </div>
                        </div>
                        <div className="sv-card-badge"><i className="fa-solid fa-user" /></div>
                     </div>
                  </div>

               </div>

            </div>
            <div
               className="shape-mockup movingX d-none d-xxl-block"
               style={{ top: '0%', left: '-18%' }}
            >
               <img src="/assets/img/shape/shape_2_1.png" alt="shape" />
            </div>
            <div
               className="shape-mockup jump d-none d-xxl-block"
               style={{ top: '28%', right: '-15%' }}
            >
               <img src="/assets/img/shape/shape_2_2.png" alt="shape" />
            </div>
            <div
               className="shape-mockup spin d-none d-xxl-block"
               style={{ top: '18%', left: '-112%' }}
            >
               <img src="/assets/img/shape/shape_2_3.png" alt="shape" />
            </div>
            <div
               className="shape-mockup movixgX d-none d-xxl-block"
               style={{ bottom: '18%', right: '-12%' }}
            >
               <img src="/assets/img/shape/shape_2_4.png" alt="shape" />
            </div>
         </div>
      </div>
   )
}

export default AboutFour
