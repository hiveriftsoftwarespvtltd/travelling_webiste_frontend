import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import DestinationDetailsMain from '../Components/Destination/DestinationDetailsMain'
import FooterOne from "../Components/Footer/FooterOne";
import ScrollToTop from '../Components/ScrollToTop'

function DestinationDetails() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title={<><span style={{ color: '#E8151B' }}>Destination</span> <span style={{ color: '#000' }}>Details</span></>}
                pageName="Destination Details"
                bgImage="/assets/img/destination/destination_detail.png"
            />
            <DestinationDetailsMain />
            <FooterOne />
            <ScrollToTop />
        </>
    )
}

export default DestinationDetails
