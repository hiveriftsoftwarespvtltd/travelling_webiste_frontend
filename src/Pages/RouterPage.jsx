import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import HomeOne from './HomeOne'

import About from './About'
import LoadTop from '../Components/LoadTop'
import Destination from './Destination'
import DestinationDetails from './DestinationDetails'
import Service from './Service'
import ServiceDetails from './ServiceDetails';
import Activities from './Activities'
import RouterPage_ActivitiesDetails from './ActivitiesDetails'
import Shop from './Shop'
import ShopDetails from './ShopDetails'
import Cart from './Cart'
import Checkout from './Checkout'
import Wishlist from './Wishlist'
import Gallery from './Gallery'
import Tour from './Tour'
import TourDetails from './TourDetails'
import Resort from './Resort'
import ResortDetails from './ResortDetails'
import FlightResults from './FlightResults'
import FlightCheckout from './FlightCheckout'
import BookingConfirmation from './BookingConfirmation'
import HotelResults from './HotelResults'
import HotelCheckout from './HotelCheckout'
import HotelConfirmation from './HotelConfirmation'
import HotelDetail from './HotelDetail'
import MyBookings from './MyBookings'
import ManageBooking from './ManageBooking'
import UserProfile from './UserProfile'
import CheckCancellationChargesInner from '../Components/Booking/CheckCancellationChargesInner'
import ReleaseBookingInner from '../Components/Booking/ReleaseBookingInner'
import TicketChangeRequestInner from '../Components/Booking/TicketChangeRequestInner'
import TrackChangeRequestInner from '../Components/Booking/TrackChangeRequestInner'

import Faq from './Faq'
import Pricing from './Pricing'
import Error from './Error'
import Blog from './Blog'
import BlogDetails from './BlogDetails'
import Contact from './Contact'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'
import PrivacyPolicy from './PrivacyPolicy'
import RefundPolicy from './RefundPolicy'
import TermsPolicy from './TermsPolicy'


function RouterPage() {
  return (
    <div>
      <Router>
        <LoadTop />
        <Routes>
          <Route path="/" element={<HomeOne />}></Route>

          <Route path="/about" element={<About />}></Route>
          <Route path="/destination" element={<Destination />}></Route>
          <Route path="/destination/:id" element={<DestinationDetails />} />
          <Route path="/service" element={<Service />}></Route>
          <Route path="/service/:id" element={<ServiceDetails />} />
          <Route path="/activities" element={<Activities />}></Route>
          <Route path="/activities-details" element={<RouterPage_ActivitiesDetails />}></Route>
          <Route path="/shop" element={<Shop />}></Route>
          <Route path="/shop/:id" element={<ShopDetails />}></Route>
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/checkout" element={<Checkout />}></Route>
          <Route path="/wishlist" element={<Wishlist />}></Route>
          <Route path="/gallery" element={<Gallery />}></Route>
          <Route path="/tour" element={<Tour />}></Route>
          <Route path="/tour-details" element={<TourDetails />}></Route>
          <Route path="/flight-results" element={<FlightResults />}></Route>
          <Route path="/flight-checkout" element={<FlightCheckout />}></Route>
          <Route path="/flight-confirmation" element={<BookingConfirmation />}></Route>
          
          <Route path="/hotel-results" element={<HotelResults />}></Route>
          <Route path="/hotel-detail" element={<HotelDetail />}></Route>
          <Route path="/hotel-checkout" element={<HotelCheckout />}></Route>
          <Route path="/hotel-confirmation" element={<HotelConfirmation />}></Route>
          <Route path="/my-bookings" element={<MyBookings />}></Route>

          <Route path="/manage-booking" element={<ManageBooking />}></Route>
          
          <Route path="/user-profile" element={<UserProfile />}>
              <Route index element={<Navigate to="cancellation-charges" replace />} />
              <Route path="cancellation-charges" element={<CheckCancellationChargesInner />} />
              <Route path="release-booking" element={<ReleaseBookingInner />} />
              <Route path="ticket-change-request" element={<TicketChangeRequestInner />} />
              <Route path="track-change-request" element={<TrackChangeRequestInner />} />
          </Route>
          
          <Route path="/resort" element={<Resort />}></Route>
          <Route path="/resort/:id" element={<ResortDetails />}></Route>

          <Route path="/faq" element={<Faq />}></Route>
          <Route path="/price" element={<Pricing />}></Route>
          <Route path="/error" element={<Error />}></Route>
          <Route path="/blog" element={<Blog />}></Route>
          <Route path="/blog/:id" element={<BlogDetails />}></Route>
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/terms-booking-policies" element={<TermsPolicy />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </div>
  )
}

export default RouterPage
