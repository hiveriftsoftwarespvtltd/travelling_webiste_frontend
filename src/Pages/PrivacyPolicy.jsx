import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import PrivacyInner from '../Components/Privacy/PrivacyInner'
import FooterOne from "../Components/Footer/FooterOne"
import ScrollToTop from '../Components/ScrollToTop'

function PrivacyPolicy() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title={<><span style={{ color: '#000' }}>Privacy</span><span style={{ color: '#e8151b' }}> Policy</span></>}
                pageName="Privacy Policy"
                bgImage='/assets/img/bg/privacy_policy.png'
            />
            <PrivacyInner />
            <FooterOne />
            <ScrollToTop />
        </>
    )
}

export default PrivacyPolicy
