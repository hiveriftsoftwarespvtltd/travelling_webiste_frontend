import React from 'react'
import { Link } from 'react-router-dom'

import { ArrowRight } from 'lucide-react'

function Breadcrumb({ title, description, bgImage, pageName, titleColor }) {
    return (
        <>
            <style>{`
                .breadcumb-wrapper {
                    padding: 160px 0 80px 0 !important; /* Increased banner height and top spacing */
                }
                @media (max-width: 768px) {
                    .breadcumb-wrapper {
                        padding: 120px 0 60px 0 !important;
                    }
                }
                /* Hide the default CSS arrows on breadcrumb items */
                .breadcumb-menu li::after, .breadcumb-menu li::before {
                    display: none !important;
                }
                .breadcumb-menu {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                }
                .breadcumb-menu li {
                    display: flex;
                    align-items: center;
                    margin: 0 !important;
                    padding: 0 !important;
                }
                .breadcumb-menu a {
                    color: #000;
                    text-decoration: none;
                    font-weight: 800;
                }
                .breadcumb-menu li.current {
                    color: #000;
                    font-weight: 800;
                }
            `}</style>
            <div
                className="breadcumb-wrapper "
                style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05)), url(${bgImage || '/assets/img/bg/breadcumb-bg.jpg'})`, backgroundRepeat:"no-repeat", backgroundSize:"cover", backgroundPosition: "center" }}
            >
                <div className="container">
                    <div className="breadcumb-content">
                        <h1 className="breadcumb-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', fontWeight: 900, color: titleColor || '#fff', marginBottom: '15px' }}>{title}</h1>
                        <ul className="breadcumb-menu">
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                            <li>
                                <ArrowRight size={16} color="#000" />
                            </li>
                            <li className="current">{pageName || title}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Breadcrumb
