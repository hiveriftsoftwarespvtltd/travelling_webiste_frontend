import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoadTop from '../Components/LoadTop'
import CheckCancellationChargesInner from '../Components/Booking/CheckCancellationChargesInner'
import ReleaseBookingInner from '../Components/Booking/ReleaseBookingInner'
import TicketChangeRequestInner from '../Components/Booking/TicketChangeRequestInner'
import TrackChangeRequestInner from '../Components/Booking/TrackChangeRequestInner'
const HomeOne = lazy(() => import('./HomeOne'));

const About = lazy(() => import('./About'));
const Destination = lazy(() => import('./Destination'));
const DestinationDetails = lazy(() => import('./DestinationDetails'));
const Service = lazy(() => import('./Service'));
const ServiceDetails = lazy(() => import('./ServiceDetails'));
const Activities = lazy(() => import('./Activities'));
const RouterPage_ActivitiesDetails = lazy(() => import('./ActivitiesDetails'));
const Shop = lazy(() => import('./Shop'));
const ShopDetails = lazy(() => import('./ShopDetails'));
const Cart = lazy(() => import('./Cart'));
const Checkout = lazy(() => import('./Checkout'));
const Wishlist = lazy(() => import('./Wishlist'));
const Tour = lazy(() => import('./Tour'));
const TourDetails = lazy(() => import('./TourDetails'));
const Resort = lazy(() => import('./Resort'));
const ResortDetails = lazy(() => import('./ResortDetails'));
const FlightResults = lazy(() => import('./FlightResults'));
const FlightCheckout = lazy(() => import('./FlightCheckout'));
const BookingConfirmation = lazy(() => import('./BookingConfirmation'));
const HotelResults = lazy(() => import('./HotelResults'));
const HotelCheckout = lazy(() => import('./HotelCheckout'));
const HotelConfirmation = lazy(() => import('./HotelConfirmation'));
const HotelDetail = lazy(() => import('./HotelDetail'));
const HotelMyBookings = lazy(() => import('./HotelMyBookings'));
const MyBookings = lazy(() => import('./MyBookings'));
const FlightMyBookings = lazy(() => import('./FlightMyBookings'));
const FlightBookingDetails = lazy(() => import('./FlightBookingDetails'));
const ManageBooking = lazy(() => import('./ManageBooking'));
const UserProfile = lazy(() => import('./UserProfile'));

const Faq = lazy(() => import('./Faq'));
const Pricing = lazy(() => import('./Pricing'));
const Error = lazy(() => import('./Error'));
const Blog = lazy(() => import('./Blog'));
const BlogDetails = lazy(() => import('./BlogDetails'));
const Contact = lazy(() => import('./Contact'));
const AdminLogin = lazy(() => import('./AdminLogin'));
const AdminDashboard = lazy(() => import('./AdminDashboard'));
const PrivacyPolicy = lazy(() => import('./PrivacyPolicy'));
const RefundPolicy = lazy(() => import('./RefundPolicy'));
const TermsPolicy = lazy(() => import('./TermsPolicy'));


function RouterPage() {
  return (
    <div>
      <Router>
        <LoadTop />
        <Suspense fallback={<div className="preloader"><div className="preloader-inner"><span className="loader"></span></div></div>}>
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
              <Route path="flight-bookings" element={<FlightMyBookings />} />
              <Route path="hotel-bookings" element={<HotelMyBookings />} />
              <Route path="flight-booking/:id" element={<FlightBookingDetails />} />
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
        </Suspense>
      </Router>
    </div>
  )
}

export default RouterPage
