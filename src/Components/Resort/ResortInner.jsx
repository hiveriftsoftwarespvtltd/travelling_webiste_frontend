import { ArrowRight } from 'lucide-react';
﻿import React from "react";
import { Link } from "react-router-dom";

const resorts = [
  {
    id: 1,
    image: "/assets/img/normal/resort_1_1.jpg",
    title: "Ocean View Resort",
    price: "$350.00",
    rating: 4.8,
    capacity: "6 Person",
    size: "45 mÂ²",
    bed: "Large Bed",
    service: "Free Breakfast, Free Water, Free Wifi",
  },
  {
    id: 2,
    image: "/assets/img/normal/resort_1_2.jpg",
    title: "Premium Forest Resort",
    price: "$250.00",
    rating: 4.8,
    capacity: "6 Person",
    size: "45 mÂ²",
    bed: "Large Bed",
    service: "Free Breakfast, Free Water, Free Wifi",
  },
  {
    id: 3,
    image: "/assets/img/normal/resort_1_3.jpg",
    title: "Deluxe Hilltop Resort",
    price: "$350.00",
    rating: 4.8,
    capacity: "6 Person",
    size: "45 mÂ²",
    bed: "Large Bed",
    service: "Free Breakfast, Free Water, Free Wifi",
  },
];

function ResortInner() {
  return (
    <div className="space">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="title-area text-center pe-xl-4 ps-xl-4">
              <span className="sub-title">Best Resort For You</span>
              <h2 className="sec-title mb-20">Most Popular Resort</h2>
              <p className="sec-text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
        </div>

        {resorts.map((resort, index) => (
          <div className="row gx-60 gy-30 mb-60 align-items-center" key={resort.id}>
            <div className={`col-lg-6 ${index % 2 !== 0 ? "order-lg-4" : ""}`}>
              <div className="resort-image global-img">
                <img src={resort.image} alt={resort.title} />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="resort-content">
                <h3 className="box-title">
                  <Link to={`/resort/${resort.id}`}>{resort.title}</Link>
                </h3>
                <div className="resort-rating">
                  <div className="star-rating" role="img" aria-label={`Rated ${resort.rating} out of 5`}>
                    <span style={{ width: "100%" }}>
                      Rated <strong className="rating">{resort.rating}</strong> out of 5
                    </span>
                  </div>
                  <Link to="#" className="woocommerce-review-link">
                    (<span className="count">{resort.rating}</span> Rating)
                  </Link>
                </div>
                <h4 className="resort-price">
                  <span className="currency">From {resort.price}</span>/per Night
                </h4>
                <p className="resort-text">
                  Focused on providing a serene, relaxing environment with natural landscapes and coastal aesthetics.
                </p>
                <div className="resort-list">
                  <ul>
                    <li>
                      <span className="title">Capacity:</span> {resort.capacity}
                    </li>
                    <li>
                      <span className="title">Size:</span> {resort.size}
                    </li>
                    <li>
                      <span className="title">Bed:</span> {resort.bed}
                    </li>
                    <li>
                      <span className="title">Service:</span> {resort.service}
                    </li>
                  </ul>
                </div>
                <div className="resort-btn mt-40">
                  <Link to="/contact" className="th-btn style4 " style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>Book Now <ArrowRight size={16} /></Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResortInner;
