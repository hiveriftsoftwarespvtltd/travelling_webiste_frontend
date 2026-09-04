import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import ShopInner from '../Components/Shop/ShopInner'
import FooterOne from "../Components/Footer/FooterOne";
import ScrollToTop from '../Components/ScrollToTop'

function Shop() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title="Shops"
            />
            <ShopInner />
            <FooterOne />
            <ScrollToTop />
        </>
    )
}

export default Shop
