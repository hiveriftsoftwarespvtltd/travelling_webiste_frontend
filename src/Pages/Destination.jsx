import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import DestinationInner from '../Components/Destination/DestinationInner'
import FooterOne from "../Components/Footer/FooterOne";
import ScrollToTop from '../Components/ScrollToTop'

function Destination() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title="Destination"
                bgImage="/assets/img/destination/destination.png"
                titleColor='#e8151b'
            />
            <DestinationInner />
            <FooterOne />
            <ScrollToTop />
        </>
    )
}

export default Destination
