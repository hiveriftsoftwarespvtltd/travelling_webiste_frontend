import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import UserProfileInner from '../Components/Booking/UserProfileInner'
import FooterOne from "../Components/Footer/FooterOne";
import ScrollToTop from '../Components/ScrollToTop'

function UserProfile() {
    return (
        <>
            <HeaderOne />
            <UserProfileInner />
            <FooterOne />
            <ScrollToTop />
        </>
    )
}

export default UserProfile
