import React from 'react';
import ServiceCard from './ServiceCard';
import posts from '../data/data-service.json';

function ServiceInner() {
    return (
        <section className="position-relative overflow-hidden space" id="destination-sec">
            <div className="container shape-mockup-wrap">
                <div className="row gy-4 gx-4">
                    {posts.map((data, index) => (
                        <div key={index} className="col-xl-3 col-lg-4 col-md-6">
                            <ServiceCard
                                serviceID={data.id}
                                serviceImage={data.image}
                                serviceTitle={data.title}
                                serviceItem={data.item}
                            />
                        </div>
                    ))}
                </div>

                {/* Shapes */}
                <div className="shape-mockup shape1 d-none d-xxl-block" style={{ bottom: "17%", right: "-9%" }}>
                    <img src="/assets/img/shape/shape_1.png" alt="shape" />
                </div>
                <div className="shape-mockup shape2 d-none d-xl-block" style={{ bottom: "8%", right: "-8%" }}>
                    <img src="/assets/img/shape/shape_2.png" alt="shape" />
                </div>
                <div className="shape-mockup shape3 d-none d-xxl-block" style={{ bottom: "15%", right: "-4%" }}>
                    <img src="/assets/img/shape/shape_3.png" alt="shape" />
                </div>
            </div>
        </section>
    );
}

export default ServiceInner;
