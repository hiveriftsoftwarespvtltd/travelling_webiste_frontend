import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BlogPost from './BlogPost';


function BlogInner() {
    
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState('');
    
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/blog`);
                setPosts(res.data);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            }
        };
        fetchBlogs();
    }, []);

    const postsPerPage = 5;

    const filteredPosts = selectedCategory ? posts.filter(post => post.category === selectedCategory) : posts;
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    
    const categoryCounts = posts.reduce((acc, post) => {
        const cat = post.category || 'Uncategorized';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {});
    const uniqueCategories = Object.keys(categoryCounts);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <section className="th-blog-wrapper space-top space-extra-bottom">
            <div className="container">
                <div className="row">
                    <div className="col-xxl-8 col-lg-7">
                        {currentPosts.map((data) => (
                            <BlogPost key={data._id} blog={data} />
                        ))}
                        <div className="th-pagination">
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
                                    <li onClick={() => { setSelectedCategory(''); setCurrentPage(1); }} style={{ cursor: 'pointer' }}>
                                        <Link to="#" className={!selectedCategory ? 'active-category' : ''} style={{ color: !selectedCategory ? 'var(--theme-color)' : '' }}>
                                            <img src="/assets/img/theme-img/map.svg" alt="" />
                                            All Categories
                                        </Link>
                                        <span>({posts.length})</span>
                                    </li>
                                    {uniqueCategories.map(cat => (
                                        <li key={cat} onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }} style={{ cursor: 'pointer' }}>
                                            <Link to="#" className={selectedCategory === cat ? 'active-category' : ''} style={{ color: selectedCategory === cat ? 'var(--theme-color)' : '' }}>
                                                <img src="/assets/img/theme-img/map.svg" alt="" />
                                                {cat}
                                            </Link>
                                            <span>({categoryCounts[cat]})</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="widget  ">
                                <h3 className="widget_title">Recent Posts</h3>
                                <div className="recent-post-wrap">
                                    {(posts || []).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3).map(blog => (
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
                        </aside>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default BlogInner;
