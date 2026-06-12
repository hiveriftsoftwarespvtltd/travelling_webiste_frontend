import { ArrowRight } from 'lucide-react';
﻿import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import Modal from '../Gallery/Modal';
import NeedHelpWidget from '../Widgets/NeedHelpWidget';

function DestinationDetailsMain() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [blogs, setBlogs] = useState([]);
    const [modalImage, setModalImage] = useState("");
    const { id } = useParams();
    const [destinationPost, setDestinationPost] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Phase 2 states
    const [categories, setCategories] = useState([]);
    const [reviews, setReviews] = useState([]);

    // Review form state
    const [reviewForm, setReviewForm] = useState({ name: '', email: '', website: '', comment: '', rating: 5 });
    
    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...reviewForm, destinationId: id })
            });
            if (res.ok) {
                alert('Review submitted successfully!');
                setReviewForm({ name: '', email: '', website: '', comment: '', rating: 5 });
                // Re-fetch reviews
                const reviewsRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/reviews/destination/${id}`);
                const data = await reviewsRes.json();
                setReviews(data);
            }
        } catch (err) {
            console.error('Failed to submit review:', err);
            alert('Failed to submit review');
        }
    };

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/blog`).then(res => setBlogs(res.data)).catch(err => console.error(err));

        fetch(`${process.env.REACT_APP_API_BASE_URL}/destinations/${id}`)
            .then(res => res.json())
            .then(data => {
                setDestinationPost(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch destination:", err);
                setLoading(false);
            });

        // Fetch Sidebar and Reviews data
        fetch(`${process.env.REACT_APP_API_BASE_URL}/categories`).then(r => r.json()).then(setCategories).catch(console.error);
        fetch(`${process.env.REACT_APP_API_BASE_URL}/reviews/destination/${id}`).then(r => r.json()).then(setReviews).catch(console.error);
    }, [id]);

    if (loading) {
        return <div className="container py-5 text-center">Loading destination details...</div>;
    }

    if (!destinationPost) {
        return <div className="container py-5 text-center">Post not found!</div>;
    }

    const openModal = (imageSrc, event) => {
        event.preventDefault();
        setModalImage(imageSrc);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const getImageUrl = (url, fallbackFolder) => {
        if (!url) return '';
        const trimmed = url.trim();
        if (trimmed.startsWith('data:') || trimmed.startsWith('http') || trimmed.startsWith('/')) {
            return trimmed;
        }
        return `${fallbackFolder}/${trimmed}`;
    };
    
    const categoryCounts = (blogs || []).reduce((acc, post) => {
        const cat = post.category || 'Uncategorized';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {});
    const uniqueCategories = Object.keys(categoryCounts);

    return (
        <section className="space">
            <div className="container">
                <div className="row">
                    <div className="col-xxl-8 col-lg-7">
                        <div className="page-single">
                            <div className="service-img">
                                <img src={destinationPost.bannerImg ? getImageUrl(destinationPost.bannerImg, '/assets/img/destination') : getImageUrl(destinationPost.image, '/assets/img/destination')} alt="" style={{width: '100%', height: '500px', objectFit: 'cover'}} />
                            </div>
                            <div className="page-content d-block">
                                <div className="page-meta mt-50 mb-45">
                                    <Link className="page-tag mr-5" to="/tour">
                                        Featured
                                    </Link>
                                    <span className="ratting">
                                        <i className="fa-sharp fa-solid fa-star" />
                                        <span>4.8</span>
                                    </span>
                                </div>
                                <h2 className="box-title">
                                    {destinationPost.pageTitle || `Explore the Beauty of ${destinationPost.name} and enjoy`}
                                </h2>
                                <p className="blog-text mb-30">
                                    {destinationPost.description1 || 'Experience the vacation of a lifetime with our tailored packages.'}
                                </p>
                                {destinationPost.description2 && (
                                    <p className="blog-text mb-35">
                                        {destinationPost.description2}
                                    </p>
                                )}
                                
                                <h2 className="box-title">Basic Information</h2>
                                <p className="blog-text mb-35">
                                    {destinationPost.basicInfoText || 'Key details for your trip.'}
                                </p>
                                <div className="destination-checklist">
                                    <div className="checklist style2">
                                        <ul>
                                            <li>Destination</li>
                                            <li>Visa Requirements</li>
                                            <li>Language</li>
                                            <li>Currency Used</li>
                                            <li>Area (km2)</li>
                                            <li>Tour Places</li>
                                            <li>Per Person</li>
                                        </ul>
                                    </div>
                                    <div className="checklist style2">
                                        <ul>
                                            <li>{destinationPost.name}</li>
                                            <li>{destinationPost.visaRequirements || 'On Arrival Visa'}</li>
                                            <li>{destinationPost.language || 'English'}</li>
                                            <li>{destinationPost.currency || 'USD'}</li>
                                            <li>{destinationPost.area || 'N/A'}</li>
                                            <li>{destinationPost.tourPlaces || destinationPost.listings || 'Many'}</li>
                                            <li>{destinationPost.price || 'N/A'}</li>
                                        </ul>
                                    </div>
                                </div>
                                
                                {(destinationPost.quoteText || destinationPost.quoteAuthor) && (
                                    <blockquote>
                                        <p>{destinationPost.quoteText}</p>
                                        <cite>{destinationPost.quoteAuthor}</cite>
                                    </blockquote>
                                )}

                                {destinationPost.description3 && (
                                    <p className="blog-text mb-35">
                                        {destinationPost.description3}
                                    </p>
                                )}
                                {destinationPost.description4 && (
                                    <p className="blog-text mb-35">
                                        {destinationPost.description4}
                                    </p>
                                )}
                                
                                {destinationPost.highlightsTitle && (
                                    <h3 className="">{destinationPost.highlightsTitle}</h3>
                                )}
                                {destinationPost.highlightsText && (
                                    <p className="mb-35">{destinationPost.highlightsText}</p>
                                )}
                                
                                {destinationPost.innerImage && (
                                    <div className="service-inner-img mb-40">
                                        <img src={getImageUrl(destinationPost.innerImage, '/assets/img/destination')} alt="" style={{width: '100%', height: '400px', objectFit: 'cover'}} />
                                    </div>
                                )}
                                
                                {destinationPost.highlights && destinationPost.highlights.length > 0 && (
                                    <>
                                        <h2 className="box-title">Highlights</h2>
                                        <div className="checklist">
                                            <ul>
                                                {destinationPost.highlights.map((highlight, idx) => (
                                                    <li key={idx}>{highlight}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </>
                                )}
                            </div>
                            {destinationPost.gallery && destinationPost.gallery.filter(img => img && img.trim() !== '').length > 0 && (
                                <div className="destination-gallery-wrapper">
                                    <h3 className="page-title mt-30 mb-30">From our gallery</h3>
                                    <div className="row gy-4 gallery-row filter-active">
                                        {destinationPost.gallery.filter(img => img && img.trim() !== '').map((imgUrl, index) => (
                                            <div key={index} className="col-xxl-auto filter-item">
                                                <div className="gallery-box style3">
                                                    <div className="gallery-img global-img">
                                                        <img
                                                            src={getImageUrl(imgUrl, '/assets/img/gallery')}
                                                            alt="gallery"
                                                            style={{width: '200px', height: '150px', objectFit: 'cover'}}
                                                            onClick={(e) => openModal(getImageUrl(imgUrl, '/assets/img/gallery'), e)}
                                                        />
                                                        <Link
                                                            to={getImageUrl(imgUrl, '/assets/img/gallery')}
                                                            className="icon-btn popup-image"
                                                            onClick={(e) => openModal(getImageUrl(imgUrl, '/assets/img/gallery'), e)}
                                                        >
                                                            <i className="fal fa-magnifying-glass-plus" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="th-comments-wrap style2 ">
                                <h2 className="blog-inner-title h4">Reviews ({reviews.length})</h2>
                                <ul className="comment-list">
                                    {reviews.map(review => (
                                        <li key={review._id} className="th-comment-item">
                                            <div className="th-post-comment">
                                                <div className="comment-avater">
                                                    <img src="/assets/img/blog/comment-author-1.jpg" alt="Comment Author" />
                                                </div>
                                                <div className="comment-content">
                                                    <h3 className="name">{review.name}</h3>
                                                    <div className="commented-wrapp">
                                                        <span className="commented-on">{new Date(review.createdAt).toLocaleDateString()}</span>
                                                        <span className="comment-review">
                                                            {[...Array(review.rating || 5)].map((_, i) => <i key={i} className="fa-solid fa-star" />)}
                                                        </span>
                                                    </div>
                                                    <p className="text">{review.comment}</p>
                                                    <div className="reply_and_edit">
                                                        <i className="fa-solid fa-thumbs-up" />
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                    {reviews.length === 0 && <p className="text-muted mt-3">No reviews yet. Be the first to review!</p>}
                                </ul>
                            </div>{" "}
                            {/* Comment end */} {/* Comment Form */}
                            <div className="th-comment-form ">
                                <form className="row" onSubmit={handleReviewSubmit}>
                                    <h3 className="blog-inner-title h4 mb-2">Leave a Reply</h3>
                                    <p className="mb-25">Your email address will not be published. Required fields are marked *</p>
                                    
                                    <div className="col-12 form-group mb-3">
                                        <label>Rating (1-5)</label>
                                        <input type="number" min="1" max="5" className="form-control" value={reviewForm.rating} onChange={(e) => setReviewForm({...reviewForm, rating: parseInt(e.target.value)})} required />
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <input type="text" placeholder="Full Name*" className="form-control" value={reviewForm.name} onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})} required />
                                        <i className="far fa-user" />
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <input type="email" placeholder="Your Email*" className="form-control" value={reviewForm.email} onChange={(e) => setReviewForm({...reviewForm, email: e.target.value})} required />
                                        <i className="far fa-envelope" />
                                    </div>
                                    <div className="col-12 form-group">
                                        <input type="url" placeholder="Website" className="form-control" value={reviewForm.website} onChange={(e) => setReviewForm({...reviewForm, website: e.target.value})} />
                                        <i className="far fa-globe" />
                                    </div>
                                    <div className="col-12 form-group">
                                        <textarea placeholder="Comment*" className="form-control" value={reviewForm.comment} onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})} required />
                                        <i className="far fa-pencil" />
                                    </div>
                                    <div className="col-12 form-group mb-0 mt-3">
                                        <button type="submit" className="th-btn">
                                            Send Message
                                            <img src="/assets/img/icon/plane2.svg" alt="" />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-4 col-lg-5">
                        <aside className="sidebar-area style3">

                            {/* Book Now Widget â€” Professional Booking Card */}
                            <div className="widget" style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', marginBottom: '24px', border: '1px solid #f1f5f9' }}>
                                {/* Card Header with theme gradient */}
                                <div style={{ background: 'var(--theme-color)', padding: '20px 24px' }}>
                                    <h4 style={{ color: '#fff', fontWeight: '700', margin: 0, fontSize: '20px' }}>{destinationPost.name}</h4>
                                    <p style={{ color: 'rgba(255,255,255,0.85)', margin: '4px 0 0', fontSize: '13px' }}>Reserve your spot today</p>
                                </div>
                                {/* Info Rows */}
                                <div style={{ background: '#fff', padding: '20px 24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                                        <span style={{ color: '#64748b', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <i className="fa-light fa-clock" style={{ color: 'var(--theme-color)' }} /> Duration
                                        </span>
                                        <strong style={{ color: '#1e293b', fontSize: '14px' }}>{destinationPost.duration || '7 Days'}</strong>
                                    </div>
                                    {destinationPost.price && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                                            <span style={{ color: '#64748b', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <i className="fa-light fa-tag" style={{ color: 'var(--theme-color)' }} /> Price
                                            </span>
                                            <strong style={{ color: 'var(--theme-color)', fontSize: '16px', fontWeight: '700' }}>{destinationPost.price}<span style={{ fontSize: '12px', color: '#64748b', fontWeight: '400' }}>/Person</span></strong>
                                        </div>
                                    )}
                                    {destinationPost.tourPlaces && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                                            <span style={{ color: '#64748b', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <i className="fa-light fa-map-pin" style={{ color: 'var(--theme-color)' }} /> Tour Places
                                            </span>
                                            <strong style={{ color: '#1e293b', fontSize: '14px' }}>{destinationPost.tourPlaces}</strong>
                                        </div>
                                    )}
                                    <div className="tour-action" style={{ marginTop: '16px' }}>
                               
                                        <Link to="/checkout" className="th-btn style4 " style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>Book Now <ArrowRight size={16} /></Link>
                                    </div>
                                </div>
                            </div>

                            {/* Rest scrolls normally */}
                            <div className="widget widget_categories  ">
                                <h3 className="widget_title">Categories</h3>
                                                                <ul>
                                    {uniqueCategories.map(cat => (
                                        <li key={cat}>
                                            <Link to="/blog">
                                                <img src="/assets/img/theme-img/map.svg" alt="" />
                                                {cat}
                                            </Link>
                                            <span>({categoryCounts[cat]})</span>
                                        </li>
                                    ))}
                                    {uniqueCategories.length === 0 && (
                                        <li>No Categories Found</li>
                                    )}
                                </ul>
                            </div>

                            <NeedHelpWidget />
                        </aside>
                    </div>
                </div>
            </div>
            <Modal isOpen={isModalOpen} closeModal={closeModal} imageSrc={modalImage} />
        </section>
    )
}

export default DestinationDetailsMain

