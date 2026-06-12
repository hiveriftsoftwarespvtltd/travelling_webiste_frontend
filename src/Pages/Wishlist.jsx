import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import WishlistInner from '../Components/Shop/WishlistInner'
import FooterOne from "../Components/Footer/FooterOne";
import ScrollToTop from '../Components/ScrollToTop'

function Wishlist() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title="Wishlist"
            />
            <WishlistInner />
            <FooterOne />
            <ScrollToTop />
        </>
    )
}

export default Wishlist
