import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import AboutFour from '../Components/About/AboutFour'
import ElementSection from '../Components/Elements/ElementSection'
import TestimonialOne from '../Components/Testimonials/TestimonialOne'
import GalleryFive from '../Components/Gallery/GalleryFive'
import HomeCta from '../Components/Services/HomeCta'
import FooterOne from "../Components/Footer/FooterOne";
import ScrollToTop from '../Components/ScrollToTop'

function About() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title={<><span style={{ color: '#111' }}>About</span> <span style={{ color: '#e8151b' }}>Jiyo Life Travels</span></>}
                pageName="About Jiyo Life Travels"
                bgImage="/assets/img/normal/about.png"
            />
            <AboutFour />
            {/* <ElementSection /> */}
            <TestimonialOne />
            <HomeCta />
            <FooterOne />
            <ScrollToTop />
        </>
    )
}

export default About
