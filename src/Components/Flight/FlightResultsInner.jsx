import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FlightCard from './FlightCard';
import FlightSidebar from './FlightSidebar';
import ModifyFlightSearchBar from './ModifyFlightSearchBar';
import RoundTripFlightCard from './RoundTripFlightCard';
import FareOptionsModal, { extractUpsellFamilies } from './FareOptionsModal';
import PremiumFareDetailsModal from './PremiumFareDetailsModal';
import { Loader2 } from 'lucide-react';

const AIRLINE_NAMES = {
    '6E': 'IndiGo', 'AI': 'Air India', 'UK': 'Vistara',
    'QP': 'Akasa Air', 'IX': 'Air India Express', 'SG': 'SpiceJet', 'I5': 'AirAsia India'
};

const SORT_TABS = [
    { id: 'depTime', label: 'DEPART' },
    { id: 'arrTime', label: 'ARRIVE' },
    { id: 'duration', label: 'DURATION' },
    { id: 'price', label: 'PRICE' },
    { id: 'nonStop', label: 'NON STOP FIRST' },
];

function FlightResultsInner() {
    const navigate = useNavigate();
    const location = useLocation();
    const scrollContainerRef = useRef(null);

    const [flights, setFlights] = useState([]);
    const [returnFlights, setReturnFlights] = useState([]);
    const [selectedOutbound, setSelectedOutbound] = useState(null);
    const [selectedReturn, setSelectedReturn] = useState(null);
    const [showFareModal, setShowFareModal] = useState(false);
    const [isFareLoading, setIsFareLoading] = useState(false);
    const [fetchedFareData, setFetchedFareData] = useState(null);
    const [combinationError, setCombinationError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState('price');
    const [calendarFares, setCalendarFares] = useState([]);

    // Active filters (applied)
    const [activeFilters, setActiveFilters] = useState({
        stops: [],
        airlines: [],
        priceMax: null,
        departTimes: [],
        aircraft: [],
    });

    const scroll = (dir) => {
        scrollContainerRef.current?.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
    };

    // ── Fetch flights ──
    useEffect(() => {
        const fetchFlights = async () => {
            setIsLoading(true);
            try {
                const ss = location.state || {};
                const payload = {
                    AdultCount: parseInt(ss.AdultCount ?? 1),
                    ChildCount: parseInt(ss.ChildCount ?? 0),
                    InfantCount: parseInt(ss.InfantCount ?? 0),
                    DirectFlight: ss.DirectFlight || false,
                    OneStopFlight: false,
                    JourneyType: ss.JourneyType || 1,
                    PreferredAirlines: null,
                    Segments: ss.Segments || [{ Origin: ss.Origin || 'DEL', Destination: ss.Destination || 'BLR', FlightCabinClass: ss.FlightCabinClass || 1, PreferredDepartureTime: ss.PreferredDepartureTime || '2026-06-10T00:00:00', PreferredArrivalTime: ss.PreferredArrivalTime || '2026-06-10T00:00:00' }],
                    Sources: null
                };
                const base = process.env.REACT_APP_FLIGHT_API_BASE_URL || 'http://localhost:8009/api/flight';
                const res = await fetch(`${base}/search`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                const data = await res.json();
                if (data?.Response?.Results) {
                    const tid = data.Response.TraceId;
                    if (data.Response.Results[0]) {
                        setFlights(data.Response.Results[0].map(f => ({ ...f, TraceId: tid })));
                    }
                    if (data.Response.Results[1]) {
                        setReturnFlights(data.Response.Results[1].map(f => ({ ...f, TraceId: tid })));
                    }
                }
            } catch (e) { console.error(e); }
            finally { setIsLoading(false); }
        };
        fetchFlights();
    }, [location.state]);

    // ── Fetch calendar fares ──
    useEffect(() => {
        const fetchCal = async () => {
            const ss = location.state || {};
            if (parseInt(ss.JourneyType || 1) > 2) { setCalendarFares([]); return; }
            try {
                const payload = {
                    AdultCount: parseInt(ss.AdultCount ?? 1), ChildCount: 0, InfantCount: 0, DirectFlight: false, OneStopFlight: false, JourneyType: 1, PreferredAirlines: null,
                    Segments: [{ Origin: ss.Segments?.[0]?.Origin || ss.Origin || 'DEL', Destination: ss.Segments?.[0]?.Destination || ss.Destination || 'BLR', FlightCabinClass: ss.Segments?.[0]?.FlightCabinClass || 1, PreferredDepartureTime: ss.Segments?.[0]?.PreferredDepartureTime || new Date().toISOString().split('T')[0] + 'T00:00:00', PreferredArrivalTime: ss.Segments?.[0]?.PreferredDepartureTime || new Date().toISOString().split('T')[0] + 'T00:00:00' }],
                    Sources: null
                };
                const base = process.env.REACT_APP_FLIGHT_API_BASE_URL || 'http://localhost:8009/api/flight';
                let fares = [];
                const r1 = await fetch(`${base}/calendar-fare`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                const d1 = await r1.json();
                if (d1?.Response?.SearchResults) fares = d1.Response.SearchResults;
                try {
                    const r2 = await fetch(`${base}/update-calendar-fare`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                    const d2 = await r2.json();
                    if (d2?.Response?.SearchResults) fares = [...fares, ...d2.Response.SearchResults];
                } catch { }
                const map = {};
                fares.forEach(item => { if (!item.DepartureDate || item.Fare === undefined) return; const ds = item.DepartureDate.split('T')[0]; if (!map[ds] || item.Fare < map[ds].Fare) map[ds] = item; });
                setCalendarFares(Object.values(map).sort((a, b) => new Date(a.DepartureDate) - new Date(b.DepartureDate)));
            } catch { setCalendarFares([]); }
        };
        fetchCal();
    }, [location.state]);

    const handleDateSelect = (selectedDate) => {
        const nds = selectedDate.split('T')[0] + 'T00:00:00';
        const ss = location.state || {};
        const segs = (ss.Segments || [{ Origin: ss.Origin || 'DEL', Destination: ss.Destination || 'BLR', FlightCabinClass: 1 }]).map(s => ({ ...s, PreferredDepartureTime: nds, PreferredArrivalTime: nds }));
        navigate('/flight-results', { state: { ...ss, PreferredDepartureTime: nds, PreferredArrivalTime: nds, Segments: segs } });
    };

    // ── Computed price range ──
    const priceRange = useMemo(() => {
        const allFlights = [...flights, ...returnFlights];
        if (!allFlights.length) return { min: 0, max: 100000 };
        const prices = allFlights.map(f => f.Fare.PublishedFare);
        return { min: Math.min(...prices), max: Math.max(...prices) };
    }, [flights, returnFlights]);

    // ── Init priceMax when flights load ──
    useEffect(() => {
        if (flights.length > 0) {
            setActiveFilters(af => ({ ...af, priceMax: af.priceMax === null ? priceRange.max : af.priceMax }));
        }
    }, [flights.length, priceRange.max]);

    // ── Quick stop toggle (immediate) ──
    const handleStopToggle = (stopId) => {
        setActiveFilters(af => ({
            ...af,
            stops: af.stops.includes(stopId) ? af.stops.filter(s => s !== stopId) : [...af.stops, stopId]
        }));
    };

    // ── Apply all filters from panel ──
    const handleFiltersApply = (newFilters) => {
        setActiveFilters(newFilters);
    };

    // ── Filter logic ──
    const getFilteredFlights = (flightList) => {
        return flightList.filter(fl => {
            if (activeFilters.stops.length > 0) {
                const stops = fl.Segments[0].length - 1;
                const cat = stops === 0 ? '0' : stops === 1 ? '1' : '2+';
                if (!activeFilters.stops.includes(cat)) return false;
            }
            if (activeFilters.airlines.length > 0) {
                const code = fl.Segments?.[0]?.[0]?.Airline?.AirlineCode;
                if (!code || !activeFilters.airlines.includes(code)) return false;
            }
            if (activeFilters.priceMax !== null && activeFilters.priceMax !== undefined) {
                if (fl.Fare.PublishedFare > activeFilters.priceMax) return false;
            }
            if (activeFilters.departTimes.length > 0) {
                const h = new Date(fl.Segments[0][0].Origin.DepTime).getHours();
                const slot = h < 6 ? '00-06' : h < 12 ? '06-12' : h < 18 ? '12-18' : '18-00';
                if (!activeFilters.departTimes.includes(slot)) return false;
            }
            if (activeFilters.aircraft.length > 0) {
                const craft = fl.Segments[0][0].Craft?.trim();
                if (!craft || !activeFilters.aircraft.includes(craft)) return false;
            }
            return true;
        });
    };

    const filteredFlights = useMemo(() => getFilteredFlights(flights), [flights, activeFilters]);
    const filteredReturnFlights = useMemo(() => getFilteredFlights(returnFlights), [returnFlights, activeFilters]);

    // ── Sort ──
    const getSortedFlights = (flightList) => {
        return [...flightList].sort((a, b) => {
            if (sortBy === 'price') return a.Fare.PublishedFare - b.Fare.PublishedFare;
            if (sortBy === 'duration') {
                const dur = fl => fl.Segments.reduce((acc, sg) => acc + sg.reduce((s, l) => s + l.Duration, 0), 0);
                return dur(a) - dur(b);
            }
            if (sortBy === 'depTime') return new Date(a.Segments[0][0].Origin.DepTime) - new Date(b.Segments[0][0].Origin.DepTime);
            if (sortBy === 'arrTime') return new Date(a.Segments[0][a.Segments[0].length - 1].Destination.ArrTime) - new Date(b.Segments[0][b.Segments[0].length - 1].Destination.ArrTime);
            if (sortBy === 'nonStop') return (a.Segments[0].length - 1) - (b.Segments[0].length - 1);
            return 0;
        });
    };

    const sortedFlights = useMemo(() => getSortedFlights(filteredFlights), [filteredFlights, sortBy]);
    const sortedReturnFlights = useMemo(() => getSortedFlights(filteredReturnFlights), [filteredReturnFlights, sortBy]);

    useEffect(() => {
        if (!selectedOutbound && sortedFlights.length > 0) setSelectedOutbound(sortedFlights[0]);
    }, [sortedFlights, selectedOutbound]);

    useEffect(() => {
        if (!selectedReturn && sortedReturnFlights.length > 0) setSelectedReturn(sortedReturnFlights[0]);
    }, [sortedReturnFlights, selectedReturn]);

    const cheapestFareVal = calendarFares.length > 0 ? Math.min(...calendarFares.map(c => c.Fare)) : 0;
    const originCity = location.state?.Segments?.[0]?.Origin || location.state?.Origin || '';

    // ─── Dynamic Fare Detail Fetching ───
    const handleViewFareClick = async () => {
        if (!selectedOutbound || !selectedReturn) return;
        
        setCombinationError('');
        setIsFareLoading(true);

        const base = process.env.REACT_APP_FLIGHT_API_BASE_URL || 'http://localhost:8009/api/flight';
        const post = (endpoint, body) =>
            fetch(`${base}/${endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

        try {
            // ── Per-leg calls (round trips: fetch each leg separately, then merge) ──
            // Note: TBO FareQuote does NOT accept combined "R1,R2" ResultIndex for
            // independently-selected flights. Only package round-trips from JourneyType=2
            // return a single pre-combined ResultIndex. Since this app lets users mix
            // outbound/return from Results[0] and Results[1], we always call per-leg.
            // ── Per-leg calls (round trips: fetch each leg separately) ──
            const outPayload = { TraceId: selectedOutbound.TraceId, ResultIndex: selectedOutbound.ResultIndex };
            const retPayload = { TraceId: selectedReturn.TraceId,   ResultIndex: selectedReturn.ResultIndex };



            // Fetch quote sequentially first to avoid TBO API concurrent lock errors (ErrorCode 28)
            const outQuoteRes = await post('fare-quote', outPayload).catch(() => null);
            const retQuoteRes = await post('fare-quote', retPayload).catch(() => null);

            // Fetch other details concurrently only after quote checks
            const [
                outRuleRes, outSsrRes, outUpsellRes,
                retRuleRes, retSsrRes, retUpsellRes
            ] = await Promise.all([
                post('fare-rule',   outPayload).catch(() => null),
                post('ssr',         outPayload).catch(() => null),
                post('fare-upsell', outPayload).catch(() => null),
                post('fare-rule',   retPayload).catch(() => null),
                post('ssr',         retPayload).catch(() => null),
                post('fare-upsell', retPayload).catch(() => null),
            ]);

            const outQuote  = outQuoteRes?.ok  ? await outQuoteRes.json()  : null;
            const retQuote  = retQuoteRes?.ok  ? await retQuoteRes.json()  : null;
            const outRule   = outRuleRes?.ok   ? await outRuleRes.json()   : null;
            const retRule   = retRuleRes?.ok   ? await retRuleRes.json()   : null;
            const outSsr    = outSsrRes?.ok    ? await outSsrRes.json()    : null;
            const retSsr    = retSsrRes?.ok    ? await retSsrRes.json()    : null;
            const outUpsell = outUpsellRes?.ok ? await outUpsellRes.json() : null;
            const retUpsell = retUpsellRes?.ok ? await retUpsellRes.json() : null;

            const outQR = outQuote?.Response?.Results;
            const retQR = retQuote?.Response?.Results;

            if (!outQR || !retQR) {
                throw new Error('Fare validation failed. The seat may be sold out or the search has expired.');
            }

            // Confirmed prices (or fallback to search prices)
            const outPrice = outQR.Fare?.PublishedFare || selectedOutbound.Fare.PublishedFare;
            const retPrice = retQR.Fare?.PublishedFare || selectedReturn.Fare.PublishedFare;

            // Enrich segment legs: merge FareQuote segment data with search-result data
            // so Baggage/CabinBaggage is always present even if FareQuote omits it
            const enrichSeg = (quoteSeg, searchSeg) => {
                if (!quoteSeg) return searchSeg || {};
                return {
                    ...quoteSeg,
                    Baggage:      quoteSeg.Baggage      || searchSeg?.Baggage      || null,
                    CabinBaggage: quoteSeg.CabinBaggage || searchSeg?.CabinBaggage || null,
                };
            };

            const outSearchLegs = selectedOutbound.Segments[0] || [];
            const retSearchLegs = selectedReturn.Segments[0] || [];
            const outEnrichedLegs = (outQR?.Segments?.[0] || outSearchLegs).map((leg, i) => enrichSeg(leg, outSearchLegs[i]));
            const retEnrichedLegs = (retQR?.Segments?.[0] || retSearchLegs).map((leg, i) => enrichSeg(leg, retSearchLegs[i]));



            // Synthesize merged quoteData: Segments[0]=outbound, Segments[1]=return
            const quoteData = {
                Response: {
                    Results: {
                        ...(outQR || {}),
                        Fare: { ...(outQR?.Fare || {}), PublishedFare: outPrice + retPrice },
                        Segments: [outEnrichedLegs, retEnrichedLegs],
                        FareRules: [
                            ...(outQR?.FareRules || []),
                            ...(retQR?.FareRules || []),
                        ],
                    }
                }
            };

            // Merge FareRule API data
            const outFR = outRule?.Response?.FareRules || [];
            const retFR = retRule?.Response?.FareRules || [];
            const ruleData = (outFR.length || retFR.length)
                ? { Response: { FareRules: [...outFR, ...retFR] } }
                : null;

            // Merge SSR data (Baggage/SeatPreferences/MealDynamic indexed by sector)
            const mergeSsrKey = (outS, retS, key) => [
                ...(outS?.Response?.[key] || []),
                ...(retS?.Response?.[key] || []),
            ];
            const ssrData = (outSsr || retSsr) ? {
                Response: {
                    Baggage:         mergeSsrKey(outSsr, retSsr, 'Baggage'),
                    SeatPreferences: mergeSsrKey(outSsr, retSsr, 'SeatPreferences'),
                    SeatDynamic:     mergeSsrKey(outSsr, retSsr, 'SeatDynamic'),
                    MealDynamic:     mergeSsrKey(outSsr, retSsr, 'MealDynamic'),
                    Meal:            mergeSsrKey(outSsr, retSsr, 'Meal'),
                }
            } : null;

            // Use independent upsell structures
            const upsellData = {
                outbound: outUpsell || null,
                return: retUpsell || null
            };

            // ── Debug summary ──────────────────────────────────────────────────


            // Always open the modal — user clicked "View Fare" explicitly
            // Even 1 fare family shows baggage, rules, price before booking
            setFetchedFareData({ quoteData, ruleData, ssrData, upsellData });
            setShowFareModal(true);


        } catch (err) {
            console.error('❌ Fare detail fetch error:', err);
            alert('This flight is no longer available or the search has expired. Please refresh the search.');
        } finally {
            setIsFareLoading(false);
        }
    };

    return (

        <section className="flight-results-area" style={{ background: '#f4f7fa', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
            <style>{`
                .fr-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
                .fr-sticky-container { display: flex; align-items: center; justify-content: space-between; gap: 20px; position: relative; }
                .fr-sticky-details { flex: 1; display: flex; gap: 20px; }
                .fr-sticky-box { flex: 1; display: flex; align-items: center; background: #252542; padding: 12px 16px; border-radius: 8px; border: 1px solid #36365c; }
                @media(max-width: 1024px) {
                    .fr-grid { grid-template-columns: 1fr; }
                    .fr-sticky-container { flex-direction: column; align-items: stretch; gap: 12px; }
                    .fr-sticky-details { flex-direction: column; gap: 10px; width: 100%; }
                    .fr-sticky-box { width: 100%; }
                }
            `}</style>
            {/* ── Modify Search Bar (Top) ── */}
            <ModifyFlightSearchBar initialState={location.state} />

            <div style={{ padding: '0' }}>
                <FlightSidebar
                    flights={flights}
                    filteredCount={filteredFlights.length}
                    totalCount={flights.length}
                    activeFilters={activeFilters}
                    priceRange={priceRange}
                    originCity={originCity}
                    onStopToggle={handleStopToggle}
                    onFiltersApply={handleFiltersApply}
                />
            </div>

            <div className="container" style={{ paddingTop: '0' }}>

                {/* ── Calendar Fare Strip ── */}
                {!isLoading && calendarFares.length > 0 && (
                    <div className="cal-container" style={{ display: 'flex', alignItems: 'stretch', background: '#fff', borderRadius: '4px', border: '1px solid #e0e0e0', marginBottom: '16px', height: '64px', overflow: 'hidden' }}>
                        <style>{`
                            @media(max-width: 768px) {
                                .cal-nav-btn { display: none !important; }
                            }
                        `}</style>
                        <button className="cal-nav-btn" onClick={() => scroll('left')} style={{ width: '40px', background: '#fff', border: 'none', borderRight: '1px solid #e0e0e0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', flexShrink: 0, transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f8f9fa'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                        </button>
                        
                        <div ref={scrollContainerRef} style={{ display: 'flex', overflowX: 'auto', flex: 1, scrollbarWidth: 'none', msOverflowStyle: 'none' }} className="cal-scroll">
                            <style>{`
                                .cal-scroll::-webkit-scrollbar { display: none; }
                                .cal-item-active { background: #f8f9fa; border-top: 3px solid #0052cc !important; position: relative; }
                                .cal-item-active::before { content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%); border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid #0052cc; }
                            `}</style>
                            {calendarFares.map((item, idx) => {
                                const d = new Date(item.DepartureDate);
                                const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                                const dayNum = d.getDate();
                                const mon = d.toLocaleDateString('en-US', { month: 'short' });
                                const curDate = location.state?.PreferredDepartureTime?.split('T')[0] || '';
                                const itemDate = item.DepartureDate.split('T')[0];
                                const isActive = curDate === itemDate;
                                const isCheapest = item.Fare === cheapestFareVal;
                                
                                return (
                                    <div key={idx} onClick={() => !isActive && handleDateSelect && handleDateSelect(item.DepartureDate)}
                                        className={isActive ? 'cal-item-active' : ''}
                                        style={{ 
                                            minWidth: '108px', 
                                            padding: '8px 12px', 
                                            borderRight: '1px solid #e0e0e0', 
                                            borderTop: '3px solid transparent', 
                                            textAlign: 'center', 
                                            cursor: isActive ? 'default' : 'pointer', 
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                            transition: 'background 0.2s',
                                            background: isActive ? '#f8f9fa' : '#fff',
                                            flexShrink: 0
                                        }}
                                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#fcfcfc'; }}
                                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = '#fff'; }}
                                    >
                                        <div style={{ fontSize: '13px', fontWeight: '500', color: '#555', marginBottom: '2px', fontFamily: "'Inter', sans-serif" }}>
                                            {dayName}, {dayNum} {mon}
                                        </div>
                                        <div style={{ fontSize: '15px', fontWeight: '700', color: isCheapest ? '#00a651' : '#222', fontFamily: "'Inter', sans-serif" }}>
                                            ₹ {Math.round(item.Fare).toLocaleString('en-IN')}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        
                        <button className="cal-nav-btn" onClick={() => scroll('right')} style={{ width: '40px', background: '#fff', border: 'none', borderLeft: '1px solid #e0e0e0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', flexShrink: 0, transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f8f9fa'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                        </button>
                        
                        <div className="cal-nav-btn" style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff', flexShrink: 0, cursor: 'pointer', borderLeft: '1px solid #e0e0e0', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f8f9fa'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '2px' }}>
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                                <circle cx="9" cy="15" r="1" fill="#2563eb" stroke="none"></circle>
                                <circle cx="15" cy="15" r="1" fill="#2563eb" stroke="none"></circle>
                            </svg>
                            <span style={{ fontSize: '11px', fontWeight: '700', color: '#555', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif" }}>
                                {calendarFares.length > 0 ? new Date(calendarFares[0].DepartureDate).toLocaleDateString('en-US', { month: 'short' }) : 'JUN'}
                            </span>
                        </div>
                    </div>
                )}

                {/* ── Sort Bar ── */}
                {!isLoading && flights.length > 0 && (
                    <div style={{ display: 'flex', background: '#fff', borderRadius: '8px', border: '1px solid #e4e7ed', marginBottom: '12px', overflowX: 'auto', overflowY: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        <div style={{ width: '120px', flexShrink: 0, display: 'flex', alignItems: 'center', padding: '10px 16px', borderRight: '1px solid #e4e7ed' }}>
                            <span style={{ fontSize: '13px', fontWeight: '700', color: '#555' }}>Sort By:</span>
                        </div>
                        {SORT_TABS.map((tab, idx) => (
                            <div key={tab.id} onClick={() => setSortBy(tab.id)}
                                style={{ flex: 1, minWidth: '90px', padding: '10px 8px', textAlign: 'center', cursor: 'pointer', borderRight: idx < SORT_TABS.length - 1 ? '1px solid #e4e7ed' : 'none', background: sortBy === tab.id ? '#edf4ff' : '#fff', color: sortBy === tab.id ? '#1a6dcf' : '#4a5568', fontWeight: sortBy === tab.id ? '800' : '600', fontSize: '12px', transition: 'all 0.15s', userSelect: 'none', borderBottom: sortBy === tab.id ? '3px solid #1a6dcf' : '3px solid transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                                onMouseEnter={e => { if (sortBy !== tab.id) e.currentTarget.style.background = '#f8faff'; }}
                                onMouseLeave={e => { if (sortBy !== tab.id) e.currentTarget.style.background = '#fff'; }}>
                                {tab.label}
                                {sortBy === tab.id && <span>&uarr;</span>}
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Results ── */}
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '100px 0', background: '#fff', borderRadius: '12px', border: '1px solid #e4e7ed' }}>
                        <div className="spinner-border text-danger" role="status" style={{ width: '3rem', height: '3rem' }}><span className="visually-hidden">Loading...</span></div>
                        <h5 style={{ marginTop: '16px', fontWeight: '700', color: '#1a1a2e' }}>Searching live flight fares...</h5>
                        <p style={{ fontSize: '13px', color: '#687b8f' }}>Fetching real-time seat availability from TBO Airlines API</p>
                    </div>
                ) : returnFlights.length > 0 ? (
                    <div className="fr-grid">
                        <div>
                            <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#1a1a2e', marginBottom: '12px', background: '#fff', padding: '10px 14px', borderRadius: '6px', border: '1px solid #e4e7ed' }}>Outbound: {sortedFlights[0]?.Segments[0][0].Origin.Airport.CityName} to {sortedFlights[0]?.Segments[0][sortedFlights[0].Segments[0].length-1].Destination.Airport.CityName}</h4>
                            {sortedFlights.length > 0 ? sortedFlights.map((flight, i) => (
                                <RoundTripFlightCard key={flight.ResultIndex || i} flight={flight} isSelected={selectedOutbound?.ResultIndex === flight.ResultIndex} onSelect={setSelectedOutbound} />
                            )) : <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', textAlign: 'center' }}>No flights found.</div>}
                        </div>
                        <div>
                            <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#1a1a2e', marginBottom: '12px', background: '#fff', padding: '10px 14px', borderRadius: '6px', border: '1px solid #e4e7ed' }}>Return: {sortedReturnFlights[0]?.Segments[0][0].Origin.Airport.CityName} to {sortedReturnFlights[0]?.Segments[0][sortedReturnFlights[0].Segments[0].length-1].Destination.Airport.CityName}</h4>
                            {sortedReturnFlights.length > 0 ? sortedReturnFlights.map((flight, i) => (
                                <RoundTripFlightCard key={flight.ResultIndex || i} flight={flight} isSelected={selectedReturn?.ResultIndex === flight.ResultIndex} onSelect={setSelectedReturn} />
                            )) : <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', textAlign: 'center' }}>No flights found.</div>}
                        </div>
                    </div>
                ) : flights.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 0', background: '#fff', borderRadius: '12px', border: '1px solid #e4e7ed' }}>
                        <h4 style={{ color: '#687b8f', fontWeight: '700' }}>No flights found for this route or date.</h4>
                        <p style={{ fontSize: '13px', color: '#9aabb8', marginTop: '10px' }}>Try searching for a different date (e.g. 15-20 days from today) or route.</p>
                    </div>
                ) : sortedFlights.length > 0 ? (
                    <div>{sortedFlights.map((flight, i) => <FlightCard key={flight.ResultIndex || i} flight={flight} />)}</div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '80px 0', background: '#fff', borderRadius: '12px', border: '1px solid #e4e7ed' }}>
                        <h4 style={{ color: '#687b8f', fontWeight: '700' }}>No flights match your filters.</h4>
                        <p style={{ fontSize: '13px', color: '#9aabb8', marginTop: '10px' }}>Try adjusting or clearing your filters.</p>
                    </div>
                )}
            </div>

            {/* ── Yatra-Style Round Trip Sticky Footer ── */}
            {returnFlights.length > 0 && selectedOutbound && selectedReturn && (
                <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#1a1a2e', color: '#fff', padding: '16px 0', zIndex: 999, boxShadow: '0 -4px 16px rgba(0,0,0,0.2)', borderTop: '2px solid #d81b21', fontFamily: "'Outfit','Inter',sans-serif" }}>
                    <div className="container fr-sticky-container">
                        
                        <div className="fr-sticky-details">
                            {/* Outbound Detail Box */}
                            <div className="fr-sticky-box">
                                <div style={{ background: '#fff', borderRadius: '6px', padding: '3px', width: '38px', height: '38px', marginRight: '16px', flexShrink: 0 }}>
                                    <img src={`https://pics.avs.io/60/60/${selectedOutbound.Segments[0][0].Airline.AirlineCode}.png`} alt="Airline" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                        <div style={{ fontSize: '12px', color: '#a0aab2', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>Outbound</div>
                                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>₹{Math.round(selectedOutbound.Fare.PublishedFare).toLocaleString('en-IN')}</div>
                                    </div>
                                    <div style={{ fontSize: '15px', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {selectedOutbound.Segments[0][0].Origin.Airport.CityCode}
                                        <span style={{ fontSize: '12px', color: '#687b8f' }}>&rarr;</span>
                                        {selectedOutbound.Segments[0][selectedOutbound.Segments[0].length-1].Destination.Airport.CityCode}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#c5d0db', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span>{new Date(selectedOutbound.Segments[0][0].Origin.DepTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: false})} - {new Date(selectedOutbound.Segments[0][selectedOutbound.Segments[0].length-1].Destination.ArrTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: false})}</span>
                                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#687b8f' }}></span>
                                        <span>{selectedOutbound.Segments[0][0].Airline.AirlineName} ({selectedOutbound.Segments[0][0].Airline.AirlineCode}-{selectedOutbound.Segments[0][0].Airline.FlightNumber})</span>
                                    </div>
                                </div>
                            </div>

                            {/* Return Detail Box */}
                            <div className="fr-sticky-box">
                                <div style={{ background: '#fff', borderRadius: '6px', padding: '3px', width: '38px', height: '38px', marginRight: '16px', flexShrink: 0 }}>
                                <img src={`https://pics.avs.io/60/60/${selectedReturn.Segments[0][0].Airline.AirlineCode}.png`} alt="Airline" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                    <div style={{ fontSize: '12px', color: '#a0aab2', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>Return</div>
                                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>₹{Math.round(selectedReturn.Fare.PublishedFare).toLocaleString('en-IN')}</div>
                                </div>
                                <div style={{ fontSize: '15px', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {selectedReturn.Segments[0][0].Origin.Airport.CityCode}
                                    <span style={{ fontSize: '12px', color: '#687b8f' }}>&rarr;</span>
                                    {selectedReturn.Segments[0][selectedReturn.Segments[0].length-1].Destination.Airport.CityCode}
                                </div>
                                <div style={{ fontSize: '12px', color: '#c5d0db', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span>{new Date(selectedReturn.Segments[0][0].Origin.DepTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: false})} - {new Date(selectedReturn.Segments[0][selectedReturn.Segments[0].length-1].Destination.ArrTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: false})}</span>
                                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#687b8f' }}></span>
                                    <span>{selectedReturn.Segments[0][0].Airline.AirlineName} ({selectedReturn.Segments[0][0].Airline.AirlineCode}-{selectedReturn.Segments[0][0].Airline.FlightNumber})</span>
                                </div>
                            </div>
                        </div>
                        </div>

                        {/* Total Price & Book */}
                        <div style={{ minWidth: '180px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                            <div style={{ fontSize: '12px', color: '#a0aab2', fontWeight: '600' }}>Total Fare</div>
                            <div style={{ fontSize: '26px', fontWeight: '800', color: '#fff', lineHeight: 1.1, marginBottom: '10px' }}>
                                ₹{Math.round(selectedOutbound.Fare.PublishedFare + selectedReturn.Fare.PublishedFare).toLocaleString('en-IN')}
                            </div>
                            <button 
                                onClick={handleViewFareClick}
                                disabled={isFareLoading}
                                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: isFareLoading ? '#a0aab2' : '#d81b21', color: '#fff', border: 'none', padding: '12px 0', borderRadius: '6px', fontSize: '16px', fontWeight: '800', cursor: isFareLoading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
                                onMouseEnter={e => !isFareLoading && (e.currentTarget.style.background = '#e8151b')}
                                onMouseLeave={e => !isFareLoading && (e.currentTarget.style.background = '#d81b21')}
                            >
                                {isFareLoading && <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />}
                                {isFareLoading ? 'Loading...' : 'View Fare'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {(() => {
                const outCount = extractUpsellFamilies(fetchedFareData?.upsellData?.outbound).length;
                const retCount = extractUpsellFamilies(fetchedFareData?.upsellData?.return).length;
                
                if (outCount > 1 || retCount > 1) {
                    return (
                        <FareOptionsModal 
                            isOpen={showFareModal} 
                            onClose={() => setShowFareModal(false)} 
                            outbound={selectedOutbound} 
                            returnFlight={selectedReturn} 
                            navigate={navigate}
                            fetchedFareData={fetchedFareData}
                        />
                    );
                } else {
                    return (
                        <PremiumFareDetailsModal 
                            isOpen={showFareModal} 
                            onClose={() => setShowFareModal(false)} 
                            outbound={selectedOutbound} 
                            returnFlight={selectedReturn} 
                            navigate={navigate}
                            fetchedFareData={fetchedFareData}
                        />
                    );
                }
            })()}

        </section>
    );
}

const calNavBtn = (right) => ({
    position: 'absolute', [right ? 'right' : 'left']: '-8px', zIndex: 10, width: '30px', height: '30px', borderRadius: '50%', background: '#fff', border: '1px solid #e4e7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#687b8f', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', transition: 'all 0.2s', outline: 'none', flexShrink: 0,
});

export default FlightResultsInner;
