import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

function FaqInnerTwo() {
    const [activeIndex, setActiveIndex] = useState(0);
    const contentRefs = useRef([]); // Store refs for each accordion item

    const faqs = [
        {
            question: "What domestic holiday packages are available with starting prices?",
            answer: "Jiyo Life Travels offers a variety of domestic options, including the Goa Holiday Package priced at â‚¹ 7,500 per person and the Rishikesh Camp In Ganga package priced at â‚¹ 3,000 per person.",
        },
        {
            question: "What is included in the 7 Nights / 8 Days (7N 8D) Vietnam tour package?",
            answer: "According to the official itinerary, the 7N 8D Vietnam package includes accommodation on a twin, double, or triple-sharing basis, flight tickets, an E-Visa to Vietnam, travel insurance, an English-speaking tour guide, daily breakfast, and air-conditioned private airport transfers. It also covers specified entrance tickets such as Mua Cave, Trang An (sampan boat), Bana Hills (return cable car), Cam Thanh (basket boat), and Marble Mountains (one-way lift).",
        },
        {
            question: "What does the 5 Nights / 6 Days (5N 6D) Vietnam tour cost, and how does its transport differ from the 7N 8D package?",
            answer: "The 5N 6D Vietnam package costs â‚¹ 49,850 per person. Unlike the 7N 8D package, which includes airfare, the 5N 6D package explicitly excludes all international or domestic flights and airport taxes, and utilizes unguided vans for transfers on Day 2 and Day 3.",
        },
        {
            question: "Are flight tickets included in all international packages?",
            answer: "No, flight tickets are included in the 7N 8D Vietnam package. However, all flights (both international and domestic) and airport taxes are explicitly excluded from the 5N 6D Vietnam package.",
        },
        {
            question: "What attractions are excluded from the tour package price in Ba Na Hills?",
            answer: "For both the 7N 8D and 5N 6D Vietnam itineraries, the Debay Wine Cellar Ticket and the Wax Museum Ticket in Ba Na Hills are strictly excluded from the standard package cost.",
        },
        {
            question: "What are the standard check-in and check-out times for the hotel stays?",
            answer: "According to standard supplier exclusions, early check-in and late check-out are excluded. Guests must follow the normal check-in time of 14h00 (2:00 PM) and the normal check-out time between 11h00 and 12h00 (11:00 AM â€“ 12:00 PM).",
        },
        {
            question: "What is the cost and itinerary for the Udaipur & Mount Abu student package?",
            answer: "The 4 Nights / 5 Days student itinerary costs â‚¹ 6,980 per student. It features an overnight journey on Day 1, Mount Abu sightseeing on Day 2, Udaipur sightseeing on Day 3, a departure and overnight journey on Day 4, and arrival back at Delhi on Day 5.",
        },
        {
            question: "What special entertainment and meals are included in the student package?",
            answer: "The Udaipur & Mount Abu student package includes hotel accommodation, breakfast and dinner, full sightseeing, and one dedicated DJ night for the students.",
        },
        {
            question: "What expenses are excluded from the Udaipur & Mount Abu tour?",
            answer: "The student package strictly excludes bus, train, or airfare, along with tips, monument entry tickets, and any expenditures of a personal nature.",
        },
        {
            question: "How can I contact Jiyo Life Travels Private Limited to book a package?",
            answer: "You can get in touch with the owner, R Shokeen, in New Delhi by using the WhatsApp number 7982426916, calling the primary contact number 9289228555, or sending an official email to director.jiyolife@gmail.com.",
        }
    ];

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    useEffect(() => {
        // Dynamically set max-height for smooth transition
        contentRefs.current.forEach((ref, index) => {
            if (ref) {
                ref.style.maxHeight = activeIndex === index ? `${ref.scrollHeight}px` : "0px";
            }
        });
    }, [activeIndex]);

    return (
        <div className="space-top space-extra-bottom">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-7">
                        <div className="title-area text-center">
                            <span className="sub-title">FAQ</span>
                            <h2 className="sec-title">Frequently Asked Questions</h2>
                            <p>Have questions you want answers to?</p>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-10 offset-lg-1">
                        <div className="accordion-area mb-30">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className={`accordion-card style2 ${activeIndex === index ? "active" : ""}`}
                                >
                                    <div className="accordion-header">
                                        <button
                                            className={`accordion-button ${activeIndex === index ? "" : "collapsed"}`}
                                            onClick={() => toggleAccordion(index)}
                                        >
                                            Q{index + 1}. {faq.question}
                                        </button>
                                    </div>
                                    <div
                                        ref={(el) => (contentRefs.current[index] = el)}
                                        className="accordion-collapse"
                                    >
                                        <div className="accordion-body">
                                            <p className="faq-text">{faq.answer}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="th-loader btn-group mt-5 d-flex justify-content-center">
                <Link to="" className="th-btn style3 th-icon" id="loadMore">
                    <span>Load More</span>
                </Link>
            </div>

        </div>
    );
}

export default FaqInnerTwo;
