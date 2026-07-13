import React, { useState } from 'react';
import Modal from './Modal';
import { Link } from 'react-router-dom'

function GalleryInner() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState('');

    // Function to open the modal with the selected image
    const openModal = (imageSrc, event) => {
        event.preventDefault(); // Prevent default link behavior
        setModalImage(imageSrc);
        setIsModalOpen(true);
    };

    // Function to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
    };
    return (
        <div className="overflow-hidden space" id="gallery-sec">
            <div className="container-fuild">
                <div className="title-area mb-30 text-center">
                    <span className="sub-title">Explore Us</span>
                    <h2 className="sec-title">A truly exceptional experience</h2>
                </div>
                <div className="row gy-4 gallery-row4">
                    <div className="col-auto">
                        <div className="gallery-box style5">
                            <div className="gallery-img global-img">
                                <img src="/assets/img/gallery/gallery_8_1.jpg" alt="gallery" />
                                <Link
                                    to="assets/img/gallery/gallery_8_1.jpg"
                                    className="icon-btn popup-image"
                                    onClick={(e) => openModal('/assets/img/gallery/gallery_8_1.jpg', e)}
                                >
                                    <i className="fal fa-magnifying-glass-plus" />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-auto">
                        <div className="gallery-box style5">
                            <div className="gallery-img global-img">
                                <img src="/assets/img/gallery/gallery_8_2.jpg" alt="gallery" />
                                <Link
                                    to="assets/img/gallery/gallery_8_2.jpg"
                                    className="icon-btn popup-image"
                                    onClick={(e) => openModal('/assets/img/gallery/gallery_8_2.jpg', e)}
                                >
                                    <i className="fal fa-magnifying-glass-plus" />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-auto">
                        <div className="gallery-box style5">
                            <div className="gallery-img global-img">
                                <img src="/assets/img/gallery/gallery_8_3.jpg" alt="gallery" />
                                <Link
                                    to="assets/img/gallery/gallery_8_3.jpg"
                                    className="icon-btn popup-image"
                                    onClick={(e) => openModal('/assets/img/gallery/gallery_8_3.jpg', e)}
                                >
                                    <i className="fal fa-magnifying-glass-plus" />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-auto">
                        <div className="gallery-box style5">
                            <div className="gallery-img global-img">
                                <img src="/assets/img/gallery/gallery_8_4.jpg" alt="gallery" />
                                <Link
                                    to="assets/img/gallery/gallery_8_4.jpg"
                                    className="icon-btn popup-image"
                                    onClick={(e) => openModal('/assets/img/gallery/gallery_8_4.jpg', e)}
                                >
                                    <i className="fal fa-magnifying-glass-plus" />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-auto">
                        <div className="gallery-box style5">
                            <div className="gallery-img global-img">
                                <img src="/assets/img/gallery/gallery_8_5.jpg" alt="gallery" />
                                <Link
                                    to="assets/img/gallery/gallery_8_5.jpg"
                                    className="icon-btn popup-image"
                                    onClick={(e) => openModal('/assets/img/gallery/gallery_8_5.jpg', e)}
                                >
                                    <i className="fal fa-magnifying-glass-plus" />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-auto">
                        <div className="gallery-box style5">
                            <div className="gallery-img global-img">
                                <img src="/assets/img/gallery/gallery_8_6.jpg" alt="gallery" />
                                <Link
                                    to="assets/img/gallery/gallery_8_6.jpg"
                                    className="icon-btn popup-image"
                                    onClick={(e) => openModal('/assets/img/gallery/gallery_8_6.jpg', e)}
                                >
                                    <i className="fal fa-magnifying-glass-plus" />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-auto">
                        <div className="gallery-box style5">
                            <div className="gallery-img global-img">
                                <img src="/assets/img/gallery/gallery_8_7.jpg" alt="gallery" />
                                <Link
                                    to="assets/img/gallery/gallery_8_7.jpg"
                                    className="icon-btn popup-image"
                                    onClick={(e) => openModal('/assets/img/gallery/gallery_8_7.jpg', e)}
                                >
                                    <i className="fal fa-magnifying-glass-plus" />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-auto">
                        <div className="gallery-box style5">
                            <div className="gallery-img global-img">
                                <img src="/assets/img/gallery/gallery_8_8.jpg" alt="gallery" />
                                <Link
                                    to="assets/img/gallery/gallery_8_8.jpg"
                                    className="icon-btn popup-image"
                                    onClick={(e) => openModal('/assets/img/gallery/gallery_8_8.jpg', e)}
                                >
                                    <i className="fal fa-magnifying-glass-plus" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal isOpen={isModalOpen} closeModal={closeModal} imageSrc={modalImage} />
        </div>

    )
}

export default GalleryInner
