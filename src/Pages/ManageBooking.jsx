import React, { useEffect } from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import FooterOne from '../Components/Footer/FooterOne'
import ManageBookingInner from '../Components/Booking/ManageBookingInner'

function ManageBooking() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title={<><span style={{ color: '#111' }}>Manage</span> <span style={{ color: '#e8151b' }}>Booking</span></>}
                pageName="Manage Booking"
                bgImage="/assets/img/bg/contactus_bg.png" 
            />
            <ManageBookingInner />
            <FooterOne />
        </>
    )
}

export default ManageBooking
