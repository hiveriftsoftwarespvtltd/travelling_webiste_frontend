import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import UserProfileInner from '../Components/Booking/UserProfileInner'
import ScrollToTop from '../Components/ScrollToTop'

function UserProfile() {
    return (
        <>
            <HeaderOne />
            <UserProfileInner />
            <ScrollToTop />
        </>
    )
}

export default UserProfile
