import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import posts from '../data/data-shop.json';
import ShopCardThree from './ShopCardThree';


function RelatedProduct() {
    return (
        <div className="space-extra-top mb-30">
            <div className="row">
                <div className="title-area mb-25 text-center">
                    <span className="sub-title">Similar Products</span>
                    <h2 className="sec-title">Recently Viewed Items</h2>
                </div>
            </div>
            <div className="swiper th-slider has-shadow" id="productSlider1">
                <Swiper
                    className="th-slider has-shadow"
                    id="productSlider1"
                    slidesPerView={4}
                    spaceBetween={30}
                    loop={posts.length > 1}
                    autoplay={true}
                    speed={1000}
                    breakpoints={{
                        0: { slidesPerView: 1 },
                        576: { slidesPerView: 2 },
                        768: { slidesPerView: 2 },
                        992: { slidesPerView: 3 },
                        1200: { slidesPerView: 4 },
                        1400: { slidesPerView: 4 },
                    }}
                >
                    {/* Dynamic Room Data - Slice to show a specific range */}
                    {posts.length > 0 ? (
                        posts.slice(0, 5).map((data) => ( // Adjust slice to show posts from 4th to 6th
                            <SwiperSlide key={data.id}>
                                <ShopCardThree
                                    shopID={data.id}
                                    shopImage={data.image}
                                    shopTitle={data.title}
                                    shopPrice={data.price}
                                />
                            </SwiperSlide>
                        ))
                    ) : (
                        <SwiperSlide>
                            <p className="text-center">No rooms available</p>
                        </SwiperSlide>
                    )}
                </Swiper>
            </div>
            <div className="d-block d-md-none mt-40 text-center">
                <div className="icon-box">
                    <button className="slider-arrow default swiper-button-prev">
                        <i className="far fa-arrow-left" />
                    </button>
                    <button className="slider-arrow default swiper-button-next">
                        <i className="far fa-arrow-right" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RelatedProduct;
