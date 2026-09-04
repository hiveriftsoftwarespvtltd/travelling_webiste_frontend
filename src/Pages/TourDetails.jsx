import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import TourDetailsMain from '../Components/Tour/TourDetailsMain'
import FooterOne from "../Components/Footer/FooterOne";
import ScrollToTop from '../Components/ScrollToTop'

function TourDetails() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title="Tour Details"
            />
            <TourDetailsMain />
            <FooterOne />
            <ScrollToTop />
        </>
    )
}

export default TourDetails
