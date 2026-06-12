import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminDashboard() {
    const navigate = useNavigate();
    const [token, setToken] = useState('');

    // Always read the freshest token directly from localStorage
    const getToken = () => localStorage.getItem('admin_token') || '';

    // Smart fetch wrapper: auto-redirects to login on 401 (expired/invalid token)
    const authFetch = async (url, options = {}) => {
        const t = getToken();
        const mergedOptions = {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${t}`,
            },
        };
        const res = await fetch(url, mergedOptions);
        if (res.status === 401) {
            // Token expired or invalid â€” force re-login
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_email');
            navigate('/admin/login');
            throw new Error('Session expired. Please log in again.');
        }
        return res;
    };

    const [activeTab, setActiveTab] = useState('banner');
    const [isHomeMenuOpen, setIsHomeMenuOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // State for sections
    const [banners, setBanners] = useState([]);
    const [categories, setCategories] = useState([]);
    const [destinations, setDestinations] = useState([]);

    const [gallery, setGallery] = useState([]);
    const [reviews, setReviews] = useState([]);

    // Temporary Form States
    const [categoryForm, setCategoryForm] = useState({ id: null, title: '', imgSrc: '' });
    const [destinationForm, setDestinationForm] = useState({
        id: null, name: '', listings: 0, image: '', price: '', duration: '7 Days', bannerImg: '', pageTitle: '',
        description1: '', description2: '', basicInfoText: '', visaRequirements: '', language: '', currency: '',
        area: '', tourPlaces: '', quoteText: '', quoteAuthor: '', description3: '', description4: '',
        highlightsTitle: '', highlightsText: '', innerImage: '', highlights: [], gallery: [], isPopularTour: false
    });
    const [galleryForm, setGalleryForm] = useState({ imageUrl: '', title: 'gallery' });
    const [blogs, setBlogs] = useState([]);
    const [blogForm, setBlogForm] = useState({
        id: null, title: '', category: 'Tour Guide', author: 'Admin', date: '', image: '', bannerImg: '',
        shortDescription: '', content1: '', quoteText: '', quoteAuthor: '', content2: '', innerImage: '', tags: []
    });


    
    // --- Blogs ---
    const fetchBlogs = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/blog`);
            setBlogs(res.data);
        } catch (error) {
            console.error('Error fetching blogs', error);
        }
    };

    const handleAddBlog = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (blogForm.id) {
                await axios.put(`${process.env.REACT_APP_API_BASE_URL}/blog/${blogForm.id}`, blogForm, { headers: { Authorization: `Bearer ${token}` } });
                showMessage('success', 'Blog updated successfully!');
            } else {
                await axios.post(`${process.env.REACT_APP_API_BASE_URL}/blog`, blogForm, { headers: { Authorization: `Bearer ${token}` } });
                showMessage('success', 'Blog created successfully!');
            }
            setBlogForm({ id: null, title: '', category: 'Tour Guide', author: 'Admin', date: '', image: '', bannerImg: '', shortDescription: '', content1: '', quoteText: '', quoteAuthor: '', content2: '', innerImage: '', tags: [] });
            fetchBlogs();
        } catch (error) {
            showMessage('danger', 'Failed to save blog');
        }
        setLoading(false);
    };

    const handleDeleteBlog = async (id) => {
        if (!window.confirm('Are you sure you want to delete this blog?')) return;
        try {
            await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/blog/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            showMessage('success', 'Blog deleted successfully!');
            fetchBlogs();
        } catch (error) {
            showMessage('danger', 'Failed to delete blog');
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('admin_token');
        if (!storedToken) {
            navigate('/admin/login');
        } else {
            setToken(storedToken);
            fetchAllData(storedToken);
        }
    }, [navigate]);

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    };

    const fetchAllData = async (jwtToken) => {
        try {
            setLoading(true);
            const headers = { 'Content-Type': 'application/json' };

            // Fetch Banner
            const bannerRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/banner`, { headers });
            if (bannerRes.ok) setBanners(await bannerRes.json());

            // Fetch Categories
            const catRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/categories`, { headers });
            if (catRes.ok) setCategories(await catRes.json());

            // Fetch Destinations
            const destRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/destinations`, { headers });
            if (destRes.ok) setDestinations(await destRes.json());



            // Fetch Gallery
            const galRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/gallery`, { headers });
            if (galRes.ok) setGallery(await galRes.json());

            // Fetch Reviews
            const reviewRes = await authFetch(`${process.env.REACT_APP_API_BASE_URL}/reviews`, { headers });
            if (reviewRes.ok) setReviews(await reviewRes.json());

            fetchBlogs();

        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            showMessage('danger', 'Failed to synchronize with server.');
        } finally {
            setLoading(false);
        }
    };

    // Generic Image Uploader
    const handleImageUpload = async (e, callback) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            setLoading(true);
            const res = await authFetch(`${process.env.REACT_APP_API_BASE_URL}/upload`, {
                method: 'POST',
                body: formData
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || 'File upload failed');
            }

            const data = await res.json();
            callback(data.url);
            showMessage('success', 'Image uploaded successfully!');
        } catch (err) {
            showMessage('danger', err.message);
        } finally {
            setLoading(false);
        }
    };

    // LOGOUT
    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_email');
        navigate('/admin/login');
    };

    // ==========================================
    // 1. HERO BANNER METHODS
    // ==========================================
    const handleBannerChange = (index, field, value) => {
        const updated = [...banners];
        updated[index] = { ...updated[index], [field]: value };
        setBanners(updated);
    };

    const handleSaveBanners = async () => {
        try {
            setLoading(true);
            const res = await authFetch(`${process.env.REACT_APP_API_BASE_URL}/banner`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slides: banners })
            });

            if (res.ok) {
                showMessage('success', 'Hero Banners updated successfully!');
            } else {
                throw new Error('Could not update banners');
            }
        } catch (err) {
            showMessage('danger', err.message);
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // 2. CATEGORIES CRUD
    // ==========================================
    const handleSaveCategory = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const isEdit = !!categoryForm.id;
            const url = isEdit
                ? `${process.env.REACT_APP_API_BASE_URL}/categories/${categoryForm.id}`
                : `${process.env.REACT_APP_API_BASE_URL}/categories`;
            const method = isEdit ? 'PUT' : 'POST';

            const res = await authFetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: categoryForm.title, imgSrc: categoryForm.imgSrc })
            });

            if (res.ok) {
                showMessage('success', `Category ${isEdit ? 'updated' : 'added'} successfully!`);
                setCategoryForm({ id: null, title: '', imgSrc: '' });
                fetchAllData(token);
            } else {
                throw new Error('Save category failed.');
            }
        } catch (err) {
            showMessage('danger', err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm('Delete this category?')) return;
        try {
            setLoading(true);
            const res = await authFetch(`${process.env.REACT_APP_API_BASE_URL}/categories/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                showMessage('success', 'Category deleted.');
                fetchAllData(token);
            }
        } catch (err) {
            showMessage('danger', err.message);
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // 3. DESTINATIONS CRUD
    // ==========================================
    const handleSaveDestination = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const isEdit = !!destinationForm.id;
            const url = isEdit
                ? `${process.env.REACT_APP_API_BASE_URL}/destinations/${destinationForm.id}`
                : `${process.env.REACT_APP_API_BASE_URL}/destinations`;
            const method = isEdit ? 'PUT' : 'POST';

            const { id, ...payload } = destinationForm;
            payload.listings = Number(payload.listings) || 0;

            const res = await authFetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                showMessage('success', `Destination ${isEdit ? 'updated' : 'added'} successfully!`);
                setDestinationForm({
                    id: null, name: '', listings: 0, image: '', price: '', bannerImg: '', pageTitle: '',
                    description1: '', description2: '', basicInfoText: '', visaRequirements: '', language: '', currency: '',
                    area: '', tourPlaces: '', quoteText: '', quoteAuthor: '', description3: '', description4: '',
                    highlightsTitle: '', highlightsText: '', innerImage: '', highlights: [], gallery: [], isPopularTour: false, duration: '7 Days'
                });
                fetchAllData(token);
            } else {
                throw new Error('Save destination failed.');
            }
        } catch (err) {
            showMessage('danger', err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDestination = async (id) => {
        if (!window.confirm('Delete this destination?')) return;
        try {
            setLoading(true);
            const res = await authFetch(`${process.env.REACT_APP_API_BASE_URL}/destinations/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                showMessage('success', 'Destination deleted.');
                fetchAllData(token);
            }
        } catch (err) {
            showMessage('danger', err.message);
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // 4. GALLERY METHODS
    // ==========================================
    const handleAddGallery = async (e) => {
        e.preventDefault();
        if (!galleryForm.imageUrl) return;
        try {
            setLoading(true);
            const res = await authFetch(`${process.env.REACT_APP_API_BASE_URL}/gallery`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(galleryForm)
            });

            if (res.ok) {
                showMessage('success', 'Image added to Gallery!');
                setGalleryForm({ imageUrl: '', title: 'gallery' });
                fetchAllData(token);
            }
        } catch (err) {
            showMessage('danger', err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteGallery = async (id) => {
        if (!window.confirm('Remove this photo from the album?')) return;
        try {
            setLoading(true);
            const res = await authFetch(`${process.env.REACT_APP_API_BASE_URL}/gallery/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                showMessage('success', 'Photo removed.');
                fetchAllData(token);
            }
        } catch (err) {
            showMessage('danger', err.message);
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // 5. REVIEWS METHODS
    // ==========================================
    const handleDeleteReview = async (id) => {
        if (!window.confirm('Delete this review?')) return;
        try {
            setLoading(true);
            const res = await authFetch(`${process.env.REACT_APP_API_BASE_URL}/reviews/${id}`, { method: 'DELETE' });
            if (res.ok) {
                showMessage('success', 'Review deleted');
                fetchAllData(token);
            }
        } catch (err) {
            showMessage('danger', err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-dashboard-container" style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px 0' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap');
                
                .admin-dashboard-container {
                    font-family: 'Roboto', sans-serif !important;
                }
                
                .admin-dashboard-container h1, 
                .admin-dashboard-container h2, 
                .admin-dashboard-container h3, 
                .admin-dashboard-container h4, 
                .admin-dashboard-container h5, 
                .admin-dashboard-container h6 {
                    font-family: 'Roboto', sans-serif !important;
                    letter-spacing: -0.02em;
                }

                .admin-dashboard-container .form-control {
                    border: 1px solid #cbd5e1 !important;
                    border-radius: 8px !important;
                    padding: 12px 16px !important;
                    font-size: 14px !important;
                    font-family: 'Roboto', sans-serif !important;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.03) !important;
                    transition: all 0.2s ease !important;
                    background: #ffffff !important;
                    color: #334155 !important;
                }

                .admin-dashboard-container .form-control:focus {
                    border-color: #3b82f6 !important;
                    box-shadow: 0 0 0 3px rgba(59,130,246,0.1) !important;
                    outline: none !important;
                }

                .admin-dashboard-container label {
                    font-weight: 600 !important;
                    color: #475569 !important;
                    font-size: 13px !important;
                    margin-bottom: 8px !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.05em !important;
                }

                .admin-dashboard-container .table {
                    border-collapse: separate !important;
                    border-spacing: 0 !important;
                    width: 100% !important;
                }

                .admin-dashboard-container .table th {
                    background: #f1f5f9 !important;
                    color: #475569 !important;
                    font-weight: 700 !important;
                    font-size: 13px !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.05em !important;
                    padding: 16px !important;
                    border-bottom: 2px solid #e2e8f0 !important;
                    border-top: none !important;
                }

                .admin-dashboard-container .table td {
                    padding: 16px !important;
                    vertical-align: middle !important;
                    border-bottom: 1px solid #f1f5f9 !important;
                    color: #334155 !important;
                    font-size: 14px !important;
                    font-weight: 500 !important;
                }

                .admin-dashboard-container .table tbody tr:hover {
                    background-color: #f8fafc !important;
                }

                .admin-dashboard-container .admin-card {
                    background: #ffffff;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                    padding: 24px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
                }

                .admin-dashboard-container .th-btn {
                    font-family: 'Roboto', sans-serif !important;
                    border-radius: 8px !important;
                    font-weight: 600 !important;
                    letter-spacing: 0.01em !important;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05) !important;
                }

                /* Sidebar Sticky & Scrollbar Styling */
                .admin-sidebar-wrapper {
                    background: #ffffff;
                    border-radius: 12px;
                    padding: 16px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.02);
                    position: sticky;
                    top: 20px;
                    max-height: calc(100vh - 40px);
                    overflow-y: auto;
                }
                
                .admin-sidebar-wrapper::-webkit-scrollbar {
                    width: 4px;
                }
                .admin-sidebar-wrapper::-webkit-scrollbar-track {
                    background: transparent; 
                }
                .admin-sidebar-wrapper::-webkit-scrollbar-thumb {
                    background: #cbd5e1; 
                    border-radius: 10px;
                }
                .admin-sidebar-wrapper::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8; 
                }

            `}</style>
            <div className="container" style={{ maxWidth: '1400px' }}>
                {/* Alert Message */}
                {message.text && (
                    <div
                        className={`alert alert-${message.type === 'danger' ? 'danger' : 'success'} mb-30`}
                        style={{ borderRadius: '8px', padding: '14px 20px', fontWeight: '500' }}
                    >
                        <i className={`fa-solid ${message.type === 'danger' ? 'fa-triangle-exclamation' : 'fa-circle-check'} me-2`} />
                        {message.text}
                    </div>
                )}

                <div className="row gy-4">
                    {/* Tab Buttons Panel */}
                    <div className="col-lg-3">
                        <div className="admin-sidebar-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 40px)' }}>
                            <div style={{ flex: 1 }}>
                                <div className="mb-4 pb-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <h4 style={{ margin: 0, fontWeight: 800, color: '#1e293b', fontSize: '18px' }}>
                                        <i className="fa-solid fa-gauge-high text-primary me-2" />
                                        Jiyo Life Admin
                                    </h4>
                                </div>
                                <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#94a3b8', paddingLeft: '12px', display: 'block', marginBottom: '12px' }}>
                                Content Sections
                            </span>

                            {/* Home Page Accordion Menu */}
                            <div style={{ marginBottom: '8px' }}>
                                <button
                                    onClick={() => setIsHomeMenuOpen(!isHomeMenuOpen)}
                                    style={{
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: '14px 18px',
                                        borderRadius: '8px',
                                        background: isHomeMenuOpen ? 'rgba(0,113,244,0.04)' : 'transparent',
                                        color: '#1e293b',
                                        border: 'none',
                                        fontWeight: '700',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        transition: 'all 0.2s ease',
                                        outline: 'none'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <i className="fa-solid fa-house" style={{ fontSize: '15px', color: '#0071F4' }} />
                                        Home Page
                                    </div>
                                    <i className={`fa-solid fa-chevron-${isHomeMenuOpen ? 'up' : 'down'}`} style={{ fontSize: '12px', color: '#94a3b8' }} />
                                </button>

                                {/* Sub Categories */}
                                <div
                                    style={{
                                        overflow: 'hidden',
                                        transition: 'max-height 0.3s ease',
                                        maxHeight: isHomeMenuOpen ? '500px' : '0px',
                                        marginTop: isHomeMenuOpen ? '6px' : '0px',
                                        marginLeft: '12px',
                                        borderLeft: '2px solid #f1f5f9',
                                        paddingLeft: '10px'
                                    }}
                                >
                                    {[
                                        { key: 'banner', label: 'Top Banner / Hero', icon: 'fa-images' },
                                        { key: 'category', label: 'Tour Categories', icon: 'fa-layer-group' },
                                        { key: 'gallery', label: 'Photo Gallery', icon: 'fa-images' },
                                    ].map((tab) => (
                                        <button
                                            key={tab.key}
                                            onClick={() => setActiveTab(tab.key)}
                                            style={{
                                                width: '100%',
                                                textAlign: 'left',
                                                padding: '10px 14px',
                                                borderRadius: '6px',
                                                background: activeTab === tab.key ? 'rgba(0,113,244,0.08)' : 'transparent',
                                                color: activeTab === tab.key ? '#0071F4' : '#64748b',
                                                border: 'none',
                                                fontWeight: activeTab === tab.key ? '700' : '500',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                marginBottom: '4px',
                                                transition: 'all 0.2s ease',
                                                outline: 'none',
                                                fontSize: '14px'
                                            }}
                                        >
                                            <i className={`fa-solid ${tab.icon}`} style={{ fontSize: '14px', width: '16px', textAlign: 'center' }} />
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Destinations Main Menu Item */}
                            <div style={{ marginBottom: '8px' }}>
                                <button
                                    onClick={() => setActiveTab('destination')}
                                    style={{
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: '14px 18px',
                                        borderRadius: '8px',
                                        background: activeTab === 'destination' ? 'rgba(0,113,244,0.08)' : 'transparent',
                                        color: activeTab === 'destination' ? '#0071F4' : '#1e293b',
                                        border: 'none',
                                        fontWeight: '700',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        transition: 'all 0.2s ease',
                                        outline: 'none'
                                    }}
                                >
                                    <i className="fa-solid fa-map-location-dot" style={{ fontSize: '15px', width: '16px', textAlign: 'center', color: activeTab === 'destination' ? '#0071F4' : '#1e293b' }} />
                                    Destinations
                                </button>
                            </div>

                            {/* Sidebar & Social (Phase 2) */}
                            <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#94a3b8', paddingLeft: '12px', display: 'block', marginBottom: '12px', marginTop: '24px' }}>
                                Blog & Social
                            </span>

                            {[
                                { key: 'review', label: 'Reviews', icon: 'fa-star' },
                                { key: 'blog', label: 'Blog Posts', icon: 'fa-newspaper' }
                            ].map((tab) => (
                                <div key={tab.key} style={{ marginBottom: '8px' }}>
                                    <button
                                        onClick={() => setActiveTab(tab.key)}
                                        style={{
                                            width: '100%',
                                            textAlign: 'left',
                                            padding: '14px 18px',
                                            borderRadius: '8px',
                                            background: activeTab === tab.key ? 'rgba(0,113,244,0.08)' : 'transparent',
                                            color: activeTab === tab.key ? '#0071F4' : '#1e293b',
                                            border: 'none',
                                            fontWeight: '700',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            transition: 'all 0.2s ease',
                                            outline: 'none'
                                        }}
                                    >
                                        <i className={`fa-solid ${tab.icon}`} style={{ fontSize: '15px', width: '16px', textAlign: 'center', color: activeTab === tab.key ? '#0071F4' : '#1e293b' }} />
                                        {tab.label}
                                    </button>
                                </div>
                            ))}
                            </div>
                            
                            <div className="mt-4 pt-4" style={{ borderTop: '1px solid #e2e8f0' }}>
                                <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#64748b', textAlign: 'center' }}>
                                    Logged in as:<br/>
                                    <span style={{ fontWeight: 600, color: '#1e293b' }}>{localStorage.getItem('admin_email')}</span>
                                </p>
                                <button onClick={handleLogout} className="th-btn style3 w-100" style={{ height: '46px', padding: '0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <i className="fa-solid fa-arrow-right-from-bracket me-2" />
                                    Secure Logout
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Active Working Panel */}
                    <div className="col-lg-9">
                        <div className="admin-card" style={{ minHeight: '500px' }}>
                            {loading && (
                                <div style={{ textAlign: 'center', padding: '40px 0', color: '#0071F4' }}>
                                    <i className="fa-solid fa-spinner fa-spin fa-2xl mb-3" />
                                    <p style={{ fontWeight: '600' }}>Synchronizing with database...</p>
                                </div>
                            )}

                            {!loading && (
                                <>
                                    {/* ======================================================== */}
                                    {/* 1. HERO BANNER TAB */}
                                    {/* ======================================================== */}
                                    {activeTab === 'banner' && (
                                        <div>
                                            <h4 className="border-bottom pb-2 mb-20" style={{ fontWeight: 800 }}>Top Banner (Hero Slider)</h4>
                                            <p className="text-muted mb-30">Customize the background images, primary titles, and subtitles of your homepage slides.</p>

                                            {banners.map((slide, i) => (
                                                <div key={i} className="admin-card mb-4" style={{ background: '#f8fafc', boxShadow: 'none' }}>
                                                    <h5 style={{ fontWeight: '700', color: '#0071F4', marginBottom: '15px' }}>Slider Card #{i + 1}</h5>
                                                    <div className="row gy-3">
                                                        <div className="col-md-6">
                                                            <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Slide Subtitle</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={slide.subTitle}
                                                                onChange={(e) => handleBannerChange(i, 'subTitle', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Slide Main Title</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={slide.title}
                                                                onChange={(e) => handleBannerChange(i, 'title', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-12">
                                                            <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Background Image URL</label>
                                                            <div className="d-flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={slide.bgImage}
                                                                    onChange={(e) => handleBannerChange(i, 'bgImage', e.target.value)}
                                                                />
                                                                <div style={{ position: 'relative' }}>
                                                                    <button className="th-btn" style={{ height: '56px', whiteSpace: 'nowrap', padding: '0 20px' }}>
                                                                        Upload Image
                                                                    </button>
                                                                    <input
                                                                        type="file"
                                                                        onChange={(e) => handleImageUpload(e, (url) => handleBannerChange(i, 'bgImage', url))}
                                                                        style={{ position: 'absolute', top: 0, left: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            <button onClick={handleSaveBanners} className="th-btn style1 mt-10">
                                                <i className="fa-solid fa-floppy-disk me-2" />
                                                Save All Banners
                                            </button>
                                        </div>
                                    )}

                                    {/* ======================================================== */}
                                    {/* 2. CATEGORIES TAB */}
                                    {/* ======================================================== */}
                                    {activeTab === 'category' && (
                                        <div>
                                            <h4 className="border-bottom pb-2 mb-20" style={{ fontWeight: 800 }}>Tour Categories</h4>

                                            {/* Form Add / Edit */}
                                            <form onSubmit={handleSaveCategory} className="admin-card mb-4" style={{ background: '#f8fafc', boxShadow: 'none' }}>
                                                <h5 style={{ fontWeight: '700', marginBottom: '15px' }}>{categoryForm.id ? 'Edit Category' : 'Create New Category'}</h5>
                                                <div className="row gy-3">
                                                    <div className="col-md-6">
                                                        <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Category Name</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={categoryForm.title}
                                                            onChange={(e) => setCategoryForm({ ...categoryForm, title: e.target.value })}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Category Image</label>
                                                        <div className="d-flex gap-2">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={categoryForm.imgSrc}
                                                                onChange={(e) => setCategoryForm({ ...categoryForm, imgSrc: e.target.value })}
                                                                required
                                                            />
                                                            <div style={{ position: 'relative' }}>
                                                                <button type="button" className="th-btn" style={{ height: '56px', whiteSpace: 'nowrap', padding: '0 20px' }}>
                                                                    Upload
                                                                </button>
                                                                <input
                                                                    type="file"
                                                                    onChange={(e) => handleImageUpload(e, (url) => setCategoryForm({ ...categoryForm, imgSrc: url }))}
                                                                    style={{ position: 'absolute', top: 0, left: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 mt-10">
                                                        <button type="submit" className="th-btn style1 me-2">
                                                            {categoryForm.id ? 'Update Category' : 'Add Category'}
                                                        </button>
                                                        {categoryForm.id && (
                                                            <button type="button" onClick={() => setCategoryForm({ id: null, title: '', imgSrc: '' })} className="th-btn style3">
                                                                Cancel
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </form>

                                            {/* List */}
                                            <h5 style={{ fontWeight: '700', marginBottom: '15px' }}>Current Active Categories</h5>
                                            <table className="table align-middle">
                                                <thead>
                                                    <tr>
                                                        <th>Image</th>
                                                        <th>Title</th>
                                                        <th style={{ width: '150px' }}>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {categories.map((cat) => (
                                                        <tr key={cat._id}>
                                                            <td>
                                                                <img src={cat.imgSrc} alt="" style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '4px' }} />
                                                            </td>
                                                            <td style={{ fontWeight: '600' }}>{cat.title}</td>
                                                            <td>
                                                                <button onClick={() => { setCategoryForm({ id: cat._id, title: cat.title, imgSrc: cat.imgSrc }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="btn btn-sm btn-outline-primary me-2">
                                                                    <i className="fa-regular fa-pen-to-square" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteCategory(cat._id)}
                                                                    className="btn btn-sm btn-outline-danger"
                                                                >
                                                                    <i className="fa-solid fa-trash-can" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {/* ======================================================== */}
                                    {/* 3. DESTINATIONS TAB */}
                                    {/* ======================================================== */}
                                    {activeTab === 'destination' && (
                                        <div>
                                            <h4 className="border-bottom pb-2 mb-20" style={{ fontWeight: 800 }}>Destinations Manager</h4>

                                            {/* Form Add / Edit */}
                                            <form onSubmit={handleSaveDestination} className="admin-card mb-4" style={{ background: '#f8fafc', boxShadow: 'none' }}>
                                                <h5 style={{ fontWeight: '700', marginBottom: '15px' }}>{destinationForm.id ? 'Edit Destination details' : 'Create New Destination'}</h5>

                                                {/* BASIC INFO */}
                                                <h6 className="mt-4 mb-3" style={{ color: '#3b82f6' }}>1. Basic & Thumbnail Info</h6>
                                                <div className="row gy-3">
                                                    <div className="col-md-3">
                                                        <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Destination Name</label>
                                                        <input type="text" className="form-control" value={destinationForm.name || ''} onChange={(e) => setDestinationForm({ ...destinationForm, name: e.target.value })} required />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Listing Count</label>
                                                        <input type="number" className="form-control" value={destinationForm.listings || 0} onChange={(e) => setDestinationForm({ ...destinationForm, listings: e.target.value })} required />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Price (e.g. $980.00)</label>
                                                        <input type="text" className="form-control" value={destinationForm.price || ''} onChange={(e) => setDestinationForm({ ...destinationForm, price: e.target.value })} />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Duration (e.g. 7 Days)</label>
                                                        <input type="text" className="form-control" value={destinationForm.duration || '7 Days'} onChange={(e) => setDestinationForm({ ...destinationForm, duration: e.target.value })} placeholder="e.g. 7 Days" />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Thumbnail Photo</label>
                                                        <div className="d-flex gap-2">
                                                            <input type="text" className="form-control" value={destinationForm.image || ''} onChange={(e) => setDestinationForm({ ...destinationForm, image: e.target.value })} required />
                                                            <div style={{ position: 'relative' }}>
                                                                <button type="button" className="th-btn" style={{ padding: '0 10px', height: '100%' }}>â†‘</button>
                                                                <input type="file" onChange={(e) => handleImageUpload(e, (url) => setDestinationForm({ ...destinationForm, image: url }))} style={{ position: 'absolute', top: 0, left: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* DETAILS PAGE HERO */}
                                                <h6 className="mt-4 mb-3" style={{ color: '#3b82f6' }}>2. Details Page Top Section</h6>
                                                <div className="row gy-3">
                                                    <div className="col-md-12">
                                                        <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Banner Image URL</label>
                                                        <div className="d-flex gap-2">
                                                            <input type="text" className="form-control" value={destinationForm.bannerImg || ''} onChange={(e) => setDestinationForm({ ...destinationForm, bannerImg: e.target.value })} />
                                                            <div style={{ position: 'relative' }}>
                                                                <button type="button" className="th-btn" style={{ padding: '0 10px', height: '100%' }}>â†‘</button>
                                                                <input type="file" onChange={(e) => handleImageUpload(e, (url) => setDestinationForm({ ...destinationForm, bannerImg: url }))} style={{ position: 'absolute', top: 0, left: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Page Title (e.g. Explore the Beauty of Maldives)</label>
                                                        <input type="text" className="form-control" value={destinationForm.pageTitle || ''} onChange={(e) => setDestinationForm({ ...destinationForm, pageTitle: e.target.value })} />
                                                    </div>
                                                    <div className="col-md-12">
                                                        <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Description 1</label>
                                                        <textarea className="form-control" rows="3" value={destinationForm.description1 || ''} onChange={(e) => setDestinationForm({ ...destinationForm, description1: e.target.value })} />
                                                    </div>
                                                    <div className="col-md-12">
                                                        <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Description 2</label>
                                                        <textarea className="form-control" rows="3" value={destinationForm.description2 || ''} onChange={(e) => setDestinationForm({ ...destinationForm, description2: e.target.value })} />
                                                    </div>
                                                </div>

                                                {/* CHECKLIST SPECS */}
                                                <h6 className="mt-4 mb-3" style={{ color: '#3b82f6' }}>3. Basic Info Checklist</h6>
                                                <div className="row gy-3">
                                                    <div className="col-md-12">
                                                        <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Basic Info Description</label>
                                                        <textarea className="form-control" rows="2" value={destinationForm.basicInfoText || ''} onChange={(e) => setDestinationForm({ ...destinationForm, basicInfoText: e.target.value })} />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Visa</label>
                                                        <input type="text" className="form-control" value={destinationForm.visaRequirements || ''} onChange={(e) => setDestinationForm({ ...destinationForm, visaRequirements: e.target.value })} />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Language</label>
                                                        <input type="text" className="form-control" value={destinationForm.language || ''} onChange={(e) => setDestinationForm({ ...destinationForm, language: e.target.value })} />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Currency</label>
                                                        <input type="text" className="form-control" value={destinationForm.currency || ''} onChange={(e) => setDestinationForm({ ...destinationForm, currency: e.target.value })} />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Area</label>
                                                        <input type="text" className="form-control" value={destinationForm.area || ''} onChange={(e) => setDestinationForm({ ...destinationForm, area: e.target.value })} />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Tour Places</label>
                                                        <input type="text" className="form-control" value={destinationForm.tourPlaces || ''} onChange={(e) => setDestinationForm({ ...destinationForm, tourPlaces: e.target.value })} />
                                                    </div>
                                                </div>

                                                {/* QUOTE AND HIGHLIGHTS */}
                                                <h6 className="mt-4 mb-3" style={{ color: '#3b82f6' }}>4. Quote & Highlights</h6>
                                                <div className="row gy-3">
                                                    <div className="col-md-8">
                                                        <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Quote Text</label>
                                                        <textarea className="form-control" rows="2" value={destinationForm.quoteText || ''} onChange={(e) => setDestinationForm({ ...destinationForm, quoteText: e.target.value })} />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Quote Author</label>
                                                        <input type="text" className="form-control" value={destinationForm.quoteAuthor || ''} onChange={(e) => setDestinationForm({ ...destinationForm, quoteAuthor: e.target.value })} />
                                                    </div>
                                                    <div className="col-md-12">
                                                        <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Description 3 (After Quote)</label>
                                                        <textarea className="form-control" rows="2" value={destinationForm.description3 || ''} onChange={(e) => setDestinationForm({ ...destinationForm, description3: e.target.value })} />
                                                    </div>
                                                    <div className="col-md-12">
                                                        <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Description 4</label>
                                                        <textarea className="form-control" rows="2" value={destinationForm.description4 || ''} onChange={(e) => setDestinationForm({ ...destinationForm, description4: e.target.value })} />
                                                    </div>
                                                    <div className="col-md-12">
                                                        <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Highlights Title</label>
                                                        <input type="text" className="form-control" value={destinationForm.highlightsTitle || ''} onChange={(e) => setDestinationForm({ ...destinationForm, highlightsTitle: e.target.value })} />
                                                    </div>
                                                    <div className="col-md-12">
                                                        <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Highlights Description</label>
                                                        <textarea className="form-control" rows="2" value={destinationForm.highlightsText || ''} onChange={(e) => setDestinationForm({ ...destinationForm, highlightsText: e.target.value })} />
                                                    </div>
                                                    <div className="col-md-12">
                                                        <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Highlights Inner Image</label>
                                                        <div className="d-flex gap-2">
                                                            <input type="text" className="form-control" value={destinationForm.innerImage || ''} onChange={(e) => setDestinationForm({ ...destinationForm, innerImage: e.target.value })} />
                                                            <div style={{ position: 'relative' }}>
                                                                <button type="button" className="th-btn" style={{ padding: '0 10px', height: '100%' }}>â†‘</button>
                                                                <input type="file" onChange={(e) => handleImageUpload(e, (url) => setDestinationForm({ ...destinationForm, innerImage: url }))} style={{ position: 'absolute', top: 0, left: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Highlights List (Comma Separated)</label>
                                                        <textarea className="form-control" rows="3" placeholder="Highlight 1, Highlight 2, Highlight 3" value={destinationForm.highlights ? destinationForm.highlights.join(', ') : ''} onChange={(e) => setDestinationForm({ ...destinationForm, highlights: e.target.value.split(',').map(s => s.trim()) })} />
                                                    </div>
                                                    <div className="col-md-12">
                                                        <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Gallery Images (Comma Separated URLs)</label>
                                                        <textarea className="form-control" rows="3" placeholder="url1.jpg, url2.jpg" value={destinationForm.gallery ? destinationForm.gallery.join(', ') : ''} onChange={(e) => setDestinationForm({ ...destinationForm, gallery: e.target.value.split(',').map(s => s.trim()) })} />
                                                    </div>
                                                    <div className="col-md-12 mt-3">
                                                        <div className="form-check form-switch">
                                                            <input 
                                                                className="form-check-input" 
                                                                type="checkbox" 
                                                                id="isPopularTourToggle" 
                                                                checked={destinationForm.isPopularTour || false} 
                                                                onChange={(e) => setDestinationForm({ ...destinationForm, isPopularTour: e.target.checked })} 
                                                            />
                                                            <label className="form-check-label ms-2" htmlFor="isPopularTourToggle" style={{ fontWeight: '600', fontSize: '14px' }}>
                                                                Enable as Most Popular Tour (Shows on Home Page)
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-12 mt-20 border-top pt-20">
                                                    <button type="submit" className="th-btn style1 me-2">
                                                        {destinationForm.id ? 'Save Destination Details' : 'Add New Destination'}
                                                    </button>
                                                    {destinationForm.id && (
                                                        <button type="button" onClick={() => setDestinationForm({
                                                            id: null, name: '', listings: 0, image: '', price: '', bannerImg: '', pageTitle: '',
                                                            description1: '', description2: '', basicInfoText: '', visaRequirements: '', language: '', currency: '',
                                                            area: '', tourPlaces: '', quoteText: '', quoteAuthor: '', description3: '', description4: '',
                                                            highlightsTitle: '', highlightsText: '', innerImage: '', highlights: [], gallery: [], isPopularTour: false, duration: '7 Days'
                                                        })} className="th-btn style3">
                                                            Cancel Edit
                                                        </button>
                                                    )}
                                                </div>
                                            </form>

                                            {/* List */}
                                            <h5 style={{ fontWeight: '700', marginBottom: '15px' }}>Destinations Details Directory</h5>
                                            <table className="table align-middle">
                                                <thead>
                                                    <tr>
                                                        <th>Thumb</th>
                                                        <th>Destination Name</th>
                                                        <th>Price</th>
                                                        <th style={{ width: '150px' }}>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {destinations.map((dest) => (
                                                        <tr key={dest._id}>
                                                            <td>
                                                                <img src={dest.image} alt="" style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '4px' }} />
                                                            </td>
                                                            <td style={{ fontWeight: '600' }}>{dest.name}</td>
                                                            <td><span className="badge bg-secondary">{dest.price || 'N/A'}</span></td>
                                                            <td>
                                                                <button
                                                                    onClick={() => {
                                                                        setDestinationForm({
                                                                            id: dest._id, name: dest.name, listings: dest.listings, image: dest.image,
                                                                            price: dest.price, duration: dest.duration, bannerImg: dest.bannerImg, pageTitle: dest.pageTitle,
                                                                            description1: dest.description1, description2: dest.description2, basicInfoText: dest.basicInfoText,
                                                                            visaRequirements: dest.visaRequirements, language: dest.language, currency: dest.currency,
                                                                            area: dest.area, tourPlaces: dest.tourPlaces, quoteText: dest.quoteText, quoteAuthor: dest.quoteAuthor,
                                                                            description3: dest.description3, description4: dest.description4, highlightsTitle: dest.highlightsTitle,
                                                                            highlightsText: dest.highlightsText, innerImage: dest.innerImage, highlights: dest.highlights, gallery: dest.gallery, isPopularTour: dest.isPopularTour || false
                                                                        });
                                                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                                                    }}
                                                                    className="btn btn-sm btn-outline-primary me-2"
                                                                >
                                                                    <i className="fa-regular fa-pen-to-square" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteDestination(dest._id)}
                                                                    className="btn btn-sm btn-outline-danger"
                                                                >
                                                                    <i className="fa-solid fa-trash-can" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}



                                    {/* ======================================================== */}
                                    {/* 5. PHOTO GALLERY TAB */}
                                    {/* ======================================================== */}
                                    {activeTab === 'gallery' && (
                                        <div>
                                            <h4 className="border-bottom pb-2 mb-20" style={{ fontWeight: 800 }}>Recent Photo Gallery</h4>

                                            {/* Upload form */}
                                            <form onSubmit={handleAddGallery} className="admin-card mb-4" style={{ background: '#f8fafc', boxShadow: 'none' }}>
                                                <h5 style={{ fontWeight: '700', marginBottom: '15px' }}>Add Photo to Gallery Album</h5>
                                                <div className="row align-items-end gy-3">
                                                    <div className="col-md-9">
                                                        <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Photo Source URL</label>
                                                        <div className="d-flex gap-2">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={galleryForm.imageUrl}
                                                                onChange={(e) => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })}
                                                                required
                                                            />
                                                            <div style={{ position: 'relative' }}>
                                                                <button type="button" className="th-btn" style={{ height: '56px', whiteSpace: 'nowrap', padding: '0 20px' }}>
                                                                    Upload File
                                                                </button>
                                                                <input
                                                                    type="file"
                                                                    onChange={(e) => handleImageUpload(e, (url) => setGalleryForm({ ...galleryForm, imageUrl: url }))}
                                                                    style={{ position: 'absolute', top: 0, left: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <button type="submit" className="th-btn style1 w-100" style={{ height: '56px' }}>
                                                            <i className="fa-solid fa-plus me-2" />
                                                            Add to Album
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>

                                            {/* Grid View */}
                                            <h5 style={{ fontWeight: '700', marginBottom: '20px' }}>Album Photos ({gallery.length})</h5>
                                            <div className="row g-3">
                                                {gallery.map((photo) => (
                                                    <div key={photo._id} className="col-sm-6 col-md-4 col-lg-3">
                                                        <div
                                                            style={{
                                                                position: 'relative',
                                                                borderRadius: '8px',
                                                                overflow: 'hidden',
                                                                border: '1px solid #e2e8f0',
                                                                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                                                            }}
                                                        >
                                                            <img
                                                                src={photo.imageUrl}
                                                                alt=""
                                                                style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                                                            />
                                                            <button
                                                                onClick={() => handleDeleteGallery(photo._id)}
                                                                style={{
                                                                    position: 'absolute',
                                                                    top: '8px',
                                                                    right: '8px',
                                                                    background: '#ef4444',
                                                                    color: '#fff',
                                                                    border: 'none',
                                                                    width: '32px',
                                                                    height: '32px',
                                                                    borderRadius: '50%',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    cursor: 'pointer',
                                                                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                                                    outline: 'none'
                                                                }}
                                                            >
                                                                <i className="fa-solid fa-trash-can" style={{ fontSize: '13px' }} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* ======================================================== */}
                                    {/* BLOG TAB */}
                                    {/* ======================================================== */}
                                    {activeTab === 'blog' && (
                                        <div>
                                            <h4 className="border-bottom pb-2 mb-20" style={{ fontWeight: 800 }}>Blogs Manager</h4>

                                            {/* Form Add / Edit */}
                                            <form onSubmit={handleAddBlog} className="admin-card mb-4" style={{ background: '#f8fafc', boxShadow: 'none' }}>
                                                <h5 style={{ fontWeight: '700', marginBottom: '15px' }}>{blogForm.id ? 'Edit Blog details' : 'Create New Blog'}</h5>
                                                
                                                <div className="row gy-3">
                                                    <div className="col-md-3">
                                                        <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Blog Title</label>
                                                        <input type="text" className="form-control" value={blogForm.title || ''} onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })} required />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Category</label>
                                                        <input type="text" className="form-control" value={blogForm.category || ''} onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })} required />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Author</label>
                                                        <input type="text" className="form-control" value={blogForm.author || ''} onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })} required />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Date</label>
                                                        <input type="text" className="form-control" placeholder="DD/MM/YYYY" value={blogForm.date || ''} onChange={(e) => setBlogForm({ ...blogForm, date: e.target.value })} required />
                                                    </div>

                                                    <div className="col-md-6">
                                                        <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Thumbnail Image</label>
                                                        <div className="d-flex gap-2">
                                                            <input type="text" className="form-control" value={blogForm.image || ''} onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })} required />
                                                            <div style={{ position: 'relative' }}>
                                                                <button type="button" className="th-btn" style={{ height: '56px', whiteSpace: 'nowrap', padding: '0 20px' }}>Upload</button>
                                                                <input type="file" onChange={(e) => handleImageUpload(e, (url) => setBlogForm({ ...blogForm, image: url }))} style={{ position: 'absolute', top: 0, left: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Banner Image</label>
                                                        <div className="d-flex gap-2">
                                                            <input type="text" className="form-control" value={blogForm.bannerImg || ''} onChange={(e) => setBlogForm({ ...blogForm, bannerImg: e.target.value })} />
                                                            <div style={{ position: 'relative' }}>
                                                                <button type="button" className="th-btn" style={{ height: '56px', whiteSpace: 'nowrap', padding: '0 20px' }}>Upload</button>
                                                                <input type="file" onChange={(e) => handleImageUpload(e, (url) => setBlogForm({ ...blogForm, bannerImg: url }))} style={{ position: 'absolute', top: 0, left: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-12">
                                                        <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Short Description</label>
                                                        <textarea className="form-control" rows="2" value={blogForm.shortDescription || ''} onChange={(e) => setBlogForm({ ...blogForm, shortDescription: e.target.value })} required />
                                                    </div>

                                                    <div className="col-md-6">
                                                        <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Main Content (Paragraph 1)</label>
                                                        <textarea className="form-control" rows="4" value={blogForm.content1 || ''} onChange={(e) => setBlogForm({ ...blogForm, content1: e.target.value })} required />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Main Content (Paragraph 2)</label>
                                                        <textarea className="form-control" rows="4" value={blogForm.content2 || ''} onChange={(e) => setBlogForm({ ...blogForm, content2: e.target.value })} />
                                                    </div>

                                                    <div className="col-md-6">
                                                        <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Blockquote Text</label>
                                                        <textarea className="form-control" rows="2" value={blogForm.quoteText || ''} onChange={(e) => setBlogForm({ ...blogForm, quoteText: e.target.value })} />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Blockquote Author</label>
                                                        <input type="text" className="form-control" value={blogForm.quoteAuthor || ''} onChange={(e) => setBlogForm({ ...blogForm, quoteAuthor: e.target.value })} />
                                                    </div>

                                                    <div className="col-md-6">
                                                        <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Inner Image (Optional)</label>
                                                        <div className="d-flex gap-2">
                                                            <input type="text" className="form-control" value={blogForm.innerImage || ''} onChange={(e) => setBlogForm({ ...blogForm, innerImage: e.target.value })} />
                                                            <div style={{ position: 'relative' }}>
                                                                <button type="button" className="th-btn" style={{ height: '56px', whiteSpace: 'nowrap', padding: '0 20px' }}>Upload</button>
                                                                <input type="file" onChange={(e) => handleImageUpload(e, (url) => setBlogForm({ ...blogForm, innerImage: url }))} style={{ position: 'absolute', top: 0, left: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Tags</label>
                                                        <textarea className="form-control" rows="2" placeholder="Apartment, Modern, Travel" value={blogForm.tags ? blogForm.tags.join(', ') : ''} onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
                                                    </div>

                                                    <div className="col-12 mt-10">
                                                        <button type="submit" className="th-btn style1 me-2" disabled={loading}>
                                                            {loading ? 'Saving...' : (blogForm.id ? 'Save Blog Details' : 'Add New Blog')}
                                                        </button>
                                                        {blogForm.id && (
                                                            <button type="button" onClick={() => setBlogForm({
                                                                id: null, title: '', category: 'Tour Guide', author: 'Admin', date: '', image: '', bannerImg: '', shortDescription: '', content1: '', quoteText: '', quoteAuthor: '', content2: '', innerImage: '', tags: []
                                                            })} className="th-btn style3">
                                                                Cancel
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </form>

                                            <h5 style={{ fontWeight: '700', marginBottom: '15px' }}>Current Blogs</h5>
                                            <table className="table align-middle">
                                                <thead>
                                                    <tr>
                                                        <th>Thumb</th>
                                                        <th>Blog Title</th>
                                                        <th>Category</th>
                                                        <th>Date</th>
                                                        <th style={{ width: '150px' }}>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {blogs.length === 0 ? (
                                                        <tr>
                                                            <td colSpan="5" className="text-center py-4 text-muted">No blogs found.</td>
                                                        </tr>
                                                    ) : (
                                                        blogs.map((b) => (
                                                            <tr key={b._id}>
                                                                <td>
                                                                    <img src={b.image || '//assets/img/normal/about_3_1.jpg'} alt="" style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '4px' }} />
                                                                </td>
                                                                <td style={{ fontWeight: '600' }}>{b.title}</td>
                                                                <td><span style={{ fontWeight: '600', color: '#1e293b' }}>{b.category}</span></td>
                                                                <td>{b.date}</td>
                                                                <td>
                                                                    <button onClick={() => { setBlogForm({
                                                                        id: b._id, title: b.title, category: b.category, author: b.author, date: b.date, image: b.image, bannerImg: b.bannerImg, shortDescription: b.shortDescription, content1: b.content1, quoteText: b.quoteText, quoteAuthor: b.quoteAuthor, content2: b.content2, innerImage: b.innerImage, tags: b.tags
                                                                    }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="btn btn-sm btn-outline-primary me-2">
                                                                        <i className="fa-regular fa-pen-to-square" />
                                                                    </button>
                                                                    <button onClick={() => handleDeleteBlog(b._id)} className="btn btn-sm btn-outline-danger">
                                                                        <i className="fa-solid fa-trash-can" />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {/* ======================================================== */}
                                    {/* 8. REVIEWS TAB */}
                                    {/* ======================================================== */}
                                    {activeTab === 'review' && (
                                        <div>
                                            <h4 className="border-bottom pb-2 mb-20" style={{ fontWeight: 800 }}>Manage Reviews</h4>

                                            <div className="table-responsive bg-white rounded-3 shadow-sm border border-slate-200">
                                                <table className="table mb-0 align-middle">
                                                    <thead className="bg-slate-50">
                                                        <tr>
                                                            <th className="px-4 py-3 text-slate-500 text-uppercase" style={{ fontSize: '12px' }}>Name</th>
                                                            <th className="px-4 py-3 text-slate-500 text-uppercase" style={{ fontSize: '12px' }}>Email</th>
                                                            <th className="px-4 py-3 text-slate-500 text-uppercase" style={{ fontSize: '12px' }}>Rating</th>
                                                            <th className="px-4 py-3 text-slate-500 text-uppercase" style={{ fontSize: '12px' }}>Comment</th>
                                                            <th className="px-4 py-3 text-slate-500 text-uppercase text-end" style={{ fontSize: '12px' }}>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {reviews.map(r => (
                                                            <tr key={r._id}>
                                                                <td className="px-4 py-3 fw-bold">{r.name}</td>
                                                                <td className="px-4 py-3 text-muted">{r.email}</td>
                                                                <td className="px-4 py-3">
                                                                    <div className="text-warning">
                                                                        {[...Array(r.rating || 5)].map((_, i) => <i key={i} className="fa-solid fa-star" />)}
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-3" style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.comment}</td>
                                                                <td className="px-4 py-3 text-end">
                                                                    <button onClick={() => handleDeleteReview(r._id)} className="btn btn-sm btn-light text-danger"><i className="fa-solid fa-trash" /></button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {reviews.length === 0 && (
                                                            <tr>
                                                                <td colSpan="5" className="text-center py-4 text-muted">No reviews found</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
