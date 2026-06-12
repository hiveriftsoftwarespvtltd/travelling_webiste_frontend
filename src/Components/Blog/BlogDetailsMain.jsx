import { ArrowRight } from 'lucide-react';
﻿import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import NeedHelpWidget from '../Widgets/NeedHelpWidget';


function BlogDetailsMain() {
    
    const { id } = useParams();
    const [blogPost, setBlogPost] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/blog`).then(res => setBlogs(res.data)).catch(err => console.error(err));

        const fetchBlog = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/blog/${id}`);
                setBlogPost(res.data);
            } catch (error) {
                console.error("Error fetching blog:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [id]);

    if (loading) return <div className="text-center py-5"><h2>Loading...</h2></div>;
    if (!blogPost) return <div className="text-center py-5"><h2>Blog Not Found</h2><Link to="/blog" className="th-btn mt-3">Back to Blogs</Link></div>;

    
    const categoryCounts = (blogs || []).reduce((acc, post) => {
        const cat = post.category || 'Uncategorized';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {});
    const uniqueCategories = Object.keys(categoryCounts);

    return (
        <section className="th-blog-wrapper blog-details space-top space-extra-bottom">
            <div className="container shape-mockup-wrap">
                <div className="row">
                    <div className="col-xxl-8 col-lg-7">
                        
                        <div className="th-blog blog-single">
                            {blogPost.bannerImg && (
                                <div className="blog-img">
                                    <img src={blogPost.bannerImg} alt="Blog Banner" style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }} />
                                </div>
                            )}
                            <div className="blog-content">
                                <div className="blog-meta">
                                    <Link className="author" to="/blog">
                                        <i className="fa-light fa-user" />
                                        by {blogPost.author || 'Admin'}
                                    </Link>
                                    <Link to="/blog">
                                        <i className="fa-regular fa-calendar" />
                                        {blogPost.date}
                                    </Link>
                                    <Link to="#">
                                        <img src="/assets/img/icon/map.svg" alt="" />
                                        {blogPost.category}
                                    </Link>
                                </div>
                                <h2 className="blog-title">
                                    {blogPost.title}
                                </h2>
                                <p className="blog-text mb-30">
                                    {blogPost.shortDescription}
                                </p>
                                <p className="blog-text mb-30">
                                    {blogPost.content1}
                                </p>
                                
                                {blogPost.quoteText && (
                                    <blockquote>
                                        <p>{blogPost.quoteText}</p>
                                        {blogPost.quoteAuthor && <cite>{blogPost.quoteAuthor}</cite>}
                                    </blockquote>
                                )}
                                
                                {blogPost.content2 && (
                                    <p className="blog-text mt-5 mb-4">
                                        {blogPost.content2}
                                    </p>
                                )}
                                
                                {blogPost.innerImage && (
                                    <div className="row gy-4 mb-4">
                                        <div className="col-12">
                                            <div className="blog-img">
                                                <img className="w-100" src={blogPost.innerImage} alt="Inner Blog Image" style={{ borderRadius: '12px' }} />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="share-links clearfix ">
                                    <div className="row justify-content-between">
                                        <div className="col-md-auto">
                                            <span className="share-links-title">Tags:</span>
                                            <div className="tagcloud">
                                                {blogPost.tags && blogPost.tags.map((tag, i) => (
                                                    <Link key={i} to="/blog">{tag}</Link>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="col-md-auto text-xl-end">
                                            <div className="share-links_wrapp">
                                                <span className="share-links-title">Share:</span>
                                                <div className="social-links">
                                                    <Link to="#"><i className="fab fa-facebook-f" /></Link>
                                                    <Link to="#"><i className="fab fa-twitter" /></Link>
                                                    <Link to="#"><i className="fab fa-instagram" /></Link>
                                                    <Link to="#"><i className="fab fa-linkedin-in" /></Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="th-comments-wrap ">
                            <h2 className="blog-inner-title h4"> Comments (03)</h2>
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
                                            <span className="commented-on">20Jun, 2024 08:56pm</span>
                                            <p className="text">
                                                Credibly pontificate transparent quality vectors with
                                                quality mindshare. Efficiently architect worldwide strategic
                                                theme areas after user.
                                            </p>
                                            <div className="reply_and_edit">
                                                <Link to="#" className="reply-btn">
                                                    <i className="fas fa-reply" />
                                                    Reply
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <ul className="children">
                                        <li className="th-comment-item">
                                            <div className="th-post-comment">
                                                <div className="comment-avater">
                                                    <img
                                                        src="/assets/img/blog/comment-author-2.jpg"
                                                        alt="Comment Author"
                                                    />
                                                </div>
                                                <div className="comment-content">
                                                    <div className="">
                                                        <h3 className="name">Jhon Abraham</h3>
                                                        <span className="commented-on">
                                                            25Jun, 2024 08:56pm
                                                        </span>
                                                    </div>
                                                    <p className="text">
                                                        It is different from airport transfer or port transfer,
                                                        which are services that pick you up
                                                    </p>
                                                    <div className="reply_and_edit">
                                                        <Link to="#" className="reply-btn">
                                                            <i className="fas fa-reply" />
                                                            Reply
                                                        </Link>
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
                                                src="/assets/img/blog/comment-author-3.jpg"
                                                alt="Comment Author"
                                            />
                                        </div>
                                        <div className="comment-content">
                                            <div className="">
                                                <h3 className="name">Anadi Juila</h3>
                                                <span className="commented-on">27Jun, 2024 08:56pm</span>
                                            </div>
                                            <p className="text">
                                                Credibly pontificate transparent quality vectors with
                                                quality mindshare. Efficiently architect worldwide strategic
                                                theme areas after user.
                                            </p>
                                            <div className="reply_and_edit">
                                                <Link to="#" className="reply-btn">
                                                    <i className="fas fa-reply" />
                                                    Reply
                                                </Link>
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
                                <form action="#">
                                    <div className="row">
                                        <div className="col-md-6 form-group">
                                            <input
                                                type="text"
                                                placeholder="Full Name*"
                                                className="form-control"
                                                required
                                            />
                                            <i className="far fa-user" />
                                        </div>
                                        <div className="col-md-6 form-group">
                                            <input
                                                type="text"
                                                placeholder="Your Email*"
                                                className="form-control"
                                                required
                                            />
                                            <i className="far fa-envelope" />
                                        </div>
                                        <div className="col-12 form-group">
                                            <input
                                                type="text"
                                                placeholder="Website"
                                                className="form-control"
                                                required
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
                                            <button className="th-btn" type="submit">
                                                Send Message
                                                <img src="/assets/img/icon/plane2.svg" alt="" />
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-4 col-lg-5">
                        <aside className="sidebar-area">
                            <div className="widget widget_search  ">
                                <form className="search-form">
                                    <input type="text" placeholder="Search" required />
                                    <button type="submit">
                                        <i className="far fa-search" />
                                    </button>
                                </form>
                            </div>
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
                <div
                    className="shape-mockup shape1 d-none d-xxl-block"
                    style={{ bottom: "5%", right: "-8%" }}
                >
                    <img src="/assets/img/shape/shape_1.png" alt="shape" />
                </div>
                <div
                    className="shape-mockup shape2 d-none d-xl-block"
                    style={{ bottom: "1%", right: "-7%" }}
                >
                    <img src="/assets/img/shape/shape_2.png" alt="shape" />
                </div>
                <div
                    className="shape-mockup shape3 d-none d-xxl-block"
                    style={{ bottom: "2%", right: "0%" }}
                >
                    <img src="/assets/img/shape/shape_3.png" alt="shape" />
                </div>
            </div>
        </section>

    )
}

export default BlogDetailsMain

