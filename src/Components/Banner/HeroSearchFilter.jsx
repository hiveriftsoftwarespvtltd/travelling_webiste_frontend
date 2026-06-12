import React, { useState, useRef, useEffect } from 'react';
import { Plane, Building2, BusFront, TrainFront, Car, Tent, ArrowRightLeft, ArrowRight, X, Plus, ChevronDown } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { useNavigate, useLocation } from 'react-router-dom';
import AirportAutocomplete from '../Flight/AirportAutocomplete';
import HotelSearchAutocomplete from './HotelSearchAutocomplete';

const AIRPORTS = [
  { code: 'DEL', city: 'New Delhi', name: 'Indira Gandhi International Airport', country: 'India' },
  { code: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji International Airport', country: 'India' },
  { code: 'BLR', city: 'Bengaluru', name: 'Kempegowda International Airport', country: 'India' },
  { code: 'HYD', city: 'Hyderabad', name: 'Rajiv Gandhi International Airport', country: 'India' },
  { code: 'CCU', city: 'Kolkata', name: 'Netaji Subhas Chandra Bose International Airport', country: 'India' },
  { code: 'MAA', city: 'Chennai', name: 'Chennai International Airport', country: 'India' },
  { code: 'AMD', city: 'Ahmedabad', name: 'Sardar Vallabhbhai Patel International Airport', country: 'India' },
  { code: 'GOI', city: 'Goa', name: 'Dabolim Airport', country: 'India' },
  { code: 'PNQ', city: 'Pune', name: 'Pune Airport', country: 'India' },
  { code: 'DXB', city: 'Dubai', name: 'Dubai International Airport', country: 'UAE' },
  { code: 'LHR', city: 'London', name: 'Heathrow Airport', country: 'UK' },
  { code: 'JFK', city: 'New York', name: 'John F. Kennedy International Airport', country: 'USA' },
  { code: 'SIN', city: 'Singapore', name: 'Changi Airport', country: 'Singapore' },
  { code: 'BKK', city: 'Bangkok', name: 'Suvarnabhumi Airport', country: 'Thailand' }
];

const HOTELS = [
  { id: '1', city: 'Goa', state: 'Goa', country: 'India' },
  { id: '2', city: 'Mumbai', state: 'Maharashtra', country: 'India' },
  { id: '3', city: 'New Delhi', state: 'Delhi', country: 'India' },
  { id: '4', city: 'Udaipur', state: 'Rajasthan', country: 'India' },
  { id: '5', city: 'Jaipur', state: 'Rajasthan', country: 'India' },
  { id: '6', city: 'Bangkok', state: 'Central Thailand', country: 'Thailand' },
  { id: '7', city: 'Dubai', state: 'Dubai Emirate', country: 'UAE' },
  { id: '8', city: 'Bali', state: 'Bali Province', country: 'Indonesia' }
];

function HeroSearchFilter() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [tripType, setTripType] = useState('O');
  const [fareType, setFareType] = useState('1');
  const [nonStop, setNonStop] = useState(false);

  // Dropdown States
  const [fromAirport, setFromAirport] = useState(AIRPORTS[0]);
  const [toAirport, setToAirport] = useState(AIRPORTS[1]);
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(null);

  // Flight Travellers & Class States
  const [flightAdults, setFlightAdults] = useState(1);
  const [flightChildren, setFlightChildren] = useState(0);
  const [flightInfants, setFlightInfants] = useState(0);
  const [flightClass, setFlightClass] = useState(1); // 1 = All, 2 = Economy, 3 = PremiumEconomy, 4 = Business, 6 = First

  // Multi-City State
  const [multiCitySegments, setMultiCitySegments] = useState([
    { id: 1, from: AIRPORTS[0], to: AIRPORTS[1], date: new Date() },
    { id: 2, from: AIRPORTS[1], to: AIRPORTS[2], date: new Date(new Date().setDate(new Date().getDate() + 2)) }
  ]);

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [calendarFaresMap, setCalendarFaresMap] = useState({});
  const [returnCalendarFaresMap, setReturnCalendarFaresMap] = useState({});
  const [multiCityFaresMap, setMultiCityFaresMap] = useState({});
  const [isCalendarFaresLoading, setIsCalendarFaresLoading] = useState(false);
  const [isReturnFaresLoading, setIsReturnFaresLoading] = useState(false);
  const [activeCalendarMonth, setActiveCalendarMonth] = useState(new Date());

  const location = useLocation();

  useEffect(() => {
    // If navigation passed a state with activeTabId, use it!
    if (location.state?.activeTabId) {
      const tabMap = { flights: 0, hotels: 1, bus: 2, trains: 3 };
      if (tabMap[location.state.activeTabId] !== undefined) {
        setActiveTab(tabMap[location.state.activeTabId]);
      }
    }

    const handleGlobalTabChange = (e) => {
      if (e.detail && e.detail.tabId) {
        const tabMap = { flights: 0, hotels: 1, bus: 2, trains: 3 };
        if (tabMap[e.detail.tabId] !== undefined) {
          setActiveTab(tabMap[e.detail.tabId]);
        }
      }
    };
    window.addEventListener('globalServiceTabChange', handleGlobalTabChange);
    return () => window.removeEventListener('globalServiceTabChange', handleGlobalTabChange);
  }, [location.state]);

  const handleTabClick = (index) => {
    setActiveTab(index);
    const revMap = { 0: 'flights', 1: 'hotels', 2: 'bus', 3: 'trains' };
    window.dispatchEvent(new CustomEvent('globalServiceTabChange', { detail: { tabId: revMap[index] } }));
  };

  useEffect(() => {
    setActiveCalendarMonth(departureDate);
  }, [departureDate]);

  useEffect(() => {
    setCalendarFaresMap({});
    setReturnCalendarFaresMap({});
  }, [fromAirport?.code, toAirport?.code, flightClass, nonStop]);

  useEffect(() => {
    const fetchFares = async () => {
      if (!fromAirport?.code || !toAirport?.code) return;
      if (fromAirport.code === toAirport.code) return;

      setIsCalendarFaresLoading(true);
      const flightApiBase = process.env.REACT_APP_FLIGHT_API_BASE_URL || 'http://localhost:8009/api/flight';

      // Helper to format local date as YYYY-MM-DD to avoid timezone shifts from .toISOString()
      const formatLocalDate = (d) => {
        const offsetDate = new Date(d.getTime() - (d.getTimezoneOffset() * 60000));
        return offsetDate.toISOString().split('T')[0] + 'T00:00:00';
      };

      const departureStr = activeCalendarMonth
        ? formatLocalDate(activeCalendarMonth)
        : formatLocalDate(new Date());

      const payload = {
        AdultCount: flightAdults,
        ChildCount: flightChildren,
        InfantCount: flightInfants,
        DirectFlight: nonStop,
        OneStopFlight: false,
        JourneyType: 1, // Calendar fare needs JourneyType 1
        PreferredAirlines: null,
        Segments: [
          {
            Origin: fromAirport.code,
            Destination: toAirport.code,
            FlightCabinClass: flightClass || 1,
            PreferredDepartureTime: departureStr,
            PreferredArrivalTime: departureStr
          }
        ],
        Sources: null
      };

      try {
        const response = await fetch(`${flightApiBase}/calendar-fare`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        let fetchedFares = [];
        if (data && data.Response && data.Response.SearchResults) {
          fetchedFares = data.Response.SearchResults;
        }

        // Trigger real-time update check for the active month's departure date
        try {
          const updateResponse = await fetch(`${flightApiBase}/update-calendar-fare`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const updateData = await updateResponse.json();
          if (updateData && updateData.Response && updateData.Response.SearchResults) {
            fetchedFares = [...fetchedFares, ...updateData.Response.SearchResults];
          }
        } catch (updateErr) {
          console.error('Failed to update calendar fare of day in datepicker:', updateErr);
        }

        if (fetchedFares.length > 0) {
          const faresMap = {};
          fetchedFares.forEach(item => {
            if (!item.DepartureDate || item.Fare === undefined) return;
            const dateStr = item.DepartureDate.split('T')[0];
            if (!faresMap[dateStr] || item.Fare < faresMap[dateStr].Fare) {
              faresMap[dateStr] = item;
            }
          });
          setCalendarFaresMap(prev => ({ ...prev, ...faresMap }));
        }
      } catch (error) {
        console.error('Failed to fetch calendar fares for datepicker:', error);
      } finally {
        setIsCalendarFaresLoading(false);
      }

      // If Round Trip, fetch fares for return segment (toAirport ➔ fromAirport)
      if (tripType === 'R') {
        setIsReturnFaresLoading(true);
        const returnPayload = {
          ...payload,
          Segments: [
            {
              Origin: toAirport.code,
              Destination: fromAirport.code,
              FlightCabinClass: flightClass || 1,
              PreferredDepartureTime: departureStr,
              PreferredArrivalTime: departureStr
            }
          ]
        };

        try {
          const response = await fetch(`${flightApiBase}/calendar-fare`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(returnPayload)
          });

          const data = await response.json();
          let fetchedReturnFares = [];
          if (data && data.Response && data.Response.SearchResults) {
            fetchedReturnFares = data.Response.SearchResults;
          }

          // Trigger real-time update check for the return date
          try {
            const updateResponse = await fetch(`${flightApiBase}/update-calendar-fare`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(returnPayload)
            });
            const updateData = await updateResponse.json();
            if (updateData && updateData.Response && updateData.Response.SearchResults) {
              fetchedReturnFares = [...fetchedReturnFares, ...updateData.Response.SearchResults];
            }
          } catch (updateErr) {
            console.error('Failed to update return calendar fare in datepicker:', updateErr);
          }

          if (fetchedReturnFares.length > 0) {
            const faresMap = {};
            fetchedReturnFares.forEach(item => {
              if (!item.DepartureDate || item.Fare === undefined) return;
              const dateStr = item.DepartureDate.split('T')[0];
              if (!faresMap[dateStr] || item.Fare < faresMap[dateStr].Fare) {
                faresMap[dateStr] = item;
              }
            });
            setReturnCalendarFaresMap(prev => ({ ...prev, ...faresMap }));
          }
        } catch (error) {
          console.error('Failed to fetch return calendar fares for datepicker:', error);
        } finally {
          setIsReturnFaresLoading(false);
        }
      }
    };

    fetchFares();
  }, [fromAirport?.code, toAirport?.code, flightClass, nonStop, activeCalendarMonth.getMonth(), activeCalendarMonth.getFullYear(), tripType]);

  // Multi-City Calendar Fares Fetcher Effect
  useEffect(() => {
    if (tripType !== 'M') return;
    setMultiCityFaresMap({});
  }, [
    tripType,
    multiCitySegments.map(s => s.from.code).join('-'),
    multiCitySegments.map(s => s.to.code).join('-'),
    flightClass,
    nonStop
  ]);

  useEffect(() => {
    if (tripType !== 'M') return;

    multiCitySegments.forEach((segment, idx) => {
      if (!segment.from?.code || !segment.to?.code) return;
      if (segment.from.code === segment.to.code) return;

      const fetchSegmentFares = async () => {
        const formatLocalDate = (d) => {
          const offsetDate = new Date(d.getTime() - (d.getTimezoneOffset() * 60000));
          return offsetDate.toISOString().split('T')[0] + 'T00:00:00';
        };
        const departureStr = segment.date
          ? formatLocalDate(segment.date)
          : formatLocalDate(new Date());

        const payload = {
          AdultCount: flightAdults,
          ChildCount: flightChildren,
          InfantCount: flightInfants,
          DirectFlight: nonStop,
          OneStopFlight: false,
          JourneyType: 1,
          PreferredAirlines: null,
          Segments: [
            {
              Origin: segment.from.code,
              Destination: segment.to.code,
              FlightCabinClass: flightClass || 1,
              PreferredDepartureTime: departureStr,
              PreferredArrivalTime: departureStr
            }
          ],
          Sources: null
        };

        try {
          const flightApiBase = process.env.REACT_APP_FLIGHT_API_BASE_URL || 'http://localhost:8009/api/flight';
          const response = await fetch(`${flightApiBase}/calendar-fare`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          const data = await response.json();
          let fetchedFares = [];
          if (data && data.Response && data.Response.SearchResults) {
            fetchedFares = data.Response.SearchResults;
          }

          // Trigger real-time update check for the segment
          try {
            const updateResponse = await fetch(`${flightApiBase}/update-calendar-fare`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            const updateData = await updateResponse.json();
            if (updateData && updateData.Response && updateData.Response.SearchResults) {
              fetchedFares = [...fetchedFares, ...updateData.Response.SearchResults];
            }
          } catch (updateErr) {
            console.error(`Failed to update calendar fare for segment ${idx}:`, updateErr);
          }

          if (fetchedFares.length > 0) {
            const faresMap = {};
            fetchedFares.forEach(item => {
              if (!item.DepartureDate || item.Fare === undefined) return;
              const dateStr = item.DepartureDate.split('T')[0];
              if (!faresMap[dateStr] || item.Fare < faresMap[dateStr].Fare) {
                faresMap[dateStr] = item;
              }
            });

            setMultiCityFaresMap(prev => {
              const updated = { ...prev };
              Object.keys(faresMap).forEach(dateStr => {
                updated[`${idx}-${dateStr}`] = faresMap[dateStr];
              });
              return updated;
            });
          }
        } catch (error) {
          console.error(`Failed to fetch calendar fares for multi-city segment ${idx}:`, error);
        }
      };

      fetchSegmentFares();
    });
  }, [
    tripType,
    multiCitySegments.map(s => s.from.code).join('-'),
    multiCitySegments.map(s => s.to.code).join('-'),
    multiCitySegments.map(s => s.date.getMonth() + '-' + s.date.getFullYear()).join('-'),
    flightClass,
    nonStop
  ]);

  // Hotel Dates & States
  const [hotelCity, setHotelCity] = useState(HOTELS[0]);
  const [checkInDate, setCheckInDate] = useState(new Date(new Date().getTime() + 86400000));
  const [checkOutDate, setCheckOutDate] = useState(new Date(new Date().getTime() + 86400000 * 2));
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      const isOutsideInputCol = !event.target.closest('.sf-input-col') && !event.target.closest('.sf-travellers-box');
      const isDatePickerClick = event.target.closest('.sf-date-picker-wrapper') || event.target.closest('.react-datepicker-popper');
      
      if (isOutsideInputCol || isDatePickerClick) {
        setActiveDropdown(null);
        setSearchQuery('');
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const event = new CustomEvent('tripTypeChanged', { detail: { tripType, segmentsCount: multiCitySegments.length } });
    window.dispatchEvent(event);
  }, [tripType, multiCitySegments.length]);

  const handleSwap = () => {
    const temp = fromAirport;
    setFromAirport(toAirport);
    setToAirport(temp);
  };

  const defaultAirports = AIRPORTS.slice(0, 6);
  const [filteredAirports, setFilteredAirports] = useState(defaultAirports);
  const [isAirportLoading, setIsAirportLoading] = useState(false);

  useEffect(() => {
    // Determine if the active dropdown is an airport dropdown
    const isAirportDropdown = activeDropdown && (activeDropdown === 'from' || activeDropdown === 'to' || activeDropdown.startsWith('from-') || activeDropdown.startsWith('to-'));
    
    if (!isAirportDropdown) return;

    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length === 0) {
        setFilteredAirports(defaultAirports);
        setIsAirportLoading(false);
        return;
      }

      setIsAirportLoading(true);
      try {
        const flightApiBase = process.env.REACT_APP_API_URL || 'http://localhost:8009/api';
        const response = await fetch(`${flightApiBase}/airports/search?q=${searchQuery}`);
        const data = await response.json();
        if (data && data.success) {
          // Map backend schema to what HeroSearchFilter expects
          const mapped = data.data.map(ap => ({
            code: ap.AIRPORTCODE,
            city: ap.CITYNAME,
            name: ap.AIRPORTNAME,
            country: ap.COUNTRYNAME
          }));
          setFilteredAirports(mapped);
        }
      } catch (error) {
        console.error("Error fetching airports:", error);
      } finally {
        setIsAirportLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, activeDropdown]);

  const filteredHotels = HOTELS.filter(ht =>
    ht.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ht.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ht.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSegment = () => {
    if (multiCitySegments.length >= 5) return;
    const lastSeg = multiCitySegments[multiCitySegments.length - 1];
    setMultiCitySegments([...multiCitySegments, {
      id: Date.now(),
      from: lastSeg.to,
      to: AIRPORTS.find(a => a.code !== lastSeg.to.code) || AIRPORTS[0],
      date: new Date(lastSeg.date.getTime() + 86400000)
    }]);
  };

  const handleRemoveSegment = (id) => {
    setMultiCitySegments(multiCitySegments.filter(s => s.id !== id));
  };

  const CustomDateInput = React.forwardRef(({ value, onClick, day, month, weekday, label }, ref) => (
    <div className="sf-input-col" onClick={onClick} ref={ref} style={{ borderRight: '1px solid rgba(0,0,0,0.08)' }}>
      <span className="sf-label-text">{label} <ChevronDown size={14} strokeWidth={2.5} /></span>
      <span className="sf-value-text">{day} <span style={{ fontSize: '18px', fontWeight: '600' }}>{month}</span></span>
      <span className="sf-sub-text">{weekday}</span>
    </div>
  ));

  return (
    <div className={'search-filter-wrapper' + (tripType === 'M' ? ' is-multi-city' : '')} style={{ fontFamily: "'Inter', sans-serif", position: 'relative', zIndex: 100 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        /* ===== WRAPPER ===== */
        .search-filter-wrapper {
          width: 100%;
          max-width: 100%;
          margin: 0;
          font-family: 'Inter', sans-serif;
        }

        /* ===== MAIN CARD ===== */
        .sf-main-box {
          background: #fff;
          border-radius: 24px;
          box-shadow: 0 12px 50px rgba(0,0,0,0.12);
          overflow: visible;
          margin-bottom: 0px;
        }

        /* ===== TABS ===== */
        .sf-header-bar {
          padding: 0 28px 0 2px;
          display: flex;
          align-items: stretch;
          border-bottom: 1px solid #f0f0f0;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .sf-header-bar::-webkit-scrollbar { display: none; }
        .sf-tabs-list {
          display: flex;
          align-items: stretch;
          gap: 0;
        }
        .sf-tab-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 16px 10px 16px;
          margin: 6px 2px 0 2px;
          border: none;
          border-radius: 10px 10px 0 0;
          background: transparent;
          color: #666;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: 0.2s;
          white-space: nowrap;
          font-family: 'Inter', sans-serif;
          position: relative;
        }
        .sf-tab-btn svg { width: 18px; height: 18px; }
        .sf-tab-btn:hover { color: #e8151b; background: #fff5f5; }
        .sf-tab-btn.active { 
            color: #e8151b; 
            background: transparent; 
        }
        .sf-tab-btn.active::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: #e8151b;
            border-radius: 2px;
        }

        /* ===== BODY AREA ===== */
        .sf-body-area {
          padding: 16px 0 20px;
          background: #fff;
          border-radius: 0 0 16px 16px;
        }

        /* ===== RADIO TRIP TYPE ===== */
        .sf-radio-group {
          display: flex;
          gap: 20px;
          margin-bottom: 6px;
          align-items: center;
          padding: 0 28px;
        }
        .sf-radio-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #555;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
        }
        .sf-radio-label.active { color: #e8151b; }
        .sf-radio-label input { display: none; }
        .sf-radio-circle {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2px solid #ccc;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.2s;
          flex-shrink: 0;
        }
        .sf-radio-label.active .sf-radio-circle { border-color: #e8151b; }
        .sf-radio-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #e8151b;
          transform: scale(0);
          transition: 0.2s;
        }
        .sf-radio-label.active .sf-radio-dot { transform: scale(1); }

        /* ===== SEARCH ROW ===== */
        .sf-search-row-container {
          display: flex;
          align-items: stretch;
          gap: 12px;
        }
        .sf-inputs-wrapper {
          display: flex;
          flex: 1;
          border-top: 1.5px solid #eaeaea;
          border-bottom: 1.5px solid #eaeaea;
          border-left: none;
          border-right: none;
          border-radius: 0;
          background: #fff;
          align-items: stretch;
          overflow: visible;
          min-height: 45px;
          min-width: 0;
        }
        .sf-input-col {
          flex: 1;
          padding: 8px 16px;
          border-right: none;
          position: relative;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: left;
          transition: background 0.15s;
          min-width: 0;
        }
        .sf-input-col:not(:last-child)::after {
          content: '';
          position: absolute;
          right: 0;
          top: 15%;
          height: 70%;
          width: 1px;
          background: #e0e0e0;
        }
        .sf-input-col:first-child { border-top-left-radius: 0; border-bottom-left-radius: 0; padding-left: 28px; }
        .sf-input-col:last-child { border-top-right-radius: 0; border-bottom-right-radius: 0; }
        .sf-input-col:hover { background: #fffafa; }

        .sf-label-text {
          font-size: 11px;
          color: #888;
          margin-bottom: 2px;
          display: flex;
          align-items: center;
          gap: 2px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sf-value-text {
          font-size: 18px;
          font-weight: 800;
          color: #111;
          line-height: 1.2;
          margin-bottom: 0px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sf-sub-text {
          font-size: 11px;
          color: #888;
          font-weight: 400;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sf-link-text {
          font-size: 13px;
          font-weight: 600;
          color: #e8151b;
          cursor: pointer;
          margin-top: 4px;
          display: block;
          line-height: 1.7;
        }

        /* ===== SWAP BUTTON ===== */
        .sf-swap-btn {
          position: absolute;
          right: -14px;
          top: 50%;
          transform: translateY(-50%);
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #fff;
          border: 1.5px solid #e0e0e0;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 5;
          color: #e8151b;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          cursor: pointer;
          transition: 0.2s;
        }
        .sf-swap-btn:hover { background: #fff5f5; border-color: #e8151b; }

        /* ===== SEARCH BUTTON ===== */
        .sf-search-btn-col {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        .sf-search-button {
          background: #e8151b;
          color: #fff;
          font-size: 16px;
          font-weight: 700;
          padding: 0 30px;
          height: 50px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Inter', sans-serif;
          white-space: nowrap;
        }
        .sf-search-button:hover {
          background: #c8101a;
          box-shadow: 0 6px 20px rgba(232,21,27,0.3);
          transform: translateY(-1px);
        }

        /* ===== FEATURES BANNER ===== */
        .sf-features-banner {
          background: transparent;
          border-radius: 0;
          box-shadow: none;
          border-top: 1px solid #f0f0f0;
          padding: 20px 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
          margin-top: 0;
        }
        .sf-feature-badge {
          display: flex;
          align-items: center;
          gap: 14px;
          position: relative;
          flex: 1;
        }
        .sf-feature-badge:not(:last-child)::after {
          content: '';
          position: absolute;
          right: -10px;
          top: 10%;
          height: 80%;
          width: 1px;
          background: #eaeaea;
        }
        .sf-feature-icon {
          width: 38px;
          height: 38px;
          background: #fff5f5;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #e8151b;
          font-size: 15px;
          flex-shrink: 0;
        }
        .sf-feature-text { display: flex; flex-direction: column; }
        .sf-feature-title {
          font-size: 14px;
          font-weight: 700;
          color: #222;
          font-family: 'Inter', sans-serif;
        }
        .sf-feature-desc {
          font-size: 12px;
          color: #888;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
        }

        /* ===== DROPDOWNS ===== */
        .sf-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          width: 340px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.15);
          z-index: 9999;
          overflow: hidden;
          border: 1px solid #eee;
        }
        .sf-dropdown-search {
          padding: 14px;
          border-bottom: 1px solid #f0f0f0;
          background: #fafafa;
        }
        .sf-dropdown-search input {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          font-family: 'Inter', sans-serif;
        }
        .sf-dropdown-search input:focus { border-color: #e8151b; }
        .sf-dropdown-list { max-height: 300px; overflow-y: auto; padding: 8px 0; }
        .sf-dropdown-item {
          margin: 2px 8px;
          border-radius: 8px;
          padding: 10px 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: background 0.15s;
        }
        .sf-dropdown-item:hover { background: #fff5f5; }
        .sf-dropdown-icon { color: #aaa; flex-shrink: 0; }
        .sf-dropdown-info { flex: 1; min-width: 0; }
        .sf-dropdown-city { font-weight: 700; color: #222; font-size: 14px; margin-bottom: 2px; font-family: 'Inter', sans-serif; }
        .sf-dropdown-name { font-size: 12px; color: #888; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: 'Inter', sans-serif; }
        .sf-dropdown-code { font-size: 12px; font-weight: 700; color: #e8151b; background: #fff0f0; padding: 4px 8px; border-radius: 6px; flex-shrink: 0; }
        .sf-no-results { padding: 20px; text-align: center; color: #888; font-size: 14px; }

        /* ===== MULTI CITY ===== */
        .sf-multi-city-container { display: flex; flex-direction: column; gap: 16px; width: 100%; }
        .sf-segment-row { display: flex; align-items: stretch; gap: 12px; }
        .sf-segment-row .sf-search-row-container { flex: 1; }
        .sf-remove-btn {
          display: flex; align-items: center; justify-content: center;
          width: 38px; height: 38px; border-radius: 50%;
          background: #fff0f0; color: #e8151b;
          cursor: pointer; border: none; flex-shrink: 0;
          transition: 0.2s; align-self: center;
        }
        .sf-remove-btn:hover { background: #e8151b; color: #fff; }
        .sf-add-flight-btn {
          display: flex; align-items: center; gap: 6px;
          color: #e8151b; background: #fff0f0; border: none;
          padding: 12px 24px; border-radius: 30px; font-weight: 600;
          cursor: pointer; transition: 0.2s; align-self: flex-start;
          font-family: 'Inter', sans-serif; font-size: 14px;
        }
        .sf-add-flight-btn:hover { background: #ffd6d6; }
        .sf-add-flight-btn:disabled { color: #aaa; background: #f5f5f5; cursor: not-allowed; }

        /* ===== DATEPICKER ===== */
        .sf-date-picker-wrapper { display: flex; flex: 1; height: 100%; }
        .react-datepicker-wrapper { display: flex; flex: 1; height: 100%; }
        .react-datepicker__input-container { display: flex; flex: 1; height: 100%; }
        .react-datepicker-popper { z-index: 9999999 !important; }
        .react-datepicker { font-family: 'Inter', sans-serif !important; border-radius: 12px !important; box-shadow: 0 12px 40px rgba(0,0,0,0.12) !important; border: 1px solid #eee !important; }
        .react-datepicker__header { background: #fff !important; border-bottom: 1px solid #f0f0f0 !important; border-top-left-radius: 12px !important; border-top-right-radius: 12px !important; padding: 14px 0 8px !important; }
        .react-datepicker__day-name { width: 38px !important; margin: 2px !important; font-weight: 700; color: #888 !important; font-size: 12px !important; }
        .react-datepicker__day { width: 38px !important; height: 38px !important; line-height: normal !important; display: inline-flex !important; flex-direction: column !important; align-items: center !important; justify-content: center !important; margin: 2px !important; border-radius: 8px !important; cursor: pointer; font-family: 'Inter', sans-serif !important; }
        .react-datepicker__day--selected, .react-datepicker__day--keyboard-selected { background-color: #e8151b !important; color: #fff !important; font-weight: 700 !important; }
        .react-datepicker__day:hover { background-color: #fff0f0 !important; color: #e8151b !important; }

        /* ===== FARE TAGS ===== */
        .sf-footer-area { display: flex; align-items: center; margin-top: 18px; gap: 8px; flex-wrap: wrap; }
        .sf-fare-tag { display: flex; align-items: center; gap: 7px; padding: 6px 12px; border: 1.5px solid transparent; border-radius: 8px; cursor: pointer; background: #f9f9f9; transition: 0.15s; }
        .sf-fare-tag.active { border-color: #ffc0c0; background: #fff5f5; }
        .sf-fare-tag input { margin: 0; accent-color: #e8151b; width: 14px; height: 14px; }
        .sf-fare-title { font-size: 12px; font-weight: 600; color: #222; line-height: 1.2; font-family: 'Inter', sans-serif; }
        .sf-fare-sub { font-size: 10px; color: #777; line-height: 1.2; font-family: 'Inter', sans-serif; }
        .sf-checkbox { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 500; cursor: pointer; color: #555; margin-left: auto; font-family: 'Inter', sans-serif; }
        .sf-checkbox input { accent-color: #e8151b; width: 16px; height: 16px; }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 991px) {
          .sf-search-row-container { flex-direction: column; gap: 0; }
          .sf-inputs-wrapper { flex-direction: column; min-height: auto; }
          .sf-input-col { border-right: none; border-bottom: 1.5px solid #eaeaea; }
          .sf-input-col:last-child { border-bottom: none; }
          .sf-search-btn-col { padding-top: 12px; }
          .sf-search-button { width: 100%; height: 54px; justify-content: center; border-radius: 10px; }
          .sf-swap-btn { right: 14px; top: auto; bottom: -17px; transform: rotate(90deg); }
          .sf-dropdown { width: 100%; }
          .sf-features-banner { padding: 16px 20px; gap: 14px; }
        }
        @media (max-width: 576px) {
          .sf-header-bar { padding: 0 16px; }
          .sf-body-area { padding: 18px 16px 20px; }
          .sf-tab-btn { padding: 14px 14px; font-size: 13px; }
          .sf-features-banner { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="sf-main-box">
        <div className="sf-header-bar">
          <div className="sf-tabs-list">
            <button className={'sf-tab-btn' + (activeTab === 0 ? ' active' : '')} onClick={() => handleTabClick(0)}>
              <Plane size={18} /> Flights
            </button>
            <button className={'sf-tab-btn' + (activeTab === 1 ? ' active' : '')} onClick={() => handleTabClick(1)}>
              <Building2 size={18} /> Hotels
            </button>
            <button
              className="sf-tab-btn"
              onClick={(e) => { e.preventDefault(); window.open("https://www.redbus.in/", '_blank'); }}
            >
              <BusFront size={18} /> Bus
            </button>
            <button
              className="sf-tab-btn"
              onClick={(e) => { e.preventDefault(); window.open("https://www.irctc.co.in/", '_blank'); }}
            >
              <TrainFront size={18} /> Trains
            </button>
          </div>
        </div>

        <div className="sf-body-area" ref={dropdownRef} style={{ position: 'relative', zIndex: 9999998 }}>
          {/* Flights Tab */}
          {activeTab === 0 && (
            <div className="sf-flights-tab-content">
              <div className="sf-radio-group">
                <label className={`sf-radio-label ${tripType === 'O' ? 'active' : ''}`}>
                  <input type="radio" name="tripType" value="O" checked={tripType === 'O'} onChange={() => setTripType('O')} />
                  <div className="sf-radio-circle"><div className="sf-radio-dot"></div></div>
                  One Way
                </label>
                <label className={`sf-radio-label ${tripType === 'R' ? 'active' : ''}`}>
                  <input type="radio" name="tripType" value="R" checked={tripType === 'R'} onChange={() => setTripType('R')} />
                  <div className="sf-radio-circle"><div className="sf-radio-dot"></div></div>
                  Round Trip
                </label>

              </div>

              {tripType === 'M' ? (
                <div className="sf-multi-city-container">
                  <style>{`
                    .sf-add-another-city-btn {
                      width: 100%;
                      padding: 12px;
                      background: transparent;
                      border: 1px solid #0056b3;
                      color: #0056b3;
                      border-radius: 8px;
                      font-weight: 600;
                      font-size: 14px;
                      cursor: pointer;
                      transition: 0.2s;
                      font-family: 'Inter', sans-serif;
                    }
                    .sf-add-another-city-btn:hover {
                      background: #f0f7ff;
                    }
                  `}</style>
                  {multiCitySegments.map((segment, index) => (
                    <div className="sf-segment-row" key={segment.id} style={{ marginBottom: index === multiCitySegments.length - 1 ? '0' : '16px' }}>
                      <div className="sf-search-row-container" style={{ flex: 1, alignItems: 'stretch' }}>
                        <div className="sf-inputs-wrapper" style={{ flex: 2 }}>
                          <div className="sf-input-col" style={{ flex: 1 }} onClick={() => { setActiveDropdown(activeDropdown === `from-${segment.id}` ? null : `from-${segment.id}`); setSearchQuery(''); }}>
                            <span className="sf-label-text">Departure From</span>
                            <span className="sf-value-text">{segment.from.city}</span>
                            <span className="sf-sub-text">{segment.from.code}, {segment.from.name}</span>
                            {activeDropdown === `from-${segment.id}` && (
                              <div className="sf-dropdown" onClick={(e) => e.stopPropagation()}>
                                <div className="sf-dropdown-search">
                                  <input type="text" placeholder="Search by city, airport or code" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoFocus />
                                </div>
                                <div className="sf-dropdown-list">
                                  {isAirportLoading ? (
                                    <div className="sf-no-results">Loading...</div>
                                  ) : filteredAirports.length > 0 ? filteredAirports.map(ap => (
                                    <div key={ap.code} className="sf-dropdown-item" onClick={() => {
                                      const newSegs = [...multiCitySegments];
                                      newSegs[index].from = ap;
                                      setMultiCitySegments(newSegs);
                                      setActiveDropdown(null);
                                    }}>
                                      <Plane className="sf-dropdown-icon" size={16} />
                                      <div className="sf-dropdown-info">
                                        <div className="sf-dropdown-city">{ap.city}, {ap.country}</div>
                                        <div className="sf-dropdown-name">{ap.name}</div>
                                      </div>
                                      <div className="sf-dropdown-code">{ap.code}</div>
                                    </div>
                                  )) : searchQuery.length > 0 ? (
                                    <div className="sf-no-results">No airports found</div>
                                  ) : (
                                    <div className="sf-no-results">Type to search</div>
                                  )}
                                </div>
                              </div>
                            )}
                            <div className="sf-swap-btn" onClick={(e) => {
                              e.stopPropagation();
                              const newSegs = [...multiCitySegments];
                              const temp = newSegs[index].from;
                              newSegs[index].from = newSegs[index].to;
                              newSegs[index].to = temp;
                              setMultiCitySegments(newSegs);
                            }}>
                              <ArrowRightLeft size={14} />
                            </div>
                          </div>

                          <div className="sf-input-col" style={{ flex: 1 }} onClick={() => { setActiveDropdown(activeDropdown === `to-${segment.id}` ? null : `to-${segment.id}`); setSearchQuery(''); }}>
                            <span className="sf-label-text">Going To</span>
                            <span className="sf-value-text">{segment.to.city}</span>
                            <span className="sf-sub-text">{segment.to.code}, {segment.to.name}</span>
                            {activeDropdown === `to-${segment.id}` && (
                              <div className="sf-dropdown" onClick={(e) => e.stopPropagation()}>
                                <div className="sf-dropdown-search">
                                  <input type="text" placeholder="Search by city, airport or code" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoFocus />
                                </div>
                                <div className="sf-dropdown-list">
                                  {isAirportLoading ? (
                                    <div className="sf-no-results">Loading...</div>
                                  ) : filteredAirports.length > 0 ? filteredAirports.map(ap => (
                                    <div key={ap.code} className="sf-dropdown-item" onClick={() => {
                                      const newSegs = [...multiCitySegments];
                                      newSegs[index].to = ap;
                                      setMultiCitySegments(newSegs);
                                      setActiveDropdown(null);
                                    }}>
                                      <Plane className="sf-dropdown-icon" size={16} />
                                      <div className="sf-dropdown-info">
                                        <div className="sf-dropdown-city">{ap.city}, {ap.country}</div>
                                        <div className="sf-dropdown-name">{ap.name}</div>
                                      </div>
                                      <div className="sf-dropdown-code">{ap.code}</div>
                                    </div>
                                  )) : searchQuery.length > 0 ? (
                                    <div className="sf-no-results">No airports found</div>
                                  ) : (
                                    <div className="sf-no-results">Type to search</div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div> {/* End of sf-inputs-wrapper */}

                        <div className="sf-date-picker-wrapper" style={{ flex: 1 }}>
                          <DatePicker
                            selected={segment.date}
                            onChange={(date) => {
                              const newSegs = [...multiCitySegments];
                              newSegs[index].date = date;
                              setMultiCitySegments(newSegs);
                            }}
                            minDate={index > 0 ? multiCitySegments[index - 1].date : new Date()}
                            onMonthChange={(date) => {
                              const newSegs = [...multiCitySegments];
                              const newMonthDate = new Date(date);
                              newMonthDate.setDate(1);
                              newSegs[index].date = newMonthDate;
                              setMultiCitySegments(newSegs);
                            }}
                            renderDayContents={(dayOfMonth, date) => {
                              const dateStr = format(date, 'yyyy-MM-dd');
                              const fareObj = multiCityFaresMap[`${index}-${dateStr}`];
                              return (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                  <span style={{ fontSize: '12px', fontWeight: '700' }}>{dayOfMonth}</span>
                                  {fareObj && (
                                    <span style={{ fontSize: '9px', color: '#10b981', fontWeight: '800', marginTop: '1px' }}>
                                      ₹{Math.round(fareObj.Fare / 1000)}k
                                    </span>
                                  )}
                                </div>
                              );
                            }}
                            customInput={<CustomDateInput label="Departure Date" day={format(segment.date, 'dd')} month={format(segment.date, "MMM' yy")} weekday={format(segment.date, 'EEEE')} />}
                          />
                        </div>

                        {index === 0 ? (
                          <div className="sf-input-col" style={{ flex: 1.15, border: '1.5px solid #eaeaea', borderRadius: '12px', background: '#fff' }} onClick={() => setActiveDropdown(activeDropdown === 'flightClass' ? null : 'flightClass')}>
                            <span className="sf-label-text">Travellers & Class <ChevronDown size={14} strokeWidth={2.5} /></span>
                            <span className="sf-value-text" style={{ fontSize: '20px' }}>
                              {flightAdults + flightChildren + flightInfants} Traveller{flightAdults + flightChildren + flightInfants > 1 ? 's' : ''}
                            </span>
                            <span className="sf-sub-text">
                              {flightClass === 1 ? 'All Classes' : flightClass === 2 ? 'Economy' : flightClass === 3 ? 'Premium Economy' : flightClass === 4 ? 'Business' : 'First Class'}
                            </span>

                            {activeDropdown === 'flightClass' && (
                              <div className="sf-dropdown" onClick={(e) => e.stopPropagation()} style={{ padding: '15px', width: '280px', right: 0, left: 'auto' }}>
                                {/* Adults Counter */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                  <div>
                                    <div style={{ fontWeight: '600', fontSize: '14px', color: '#111' }}>Adults</div>
                                    <div style={{ fontSize: '11px', color: '#666' }}>12+ years</div>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <button type="button" style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: flightAdults <= 1 ? '#ccc' : '#d81b21' }} disabled={flightAdults <= 1} onClick={() => setFlightAdults(a => a - 1)}>-</button>
                                    <span style={{ fontWeight: '600', fontSize: '15px', minWidth: '15px', textAlign: 'center' }}>{flightAdults}</span>
                                    <button type="button" style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #d81b21', background: '#ffebeb', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d81b21' }} onClick={() => setFlightAdults(a => a + 1)}>+</button>
                                  </div>
                                </div>

                                {/* Children Counter */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                  <div>
                                    <div style={{ fontWeight: '600', fontSize: '14px', color: '#111' }}>Children</div>
                                    <div style={{ fontSize: '11px', color: '#666' }}>2-12 years</div>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <button type="button" style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: flightChildren <= 0 ? '#ccc' : '#d81b21' }} disabled={flightChildren <= 0} onClick={() => setFlightChildren(c => c - 1)}>-</button>
                                    <span style={{ fontWeight: '600', fontSize: '15px', minWidth: '15px', textAlign: 'center' }}>{flightChildren}</span>
                                    <button type="button" style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #d81b21', background: '#ffebeb', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d81b21' }} onClick={() => setFlightChildren(c => c + 1)}>+</button>
                                  </div>
                                </div>

                                {/* Infants Counter */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                  <div>
                                    <div style={{ fontWeight: '600', fontSize: '14px', color: '#111' }}>Infants</div>
                                    <div style={{ fontSize: '11px', color: '#666' }}>Under 2 years</div>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <button type="button" style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: flightInfants <= 0 ? '#ccc' : '#d81b21' }} disabled={flightInfants <= 0} onClick={() => setFlightInfants(i => i - 1)}>-</button>
                                    <span style={{ fontWeight: '600', fontSize: '15px', minWidth: '15px', textAlign: 'center' }}>{flightInfants}</span>
                                    <button type="button" style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #d81b21', background: '#ffebeb', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d81b21' }} onClick={() => setFlightInfants(i => i + 1)}>+</button>
                                  </div>
                                </div>

                                {/* Cabin Class Selection */}
                                <div style={{ borderTop: '1px solid #eee', paddingTop: '12px', marginBottom: '12px' }}>
                                  <div style={{ fontWeight: '600', fontSize: '13px', color: '#111', marginBottom: '8px' }}>Cabin Class</div>
                                  <select
                                    value={flightClass}
                                    onChange={(e) => setFlightClass(parseInt(e.target.value))}
                                    style={{ width: '100%', padding: '6px 10px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '13px', outline: 'none' }}
                                  >
                                    <option value={1}>All Classes</option>
                                    <option value={2}>Economy</option>
                                    <option value={3}>Premium Economy</option>
                                    <option value={4}>Business</option>
                                    <option value={6}>First Class</option>
                                  </select>
                                </div>

                                <button
                                  type="button"
                                  style={{ width: '100%', padding: '8px', background: '#d81b21', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}
                                  onClick={() => setActiveDropdown(null)}
                                >
                                  Done
                                </button>
                              </div>
                            )}
                          </div>
                        ) : index === multiCitySegments.length - 1 && multiCitySegments.length < 5 ? (
                          <div style={{ flex: 1.15, display: 'flex', alignItems: 'center', paddingLeft: '12px' }}>
                            <button className="sf-add-another-city-btn" onClick={handleAddSegment}>
                              + Add Another City
                            </button>
                          </div>
                        ) : (
                          <div style={{ flex: 1.15, display: 'flex', alignItems: 'center' }}></div>
                        )}
                        
                        {index === 0 ? (
                          <div className="sf-search-btn-col" style={{ marginLeft: '12px', minWidth: '130px', flexShrink: 0 }}>
                            <button className="sf-search-button" style={{ width: '100%', padding: '0', display: 'flex', justifyContent: 'center' }} onClick={() => {
                              const formatLocalDate = (d) => {
                                const offsetDate = new Date(d.getTime() - (d.getTimezoneOffset() * 60000));
                                return offsetDate.toISOString().split('T')[0] + 'T00:00:00';
                              };
                              const segments = multiCitySegments.map(seg => {
                                const depStr = seg.date ? formatLocalDate(seg.date) : formatLocalDate(new Date());
                                return {
                                  Origin: seg.from.code,
                                  Destination: seg.to.code,
                                  FlightCabinClass: flightClass,
                                  PreferredDepartureTime: depStr,
                                  PreferredArrivalTime: depStr,
                                };
                              });
                              navigate('/flight-results', {
                                state: {
                                  AdultCount: flightAdults,
                                  ChildCount: flightChildren,
                                  InfantCount: flightInfants,
                                  DirectFlight: nonStop,
                                  FlightCabinClass: flightClass,
                                  JourneyType: 3, // MultiCity
                                  Segments: segments
                                }
                              });
                            }}>Search</button>
                          </div>
                        ) : (
                          <div className="sf-search-btn-col" style={{ marginLeft: '12px', minWidth: '130px', flexShrink: 0, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                            {index > 1 && (
                              <button className="sf-remove-btn" onClick={() => handleRemoveSegment(segment.id)} title="Remove flight" style={{ marginLeft: '20px' }}>
                                <X size={16} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="sf-search-row-container">
                  <div className="sf-inputs-wrapper">
                    <div className="sf-input-col" style={{ flex: 1.3 }} onClick={() => { setActiveDropdown(activeDropdown === 'from' ? null : 'from'); setSearchQuery(''); }}>
                      <span className="sf-label-text">Departure From</span>
                      <span className="sf-value-text">{fromAirport.city}</span>
                      <span className="sf-sub-text">{fromAirport.code}, {fromAirport.name}</span>

                      {activeDropdown === 'from' && (
                        <div className="sf-dropdown" onClick={(e) => e.stopPropagation()}>
                          <div className="sf-dropdown-search">
                            <input type="text" placeholder="Search by city, airport or code" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoFocus />
                          </div>
                          <div className="sf-dropdown-list">
                            {isAirportLoading ? (
                              <div className="sf-no-results">Loading...</div>
                            ) : filteredAirports.length > 0 ? filteredAirports.map(ap => (
                              <div key={ap.code} className="sf-dropdown-item" onClick={() => { setFromAirport(ap); setActiveDropdown(null); }}>
                                <Plane className="sf-dropdown-icon" size={16} />
                                <div className="sf-dropdown-info">
                                  <div className="sf-dropdown-city">{ap.city}, {ap.country}</div>
                                  <div className="sf-dropdown-name">{ap.name}</div>
                                </div>
                                <div className="sf-dropdown-code">{ap.code}</div>
                              </div>
                            )) : searchQuery.length > 0 ? (
                              <div className="sf-no-results">No airports found</div>
                            ) : (
                              <div className="sf-no-results">Type to search</div>
                            )}
                          </div>
                        </div>
                      )}
                      <div className="sf-swap-btn" onClick={(e) => { e.stopPropagation(); handleSwap(); }}>
                        <ArrowRightLeft size={14} />
                      </div>
                    </div>

                    <div className="sf-input-col" style={{ flex: 1.3 }} onClick={() => { setActiveDropdown(activeDropdown === 'to' ? null : 'to'); setSearchQuery(''); }}>
                      <span className="sf-label-text">Going To</span>
                      <span className="sf-value-text">{toAirport.city}</span>
                      <span className="sf-sub-text">{toAirport.code}, {toAirport.name}</span>

                      {activeDropdown === 'to' && (
                        <div className="sf-dropdown" onClick={(e) => e.stopPropagation()}>
                          <div className="sf-dropdown-search">
                            <input type="text" placeholder="Search by city, airport or code" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoFocus />
                          </div>
                          <div className="sf-dropdown-list">
                            {isAirportLoading ? (
                              <div className="sf-no-results">Loading...</div>
                            ) : filteredAirports.length > 0 ? filteredAirports.map(ap => (
                              <div key={ap.code} className="sf-dropdown-item" onClick={() => { setToAirport(ap); setActiveDropdown(null); }}>
                                <Plane className="sf-dropdown-icon" size={16} />
                                <div className="sf-dropdown-info">
                                  <div className="sf-dropdown-city">{ap.city}, {ap.country}</div>
                                  <div className="sf-dropdown-name">{ap.name}</div>
                                </div>
                                <div className="sf-dropdown-code">{ap.code}</div>
                              </div>
                            )) : searchQuery.length > 0 ? (
                              <div className="sf-no-results">No airports found</div>
                            ) : (
                              <div className="sf-no-results">Type to search</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="sf-date-picker-wrapper">
                      <DatePicker
                        selected={departureDate}
                        onChange={(date) => { setDepartureDate(date); if (returnDate && date > returnDate) setReturnDate(date); }}
                        minDate={new Date()}
                        onMonthChange={(date) => setActiveCalendarMonth(date)}
                        renderDayContents={(dayOfMonth, date) => {
                          const dateStr = format(date, 'yyyy-MM-dd');
                          const fareObj = calendarFaresMap[dateStr];
                          return (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                              <span style={{ fontSize: '12px', fontWeight: '700' }}>{dayOfMonth}</span>
                              {fareObj && (
                                <span style={{ fontSize: '9px', color: '#10b981', fontWeight: '800', marginTop: '1px' }}>
                                  ₹{Math.round(fareObj.Fare / 1000)}k
                                </span>
                              )}
                            </div>
                          );
                        }}
                        customInput={<CustomDateInput label="Departure Date" day={format(departureDate, 'dd')} month={format(departureDate, "MMM' yy")} weekday={format(departureDate, 'EEEE')} />}
                      />
                    </div>

                    {tripType === 'R' ? (
                      <div className="sf-date-picker-wrapper">
                        <DatePicker
                          selected={returnDate}
                          onChange={(date) => setReturnDate(date)}
                          minDate={departureDate}
                          onMonthChange={(date) => setActiveCalendarMonth(date)}
                          renderDayContents={(dayOfMonth, date) => {
                            const dateStr = format(date, 'yyyy-MM-dd');
                            const fareObj = returnCalendarFaresMap[dateStr];
                            return (
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                <span style={{ fontSize: '12px', fontWeight: '700' }}>{dayOfMonth}</span>
                                {fareObj && (
                                  <span style={{ fontSize: '9px', color: '#10b981', fontWeight: '800', marginTop: '1px' }}>
                                    ₹{Math.round(fareObj.Fare / 1000)}k
                                  </span>
                                )}
                              </div>
                            );
                          }}
                          customInput={<CustomDateInput label="Return Date" day={format(returnDate || new Date(), 'dd')} month={format(returnDate || new Date(), "MMM' yy")} weekday={format(returnDate || new Date(), 'EEEE')} />}
                        />
                      </div>
                    ) : (
                      <div className="sf-input-col" style={{ justifyContent: 'center' }}>
                        <span className="sf-label-text">Return Date <ChevronDown size={14} strokeWidth={2.5} /></span>
                        <span className="sf-link-text" onClick={() => {
                          setTripType('R');
                          if (!returnDate) {
                            const d = new Date(departureDate || new Date());
                            d.setDate(d.getDate() + 2);
                            setReturnDate(d);
                          }
                        }} style={{ cursor: 'pointer' }}>Book Round Trip <br />to save extra</span>
                      </div>
                    )}

                    <div className="sf-input-col" style={{ borderRight: 'none', flex: 1.15 }} onClick={() => setActiveDropdown(activeDropdown === 'flightClass' ? null : 'flightClass')}>
                      <span className="sf-label-text">Travellers & Class <ChevronDown size={14} strokeWidth={2.5} /></span>
                      <span className="sf-value-text" style={{ fontSize: '20px' }}>
                        {flightAdults + flightChildren + flightInfants} Traveller{flightAdults + flightChildren + flightInfants > 1 ? 's' : ''}
                      </span>
                      <span className="sf-sub-text">
                        {flightClass === 1 ? 'All Classes' : flightClass === 2 ? 'Economy' : flightClass === 3 ? 'Premium Economy' : flightClass === 4 ? 'Business' : 'First Class'}
                      </span>

                      {activeDropdown === 'flightClass' && (
                        <div className="sf-dropdown" onClick={(e) => e.stopPropagation()} style={{ padding: '15px', width: '280px', right: 0, left: 'auto' }}>
                          {/* Adults Counter */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <div>
                              <div style={{ fontWeight: '600', fontSize: '14px', color: '#111' }}>Adults</div>
                              <div style={{ fontSize: '11px', color: '#666' }}>12+ years</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                              <button type="button" style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: flightAdults <= 1 ? '#ccc' : '#d81b21' }} disabled={flightAdults <= 1} onClick={() => setFlightAdults(a => a - 1)}>-</button>
                              <span style={{ fontWeight: '600', fontSize: '15px', minWidth: '15px', textAlign: 'center' }}>{flightAdults}</span>
                              <button type="button" style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #d81b21', background: '#ffebeb', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d81b21' }} onClick={() => setFlightAdults(a => a + 1)}>+</button>
                            </div>
                          </div>

                          {/* Children Counter */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <div>
                              <div style={{ fontWeight: '600', fontSize: '14px', color: '#111' }}>Children</div>
                              <div style={{ fontSize: '11px', color: '#666' }}>2-12 years</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                              <button type="button" style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: flightChildren <= 0 ? '#ccc' : '#d81b21' }} disabled={flightChildren <= 0} onClick={() => setFlightChildren(c => c - 1)}>-</button>
                              <span style={{ fontWeight: '600', fontSize: '15px', minWidth: '15px', textAlign: 'center' }}>{flightChildren}</span>
                              <button type="button" style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #d81b21', background: '#ffebeb', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d81b21' }} onClick={() => setFlightChildren(c => c + 1)}>+</button>
                            </div>
                          </div>

                          {/* Infants Counter */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <div>
                              <div style={{ fontWeight: '600', fontSize: '14px', color: '#111' }}>Infants</div>
                              <div style={{ fontSize: '11px', color: '#666' }}>Under 2 years</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                              <button type="button" style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: flightInfants <= 0 ? '#ccc' : '#d81b21' }} disabled={flightInfants <= 0} onClick={() => setFlightInfants(i => i - 1)}>-</button>
                              <span style={{ fontWeight: '600', fontSize: '15px', minWidth: '15px', textAlign: 'center' }}>{flightInfants}</span>
                              <button type="button" style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #d81b21', background: '#ffebeb', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d81b21' }} onClick={() => setFlightInfants(i => i + 1)}>+</button>
                            </div>
                          </div>

                          {/* Cabin Class Selection */}
                          <div style={{ borderTop: '1px solid #eee', paddingTop: '12px', marginBottom: '12px' }}>
                            <div style={{ fontWeight: '600', fontSize: '13px', color: '#111', marginBottom: '8px' }}>Cabin Class</div>
                            <select
                              value={flightClass}
                              onChange={(e) => setFlightClass(parseInt(e.target.value))}
                              style={{ width: '100%', padding: '6px 10px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '13px', outline: 'none' }}
                            >
                              <option value={1}>All Classes</option>
                              <option value={2}>Economy</option>
                              <option value={3}>Premium Economy</option>
                              <option value={4}>Business</option>
                              <option value={6}>First Class</option>
                            </select>
                          </div>

                          <button
                            type="button"
                            style={{ width: '100%', padding: '8px', background: '#d81b21', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}
                            onClick={() => setActiveDropdown(null)}
                          >
                            Done
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="sf-search-btn-col" style={{ display: 'flex', alignItems: 'center', padding: '0 28px 0 5px' }}>
                      <button className="sf-search-button" onClick={() => {
                        const formatLocalDate = (d) => {
                          const offsetDate = new Date(d.getTime() - (d.getTimezoneOffset() * 60000));
                          return offsetDate.toISOString().split('T')[0] + 'T00:00:00';
                        };
                        const departureStr = departureDate ? formatLocalDate(departureDate) : formatLocalDate(new Date());
                        const segments = [
                          {
                            Origin: fromAirport.code,
                            Destination: toAirport.code,
                            FlightCabinClass: flightClass,
                            PreferredDepartureTime: departureStr,
                            PreferredArrivalTime: departureStr,
                          }
                        ];

                        if (tripType === 'R') {
                          const validReturnDate = returnDate || new Date((departureDate || new Date()).getTime() + 2 * 24 * 60 * 60 * 1000);
                          const returnStr = formatLocalDate(validReturnDate);
                          segments.push({
                            Origin: toAirport.code,
                            Destination: fromAirport.code,
                            FlightCabinClass: flightClass,
                            PreferredDepartureTime: returnStr,
                            PreferredArrivalTime: returnStr,
                          });
                        }

                        navigate('/flight-results', {
                          state: {
                            Origin: fromAirport.code,
                            Destination: toAirport.code,
                            OriginCity: fromAirport.city,
                            DestinationCity: toAirport.city,
                            PreferredDepartureTime: departureStr,
                            PreferredArrivalTime: departureStr,
                            JourneyType: tripType === 'O' ? 1 : tripType === 'R' ? 2 : 3,
                            DirectFlight: nonStop,
                            FlightCabinClass: flightClass,
                            AdultCount: flightAdults,
                            ChildCount: flightChildren,
                            InfantCount: flightInfants,
                            Segments: segments
                          }
                        });
                      }}>Search Flights</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Fare types and Non-stop checkbox removed as per request */}
            </div>
          )}

          {/* === HOTELS TAB === */}
          {activeTab === 1 && (
            <div className="sf-hotels-tab-content">
              <div className="sf-search-row-container">
                <div className="sf-inputs-wrapper">
                  <HotelSearchAutocomplete 
                    onSelect={(item) => setHotelCity(item)} 
                    initialSelection={hotelCity} 
                  />

                  <div className="sf-date-picker-wrapper">
                    <DatePicker
                      selected={checkInDate}
                      onChange={(date) => { setCheckInDate(date); if (checkOutDate && date >= checkOutDate) setCheckOutDate(new Date(date.getTime() + 86400000)); }}
                      minDate={new Date(new Date().getTime() + 86400000)} // RCA Fix: TBO rejects 'today' as check-in
                      customInput={<CustomDateInput label="Check-in Date" day={format(checkInDate, 'dd')} month={format(checkInDate, "MMM' yy")} weekday={format(checkInDate, 'EEEE')} />}
                    />
                  </div>
                  <div className="sf-date-picker-wrapper">
                    <DatePicker
                      selected={checkOutDate}
                      onChange={(date) => setCheckOutDate(date)}
                      minDate={new Date(checkInDate.getTime() + 86400000)}
                      customInput={<CustomDateInput label="Check-out Date" day={format(checkOutDate, 'dd')} month={format(checkOutDate, "MMM' yy")} weekday={format(checkOutDate, 'EEEE')} />}
                    />
                  </div>

                  <div className="sf-input-col" style={{ flex: 1.2, borderRight: 'none' }} onClick={() => setActiveDropdown(activeDropdown === 'rooms' ? null : 'rooms')}>
                    <span className="sf-label-text">Room & Guest &#8964;</span>
                    <span className="sf-value-text" style={{ fontSize: '20px' }}>{rooms} Room, {adults} Guests</span>
                    <span className="sf-sub-text">{adults} Adults</span>
                    {activeDropdown === 'rooms' && (
                      <div className="sf-dropdown" onClick={(e) => e.stopPropagation()} style={{ padding: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                          <div>
                            <div style={{ fontWeight: '600', fontSize: '14px', color: '#111' }}>Rooms</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <button style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: rooms <= 1 ? '#ccc' : '#d81b21' }} disabled={rooms <= 1} onClick={() => setRooms(r => r - 1)}>-</button>
                            <span style={{ fontWeight: '600', fontSize: '16px', minWidth: '15px', textAlign: 'center' }}>{rooms}</span>
                            <button style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #d81b21', background: '#ffebeb', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d81b21' }} onClick={() => setRooms(r => r + 1)}>+</button>
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: '600', fontSize: '14px', color: '#111' }}>Adults</div>
                            <div style={{ fontSize: '11px', color: '#666' }}>12+ years</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <button style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: adults <= 1 ? '#ccc' : '#d81b21' }} disabled={adults <= 1} onClick={() => setAdults(a => a - 1)}>-</button>
                            <span style={{ fontWeight: '600', fontSize: '16px', minWidth: '15px', textAlign: 'center' }}>{adults}</span>
                            <button style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #d81b21', background: '#ffebeb', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d81b21' }} onClick={() => setAdults(a => a + 1)}>+</button>
                          </div>
                        </div>
                        <button style={{ width: '100%', padding: '8px', marginTop: '15px', background: '#d81b21', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }} onClick={() => setActiveDropdown(null)}>Done</button>
                      </div>
                    )}
                  </div>

                  <div className="sf-search-btn-col" style={{ display: 'flex', alignItems: 'center', padding: '0 28px 0 5px' }}>
                    <button className="sf-search-button" onClick={() => {
                      if (!hotelCity || (!hotelCity.CityCode && !hotelCity.HotelCode && !hotelCity.city)) {
                        alert("Please select a destination first.");
                        return;
                      }
                      
                      navigate('/hotel-results', {
                        state: {
                          cityCode: hotelCity.CityCode || hotelCity.cityCode || '119805',
                          hotelCode: hotelCity.HotelCode || null,
                          cityName: hotelCity.CityName || hotelCity.HotelName || hotelCity.city,
                          cityState: hotelCity.CityName || hotelCity.state || 'Location',
                          cityCountry: hotelCity.CountryCode || hotelCity.country || 'IN',
                          CountryCode: hotelCity.CountryCode || 'IN',
                          checkIn: checkInDate.toISOString().split('T')[0],
                          checkOut: checkOutDate.toISOString().split('T')[0],
                          rooms,
                          adults,
                          GuestNationality: 'IN',
                        }
                      });
                    }}>Search Hotels</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Features Banner (Now inside sf-main-box) */}
          <div className="sf-features-banner">
            <div className="sf-feature-badge">
              <div className="sf-feature-icon"><i className="fa-solid fa-ban"></i></div>
              <div className="sf-feature-text">
                <span className="sf-feature-title">Free Cancellation</span>
                <span className="sf-feature-desc">Up to 24 hours</span>
              </div>
            </div>
            <div className="sf-feature-badge">
              <div className="sf-feature-icon"><i className="fa-solid fa-shield-alt"></i></div>
              <div className="sf-feature-text">
                <span className="sf-feature-title">Secure Booking</span>
                <span className="sf-feature-desc">Your data is protected</span>
              </div>
            </div>
            <div className="sf-feature-badge">
              <div className="sf-feature-icon"><i className="fa-solid fa-tags"></i></div>
              <div className="sf-feature-text">
                <span className="sf-feature-title">No Hidden Fees</span>
                <span className="sf-feature-desc">What you see is what you pay</span>
              </div>
            </div>
            <div className="sf-feature-badge">
              <div className="sf-feature-icon"><i className="fa-solid fa-magnifying-glass"></i></div>
              <div className="sf-feature-text">
                <span className="sf-feature-title">Best Price Guarantee</span>
                <span className="sf-feature-desc">We match any price</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSearchFilter;

