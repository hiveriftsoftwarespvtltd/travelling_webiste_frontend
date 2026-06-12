import { ArrowRight } from 'lucide-react';
﻿import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Posts from '../data/data-resort.json';
import Modal from '../Gallery/Modal';
import NeedHelpWidget from '../Widgets/NeedHelpWidget';

function ResortDetailsMain() {
    const { id } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState('');

    const resortPost = Posts.find(post => post.id === parseInt(id));

    if (!resortPost) {
        return <div>Post not found!</div>;
    }

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
        <section className="space">
            <div className="container shape-mockup-wrap">
                <div className="row">
                    <div className="col-xxl-8 col-lg-7">
                        <div className="page-single">
                            <div className="service-img global-img">
                                <img src={`/assets/img/normal/${resortPost.bannerImg}`} alt="" />
                            </div>
                            <div className="page-content d-block">
                                <h3 className="box-title mt-20">
                                    <Link to="#">{resortPost.title}</Link>
                                </h3>
                                <p className="blog-text mb-30">
                                    This luxury resort is set on a private island in the South
                                    Pacific. The overwater bungalows and beachfront villas offer
                                    stunning views of the turquoise lagoon and the surrounding
                                    mountains. Highlights: Snorkeling, spa treatments, and romantic
                                    dining experiences overlooking the ocean. This luxurious private
                                    island resort in Tetiaroa offers pristine beaches and a lagoon
                                    with incredible ocean views. Itâ€™s an eco-friendly resort focused
                                    on sustainability. Highlights: Snorkeling, kayaking, and luxurious
                                    spa treatments with an ocean backdrop.
                                </p>
                                <p className="blog-text mb-35">
                                    Ocean View Resort typically refers to a coastal resort that
                                    provides stunning views of the ocean from its accommodations and
                                    facilities. These resorts are often situated in prime locations
                                    along beaches, cliffs, or coastal areas, allowing guests to enjoy
                                    the natural beauty of the sea from their rooms, restaurants,
                                    pools, and other areas within the property.
                                </p>
                                <h4 className="">Children and extra beds.</h4>
                                <p className="blog-text mb-35">
                                    Children are welcome Kids stay free! Children stay free when using
                                    existing bedding; children may not be eligible for complimentary
                                    breakfast Rollaway/extra beds are available for $ 10 per day.
                                </p>
                                <h2 className="box-title">Highlights</h2>
                                <ul className="resort-grid-list">
                                    <li>
                                        <div className="resort-grid-list-icon">
                                            <img src="/assets/img/icon/resort-icon1-1.svg" alt="" />
                                        </div>
                                        <div className="resort-grid-list-details">
                                            <h4 className="resort-grid-list-title">TV</h4>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="resort-grid-list-icon">
                                            <img src="/assets/img/icon/resort-icon1-2.svg" alt="" />
                                        </div>
                                        <div className="resort-grid-list-details">
                                            <h4 className="resort-grid-list-title">Free Wifi</h4>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="resort-grid-list-icon">
                                            <img src="/assets/img/icon/resort-icon1-3.svg" alt="" />
                                        </div>
                                        <div className="resort-grid-list-details">
                                            <h4 className="resort-grid-list-title">Air Condition</h4>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="resort-grid-list-icon">
                                            <img src="/assets/img/icon/resort-icon1-4.svg" alt="" />
                                        </div>
                                        <div className="resort-grid-list-details">
                                            <h4 className="resort-grid-list-title">Heater</h4>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="resort-grid-list-icon">
                                            <img src="/assets/img/icon/resort-icon1-5.svg" alt="" />
                                        </div>
                                        <div className="resort-grid-list-details">
                                            <h4 className="resort-grid-list-title">Phone</h4>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="resort-grid-list-icon">
                                            <img src="/assets/img/icon/resort-icon1-6.svg" alt="" />
                                        </div>
                                        <div className="resort-grid-list-details">
                                            <h4 className="resort-grid-list-title">Hair Dryer</h4>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="resort-grid-list-icon">
                                            <img src="/assets/img/icon/resort-icon1-7.svg" alt="" />
                                        </div>
                                        <div className="resort-grid-list-details">
                                            <h4 className="resort-grid-list-title">Saving Safe</h4>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="resort-grid-list-icon">
                                            <img src="/assets/img/icon/resort-icon1-8.svg" alt="" />
                                        </div>
                                        <div className="resort-grid-list-details">
                                            <h4 className="resort-grid-list-title">Towels</h4>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="resort-grid-list-icon">
                                            <img src="/assets/img/icon/resort-icon1-9.svg" alt="" />
                                        </div>
                                        <div className="resort-grid-list-details">
                                            <h4 className="resort-grid-list-title">Laundry</h4>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="resort-grid-list-icon">
                                            <img src="/assets/img/icon/resort-icon1-10.svg" alt="" />
                                        </div>
                                        <div className="resort-grid-list-details">
                                            <h4 className="resort-grid-list-title">Bath</h4>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="destination-gallery-wrapper">
                                <h3 className="page-title mt-30 mb-30">From our gallery</h3>
                                <div className="row gy-4 gallery-row filter-active">
                                    <div className="col-xxl-auto filter-item">
                                        <div className="gallery-box style3">
                                            <div className="gallery-img global-img">
                                                <img
                                                    src="/assets/img/gallery/gallery_6_1.jpg"
                                                    alt="gallery"
                                                />
                                                <Link
                                                    to="/assets/img/gallery/gallery_6_1.jpg"
                                                    className="icon-btn popup-image"
                                                    onClick={(e) => openModal('/assets/img/gallery/gallery_6_1.jpg', e)}
                                                >
                                                    <i className="fal fa-magnifying-glass-plus" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xxl-auto filter-item">
                                        <div className="gallery-box style3">
                                            <div className="gallery-img global-img">
                                                <img
                                                    src="/assets/img/gallery/gallery_6_2.jpg"
                                                    alt="gallery"
                                                />
                                                <Link
                                                    to="/assets/img/gallery/gallery_6_2.jpg"
                                                    className="icon-btn popup-image"
                                                    onClick={(e) => openModal('/assets/img/gallery/gallery_6_2.jpg', e)}
                                                >
                                                    <i className="fal fa-magnifying-glass-plus" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xxl-auto filter-item">
                                        <div className="gallery-box style3">
                                            <div className="gallery-img global-img">
                                                <img
                                                    src="/assets/img/gallery/gallery_6_3.jpg"
                                                    alt="gallery"
                                                />
                                                <Link
                                                    to="/assets/img/gallery/gallery_6_3.jpg"
                                                    className="icon-btn popup-image"
                                                    onClick={(e) => openModal('/assets/img/gallery/gallery_6_3.jpg', e)}
                                                >
                                                    <i className="fal fa-magnifying-glass-plus" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xxl-auto filter-item">
                                        <div className="gallery-box style3">
                                            <div className="gallery-img global-img">
                                                <img
                                                    src="/assets/img/gallery/gallery_6_4.jpg"
                                                    alt="gallery"
                                                />
                                                <Link
                                                    to="/assets/img/gallery/gallery_6_4.jpg"
                                                    className="icon-btn popup-image"
                                                    onClick={(e) => openModal('/assets/img/gallery/gallery_6_4.jpg', e)}
                                                >
                                                    <i className="fal fa-magnifying-glass-plus" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="th-comments-wrap style2 ">
                                <h2 className="blog-inner-title h4">Reviews (3)</h2>
                                <ul className="comment-list">
                                    <li className="th-comment-item">
                                        <div className="th-post-comment">
                                            <div className="comment-avater">
                                                <img
                                                    src="/assets/img/blog/comment-author-1.jpg"
                                                    alt="Comment Author"
                                                />
                                            </div>
                                            <div className="comment-content">
                                                <h3 className="name">Adam Jhon</h3>
                                                <div className="commented-wrapp">
                                                    <span className="commented-on">20 Jun, 2024</span>
                                                    <span className="commented-time">08:56pm </span>
                                                    <span className="comment-review">
                                                        <i className="fa-solid fa-star" />
                                                        <i className="fa-solid fa-star" />
                                                        <i className="fa-solid fa-star" />
                                                        <i className="fa-solid fa-star" />
                                                        <i className="fa-solid fa-star" />
                                                    </span>
                                                </div>
                                                <p className="text">
                                                    Credibly pontificate transparent quality vectors with
                                                    quality mindshare. Efficiently architect worldwide
                                                    strategic theme areas after user.
                                                </p>
                                                <div className="reply_and_edit">
                                                    <i className="fa-solid fa-thumbs-up" />
                                                </div>
                                            </div>
                                        </div>
                                        <ul className="children">
                                            <li className="th-comment-item">
                                                <div className="th-post-comment">
                                                    <div className="comment-avater">
                                                        <img
                                                            src="/assets/img/blog/comment-author-4.jpg"
                                                            alt="Comment Author"
                                                        />
                                                    </div>
                                                    <div className="comment-content">
                                                        <div className="">
                                                            <h3 className="name">Maria Willson</h3>
                                                            <div className="commented-wrapp">
                                                                <span className="commented-on">23 Jun, 2024</span>
                                                                <span className="commented-time">08:56pm </span>
                                                                <span className="comment-review">
                                                                    <i className="fa-solid fa-star" />
                                                                    <i className="fa-solid fa-star" />
                                                                    <i className="fa-solid fa-star" />
                                                                    <i className="fa-solid fa-star" />
                                                                    <i className="fa-solid fa-star" />
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <p className="text">
                                                            It is different from airport transfer or port
                                                            transfer, which are services that pick you up
                                                        </p>
                                                        <div className="reply_and_edit">
                                                            <i className="fa-solid fa-thumbs-up" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="th-comment-item">
                                        <div className="th-post-comment">
                                            <div className="comment-avater">
                                                <img
                                                    src="/assets/img/blog/comment-author-5.jpg"
                                                    alt="Comment Author"
                                                />
                                            </div>
                                            <div className="comment-content">
                                                <div className="">
                                                    <h3 className="name">Michel Edwards</h3>
                                                    <div className="commented-wrapp">
                                                        <span className="commented-on">27 Jun, 2024</span>
                                                        <span className="commented-time">08:56pm </span>
                                                        <span className="comment-review">
                                                            <i className="fa-solid fa-star" />
                                                            <i className="fa-solid fa-star" />
                                                            <i className="fa-solid fa-star" />
                                                            <i className="fa-solid fa-star" />
                                                            <i className="fa-solid fa-star" />
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text">
                                                    Credibly pontificate transparent quality vectors with
                                                    quality mindshare. Efficiently architect worldwide
                                                    strategic theme areas after user.
                                                </p>
                                                <div className="reply_and_edit">
                                                    <i className="fa-solid fa-thumbs-up" />
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>{" "}
                            {/* Comment end */} {/* Comment Form */}
                            <div className="th-comment-form ">
                                <div className="row">
                                    <h3 className="blog-inner-title h4 mb-2">Leave a Reply</h3>
                                    <p className="mb-25">
                                        Your email address will not be published. Required fields are
                                        marked
                                    </p>
                                    <div className="col-md-6 form-group">
                                        <input
                                            type="text"
                                            placeholder="Full Name*"
                                            className="form-control"
                                            required=""
                                        />
                                        <i className="far fa-user" />
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <input
                                            type="text"
                                            placeholder="Your Email*"
                                            className="form-control"
                                            required=""
                                        />
                                        <i className="far fa-envelope" />
                                    </div>
                                    <div className="col-12 form-group">
                                        <input
                                            type="text"
                                            placeholder="Website"
                                            className="form-control"
                                            required=""
                                        />
                                        <i className="far fa-globe" />
                                    </div>
                                    <div className="col-12 form-group">
                                        <textarea
                                            placeholder="Comment*"
                                            className="form-control"
                                            defaultValue={""}
                                        />
                                        <i className="far fa-pencil" />
                                    </div>
                                    <div className="col-12 form-group">
                                        <input type="checkbox" id="html" />
                                        <label htmlFor="html">
                                            Save my name, email, and website in this browser for the next
                                            time I comment.
                                        </label>
                                    </div>
                                    <div className="col-12 form-group mb-0">
                                        <button className="th-btn">
                                            Send Message
                                            <img src="/assets/img/icon/plane2.svg" alt="" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-4 col-lg-5">
                        <aside className="sidebar-area style3">
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
                <div
                    className="shape-mockup shape1 d-none d-xxl-block"
                    style={{ bottom: "35%", right: "-12%" }}
                >
                    <img src="/assets/img/shape/shape_1.png" alt="shape" />
                </div>
                <div
                    className="shape-mockup shape2 d-none d-xl-block"
                    style={{ bottom: "31%", right: "-8%" }}
                >
                    <img src="/assets/img/shape/shape_2.png" alt="shape" />
                </div>
                <div
                    className="shape-mockup shape3 d-none d-xxl-block"
                    style={{ bottom: "33%", right: "-5%" }}
                >
                    <img src="/assets/img/shape/shape_3.png" alt="shape" />
                </div>
            </div>
            <Modal isOpen={isModalOpen} closeModal={closeModal} imageSrc={modalImage} />
        </section>

    )
}

export default ResortDetailsMain

