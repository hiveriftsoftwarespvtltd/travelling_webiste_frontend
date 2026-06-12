import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import TermsInner from '../Components/Terms/TermsInner'
import FooterOne from "../Components/Footer/FooterOne"
import ScrollToTop from '../Components/ScrollToTop'

function TermsPolicy() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title={<><span style={{ color: '#000' }}>Terms</span><span style={{ color: '#e8151b' }}> & Booking Policies</span></>}
                pageName="Terms & Booking Policies"
                bgImage='/assets/img/bg/term_condition.png'
            />
            <TermsInner />
            <FooterOne />
            <ScrollToTop />
        </>
    )
}

export default TermsPolicy
