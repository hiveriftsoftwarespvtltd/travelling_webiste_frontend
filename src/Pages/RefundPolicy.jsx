import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import RefundInner from '../Components/Refund/RefundInner'
import FooterOne from "../Components/Footer/FooterOne"
import ScrollToTop from '../Components/ScrollToTop'

function RefundPolicy() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title={<><span style={{ color: '#000' }}>Refund</span><span style={{ color: '#e8151b' }}> & Cancellation Policy</span></>}
                pageName="Refund & Cancellation Policy"
                bgImage='/assets/img/bg/refund_policy.png'
            />
            <RefundInner />
            <FooterOne />
            <ScrollToTop />
        </>
    )
}

export default RefundPolicy
