import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import ActivitiesInner from '../Components/Activities/ActivitiesInner'
import FooterOne from "../Components/Footer/FooterOne";
import ScrollToTop from '../Components/ScrollToTop'

function Activities() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title="Activities"
            />
            <ActivitiesInner />
            <FooterOne />
            <ScrollToTop />
        </>
    )
}

export default Activities
