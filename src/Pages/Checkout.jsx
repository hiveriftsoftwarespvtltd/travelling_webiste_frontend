import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import CheckoutInner from '../Components/Shop/CheckoutInner'
import FooterOne from "../Components/Footer/FooterOne";
import ScrollToTop from '../Components/ScrollToTop'

function Checkout() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title='Checkout'
            />
            <CheckoutInner />
            <FooterOne />
            <ScrollToTop />
        </>
    )
}

export default Checkout
