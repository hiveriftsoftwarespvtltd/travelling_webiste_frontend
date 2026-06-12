import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import ShopDetailsMain from '../Components/Shop/ShopDetailsMain'
import FooterOne from "../Components/Footer/FooterOne";
import ScrollToTop from '../Components/ScrollToTop'

function ShopDetails() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title='Shop Details'
            />
            <ShopDetailsMain />
            <FooterOne />
            <ScrollToTop />
        </>
    )
}

export default ShopDetails
