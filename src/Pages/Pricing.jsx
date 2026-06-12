import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import PricingPlan from '../Components/Services/PricingPlan'
import HomeCta from '../Components/Services/HomeCta'
import FaqInnerTwo from '../Components/Faq/FaqInnerTwo'
import FooterOne from "../Components/Footer/FooterOne";
import ScrollToTop from '../Components/ScrollToTop'

function Pricing() {
    return (
        <div>
            <HeaderOne />
            <Breadcrumb
                title="Pricing Plan"
            />
            <PricingPlan className="space"/>
            <HomeCta />
            <FaqInnerTwo />
            <FooterOne />
            <ScrollToTop />
        </div>
    )
}

export default Pricing
