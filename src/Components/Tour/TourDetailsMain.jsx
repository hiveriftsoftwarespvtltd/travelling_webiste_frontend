import { ArrowRight } from 'lucide-react';
﻿import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Thumbs, EffectFade } from "swiper/modules";
import NeedHelpWidget from '../Widgets/NeedHelpWidget';

function TourDetailsMain() {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [activeTab, setActiveTab] = useState("day-tab1");

    const days = [
        { id: "day-tab1", label: "Day 01" },
        { id: "day-tab2", label: "Day 02" },
        { id: "day-tab3", label: "Day 03" },
        { id: "day-tab4", label: "Day 04" },
        { id: "day-tab5", label: "Day 05" },
        { id: "day-tab6", label: "Day 06" },
        { id: "day-tab7", label: "Day 07" },
    ];

    const images = [
        "/assets/img/tour/tour_inner_1.jpg",
        "/assets/img/tour/tour_inner_2.jpg",
        "/assets/img/tour/tour_inner_3.jpg",
        "/assets/img/tour/tour_inner_1.jpg",
        "/assets/img/tour/tour_inner_2.jpg",
        "/assets/img/tour/tour_inner_3.jpg",
    ];
    const tabContent = {
        "day-tab1": [
            "As the Eiffel Tower is to Paris, the silhouette of the",
            "Curabitur pellentesque nibh nibh, at maximus ante",
            "United commitment to our excellence patent protection.",
            "As the Eiffel Tower is to Paris, the silhouette of the",
            "Maecenas vitae mattis tellus. Nullam quis imperdiet",
        ],
        "day-tab2": [
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            "Pellentesque accumsan malesuada mi at vehicula.",
            "Suspendisse potenti. Praesent bibendum turpis ut justo.",
            "Vivamus scelerisque sem non nisi feugiat, ut efficitur dui.",
            "Sed at erat sagittis, bibendum turpis et, fermentum nisl.",
        ],
        "day-tab3": [
            "Fusce sed arcu nec arcu elementum consectetur.",
            "Nullam non libero ut lacus varius venenatis.",
            "Donec at sapien vitae lectus luctus tincidunt.",
            "Cras dapibus libero eget orci feugiat venenatis.",
            "Aliquam erat volutpat. Vivamus at lacus id est aliquet posuere.",
        ],
        "day-tab4": [
            "Duis et risus eget urna tincidunt fringilla.",
            "Integer ac ex a purus bibendum consequat.",
            "Vestibulum auctor orci at felis ultricies bibendum.",
            "Maecenas volutpat est nec nisi dignissim, non congue magna.",
            "Nunc vulputate nisi non sapien gravida, nec tempus justo cursus.",
        ],
        "day-tab5": [
            "Sed cursus turpis vel nulla egestas, id posuere urna hendrerit.",
            "Quisque laoreet tortor sed eros tincidunt tristique.",
            "Morbi vulputate mi nec neque posuere, a consectetur tortor.",
            "Curabitur eget libero nec ipsum sollicitudin scelerisque.",
            "Etiam laoreet orci sed lectus efficitur, ut posuere libero euismod.",
        ],
        "day-tab6": [
            "Vestibulum eget turpis sed orci bibendum sodales.",
            "Duis auctor eros sit amet turpis suscipit, nec dignissim turpis.",
            "Mauris non dolor sit amet lectus ultricies malesuada.",
            "Integer consectetur lorem ut sem malesuada aliquet.",
            "Sed elementum eros nec dolor vestibulum faucibus.",
        ],
        "day-tab7": [
            "Ut quis sapien nec felis consequat egestas.",
            "Morbi et magna a justo facilisis lacinia.",
            "Praesent aliquet metus ac nisi dapibus, vel scelerisque purus.",
            "Phasellus a turpis non sapien dapibus feugiat.",
            "Donec eu mi vel felis vehicula dapibus.",
        ],
    };
    return (
        <section className="space">
            <div className="container shape-mockup-wrap">
                <div className="row">
                    <div className="col-xxl-8 col-lg-7">
                        <div className="tour-page-single">
                            <div className="slider-area tour-slider1">
                                <Swiper
                                    modules={[Navigation, Thumbs, EffectFade]}
                                    effect="fade"
                                    loop={true}
                                    spaceBetween={10}
                                    navigation={{
                                        prevEl: ".slider-prev",
                                        nextEl: ".slider-next",
                                    }}
                                    thumbs={{ swiper: thumbsSwiper }}
                                    className="swiper th-slider mb-4"
                                    id="tourSlider4"
                                >
                                    {images.map((img, index) => (
                                        <SwiperSlide key={index}>
                                            <div className="tour-slider-img">
                                                <img src={img} alt={`Slide ${index + 1}`} />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                <Swiper
                                    modules={[Navigation, Thumbs]}
                                    loop={true}
                                    spaceBetween={25}
                                    slidesPerView={3}
                                    watchSlidesProgress
                                    onSwiper={setThumbsSwiper} // Connect thumbnails to main slider
                                    className="swiper th-slider tour-thumb-slider"
                                >
                                    {images.map((img, index) => (
                                        <SwiperSlide key={index}>
                                            <div className="tour-slider-img">
                                                <img src={img} alt={`Thumbnail ${index + 1}`} />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                <button
                                    data-slider-prev="#tourSlider4"
                                    className="slider-arrow style3 slider-prev"
                                >
                                    <img src="/assets/img/icon/hero-arrow-left.svg" alt="" />
                                </button>
                                <button
                                    data-slider-next="#tourSlider4"
                                    className="slider-arrow style3 slider-next"
                                >
                                    <img src="/assets/img/icon/hero-arrow-right.svg" alt="" />
                                </button>
                            </div>
                            <div className="page-content">
                                <div className="page-meta mb-45">
                                    <Link className="page-tag mr-5" to="/tour">
                                        Featured
                                    </Link>
                                    <span className="ratting">
                                        <i className="fa-sharp fa-solid fa-star" />
                                        <span>4.8</span>
                                    </span>
                                </div>
                                <h2 className="box-title">
                                    Explore the Beauty of Maldives and enjoy
                                </h2>
                                <h4 className="tour-price">
                                    <span className="currency">$189,25</span>/Person
                                </h4>
                                <p className="box-text mb-30">
                                    voluptatem accusantium doloremque laudantium, totam rem aperiam,
                                    eaque ipsa quae ab illo inventore veritatis et quasi architecto
                                    beatae vitae dicta sunt explicabo. Dolorem ipsum quia dolor sit
                                    amet, consectetur, adipisci velit, sed quia non numquam eius modi
                                    tempora incidunt ut labore et dolore magnam aliquam quaerat
                                    voluptatem. Quis autem vel eum iure reprehenderit qui in ea
                                    voluptate velit esse quam nihil molestiae consequatur, vel illum
                                    qui dolorem eum fugiat quo voluptas nulla pariatur
                                </p>
                                <p className="box-text mb-50">
                                    {" "}
                                    Ut enim ad minima veniam, quis nostrum exercitationem ullam
                                    corporis suscipit laboriosam, nisi ut aliquid ex ea commodi
                                    consequatur? Quis autem vel eum iure reprehenderit qui in ea
                                    voluptate velit esse quam nihil molestiae consequatur, vel illum
                                    qui dolorem eum fugiat quo voluptas nulla pariatur
                                </p>
                                <h2 className="box-title">Highlights</h2>
                                <p className="box-text mb-30">
                                    voluptatem accusantium doloremque laudantium, totam rem aperiam,
                                    eaque ipsa quae ab illo inventore veritatis et quasi architecto
                                    beatae vitae dicta sunt explicabo. Dolorem ipsum quia dolor sit
                                    amet, consectetur, adipisci.
                                </p>
                                <div className="checklist mb-50">
                                    <ul>
                                        <li>Visit most popular location of Maldives</li>
                                        <li>Buffet Breakfast for all traveler with good quality.</li>
                                        <li>Expert guide always guide you and give informations.</li>
                                        <li>Best Hotel for all also great food.</li>
                                        <li>Helping all traveler for Money Exchange.</li>
                                        <li>Buffet Breakfast for all traveler with good quality..</li>
                                        <li>Buffet Breakfast for all traveler with good quality.</li>
                                    </ul>
                                </div>
                                <h2 className="box-title">Basic Information</h2>
                                <p className="blog-text mb-35">
                                    voluptatem accusantium doloremque laudantium, totam rem aperiam,
                                    eaque ipsa quae ab illo inventore veritatis et quasi architecto
                                    beatae vitae dicta sunt explicabo. Dolorem ipsum quia dolor sit
                                    amet, consectetur, adipisci.
                                </p>
                                <div className="destination-checklist mb-50">
                                    <div className="checklist style2">
                                        <ul>
                                            <li>Destination</li>
                                            <li>Departure</li>
                                            <li>Language</li>
                                            <li>Reture Date</li>
                                            <li>Departure Date</li>
                                            <li>No. of Guide</li>
                                        </ul>
                                    </div>
                                    <div className="checklist style2">
                                        <ul>
                                            <li>Netherland</li>
                                            <li>Singapore Airport, Singapore</li>
                                            <li>English</li>
                                            <li>August 12, 2024</li>
                                            <li>Netherland</li>
                                            <li>25 Tour Places</li>
                                            <li>2 Person</li>
                                        </ul>
                                    </div>
                                </div>
                                <h2 className="box-title">Included and Excluded</h2>
                                <p className="blog-text mb-35">
                                    voluptatem accusantium doloremque laudantium, totam rem aperiam,
                                    eaque ipsa quae ab illo inventore veritatis et quasi architecto
                                    beatae vitae dicta sunt explicabo. Dolorem ipsum quia dolor sit
                                    amet, consectetur, adipisci.
                                </p>
                                <div className="destination-checklist">
                                    <div className="checklist style2 style4">
                                        <ul>
                                            <li>Hotel Fair</li>
                                            <li>Transportation</li>
                                            <li>Breakfast</li>
                                            <li>Sightseeing</li>
                                            <li>Travel Tax</li>
                                            <li>Seasonal Food</li>
                                        </ul>
                                    </div>
                                    <div className="checklist style5">
                                        <ul>
                                            <li>WIFI</li>
                                            <li>Swimming Pool</li>
                                            <li>GYM</li>
                                            <li>Travel Insurance</li>
                                            <li>Family Expenses</li>
                                            <li>Family Expenses</li>
                                        </ul>
                                    </div>
                                </div>
                                <h3 className="page-title mt-50 mb-0">Tour Plan</h3>
                                <div>
                                    {/* Tab Navigation */}
                                    <ul className="nav nav-tabs tour-tab mt-10" role="tablist">
                                        {days.map((day) => (
                                            <li className="nav-item" key={day.id} role="presentation">
                                                <button
                                                    className={`nav-link ${activeTab === day.id ? "active" : ""}`}
                                                    onClick={() => setActiveTab(day.id)}
                                                    type="button"
                                                    role="tab"
                                                    aria-controls={day.id + "-pane"}
                                                    aria-selected={activeTab === day.id}
                                                >
                                                    {day.label}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Tab Content */}
                                    <div className="tab-content">
                                        {days.map((day) => (
                                            <div
                                                key={day.id}
                                                className={`tab-pane fade ${activeTab === day.id ? "show active" : ""}`}
                                                id={day.id + "-pane"}
                                                role="tabpanel"
                                                aria-labelledby={day.id}
                                                tabIndex={0}
                                            >
                                                <div className="tour-grid-plan">
                                                    <div className="checklist">
                                                        <ul>
                                                            {tabContent[day.id].map((item, index) => (
                                                                <li key={index}>{item}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-4 col-lg-5">
                        <aside className="sidebar-area">
                            <div className="widget widget_search  ">
                                <form className="search-form">
                                    <input type="text" placeholder="Search" />
                                    <button type="submit">
                                        <i className="far fa-search" />
                                    </button>
                                </form>
                            </div>
                            <div className="widget widget_categories  ">
                                <h3 className="widget_title">Categories</h3>
                                <ul>
                                    <li>
                                        <Link to="/blog">
                                            <img src="/assets/img/theme-img/map.svg" alt="" />
                                            City Tour
                                        </Link>
                                        <span>(8)</span>
                                    </li>
                                    <li>
                                        <Link to="/blog">
                                            <img src="/assets/img/theme-img/map.svg" alt="" />
                                            Beach Tours
                                        </Link>
                                        <span>(6)</span>
                                    </li>
                                    <li>
                                        <Link to="/blog">
                                            <img src="/assets/img/theme-img/map.svg" alt="" />
                                            Wildlife Tours
                                        </Link>
                                        <span>(2)</span>
                                    </li>
                                    <li>
                                        <Link to="/blog">
                                            <img src="/assets/img/theme-img/map.svg" alt="" />
                                            News &amp; Tips
                                        </Link>
                                        <span>(7)</span>
                                    </li>
                                    <li>
                                        <Link to="/blog">
                                            <img src="/assets/img/theme-img/map.svg" alt="" />
                                            Adventure Tours
                                        </Link>
                                        <span>(9)</span>
                                    </li>
                                    <li>
                                        <Link to="/blog">
                                            <img src="/assets/img/theme-img/map.svg" alt="" />
                                            Mountain Tours
                                        </Link>
                                        <span>(10)</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="widget  ">
                                <h3 className="widget_title">Recent Posts</h3>
                                <div className="recent-post-wrap">
                                    <div className="recent-post">
                                        <div className="media-img">
                                            <Link to="/blog/1">
                                                <img
                                                    src="//assets/img/normal/about_3_1.jpg"
                                                    alt="Blog"
                                                />
                                            </Link>
                                        </div>
                                        <div className="media-body">
                                            <h4 className="post-title">
                                                <Link className="text-inherit" to="/blog/1">
                                                    Exploring The Green Spaces Of the island maldives
                                                </Link>
                                            </h4>
                                            <div className="recent-post-meta">
                                                <Link to="/blog">
                                                    <i className="fa-regular fa-calendar" />
                                                    22/6/ 2025
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="recent-post">
                                        <div className="media-img">
                                            <Link to="/blog/1">
                                                <img
                                                    src="//assets/img/normal/about_3_1.jpg"
                                                    alt="Blog"
                                                />
                                            </Link>
                                        </div>
                                        <div className="media-body">
                                            <h4 className="post-title">
                                                <Link className="text-inherit" to="/blog/1">
                                                    Harmony With Nature Of Belgium Tour and travle
                                                </Link>
                                            </h4>
                                            <div className="recent-post-meta">
                                                <Link to="/blog">
                                                    <i className="fa-regular fa-calendar" />
                                                    25/6/ 2025
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="recent-post">
                                        <div className="media-img">
                                            <Link to="/blog/1">
                                                <img
                                                    src="//assets/img/normal/about_3_1.jpg"
                                                    alt="Blog"
                                                />
                                            </Link>
                                        </div>
                                        <div className="media-body">
                                            <h4 className="post-title">
                                                <Link className="text-inherit" to="/blog/1">
                                                    Exploring The Green Spaces Of Realar Residence
                                                </Link>
                                            </h4>
                                            <div className="recent-post-meta">
                                                <Link to="/blog">
                                                    <i className="fa-regular fa-calendar" />
                                                    27/6/ 2025
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="widget widget_tag_cloud  ">
                                <h3 className="widget_title">Popular Tags</h3>
                                <div className="tagcloud">
                                    <Link to="/blog">Tour</Link>
                                    <Link to="/blog">Adventure</Link>
                                    <Link to="/blog">Rent</Link>
                                    <Link to="/blog">Innovate</Link>
                                    <Link to="/blog">Hotel</Link>
                                    <Link to="/blog">Modern</Link>
                                    <Link to="/blog">Luxury</Link>
                                    <Link to="/blog">Travel</Link>
                                </div>
                            </div>
                            <NeedHelpWidget />
                        </aside>
                    </div>
                </div>
                <div className="location-map">
                    <h3 className="page-title mt-45 mb-30">Location</h3>
                    <div className="contact-map style3">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3644.7310056272386!2d89.2286059153658!3d24.00527418490799!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fe9b97badc6151%3A0x30b048c9fb2129bc!2sAngfuztheme!5e0!3m2!1sen!2sbd!4v1651028958211!5m2!1sen!2sbd"
                            allowFullScreen=""
                            loading="lazy"
                        />
                        <div className="contact-icon">
                            <img src="/assets/img/icon/location-dot3.svg" alt="" />
                        </div>
                    </div>
                </div>
                <div
                    className="shape-mockup about-shape movingX d-none d-xxl-block"
                    style={{ bottom: "30.5%", right: "0%" }}
                >
                    <img src="/assets/img/normal/about-slide-img.png" alt="shape" />
                </div>
                <div
                    className="shape-mockup about-rating d-none d-xxl-block"
                    style={{ bottom: "40%", right: "-12%" }}
                >
                    <i className="fa-sharp fa-solid fa-star" />
                    <span>4.9k</span>
                </div>
                <div
                    className="shape-mockup about-emoji d-none d-xxl-block"
                    style={{ bottom: "36%", right: "20%" }}
                >
                    <img src="/assets/img/icon/emoji.png" alt="" />
                </div>
                <div
                    className="shape-mockup shape1 d-none d-xxl-block"
                    style={{ bottom: "49%", right: "-12%" }}
                >
                    <img src="/assets/img/shape/shape_1.png" alt="shape" />
                </div>
                <div
                    className="shape-mockup shape2 d-none d-xl-block"
                    style={{ bottom: "45%", right: "-8%" }}
                >
                    <img src="/assets/img/shape/shape_2.png" alt="shape" />
                </div>
                <div
                    className="shape-mockup shape3 d-none d-xxl-block"
                    style={{ bottom: "47%", right: "-5%" }}
                >
                    <img src="/assets/img/shape/shape_3.png" alt="shape" />
                </div>
            </div>
        </section>

    )
}

export default TourDetailsMain

