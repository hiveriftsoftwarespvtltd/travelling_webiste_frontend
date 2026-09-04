import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ShopCard from './ShopCard';
import posts from '../data/data-shop.json';
import ShopCardTwo from './ShopCardTwo';

function ShopInner() {
    const [activeTab, setActiveTab] = useState('tab-grid');
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 8;

    const totalPages = Math.ceil(posts.length / postsPerPage);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    return (
        <section className="space-top space-extra-bottom">
            <div className="container">
                <div className="th-sort-bar">
                    <div className="row justify-content-between align-items-center">
                        <div className="col-md-4">
                            <div className="search-form-area">
                                <form className="search-form">
                                    <input type="text" placeholder="Search" />
                                    <button type="submit">
                                        <i className="fa-light fa-magnifying-glass" />
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div className="col-md-auto">
                            <div className="sorting-filter-wrap">
                                <div className="nav" role="tablist">
                                    <Link
                                        to="#"
                                        id="tab-destination-grid"
                                        data-bs-toggle="tab"
                                        data-bs-target="#tab-grid"
                                        role="tab"
                                        aria-controls="tab-grid"
                                        aria-selected="true"
                                        className={`${activeTab === 'tab-grid' ? 'active' : ''}`}
                                        type="button"
                                        onClick={() => setActiveTab('tab-grid')}
                                    >
                                        <i className="fa-light fa-grid-2" />
                                    </Link>
                                    <Link
                                        to="#"
                                        id="tab-destination-list"
                                        data-bs-toggle="tab"
                                        data-bs-target="#tab-list"
                                        role="tab"
                                        aria-controls="tab-list"
                                        aria-selected="false"
                                        className={`${activeTab === 'tab-list' ? 'active' : ''}`}
                                        type="button"
                                        onClick={() => setActiveTab('tab-list')}
                                    >
                                        <i className="fa-solid fa-list" />
                                    </Link>
                                </div>
                                <form className="woocommerce-ordering" method="get">
                                    <select
                                        name="orderby"
                                        className="orderby"
                                        aria-label="destination order"
                                    >
                                        <option value="menu_order" >
                                            Default Sorting
                                        </option>
                                        <option value="popularity">Sort by popularity</option>
                                        <option value="rating">Sort by average rating</option>
                                        <option value="date">Sort by latest</option>
                                        <option value="price">Sort by price: low to high</option>
                                        <option value="price-desc">Sort by price: high to low</option>
                                    </select>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row gy-40">
                    <div className="tab-content" id="nav-tabContent">
                        <div
                            className={`tab-pane fade ${activeTab === 'tab-grid' ? 'show active' : ''}`} id="tab-grid" role="tabpanel"
                        >
                            <div className="row gy-40">
                                {currentPosts.map((data, index) => (
                                    <div key={index} className="col-xl-3 col-sm-6">
                                        <ShopCard
                                            shopID={data.id}
                                            shopImage={`${data.image}`}
                                            shopTitle={data.title}
                                            shopPrice={data.price}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div
                            className={`tab-pane fade ${activeTab === 'tab-list' ? 'show active' : ''}`} id="tab-list" role="tabpanel"
                        >
                            <div className="row gy-30">
                                {currentPosts.map((data, index) => (
                                    <div key={index} className="col-md-6">
                                        <ShopCardTwo
                                            shopID={data.id}
                                            shopImage={`${data.image}`}
                                            shopTitle={data.title}
                                            shopPrice={data.price}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="th-pagination text-center pt-50">
                    <ul>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <li key={i}>
                                <Link
                                    className={currentPage === i + 1 ? 'active' : ''}
                                    to="#"
                                    onClick={() => handlePageChange(i + 1)}
                                >
                                    {i + 1}
                                </Link>
                            </li>
                        ))}
                        {currentPage < totalPages && (
                            <li>
                                <Link className="next-page" to="#" onClick={() => handlePageChange(currentPage + 1)}>
                                    Next <img src="/assets/img/icon/arrow-right4.svg" alt="" />
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </section>

    )
}

export default ShopInner
