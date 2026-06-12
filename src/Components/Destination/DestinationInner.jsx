import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom'
import DestinationCard from './DestinationCard';
import DestinationCardTwo from './DestinationCardTwo';
import NeedHelpWidget from '../Widgets/NeedHelpWidget';

function DestinationInner() {
    const [activeTab, setActiveTab] = useState('tab-grid');
    const [blogs, setBlogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const postsPerPage = 9;

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/blog`).then(res => setBlogs(res.data)).catch(err => console.error(err));

        fetch(`${process.env.REACT_APP_API_BASE_URL}/destinations`)
            .then(res => res.json())
            .then(data => {
                setPosts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch destinations:", err);
                setLoading(false);
            });
    }, []);

    const totalPages = Math.ceil(posts.length / postsPerPage);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const handlePageChange = (page) => {
        setCurrentPage(page);
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
                <div className="th-sort-bar">
                    <div className="row justify-content-between align-items-center">
                        <div className="col-md-4">
                            <div className="search-form-area">
                                <form className="search-form">
                                    <input type="text" placeholder="Search" />
                                    <button type="submit">
                                        <i className="fa-light fa-magnifying-glass" />
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div className="col-md-auto">
                            <div className="sorting-filter-wrap">
                                <div className="nav" role="tablist">
                                    <Link
                                        to="#"
                                        id="tab-destination-grid"
                                        data-bs-toggle="tab"
                                        data-bs-target="#tab-grid"
                                        role="tab"
                                        aria-controls="tab-grid"
                                        aria-selected="true"
                                        className={`${activeTab === 'tab-grid' ? 'active' : ''}`}
                                        type="button"
                                        onClick={() => setActiveTab('tab-grid')}
                                    >
                                        <i className="fa-light fa-grid-2" />
                                    </Link>
                                    <Link
                                        to="#"
                                        id="tab-destination-list"
                                        data-bs-toggle="tab"
                                        data-bs-target="#tab-list"
                                        role="tab"
                                        aria-controls="tab-list"
                                        aria-selected="false"
                                        className={`${activeTab === 'tab-list' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('tab-list')}
                                    >
                                        <i className="fa-solid fa-list" />
                                    </Link>
                                </div>
                                <form className="woocommerce-ordering" method="get">
                                    <select
                                        name="orderby"
                                        className="orderby"
                                        aria-label="destination order"
                                    >
                                        <option value="menu_order" >
                                            Default Sorting
                                        </option>
                                        <option value="popularity">Sort by popularity</option>
                                        <option value="rating">Sort by average rating</option>
                                        <option value="date">Sort by latest</option>
                                        <option value="price">Sort by price: low to high</option>
                                        <option value="price-desc">Sort by price: high to low</option>
                                    </select>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xxl-9 col-lg-8">
                        <div className="tab-content" id="nav-tabContent">
                            <div className={`tab-pane fade ${activeTab === 'tab-grid' ? 'show active' : ''}`} id="tab-grid" role="tabpanel"
                            >
                                <div className="row gy-30">
                                    {currentPosts.map((data, index) => (
                                        <div key={index} className="col-xxl-4 col-xl-6">
                                            <DestinationCard
                                                destinationID={data._id}
                                                destinationImage={`${data.image}`}
                                                destinationTitle={data.name}
                                                destinationPrice={data.price}
                                                destinationDuration={data.duration}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={`tab-pane fade ${activeTab === 'tab-list' ? 'show active' : ''}`} id="tab-list" role="tabpanel"
                            >
                                <div className="row gy-30">
                                    {currentPosts.map((data, index) => (
                                        <div key={index} className="col-12">
                                            <DestinationCardTwo
                                                destinationID={data._id}
                                                destinationImage={`${data.image}`}
                                                destinationTitle={data.name}
                                                destinationPrice={data.price}
                                                destinationDuration={data.duration}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="th-pagination text-center mt-60 mb-0">
                            <ul>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <li key={i}>
                                        <Link
                                            className={currentPage === i + 1 ? 'active' : ''}
                                            to="#"
                                            onClick={() => handlePageChange(i + 1)}
                                        >
                                            {i + 1}
                                        </Link>
                                    </li>
                                ))}
                                {currentPage < totalPages && (
                                    <li>
                                        <Link className="next-page" to="#" onClick={() => handlePageChange(currentPage + 1)}>
                                            Next <img src="/assets/img/icon/arrow-right4.svg" alt="" />
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                    <div className="col-xxl-3 col-lg-4">
                        <aside className="sidebar-area style2">
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
                            <div className="widget  ">
                                <h3 className="widget_title">Recent Posts</h3>
                                <div className="recent-post-wrap">
                                    {(blogs || []).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3).map(blog => (
                                        <div className="recent-post" key={blog._id}>
                                            <div className="media-img">
                                                <Link to={`/blog/${blog._id}`}>
                                                    <img src={blog.image || "/assets/img/normal/about_3_1.jpg"} alt="Blog Image" />
                                                </Link>
                                            </div>
                                            <div className="media-body">
                                                <h4 className="post-title">
                                                    <Link className="text-inherit" to={`/blog/${blog._id}`}>
                                                        {blog.title}
                                                    </Link>
                                                </h4>
                                                <div className="recent-post-meta">
                                                    <Link to={`/blog/${blog._id}`}>
                                                        <i className="fa-regular fa-calendar" />
                                                        {blog.date || new Date(blog.createdAt).toLocaleDateString()}
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
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
            </div>
        </section>

    )
}

export default DestinationInner
