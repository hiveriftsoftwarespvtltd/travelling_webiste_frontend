import React from "react";
import { Link } from "react-router-dom";

function BlogPost({ blog }) {
    if (!blog) return null;
    return (
        <div className="th-blog blog-single has-post-thumbnail">
            {blog.image && (
                <div className="blog-img">
                    <Link to={`/blog/${blog._id}`}>
                        <img src={blog.image} alt="Blog" style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />
                    </Link>
                </div>
            )}
            <div className="blog-content">
                <div className="blog-meta">
                    <Link className="author" to="/blog">
                        <i className="fa-light fa-user" />
                        by {blog.author || 'Admin'}
                    </Link>
                    <Link to="/blog">
                        <i className="fa-solid fa-calendar-days" />
                        {blog.date}
                    </Link>
                    <Link to={`/blog/${blog._id}`}>
                        <img src="/assets/img/icon/map.svg" alt="" />
                        {blog.category}
                    </Link>
                </div>
                <h2 className="blog-title">
                    <Link to={`/blog/${blog._id}`}>
                        {blog.title}
                    </Link>
                </h2>
                <p className="blog-text" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 5,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    {blog.shortDescription || blog.content1}
                </p>
                <Link to={`/blog/${blog._id}`} className="th-btn style4 mt-3">Read More <i className="fa-solid fa-arrow-right ms-2" /></Link>
            </div>
        </div>
    );
}
export default BlogPost;
