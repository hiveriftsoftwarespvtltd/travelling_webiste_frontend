import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import CartInner from '../Components/Shop/CartInner'
import FooterOne from "../Components/Footer/FooterOne";
import ScrollToTop from '../Components/ScrollToTop'

function Cart() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title='Cart Page'
            />
            <CartInner />
            <FooterOne />
            <ScrollToTop />
        </>
    )
}

export default Cart
