import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminDashboard() {
    const navigate = useNavigate();
    const [token, setToken] = useState('');

    // Token retrieval helper
    const getToken = () => localStorage.getItem('admin_token') || '';

    // Smart fetch interceptor to handle expired sessions
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
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_email');
            navigate('/admin/login');
            throw new Error('Session expired. Please log in again.');
        }
        return res;
    };

    // Tabs & Loading states
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isHomeMenuOpen, setIsHomeMenuOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // --- Core Section States ---
    const [banners, setBanners] = useState([]);
    const [categories, setCategories] = useState([]);
    const [destinations, setDestinations] = useState([]); // Used as Tours
    const [bookings, setBookings] = useState([]);
    const [leads, setLeads] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [newsletters, setNewsletters] = useState([]);
    const [adminUsers, setAdminUsers] = useState([]);
    const [settingsForm, setSettingsForm] = useState({
        companyName: '', phone: '', email: '', address: '', whatsappNumber: '',
        facebookUrl: '', instagramUrl: '', youtubeUrl: '', linkedinUrl: '',
        metaTitle: '', metaDescription: '', googleAnalyticsCode: ''
    });

    // --- Metrics & Dashboard Widget state ---
    const [metrics, setMetrics] = useState({
        totalBookings: 0, newEnquiries: 0, contacted: 0, followUp: 0, confirmed: 0, cancelled: 0,
        totalDestinations: 0, totalBlogs: 0, totalReviews: 0, totalGallery: 0, recentBookings: []
    });

    // --- Filter States ---
    const [bookingStatusFilter, setBookingStatusFilter] = useState('all');

    // --- Temporary Add/Edit Form States ---
    const [categoryForm, setCategoryForm] = useState({ id: null, title: '', imgSrc: '', status: 'Active' });
    const [destinationForm, setDestinationForm] = useState({
        id: null, name: '', listings: 0, image: '', price: '', duration: '3N / 4D', bannerImg: '', pageTitle: '',
        description1: '', description2: '', basicInfoText: '', visaRequirements: '', language: '', currency: '',
        area: '', tourPlaces: '', quoteText: '', quoteAuthor: '', description3: '', description4: '',
        highlightsTitle: '', highlightsText: '', innerImage: '', highlights: [], gallery: [], isPopularTour: false,
        category: '', location: '', itinerary: '', inclusions: '', exclusions: '', termsConditions: '',
        featuredTour: false, status: 'Active'
    });
    const [galleryForm, setGalleryForm] = useState({ id: null, imageUrl: '', title: 'gallery', caption: '', destination: '', status: 'Active' });
    const [blogForm, setBlogForm] = useState({
        id: null, title: '', category: 'Tour Guide', author: 'Admin', date: '', image: '', bannerImg: '',
        shortDescription: '', content1: '', quoteText: '', quoteAuthor: '', content2: '', innerImage: '', tags: [],
    });

    const [reviewForm, setReviewForm] = useState({
        id: null, name: '', email: '', city: '', rating: 5, comment: '', status: 'Active', destinationId: 'global'
    });
    const [selectedReviewForView, setSelectedReviewForView] = useState(null);

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
            const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${jwtToken}` };

            // Fetch Banner
            const bannerRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/banner`, { headers });
            if (bannerRes.ok) setBanners(await bannerRes.json());

            // Fetch Categories
            const catRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/categories`, { headers });
            if (catRes.ok) setCategories(await catRes.json());

            // Fetch Destinations (Tours)
            const destRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/destinations`, { headers });
            if (destRes.ok) setDestinations(await destRes.json());

            // Fetch Gallery
            const galRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/gallery`, { headers });
            if (galRes.ok) setGallery(await galRes.json());

            // Fetch Reviews
            const reviewRes = await authFetch(`${process.env.REACT_APP_API_BASE_URL}/reviews`, { headers });
            if (reviewRes.ok) setReviews(await reviewRes.json());

            // Fetch Blogs
            const blogRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/blog`, { headers });
            if (blogRes.ok) setBlogs(await blogRes.json());

            // Fetch Bookings
            const bookingsRes = await authFetch(`${process.env.REACT_APP_API_BASE_URL}/bookings`, { headers });
            if (bookingsRes.ok) setBookings(await bookingsRes.json());

            // Fetch Dashboard Metrics
            const metricsRes = await authFetch(`${process.env.REACT_APP_API_BASE_URL}/bookings/dashboard/metrics`, { headers });
            if (metricsRes.ok) setMetrics(await metricsRes.json());

            // Fetch Leads
            const leadsRes = await authFetch(`${process.env.REACT_APP_API_BASE_URL}/leads`, { headers });
            if (leadsRes.ok) setLeads(await leadsRes.json());

            // Fetch Contact Enquiries
            const contactRes = await authFetch(`${process.env.REACT_APP_API_BASE_URL}/contact-enquiries`, { headers });
            if (contactRes.ok) setContacts(await contactRes.json());

            // Fetch Newsletter Subscribers
            const newsRes = await authFetch(`${process.env.REACT_APP_API_BASE_URL}/newsletter`, { headers });
            if (newsRes.ok) setNewsletters(await newsRes.json());

            // Fetch Web Settings
            const settingsRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/settings`, { headers });
            if (settingsRes.ok) setSettingsForm(await settingsRes.json());

            // Fetch Admin Users
            const usersRes = await authFetch(`${process.env.REACT_APP_API_BASE_URL}/auth/users`, { headers });
            if (usersRes.ok) setAdminUsers(await usersRes.json());

        } catch (err) {
            console.error('Error synchronizing dashboard:', err);
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
    // 1. HERO BANNERS
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
                fetchAllData(token);
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
                body: JSON.stringify({ title: categoryForm.title, imgSrc: categoryForm.imgSrc, status: categoryForm.status })
            });

            if (res.ok) {
                showMessage('success', `Category ${isEdit ? 'updated' : 'added'} successfully!`);
                setCategoryForm({ id: null, title: '', imgSrc: '', status: 'Active' });
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
    // 3. TOURS (DESTINATIONS) CRUD
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
                showMessage('success', `Tour Package ${isEdit ? 'updated' : 'created'} successfully!`);
                setDestinationForm({
                    id: null, name: '', listings: 0, image: '', price: '', bannerImg: '', pageTitle: '',
                    description1: '', description2: '', basicInfoText: '', visaRequirements: '', language: '', currency: '',
                    area: '', tourPlaces: '', quoteText: '', quoteAuthor: '', description3: '', description4: '',
                    highlightsTitle: '', highlightsText: '', innerImage: '', highlights: [], gallery: [], isPopularTour: false,
                    duration: '3N / 4D', category: '', location: '', itinerary: '', inclusions: '', exclusions: '',
                    termsConditions: '', featuredTour: false, status: 'Active'
                });
                fetchAllData(token);
            } else {
                throw new Error('Save tour failed.');
            }
        } catch (err) {
            showMessage('danger', err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDestination = async (id) => {
        if (!window.confirm('Delete this tour listing?')) return;
        try {
            setLoading(true);
            const res = await authFetch(`${process.env.REACT_APP_API_BASE_URL}/destinations/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                showMessage('success', 'Tour Package deleted.');
                fetchAllData(token);
            }
        } catch (err) {
            showMessage('danger', err.message);
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // 4. BOOKINGS
    // ==========================================
    const handleUpdateBookingStatus = async (id, newStatus) => {
        try {
            setLoading(true);
            const res = await authFetch(`${process.env.REACT_APP_API_BASE_URL}/bookings/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                showMessage('success', 'Booking status updated successfully!');
                fetchAllData(token);
            }
        } catch (err) {
            showMessage('danger', err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBooking = async (id) => {
        if (!window.confirm('Are you sure you want to delete this booking enquiry?')) return;
        try {
            setLoading(true);
            const res = await authFetch(`${process.env.REACT_APP_API_BASE_URL}/bookings/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                showMessage('success', 'Booking enquiry deleted.');
                fetchAllData(token);
            }
        } catch (err) {
            showMessage('danger', err.message);
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // 5. GALLERY CRUD
    // ==========================================
    const handleSaveGallery = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const isEdit = !!galleryForm.id;
            const url = isEdit
                ? `${process.env.REACT_APP_API_BASE_URL}/gallery/${galleryForm.id}`
                : `${process.env.REACT_APP_API_BASE_URL}/gallery`;
            const method = isEdit ? 'PUT' : 'POST';

            const res = await authFetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imageUrl: galleryForm.imageUrl,
                    title: galleryForm.title,
                    caption: galleryForm.caption,
                    destination: galleryForm.destination,
                    status: galleryForm.status
                })
            });

            if (res.ok) {
                showMessage('success', `Photo ${isEdit ? 'updated' : 'added'} successfully!`);
                setGalleryForm({ id: null, imageUrl: '', title: 'gallery', caption: '', destination: '', status: 'Active' });
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
    // 6. BLOGS CRUD
    // ==========================================
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
            setBlogForm({
                id: null, title: '', category: 'Tour Guide', author: 'Admin', date: '', image: '', bannerImg: '',
                shortDescription: '', content1: '', quoteText: '', quoteAuthor: '', content2: '', innerImage: '', tags: [],
                slug: '', metaTitle: '', metaDescription: ''
            });
            fetchAllData(token);
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
            fetchAllData(token);
        } catch (error) {
            showMessage('danger', 'Failed to delete blog');
        }
    };

    // ==========================================
    // 7. REVIEWS CRUD
    // ==========================================
    const handleSaveReview = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const isEdit = !!reviewForm.id;
            const url = isEdit
                ? `${process.env.REACT_APP_API_BASE_URL}/reviews/${reviewForm.id}`
                : `${process.env.REACT_APP_API_BASE_URL}/reviews`;
            const method = isEdit ? 'PUT' : 'POST';

            // Prepare payload
            const payload = {
                name: reviewForm.name,
                email: reviewForm.email,
                city: reviewForm.city,
                rating: Number(reviewForm.rating) || 5,
                comment: reviewForm.comment,
                status: reviewForm.status || 'Active',
                destinationId: reviewForm.destinationId || 'global'
            };

            const res = await authFetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                showMessage('success', `Review ${isEdit ? 'updated' : 'added'} successfully!`);
                setReviewForm({ id: null, name: '', email: '', city: '', rating: 5, comment: '', status: 'Active', destinationId: 'global' });
                fetchAllData(token);
            } else {
                const errData = await res.json();
                throw new Error(errData.message || 'Save review failed.');
            }
        } catch (err) {
            showMessage('danger', err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateReviewStatus = async (id, status) => {
        try {
            setLoading(true);
            const res = await authFetch(`${process.env.REACT_APP_API_BASE_URL}/reviews/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                showMessage('success', 'Review status updated');
                fetchAllData(token);
            }
        } catch (err) {
            showMessage('danger', err.message);
        } finally {
            setLoading(false);
        }
    };

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

    // ==========================================
    // 8. CONTACT ENQUIRIES
    // ==========================================
    const handleUpdateContactStatus = async (id, status) => {
        try {
            setLoading(true);
            const res = await authFetch(`${process.env.REACT_APP_API_BASE_URL}/contact-enquiries/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                showMessage('success', 'Enquiry status updated');
                fetchAllData(token);
            }
        } catch (err) {
            showMessage('danger', err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteContact = async (id) => {
        if (!window.confirm('Delete this contact enquiry?')) return;
        try {
            setLoading(true);
            const res = await authFetch(`${process.env.REACT_APP_API_BASE_URL}/contact-enquiries/${id}`, { method: 'DELETE' });
            if (res.ok) {
                showMessage('success', 'Enquiry deleted');
                fetchAllData(token);
            }
        } catch (err) {
            showMessage('danger', err.message);
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // 9. NEWSLETTERS
    // ==========================================
    const handleDeleteNewsletter = async (id) => {
        if (!window.confirm('Delete subscriber?')) return;
        try {
            setLoading(true);
            const res = await authFetch(`${process.env.REACT_APP_API_BASE_URL}/newsletter/${id}`, { method: 'DELETE' });
            if (res.ok) {
                showMessage('success', 'Subscriber removed');
                fetchAllData(token);
            }
        } catch (err) {
            showMessage('danger', err.message);
        } finally {
            setLoading(false);
        }
    };

    const exportNewsletterCSV = () => {
        let csvContent = "data:text/csv;charset=utf-8,Email,Subscription Date\n";
        newsletters.forEach(sub => {
            const date = new Date(sub.subscribeDate || sub.createdAt).toLocaleDateString();
            csvContent += `${sub.email},${date}\n`;
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `newsletter_subscribers_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // ==========================================
    // 10. WEB SETTINGS
    // ==========================================
    const handleSaveSettings = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await authFetch(`${process.env.REACT_APP_API_BASE_URL}/settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settingsForm)
            });
            if (res.ok) {
                showMessage('success', 'Website settings saved successfully!');
                fetchAllData(token);
            } else {
                throw new Error('Failed to save settings');
            }
        } catch (err) {
            showMessage('danger', err.message);
        } finally {
            setLoading(false);
        }
    };

    // Filtered bookings calculation
    const getFilteredBookings = () => {
        if (bookingStatusFilter === 'all') return bookings;
        return bookings.filter(b => b.status?.toLowerCase() === bookingStatusFilter.toLowerCase());
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
                
                .widget-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .metrics-card {
                    background: #ffffff;
                    border-radius: 10px;
                    padding: 20px;
                    border: 1px solid #e2e8f0;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                }

                .metrics-card h6 {
                    color: #64748b;
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    margin: 0 0 6px 0;
                    letter-spacing: 0.05em;
                }

                .metrics-card .num {
                    font-size: 28px;
                    font-weight: 900;
                    color: #1e293b;
                    margin: 0;
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
                                        <i className="fa-solid fa-plane-departure text-primary me-2" />
                                        Jiyo Life Admin
                                    </h4>
                                </div>
                                
                                <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#94a3b8', paddingLeft: '12px', display: 'block', marginBottom: '8px' }}>
                                    Core System
                                </span>

                                <button
                                    onClick={() => setActiveTab('dashboard')}
                                    style={{
                                        width: '100%', textAlign: 'left', padding: '12px 18px', borderRadius: '8px',
                                        background: activeTab === 'dashboard' ? 'rgba(0,113,244,0.08)' : 'transparent',
                                        color: activeTab === 'dashboard' ? '#0071F4' : '#1e293b',
                                        border: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '12px',
                                        marginBottom: '6px', transition: 'all 0.2s', outline: 'none'
                                    }}
                                >
                                    <i className="fa-solid fa-chart-line" /> Dashboard
                                </button>

                                <button
                                    onClick={() => setActiveTab('booking')}
                                    style={{
                                        width: '100%', textAlign: 'left', padding: '12px 18px', borderRadius: '8px',
                                        background: activeTab === 'booking' ? 'rgba(0,113,244,0.08)' : 'transparent',
                                        color: activeTab === 'booking' ? '#0071F4' : '#1e293b',
                                        border: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '12px',
                                        marginBottom: '6px', transition: 'all 0.2s', outline: 'none'
                                    }}
                                >
                                    <i className="fa-solid fa-calendar-check" /> Bookings
                                </button>

                                <button
                                    onClick={() => setActiveTab('lead')}
                                    style={{
                                        width: '100%', textAlign: 'left', padding: '12px 18px', borderRadius: '8px',
                                        background: activeTab === 'lead' ? 'rgba(0,113,244,0.08)' : 'transparent',
                                        color: activeTab === 'lead' ? '#0071F4' : '#1e293b',
                                        border: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '12px',
                                        marginBottom: '15px', transition: 'all 0.2s', outline: 'none'
                                    }}
                                >
                                    <i className="fa-solid fa-users-gear" /> Lead Management
                                </button>

                                <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#94a3b8', paddingLeft: '12px', display: 'block', marginBottom: '8px' }}>
                                    Content & Landing
                                </span>

                                {/* Home Page Accordion Menu */}
                                <div style={{ marginBottom: '6px' }}>
                                    <button
                                        onClick={() => setIsHomeMenuOpen(!isHomeMenuOpen)}
                                        style={{
                                            width: '100%', textAlign: 'left', padding: '12px 18px', borderRadius: '8px',
                                            background: isHomeMenuOpen ? 'rgba(0,113,244,0.03)' : 'transparent',
                                            color: '#1e293b', border: 'none', fontWeight: '700', display: 'flex',
                                            alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s', outline: 'none'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <i className="fa-solid fa-house" style={{ color: '#0071F4' }} />
                                            Home Layout
                                        </div>
                                        <i className={`fa-solid fa-chevron-${isHomeMenuOpen ? 'up' : 'down'}`} style={{ fontSize: '10px', color: '#94a3b8' }} />
                                    </button>

                                    <div
                                        style={{
                                            overflow: 'hidden', transition: 'max-height 0.3s ease',
                                            maxHeight: isHomeMenuOpen ? '500px' : '0px',
                                            marginTop: isHomeMenuOpen ? '6px' : '0px',
                                            marginLeft: '12px', borderLeft: '2px solid #f1f5f9', paddingLeft: '10px'
                                        }}
                                    >
                                        {[
                                            { key: 'banner', label: 'Banners (Hero)', icon: 'fa-images' },
                                            { key: 'category', label: 'Tour Categories', icon: 'fa-layer-group' },
                                            { key: 'gallery', label: 'Photo Gallery', icon: 'fa-image' },
                                        ].map((tab) => (
                                            <button
                                                key={tab.key}
                                                onClick={() => setActiveTab(tab.key)}
                                                style={{
                                                    width: '100%', textAlign: 'left', padding: '10px 14px', borderRadius: '6px',
                                                    background: activeTab === tab.key ? 'rgba(0,113,244,0.08)' : 'transparent',
                                                    color: activeTab === tab.key ? '#0071F4' : '#64748b',
                                                    border: 'none', fontWeight: activeTab === tab.key ? '700' : '500',
                                                    display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px',
                                                    transition: 'all 0.2s', outline: 'none', fontSize: '13px'
                                                }}
                                            >
                                                <i className={`fa-solid ${tab.icon}`} style={{ width: '16px', textAlign: 'center' }} />
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setActiveTab('destination')}
                                    style={{
                                        width: '100%', textAlign: 'left', padding: '12px 18px', borderRadius: '8px',
                                        background: activeTab === 'destination' ? 'rgba(0,113,244,0.08)' : 'transparent',
                                        color: activeTab === 'destination' ? '#0071F4' : '#1e293b',
                                        border: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '12px',
                                        marginBottom: '6px', transition: 'all 0.2s', outline: 'none'
                                    }}
                                >
                                    <i className="fa-solid fa-map-location-dot" /> Destinations / Tours
                                </button>

                                <button
                                    onClick={() => setActiveTab('blog')}
                                    style={{
                                        width: '100%', textAlign: 'left', padding: '12px 18px', borderRadius: '8px',
                                        background: activeTab === 'blog' ? 'rgba(0,113,244,0.08)' : 'transparent',
                                        color: activeTab === 'blog' ? '#0071F4' : '#1e293b',
                                        border: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '12px',
                                        marginBottom: '6px', transition: 'all 0.2s', outline: 'none'
                                    }}
                                >
                                    <i className="fa-solid fa-newspaper" /> Blog Management
                                </button>

                                <button
                                    onClick={() => setActiveTab('review')}
                                    style={{
                                        width: '100%', textAlign: 'left', padding: '12px 18px', borderRadius: '8px',
                                        background: activeTab === 'review' ? 'rgba(0,113,244,0.08)' : 'transparent',
                                        color: activeTab === 'review' ? '#0071F4' : '#1e293b',
                                        border: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '12px',
                                        marginBottom: '15px', transition: 'all 0.2s', outline: 'none'
                                    }}
                                >
                                    <i className="fa-solid fa-star" /> Reviews
                                </button>

                                <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#94a3b8', paddingLeft: '12px', display: 'block', marginBottom: '8px' }}>
                                    Settings & Lists
                                </span>

                                <button
                                    onClick={() => setActiveTab('contact')}
                                    style={{
                                        width: '100%', textAlign: 'left', padding: '12px 18px', borderRadius: '8px',
                                        background: activeTab === 'contact' ? 'rgba(0,113,244,0.08)' : 'transparent',
                                        color: activeTab === 'contact' ? '#0071F4' : '#1e293b',
                                        border: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '12px',
                                        marginBottom: '6px', transition: 'all 0.2s', outline: 'none'
                                    }}
                                >
                                    <i className="fa-solid fa-envelope-open-text" /> Contact Enquiries
                                </button>

                                <button
                                    onClick={() => setActiveTab('newsletter')}
                                    style={{
                                        width: '100%', textAlign: 'left', padding: '12px 18px', borderRadius: '8px',
                                        background: activeTab === 'newsletter' ? 'rgba(0,113,244,0.08)' : 'transparent',
                                        color: activeTab === 'newsletter' ? '#0071F4' : '#1e293b',
                                        border: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '12px',
                                        marginBottom: '6px', transition: 'all 0.2s', outline: 'none'
                                    }}
                                >
                                    <i className="fa-solid fa-envelope" /> Newsletter
                                </button>

                                <button
                                    onClick={() => setActiveTab('settings')}
                                    style={{
                                        width: '100%', textAlign: 'left', padding: '12px 18px', borderRadius: '8px',
                                        background: activeTab === 'settings' ? 'rgba(0,113,244,0.08)' : 'transparent',
                                        color: activeTab === 'settings' ? '#0071F4' : '#1e293b',
                                        border: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '12px',
                                        marginBottom: '6px', transition: 'all 0.2s', outline: 'none'
                                    }}
                                >
                                    <i className="fa-solid fa-sliders" /> Website Settings
                                </button>

                                <button
                                    onClick={() => setActiveTab('admins')}
                                    style={{
                                        width: '100%', textAlign: 'left', padding: '12px 18px', borderRadius: '8px',
                                        background: activeTab === 'admins' ? 'rgba(0,113,244,0.08)' : 'transparent',
                                        color: activeTab === 'admins' ? '#0071F4' : '#1e293b',
                                        border: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '12px',
                                        marginBottom: '6px', transition: 'all 0.2s', outline: 'none'
                                    }}
                                >
                                    <i className="fa-solid fa-user-shield" /> Admin Users
                                </button>

                            </div>
                            
                            <div className="mt-4 pt-4" style={{ borderTop: '1px solid #e2e8f0' }}>
                                <p style={{ margin: '0 0 10px 0', fontSize: '11px', color: '#64748b', textAlign: 'center' }}>
                                    Logged in as:<br/>
                                    <span style={{ fontWeight: 600, color: '#1e293b' }}>{localStorage.getItem('admin_email')}</span>
                                </p>
                                <button onClick={handleLogout} className="btn btn-sm btn-outline-danger w-100" style={{ padding: '10px 0', borderRadius: '8px', fontWeight: '700' }}>
                                    <i className="fa-solid fa-arrow-right-from-bracket me-2" />
                                    Secure Logout
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Active Working Panel */}
                    <div className="col-lg-9">
                        <div className="admin-card" style={{ minHeight: '600px' }}>
                            {loading && (
                                <div style={{ textAlign: 'center', padding: '40px 0', color: '#0071F4' }}>
                                    <i className="fa-solid fa-spinner fa-spin fa-2xl mb-3" />
                                    <p style={{ fontWeight: '600' }}>Processing request...</p>
                                </div>
                            )}

                            {!loading && (
                                <>
                                    {/* ======================================================== */}
                                    {/* DASHBOARD TAB */}
                                    {/* ======================================================== */}
                                    {activeTab === 'dashboard' && (
                                        <div>
                                            <h4 className="border-bottom pb-2 mb-20" style={{ fontWeight: 800 }}>Dashboard Overview</h4>
                                            
                                            <div className="widget-grid">
                                                <div className="metrics-card">
                                                    <h6>Total Bookings</h6>
                                                    <p className="num">{metrics.totalBookings || 0}</p>
                                                </div>
                                                <div className="metrics-card">
                                                    <h6>New Enquiries</h6>
                                                    <p className="num" style={{ color: '#ef4444' }}>{metrics.newEnquiries || 0}</p>
                                                </div>
                                                <div className="metrics-card">
                                                    <h6>Confirmed</h6>
                                                    <p className="num" style={{ color: '#10b981' }}>{metrics.confirmed || 0}</p>
                                                </div>
                                                <div className="metrics-card">
                                                    <h6>Pending/Followup</h6>
                                                    <p className="num" style={{ color: '#f59e0b' }}>{(metrics.contacted || 0) + (metrics.followUp || 0)}</p>
                                                </div>
                                                <div className="metrics-card">
                                                    <h6>Cancelled</h6>
                                                    <p className="num" style={{ color: '#64748b' }}>{metrics.cancelled || 0}</p>
                                                </div>
                                                <div className="metrics-card">
                                                    <h6>Tours List</h6>
                                                    <p className="num">{metrics.totalDestinations || 0}</p>
                                                </div>
                                                <div className="metrics-card">
                                                    <h6>Blogs count</h6>
                                                    <p className="num">{metrics.totalBlogs || 0}</p>
                                                </div>
                                            </div>

                                            <h5 style={{ fontWeight: '800', margin: '30px 0 15px 0' }}>Recent Booking Requests</h5>
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Tour Name</th>
                                                        <th>Date</th>
                                                        <th>Mobile</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(metrics.recentBookings || []).map(b => (
                                                        <tr key={b._id}>
                                                            <td style={{ fontWeight: 600 }}>{b.firstName} {b.lastName}</td>
                                                            <td>{b.tourName}</td>
                                                            <td>{b.travelDate}</td>
                                                            <td>{b.mobile}</td>
                                                            <td>
                                                                <span className={`badge ${
                                                                    b.status === 'Confirmed' ? 'bg-success' :
                                                                    b.status === 'Cancelled' ? 'bg-secondary' :
                                                                    b.status === 'Contacted' ? 'bg-info' :
                                                                    b.status === 'Follow Up' ? 'bg-warning' : 'bg-danger'
                                                                }`}>{b.status || 'New'}</span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {(metrics.recentBookings || []).length === 0 && (
                                                        <tr>
                                                            <td colSpan="5" className="text-center py-4 text-muted">No recent bookings found.</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {/* ======================================================== */}
                                    {/* BANNERS TAB */}
                                    {/* ======================================================== */}
                                    {activeTab === 'banner' && (
                                        <div>
                                            <h4 className="border-bottom pb-2 mb-20" style={{ fontWeight: 800 }}>Homepage Banners</h4>
                                            
                                            {banners.map((slide, i) => (
                                                <div key={slide._id || i} className="admin-card mb-4" style={{ background: '#f8fafc', boxShadow: 'none' }}>
                                                    <h5 style={{ fontWeight: '700', color: '#0071F4', marginBottom: '15px' }}>Banner Slide #{i + 1}</h5>
                                                    <div className="row gy-3">
                                                        <div className="col-md-6">
                                                            <label>Slide Subtitle</label>
                                                            <input
                                                                type="text" className="form-control" value={slide.subTitle || ''}
                                                                onChange={(e) => handleBannerChange(i, 'subTitle', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label>Slide Main Title</label>
                                                            <input
                                                                type="text" className="form-control" value={slide.title || ''}
                                                                onChange={(e) => handleBannerChange(i, 'title', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-md-4">
                                                            <label>Button Text</label>
                                                            <input
                                                                type="text" className="form-control" value={slide.buttonText || ''}
                                                                onChange={(e) => handleBannerChange(i, 'buttonText', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-md-4">
                                                            <label>Button Link</label>
                                                            <input
                                                                type="text" className="form-control" value={slide.buttonLink || ''}
                                                                onChange={(e) => handleBannerChange(i, 'buttonLink', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-md-4">
                                                            <label>Status</label>
                                                            <select
                                                                className="form-control" value={slide.status || 'Active'}
                                                                onChange={(e) => handleBannerChange(i, 'status', e.target.value)}
                                                            >
                                                                <option value="Active">Active</option>
                                                                <option value="Inactive">Inactive</option>
                                                            </select>
                                                        </div>
                                                        <div className="col-12">
                                                            <label>Background Image URL</label>
                                                            <div className="d-flex gap-2">
                                                                <input
                                                                    type="text" className="form-control" value={slide.bgImage || ''}
                                                                    onChange={(e) => handleBannerChange(i, 'bgImage', e.target.value)}
                                                                />
                                                                <div style={{ position: 'relative' }}>
                                                                    <button className="btn btn-secondary text-nowrap" style={{ height: '100%', padding: '0 20px' }}>Upload</button>
                                                                    <input
                                                                        type="file" onChange={(e) => handleImageUpload(e, (url) => handleBannerChange(i, 'bgImage', url))}
                                                                        style={{ position: 'absolute', top: 0, left: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <button onClick={handleSaveBanners} className="btn btn-primary" style={{ padding: '12px 24px', fontWeight: '700' }}>
                                                <i className="fa-solid fa-floppy-disk me-2" /> Save All Banners
                                            </button>
                                        </div>
                                    )}

                                    {/* ======================================================== */}
                                    {/* CATEGORIES TAB */}
                                    {/* ======================================================== */}
                                    {activeTab === 'category' && (
                                        <div>
                                            <h4 className="border-bottom pb-2 mb-20" style={{ fontWeight: 800 }}>Tour Categories</h4>
                                            
                                            <form onSubmit={handleSaveCategory} className="admin-card mb-4" style={{ background: '#f8fafc', boxShadow: 'none' }}>
                                                <h5 style={{ fontWeight: '700', marginBottom: '15px' }}>{categoryForm.id ? 'Edit Category' : 'Create Category'}</h5>
                                                <div className="row gy-3">
                                                    <div className="col-md-5">
                                                        <label>Category Name</label>
                                                        <input
                                                            type="text" className="form-control" value={categoryForm.title}
                                                            onChange={(e) => setCategoryForm({ ...categoryForm, title: e.target.value })} required
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label>Status</label>
                                                        <select
                                                            className="form-control" value={categoryForm.status}
                                                            onChange={(e) => setCategoryForm({ ...categoryForm, status: e.target.value })}
                                                        >
                                                            <option value="Active">Active</option>
                                                            <option value="Inactive">Inactive</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <label>Category Image</label>
                                                        <div className="d-flex gap-2">
                                                            <input
                                                                type="text" className="form-control" value={categoryForm.imgSrc}
                                                                onChange={(e) => setCategoryForm({ ...categoryForm, imgSrc: e.target.value })} required
                                                            />
                                                            <div style={{ position: 'relative' }}>
                                                                <button type="button" className="btn btn-secondary">Upload</button>
                                                                <input
                                                                    type="file" onChange={(e) => handleImageUpload(e, (url) => setCategoryForm({ ...categoryForm, imgSrc: url }))}
                                                                    style={{ position: 'absolute', top: 0, left: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <button type="submit" className="btn btn-primary me-2">{categoryForm.id ? 'Update' : 'Create'}</button>
                                                        {categoryForm.id && (
                                                            <button type="button" onClick={() => setCategoryForm({ id: null, title: '', imgSrc: '', status: 'Active' })} className="btn btn-light">Cancel</button>
                                                        )}
                                                    </div>
                                                </div>
                                            </form>

                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Image</th>
                                                        <th>Title</th>
                                                        <th>Status</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {categories.map(cat => (
                                                        <tr key={cat._id}>
                                                            <td><img src={cat.imgSrc} alt="" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} /></td>
                                                            <td style={{ fontWeight: 600 }}>{cat.title}</td>
                                                            <td><span className={`badge ${cat.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>{cat.status || 'Active'}</span></td>
                                                            <td>
                                                                <button onClick={() => setCategoryForm({ id: cat._id, title: cat.title, imgSrc: cat.imgSrc, status: cat.status || 'Active' })} className="btn btn-sm btn-outline-primary me-2"><i className="fa-solid fa-pen" /></button>
                                                                <button onClick={() => handleDeleteCategory(cat._id)} className="btn btn-sm btn-outline-danger"><i className="fa-solid fa-trash" /></button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {/* ======================================================== */}
                                    {/* TOURS & DESTINATIONS TAB */}
                                    {/* ======================================================== */}
                                    {activeTab === 'destination' && (
                                        <div>
                                            <h4 className="border-bottom pb-2 mb-20" style={{ fontWeight: 800 }}>Destinations / Tour Listings</h4>
                                            
                                            <form onSubmit={handleSaveDestination} className="admin-card mb-4" style={{ background: '#f8fafc', boxShadow: 'none' }}>
                                                <h5 style={{ fontWeight: '700', marginBottom: '15px' }}>{destinationForm.id ? 'Edit Tour details' : 'Add New Tour Package'}</h5>
                                                
                                                <div className="row gy-3">
                                                    <div className="col-md-4">
                                                        <label>Tour Name *</label>
                                                        <input type="text" className="form-control" value={destinationForm.name || ''} onChange={(e) => setDestinationForm({ ...destinationForm, name: e.target.value })} required />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label>Category *</label>
                                                        <select className="form-control" value={destinationForm.category || ''} onChange={(e) => setDestinationForm({ ...destinationForm, category: e.target.value })} required>
                                                            <option value="">-- Choose Category --</option>
                                                            {categories.map(c => <option key={c._id} value={c.title}>{c.title}</option>)}
                                                        </select>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label>Location / Region</label>
                                                        <input type="text" className="form-control" value={destinationForm.location || ''} onChange={(e) => setDestinationForm({ ...destinationForm, location: e.target.value })} />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label>Duration (e.g. 3N / 4D) *</label>
                                                        <input type="text" className="form-control" value={destinationForm.duration || ''} onChange={(e) => setDestinationForm({ ...destinationForm, duration: e.target.value })} required />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label>Price (e.g. ₹11,950) *</label>
                                                        <input type="text" className="form-control" value={destinationForm.price || ''} onChange={(e) => setDestinationForm({ ...destinationForm, price: e.target.value })} required />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label>Status</label>
                                                        <select className="form-control" value={destinationForm.status || 'Active'} onChange={(e) => setDestinationForm({ ...destinationForm, status: e.target.value })}>
                                                            <option value="Active">Active</option>
                                                            <option value="Inactive">Inactive</option>
                                                        </select>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <label>Featured Image (Thumbnail)</label>
                                                        <div className="d-flex gap-2">
                                                            <input type="text" className="form-control" value={destinationForm.image || ''} onChange={(e) => setDestinationForm({ ...destinationForm, image: e.target.value })} required />
                                                            <div style={{ position: 'relative' }}>
                                                                <button type="button" className="btn btn-secondary">Upload</button>
                                                                <input type="file" onChange={(e) => handleImageUpload(e, (url) => setDestinationForm({ ...destinationForm, image: url }))} style={{ position: 'absolute', top: 0, left: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label>Banner Image (Details page header)</label>
                                                        <div className="d-flex gap-2">
                                                            <input type="text" className="form-control" value={destinationForm.bannerImg || ''} onChange={(e) => setDestinationForm({ ...destinationForm, bannerImg: e.target.value })} />
                                                            <div style={{ position: 'relative' }}>
                                                                <button type="button" className="btn btn-secondary">Upload</button>
                                                                <input type="file" onChange={(e) => handleImageUpload(e, (url) => setDestinationForm({ ...destinationForm, bannerImg: url }))} style={{ position: 'absolute', top: 0, left: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-12">
                                                        <label>Itinerary (Day plans description)</label>
                                                        <textarea className="form-control" rows="3" placeholder="Day 1: Arrival..., Day 2: sightseeing..." value={destinationForm.itinerary || ''} onChange={(e) => setDestinationForm({ ...destinationForm, itinerary: e.target.value })} />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label>Inclusions</label>
                                                        <textarea className="form-control" rows="3" placeholder="Hotel stay, breakfast, sightseeing cab..." value={destinationForm.inclusions || ''} onChange={(e) => setDestinationForm({ ...destinationForm, inclusions: e.target.value })} />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label>Exclusions</label>
                                                        <textarea className="form-control" rows="3" placeholder="Lunch, flight tickets, personal expenses..." value={destinationForm.exclusions || ''} onChange={(e) => setDestinationForm({ ...destinationForm, exclusions: e.target.value })} />
                                                    </div>
                                                    <div className="col-md-12">
                                                        <label>Terms & Conditions</label>
                                                        <textarea className="form-control" rows="2" value={destinationForm.termsConditions || ''} onChange={(e) => setDestinationForm({ ...destinationForm, termsConditions: e.target.value })} />
                                                    </div>

                                                    <div className="col-12 mt-3">
                                                        <div className="form-check form-switch d-inline-block me-4">
                                                            <input className="form-check-input" type="checkbox" id="featuredTourToggle" checked={destinationForm.featuredTour || false} onChange={(e) => setDestinationForm({ ...destinationForm, featuredTour: e.target.checked })} />
                                                            <label className="form-check-label ms-2" htmlFor="featuredTourToggle">Mark as Featured Tour</label>
                                                        </div>
                                                        <div className="form-check form-switch d-inline-block">
                                                            <input className="form-check-input" type="checkbox" id="isPopularToggle" checked={destinationForm.isPopularTour || false} onChange={(e) => setDestinationForm({ ...destinationForm, isPopularTour: e.target.checked })} />
                                                            <label className="form-check-label ms-2" htmlFor="isPopularToggle">Display on Homepage (Popular section)</label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-12 mt-20 pt-20 border-top">
                                                    <button type="submit" className="btn btn-primary me-2">{destinationForm.id ? 'Save Details' : 'Add Tour Package'}</button>
                                                    {destinationForm.id && (
                                                        <button type="button" onClick={() => setDestinationForm({
                                                            id: null, name: '', listings: 0, image: '', price: '', bannerImg: '', pageTitle: '',
                                                            description1: '', description2: '', basicInfoText: '', visaRequirements: '', language: '', currency: '',
                                                            area: '', tourPlaces: '', quoteText: '', quoteAuthor: '', description3: '', description4: '',
                                                            highlightsTitle: '', highlightsText: '', innerImage: '', highlights: [], gallery: [], isPopularTour: false,
                                                            duration: '3N / 4D', category: '', location: '', itinerary: '', inclusions: '', exclusions: '',
                                                            termsConditions: '', featuredTour: false, status: 'Active'
                                                        })} className="btn btn-light">Cancel</button>
                                                    )}
                                                </div>
                                            </form>

                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Image</th>
                                                        <th>Tour Name</th>
                                                        <th>Category</th>
                                                        <th>Price</th>
                                                        <th>Status</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {destinations.map(d => (
                                                        <tr key={d._id}>
                                                            <td><img src={d.image} alt="" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} /></td>
                                                            <td style={{ fontWeight: 600 }}>{d.name}</td>
                                                            <td>{d.category || 'N/A'}</td>
                                                            <td><span className="badge bg-secondary">{d.price}</span></td>
                                                            <td><span className={`badge ${d.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>{d.status || 'Active'}</span></td>
                                                            <td>
                                                                <button onClick={() => {
                                                                    setDestinationForm({
                                                                        id: d._id, name: d.name, listings: d.listings, image: d.image, price: d.price, duration: d.duration,
                                                                        bannerImg: d.bannerImg, pageTitle: d.pageTitle, description1: d.description1, description2: d.description2,
                                                                        basicInfoText: d.basicInfoText, visaRequirements: d.visaRequirements, language: d.language, currency: d.currency,
                                                                        area: d.area, tourPlaces: d.tourPlaces, quoteText: d.quoteText, quoteAuthor: d.quoteAuthor, description3: d.description3,
                                                                        description4: d.description4, highlightsTitle: d.highlightsTitle, highlightsText: d.highlightsText, innerImage: d.innerImage,
                                                                        highlights: d.highlights || [], gallery: d.gallery || [], isPopularTour: d.isPopularTour || false,
                                                                        category: d.category || '', location: d.location || '', itinerary: d.itinerary || '',
                                                                        inclusions: d.inclusions || '', exclusions: d.exclusions || '', termsConditions: d.termsConditions || '',
                                                                        featuredTour: d.featuredTour || false, status: d.status || 'Active'
                                                                    });
                                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                                }} className="btn btn-sm btn-outline-primary me-2"><i className="fa-solid fa-pen" /></button>
                                                                <button onClick={() => handleDeleteDestination(d._id)} className="btn btn-sm btn-outline-danger"><i className="fa-solid fa-trash" /></button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {/* ======================================================== */}
                                    {/* BOOKINGS TAB */}
                                    {/* ======================================================== */}
                                    {activeTab === 'booking' && (
                                        <div>
                                            <h4 className="border-bottom pb-2 mb-20" style={{ fontWeight: 800 }}>Enquiry Booking Management</h4>
                                            
                                            {/* Booking Filter Buttons */}
                                            <div className="d-flex gap-2 mb-4">
                                                {['all', 'New', 'Contacted', 'Follow Up', 'Confirmed', 'Cancelled'].map(st => (
                                                    <button
                                                        key={st} onClick={() => setBookingStatusFilter(st)}
                                                        className={`btn btn-sm ${bookingStatusFilter === st ? 'btn-primary' : 'btn-outline-secondary'}`}
                                                        style={{ borderRadius: '20px', padding: '6px 16px', fontWeight: '600' }}
                                                    >
                                                        {st}
                                                    </button>
                                                ))}
                                            </div>

                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Booking ID</th>
                                                        <th>Customer Name</th>
                                                        <th>Tour Package</th>
                                                        <th>Travel Date</th>
                                                        <th>Mobile</th>
                                                        <th>Status</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {getFilteredBookings().map(b => (
                                                        <tr key={b._id}>
                                                            <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{b._id.slice(-6).toUpperCase()}</td>
                                                            <td style={{ fontWeight: 600 }}>{b.firstName} {b.lastName}</td>
                                                            <td>{b.tourName}</td>
                                                            <td>{b.travelDate}</td>
                                                            <td>{b.mobile}</td>
                                                            <td>
                                                                <select
                                                                    className="form-control form-control-sm border-0 bg-light"
                                                                    value={b.status || 'New'}
                                                                    onChange={(e) => handleUpdateBookingStatus(b._id, e.target.value)}
                                                                    style={{ width: '120px', fontWeight: '700' }}
                                                                >
                                                                    <option value="New">New</option>
                                                                    <option value="Contacted">Contacted</option>
                                                                    <option value="Follow Up">Follow Up</option>
                                                                    <option value="Confirmed">Confirmed</option>
                                                                    <option value="Cancelled">Cancelled</option>
                                                                </select>
                                                            </td>
                                                            <td>
                                                                <a href={`tel:${b.mobile}`} className="btn btn-sm btn-outline-success me-2" title="Call Customer"><i className="fa-solid fa-phone" /></a>
                                                                <a
                                                                    href={`https://wa.me/${b.mobile.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(b.firstName)},%20this%20is%20Jiyo%20Life%20Travel.%20We%20received%20your%20booking%20enquiry%20for%20${encodeURIComponent(b.tourName)}.%20Let's%20discuss%20your%20travel%20date%20on%20${b.travelDate}.`}
                                                                    target="_blank" rel="noreferrer"
                                                                    className="btn btn-sm btn-success me-2" title="WhatsApp Customer"
                                                                >
                                                                    <i className="fa-brands fa-whatsapp" />
                                                                </a>
                                                                <button onClick={() => handleDeleteBooking(b._id)} className="btn btn-sm btn-outline-danger" title="Delete Booking"><i className="fa-solid fa-trash" /></button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {getFilteredBookings().length === 0 && (
                                                        <tr>
                                                            <td colSpan="7" className="text-center py-4 text-muted">No bookings found for the selected status.</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {/* ======================================================== */}
                                    {/* LEAD MANAGEMENT TAB */}
                                    {/* ======================================================== */}
                                    {activeTab === 'lead' && (
                                        <div>
                                            <h4 className="border-bottom pb-2 mb-20" style={{ fontWeight: 800 }}>Centralized Lead Console</h4>
                                            
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Email</th>
                                                        <th>Mobile</th>
                                                        <th>Lead Source</th>
                                                        <th>Date Captured</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {leads.map(ld => (
                                                        <tr key={ld._id}>
                                                            <td style={{ fontWeight: 600 }}>{ld.name}</td>
                                                            <td>{ld.email || 'N/A'}</td>
                                                            <td>{ld.mobile || 'N/A'}</td>
                                                            <td>
                                                                <span className={`badge ${
                                                                    ld.source === 'Tour Booking Form' ? 'bg-primary' :
                                                                    ld.source === 'Contact Form' ? 'bg-info' :
                                                                    ld.source === 'Newsletter' ? 'bg-secondary' : 'bg-warning'
                                                                }`}>{ld.source}</span>
                                                            </td>
                                                            <td>{new Date(ld.createdAt).toLocaleDateString()}</td>
                                                        </tr>
                                                    ))}
                                                    {leads.length === 0 && (
                                                        <tr>
                                                            <td colSpan="5" className="text-center py-4 text-muted">No leads captured yet.</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {/* ======================================================== */}
                                    {/* PHOTO GALLERY TAB */}
                                    {/* ======================================================== */}
                                    {activeTab === 'gallery' && (
                                        <div>
                                            <h4 className="border-bottom pb-2 mb-20" style={{ fontWeight: 800 }}>Gallery Management</h4>
                                            
                                            <form onSubmit={handleSaveGallery} className="admin-card mb-4" style={{ background: '#f8fafc', boxShadow: 'none' }}>
                                                <h5 style={{ fontWeight: '700', marginBottom: '15px' }}>{galleryForm.id ? 'Edit Image details' : 'Add Photo to Album'}</h5>
                                                <div className="row gy-3">
                                                    <div className="col-md-6">
                                                        <label>Image Caption</label>
                                                        <input type="text" className="form-control" value={galleryForm.caption} onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })} />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <label>Destination Category</label>
                                                        <input type="text" className="form-control" value={galleryForm.destination} onChange={(e) => setGalleryForm({ ...galleryForm, destination: e.target.value })} placeholder="e.g. Kashmir" />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <label>Status</label>
                                                        <select className="form-control" value={galleryForm.status} onChange={(e) => setGalleryForm({ ...galleryForm, status: e.target.value })}>
                                                            <option value="Active">Active</option>
                                                            <option value="Inactive">Inactive</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <label>Photo URL *</label>
                                                        <div className="d-flex gap-2">
                                                            <input type="text" className="form-control" value={galleryForm.imageUrl} onChange={(e) => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })} required />
                                                            <div style={{ position: 'relative' }}>
                                                                <button type="button" className="btn btn-secondary">Upload</button>
                                                                <input type="file" onChange={(e) => handleImageUpload(e, (url) => setGalleryForm({ ...galleryForm, imageUrl: url }))} style={{ position: 'absolute', top: 0, left: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <button type="submit" className="btn btn-primary me-2">{galleryForm.id ? 'Save Changes' : 'Add Photo'}</button>
                                                        {galleryForm.id && (
                                                            <button type="button" onClick={() => setGalleryForm({ id: null, imageUrl: '', title: 'gallery', caption: '', destination: '', status: 'Active' })} className="btn btn-light">Cancel</button>
                                                        )}
                                                    </div>
                                                </div>
                                            </form>

                                            <div className="row g-3">
                                                {gallery.map(p => (
                                                    <div key={p._id} className="col-md-4">
                                                        <div className="card h-100" style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                                                            <img src={p.imageUrl} alt="" style={{ height: '160px', objectFit: 'cover' }} />
                                                            <div className="card-body p-3">
                                                                <h6 style={{ margin: '0 0 5px 0' }}>{p.caption || 'No caption'}</h6>
                                                                <span className="badge bg-light text-dark me-2">{p.destination || 'General'}</span>
                                                                <span className={`badge ${p.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>{p.status || 'Active'}</span>
                                                                <div className="mt-3">
                                                                    <button onClick={() => setGalleryForm({ id: p._id, imageUrl: p.imageUrl, title: p.title, caption: p.caption || '', destination: p.destination || '', status: p.status || 'Active' })} className="btn btn-xs btn-outline-primary me-2"><i className="fa-solid fa-pen" /></button>
                                                                    <button onClick={() => handleDeleteGallery(p._id)} className="btn btn-xs btn-outline-danger"><i className="fa-solid fa-trash" /></button>
                                                                </div>
                                                            </div>
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
                                            
                                            <form onSubmit={handleAddBlog} className="admin-card mb-4" style={{ background: '#f8fafc', boxShadow: 'none' }}>
                                                <h5 style={{ fontWeight: '700', marginBottom: '15px' }}>{blogForm.id ? 'Edit Blog details' : 'Create New Blog'}</h5>
                                                
                                                <div className="row gy-3">
                                                    <div className="col-md-4">
                                                        <label>Blog Title *</label>
                                                        <input type="text" className="form-control" value={blogForm.title || ''} onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })} required />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label>Slug (URL) *</label>
                                                        <input type="text" className="form-control" value={blogForm.slug || ''} onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })} placeholder="e.g. kashmir-tour-guide" required />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label>Blog Category</label>
                                                        <input type="text" className="form-control" value={blogForm.category || ''} onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })} />
                                                    </div>
                                                    
                                                    <div className="col-md-6">
                                                        <label>Meta Title (SEO)</label>
                                                        <input type="text" className="form-control" value={blogForm.metaTitle || ''} onChange={(e) => setBlogForm({ ...blogForm, metaTitle: e.target.value })} />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label>Meta Description (SEO)</label>
                                                        <input type="text" className="form-control" value={blogForm.metaDescription || ''} onChange={(e) => setBlogForm({ ...blogForm, metaDescription: e.target.value })} />
                                                    </div>

                                                    <div className="col-md-6">
                                                        <label>Publish Date *</label>
                                                        <input type="text" className="form-control" value={blogForm.date || ''} onChange={(e) => setBlogForm({ ...blogForm, date: e.target.value })} placeholder="e.g. 15 Jul 2026" required />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label>Featured Image</label>
                                                        <div className="d-flex gap-2">
                                                            <input type="text" className="form-control" value={blogForm.image || ''} onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })} required />
                                                            <div style={{ position: 'relative' }}>
                                                                <button type="button" className="btn btn-secondary">Upload</button>
                                                                <input type="file" onChange={(e) => handleImageUpload(e, (url) => setBlogForm({ ...blogForm, image: url }))} style={{ position: 'absolute', top: 0, left: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-12">
                                                        <label>Short Description (Landing page)</label>
                                                        <textarea className="form-control" rows="2" value={blogForm.shortDescription || ''} onChange={(e) => setBlogForm({ ...blogForm, shortDescription: e.target.value })} required />
                                                    </div>
                                                    <div className="col-md-12">
                                                        <label>Blog Content (HTML or plain text)</label>
                                                        <textarea className="form-control" rows="6" value={blogForm.content1 || ''} onChange={(e) => setBlogForm({ ...blogForm, content1: e.target.value })} required />
                                                    </div>
                                                </div>

                                                <div className="col-12 mt-20 pt-20 border-top">
                                                    <button type="submit" className="btn btn-primary me-2">{blogForm.id ? 'Update Blog' : 'Publish Blog'}</button>
                                                    {blogForm.id && (
                                                        <button type="button" onClick={() => setBlogForm({
                                                            id: null, title: '', category: 'Tour Guide', author: 'Admin', date: '', image: '', bannerImg: '',
                                                            shortDescription: '', content1: '', quoteText: '', quoteAuthor: '', content2: '', innerImage: '', tags: [],
                                                            slug: '', metaTitle: '', metaDescription: ''
                                                        })} className="btn btn-light">Cancel</button>
                                                    )}
                                                </div>
                                            </form>

                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Image</th>
                                                        <th>Title</th>
                                                        <th>Category</th>
                                                        <th>Slug</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {blogs.map(b => (
                                                        <tr key={b._id}>
                                                            <td><img src={b.image} alt="" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} /></td>
                                                            <td style={{ fontWeight: 600 }}>{b.title}</td>
                                                            <td>{b.category}</td>
                                                            <td><code>/{b.slug || b._id}</code></td>
                                                            <td>
                                                                <button onClick={() => {
                                                                    setBlogForm({
                                                                        id: b._id, title: b.title, category: b.category, author: b.author, date: b.date, image: b.image,
                                                                        bannerImg: b.bannerImg, shortDescription: b.shortDescription, content1: b.content1, quoteText: b.quoteText,
                                                                        quoteAuthor: b.quoteAuthor, content2: b.content2, innerImage: b.innerImage, tags: b.tags || [],
                                                                        slug: b.slug || '', metaTitle: b.metaTitle || '', metaDescription: b.metaDescription || ''
                                                                    });
                                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                                }} className="btn btn-sm btn-outline-primary me-2"><i className="fa-solid fa-pen" /></button>
                                                                <button onClick={() => handleDeleteBlog(b._id)} className="btn btn-sm btn-outline-danger"><i className="fa-solid fa-trash" /></button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {/* ======================================================== */}
                                    {/* REVIEWS TAB */}
                                    {/* ======================================================== */}
                                    {activeTab === 'review' && (
                                        <div>
                                            <h4 className="border-bottom pb-2 mb-20" style={{ fontWeight: 800 }}>Customer Reviews</h4>
                                            
                                            {/* Add/Edit Review Form */}
                                            <form onSubmit={handleSaveReview} className="admin-card mb-4" style={{ background: '#f8fafc', boxShadow: 'none' }}>
                                                <h5 style={{ fontWeight: '700', marginBottom: '15px' }}>{reviewForm.id ? 'Edit Review' : 'Add New Review'}</h5>
                                                
                                                <div className="row gy-3">
                                                    <div className="col-md-4">
                                                        <label>Customer Name *</label>
                                                        <input type="text" className="form-control" value={reviewForm.name || ''} onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })} required />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label>Customer Email *</label>
                                                        <input type="email" className="form-control" value={reviewForm.email || ''} onChange={(e) => setReviewForm({ ...reviewForm, email: e.target.value })} required />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label>Customer City</label>
                                                        <input type="text" className="form-control" value={reviewForm.city || ''} onChange={(e) => setReviewForm({ ...reviewForm, city: e.target.value })} />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label>Rating (1 - 5 stars) *</label>
                                                        <select className="form-control" value={reviewForm.rating || 5} onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })} required>
                                                            <option value="5">5 Stars</option>
                                                            <option value="4">4 Stars</option>
                                                            <option value="3">3 Stars</option>
                                                            <option value="2">2 Stars</option>
                                                            <option value="1">1 Star</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label>Associated Tour / Destination</label>
                                                        <select className="form-control" value={reviewForm.destinationId || 'global'} onChange={(e) => setReviewForm({ ...reviewForm, destinationId: e.target.value })}>
                                                            <option value="global">Global / General</option>
                                                            {destinations.map(d => (
                                                                <option key={d._id} value={d._id}>{d.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label>Status</label>
                                                        <select className="form-control" value={reviewForm.status || 'Active'} onChange={(e) => setReviewForm({ ...reviewForm, status: e.target.value })}>
                                                            <option value="Active">Active</option>
                                                            <option value="Inactive">Inactive</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <label>Review Comment *</label>
                                                        <textarea className="form-control" rows="3" value={reviewForm.comment || ''} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} required />
                                                    </div>
                                                </div>

                                                <div className="col-12 mt-20 pt-20 border-top">
                                                    <button type="submit" className="btn btn-primary me-2">{reviewForm.id ? 'Save Changes' : 'Add Review'}</button>
                                                    {reviewForm.id && (
                                                        <button type="button" onClick={() => setReviewForm({ id: null, name: '', email: '', city: '', rating: 5, comment: '', status: 'Active', destinationId: 'global' })} className="btn btn-light">Cancel</button>
                                                    )}
                                                </div>
                                            </form>

                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>City</th>
                                                        <th>Rating</th>
                                                        <th>Comment</th>
                                                        <th>Status</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {reviews.map(r => (
                                                        <tr key={r._id}>
                                                            <td style={{ fontWeight: 600 }}>{r.name}</td>
                                                            <td>{r.city || 'N/A'}</td>
                                                            <td><span style={{ color: '#f59e0b', fontWeight: 'bold' }}><i className="fa-solid fa-star me-1" />{r.rating || 5}</span></td>
                                                            <td><span style={{ fontSize: '13px', display: 'block', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.comment}</span></td>
                                                            <td>
                                                                <select
                                                                    className="form-control form-control-sm bg-light"
                                                                    value={r.status || 'Active'}
                                                                    onChange={(e) => handleUpdateReviewStatus(r._id, e.target.value)}
                                                                    style={{ width: '100px', fontWeight: 'bold' }}
                                                                >
                                                                    <option value="Active">Active</option>
                                                                    <option value="Inactive">Inactive</option>
                                                                </select>
                                                            </td>
                                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                                <button onClick={() => setSelectedReviewForView(r)} className="btn btn-sm btn-outline-info me-2" title="View Review Details"><i className="fa-solid fa-eye" /></button>
                                                                <button onClick={() => {
                                                                    setReviewForm({
                                                                        id: r._id,
                                                                        name: r.name,
                                                                        email: r.email || '',
                                                                        city: r.city || '',
                                                                        rating: r.rating || 5,
                                                                        comment: r.comment,
                                                                        status: r.status || 'Active',
                                                                        destinationId: r.destinationId || 'global'
                                                                    });
                                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                                }} className="btn btn-sm btn-outline-primary me-2" title="Edit Review"><i className="fa-solid fa-pen" /></button>
                                                                <button onClick={() => handleDeleteReview(r._id)} className="btn btn-sm btn-outline-danger" title="Delete Review"><i className="fa-solid fa-trash" /></button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {reviews.length === 0 && (
                                                        <tr>
                                                            <td colSpan="6" className="text-center py-4 text-muted">No reviews submitted yet.</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {/* ======================================================== */}
                                    {/* CONTACT ENQUIRIES TAB */}
                                    {/* ======================================================== */}
                                    {activeTab === 'contact' && (
                                        <div>
                                            <h4 className="border-bottom pb-2 mb-20" style={{ fontWeight: 800 }}>Website Contact Enquiries</h4>
                                            
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Mobile</th>
                                                        <th>Email</th>
                                                        <th>Subject</th>
                                                        <th>Message</th>
                                                        <th>Status</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {contacts.map(c => (
                                                        <tr key={c._id}>
                                                            <td style={{ fontWeight: 600 }}>{c.name}</td>
                                                            <td>{c.mobile}</td>
                                                            <td>{c.email}</td>
                                                            <td><strong>{c.subject || 'N/A'}</strong></td>
                                                            <td><span style={{ fontSize: '13px', display: 'block', maxWidth: '300px', overflowWrap: 'break-word' }}>{c.message}</span></td>
                                                            <td>
                                                                <select
                                                                    className="form-control form-control-sm bg-light"
                                                                    value={c.status || 'New'}
                                                                    onChange={(e) => handleUpdateContactStatus(c._id, e.target.value)}
                                                                    style={{ width: '120px', fontWeight: 'bold' }}
                                                                >
                                                                    <option value="New">New</option>
                                                                    <option value="Contacted">Contacted</option>
                                                                    <option value="Closed">Closed</option>
                                                                </select>
                                                            </td>
                                                            <td>
                                                                <button onClick={() => handleDeleteContact(c._id)} className="btn btn-sm btn-outline-danger"><i className="fa-solid fa-trash" /></button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {contacts.length === 0 && (
                                                        <tr>
                                                            <td colSpan="7" className="text-center py-4 text-muted">No contact enquiries received.</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {/* ======================================================== */}
                                    {/* NEWSLETTER SUBSCRIBERS TAB */}
                                    {/* ======================================================== */}
                                    {activeTab === 'newsletter' && (
                                        <div>
                                            <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-20">
                                                <h4 style={{ fontWeight: 800, margin: 0 }}>Newsletter Subscribers</h4>
                                                <button onClick={exportNewsletterCSV} className="btn btn-sm btn-success">
                                                    <i className="fa-solid fa-file-excel me-2" /> Export to CSV
                                                </button>
                                            </div>

                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Email Address</th>
                                                        <th>Date Subscribed</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {newsletters.map(n => (
                                                        <tr key={n._id}>
                                                            <td style={{ fontWeight: 600 }}>{n.email}</td>
                                                            <td>{new Date(n.subscribeDate || n.createdAt).toLocaleString()}</td>
                                                            <td>
                                                                <button onClick={() => handleDeleteNewsletter(n._id)} className="btn btn-sm btn-outline-danger"><i className="fa-solid fa-trash" /></button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {newsletters.length === 0 && (
                                                        <tr>
                                                            <td colSpan="3" className="text-center py-4 text-muted">No subscribers registered yet.</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {/* ======================================================== */}
                                    {/* WEBSITE SETTINGS TAB */}
                                    {/* ======================================================== */}
                                    {activeTab === 'settings' && (
                                        <div>
                                            <h4 className="border-bottom pb-2 mb-20" style={{ fontWeight: 800 }}>Website Global Settings</h4>
                                            
                                            <form onSubmit={handleSaveSettings} className="row gy-3">
                                                <div className="col-12"><h5 className="text-primary mt-2">1. Company Details</h5></div>
                                                <div className="col-md-6">
                                                    <label>Company Name</label>
                                                    <input type="text" className="form-control" value={settingsForm.companyName || ''} onChange={(e) => setSettingsForm({ ...settingsForm, companyName: e.target.value })} required />
                                                </div>
                                                <div className="col-md-6">
                                                    <label>WhatsApp Contact Number</label>
                                                    <input type="text" className="form-control" value={settingsForm.whatsappNumber || ''} onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })} />
                                                </div>
                                                <div className="col-md-6">
                                                    <label>Office Telephone</label>
                                                    <input type="text" className="form-control" value={settingsForm.phone || ''} onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })} />
                                                </div>
                                                <div className="col-md-6">
                                                    <label>Contact Email</label>
                                                    <input type="email" className="form-control" value={settingsForm.email || ''} onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })} />
                                                </div>
                                                <div className="col-md-12">
                                                    <label>Postal Address</label>
                                                    <textarea className="form-control" rows="2" value={settingsForm.address || ''} onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })} />
                                                </div>

                                                <div className="col-12"><h5 className="text-primary mt-4">2. Social Media Links</h5></div>
                                                <div className="col-md-6">
                                                    <label>Facebook URL</label>
                                                    <input type="text" className="form-control" value={settingsForm.facebookUrl || ''} onChange={(e) => setSettingsForm({ ...settingsForm, facebookUrl: e.target.value })} />
                                                </div>
                                                <div className="col-md-6">
                                                    <label>Instagram URL</label>
                                                    <input type="text" className="form-control" value={settingsForm.instagramUrl || ''} onChange={(e) => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })} />
                                                </div>
                                                <div className="col-md-6">
                                                    <label>YouTube URL</label>
                                                    <input type="text" className="form-control" value={settingsForm.youtubeUrl || ''} onChange={(e) => setSettingsForm({ ...settingsForm, youtubeUrl: e.target.value })} />
                                                </div>
                                                <div className="col-md-6">
                                                    <label>LinkedIn URL</label>
                                                    <input type="text" className="form-control" value={settingsForm.linkedinUrl || ''} onChange={(e) => setSettingsForm({ ...settingsForm, linkedinUrl: e.target.value })} />
                                                </div>

                                                <div className="col-12"><h5 className="text-primary mt-4">3. Global SEO & Analytics</h5></div>
                                                <div className="col-md-12">
                                                    <label>Global Meta Title</label>
                                                    <input type="text" className="form-control" value={settingsForm.metaTitle || ''} onChange={(e) => setSettingsForm({ ...settingsForm, metaTitle: e.target.value })} />
                                                </div>
                                                <div className="col-md-12">
                                                    <label>Global Meta Description</label>
                                                    <textarea className="form-control" rows="2" value={settingsForm.metaDescription || ''} onChange={(e) => setSettingsForm({ ...settingsForm, metaDescription: e.target.value })} />
                                                </div>
                                                <div className="col-md-12">
                                                    <label>Google Analytics Pixel Tracking Code</label>
                                                    <input type="text" className="form-control" value={settingsForm.googleAnalyticsCode || ''} onChange={(e) => setSettingsForm({ ...settingsForm, googleAnalyticsCode: e.target.value })} placeholder="e.g. UA-XXXXX-Y" />
                                                </div>

                                                <div className="col-12 mt-4">
                                                    <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px', fontWeight: '700' }}>
                                                        <i className="fa-solid fa-floppy-disk me-2" /> Save Global Configuration
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}

                                    {/* ======================================================== */}
                                    {/* ADMIN USERS TAB */}
                                    {/* ======================================================== */}
                                    {activeTab === 'admins' && (
                                        <div>
                                            <h4 className="border-bottom pb-2 mb-20" style={{ fontWeight: 800 }}>Admin Profiles Directory</h4>
                                            
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Email Profile</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {adminUsers.map(usr => (
                                                        <tr key={usr._id}>
                                                            <td style={{ fontWeight: 600 }}>{usr.email}</td>
                                                            <td><span className="badge bg-success">Verified Admin</span></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Details View Modal */}
            {selectedReviewForView && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(15, 23, 42, 0.6)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    padding: '20px'
                }}>
                    <div className="admin-card" style={{ maxWidth: '600px', width: '100%', padding: '30px', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', background: '#ffffff' }}>
                        <button 
                            onClick={() => setSelectedReviewForView(null)} 
                            style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                background: 'transparent',
                                border: 'none',
                                fontSize: '20px',
                                color: '#64748b',
                                cursor: 'pointer'
                            }}
                        >
                            <i className="fa-solid fa-xmark" />
                        </button>
                        
                        <h4 style={{ fontWeight: 800, color: '#1e293b', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                            <i className="fa-solid fa-star text-warning me-2" />
                            Review Details
                        </h4>
                        
                        <div className="row gy-3">
                            <div className="col-md-6">
                                <label style={{ display: 'block', margin: 0, color: '#64748b', fontSize: '11px' }}>Customer Name</label>
                                <span style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b' }}>{selectedReviewForView.name}</span>
                            </div>
                            <div className="col-md-6">
                                <label style={{ display: 'block', margin: 0, color: '#64748b', fontSize: '11px' }}>Customer Email</label>
                                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>{selectedReviewForView.email || 'N/A'}</span>
                            </div>
                            <div className="col-md-6">
                                <label style={{ display: 'block', margin: 0, color: '#64748b', fontSize: '11px' }}>City</label>
                                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>{selectedReviewForView.city || 'N/A'}</span>
                            </div>
                            <div className="col-md-6">
                                <label style={{ display: 'block', margin: 0, color: '#64748b', fontSize: '11px' }}>Rating</label>
                                <span style={{ color: '#f59e0b', fontWeight: '800', fontSize: '16px' }}>
                                    {Array.from({ length: selectedReviewForView.rating || 5 }).map((_, idx) => (
                                        <i key={idx} className="fa-solid fa-star me-1" />
                                    ))}
                                    {` (${selectedReviewForView.rating || 5}/5)`}
                                </span>
                            </div>
                            <div className="col-md-6">
                                <label style={{ display: 'block', margin: 0, color: '#64748b', fontSize: '11px' }}>Associated Tour</label>
                                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>
                                    {selectedReviewForView.destinationId === 'global' ? 'Global / General' : (
                                        destinations.find(d => d._id === selectedReviewForView.destinationId)?.name || 'Unknown Tour'
                                    )}
                                </span>
                            </div>
                            <div className="col-md-6">
                                <label style={{ display: 'block', margin: 0, color: '#64748b', fontSize: '11px' }}>Status</label>
                                <span className={`badge ${selectedReviewForView.status === 'Active' ? 'bg-success' : 'bg-secondary'}`} style={{ fontSize: '12px' }}>
                                    {selectedReviewForView.status || 'Active'}
                                </span>
                            </div>
                            <div className="col-12 mt-2">
                                <label style={{ display: 'block', margin: 0, color: '#64748b', fontSize: '11px' }}>Review Comment</label>
                                <div style={{ 
                                    background: '#f8fafc', 
                                    border: '1px solid #e2e8f0', 
                                    borderRadius: '8px', 
                                    padding: '16px', 
                                    fontSize: '14px', 
                                    lineHeight: '1.6', 
                                    color: '#334155',
                                    whiteSpace: 'pre-wrap',
                                    marginTop: '6px'
                                }}>
                                    {selectedReviewForView.comment}
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-4 text-end">
                            <button 
                                onClick={() => setSelectedReviewForView(null)} 
                                className="btn btn-primary" 
                                style={{ padding: '10px 24px', fontWeight: '700', borderRadius: '8px' }}
                            >
                                Close View
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
