import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import GetInTouch from '../Components/Contact/GetInTouch'
import BookATour from '../Components/Contact/BookATour'
import ContactMap from '../Components/Contact/ContactMap'
import HomeCta from '../Components/Services/HomeCta'
import FooterOne from "../Components/Footer/FooterOne";
import ScrollToTop from '../Components/ScrollToTop'

function Contact() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title='Contact Us'
                bgImage='/assets/img/bg/contact.png'
                titleColor='#e8151b'
            />
            <div style={{ backgroundColor: "#f6f9fc" }}>
                <GetInTouch />
                <BookATour />
            </div>
            <HomeCta />
            <FooterOne />
            <ScrollToTop />
        </>
    )
}

export default Contact
