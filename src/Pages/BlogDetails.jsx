import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import BlogDetailsMain from '../Components/Blog/BlogDetailsMain'
import FooterOne from "../Components/Footer/FooterOne";
import ScrollToTop from '../Components/ScrollToTop'

function BlogDetails() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title="Blog Single"
            />
            <BlogDetailsMain />
            <FooterOne />
            <ScrollToTop />
        </>
    )
}

export default BlogDetails
