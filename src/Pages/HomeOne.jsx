import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import BannerOne from '../Components/Banner/BannerOne'
import Booking from '../Components/Booking/Booking'
import CategoryOne from '../Components/Category/CategoryOne'
import AboutOne from '../Components/About/AboutOne'
import TourOne from '../Components/Tour/TourOne'
import GalleryOne from '../Components/Gallery/GalleryOne'
import CounterOne from '../Components/Counter/CounterOne'
import TestimonialOne from '../Components/Testimonials/TestimonialOne'
import HomeCta from '../Components/Services/HomeCta'
import FooterOne from '../Components/Footer/FooterOne'
import ScrollToTop from '../Components/ScrollToTop'

import WhyJiyoLife from '../Components/About/WhyJiyoLife'

function HomeOne() {
    return (
        <div>
            <HeaderOne />
            <BannerOne />
            <WhyJiyoLife />
            {/* <Booking /> */}
            <CategoryOne />
            <AboutOne />
            <TourOne />
            {/* <GalleryOne /> */}
            {/* <CounterOne /> */}
            {/* <TestimonialOne /> */}
            <HomeCta />
            <FooterOne />
            <ScrollToTop />
        </div>
    )
}

export default HomeOne
