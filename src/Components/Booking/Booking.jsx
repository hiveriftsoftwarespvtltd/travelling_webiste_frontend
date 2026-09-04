import React, { useState, useEffect } from "react";
import NiceSelect from "../Header/NiceSelect";

function Booking() {
    const [formData, setFormData] = useState({
        destination: "",
        adventureType: "",
        duration: "",
        category: ""
    });

    const [formMessage, setFormMessage] = useState({ text: "", type: "" });

    const [destinationOptions, setDestinationOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);

    useEffect(() => {
        // Fetch Destinations
        fetch(`${process.env.REACT_APP_API_BASE_URL}/destinations`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setDestinationOptions(data.map(d => ({ value: d.name || d.pageTitle, label: d.name || d.pageTitle })));
                }
            })
            .catch(err => console.log('Booking dest API error', err));

        // Fetch Categories
        fetch(`${process.env.REACT_APP_API_BASE_URL}/categories`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setCategoryOptions(data.map(c => ({ value: c.title, label: c.title })));
                }
            })
            .catch(err => console.log('Booking cat API error', err));
    }, []);

    const adventureOptions = [
        { value: "Beach", label: "Beach" },
        { value: "Group Tour", label: "Group Tour" },
        { value: "Couple Tour", label: "Couple Tour" },
        { value: "Family Tour", label: "Family Tour" },
    ];
    const durationOptions = [
        { value: "1 days", label: "1 days" },
        { value: "2 days", label: "2 days" },
        { value: "3 days", label: "3 days" },
        { value: "4 days", label: "4 days" },
        { value: "5 days", label: "5 days" },
        { value: "6 days", label: "6 days" },
    ];

    const handleChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();


        if (!formData.destination || !formData.adventureType || !formData.duration || !formData.category) {
            setFormMessage({ text: "Please fill in all fields before searching.", type: "error" });
           
            return;
        }

        setFormMessage({ text: "Search submitted successfully!", type: "success" });

        setFormData({ destination: "", adventureType: "", duration: "", category: "" });
    };

    return (
        <div className="booking-sec">
            <div className="container">
                <form onSubmit={handleSubmit} className="booking-form">
                    <div className="input-wrap">
                        <div className="row align-items-center justify-content-between">
                            <div className="form-group col-md-6 col-lg-auto">
                                <div className="icon">
                                    <i className="fa-light fa-route" />
                                </div>
                                <div className="search-input">
                                    <label>Destination</label>
                                    <NiceSelect
                                        options={destinationOptions}
                                        defaultValue="Select Destination"
                                        onChange={(value) => handleChange("destination", value)}
                                    />
                                </div>
                            </div>
                            <div className="form-group col-md-6 col-lg-auto">
                                <div className="icon">
                                    <i className="fa-regular fa-person-hiking" />
                                </div>
                                <div className="search-input">
                                    <label>Type</label>
                                    <NiceSelect
                                        options={adventureOptions}
                                        defaultValue="Adventure"
                                        onChange={(value) => handleChange("adventureType", value)}
                                    />
                                </div>
                            </div>
                            <div className="form-group col-md-6 col-lg-auto">
                                <div className="icon">
                                    <i className="fa-light fa-clock" />
                                </div>
                                <div className="search-input">
                                    <label>Duration</label>
                                    <NiceSelect
                                        options={durationOptions}
                                        defaultValue="Duration"
                                        onChange={(value) => handleChange("duration", value)}
                                    />
                                </div>
                            </div>
                            <div className="form-group col-md-6 col-lg-auto">
                                <div className="icon">
                                    <i className="fa-light fa-map-location-dot" />
                                </div>
                                <div className="search-input">
                                    <label>Tour Category</label>
                                    <NiceSelect
                                        options={categoryOptions}
                                        defaultValue="Select Category"
                                        onChange={(value) => handleChange("category", value)}
                                    />
                                </div>
                            </div>
                            <div className="form-btn col-md-12 col-lg-auto">
                                <button className="th-btn" type="submit">
                                    <img src="/assets/img/icon/search.svg" alt="" />
                                    Search
                                </button>
                            </div>
                        </div>

                        {/* Form Message Display */}
                        {formMessage.text && (
                            <p className={`form-messages mb-0 mt-3 ${formMessage.type === "error" ? "text-danger" : "text-success"}`}>
                                {formMessage.text}
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Booking;
