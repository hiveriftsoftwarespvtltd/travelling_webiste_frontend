import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Link } from 'react-router-dom';

function GalleryOne() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState('');
    const [modalCaption, setModalCaption] = useState('');
    const [gallery, setGallery] = useState([]);

    useEffect(() => {
        // Fetch gallery from NestJS API
        fetch(`${process.env.REACT_APP_API_BASE_URL}/gallery`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setGallery(data);
                }
            })
            .catch(err => console.log('Gallery API fallback triggered:', err));
    }, []);

    // Function to open the modal with the selected image
    const openModal = (imageSrc, caption, event) => {
        event.preventDefault(); // Prevent default link behavior
        setModalImage(imageSrc);
        setModalCaption(caption);
        setIsModalOpen(true);
    };

    // Function to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Keep dynamic layout consistent with original template: 5 columns
    // Col 1: img 0
    // Col 2: img 1, img 2
    // Col 3: img 3
    // Col 4: img 4, img 5
    // Col 5: img 6
    const renderColumns = () => {
        const columns = [];
        
        // Col 1 (Single)
        if (gallery[0]) {
            columns.push(
                <div key="col1" className="col-md-6 col-lg-2">
                    <div className="gallery-card">
                        <div className="box-img global-img">
                            <Link
                                to={gallery[0].imageUrl}
                                className="popup-image"
                                onClick={(e) => openModal(gallery[0].imageUrl, gallery[0].caption, e)}
                            >
                                <div className="icon-btn">
                                    <i className="fal fa-magnifying-glass-plus" />
                                </div>
                            </Link>
                            <img
                                src={gallery[0].imageUrl || "/assets/img/normal/about_3_1.jpg"}
                                alt="gallery"
                                onClick={(e) => openModal(gallery[0].imageUrl, gallery[0].caption, e)}
                                style={{ width: '100%', height: '520px', objectFit: 'cover' }}
                            />
                        </div>
                    </div>
                </div>
            );
        }

        // Col 2 (Double)
        if (gallery[1] || gallery[2]) {
            columns.push(
                <div key="col2" className="col-md-6 col-lg-2">
                    {gallery[1] && (
                        <div className="gallery-card">
                            <div className="box-img global-img">
                                <Link
                                    to={gallery[1].imageUrl}
                                    className="popup-image"
                                    onClick={(e) => openModal(gallery[1].imageUrl, gallery[1].caption, e)}
                                >
                                    <div className="icon-btn">
                                        <i className="fal fa-magnifying-glass-plus" />
                                    </div>
                                </Link>
                                <img
                                    src={gallery[1].imageUrl || "/assets/img/normal/about_3_1.jpg"}
                                    alt="gallery"
                                    onClick={(e) => openModal(gallery[1].imageUrl, gallery[1].caption, e)}
                                    style={{ width: '100%', height: '248px', objectFit: 'cover' }}
                                />
                            </div>
                        </div>
                    )}
                    {gallery[2] && (
                        <div className="gallery-card">
                            <div className="box-img global-img">
                                <Link
                                    to={gallery[2].imageUrl}
                                    className="popup-image"
                                    onClick={(e) => openModal(gallery[2].imageUrl, gallery[2].caption, e)}
                                >
                                    <div className="icon-btn">
                                        <i className="fal fa-magnifying-glass-plus" />
                                    </div>
                                </Link>
                                <img
                                    src={gallery[2].imageUrl || "/assets/img/normal/about_3_1.jpg"}
                                    alt="gallery"
                                    onClick={(e) => openModal(gallery[2].imageUrl, gallery[2].caption, e)}
                                    style={{ width: '100%', height: '248px', objectFit: 'cover' }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        // Col 3 (Single)
        if (gallery[3]) {
            columns.push(
                <div key="col3" className="col-md-6 col-lg-2">
                    <div className="gallery-card">
                        <div className="box-img global-img">
                            <Link
                                to={gallery[3].imageUrl}
                                className="popup-image"
                                onClick={(e) => openModal(gallery[3].imageUrl, gallery[3].caption, e)}
                            >
                                <div className="icon-btn">
                                    <i className="fal fa-magnifying-glass-plus" />
                                </div>
                            </Link>
                            <img
                                src={gallery[3].imageUrl || "/assets/img/normal/about_3_1.jpg"}
                                alt="gallery"
                                onClick={(e) => openModal(gallery[3].imageUrl, gallery[3].caption, e)}
                                style={{ width: '100%', height: '520px', objectFit: 'cover' }}
                            />
                        </div>
                    </div>
                </div>
            );
        }

        // Col 4 (Double)
        if (gallery[4] || gallery[5]) {
            columns.push(
                <div key="col4" className="col-md-6 col-lg-2">
                    {gallery[4] && (
                        <div className="gallery-card">
                            <div className="box-img global-img">
                                <Link
                                    to={gallery[4].imageUrl}
                                    className="popup-image"
                                    onClick={(e) => openModal(gallery[4].imageUrl, gallery[4].caption, e)}
                                >
                                    <div className="icon-btn">
                                        <i className="fal fa-magnifying-glass-plus" />
                                    </div>
                                </Link>
                                <img
                                    src={gallery[4].imageUrl || "/assets/img/normal/about_3_1.jpg"}
                                    alt="gallery"
                                    onClick={(e) => openModal(gallery[4].imageUrl, gallery[4].caption, e)}
                                    style={{ width: '100%', height: '248px', objectFit: 'cover' }}
                                />
                            </div>
                        </div>
                    )}
                    {gallery[5] && (
                        <div className="gallery-card">
                            <div className="box-img global-img">
                                <Link
                                    to={gallery[5].imageUrl}
                                    className="popup-image"
                                    onClick={(e) => openModal(gallery[5].imageUrl, gallery[5].caption, e)}
                                >
                                    <div className="icon-btn">
                                        <i className="fal fa-magnifying-glass-plus" />
                                    </div>
                                </Link>
                                <img
                                    src={gallery[5].imageUrl || "/assets/img/normal/about_3_1.jpg"}
                                    alt="gallery"
                                    onClick={(e) => openModal(gallery[5].imageUrl, gallery[5].caption, e)}
                                    style={{ width: '100%', height: '248px', objectFit: 'cover' }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        // Col 5 (Single)
        if (gallery[6]) {
            columns.push(
                <div key="col5" className="col-md-6 col-lg-2">
                    <div className="gallery-card">
                        <div className="box-img global-img">
                            <Link
                                to={gallery[6].imageUrl}
                                className="popup-image"
                                onClick={(e) => openModal(gallery[6].imageUrl, gallery[6].caption, e)}
                            >
                                <div className="icon-btn">
                                    <i className="fal fa-magnifying-glass-plus" />
                                </div>
                            </Link>
                            <img
                                src={gallery[6].imageUrl || "/assets/img/normal/about_3_1.jpg"}
                                alt="gallery"
                                onClick={(e) => openModal(gallery[6].imageUrl, gallery[6].caption, e)}
                                style={{ width: '100%', height: '520px', objectFit: 'cover' }}
                            />
                        </div>
                    </div>
                </div>
            );
        }

        return columns;
    };

    return (
        <div className="gallery-area pb-5 pt-0">
            <div className="container th-container shape-mockup-wrap">
                <div className="title-area text-center mb-3">
                    <h2 className="sec-title css-ur045q">Recent Gallery</h2>
                </div>
                <div className="row gy-10 gx-10 justify-content-center align-items-center">
                    {renderColumns()}
                </div>
                <div className="shape-mockup d-none d-xl-block"
                    style={{
                        top: "-25%",
                        left: "0%",
                    }}
                >
                    <img src="/assets/img/shape/line.png" alt="shape" />
                </div>
                <div className="shape-mockup movingX d-none d-xl-block"
                    style={{
                        top: "30%",
                        left: "-3%",
                    }}
                >
                    <img className="gmovingX" src="/assets/img/shape/shape_4.png" alt="shape" />
                </div>
            </div>
            <Modal isOpen={isModalOpen} closeModal={closeModal} imageSrc={modalImage} caption={modalCaption} />
        </div>
    );
}

export default GalleryOne;
