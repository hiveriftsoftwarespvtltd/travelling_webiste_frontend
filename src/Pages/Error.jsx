import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import { Link } from 'react-router-dom'
import FooterOne from "../Components/Footer/FooterOne";
import ScrollToTop from '../Components/ScrollToTop'

function Error() {
  return (
    <>
      <HeaderOne />
      <Breadcrumb
        title="Error Page"
      />
      <section className="space bg-smoke">
        <div className="container">
          <div className="row flex-row-reverse align-items-center">
            <div className="col-lg-6">
              <div className="error-img">
                <img src="/assets/img/theme-img/error.svg" alt="404" />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="error-content">
                <h2 className="error-title">Oops! Page Not Found</h2>
                <h4 className="error-subtitle">
                  This page seems to have slipped through a time portal
                </h4>
                <p className="error-text">
                  We appologize for any distruction to the space-time continuum. Feel
                  free to journey back to our homepage
                </p>
                <Link to="/" className="th-btn style3">
                  <img src="/assets/img/icon/right-arrow2.svg" alt="" />
                  Go Back Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <FooterOne />
      <ScrollToTop />
    </>
  )
}

export default Error
