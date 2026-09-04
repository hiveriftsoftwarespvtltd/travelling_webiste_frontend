import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import Modal from "./Modal";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function GalleryFive() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState("");

    const openModal = (imageSrc, event) => {
        event.preventDefault();
        setModalImage(imageSrc);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="sidebar-gallery-area space">
            <div className="container-fluid">
                <div className="slider-area">
                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={20}
                        centeredSlides={true}
                        loop={true}
                        breakpoints={{
                            0: { slidesPerView: 1 },
                            576: { slidesPerView: 2 },
                            768: { slidesPerView: 2 },
                            992: { slidesPerView: 3 },
                            1200: { slidesPerView: 3 },
                            1300: { slidesPerView: 4 },
                        }}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        className="th-slider has-shadow"
                    >
                        <SwiperSlide>
                            <div className="gallery-thumb style2 global-img">
                                <img
                                    src="/assets/img/gallery/gallery_4_1.jpg"
                                    alt="Gallery"
                                    onClick={(e) => openModal('/assets/img/gallery/gallery_4_1.jpg', e)}
                                />
                                <Link to="/assets/img/gallery/gallery_4_1.jpg"
                                    className="gallery-btn popup-image"
                                    onClick={(e) => openModal('/assets/img/gallery/gallery_4_1.jpg', e)}
                                >
                                    <i className="fab fa-instagram" />
                                </Link>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="gallery-thumb style2 global-img">
                                <img
                                    src="/assets/img/gallery/gallery_4_2.jpg"
                                    alt="Gallery"
                                    onClick={(e) => openModal('/assets/img/gallery/gallery_4_2.jpg', e)}
                                />
                                <Link to="/assets/img/gallery/gallery_4_2.jpg"
                                    className="gallery-btn popup-image"
                                    onClick={(e) => openModal('/assets/img/gallery/gallery_4_2.jpg', e)}
                                >
                                    <i className="fab fa-instagram" />
                                </Link>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="gallery-thumb style2 global-img">
                                <img
                                    src="/assets/img/gallery/gallery_4_3.jpg"
                                    alt="Gallery"
                                    onClick={(e) => openModal('/assets/img/gallery/gallery_4_3.jpg', e)}
                                />
                                <Link to="/assets/img/gallery/gallery_4_3.jpg"
                                    className="gallery-btn popup-image"
                                    onClick={(e) => openModal('/assets/img/gallery/gallery_4_3.jpg', e)}
                                >
                                    <i className="fab fa-instagram" />
                                </Link>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="gallery-thumb style2 global-img">
                                <img
                                    src="/assets/img/gallery/gallery_4_4.jpg"
                                    alt="Gallery"
                                    onClick={(e) => openModal('/assets/img/gallery/gallery_4_4.jpg', e)}
                                />
                                <Link to="/assets/img/gallery/gallery_4_4.jpg"
                                    className="gallery-btn popup-image"
                                    onClick={(e) => openModal('/assets/img/gallery/gallery_4_4.jpg', e)}
                                >
                                    <i className="fab fa-instagram" />
                                </Link>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="gallery-thumb style2 global-img">
                                <img
                                    src="/assets/img/gallery/gallery_4_5.jpg"
                                    alt="Gallery"
                                    onClick={(e) => openModal('/assets/img/gallery/gallery_4_5.jpg', e)}
                                />
                                <Link to="/assets/img/gallery/gallery_4_5.jpg"
                                    className="gallery-btn popup-image"
                                    onClick={(e) => openModal('/assets/img/gallery/gallery_4_5.jpg', e)}
                                >
                                    <i className="fab fa-instagram" />
                                </Link>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="gallery-thumb style2 global-img">
                                <img
                                    src="/assets/img/gallery/gallery_4_1.jpg"
                                    alt="Gallery"
                                    onClick={(e) => openModal('/assets/img/gallery/gallery_4_1.jpg', e)}
                                />
                                <Link to="/assets/img/gallery/gallery_4_1.jpg"
                                    className="gallery-btn popup-image"
                                    onClick={(e) => openModal('/assets/img/gallery/gallery_4_1.jpg', e)}
                                >
                                    <i className="fab fa-instagram" />
                                </Link>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="gallery-thumb style2 global-img">
                                <img
                                    src="/assets/img/gallery/gallery_4_2.jpg"
                                    alt="Gallery"
                                    onClick={(e) => openModal('/assets/img/gallery/gallery_4_2.jpg', e)}
                                />
                                <Link to="/assets/img/gallery/gallery_4_2.jpg"
                                    className="gallery-btn popup-image"
                                    onClick={(e) => openModal('/assets/img/gallery/gallery_4_2.jpg', e)}
                                >
                                    <i className="fab fa-instagram" />
                                </Link>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="gallery-thumb style2 global-img">
                                <img
                                    src="/assets/img/gallery/gallery_4_3.jpg"
                                    alt="Gallery"
                                    onClick={(e) => openModal('/assets/img/gallery/gallery_4_3.jpg', e)}
                                />
                                <Link to="/assets/img/gallery/gallery_4_3.jpg"
                                    className="gallery-btn popup-image"
                                    onClick={(e) => openModal('/assets/img/gallery/gallery_4_3.jpg', e)}
                                >
                                    <i className="fab fa-instagram" />
                                </Link>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="gallery-thumb style2 global-img">
                                <img
                                    src="/assets/img/gallery/gallery_4_4.jpg"
                                    alt="Gallery"
                                    onClick={(e) => openModal('/assets/img/gallery/gallery_4_4.jpg', e)}
                                />
                                <Link to="/assets/img/gallery/gallery_4_4.jpg"
                                    className="gallery-btn popup-image"
                                    onClick={(e) => openModal('/assets/img/gallery/gallery_4_4.jpg', e)}
                                >
                                    <i className="fab fa-instagram" />
                                </Link>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="gallery-thumb style2 global-img">
                                <img
                                    src="/assets/img/gallery/gallery_4_5.jpg"
                                    alt="Gallery"
                                    onClick={(e) => openModal('/assets/img/gallery/gallery_4_5.jpg', e)}
                                />
                                <Link to="/assets/img/gallery/gallery_4_5.jpg"
                                    className="gallery-btn popup-image"
                                    onClick={(e) => openModal('/assets/img/gallery/gallery_4_5.jpg', e)}
                                >
                                    <i className="fab fa-instagram" />
                                </Link>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="gallery-thumb style2 global-img">
                                <img
                                    src="/assets/img/gallery/gallery_4_2.jpg"
                                    alt="Gallery"
                                    onClick={(e) => openModal('/assets/img/gallery/gallery_4_2.jpg', e)}
                                />
                                <Link to="/assets/img/gallery/gallery_4_2.jpg"
                                    className="gallery-btn popup-image"
                                    onClick={(e) => openModal('/assets/img/gallery/gallery_4_2.jpg', e)}
                                >
                                    <i className="fab fa-instagram" />
                                </Link>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>
            <Modal isOpen={isModalOpen} closeModal={closeModal} imageSrc={modalImage} />
        </div>
    );
}

export default GalleryFive;
