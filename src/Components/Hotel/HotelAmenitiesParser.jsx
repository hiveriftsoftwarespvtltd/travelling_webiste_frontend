import React, { useMemo, useState, useRef, useEffect } from 'react';
import { 
    Wifi, Car, Coffee, Dumbbell, Waves, CheckCircle2, Tv, Wind, 
    Bath, Briefcase, Baby, Shield, Bed, Utensils, PlaneTakeoff, 
    Monitor, Lock, Accessibility, Flame, Bus, X, Info
} from 'lucide-react';

const CATEGORIES = {
    'Internet': ['wifi', 'internet', 'broadband', 'wlan', 'wi-fi'],
    'Meals & Inclusions': ['breakfast', 'dinner', 'lunch', 'meal', 'buffet', 'all inclusive', 'restaurant', 'dining', 'coffee', 'tea', 'snack', 'bar', 'lounge'],
    'Bathroom': ['bath', 'shower', 'toiletries', 'hairdryer', 'towel', 'tub', 'jacuzzi'],
    'Room Amenities': ['air conditioning', 'ac', 'tv', 'television', 'minibar', 'safe', 'iron', 'desk', 'balcony', 'view', 'bed', 'fridge', 'refrigerator', 'telephone', 'wardrobe', 'heating'],
    'Wellness': ['spa', 'massage', 'sauna', 'fitness', 'gym', 'health club', 'yoga'],
    'Outdoor': ['pool', 'swimming', 'beach', 'garden', 'terrace', 'patio', 'bbq', 'barbecue'],
    'Business Facilities': ['business center', 'meeting', 'conference', 'banquet', 'fax', 'photocopy'],
    'Family Facilities': ['child', 'kids', 'babysitting', 'family room', 'playground', 'crib'],
    'Transport': ['parking', 'shuttle', 'airport', 'transfer', 'car hire', 'taxi'],
    'Safety': ['safe', 'security', 'fire', 'smoke detector', 'cctv'],
    'Accessibility': ['wheelchair', 'disabled', 'accessible', 'elevator', 'lift'],
    'Policies': ['cancellation', 'refundable', 'pet', 'smoking', 'check-in', 'checkout', 'front desk']
};

const getCategory = (amenity) => {
    const lower = amenity.toLowerCase();
    for (const [cat, keywords] of Object.entries(CATEGORIES)) {
        if (keywords.some(kw => lower.includes(kw))) {
            return cat;
        }
    }
    return 'General Facilities';
};

const getIcon = (amenity) => {
    const lower = amenity.toLowerCase();
    if (lower.includes('wifi') || lower.includes('internet') || lower.includes('wlan') || lower.includes('wi-fi')) return <Wifi size={16} />;
    if (lower.includes('park') || lower.includes('car')) return <Car size={16} />;
    if (lower.includes('breakfast') || lower.includes('coffee') || lower.includes('tea') || lower.includes('cafe')) return <Coffee size={16} />;
    if (lower.includes('gym') || lower.includes('fitness') || lower.includes('health') || lower.includes('workout')) return <Dumbbell size={16} />;
    if (lower.includes('pool') || lower.includes('swim') || lower.includes('beach') || lower.includes('waves')) return <Waves size={16} />;
    if (lower.includes('tv') || lower.includes('television')) return <Tv size={16} />;
    if (lower.includes('air condition') || lower.includes('ac ') || lower.includes('cooling')) return <Wind size={16} />;
    if (lower.includes('bath') || lower.includes('shower') || lower.includes('toilet') || lower.includes('hairdryer')) return <Bath size={16} />;
    if (lower.includes('business') || lower.includes('meet') || lower.includes('conference') || lower.includes('desk')) return <Briefcase size={16} />;
    if (lower.includes('child') || lower.includes('kid') || lower.includes('baby')) return <Baby size={16} />;
    if (lower.includes('safe') || lower.includes('security') || lower.includes('fire') || lower.includes('smoke')) return <Shield size={16} />;
    if (lower.includes('bed') || lower.includes('room') || lower.includes('mattress')) return <Bed size={16} />;
    if (lower.includes('restaurant') || lower.includes('din') || lower.includes('meal') || lower.includes('food') || lower.includes('lunch') || lower.includes('dinner')) return <Utensils size={16} />;
    if (lower.includes('airport') || lower.includes('flight') || lower.includes('transfer') || lower.includes('shuttle')) return <PlaneTakeoff size={16} />;
    if (lower.includes('computer') || lower.includes('monitor') || lower.includes('pc')) return <Monitor size={16} />;
    if (lower.includes('lock') || lower.includes('key')) return <Lock size={16} />;
    if (lower.includes('wheelchair') || lower.includes('disabled') || lower.includes('accessible') || lower.includes('elevator') || lower.includes('lift')) return <Accessibility size={16} />;
    if (lower.includes('heat') || lower.includes('fire') || lower.includes('warm')) return <Flame size={16} />;
    if (lower.includes('bus') || lower.includes('transit')) return <Bus size={16} />;
    return <CheckCircle2 size={16} />;
};

const extractAmenities = (hotelStatic, hotelDynamic, rooms) => {
    let rawList = [];

    // Gather raw items from all possible fields
    if (hotelStatic?.Facilities) rawList.push(hotelStatic.Facilities);
    if (hotelStatic?.HotelFacilities) rawList.push(hotelStatic.HotelFacilities);
    if (hotelStatic?.HotelPolicyDetail) rawList.push(hotelStatic.HotelPolicyDetail);
    if (hotelDynamic?.HotelFacilities) rawList.push(hotelDynamic.HotelFacilities);
    
    if (rooms && Array.isArray(rooms)) {
        rooms.forEach(room => {
            if (room.Amenities) rawList.push(room.Amenities);
            if (room.RoomAmenities) rawList.push(room.RoomAmenities);
            if (room.Inclusion) rawList.push(room.Inclusion);
            if (room.RoomPromotion) rawList.push(room.RoomPromotion);
            if (room.RoomTypeName && (room.RoomTypeName.toLowerCase().includes('breakfast') || room.RoomTypeName.toLowerCase().includes('dinner'))) {
                rawList.push(room.RoomTypeName);
            }
        });
    }

    // Flatten arrays, strip HTML, split by commas
    const uniqueAmenities = new Set();
    
    // Deep flatten helper
    const processItem = (item) => {
        if (!item) return;
        if (Array.isArray(item)) {
            item.forEach(processItem);
        } else if (typeof item === 'string') {
            let noHtml = item.replace(/<li[^>]*>|<br\s*\/?>|<p[^>]*>|<div[^>]*>/gi, ',');
            noHtml = noHtml.replace(/<[^>]*>?/gm, ''); 
            
            noHtml.split(/[,|;]/).forEach(str => {
                let cleaned = str.trim();
                cleaned = cleaned.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '').trim();
                if (cleaned.length === 0 || cleaned.length > 120) return;
                const normalized = cleaned.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
                uniqueAmenities.add(normalized);
            });
        }
    };

    rawList.forEach(processItem);
    return Array.from(uniqueAmenities).sort();
};

const HotelAmenitiesParser = ({ hotelStatic, hotelDynamic, rooms, hotelName }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('');
    const contentRef = useRef(null);

    const { categorizedAmenities, allAmenities } = useMemo(() => {
        const all = extractAmenities(hotelStatic, hotelDynamic, rooms);
        const groups = {};
        all.forEach(am => {
            const cat = getCategory(am);
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(am);
        });

        const order = [
            'Internet', 'Room Amenities', 'Bathroom', 'Meals & Inclusions', 
            'Wellness', 'Outdoor', 'Family Facilities', 'Business Facilities', 
            'Transport', 'Safety', 'Accessibility', 'Policies', 'General Facilities'
        ];

        const categorized = Object.keys(groups)
            .sort((a, b) => {
                let idxA = order.indexOf(a);
                let idxB = order.indexOf(b);
                if (idxA === -1) idxA = 99;
                if (idxB === -1) idxB = 99;
                return idxA - idxB;
            })
            .map(cat => ({
                category: cat,
                items: groups[cat].sort()
            }));

        return { categorizedAmenities: categorized, allAmenities: all };
    }, [hotelStatic, hotelDynamic, rooms]);

    useEffect(() => {
        if (isModalOpen && categorizedAmenities.length > 0) {
            setActiveTab(categorizedAmenities[0].category);
        }
    }, [isModalOpen, categorizedAmenities]);

    if (allAmenities.length === 0) {
        return <div style={{ color: '#64748b', fontStyle: 'italic', padding: '20px 0' }}>No amenities information is available for this property.</div>;
    }

    const previewAmenities = allAmenities.slice(0, 4); // First 4 for preview

    const scrollToCategory = (category) => {
        setActiveTab(category);
        const element = document.getElementById(`amenity-section-${category}`);
        if (element && contentRef.current) {
            contentRef.current.scrollTo({
                top: element.offsetTop - 140, // Offset for sticky headers
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="dynamic-amenities-container">
            <style>{`
                /* Preview Styles */
                .amenities-preview {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 20px;
                    margin-top: 10px;
                }
                .amenity-preview-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 15px;
                    color: #4a4a4a;
                    font-weight: 500;
                }
                .amenity-preview-icon {
                    color: #757575;
                    display: flex;
                    align-items: center;
                }
                .view-all-btn {
                    color: #008cff;
                    font-weight: 700;
                    font-size: 15px;
                    cursor: pointer;
                    background: none;
                    border: none;
                    padding: 0;
                    font-family: 'Inter', sans-serif;
                }
                .view-all-btn:hover {
                    text-decoration: underline;
                }

                /* Modal Styles */
                .amenity-modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.6);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                .amenity-modal-content {
                    background: #fff;
                    width: 100%;
                    max-width: 900px;
                    max-height: 90vh;
                    border-radius: 8px;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                    overflow: hidden;
                    animation: slideUp 0.3s ease-out;
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .am-modal-header {
                    padding: 24px;
                    background: #fff;
                    position: relative;
                    border-bottom: 1px solid #eaeaea;
                }
                .am-modal-title {
                    font-family: 'Outfit', sans-serif;
                    font-size: 24px;
                    font-weight: 800;
                    color: #000;
                    margin: 0;
                }
                .am-close-btn {
                    position: absolute;
                    top: 24px;
                    right: 24px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #4a4a4a;
                    padding: 4px;
                    border-radius: 50%;
                    transition: background 0.2s;
                }
                .am-close-btn:hover {
                    background: #f1f1f1;
                }
                
                .am-tabs-container {
                    display: flex;
                    overflow-x: auto;
                    background: #fff;
                    border-bottom: 1px solid #eaeaea;
                    position: sticky;
                    top: 0;
                    z-index: 10;
                    box-shadow: 0 4px 6px -6px rgba(0,0,0,0.1);
                }
                .am-tabs-container::-webkit-scrollbar { display: none; }
                .am-tab {
                    padding: 16px 24px;
                    font-size: 13px;
                    font-weight: 700;
                    color: #4a4a4a;
                    cursor: pointer;
                    white-space: nowrap;
                    text-transform: uppercase;
                    border-bottom: 3px solid transparent;
                    transition: all 0.2s;
                }
                .am-tab.active {
                    color: #000;
                    border-bottom-color: #008cff;
                }

                .am-modal-body {
                    padding: 24px;
                    overflow-y: auto;
                    flex: 1;
                    scroll-behavior: smooth;
                }
                
                .am-category-section {
                    margin-bottom: 32px;
                }
                .am-category-title {
                    font-size: 18px;
                    font-weight: 700;
                    color: #000;
                    margin-bottom: 16px;
                }
                .am-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 16px 24px;
                }
                @media(max-width: 768px) {
                    .am-grid { grid-template-columns: repeat(2, 1fr); }
                }
                @media(max-width: 480px) {
                    .am-grid { grid-template-columns: 1fr; }
                }
                .am-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    font-size: 14px;
                    color: #4a4a4a;
                }
                .am-item-icon {
                    color: #757575;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                }
            `}</style>

            {/* Inline Preview */}
            <div className="amenities-preview">
                {previewAmenities.map((item, idx) => (
                    <div key={idx} className="amenity-preview-item">
                        <div className="amenity-preview-icon">
                            {getIcon(item)}
                        </div>
                        <span>{item}</span>
                    </div>
                ))}
                {allAmenities.length > 0 && (
                    <button className="view-all-btn" onClick={() => setIsModalOpen(true)}>
                        View All
                    </button>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="amenity-modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="amenity-modal-content" onClick={e => e.stopPropagation()}>
                        
                        <div className="am-modal-header">
                            <h2 className="am-modal-title">Amenities at {hotelName || 'Property'}</h2>
                            <button className="am-close-btn" onClick={() => setIsModalOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="am-tabs-container">
                            {categorizedAmenities.map((group, idx) => (
                                <div 
                                    key={idx} 
                                    className={`am-tab ${activeTab === group.category ? 'active' : ''}`}
                                    onClick={() => scrollToCategory(group.category)}
                                >
                                    {group.category}
                                </div>
                            ))}
                        </div>

                        <div className="am-modal-body" ref={contentRef}>
                            {categorizedAmenities.map((group, idx) => (
                                <div key={idx} id={`amenity-section-${group.category}`} className="am-category-section">
                                    <div className="am-category-title">{group.category}</div>
                                    <div className="am-grid">
                                        {group.items.map((item, i) => (
                                            <div key={i} className="am-item">
                                                <div className="am-item-icon">
                                                    {getIcon(item)}
                                                </div>
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default HotelAmenitiesParser;
