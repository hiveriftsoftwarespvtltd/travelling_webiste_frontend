import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import ActivitiesDetailsMain from '../Components/Activities/ActivitiesDetailsMain'
import FooterOne from "../Components/Footer/FooterOne";
import ScrollToTop from '../Components/ScrollToTop'

function ActivitiesDetails() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title="Activities Details"
            />
            <ActivitiesDetailsMain />
            <FooterOne />
            <ScrollToTop />
        </>
    )
}

export default ActivitiesDetails
