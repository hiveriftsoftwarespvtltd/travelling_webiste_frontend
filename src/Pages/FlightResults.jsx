import React from 'react';
import HeaderOne from '../Components/Header/HeaderOne';
import FooterOne from '../Components/Footer/FooterOne';
import ScrollToTop from '../Components/ScrollToTop';
import FlightResultsInner from '../Components/Flight/FlightResultsInner';

function FlightResults() {
    return (
        <>
            {/* <HeaderOne /> */}
            <FlightResultsInner />
            <FooterOne />
            <ScrollToTop />
        </>
    );
}

export default FlightResults;
