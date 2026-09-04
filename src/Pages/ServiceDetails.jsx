import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import ServiceDetailsMain from '../Components/Services/ServiceDetailsMain'
import FooterOne from "../Components/Footer/FooterOne";
import ScrollToTop from '../Components/ScrollToTop'

function ServiceDetails() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title="Service Details"
            />
            <ServiceDetailsMain />
            <FooterOne />
            <ScrollToTop />
        </>
    )
}

export default ServiceDetails
