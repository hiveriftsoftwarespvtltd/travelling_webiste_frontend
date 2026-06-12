import React from 'react'

function ContactMap() {
    return (
        <div className="">
            <div className="container-fluid">
                <div className="contact-map style2">
                    <iframe
                        src="https://maps.google.com/maps?q=Jiyo+Life+Travels+Private+Limited+New+Delhi&output=embed"
                        allowFullScreen=""
                        loading="lazy"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                    <div className="contact-icon">
                        <img src="assets/img/icon/location-dot3.svg" alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactMap
