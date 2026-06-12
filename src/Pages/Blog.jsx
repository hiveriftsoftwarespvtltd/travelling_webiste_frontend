import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import BlogInner from '../Components/Blog/BlogInner'
import ScrollToTop from '../Components/ScrollToTop'
import FooterOne from "../Components/Footer/FooterOne";

function Blog() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title={<><span style={{ color: '#111' }}>Lists</span> <span style={{ color: '#e8151b' }}>View</span></>}
                pageName="Lists View"
                bgImage="/assets/img/blog/blog.png"
            />
            <BlogInner />
            <FooterOne />
            <ScrollToTop />
        </>
    )
}

export default Blog
