import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import GalleryInner from '../Components/Gallery/GalleryInner'
import FooterOne from "../Components/Footer/FooterOne";
import ScrollToTop from '../Components/ScrollToTop'

function Gallery() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title="Gallery"
            />
            <GalleryInner />
            <FooterOne />
            <ScrollToTop />
        </>
    )
}

export default Gallery
