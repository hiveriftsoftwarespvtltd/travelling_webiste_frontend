import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import ResortInner from '../Components/Resort/ResortInner'
import FooterOne from "../Components/Footer/FooterOne";
import ScrollToTop from '../Components/ScrollToTop'

function Resort() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title="Resort"
            />
            <ResortInner />
            <FooterOne />
            <ScrollToTop />
        </>
    )
}

export default Resort
