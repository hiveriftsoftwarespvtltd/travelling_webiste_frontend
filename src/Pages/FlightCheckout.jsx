import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FooterOne from '../Components/Footer/FooterOne';
import LoginForm from '../Components/Header/LoginForm';
import { ShieldAlert, Loader2, Plane, Calendar, Clock, User, Phone, Mail, Luggage, Building, ShieldCheck, Utensils, PlusCircle, CheckCircle2 } from 'lucide-react';

function FlightCheckout() {
    const location = useLocation();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [fareQuoteData, setFareQuoteData] = useState(null);
    const [ssrData, setSsrData] = useState(null);
    const [priceChangedAlert, setPriceChangedAlert] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    // ✅ Stores the ResultIndex from FareQuote response — stored in a ref to avoid stale closure in Razorpay handler
    const [confirmedResultIndex, setConfirmedResultIndex] = useState(null);
    const confirmedResultIndexRef = useRef(null);

    // Add-on states (Yatra-style per passenger per sector)
    const [selectedSSR, setSelectedSSR] = useState({});
    const [activeSsrTab, setActiveSsrTab] = useState('meals'); // 'meals', 'baggage', 'seats'
    const [activeSector, setActiveSector] = useState(0);
    const [activeSegment, setActiveSegment] = useState(0); // For multi-segment (connecting) flights seat map
    // activePax stores the passenger's ORIGINAL index (0-based in the full passengers array)
    const [activePax, setActivePax] = useState(null); // null until passengers are loaded
    const [passengers, setPassengers] = useState([]);
    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [contactCountryCode, setContactCountryCode] = useState('+91');
    const [validationError, setValidationError] = useState('');
    const [isBooking, setIsBooking] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('idle'); // 'idle' | 'paying' | 'verifying' | 'booking'
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);
    const [hasGST, setHasGST] = useState(false);
    const [gstDetails, setGstDetails] = useState({ GSTNumber: '', GSTCompanyName: '', GSTCompanyEmail: '', GSTCompanyContactNumber: '', GSTCompanyAddress: 'India' });

    useEffect(() => {
        const openLogin = () => setIsLoginFormOpen(true);
        window.addEventListener('openLoginModal', openLogin);
        return () => window.removeEventListener('openLoginModal', openLogin);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            // ✅ FIX: Try location.state first, then fall back to sessionStorage (survives refresh)
            let state = location.state;
            if (!state || !state.TraceId || !state.ResultIndex) {
                try {
                    const saved = sessionStorage.getItem('flightCheckoutState');
                    if (saved) state = JSON.parse(saved);
                } catch (_) { /* ignore parse errors */ }
            }
            if (!state || !state.TraceId || !state.ResultIndex) {
                navigate('/'); // truly invalid — redirect to home
                return;
            }
            // Save to sessionStorage so a page refresh still works
            try { sessionStorage.setItem('flightCheckoutState', JSON.stringify(state)); } catch (_) {}

            try {
                const flightApiBase = process.env.REACT_APP_FLIGHT_API_BASE_URL || 'http://localhost:8009/api/flight';

                const payload = { TraceId: state.TraceId, ResultIndex: state.ResultIndex };

                let quoteData = state.prefetchedQuote;
                let ssrJson = state.prefetchedSsr;

                // Fetch Fare Quote if not provided
                if (!quoteData) {
                    const quoteRes = await fetch(`${flightApiBase}/fare-quote`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    if (!quoteRes.ok) {
                        const err = await quoteRes.json();
                        throw new Error(err.message || 'Fare quote failed');
                    }
                    quoteData = await quoteRes.json();
                }

                // Fetch SSR if not provided
                if (!ssrJson) {
                    const ssrRes = await fetch(`${flightApiBase}/ssr`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    }).catch(() => null); // SSR is optional

                    ssrJson = ssrRes?.ok ? await ssrRes.json() : null;
                }

                if (quoteData?.Response?.Results || (quoteData?.Response?.ResponseStatus === 1 && quoteData?.Response?.Results)) {
                    const results = quoteData.Response.Results;
                    setFareQuoteData(results);
                    // ✅ Save the FareQuote's ResultIndex — TBO requires THIS for Book/Ticket (not the search ResultIndex)
                    const riFromQuote = results?.ResultIndex || state.ResultIndex;
                    setConfirmedResultIndex(riFromQuote);
                    confirmedResultIndexRef.current = riFromQuote; // ← ref for Razorpay stale-closure fix

                    if (quoteData.Response.IsPriceChanged) setPriceChangedAlert(true);
                } else {
                    throw new Error('Seat not available or pricing failed.');
                }

                if (ssrJson?.Response?.Baggage || ssrJson?.Response?.MealDynamic || ssrJson?.Response?.SpecialServices || ssrJson?.Response?.SeatDynamic || ssrJson?.Response?.ResponseStatus === 1) {
                    const ssrResp = ssrJson.Response;
                    setSsrData(ssrResp);
                    // ✅ Auto-select the first available SSR tab based on what data exists
                    // TBO can return 1D or 2D arrays.
                    const firstMeal = Array.isArray(ssrResp?.MealDynamic?.[0]) ? ssrResp.MealDynamic[0] : ssrResp?.MealDynamic;
                    const firstBaggage = Array.isArray(ssrResp?.Baggage?.[0]) ? ssrResp.Baggage[0] : ssrResp?.Baggage;
                    const firstSpecial = Array.isArray(ssrResp?.SpecialServices?.[0]) ? ssrResp.SpecialServices[0] : ssrResp?.SpecialServices;

                    if (firstMeal?.length > 0) setActiveSsrTab('meals');
                    else if (firstBaggage?.length > 0) setActiveSsrTab('baggage');
                    else if (ssrResp?.SeatDynamic?.[0]?.SegmentSeat?.[0]?.RowSeats?.length > 0) setActiveSsrTab('seats');
                    else if (firstSpecial?.length > 0) setActiveSsrTab('special');

                    // ─── AUTO-SELECT 0-PRICE SSRs ─────────────────────────────────────────
                    // TBO Rule: If isseatmandatory/ismealmandatory is true (SpiceMax, Super 6E),
                    // or if IsLCC=true and JourneyType=2 (International LCC),
                    // we must include 0-price SSRs in the ticket request.
                    // fareResults: fareQuoteData state is already quoteData.Response.Results
                    const fareResults = fareQuoteData;
                    const isSeatMandatory = fareResults?.isseatmandatory === true;
                    const isMealMandatory = fareResults?.ismealmandatory === true;
                    const isIntlLCC = fareResults?.IsLCC === true && (fareResults?.JourneyType === 2 || fareResults?.IsInternational === true);
                    const isI5Domestic = (fareResults?.Segments?.[0]?.[0]?.Airline?.AirlineCode === 'I5');

                    if (isSeatMandatory || isMealMandatory || isIntlLCC || isI5Domestic) {
                        // Build auto-selections for each sector and each passenger
                        const autoSSR = {};
                        const segments = fareResults?.Segments || [[]];
                        segments.forEach((segGroup, sectorIdx) => {
                            autoSSR[sectorIdx] = autoSSR[sectorIdx] || {};
                            
                            const fareBreakdown = fareResults?.FareBreakdown || [];
                            let paxGlobalIdx = 0;
                            fareBreakdown.forEach(fb => {
                                for (let p = 0; p < fb.PassengerCount; p++) {
                                    autoSSR[sectorIdx][paxGlobalIdx] = autoSSR[sectorIdx][paxGlobalIdx] || { _hasSet: {} };

                                    // Auto-select 0-price Meal
                                    if (isMealMandatory || isIntlLCC || isI5Domestic) {
                                        const mealArr = Array.isArray(ssrResp?.MealDynamic?.[sectorIdx]) 
                                            ? ssrResp.MealDynamic[sectorIdx] 
                                            : (Array.isArray(ssrResp?.MealDynamic) ? ssrResp.MealDynamic : []);
                                        const freeMeal = mealArr.find(m => m.Price === 0 || m.Price === '0');
                                        if (freeMeal) {
                                            autoSSR[sectorIdx][paxGlobalIdx].meal = freeMeal;
                                            autoSSR[sectorIdx][paxGlobalIdx]._hasSet.meal = true;
                                        }
                                    }

                                    // Auto-select 0-price Baggage (International LCC and I5)
                                    if (isIntlLCC || isI5Domestic) {
                                        const bagArr = Array.isArray(ssrResp?.Baggage?.[sectorIdx]) 
                                            ? ssrResp.Baggage[sectorIdx] 
                                            : (Array.isArray(ssrResp?.Baggage) ? ssrResp.Baggage : []);
                                        const freeBag = bagArr.find(b => b.Price === 0 || b.Price === '0');
                                        if (freeBag) {
                                            autoSSR[sectorIdx][paxGlobalIdx].baggage = freeBag;
                                            autoSSR[sectorIdx][paxGlobalIdx]._hasSet.baggage = true;
                                        }
                                    }

                                    // Auto-select 0-price Seat (when isseatmandatory)
                                    if (isSeatMandatory) {
                                        const seatSegments = ssrResp?.SeatDynamic?.[sectorIdx]?.SegmentSeat;
                                        if (seatSegments) {
                                            seatSegments.forEach(seg => {
                                                seg?.RowSeats?.forEach(row => {
                                                    if (!autoSSR[sectorIdx][paxGlobalIdx].seat) {
                                                        const freeSeat = row?.Seats?.find(s => s.Price === 0 || s.Price === '0');
                                                        if (freeSeat) {
                                                            autoSSR[sectorIdx][paxGlobalIdx].seat = freeSeat;
                                                            autoSSR[sectorIdx][paxGlobalIdx]._hasSet.seat = true;
                                                        }
                                                    }
                                                });
                                            });
                                        }
                                    }

                                    paxGlobalIdx++;
                                }
                            });
                        });

                        // Merge with any existing manual selections
                        setSelectedSSR(prev => {
                            const merged = { ...prev };
                            Object.keys(autoSSR).forEach(sIdx => {
                                merged[sIdx] = merged[sIdx] || {};
                                Object.keys(autoSSR[sIdx]).forEach(pIdx => {
                                    merged[sIdx][pIdx] = { ...autoSSR[sIdx][pIdx], ...(merged[sIdx][pIdx] || {}) };
                                });
                            });
                            return merged;
                        });

                        console.log('[Auto-SSR] Free SSRs auto-selected for mandatory/LCC fare:', autoSSR);
                    }
                    // ─── END AUTO-SELECT ──────────────────────────────────────────────────

                } else {
                    // Fallback: Set empty object so the 'No add-ons available' UI renders instead of disappearing entirely
                    setSsrData({});
                }
            } catch (err) {
                console.error(err);
                setErrorMsg(err.message || "An error occurred while confirming your flight.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [location.state, navigate]);

    // Load Razorpay checkout script dynamically
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            // cleanup if component unmounts
            document.body.removeChild(script);
        };
    }, []);

    // Initialize passenger form states based on FareBreakdown
    useEffect(() => {
        if (fareQuoteData?.FareBreakdown && passengers.length === 0) {
            const initialPax = [];
            fareQuoteData.FareBreakdown.forEach(fb => {
                for (let i = 0; i < fb.PassengerCount; i++) {
                    initialPax.push({
                        PaxType: fb.PassengerType,
                        Title: fb.PassengerType === 1 ? 'Mr' : fb.PassengerType === 2 ? 'Master' : 'Master',
                        FirstName: '',
                        LastName: '',
                        Gender: 1,
                        DateOfBirth: '',
                        PassportNo: '',
                        PassportExpiry: '',
                        PAN: '',
                        MealPreference: '',
                        SeatPreference: '',
                        Fare: fb
                    });
                }
            });
            setPassengers(initialPax);
            // Set activePax to first eligible pax (Adult or Child) originalIndex
            const firstEligible = initialPax.findIndex(p => p.PaxType === 1 || p.PaxType === 2);
            if (firstEligible !== -1) setActivePax(firstEligible);
        }
    }, [fareQuoteData]);

    const formatTime = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const formatDuration = (minutes) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
    };

    if (isLoading) {
        return (
            <>
                <section style={{ background: '#f4f7fa', padding: '40px 0', minHeight: '80vh' }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8">
                                {/* Skeleton Itinerary */}
                                <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', marginBottom: '24px', animation: 'pulse 1.5s infinite', border: '1px solid #e4e7ed' }}>
                                    <div style={{ height: '24px', width: '200px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '20px' }}></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div style={{ height: '60px', width: '100px', background: '#e2e8f0', borderRadius: '8px' }}></div>
                                        <div style={{ height: '60px', width: '30%', background: '#e2e8f0', borderRadius: '8px' }}></div>
                                        <div style={{ height: '60px', width: '100px', background: '#e2e8f0', borderRadius: '8px' }}></div>
                                    </div>
                                </div>
                                {/* Skeleton Add-ons */}
                                <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', marginBottom: '24px', animation: 'pulse 1.5s infinite', border: '1px solid #e4e7ed' }}>
                                    <div style={{ height: '24px', width: '180px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '20px' }}></div>
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <div style={{ height: '40px', width: '100px', background: '#e2e8f0', borderRadius: '20px' }}></div>
                                        <div style={{ height: '40px', width: '100px', background: '#e2e8f0', borderRadius: '20px' }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                {/* Skeleton Fare Summary */}
                                <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', animation: 'pulse 1.5s infinite', border: '1px solid #e4e7ed' }}>
                                    <div style={{ height: '24px', width: '150px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '24px' }}></div>
                                    <div style={{ height: '16px', width: '100%', background: '#e2e8f0', borderRadius: '4px', marginBottom: '16px' }}></div>
                                    <div style={{ height: '16px', width: '80%', background: '#e2e8f0', borderRadius: '4px', marginBottom: '16px' }}></div>
                                    <div style={{ height: '40px', width: '100%', background: '#cbd5e1', borderRadius: '8px', marginTop: '30px' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <FooterOne />
            </>
        );
    }

    if (errorMsg) {
        return (
            <>
                <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                    <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', padding: '40px', borderRadius: '16px', textAlign: 'center', maxWidth: '500px' }}>
                        <ShieldAlert size={48} color="#ef4444" style={{ marginBottom: '16px' }} />
                        <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '700', color: '#991b1b', marginBottom: '12px' }}>
                            Booking Unavailable
                        </h3>
                        <p style={{ color: '#b91c1c', marginBottom: '24px' }}>{errorMsg}</p>
                        <button
                            onClick={() => navigate(-1)}
                            className="th-btn"
                            style={{ padding: '12px 30px', borderRadius: '30px', background: '#ef4444', color: '#fff', border: 'none', fontWeight: '700' }}
                        >
                            Back to Search
                        </button>
                    </div>
                </div>
                <FooterOne />
            </>
        );
    }

    const segments = fareQuoteData?.Segments || [];
    const firstLeg = segments[0]?.[0];
    const lastSegment = segments[segments.length - 1] || [];
    const lastLeg = lastSegment[lastSegment.length - 1]; // Main display uses full journey bounds
    const fare = fareQuoteData?.Fare || {};

    const originCountryCode = firstLeg?.Origin?.Airport?.CountryCode;
    const destinationCountryCode = lastLeg?.Destination?.Airport?.CountryCode;
    
    // Check if the API explicitly requires passport for booking or ticketing
    const apiRequiresPassport = 
        fareQuoteData?.IsPassportRequiredAtBook === true || 
        fareQuoteData?.IsPassportRequiredAtTicket === true;
        
    // Check if it's an international flight based on country codes
    const isInternationalByCountryCode = 
        !!(originCountryCode && destinationCountryCode && originCountryCode !== destinationCountryCode);

    // If either condition is true, we require the passport details
    const isPassportRequired = apiRequiresPassport || isInternationalByCountryCode;
    const isPanRequired = fareQuoteData?.IsPanRequiredAtBook === true || fareQuoteData?.IsPanRequiredAtTicket === true;

    // Normalize SSR arrays (TBO sometimes returns 1D array for One-Way, 2D array for Round-Trip)
    const normalizeSsrArray = (data) => {
        if (!data || !Array.isArray(data) || data.length === 0) return [];
        // If the first element is NOT an array, it's a 1D array. Wrap it to make it 2D (per sector).
        if (!Array.isArray(data[0])) return [data];
        return data;
    };

    const mealDynamicNorm = normalizeSsrArray(ssrData?.MealDynamic);
    const baggageNorm = normalizeSsrArray(ssrData?.Baggage);
    const specialServicesNorm = normalizeSsrArray(ssrData?.SpecialServices);

    const currentAvailableMeals    = mealDynamicNorm[activeSector] || [];
    const currentAvailableBaggage  = (baggageNorm[activeSector] || []).filter(b => b.Code !== 'NoBaggage');
    // SeatDynamic is an array of objects per sector, each sector can have multiple SegmentSeats (for connecting flights).
    const currentSegmentSeats = ssrData?.SeatDynamic?.[activeSector]?.SegmentSeat || [];
    const currentAvailableSeatsRows = currentSegmentSeats[activeSegment]?.RowSeats || [];
    const currentSpecialServices   = specialServicesNorm[activeSector] || [];

    // Calculate total SSR price
    let mealPrice = 0, baggagePrice = 0, seatPrice = 0, specialPrice = 0;
    Object.values(selectedSSR).forEach(sectorPaxMap => {
        Object.values(sectorPaxMap).forEach(ssr => {
            if (ssr.meal)    mealPrice    += ssr.meal.Price    || 0;
            if (ssr.baggage) baggagePrice += ssr.baggage.Price || 0;
            if (ssr.seat)    seatPrice    += ssr.seat.Price    || 0;
            if (ssr.special) specialPrice += ssr.special.Price || 0;
        });
    });
    const totalFare = (fare.PublishedFare || 0) + mealPrice + baggagePrice + seatPrice + specialPrice;

    // Build eligible passenger list (Adults + Children; Infants sit on adult lap)
    // Each entry carries originalIndex = their position in the full passengers[] array
    const adultCount  = { n: 0 };
    const childCount  = { n: 0 };
    const eligiblePassengers = passengers
        .map((p, i) => ({ ...p, originalIndex: i }))
        .filter(p => p.PaxType === 1 || p.PaxType === 2)
        .map(p => {
            if (p.PaxType === 1) { adultCount.n++; return { ...p, label: `Adult ${adultCount.n}` }; }
            childCount.n++; return { ...p, label: `Child ${childCount.n}` };
        });
    const eligiblePaxCount = eligiblePassengers.length;

    // Set of seat codes already booked by OTHER passengers (same sector)
    const bookedSeatCodes = new Set(
        Object.entries(selectedSSR[activeSector] || {})
            .filter(([paxIdx]) => Number(paxIdx) !== activePax)
            .map(([, ssr]) => ssr?.seat?.Code)
            .filter(Boolean)
    );

    const handleSsrToggle = (type, item) => {
        // Guard: don't allow toggle if no passenger is selected yet
        if (activePax === null) return;
        if (type === 'seat' && item?.AvailablityType !== 1) return;
        if (type === 'seat' && item && bookedSeatCodes.has(item.Code)) return;

        setSelectedSSR(prev => {
            // ✅ DEEP COPY each nested level — shallow spread only copies top level,
            //    inner objects keep the same reference, React won't see the change.
            const prevSector = prev[activeSector] || {};
            const prevPax    = prevSector[activePax] || { meal: null, baggage: null, seat: null, _hasSet: {} };

            // Determine new value: toggle off if same item clicked again, or "No X" clicked
            const same     = prevPax[type]?.Code === item?.Code;
            const newValue = (!item || same) ? null : item;

            // _hasSet tracks which types user has explicitly interacted with
            // so we can distinguish 'user cleared to No Meal' vs 'never touched'
            const newHasSet = { ...(prevPax._hasSet || {}), [type]: true };

            // Build a fresh object at every level so React detects the change
            return {
                ...prev,
                [activeSector]: {
                    ...prevSector,
                    [activePax]: {
                        ...prevPax,
                        [type]: newValue,
                        _hasSet: newHasSet,
                    },
                },
            };
        });
    };

    // Returns the selected item for the current pax+sector, or null if none
    const getCurrentSSR = (type) => selectedSSR[activeSector]?.[activePax]?.[type] ?? null;

    // Returns true only if user has EXPLICITLY interacted with this SSR type for current pax+sector
    const hasUserSetSSR = (type) => !!(selectedSSR[activeSector]?.[activePax]?._hasSet?.[type]);

    // Summary badge for a pax (how many add-ons selected across all sectors)
    const getPaxSsrCount = (origIdx) => {
        let count = 0;
        Object.values(selectedSSR).forEach(sMap => {
            const s = sMap[origIdx];
            if (s) { if (s.meal) count++; if (s.baggage) count++; if (s.seat) count++; if (s.special) count++; }
        });
        return count;
    };

    const handlePassengerChange = (index, field, value) => {
        const updated = [...passengers];
        updated[index] = { ...updated[index], [field]: value };
        if (field === 'Title') {
            updated[index].Gender = (value === 'Mr' || value === 'Master') ? 1 : 2;
        }
        setPassengers(updated);
    };

    const handleBookFlight = async () => {
        setValidationError('');
        if (isBooking) return;
        setIsBooking(true);

        if (!localStorage.getItem('token')) {
            setShowLoginPrompt(true);
            setIsBooking(false);
            return;
        }

        setPaymentStatus('idle');

        try {
            // fareQuoteData state = quoteData.Response.Results (set in useEffect line 96)
            // So Segments[0][0].Airline.AirlineCode is directly accessible
            const airlineCode = fareQuoteData?.Segments?.[0]?.[0]?.Airline?.AirlineCode;
            const isPanRequired = fareQuoteData?.IsPanRequiredAtBook === true || fareQuoteData?.IsPanRequiredAtTicket === true;
            // isPassportRequired: use component-level which includes country-code-based international detection
            // (already defined above as: apiRequiresPassport || isInternationalByCountryCode)
            // We shadow it here to ensure it's the most complete check
            const isPassportRequiredFull = isPassportRequired; // inherits component-level value

            // Validate that all passengers have required fields
            for (const pax of passengers) {
                if (!pax.FirstName || !pax.LastName) {
                    throw new Error('Please fill in names for all passengers.');
                }
                
                // SpiceJet (SG) - First Name and Last Name cannot be same
                if (airlineCode === 'SG') {
                    if (pax.FirstName.toLowerCase().trim() === pax.LastName.toLowerCase().trim()) {
                        throw new Error(`SpiceJet (SG) requires distinct First and Last names for passenger ${pax.FirstName}.`);
                    }
                }
                
                // TruJet (2T) and Zoom Air (ZO) - No space in Last Name
                if (airlineCode === '2T' || airlineCode === 'ZO') {
                    if (/\s/.test(pax.LastName)) {
                        throw new Error(`TruJet / Zoom Air does not allow spaces in the Last Name of passenger ${pax.FirstName}.`);
                    }
                }

                // SpiceJet special characters in name check (Navitaire 4X)
                const nameSpecialCharRegex = /[.,\/]/;
                if (nameSpecialCharRegex.test(pax.FirstName) || nameSpecialCharRegex.test(pax.LastName)) {
                    throw new Error(`Passenger name for ${pax.FirstName} contains invalid special characters (. , /). Please remove them.`);
                }

                // Date of Birth validation for Child/Infant OR AirAsia Adult
                if (pax.PaxType === 2 || pax.PaxType === 3 || ((airlineCode === 'I5' || airlineCode === 'AK') && pax.PaxType === 1)) {
                    if (!pax.DateOfBirth) {
                        throw new Error(`Date of Birth is mandatory for passenger ${pax.FirstName} based on airline rules.`);
                    }
                }

                if (isPassportRequired && (!pax.PassportNo || !pax.PassportExpiry)) {
                    throw new Error('Passport details are required for this flight.');
                }
                
                if (fareQuoteData?.IsPassportFullDetailRequiredAtBook && !pax.PassportIssueDate) {
                    throw new Error('Passport Issue Date is mandatory for this international flight.');
                }
                if (isPanRequired && !pax.PAN) {
                    throw new Error('PAN is required for this flight. Please provide it for all passengers or their guardian.');
                }
            }

            if (fareQuoteData?.IsGSTMandatory && (!gstDetails.GSTNumber || !gstDetails.GSTCompanyName || !gstDetails.GSTCompanyEmail || !gstDetails.GSTCompanyContactNumber || !gstDetails.GSTCompanyAddress)) {
                throw new Error('GST Details are mandatory for this booking. Please fill all GST fields.');
            }

            if (!contactEmail || !contactPhone) {
                throw new Error('Please provide contact email and phone number.');
            }
            if (contactPhone.length < 10) {
                throw new Error('Please enter a valid phone number (minimum 10 digits).');
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(contactEmail)) {
                throw new Error('Please enter a valid email address.');
            }

            // ─── STEP 1: Create Razorpay Order on Backend ───────────────────────────
            setPaymentStatus('paying');
            const flightApiBase = process.env.REACT_APP_FLIGHT_API_BASE_URL || 'http://localhost:8009/api/flight';
            // Derive payment base from flight base: strip '/flight' and replace with '/payment'
            const backendBase = flightApiBase.substring(0, flightApiBase.lastIndexOf('/'));  // → http://localhost:8009/api
            const paymentApiBase = `${backendBase}/payment`;                                  // → http://localhost:8009/api/payment

            const orderRes = await fetch(`${paymentApiBase}/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: totalFare,
                    receipt: `JIYOLIFE-${Date.now()}`,
                    currency: 'INR',
                }),
            });
            const orderData = await orderRes.json();

            if (!orderData.success || !orderData.orderId) {
                throw new Error(orderData.message || 'Failed to create payment order. Please try again.');
            }

            // ─── STEP 2: Open Razorpay Payment Modal ────────────────────────────────
            await new Promise((resolve, reject) => {
                if (!window.Razorpay) {
                    reject(new Error('Razorpay SDK failed to load. Please refresh the page and try again.'));
                    return;
                }

                const rzpOptions = {
                    key: orderData.keyId,
                    amount: orderData.amount,
                    currency: orderData.currency,
                    name: 'Jiyo Life Travel',
                    description: `Flight Booking — ${firstLeg?.Origin?.Airport?.CityCode} → ${lastLeg?.Destination?.Airport?.CityCode}`,
                    order_id: orderData.orderId,
                    prefill: {
                        name: `${passengers[0]?.FirstName || ''} ${passengers[0]?.LastName || ''}`.trim(),
                        email: contactEmail,
                        contact: contactCountryCode + contactPhone,
                    },
                    theme: {
                        color: '#e8151b',
                    },
                    // Allow all available payment methods (UPI, Net Banking, Cards, Wallets, QR, etc.)
                    config: {
                        display: {
                            blocks: {
                                banks: { name: 'Pay via Net Banking', instruments: [{ method: 'netbanking' }] },
                                upi:   { name: 'Pay via UPI', instruments: [{ method: 'upi' }] },
                                card:  { name: 'Pay via Card', instruments: [{ method: 'card' }] },
                                wallet:{ name: 'Pay via Wallet', instruments: [{ method: 'wallet' }] },
                            },
                            sequence: ['block.upi', 'block.card', 'block.banks', 'block.wallet'],
                            preferences: { show_default_blocks: true },
                        },
                    },
                    handler: async (response) => {
                        // Payment was successful — verify on backend before booking
                        try {
                            setPaymentStatus('verifying');
                            const verifyRes = await fetch(`${paymentApiBase}/verify`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature,
                                }),
                            });
                            const verifyData = await verifyRes.json();
                            if (verifyData.success) {
                                resolve(verifyData); // Proceed to TBO booking
                            } else {
                                reject(new Error('Payment verification failed. Your money is safe and will be refunded.'));
                            }
                        } catch (err) {
                            reject(new Error('Payment verification error: ' + err.message));
                        }
                    },
                    modal: {
                        ondismiss: () => {
                            reject(new Error('Payment was cancelled. Your booking was not confirmed.'));
                        },
                    },
                };

                const rzp = new window.Razorpay(rzpOptions);
                rzp.on('payment.failed', (response) => {
                    reject(new Error(`Payment failed: ${response.error?.description || 'Unknown error'}. Please try again.`));
                });
                rzp.open();
            });

            // ─── STEP 3: Payment Verified — Run TBO Booking ─────────────────────────
            setPaymentStatus('booking');


            // ✅ CRITICAL FIX: Re-fetch FareQuote after payment to get a FRESH ResultIndex.
            // TBO session can expire between page load and when the user finishes payment (15-30 mins).
            // Using a stale ResultIndex causes "Invalid Result Index" error from TBO.
            try {
                const flightApiBaseForRefresh = process.env.REACT_APP_FLIGHT_API_BASE_URL || 'http://localhost:8009/api/flight';
                const originalResultIndices = (confirmedResultIndexRef.current || location.state?.ResultIndex || '').split(',').map(r => r.trim()).filter(Boolean);
                const refreshedIndices = [];
                for (const ri of originalResultIndices) {
                    const refreshRes = await fetch(`${flightApiBaseForRefresh}/fare-quote`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ TraceId: location.state?.TraceId, ResultIndex: ri })
                    });
                    if (refreshRes.ok) {
                        const refreshData = await refreshRes.json();
                        const freshRI = refreshData?.Response?.Results?.ResultIndex;
                        if (freshRI) {
                            refreshedIndices.push(freshRI);

                        } else {
                            refreshedIndices.push(ri); // fallback to original
                        }
                    } else {
                        refreshedIndices.push(ri); // fallback
                    }
                }
                const freshRI = refreshedIndices.join(',');
                confirmedResultIndexRef.current = freshRI;
                setConfirmedResultIndex(freshRI);

            } catch (refreshErr) {
                console.warn('[FareQuote Refresh] Failed, will use cached RI:', refreshErr.message);
            }

            // Map selected SSRs
            const finalPassengers = passengers.map((pax, paxIndex) => {
                const mappedPax = {
                    Title: pax.Title,
                    FirstName: pax.FirstName,
                    LastName: pax.LastName,
                    PaxType: pax.PaxType,
                    DateOfBirth: pax.DateOfBirth ? `${pax.DateOfBirth}T00:00:00` : undefined,
                    Gender: pax.Gender,
                    PassportNo: pax.PassportNo,
                    PassportExpiry: pax.PassportExpiry ? `${pax.PassportExpiry}T00:00:00` : undefined,
                    AddressLine1: pax.AddressLine1 || 'Not Provided',
                    AddressLine2: "",
                    Fare: {
                        Currency: pax.Fare.Currency || "INR",
                        BaseFare: pax.Fare.BaseFare || 0,
                        Tax: pax.Fare.Tax || 0,
                        YQTax: pax.Fare.YQTax || 0.0,
                        AdditionalTxnFeePub: pax.Fare.AdditionalTxnFeePub || 0.0,
                        AdditionalTxnFeeOfrd: pax.Fare.AdditionalTxnFeeOfrd || 0.0,
                        OtherCharges: pax.Fare.OtherCharges || 0.0
                    },
                    City: pax.City || 'Not Provided',
                    CountryCode: airlineCode === 'I5' || airlineCode === 'AK' ? (pax.CountryCode || "IN") : "IN",
                    CountryName: airlineCode === 'I5' || airlineCode === 'AK' ? (pax.CountryName || "India") : "India",
                    Nationality: "IN",
                    ContactNo: contactPhone,
                    Email: contactEmail,
                    IsLeadPax: pax.IsLeadPax,
                    FFAirlineCode: null,
                    FFNumber: null,
                    Baggage: [],
                    MealDynamic: [],
                    SeatDynamic: []
                };

                // Add PAN & GST & Non-LCC SSRs to Payload
                if (fareQuoteData?.IsPanRequiredAtBook || fareQuoteData?.IsPanRequiredAtTicket) {
                    mappedPax.PAN = pax.PAN || '';
                }
                if (pax.MealPreference) mappedPax.MealPreference = pax.MealPreference;
                if (pax.SeatPreference) mappedPax.SeatPreference = pax.SeatPreference;

                if (hasGST && (pax.PaxType === 1)) {
                    mappedPax.GSTNumber = gstDetails.GSTNumber;
                    mappedPax.GSTCompanyName = gstDetails.GSTCompanyName;
                    mappedPax.GSTCompanyEmail = gstDetails.GSTCompanyEmail;
                    mappedPax.GSTCompanyContactNumber = gstDetails.GSTCompanyContactNumber;
                    mappedPax.GSTCompanyAddress = gstDetails.GSTCompanyAddress;
                }

                // Assign SSRs explicitly mapped to this passenger
                if (pax.PaxType === 1 || pax.PaxType === 2) {
                    const MealDynamic = [];
                    const Baggage = [];
                    const SeatDynamic = [];
                    const SpecialServices = [];

                    Object.keys(selectedSSR).forEach(sectorIdx => {
                        const ssr = selectedSSR[sectorIdx]?.[paxIndex];
                        if (ssr?.meal) MealDynamic.push(ssr.meal);
                        if (ssr?.baggage) Baggage.push(ssr.baggage);
                        if (ssr?.seat) SeatDynamic.push(ssr.seat);
                        if (ssr?.special) SpecialServices.push(ssr.special);
                    });

                    mappedPax.MealDynamic = MealDynamic;
                    mappedPax.Baggage = Baggage;
                    mappedPax.SeatDynamic = SeatDynamic;
                    // TBO typically merges SpecialServices into MealDynamic or SpecialServices depending on API version.
                    // We'll pass it if it exists.
                    if (SpecialServices.length > 0) mappedPax.SpecialServices = SpecialServices;
                }

                // Add passport only if required
                if (isPassportRequired) {
                    mappedPax.PassportNo = pax.PassportNo;
                    mappedPax.PassportExpiry = pax.PassportExpiry ? `${pax.PassportExpiry}T00:00:00` : undefined;
                    
                    if (fareQuoteData?.IsPassportFullDetailRequiredAtBook) {
                        mappedPax.PassportIssueDate = pax.PassportIssueDate ? `${pax.PassportIssueDate}T00:00:00` : undefined;
                        mappedPax.DocumentIssuingCountry = pax.DocumentIssuingCountry || 'IN';
                        mappedPax.PassportIssueCountryCode = pax.DocumentIssuingCountry || 'IN';
                        mappedPax.PassportIssueCountry = pax.DocumentIssuingCountry || 'IN';
                    }
                } else {
                    delete mappedPax.PassportNo;
                    delete mappedPax.PassportExpiry;
                }

                return mappedPax;
            });

            const userDataStr = localStorage.getItem("user");
            let loggedInUserId = '';
            let loggedInEmail = '';
            if (userDataStr) {
                try {
                    const parsedUser = JSON.parse(userDataStr);
                    loggedInUserId = parsedUser._id || '';
                    loggedInEmail = parsedUser.email || '';
                } catch(e) {}
            }

            const basePayload = {
                PreferredCurrency: null,
                AgentReferenceNo: `JIYOLIFE-${Date.now()}`,
                TraceId: location.state.TraceId,
                userId: loggedInUserId,
                email: loggedInEmail,
                Passengers: finalPassengers.map(p => ({
                    ...p,
                    CellCountryCode: contactCountryCode,
                    AddressLine2: p.AddressLine2 || "",
                    FFAirlineCode: null,
                    FFNumber: ""
                }))
            };

            const isLCC = fareQuoteData?.IsLCC || false;

            // ✅ KEY FIX: always use FareQuote's ResultIndex (via ref to avoid stale closure)
            const confirmedRI = confirmedResultIndexRef.current || confirmedResultIndex || location.state.ResultIndex;

            const indices = confirmedRI.includes(',')
                ? confirmedRI.split(',').map(i => i.trim())
                : [confirmedRI];
            const bookingResponses = [];

            for (const idx of indices) {
                const legPayload = { ...basePayload, ResultIndex: idx };
                let finalTicketResponse = null;

                // ── Helper: GetBookingDetails polling (for timeout recovery) ──────────────
                const pollBookingDetails = async (pnr, bookingId, maxAttempts = 10) => {
                    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                        setPaymentStatus('booking');
                        await new Promise(r => setTimeout(r, 12000)); // wait 12 seconds between polls
                        try {
                            const detailRes = await fetch(`${flightApiBase}/get-booking-details`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ PNR: pnr, BookingId: bookingId, TraceId: location.state.TraceId })
                            });
                            const detailData = await detailRes.json();
                            const bookingDetail = detailData?.Response?.Response;
                            // If we get actual booking details (not "under process"), return them
                            if (bookingDetail && bookingDetail.BookingId && !detailData?.Response?.Error?.ErrorMessage?.includes('under process')) {
                                return bookingDetail;
                            }
                        } catch (pollErr) {
                            console.warn(`[Polling] Attempt ${attempt} failed:`, pollErr.message);
                        }
                    }
                    return null; // Could not confirm after max attempts
                };

                if (isLCC) {
                    // ── LCC Flow: Direct Ticketing with IsPriceChanged retry ──
                    let ticketAttempt = 0;
                    let isPriceChangedAccepted = false;

                    while (ticketAttempt < 3) {
                        ticketAttempt++;
                        const lccTicketPayload = { 
                            ...legPayload, 
                            ...(isPriceChangedAccepted ? { IsPriceChangedAccepted: true } : {})
                        };

                        let lccRes, lccData;
                        try {
                            lccRes = await fetch(`${flightApiBase}/ticket`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(lccTicketPayload)
                            });
                            lccData = await lccRes.json();
                        } catch (timeoutErr) {
                            // Timeout — poll GetBookingDetails
                            console.warn('[LCC Ticket] Timeout. Polling GetBookingDetails...');
                            const polledDetail = await pollBookingDetails(null, null);
                            if (polledDetail) {
                                finalTicketResponse = { Response: polledDetail };
                                break;
                            }
                            throw new Error('Booking timed out. Please check your booking history or contact support.');
                        }

                        if (lccData?.Response?.ResponseStatus === 1) {
                            finalTicketResponse = lccData.Response;
                            break;
                        }

                        // Check IsPriceChanged
                        if (lccData?.Response?.IsPriceChanged === true && !isPriceChangedAccepted) {
                            console.warn('[LCC Ticket] IsPriceChanged=true. Retrying with IsPriceChangedAccepted=true...');
                            isPriceChangedAccepted = true;
                            continue; // retry
                        }

                        throw new Error(`Failed to ticket LCC flight (Index: ${idx}): ${lccData?.message || lccData?.Response?.Error?.ErrorMessage || 'Unknown error'}`);
                    }

                } else {
                    // ── Non-LCC Flow: Book then Ticket with full IsPriceChanged handling ──
                    const bookResponse = await fetch(`${flightApiBase}/book`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(legPayload)
                    });
                    const bookData = await bookResponse.json();

                    if (bookData?.Response?.ResponseStatus !== 1) {
                        throw new Error(`Failed to hold Non-LCC flight (Index: ${idx}): ${bookData?.message || bookData?.Response?.Error?.ErrorMessage || 'Unknown error'}`);
                    }

                    const pnr = bookData.Response.Response?.PNR;
                    const bookingId = bookData.Response.Response?.BookingId;
                    
                    // TBO Rule: IsPriceChanged in Book response → must pass IsPriceChangedAccepted in Ticket
                    const bookPriceChanged = bookData?.Response?.IsPriceChanged === true;

                    let ticketAttempt = 0;
                    let isPriceChangedAccepted = bookPriceChanged; // pre-set if book already flagged it

                    while (ticketAttempt < 3) {
                        ticketAttempt++;
                        const ticketPayload = {
                            TraceId: location.state.TraceId,
                            PNR: pnr,
                            BookingId: bookingId,
                            userId: loggedInUserId,
                            email: loggedInEmail,
                            ...(isPriceChangedAccepted ? { IsPriceChangedAccepted: true } : {})
                        };

                        let ticketRes, ticketData;
                        try {
                            ticketRes = await fetch(`${flightApiBase}/ticket`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(ticketPayload)
                            });
                            ticketData = await ticketRes.json();
                        } catch (timeoutErr) {
                            // TBO Docs: On timeout, poll GetBookingDetails every 12s to check status
                            console.warn('[Non-LCC Ticket] Timeout. Polling GetBookingDetails for PNR:', pnr);
                            const polledDetail = await pollBookingDetails(pnr, bookingId);
                            if (polledDetail) {
                                finalTicketResponse = { Response: polledDetail };
                                break;
                            }
                            throw new Error('Booking timed out. Your payment was captured. Please check your booking history or contact support with your PNR: ' + pnr);
                        }

                        if (ticketData?.Response?.ResponseStatus === 1) {
                            finalTicketResponse = ticketData.Response;
                            break;
                        }

                        // TBO Rule: IsPriceChanged in Ticket response → retry with IsPriceChangedAccepted:true
                        if (ticketData?.Response?.IsPriceChanged === true && !isPriceChangedAccepted) {
                            console.warn('[Non-LCC Ticket] IsPriceChanged=true. Retrying with IsPriceChangedAccepted=true...');
                            isPriceChangedAccepted = true;
                            continue; // retry the ticket call
                        }

                        throw new Error(`Failed to issue ticket for Non-LCC flight (PNR: ${pnr}): ${ticketData?.message || ticketData?.Response?.Error?.ErrorMessage || 'Unknown error'}`);
                    }
                }

                bookingResponses.push(finalTicketResponse);
            }

            // Success
            navigate('/flight-confirmation', { state: { bookingData: bookingResponses[0], itinerary: fareQuoteData, allBookings: bookingResponses } });
        } catch (err) {
            console.error('Booking/Validation Error:', err);
            setValidationError(err.message);
        } finally {
            setIsBooking(false);
            setPaymentStatus('idle');
        }
    };

    return (
        <>
            <style>{`
                .fco-summary-row { display: flex; justify-content: space-between; align-items: center; margin-top: 24px; background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #f1f5f9; }
                .fco-baggage-row { display: flex; gap: 20px; margin-top: 20px; padding: 12px 16px; background: #fff; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 13px; color: #475569; }
                .fco-airline-info { display: flex; gap: 20px; align-items: center; }
                @media(max-width: 768px) {
                    .fco-summary-row { flex-direction: column; align-items: flex-start; gap: 16px; text-align: left !important; }
                    .fco-summary-row > div { width: 100% !important; text-align: left !important; padding: 0 !important; }
                    .fco-baggage-row { flex-direction: column; gap: 8px; }
                    .fco-airline-info { flex-direction: column; align-items: flex-start; gap: 10px; }
                }
            `}</style>
            <section style={{ background: '#f4f7fa', padding: '40px 0', minHeight: '80vh', fontFamily: "'Inter', sans-serif" }}>
                <div className="container">

                    {/* Breadcrumbs */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '14px', color: '#64748b' }}>
                        <span style={{ cursor: 'pointer', color: '#0ea5e9', fontWeight: '500' }} onClick={() => navigate('/')}>Home</span>
                        <span>›</span>
                        <span style={{ cursor: 'pointer', color: '#0ea5e9', fontWeight: '500' }} onClick={() => navigate(-1)}>Flight Results</span>
                        <span>›</span>
                        <span style={{ color: '#1a1a2e', fontWeight: '600' }}>Checkout</span>
                    </div>

                    {/* Page Header */}
                    <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '800', color: '#1a1a2e', margin: 0 }}>Review & Checkout</h2>
                            <p style={{ color: '#687b8f', marginTop: '4px', marginBottom: 0 }}>Complete your booking in just a few steps.</p>
                        </div>
                        <button 
                            onClick={() => navigate(-1)} 
                            style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#475569', padding: '10px 20px', borderRadius: '30px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#e2e8f0'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
                        >
                            ✏️ Edit Flight
                        </button>
                    </div>

                    {/* Price Change Alert */}
                    {priceChangedAlert && (
                        <div style={{
                            background: '#fffbeb', border: '1px solid #fde68a', padding: '16px 20px', borderRadius: '12px',
                            marginBottom: '24px', display: 'flex', alignItems: 'flex-start', gap: '12px',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                        }}>
                            <ShieldAlert size={24} color="#d97706" style={{ flexShrink: 0 }} />
                            <div>
                                <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700', color: '#92400e' }}>Fare Updated by Airline</h4>
                                <p style={{ margin: 0, fontSize: '14px', color: '#b45309' }}>
                                    The airline has updated the fare or seat availability since your search. The new finalized price is reflected below.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="row">
                        {/* Left Column: Itinerary, Add-ons & Passenger Form */}
                        <div className="col-lg-8">

                            {/* Itinerary Summary Cards */}
                            {segments.map((sectorLegs, idx) => {
                                const fLeg = sectorLegs?.[0];
                                const lLeg = sectorLegs?.[sectorLegs.length - 1];
                                if (!fLeg) return null;
                                return (
                                    <div key={idx} style={{ background: '#fff', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #e4e7ed' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f0f0f0', paddingBottom: '16px' }}>
                                            <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Plane size={20} color="#e8151b" /> {idx === 0 ? 'Outbound' : 'Return'} Summary
                                            </h4>
                                            {idx === 0 && (
                                                <span style={{ fontSize: '13px', fontWeight: '600', color: fareQuoteData?.IsRefundable ? '#10b981' : '#ef4444', background: fareQuoteData?.IsRefundable ? '#ecfdf5' : '#fef2f2', padding: '4px 10px', borderRadius: '12px' }}>
                                                    {fareQuoteData?.IsRefundable ? 'Refundable' : 'Non-Refundable'}
                                                </span>
                                            )}
                                        </div>

                                        <div className="fco-airline-info">
                                            {/* Airline Logo/Name */}
                                            <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '800', color: '#e8151b' }}>
                                                {fLeg?.Airline?.AirlineCode}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a2e' }}>{fLeg?.Airline?.AirlineName}</div>
                                                <div style={{ fontSize: '13px', color: '#64748b' }}>Flight {fLeg?.Airline?.FlightNumber} • {fLeg?.CabinClass === 2 ? 'Economy' : 'Premium'}</div>
                                            </div>
                                        </div>

                                        <div className="fco-summary-row">
                                            {/* Origin */}
                                            <div style={{ width: '120px' }}>
                                                <div style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a2e' }}>{formatTime(fLeg?.Origin?.DepTime)}</div>
                                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#334155', marginTop: '4px' }}>{fLeg?.Origin?.Airport?.CityName}</div>
                                                <div style={{ fontSize: '12px', color: '#64748b' }}>{formatDate(fLeg?.Origin?.DepTime)}</div>
                                            </div>

                                            {/* Duration */}
                                            <div style={{ flex: 1, textAlign: 'center', padding: '0 20px', position: 'relative' }}>
                                                <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
                                                    <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                                                    {formatDuration(sectorLegs.reduce((acc, leg) => acc + (leg?.Duration || 0), 0))}
                                                </div>
                                                <div style={{ height: '2px', background: '#cbd5e1', width: '100%', position: 'relative' }}>
                                                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', padding: '0 8px', fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>
                                                        {sectorLegs.length > 1 ? `${sectorLegs.length - 1} Stop(s)` : 'Non-stop'}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Destination */}
                                            <div style={{ width: '120px', textAlign: 'right' }}>
                                                <div style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a2e' }}>{formatTime(lLeg?.Destination?.ArrTime)}</div>
                                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#334155', marginTop: '4px' }}>{lLeg?.Destination?.Airport?.CityName}</div>
                                                <div style={{ fontSize: '12px', color: '#64748b' }}>{formatDate(lLeg?.Destination?.ArrTime)}</div>
                                            </div>
                                        </div>

                                        <div className="fco-baggage-row">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Luggage size={16} color="#0ea5e9" /> <strong>Cabin:</strong> {fLeg?.CabinBaggage || '7 KG'}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Luggage size={16} color="#0ea5e9" /> <strong>Check-in:</strong> {fLeg?.Baggage || '15 KG'}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Add-ons (SSR) Section */}
                            {ssrData && (
                                <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #e4e7ed' }}>
                                    <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1a1a2e', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <PlusCircle size={20} color="#e8151b" /> Enhance Your Trip (Add-ons)
                                    </h4>

                                    {/* Special Fare Info Banner (SpiceMax, Super 6E, International LCC) */}
                                    {(fareQuoteData?.isseatmandatory || fareQuoteData?.ismealmandatory) && (
                                        <div style={{ padding: '12px 16px', background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', borderRadius: '10px', border: '1px solid #6ee7b7', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <CheckCircle2 size={18} color="#059669" />
                                            <div>
                                                <strong style={{ color: '#065f46', fontSize: '14px' }}>Special Fare — Free Add-ons Auto-included</strong>
                                                <div style={{ fontSize: '12px', color: '#047857', marginTop: '2px' }}>
                                                    This is a {fareQuoteData?.FareName || 'special'} fare. 
                                                    {fareQuoteData?.ismealmandatory && ' Free meal'}{fareQuoteData?.isseatmandatory && (fareQuoteData?.ismealmandatory ? ' & free seat' : ' Free seat')} {' '}
                                                    has been automatically included in your booking as required by the airline.
                                                </div>
                                            </div>
                                        </div>
                                    )}


                                    {/* Fallback when NO SSR is returned at all */}
                                    {currentAvailableMeals.length === 0 && currentAvailableBaggage.length === 0 && currentAvailableSeatsRows.length === 0 && currentSpecialServices.length === 0 ? (
                                        <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
                                            No additional add-ons (Meals, Baggage, or Seats) are available for dynamic selection on this flight. Full-service carriers often include these in the base fare.
                                        </div>
                                    ) : (
                                        <>
                                            {/* Sector Tabs */}
                                            {segments.length > 1 && (
                                                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                                            {segments.map((sectorObj, idx) => {
                                                const fL = sectorObj[0];
                                                const lL = sectorObj[sectorObj.length - 1];
                                                return (
                                                    <button
                                                        key={idx}
                                                        onClick={(e) => { e.preventDefault(); setActiveSector(idx); setActiveSegment(0); }}
                                                        style={{
                                                            padding: '8px 16px', borderRadius: '8px', border: 'none',
                                                            background: activeSector === idx ? '#e8151b' : '#f1f5f9',
                                                            color: activeSector === idx ? '#fff' : '#475569',
                                                            fontWeight: '600', fontSize: '14px', cursor: 'pointer'
                                                        }}
                                                    >
                                                        {fL?.Origin?.Airport?.CityCode} ✈ {lL?.Destination?.Airport?.CityCode}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    )}

                                    {/* Passenger Selector — Adult 1, Adult 2, Child 1, Child 2 (infants excluded) */}
                                    {eligiblePaxCount > 0 && (
                                        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: '4px' }}>For:</span>
                                            {eligiblePassengers.map((p) => {
                                                const isActive = activePax === p.originalIndex;
                                                const ssrCount = getPaxSsrCount(p.originalIndex);
                                                return (
                                                    <button
                                                        key={p.originalIndex}
                                                        type="button"
                                                        onClick={() => setActivePax(p.originalIndex)}
                                                        style={{
                                                            position: 'relative',
                                                            padding: '7px 14px', borderRadius: '20px',
                                                            border: isActive ? '2px solid #e8151b' : '1.5px solid #cbd5e1',
                                                            background: isActive ? '#fff5f5' : '#fff',
                                                            color: isActive ? '#e8151b' : '#475569',
                                                            fontWeight: '600', fontSize: '13px', cursor: 'pointer',
                                                            display: 'flex', alignItems: 'center', gap: '5px',
                                                            transition: 'all 0.15s'
                                                        }}
                                                    >
                                                        <User size={13} />
                                                        {p.label}
                                                        {ssrCount > 0 && (
                                                            <span style={{
                                                                position: 'absolute', top: '-6px', right: '-6px',
                                                                background: '#10b981', color: '#fff',
                                                                borderRadius: '50%', width: '18px', height: '18px',
                                                                fontSize: '10px', fontWeight: '800',
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                border: '2px solid #fff'
                                                            }}>{ssrCount}</span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                            {/* Infants note */}
                                            {passengers.some(p => p.PaxType === 3) && (
                                                <span style={{ fontSize: '11px', color: '#94a3b8', fontStyle: 'italic', marginLeft: '4px' }}>
                                                    (Infants sit on adult lap — no separate seat/meal)
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Per-pax SSR Summary Strip */}
                                    {eligiblePaxCount > 0 && (
                                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                                            {eligiblePassengers.map((p) => {
                                                const pssr = selectedSSR[activeSector]?.[p.originalIndex];
                                                if (!pssr || (!pssr.meal && !pssr.baggage && !pssr.seat)) return null;
                                                return (
                                                    <div key={p.originalIndex} style={{
                                                        fontSize: '11px', padding: '4px 10px', borderRadius: '8px',
                                                        background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d',
                                                        display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600'
                                                    }}>
                                                        <span style={{ fontWeight: '700' }}>{p.label}:</span>
                                                        {pssr.meal && <span>🍽 {pssr.meal.AirlineDescription || pssr.meal.Code}</span>}
                                                        {pssr.baggage && <span>🧳 +{pssr.baggage.Weight}kg</span>}
                                                        {pssr.seat && <span>💺 {pssr.seat.Code}</span>}
                                                        {pssr.special && <span>✨ {pssr.special.AirlineDescription || pssr.special.Code}</span>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* SSR Type Tabs */}
                                    <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                                        {currentAvailableMeals.length > 0 && <div onClick={() => setActiveSsrTab('meals')} style={{ cursor: 'pointer', fontWeight: '600', color: activeSsrTab === 'meals' ? '#e8151b' : '#64748b', borderBottom: activeSsrTab === 'meals' ? '2px solid #e8151b' : 'none', paddingBottom: '8px', transition: 'all 0.2s' }}>Meals</div>}
                                        {currentAvailableBaggage.length > 0 && <div onClick={() => setActiveSsrTab('baggage')} style={{ cursor: 'pointer', fontWeight: '600', color: activeSsrTab === 'baggage' ? '#e8151b' : '#64748b', borderBottom: activeSsrTab === 'baggage' ? '2px solid #e8151b' : 'none', paddingBottom: '8px', transition: 'all 0.2s' }}>Baggage</div>}
                                        {currentAvailableSeatsRows.length > 0 && <div onClick={() => setActiveSsrTab('seats')} style={{ cursor: 'pointer', fontWeight: '600', color: activeSsrTab === 'seats' ? '#e8151b' : '#64748b', borderBottom: activeSsrTab === 'seats' ? '2px solid #e8151b' : 'none', paddingBottom: '8px', transition: 'all 0.2s' }}>Seats</div>}
                                        {currentSpecialServices.length > 0 && <div onClick={() => setActiveSsrTab('special')} style={{ cursor: 'pointer', fontWeight: '600', color: activeSsrTab === 'special' ? '#e8151b' : '#64748b', borderBottom: activeSsrTab === 'special' ? '2px solid #e8151b' : 'none', paddingBottom: '8px', transition: 'all 0.2s' }}>Additional Services</div>}
                                    </div>

                                    {/* Meals */}
                                    {activeSsrTab === 'meals' && currentAvailableMeals.length > 0 && (
                                        <div style={{ marginBottom: '24px' }}>
                                            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'thin' }}>
                                                <div
                                                    onClick={() => handleSsrToggle('meal', null)}
                                                    style={{
                                                        flexShrink: 0, width: '140px', padding: '16px', borderRadius: '12px', cursor: 'pointer',
                                                        // Only highlight red if user EXPLICITLY chose No Meal (not just on initial load)
                                                        border: (hasUserSetSSR('meal') && getCurrentSSR('meal') === null) ? '2px solid #e8151b' : '1px solid #e2e8f0',
                                                        background: (hasUserSetSSR('meal') && getCurrentSSR('meal') === null) ? '#fff5f5' : '#f8fafc',
                                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                                                    }}
                                                >
                                                    <div style={{ width: '100%', height: '80px', borderRadius: '8px', overflow: 'hidden', marginBottom: '10px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
                                                    </div>
                                                    <span style={{ fontWeight: '600', color: '#334155' }}>No Meal</span>
                                                </div>
                                                {currentAvailableMeals.filter(m => m.Code !== 'NoMeal').map((meal, idx) => {
                                                    const isSelected = getCurrentSSR('meal')?.Code === meal.Code;
                                                    return (
                                                        <div
                                                            key={idx}
                                                            onClick={() => handleSsrToggle('meal', meal)}
                                                            style={{
                                                                flexShrink: 0, width: '160px', padding: '16px', borderRadius: '12px', cursor: 'pointer',
                                                                border: isSelected ? '2px solid #e8151b' : '1px solid #e2e8f0',
                                                                background: isSelected ? '#fff5f5' : '#fff',
                                                                display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                                                            }}
                                                        >
                                                            <div style={{ width: '100%', height: '80px', borderRadius: '8px', overflow: 'hidden', marginBottom: '10px', background: '#f1f5f9' }}>
                                                                <img
                                                                    src={meal.Image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&h=150'}
                                                                    alt={meal.AirlineDescription || meal.Code}
                                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                />
                                                            </div>
                                                            <span style={{ fontWeight: '600', fontSize: '13px', color: '#1a1a2e', lineHeight: '1.4' }}>{meal.AirlineDescription || meal.Code}</span>
                                                            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <span style={{ fontWeight: '800', color: '#e8151b', fontSize: '14px' }}>₹{meal.Price}</span>
                                                                {isSelected && <CheckCircle2 size={16} color="#e8151b" />}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Baggage */}
                                    {activeSsrTab === 'baggage' && currentAvailableBaggage.length > 0 && (
                                        <div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                                                <div
                                                    onClick={() => handleSsrToggle('baggage', null)}
                                                    style={{
                                                        padding: '12px 16px', borderRadius: '8px', cursor: 'pointer',
                                                        // Only highlight red if user EXPLICITLY chose No Extra Baggage
                                                        border: (hasUserSetSSR('baggage') && getCurrentSSR('baggage') === null) ? '2px solid #e8151b' : '1px solid #e2e8f0',
                                                        background: (hasUserSetSSR('baggage') && getCurrentSSR('baggage') === null) ? '#fff5f5' : '#f8fafc',
                                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                                    }}
                                                >
                                                    <span style={{ fontSize: '13px', fontWeight: '600' }}>No Extra Baggage</span>
                                                </div>
                                                {currentAvailableBaggage.map((bag, idx) => {
                                                    const isSelected = getCurrentSSR('baggage')?.Code === bag.Code;
                                                    return (
                                                        <div
                                                            key={idx}
                                                            onClick={() => handleSsrToggle('baggage', bag)}
                                                            style={{
                                                                padding: '12px 16px', borderRadius: '8px', cursor: 'pointer',
                                                                border: isSelected ? '2px solid #e8151b' : '1px solid #e2e8f0',
                                                                background: isSelected ? '#fff5f5' : '#fff',
                                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                                            }}
                                                        >
                                                            <div>
                                                                <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a2e' }}>+{bag.Weight} KG</div>
                                                                <div style={{ fontSize: '11px', color: '#64748b' }}>{bag.Text || 'Extra Baggage'}</div>
                                                            </div>
                                                            <div style={{ fontWeight: '800', color: '#e8151b' }}>₹{bag.Price}</div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Seats */}
                                    {activeSsrTab === 'seats' && currentAvailableSeatsRows.length > 0 && (
                                        <div style={{ marginTop: '24px' }}>
                                            {/* Sub-tabs for each flight leg within a sector (connecting flights) */}
                                            {currentSegmentSeats.length > 1 && (
                                                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                                                    {currentSegmentSeats.map((seg, sIdx) => {
                                                        const segLabel = seg.RowSeats?.[0]?.Seats?.[0]?.SeatNo
                                                            ? `Leg ${sIdx + 1}` : `Segment ${sIdx + 1}`;
                                                        return (
                                                            <button
                                                                key={sIdx}
                                                                type="button"
                                                                onClick={() => setActiveSegment(sIdx)}
                                                                style={{
                                                                    padding: '5px 14px', borderRadius: '20px', border: 'none',
                                                                    background: activeSegment === sIdx ? '#1a6dcf' : '#f1f5f9',
                                                                    color: activeSegment === sIdx ? '#fff' : '#475569',
                                                                    fontWeight: '600', fontSize: '13px', cursor: 'pointer'
                                                                }}
                                                            >
                                                                {segLabel}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                            {/* Legend */}
                                            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', fontSize: '12px', fontWeight: '600', flexWrap: 'wrap' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <div style={{ width: '16px', height: '16px', background: '#3b82f6', borderRadius: '4px' }}></div> Available
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <div style={{ width: '16px', height: '16px', background: '#e2e8f0', borderRadius: '4px' }}></div> Blocked
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <div style={{ width: '16px', height: '16px', background: '#f97316', borderRadius: '4px' }}></div> Taken by another
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <div style={{ width: '16px', height: '16px', background: '#e8151b', borderRadius: '4px' }}></div> Your Selection
                                                </div>
                                            </div>

                                            <style>{`
                                                .fco-airplane-body { background: #f8fafc; padding: 30px 20px; border-radius: 40px 40px 20px 20px; border: 2px solid #cbd5e1; max-width: 380px; margin: 0 auto; box-shadow: inset 0 4px 6px rgba(0,0,0,0.05); }
                                                .fco-seat-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
                                                .fco-seat-grp { display: flex; gap: 8px; }
                                                .fco-seat { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; transition: transform 0.1s; border: 1px solid rgba(0,0,0,0.1); }
                                                .fco-aisle { width: 30px; text-align: center; font-size: 12px; font-weight: 800; color: #94a3b8; }
                                                
                                                @media(max-width: 420px) {
                                                    .fco-airplane-body { padding: 20px 10px; border-radius: 30px 30px 15px 15px; overflow-x: auto; }
                                                    .fco-seat-grp { gap: 4px; }
                                                    .fco-seat { width: 28px; height: 28px; font-size: 10px; border-radius: 6px; }
                                                    .fco-aisle { width: 22px; font-size: 10px; }
                                                }
                                                @media(max-width: 350px) {
                                                    .fco-seat { width: 25px; height: 25px; font-size: 9px; }
                                                    .fco-seat-grp { gap: 3px; }
                                                }
                                            `}</style>

                                            {/* Airplane Body */}
                                            <div className="fco-airplane-body">
                                                {/* Airplane Nose curve */}
                                                <div style={{ width: '100%', height: '40px', borderBottom: '2px dashed #94a3b8', marginBottom: '30px', opacity: 0.5 }}></div>

                                                {currentAvailableSeatsRows.map((rowObj, rowIdx) => {
                                                    const seats = rowObj.Seats || [];
                                                    if (seats.length === 0) return null;

                                                    // Split seats into left and right (assuming typical 3x3 layout)
                                                    const midPoint = Math.ceil(seats.length / 2);
                                                    const leftSeats = seats.slice(0, midPoint);
                                                    const rightSeats = seats.slice(midPoint);

                                                    return (
                                                        <div key={rowIdx} className="fco-seat-row">
                                                            {/* Left Seats */}
                                                            <div className="fco-seat-grp">
                                                                {leftSeats.map((seat, sIdx) => {
                                                                    const isAvailable = seat.AvailablityType === 1;
                                                                    const isSelectedByMe = getCurrentSSR('seat')?.Code === seat.Code;
                                                                    const isTakenByOther = !isSelectedByMe && bookedSeatCodes.has(seat.Code);

                                                                    let bgColor = isAvailable ? '#3b82f6' : '#e2e8f0';
                                                                    if (isTakenByOther) bgColor = '#f97316'; // orange = taken by another pax
                                                                    if (isSelectedByMe) bgColor = '#e8151b'; // red = mine

                                                                    return (
                                                                        <div
                                                                            key={sIdx}
                                                                            onClick={() => { if (isAvailable && !isTakenByOther) handleSsrToggle('seat', seat); }}
                                                                            title={isSelectedByMe ? `✅ Your seat` : isTakenByOther ? `Taken by another passenger` : `${seat.Code} — ₹${seat.Price}`}
                                                                            className="fco-seat"
                                                                            style={{
                                                                                background: bgColor,
                                                                                color: (isAvailable || isSelectedByMe) && !isTakenByOther ? '#fff' : '#94a3b8',
                                                                                cursor: (isAvailable && !isTakenByOther) ? 'pointer' : 'not-allowed',
                                                                                transform: isSelectedByMe ? 'scale(1.1)' : 'scale(1)'
                                                                            }}
                                                                        >
                                                                            {seat.SeatNo || seat.Code}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>

                                                            {/* Aisle (Row Number) */}
                                                            <div className="fco-aisle">
                                                                {seats[0]?.RowNo}
                                                            </div>

                                                            {/* Right Seats */}
                                                            <div className="fco-seat-grp">
                                                                {rightSeats.map((seat, sIdx) => {
                                                                    const isAvailable = seat.AvailablityType === 1;
                                                                    const isSelectedByMe = getCurrentSSR('seat')?.Code === seat.Code;
                                                                    const isTakenByOther = !isSelectedByMe && bookedSeatCodes.has(seat.Code);

                                                                    let bgColor = isAvailable ? '#3b82f6' : '#e2e8f0';
                                                                    if (isTakenByOther) bgColor = '#f97316';
                                                                    if (isSelectedByMe) bgColor = '#e8151b';

                                                                    return (
                                                                        <div
                                                                            key={sIdx}
                                                                            onClick={() => { if (isAvailable && !isTakenByOther) handleSsrToggle('seat', seat); }}
                                                                            title={isSelectedByMe ? `✅ Your seat` : isTakenByOther ? `Taken by another passenger` : `${seat.Code} — ₹${seat.Price}`}
                                                                            className="fco-seat"
                                                                            style={{
                                                                                background: bgColor,
                                                                                color: (isAvailable || isSelectedByMe) && !isTakenByOther ? '#fff' : '#94a3b8',
                                                                                cursor: (isAvailable && !isTakenByOther) ? 'pointer' : 'not-allowed',
                                                                                transform: isSelectedByMe ? 'scale(1.1)' : 'scale(1)'
                                                                            }}
                                                                        >
                                                                            {seat.SeatNo || seat.Code}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Additional Services */}
                                    {activeSsrTab === 'special' && currentSpecialServices.length > 0 && (
                                        <div style={{ marginBottom: '24px' }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                                                {currentSpecialServices.map((service, idx) => {
                                                    const isSelected = getCurrentSSR('special')?.Code === service.Code;
                                                    return (
                                                        <div
                                                            key={idx}
                                                            onClick={() => handleSsrToggle('special', service)}
                                                            style={{
                                                                padding: '16px', borderRadius: '12px', cursor: 'pointer',
                                                                border: isSelected ? '2px solid #e8151b' : '1px solid #e2e8f0',
                                                                background: isSelected ? '#fff5f5' : '#fff',
                                                                display: 'flex', flexDirection: 'column', gap: '8px', transition: 'all 0.2s', position: 'relative'
                                                            }}
                                                        >
                                                            {isSelected && <div style={{ position: 'absolute', top: '10px', right: '10px' }}><CheckCircle2 size={18} color="#e8151b" /></div>}
                                                            <div style={{ width: '40px', height: '40px', background: '#f8fafc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e8151b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
                                                            </div>
                                                            <div style={{ fontWeight: '700', fontSize: '14px', color: '#1a1a2e' }}>{service.AirlineDescription || service.Code}</div>
                                                            <div style={{ fontWeight: '800', color: '#e8151b', fontSize: '15px', marginTop: 'auto' }}>
                                                                {service.Price > 0 ? `₹${service.Price.toLocaleString('en-IN')}` : 'Free'}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                    </>
                                    )}
                                </div>
                            )}
                            {/* Passenger Details Form */}
                            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #e4e7ed' }}>
                                <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1a1a2e', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <User size={20} color="#e8151b" /> Passenger Details
                                </h4>

                                {passengers.map((pax, idx) => (
                                    <div key={idx} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: idx < passengers.length - 1 ? '1px dashed #e2e8f0' : 'none' }}>
                                        <h5 style={{ fontSize: '15px', fontWeight: '600', color: '#334155', marginBottom: '16px' }}>
                                            Passenger {idx + 1} {pax.PaxType === 1 ? '(Adult)' : pax.PaxType === 2 ? '(Child)' : '(Infant)'}
                                        </h5>
                                        <div className="row">
                                            <div className="col-md-2 mb-3">
                                                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Title</label>
                                                <select
                                                    className="form-select"
                                                    value={pax.Title || ''}
                                                    onChange={(e) => handlePassengerChange(idx, 'Title', e.target.value)}
                                                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                                >
                                                    <option value="">Select</option>
                                                    <option value="Mr">Mr.</option>
                                                    <option value="Ms">Ms.</option>
                                                    <option value="Mrs">Mrs.</option>
                                                    <option value="Miss">Miss</option>
                                                    <option value="Master">Master</option>
                                                </select>
                                            </div>
                                            <div className="col-md-5 mb-3">
                                                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>First & Middle Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder={isPassportRequired ? "As per passport" : "As per Govt. ID"}
                                                    value={pax.FirstName || ''}
                                                    onChange={(e) => handlePassengerChange(idx, 'FirstName', e.target.value)}
                                                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                                />
                                            </div>
                                            <div className="col-md-5 mb-3">
                                                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Last Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder={isPassportRequired ? "As per passport" : "As per Govt. ID"}
                                                    value={pax.LastName || ''}
                                                    onChange={(e) => handlePassengerChange(idx, 'LastName', e.target.value)}
                                                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                                />
                                            </div>

                                            {/* Date of Birth for Child/Infant OR AirAsia Adults */}
                                            {(pax.PaxType === 2 || pax.PaxType === 3 || ((fareQuoteData?.Results?.Segments?.[0]?.[0]?.Airline?.AirlineCode === 'I5' || fareQuoteData?.Results?.Segments?.[0]?.[0]?.Airline?.AirlineCode === 'AK') && pax.PaxType === 1)) && (
                                                <div className="col-md-6 mb-3">
                                                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Date of Birth <span style={{ color: '#e8151b' }}>*</span></label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        value={pax.DateOfBirth || ''}
                                                        onChange={(e) => handlePassengerChange(idx, 'DateOfBirth', e.target.value)}
                                                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                                    />
                                                </div>
                                            )}

                                            {/* Passport Details (Dynamically shown based on API) */}
                                            {isPassportRequired && (
                                                <>
                                                    <div className="col-md-6 mb-3">
                                                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Passport Number <span style={{ color: '#e8151b' }}>*</span></label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Passport No"
                                                            value={pax.PassportNo || ''}
                                                            onChange={(e) => handlePassengerChange(idx, 'PassportNo', e.target.value.toUpperCase())}
                                                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', textTransform: 'uppercase' }}
                                                        />
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Passport Expiry (YYYY-MM-DD) <span style={{ color: '#e8151b' }}>*</span></label>
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            value={pax.PassportExpiry || ''}
                                                            onChange={(e) => handlePassengerChange(idx, 'PassportExpiry', e.target.value)}
                                                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                                        />
                                                    </div>
                                                    {fareQuoteData?.IsPassportFullDetailRequiredAtBook && (
                                                        <>
                                                            <div className="col-md-6 mb-3">
                                                                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Passport Issue Date <span style={{ color: '#e8151b' }}>*</span></label>
                                                                <input
                                                                    type="date"
                                                                    className="form-control"
                                                                    value={pax.PassportIssueDate || ''}
                                                                    onChange={(e) => handlePassengerChange(idx, 'PassportIssueDate', e.target.value)}
                                                                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                                                />
                                                            </div>
                                                            <div className="col-md-6 mb-3">
                                                                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Issuing Country Code <span style={{ color: '#e8151b' }}>*</span></label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="IN"
                                                                    value={pax.DocumentIssuingCountry || ''}
                                                                    onChange={(e) => handlePassengerChange(idx, 'DocumentIssuingCountry', e.target.value.toUpperCase())}
                                                                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', textTransform: 'uppercase' }}
                                                                    maxLength="2"
                                                                />
                                                            </div>
                                                        </>
                                                    )}
                                                </>
                                            )}

                                            {/* PAN Details */}
                                            {isPanRequired && (
                                                <div className="col-md-6 mb-3">
                                                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>
                                                        {pax.PaxType === 1 ? 'PAN Number' : 'Guardian PAN Number'} <span style={{ color: '#e8151b' }}>*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="ABCDE1234F"
                                                        value={pax.PAN || ''}
                                                        onChange={(e) => handlePassengerChange(idx, 'PAN', e.target.value.toUpperCase())}
                                                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                                        required
                                                    />
                                                    {pax.PaxType !== 1 && (
                                                        <small style={{ color: '#64748b', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                                                            Since this passenger is a minor, please provide the Parent/Guardian's PAN.
                                                        </small>
                                                    )}
                                                </div>
                                            )}

                                            {/* Non-LCC SSRs (Static Meal & Seat Preferences) */}
                                            {(ssrData?.Meal?.length > 0 || ssrData?.SeatPreference?.length > 0) && (
                                                <div className="col-12 mt-3 mb-3 p-3" style={{ background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                                    <div style={{ fontWeight: '600', fontSize: '13px', color: '#1e293b', marginBottom: '12px' }}>Free Preferences (Optional)</div>
                                                    <div className="row">
                                                        {ssrData?.Meal?.length > 0 && (
                                                            <div className="col-md-6">
                                                                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Meal Preference</label>
                                                                <select className="form-control" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} value={pax.MealPreference || ''} onChange={e => handlePassengerChange(idx, 'MealPreference', e.target.value)}>
                                                                    <option value="">Select Meal</option>
                                                                    {ssrData.Meal.map(m => <option key={m.Code} value={m.Code}>{m.Description}</option>)}
                                                                </select>
                                                            </div>
                                                        )}
                                                        {ssrData?.SeatPreference?.length > 0 && (
                                                            <div className="col-md-6">
                                                                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Seat Preference</label>
                                                                <select className="form-control" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} value={pax.SeatPreference || ''} onChange={e => handlePassengerChange(idx, 'SeatPreference', e.target.value)}>
                                                                    <option value="">Select Seat</option>
                                                                    {ssrData.SeatPreference.map(s => <option key={s.Code} value={s.Code}>{s.Description}</option>)}
                                                                </select>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {/* GST Details (Dynamic) */}
                                {(hasGST || fareQuoteData?.IsGSTMandatory) && (
                                    <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f0f0f0' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e8151b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                                                GST Details {fareQuoteData?.IsGSTMandatory ? '(Mandatory)' : '(Optional)'}
                                            </h4>
                                            {!fareQuoteData?.IsGSTMandatory && (
                                                <button 
                                                    type="button"
                                                    onClick={() => setHasGST(false)} 
                                                    style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}
                                                >
                                                    Remove GST
                                                </button>
                                            )}
                                        </div>
                                        
                                        <div className="row">
                                            <div className="col-md-4 mb-3">
                                                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>GST Number {fareQuoteData?.IsGSTMandatory && <span style={{ color: '#e8151b' }}>*</span>}</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="22AAAAA0000A1Z5"
                                                    value={gstDetails.GSTNumber}
                                                    onChange={(e) => setGstDetails({...gstDetails, GSTNumber: e.target.value.toUpperCase()})}
                                                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                                    required={fareQuoteData?.IsGSTMandatory}
                                                />
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Company Name {fareQuoteData?.IsGSTMandatory && <span style={{ color: '#e8151b' }}>*</span>}</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Acme Corp"
                                                    value={gstDetails.GSTCompanyName}
                                                    onChange={(e) => setGstDetails({...gstDetails, GSTCompanyName: e.target.value})}
                                                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                                    required={fareQuoteData?.IsGSTMandatory}
                                                />
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Company Email {fareQuoteData?.IsGSTMandatory && <span style={{ color: '#e8151b' }}>*</span>}</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    placeholder="finance@acme.com"
                                                    value={gstDetails.GSTCompanyEmail}
                                                    onChange={(e) => setGstDetails({...gstDetails, GSTCompanyEmail: e.target.value})}
                                                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                                    required={fareQuoteData?.IsGSTMandatory}
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Contact Number {fareQuoteData?.IsGSTMandatory && <span style={{ color: '#e8151b' }}>*</span>}</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="9876543210"
                                                    value={gstDetails.GSTCompanyContactNumber}
                                                    onChange={(e) => setGstDetails({...gstDetails, GSTCompanyContactNumber: e.target.value})}
                                                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                                    required={fareQuoteData?.IsGSTMandatory}
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Company Address {fareQuoteData?.IsGSTMandatory && <span style={{ color: '#e8151b' }}>*</span>}</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="City, State"
                                                    value={gstDetails.GSTCompanyAddress}
                                                    onChange={(e) => setGstDetails({...gstDetails, GSTCompanyAddress: e.target.value})}
                                                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                                    required={fareQuoteData?.IsGSTMandatory}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {!hasGST && !fareQuoteData?.IsGSTMandatory && fareQuoteData?.GSTAllowed && (
                                    <div style={{ marginTop: '16px', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ fontSize: '14px', color: '#475569' }}>
                                            <strong>Business Trip?</strong> Add your GST details to claim input tax credit.
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={() => setHasGST(true)}
                                            style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #e8151b', color: '#e8151b', background: '#fff', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}
                                        >
                                            + Add GST
                                        </button>
                                    </div>
                                )}

                                <h4 style={{ margin: '20px 0 16px 0', fontSize: '16px', fontWeight: '700', color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '20px', borderTop: '1px solid #f0f0f0' }}>
                                    <Mail size={18} color="#e8151b" /> Contact Details
                                </h4>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Email Address</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="Tickets will be sent here"
                                            value={contactEmail}
                                            onChange={(e) => setContactEmail(e.target.value)}
                                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Phone Number</label>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <select
                                                className="form-select"
                                                style={{ width: '110px', padding: '12px 30px 12px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', fontSize: '14px', outline: 'none', cursor: 'pointer' }}
                                                value={contactCountryCode}
                                                onChange={(e) => setContactCountryCode(e.target.value)}
                                            >
                                                <option value="+91">+91 (IN)</option>
                                                <option value="+1">+1 (US)</option>
                                                <option value="+44">+44 (UK)</option>
                                                <option value="+971">+971 (AE)</option>
                                                <option value="+61">+61 (AU)</option>
                                            </select>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                placeholder="9876543210"
                                                value={contactPhone}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/\D/g, '');
                                                    if (val.length <= 15) setContactPhone(val);
                                                }}
                                                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', fontSize: '14px', outline: 'none' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Price Breakdown */}
                        <div className="col-lg-4">
                            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #e4e7ed', position: 'sticky', top: '100px' }}>
                                <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1a1a2e', marginBottom: '20px', borderBottom: '1px solid #f0f0f0', paddingBottom: '16px' }}>
                                    Fare Summary
                                </h4>

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#475569' }}>
                                    <span>Base Fare</span>
                                    <span style={{ fontWeight: '600', color: '#1a1a2e' }}>₹{fare.BaseFare?.toLocaleString('en-IN') || 0}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#475569' }}>
                                    <span>Taxes & Fees</span>
                                    <span style={{ fontWeight: '600', color: '#1a1a2e' }}>₹{fare.Tax?.toLocaleString('en-IN') || 0}</span>
                                </div>
                                {fare.OtherCharges > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#475569' }}>
                                        <span>Other Charges</span>
                                        <span style={{ fontWeight: '600', color: '#1a1a2e' }}>₹{fare.OtherCharges?.toLocaleString('en-IN') || 0}</span>
                                    </div>
                                )}

                                {/* Render Add-ons if selected */}
                                {(mealPrice > 0 || baggagePrice > 0 || seatPrice > 0 || specialPrice > 0) && (
                                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed #cbd5e1' }}>
                                        <h5 style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a2e', marginBottom: '12px' }}>Add-ons</h5>
                                        {mealPrice > 0 && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: '#475569' }}>
                                                <span>Meals</span>
                                                <span style={{ fontWeight: '600', color: '#1a1a2e' }}>₹{mealPrice.toLocaleString('en-IN')}</span>
                                            </div>
                                        )}
                                        {baggagePrice > 0 && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: '#475569' }}>
                                                <span>Baggage</span>
                                                <span style={{ fontWeight: '600', color: '#1a1a2e' }}>₹{baggagePrice.toLocaleString('en-IN')}</span>
                                            </div>
                                        )}
                                        {seatPrice > 0 && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: '#475569' }}>
                                                <span>Seat Selection</span>
                                                <span style={{ fontWeight: '600', color: '#1a1a2e' }}>₹{seatPrice.toLocaleString('en-IN')}</span>
                                            </div>
                                        )}
                                        {specialPrice > 0 && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: '#475569' }}>
                                                <span>Additional Services</span>
                                                <span style={{ fontWeight: '600', color: '#1a1a2e' }}>₹{specialPrice.toLocaleString('en-IN')}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f0f0f0', fontSize: '18px', fontWeight: '800', color: '#1a1a2e' }}>
                                    <span>Total Amount</span>
                                    <span style={{ color: '#e8151b' }}>₹{totalFare.toLocaleString('en-IN')}</span>
                                </div>

                                <div style={{ marginTop: '24px' }}>
                                    {validationError && (
                                        <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', padding: '12px', borderRadius: '8px', color: '#b91c1c', fontSize: '13px', fontWeight: '500', marginBottom: '16px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                            <ShieldAlert size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                                            <span>{validationError}</span>
                                        </div>
                                    )}
                                    <button
                                        className="th-btn"
                                        onClick={handleBookFlight}
                                        disabled={isBooking}
                                        style={{ width: '100%', padding: '16px', borderRadius: '30px', fontSize: '16px', fontWeight: '700', background: '#e8151b', color: '#fff', border: 'none', boxShadow: '0 10px 20px rgba(232,21,27,0.2)', transition: 'all 0.3s', opacity: isBooking ? 0.7 : 1 }}
                                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 25px rgba(232,21,27,0.3)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(232,21,27,0.2)'; }}
                                    >
                                        {isBooking
                                            ? paymentStatus === 'paying'   ? '⏳ Opening Payment...'
                                            : paymentStatus === 'verifying' ? '🔒 Verifying Payment...'
                                            : paymentStatus === 'booking'   ? '✈️ Confirming Booking...'
                                            : 'Processing...'
                                            : '🔒 Proceed to Pay'}
                                    </button>
                                </div>

                                <div style={{ marginTop: '16px', fontSize: '12px', color: '#64748b', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                    <ShieldCheck size={14} color="#10b981" /> 100% Safe & Secure Booking
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {showLoginPrompt && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }}>
                    <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', textAlign: 'center', maxWidth: '420px', width: '90%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', fontFamily: "'Inter', sans-serif" }}>
                        <div style={{ width: '60px', height: '60px', background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <i className="fa-solid fa-lock" style={{ fontSize: '24px', color: '#e8151b' }}></i>
                        </div>
                        <h3 style={{ marginTop: 0, color: '#1a1a2e', fontSize: '22px', fontWeight: '700', marginBottom: '12px' }}>Login Required</h3>
                        <p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
                            Please login or create an account to securely continue with your booking.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button type="button" onClick={() => setShowLoginPrompt(false)} style={{ flex: 1, padding: '12px 0', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '15px', transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.background = '#e2e8f0'} onMouseLeave={e => e.target.style.background = '#f1f5f9'}>Cancel</button>
                            <button type="button" onClick={() => {
                                setShowLoginPrompt(false);
                                window.dispatchEvent(new Event('openLoginModal'));
                            }} style={{ flex: 1, padding: '12px 0', background: '#e8151b', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '15px', transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.background = '#d01217'} onMouseLeave={e => e.target.style.background = '#e8151b'}>Login / Sign Up</button>
                        </div>
                    </div>
                </div>
            )}
            <FooterOne />
            <LoginForm isOpen={isLoginFormOpen} onClose={() => setIsLoginFormOpen(false)} />
        </>
    );
}

export default FlightCheckout;
