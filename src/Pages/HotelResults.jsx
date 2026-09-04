import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FooterOne from '../Components/Footer/FooterOne';
import HeaderOne from '../Components/Header/HeaderOne';
import {
  Building2, Star, MapPin, Wifi, Car, Coffee, Dumbbell, Waves,
  SlidersHorizontal, ChevronDown, ChevronUp, Search, Loader2,
  Calendar, Users, X, ShieldCheck, ArrowRight, RefreshCw
} from 'lucide-react';

const HOTEL_API = process.env.REACT_APP_HOTEL_API_BASE_URL || 'http://localhost:8009/api/hotel';

const AMENITY_ICONS = {
  'Wi-Fi': <Wifi size={13} />, 'Parking': <Car size={13} />, 'Restaurant': <Coffee size={13} />,
  'Gym': <Dumbbell size={13} />, 'Pool': <Waves size={13} />,
};

const MEAL_TYPES = { 0: 'Room Only', 1: 'Breakfast', 2: 'Half Board', 3: 'Full Board', 4: 'All Inclusive' };

const getGlobalRatingNumber = (ratingStr) => {
  if (typeof ratingStr === 'number') return ratingStr;
  if (!ratingStr) return 0;
  const s = ratingStr.toString().toLowerCase();
  if (s.includes('five') || s.includes('5')) return 5;
  if (s.includes('four') || s.includes('4')) return 4;
  if (s.includes('three') || s.includes('3')) return 3;
  if (s.includes('two') || s.includes('2')) return 2;
  if (s.includes('one') || s.includes('1')) return 1;
  return 0;
};

function StarRating({ rating }) {
  const stars = Math.round(getGlobalRatingNumber(rating) || 3);
  return (
    <span style={{ display: 'inline-flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={13} fill={i <= stars ? '#f59e0b' : 'none'} color={i <= stars ? '#f59e0b' : '#d1d5db'} />
      ))}
    </span>
  );
}

export default function HotelResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchState = location.state;

  const [isLoading, setIsLoading] = useState(true);
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState(null);
  const [showDebug, setShowDebug] = useState(false);

  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedStars, setSelectedStars] = useState([]);
  const [refundableOnly, setRefundableOnly] = useState(false);
  const [mealFilter, setMealFilter] = useState(0);
  const [sortBy, setSortBy] = useState('price_asc');
  const [hotelNameFilter, setHotelNameFilter] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedGuestRatings, setSelectedGuestRatings] = useState([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [traceId, setTraceId] = useState('');

  // Show More states
  const [showAllPrices, setShowAllPrices] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showAllPropertyTypes, setShowAllPropertyTypes] = useState(false);

  // ─── Search Hotels using Affiliate API ──────────────────────────────────
  const fetchHotels = useCallback(async (state) => {
    setIsLoading(true);
    setError('');
    setDebugInfo(null);
    try {
      const searchPayload = {
        CheckIn: state.checkIn,   // YYYY-MM-DD
        CheckOut: state.checkOut, // YYYY-MM-DD
        GuestNationality: state.GuestNationality || 'IN',
        PaxRooms: Array.from({ length: state.rooms || 1 }, (_, i) => {
          const totalRooms = state.rooms || 1;
          
          const totalAdults = state.adults || 2;
          let adults = Math.floor(totalAdults / totalRooms);
          if (i < totalAdults % totalRooms) adults += 1;
          
          const totalChildren = state.children || 0;
          let childrenCount = Math.floor(totalChildren / totalRooms);
          if (i < totalChildren % totalRooms) childrenCount += 1;
          
          const allAges = state.childrenAges || [];
          let ageStartIndex = 0;
          for(let j=0; j<i; j++) {
             ageStartIndex += Math.floor(totalChildren / totalRooms) + (j < totalChildren % totalRooms ? 1 : 0);
          }
          const roomChildrenAges = allAges.slice(ageStartIndex, ageStartIndex + childrenCount);
          
          return {
            Adults: adults || 1,
            Children: childrenCount,
            ChildrenAges: roomChildrenAges,
          };
        }),
        ResponseTime: 23.0,
        IsDetailedResponse: true,
        Filters: {
          Refundable: false,
          NoOfRooms: state.rooms || 1,
          MealType: 'All',
          StarRating: 'All',
        },
        // If a specific hotel code is provided (e.g. from hotel detail page)
        ...(state.hotelCode ? { HotelCodes: state.hotelCode } : {}),
        // If a city code is provided for city-wide search
        ...(state.cityCode && !state.hotelCode ? { CityId: String(state.cityCode) } : {}),
      };

      const searchRes = await fetch(`${HOTEL_API}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchPayload),
      });

      const searchData = await searchRes.json();
      // Affiliate API response: { Status:{Code:200, Description:"Successful"}, HotelResult:[{HotelCode, Currency, Rooms:[...]}] }
      const affiliateStatus = searchData?.Status;
      let results = searchData?.HotelResult || [];

      const apiError = (affiliateStatus && affiliateStatus.Code !== 200)
        ? { ErrorMessage: affiliateStatus.Description || 'Search failed' }
        : null;

      setTraceId(state.traceId || '');
      setHotels(results);

      setDebugInfo({
        requestPayload: searchPayload,
        responseStatus: affiliateStatus?.Code,
        error: apiError,
        rawResultsCount: results.length,
        filteredResultsCount: results.length
      });

      if (apiError) {
        setError(`API Error: ${apiError.ErrorMessage}`);
      } else if (results.length === 0) {
        setError(
          state.hotelCode
            ? 'This specific hotel is not available for these dates.'
            : 'No hotels available for these dates. Please try different dates or another city.'
        );
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load hotels. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!searchState) { navigate('/'); return; }
    try { sessionStorage.setItem('hotelSearchState', JSON.stringify(searchState)); } catch (_) { }
    fetchHotels(searchState);
  }, [searchState, navigate, fetchHotels]);

  // ─── Sort & Filter ─────────────────────────────────────────────────────────
  const filteredHotels = hotels
    .filter(h => {
      // Affiliate API format: h = { HotelCode, Currency, Rooms:[{TotalFare, ...}] }
      const price = h.Rooms?.[0]?.TotalFare ?? 0;
      const starRating = h.HotelRating || h.StarRating || h.Rating || h.starRating || 0;
      const ratingNum = getGlobalRatingNumber(starRating);

      if (selectedPriceRanges.length > 0) {
        let priceMatched = false;
        for (const range of selectedPriceRanges) {
          if (range === '0-1000' && price < 1000) priceMatched = true;
          else if (range === '1001-2000' && price >= 1001 && price <= 2000) priceMatched = true;
          else if (range === '2001-4000' && price >= 2001 && price <= 4000) priceMatched = true;
          else if (range === '4001-7000' && price >= 4001 && price <= 7000) priceMatched = true;
          else if (range === '7001+' && price > 7000) priceMatched = true;
        }
        if (!priceMatched) return false;
      }

      if (hotelNameFilter) {
        if (!(h.HotelName || '').toLowerCase().includes(hotelNameFilter.toLowerCase())) return false;
      }

      if (selectedStars.length > 0 && !selectedStars.includes(Math.round(ratingNum))) return false;

      if (selectedGuestRatings.length > 0) {
        const ratingMatch = (ratingNum >= 4.5 && selectedGuestRatings.includes('Excellent')) ||
          (ratingNum >= 3.5 && ratingNum < 4.5 && selectedGuestRatings.includes('Very Good')) ||
          (ratingNum >= 2.5 && ratingNum < 3.5 && selectedGuestRatings.includes('Good'));
        if (!ratingMatch) return false;
      }

      if (selectedPropertyTypes.length > 0) {
        const hName = (h.HotelName || '').toLowerCase();
        let pType = 'hotel';
        if (hName.includes('resort')) pType = 'resort';
        if (hName.includes('villa')) pType = 'villa';
        if (hName.includes('apartment') || hName.includes('apt')) pType = 'apartment';
        if (hName.includes('hostel')) pType = 'hostel';
        if (!selectedPropertyTypes.map(t => t.toLowerCase()).includes(pType)) return false;
      }

      if (selectedAmenities.length > 0) {
        const amenitiesFromRooms = h.Rooms?.[0]?.Amenities || [];
        const hotelFacs = typeof h.HotelFacilities === 'string' ? h.HotelFacilities.toLowerCase() : '';
        const roomFacsStr = amenitiesFromRooms.join(' ').toLowerCase();
        
        // If neither the hotel nor the room has facilities listed, we can't guarantee they have the amenity.
        // Or if they do have some, we check them.
        if (hotelFacs || roomFacsStr) {
          const combinedFacs = `${hotelFacs} ${roomFacsStr}`;
          const hasAllAmenities = selectedAmenities.every(a => combinedFacs.includes(a.toLowerCase()));
          if (!hasAllAmenities) return false;
        } else {
          // If no facility info is available at all, strict filtering means we hide it.
          // Alternatively, we can let it pass, but typically filters are strict.
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      const pa = a.Rooms?.[0]?.TotalFare ?? 0;
      const pb = b.Rooms?.[0]?.TotalFare ?? 0;
      if (sortBy === 'price_asc') return pa - pb;
      if (sortBy === 'price_desc') return pb - pa;
      if (sortBy === 'rating') return getGlobalRatingNumber(b.HotelRating || b.StarRating || 0) - getGlobalRatingNumber(a.HotelRating || a.StarRating || 0);
      return 0;
    });

  const nights = searchState
    ? Math.ceil((new Date(searchState.checkOut) - new Date(searchState.checkIn)) / (1000 * 60 * 60 * 24))
    : 1;

  const toggleStar = (s) => setSelectedStars(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const toggleArray = (setter, val) => setter(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);

  const handleSelectHotel = (hotel) => {
    navigate('/hotel-detail', {
      state: {
        ...searchState,
        hotel,
        nights,
        traceId,
      }
    });
  };

  return (
    <>
      <HeaderOne />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800&display=swap');
        .hr-page { background: #eaeaef; min-height: 100vh; font-family: 'Inter', sans-serif; }
        .hr-topbar { position: relative; background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 60px 0 50px; color: #ffffff !important; overflow: hidden; }
        .hr-topbar::before { content: ''; position: absolute; top: -50%; left: -10%; width: 60%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0) 70%); pointer-events: none; }
        .hr-topbar::after { content: ''; position: absolute; bottom: -50%; right: -10%; width: 50%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0) 70%); pointer-events: none; }
        .hr-topbar-inner { max-width: 1200px; margin: 0 auto; padding: 0 20px; position: relative; z-index: 1; }
        .hr-breadcrumb { font-size: 13px; color: rgba(255,255,255,0.8); margin-bottom: 16px; display: flex; align-items: center; gap: 8px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
        .hr-breadcrumb span { transition: color 0.2s; color: rgba(255,255,255,0.8); }
        .hr-breadcrumb span[style*="cursor: pointer"]:hover { color: #ffffff; }
        .hr-topbar h1 { font-family: 'Outfit', sans-serif; font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 800; margin: 0 0 24px; letter-spacing: -0.5px; color: #ffffff !important; }
        .hr-topbar-meta { display: flex; gap: 12px; flex-wrap: wrap; }
        .hr-topbar-meta span.hr-meta-pill { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); padding: 10px 18px; border-radius: 30px; font-size: 14px; color: #ffffff; font-weight: 500; backdrop-filter: blur(10px); }
        .hr-topbar-meta span.hr-modify-btn { display: inline-flex; align-items: center; gap: 8px; background: #ffffff; padding: 10px 24px; border-radius: 30px; cursor: pointer; font-size: 15px; font-weight: 700; color: #1e3a8a; box-shadow: 0 4px 15px rgba(0,0,0,0.15); transition: all 0.3s ease; }
        .hr-topbar-meta span.hr-modify-btn:hover { background: #f8fafc; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.2); }
        @media(max-width: 600px) {
            .hr-topbar { padding: 40px 0 30px; }
            .hr-topbar h1 { font-size: 1.8rem; margin-bottom: 16px; }
            .hr-topbar-meta { gap: 8px; }
            .hr-topbar-meta span.hr-meta-pill, .hr-topbar-meta span.hr-modify-btn { padding: 6px 12px; font-size: 12px; }
        }
        
        .hr-content { max-width: 1200px; margin: 40px auto 0; padding: 0 20px 40px; display: grid; grid-template-columns: 280px 1fr; gap: 32px; }
        .hr-content main { min-width: 0; }
        @media(max-width: 900px) { .hr-content { grid-template-columns: 1fr; margin-top: 20px; } .hr-sidebar { display: none; } .hr-sidebar.mobile-open { display: block; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999; background: #fff; padding: 0; margin: 0; overflow-y: auto; } .hr-sidebar.mobile-open .hr-sidebar-card { border: none; box-shadow: none; border-radius: 0; margin: 0; } }
        
        /* Sidebar */
        .hr-sidebar { position: sticky; top: 100px; height: fit-content; }
        .hr-sidebar-card { background: #fff; border-radius: 4px; overflow: visible; box-shadow: 0 1px 4px rgba(0,0,0,0.1); margin-bottom: 16px; border: 1px solid #e2e8f0; }
        .hr-sidebar-header { padding: 20px; font-weight: 800; font-size: 22px; color: #000; display: flex; justify-content: space-between; align-items: center; }
        .hr-sidebar-body { padding: 0 20px 20px; max-height: calc(100vh - 120px); overflow-y: auto; }
        .hr-sidebar-body::-webkit-scrollbar { width: 6px; }
        .hr-sidebar-body::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
        .hr-sidebar-body::-webkit-scrollbar-thumb { background: #94a3b8; border-radius: 4px; }
        .hr-filter-section { margin-bottom: 24px; }
        .hr-filter-title { font-size: 16px; font-weight: 600; color: #1a1a2e; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
        .hr-filter-label { display: flex; align-items: flex-start; gap: 12px; font-size: 14px; font-weight: 500; color: #1a1a2e; cursor: pointer; margin-bottom: 16px; user-select: none; -webkit-user-select: none; -webkit-tap-highlight-color: transparent; outline: none; }
        .hr-filter-label input[type="checkbox"] { 
            display: block !important; 
            visibility: visible !important; 
            opacity: 1 !important; 
            width: 18px !important; 
            height: 18px !important; 
            min-width: 18px !important; 
            min-height: 18px !important; 
            accent-color: #008cff; 
            cursor: pointer; 
            margin: 2px 0 0 0 !important; 
            outline: none !important;
            box-shadow: none !important;
            -webkit-tap-highlight-color: transparent;
            appearance: auto !important; 
            -webkit-appearance: checkbox !important;
        }
        .hr-star-btn { border: 1px solid #cbd5e1; background: #fff; border-radius: 4px; padding: 6px 12px; font-size: 13px; font-weight: 600; color: #475569; cursor: pointer; transition: all 0.15s; margin: 0 6px 8px 0; }
        .hr-star-btn.active { border-color: #008cff; background: #e5f3ff; color: #008cff; }
        .hr-show-more { color: #008cff; font-size: 14px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 4px; background: none; border: none; padding: 0; margin-top: 4px; }
        
        /* Mobile Filter Toggle Button */
        .hr-mobile-filter-btn { display: none; background: #1a1a2e; color: #fff; border: none; padding: 12px 20px; border-radius: 8px; font-weight: 700; font-family: 'Outfit', sans-serif; cursor: pointer; align-items: center; justify-content: center; gap: 8px; width: 100%; margin-bottom: 16px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        @media(max-width: 900px) { .hr-mobile-filter-btn { display: flex; } }

        /* Sort bar */
        .hr-sortbar { display: flex; align-items: center; flex-wrap: wrap; background: #fff; border-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.1); margin-bottom: 24px; border: 1px solid #e2e8f0; position: sticky; top: 100px; z-index: 10; }
        .hr-sort-label { font-size: 14px; font-weight: 700; color: #000; padding: 16px 20px; border-right: 1px solid #e2e8f0;}
        .hr-sort-btn { background: transparent; border: none; padding: 16px 20px; font-size: 14px; font-weight: 600; color: #4a4a4a; cursor: pointer; transition: all 0.15s; border-bottom: 3px solid transparent; flex: 1; text-align: center; }
        @media(max-width: 600px) { .hr-sort-label { width: 100%; border-right: none; border-bottom: 1px solid #e2e8f0; } .hr-sort-btn { padding: 12px 10px; font-size: 13px; } }
        .hr-sort-btn:hover { color: #008cff; }
        .hr-sort-btn.active { color: #008cff; border-bottom-color: #008cff; }
        .hr-count { margin-left: auto; font-size: 14px; font-weight: 700; color: #000; padding-right: 20px;}
        @media(max-width: 600px) { .hr-count { display: none; } }
        
        /* Hotel cards (Professional Layout) */
        .hr-card { background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); margin-bottom: 20px; display: flex; transition: box-shadow 0.2s, transform 0.2s; border: 1px solid #e2e8f0; cursor: pointer; min-height: 210px; }
        .hr-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.12); transform: translateY(-2px); }
        .hr-card-img { width: 260px; flex-shrink: 0; position: relative; overflow: hidden; padding: 0; }
        .hr-card-img img { width: 100%; height: 100%; object-fit: cover; display: block; border-radius: 8px 0 0 8px; background: #f1f5f9; position: absolute; top: 0; left: 0; }
        .hr-card-body { flex: 1; display: flex; min-width: 0; }
        .hr-card-middle { flex: 1; padding: 16px 20px; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
        .hr-card-right { width: 220px; border-left: 1px solid #e2e8f0; padding: 16px 20px; display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-end; background: #fafafa;}
        .hr-hotel-name { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 20px; color: #1a1a2e; margin-bottom: 6px; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; white-space: normal; }
        .hr-hotel-name:hover { color: #008cff; }
        .hr-hotel-loc { display: flex; align-items: flex-start; gap: 5px; font-size: 13px; color: #4a4a4a; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .hr-amenities { display: flex; gap: 8px 16px; flex-wrap: wrap; margin-top: auto; padding-top: 12px; border-top: 1px solid #f1f5f9; width: 100%; overflow: hidden; height: 32px; }
        .hr-amenity { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #475569; font-weight: 500; white-space: nowrap; }
        .hr-amenity svg { color: #10b981; }
        .hr-meal-badge { display: inline-flex; align-items: center; gap: 5px; color: #d97706; background: #fef3c7; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; margin-bottom: 8px;}
        
        .hr-price-block { text-align: right; width: 100%; margin-bottom: 12px;}
        .hr-price-strike { font-size: 14px; color: #94a3b8; text-decoration: line-through; margin-bottom: 2px; font-weight: 500; }
        .hr-price-big { font-family: 'Inter', sans-serif; font-weight: 900; font-size: 26px; color: #0f172a; line-height: 1; margin-bottom: 4px; letter-spacing: -0.5px; }
        .hr-price-taxes { font-size: 12px; color: #64748b; margin-bottom: 4px; }
        .hr-book-btn { background: linear-gradient(93deg,#ef6614,#d51226); color: #fff; border: none; border-radius: 6px; padding: 12px 24px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; width: 100%; text-transform: uppercase; box-shadow: 0 4px 12px rgba(239, 102, 20, 0.2); }
        .hr-book-btn:hover { box-shadow: 0 6px 16px rgba(213,18,38,0.3); transform: translateY(-1px); }
        .hr-price-per-night { font-size: 11px; color: #94a3b8; margin-bottom: 0; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;}
        
        @media(max-width: 900px) and (min-width: 701px) {
            .hr-card-img { width: 220px; padding: 0; }
            .hr-card-img img { position: absolute; }
            .hr-card-middle { padding: 12px 16px; }
            .hr-card-right { width: 180px; padding: 12px 16px; }
            .hr-hotel-name { font-size: 18px; }
            .hr-price-big { font-size: 22px; }
        }
        @media(max-width: 700px) { 
            .hr-card { flex-direction: column; border-radius: 12px; min-height: auto; } 
            .hr-card-img { width: 100%; height: 200px; padding: 0; position: relative; } 
            .hr-card-img img { position: absolute; height: 100%; border-radius: 12px 12px 0 0; }
            .hr-card-body { flex-direction: column; } 
            .hr-card-middle { padding: 16px; } 
            .hr-hotel-name { font-size: 20px; }
            .hr-card-right { width: 100%; border-left: none; border-top: 1px dashed #e2e8f0; align-items: center; flex-direction: row; justify-content: space-between; background: #fff; padding: 16px; gap: 12px;} 
            .hr-price-block { text-align: left; margin-bottom: 0; width: auto; flex: 1; } 
            .hr-price-big { font-size: 24px; }
            .hr-book-btn { width: auto; padding: 12px 24px; font-size: 14px; white-space: nowrap; flex-shrink: 0; }
        }
        @media(max-width: 480px) {
            .hr-card-right { flex-direction: column; align-items: flex-start; gap: 16px; }
            .hr-book-btn { width: 100%; }
            .hr-price-big { font-size: 22px; }
            .hr-hotel-name { font-size: 18px; }
            .hr-card-img img { height: 180px; }
        }
        /* Loading */
        .hr-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 20px; gap: 20px; }
        .hr-spinner { width: 56px; height: 56px; border: 4px solid #f1f5f9; border-top-color: #ef6614; border-radius: 50%; animation: hr-spin 0.8s linear infinite; }
        @keyframes hr-spin { to { transform: rotate(360deg); } }
        .hr-empty { text-align: center; padding: 60px 20px; background: #fff; border-radius: 4px; }
      `}</style>

      <div className="hr-page">
        {/* Top Bar */}
        <div className="hr-topbar">
          <div className="hr-topbar-inner">
            <div className="hr-breadcrumb">
              <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Home</span>
              <span>›</span>
              <span>Hotels</span>
              <span>›</span>
              <span style={{ color: '#fff' }}>{searchState?.cityName}</span>
            </div>
            <h1>Hotels in {searchState?.cityName}, {searchState?.cityCountry}</h1>
            <div className="hr-topbar-meta">
              <span className="hr-meta-pill"><Calendar size={14} /> {searchState?.checkIn} → {searchState?.checkOut} ({nights} night{nights > 1 ? 's' : ''})</span>
              <span className="hr-meta-pill"><Users size={14} /> {searchState?.rooms} Room · {searchState?.adults} Adult{searchState?.adults > 1 ? 's' : ''}</span>
              <span className="hr-modify-btn" onClick={() => navigate('/', { state: { activeTabId: 'hotels' } })}>
                <RefreshCw size={14} /> Modify Search
              </span>
            </div>
          </div>
        </div>

        <div className="hr-content">
          <button className="hr-mobile-filter-btn" onClick={() => setShowFilters(true)}>
            <SlidersHorizontal size={18} /> Show Filters
          </button>

          {/* Sidebar Filters */}
          <aside className={`hr-sidebar ${showFilters ? 'mobile-open' : ''}`}>
            <div className="hr-sidebar-card">
              <div className="hr-sidebar-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <SlidersHorizontal size={18} color="#e8151b" /> Filters
                </span>
                <X
                  size={24}
                  color="#1a1a2e"
                  onClick={() => setShowFilters(false)}
                  style={{ cursor: 'pointer', display: showFilters ? 'block' : 'none' }}
                  className="d-md-none"
                />
              </div>
              <div className="hr-sidebar-body">

                {/* Name Search */}
                <div className="hr-filter-section">
                  <div className="hr-filter-title">Search By Hotel</div>
                  <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input type="text" placeholder="Enter Hotel Name" value={hotelNameFilter}
                      onChange={e => setHotelNameFilter(e.target.value)}
                      style={{ width: '100%', padding: '12px 36px 12px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                </div>

                {/* Price Range */}
                <div className="hr-filter-section">
                  <div className="hr-filter-title">Price (/Night) <ChevronUp size={16} color="#94a3b8" /></div>
                  {[
                    { id: '0-1000', label: 'Less than Rs. 1,000' },
                    { id: '1001-2000', label: 'Rs. 1,001 to Rs. 2,000' },
                    { id: '2001-4000', label: 'Rs. 2,001 to Rs. 4,000' },
                    { id: '4001-7000', label: 'Rs. 4,001 to Rs. 7,000' },
                    { id: '7001+', label: 'More than Rs. 7,000' }
                  ].slice(0, showAllPrices ? undefined : 4).map(p => (
                    <label key={p.id} className="hr-filter-label">
                      <input type="checkbox" checked={selectedPriceRanges.includes(p.id)} onChange={() => toggleArray(setSelectedPriceRanges, p.id)} />
                      {p.label}
                    </label>
                  ))}
                  <button className="hr-show-more" onClick={() => setShowAllPrices(!showAllPrices)}>
                    {showAllPrices ? 'Show less' : 'Show more'} <ChevronDown size={14} style={{ transform: showAllPrices ? 'rotate(180deg)' : 'none' }} />
                  </button>
                </div>

                {/* Star Rating */}
                <div className="hr-filter-section">
                  <div className="hr-filter-title">Star Rating <ChevronUp size={16} color="#94a3b8" /></div>
                  {[5, 4, 3, 2, 1].map(s => (
                    <label key={s} className="hr-filter-label">
                      <input type="checkbox" checked={selectedStars.includes(s)} onChange={() => toggleStar(s)} />
                      {s} Star
                    </label>
                  ))}
                </div>

                {/* Guest Rating */}
                <div className="hr-filter-section">
                  <div className="hr-filter-title">User Ratings <ChevronUp size={16} color="#94a3b8" /></div>
                  {['Excellent', 'Very Good', 'Good'].map(r => (
                    <label key={r} className="hr-filter-label">
                      <input type="checkbox" checked={selectedGuestRatings.includes(r)} onChange={() => toggleArray(setSelectedGuestRatings, r)} />
                      {r}
                    </label>
                  ))}
                </div>

                {/* Property Type */}
                <div className="hr-filter-section">
                  <div className="hr-filter-title">Property Type <ChevronUp size={16} color="#94a3b8" /></div>
                  {['Hotel', 'Resort', 'Villa', 'Apartment', 'Hostel', 'Guesthouse'].slice(0, showAllPropertyTypes ? undefined : 4).map(t => (
                    <label key={t} className="hr-filter-label">
                      <input type="checkbox" checked={selectedPropertyTypes.includes(t.toLowerCase())} onChange={() => toggleArray(setSelectedPropertyTypes, t.toLowerCase())} />
                      {t}
                    </label>
                  ))}
                  <button className="hr-show-more" onClick={() => setShowAllPropertyTypes(!showAllPropertyTypes)}>
                    {showAllPropertyTypes ? 'Show less' : 'Show more'} <ChevronDown size={14} style={{ transform: showAllPropertyTypes ? 'rotate(180deg)' : 'none' }} />
                  </button>
                </div>

                {/* Amenities */}
                <div className="hr-filter-section" style={{ borderBottom: 'none' }}>
                  <div className="hr-filter-title">Amenities <ChevronUp size={16} color="#94a3b8" /></div>
                  {['Wifi', 'Pool', 'Spa', 'Parking', 'Gym', 'Restaurant', 'Bar'].slice(0, showAllAmenities ? undefined : 4).map(a => (
                    <label key={a} className="hr-filter-label">
                      <input type="checkbox" checked={selectedAmenities.includes(a)} onChange={() => toggleArray(setSelectedAmenities, a)} />
                      {a}
                    </label>
                  ))}
                  <button className="hr-show-more" onClick={() => setShowAllAmenities(!showAllAmenities)}>
                    {showAllAmenities ? 'Show less' : 'Show more'} <ChevronDown size={14} style={{ transform: showAllAmenities ? 'rotate(180deg)' : 'none' }} />
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main>
            {/* Sort bar */}
            {!isLoading && !error && (
              <div className="hr-sortbar">
                <span className="hr-sort-label">Sort by:</span>
                {[
                  { key: 'price_asc', label: 'Price: Low → High' },
                  { key: 'price_desc', label: 'Price: High → Low' },
                  { key: 'rating', label: 'Star Rating' },
                ].map(s => (
                  <button key={s.key} className={`hr-sort-btn${sortBy === s.key ? ' active' : ''}`}
                    onClick={() => setSortBy(s.key)}>{s.label}</button>
                ))}
                <span className="hr-count">{filteredHotels.length} hotels found</span>
              </div>
            )}

            {/* Loading */}
            {isLoading && (
              <div className="hr-loading">
                <div className="hr-spinner"></div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '700', fontSize: '20px', color: '#1a1a2e' }}>
                  Searching Hotels in {searchState?.cityName}...
                </div>
                <div style={{ color: '#64748b', fontSize: '14px' }}>Checking live availability for your dates</div>
              </div>
            )}

            {/* Error */}
            {!isLoading && error && (
              <div className="hr-empty">
                <Building2 size={56} color="#cbd5e1" style={{ marginBottom: '16px' }} />
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '700', color: '#1a1a2e', marginBottom: '8px' }}>{error}</h3>
                <button onClick={() => navigate('/', { state: { activeTabId: 'hotels' } })}
                  style={{ background: '#e8151b', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 28px', fontWeight: '700', cursor: 'pointer', marginTop: '16px' }}>
                  Try Another Search
                </button>
              </div>
            )}

            {/* Hotel cards */}
            {!isLoading && !error && filteredHotels.map((hotel, idx) => {
              const room = hotel.Rooms?.[0];
              // Affiliate API: TotalFare is the full stay fare per room; TotalTax is included in it
              const totalFare = room?.TotalFare ?? 0;
              const totalTax = room?.TotalTax ?? 0;
              const basePrice = totalFare - totalTax;

              const basePricePerNight = nights > 0 ? Math.round(basePrice / nights) : basePrice;
              const taxPerNight = nights > 0 ? Math.round(totalTax / nights) : totalTax;
              const originalPrice = Math.round(basePricePerNight * 1.35); // simulated strikethrough

              const isRefundable = room?.IsRefundable ?? false;
              const inclusion = room?.Inclusion || 'Room Only';
              // Affiliate API uses HotelCode as identifier, HotelPicture may not be present
              const imgUrl = hotel.HotelPicture && hotel.HotelPicture.startsWith('http') && !hotel.HotelPicture.includes('HotelNA')
                ? hotel.HotelPicture
                : 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&h=280';
              // Room name: Affiliate API returns Name as array
              const roomName = Array.isArray(room?.Name) ? room.Name[0] : (room?.Name || '');
              const starRating = hotel.HotelRating || hotel.StarRating;

              return (
                <div key={hotel.HotelCode || idx} className="hr-card" onClick={() => handleSelectHotel(hotel)}>
                  <div className="hr-card-img">
                    <img
                      src={imgUrl}
                      alt={hotel.HotelName || 'Hotel'}
                      onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&h=280'; }}
                    />
                  </div>
                  <div className="hr-card-body">
                    <div className="hr-card-middle">
                      {starRating ? (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                          <StarRating rating={starRating} />
                        </div>
                      ) : null}

                      {hotel.HotelName && <div className="hr-hotel-name">{hotel.HotelName}</div>}

                      <div className="hr-hotel-loc">
                        <MapPin size={14} color="#008cff" />
                        <span style={{ color: '#008cff', fontWeight: '600' }}>{searchState?.cityName || hotel.HotelCode}</span>
                        {hotel.HotelAddress ? <span style={{ color: '#4a4a4a' }}> | {hotel.HotelAddress.slice(0, 40)}...</span> : ''}
                      </div>

                      <div style={{ marginTop: 'auto' }}>
                        {isRefundable && <span style={{ display: 'inline-block', color: '#22c55e', fontSize: '12px', fontWeight: '700', marginBottom: '8px' }}>✓ Free Cancellation</span>}
                        {inclusion !== 'Room Only' && <div className="hr-meal-badge">✨ {inclusion}</div>}

                        {room?.RoomPromotion && room.RoomPromotion.length > 0 && (
                          <div style={{ color: '#ef6614', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', marginTop: '4px' }}>
                            🎁 {Array.isArray(room.RoomPromotion) ? room.RoomPromotion.join(', ') : room.RoomPromotion}
                          </div>
                        )}

                        {roomName && (
                          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginTop: '4px' }}>
                            🛏 {roomName}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="hr-card-right">
                      <div className="hr-price-block">
                        <div className="hr-price-strike">₹ {originalPrice.toLocaleString()}</div>
                        <div className="hr-price-big">₹ {basePricePerNight.toLocaleString()}</div>
                        <div className="hr-price-taxes">+ ₹ {taxPerNight.toLocaleString()} taxes & fees</div>
                        <div className="hr-price-per-night">Per Night</div>
                      </div>
                      <button className="hr-book-btn">
                        VIEW ROOMS
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* No results after filter */}
            {!isLoading && !error && filteredHotels.length === 0 && hotels.length > 0 && (
              <div className="hr-empty">
                <X size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '700', color: '#1a1a2e' }}>No hotels match your filters</h3>
                <button onClick={() => { setSelectedStars([]); setSelectedPriceRanges([]); setRefundableOnly(false); setHotelNameFilter(''); setSelectedAmenities([]); setSelectedPropertyTypes([]); setSelectedGuestRatings([]); }}
                  style={{ background: '#e8151b', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 24px', fontWeight: '700', cursor: 'pointer', marginTop: '12px' }}>
                  Clear Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      <FooterOne />
    </>
  );
}
