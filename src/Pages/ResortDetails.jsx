import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import ResortDetailsMain from '../Components/Resort/ResortDetailsMain'
import FooterOne from "../Components/Footer/FooterOne";
import ScrollToTop from '../Components/ScrollToTop'

function ResortDetails() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title="Resort Details"
            />
            <ResortDetailsMain />
            <FooterOne />
            <ScrollToTop />
        </>
    )
}

export default ResortDetails
