import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import FaqInner from '../Components/Faq/FaqInner'
import ElementSection from '../Components/Elements/ElementSection'
import FaqContact from '../Components/Faq/FaqContact'
import FooterOne from "../Components/Footer/FooterOne";
import ScrollToTop from '../Components/ScrollToTop'

function Faq() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title="FAQs"
            />
            <FaqInner />
            <ElementSection />
            <FaqContact />
            <FooterOne />
            <ScrollToTop />
        </>
    )
}

export default Faq
