import React, { useState, useRef, useEffect } from 'react';
import { Plane, X } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, addDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import AirportAutocomplete from './AirportAutocomplete';

const toStr = (date) => {
  const d = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return d.toISOString().split('T')[0] + 'T00:00:00';
};

export default function ModifyFlightSearchBar({ initialState }) {
  const navigate = useNavigate();

  // ── Parse initial state ──────────────────────────────────────────────────
  const initJourney  = parseInt(initialState?.JourneyType || 1);   // 1=OneWay 2=RoundTrip
  const initOrigin   = initialState?.Segments?.[0]?.Origin      || initialState?.Origin      || 'DEL';
  const initDest     = initialState?.Segments?.[0]?.Destination  || initialState?.Destination || 'BOM';
  const initAdults   = initialState?.AdultCount   || 1;
  const initChildren = initialState?.ChildCount   || 0;
  const initInfants  = initialState?.InfantCount  || 0;
  const initClass    = initialState?.CabinClass   || initialState?.FlightCabinClass || 2;
  const initDep      = initialState?.PreferredDepartureTime
    ? new Date(initialState.PreferredDepartureTime)
    : new Date();

  // Return date: for round-trip, pull from Segments[1] or default to dep+7
  const initRetSegTime = initialState?.Segments?.[1]?.PreferredDepartureTime;
  const initRet = initRetSegTime
    ? new Date(initRetSegTime)
    : addDays(initDep, 7);

  // ── State ────────────────────────────────────────────────────────────────
  const [journeyType, setJourneyType]       = useState(initJourney);
  
  // Initialize with basic object, it will be updated properly by autocomplete when selected
  const [fromAirport, setFromAirport]       = useState({ code: initOrigin, city: initOrigin });
  const [toAirport,   setToAirport]         = useState({ code: initDest, city: initDest });
  
  const [departDate,  setDepartDate]        = useState(initDep);
  const [returnDate,  setReturnDate]        = useState(initRet);
  const [showReturnCal, setShowReturnCal]   = useState(false);
  const [flightAdults,  setFlightAdults]    = useState(initAdults);
  const [flightChildren,setFlightChildren]  = useState(initChildren);
  const [flightInfants, setFlightInfants]   = useState(initInfants);
  const [flightClass,   setFlightClass]     = useState(initClass);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const dropdownRef = useRef(null);
  const returnCalRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const h = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
      if (returnCalRef.current && !returnCalRef.current.contains(e.target)) {
        setShowReturnCal(false);
      }
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // ── Search handler ───────────────────────────────────────────────────────
  const handleSearch = () => {
    const depStr = toStr(departDate);
    const retStr = journeyType === 2 ? toStr(returnDate) : depStr;

    const outSegment = {
      Origin:                  fromAirport.code,
      Destination:             toAirport.code,
      FlightCabinClass:        flightClass,
      PreferredDepartureTime:  depStr,
      PreferredArrivalTime:    depStr,
    };

    const segments = journeyType === 2
      ? [
          outSegment,
          {
            Origin:                  toAirport.code,
            Destination:             fromAirport.code,
            FlightCabinClass:        flightClass,
            PreferredDepartureTime:  retStr,
            PreferredArrivalTime:    retStr,
          },
        ]
      : [outSegment];

    const newState = {
      ...initialState,
      JourneyType:             journeyType,
      AdultCount:              flightAdults,
      ChildCount:              flightChildren,
      InfantCount:             flightInfants,
      FlightCabinClass:        flightClass,
      CabinClass:              flightClass,
      Origin:                  fromAirport.code,
      Destination:             toAirport.code,
      PreferredDepartureTime:  depStr,
      PreferredArrivalTime:    depStr,
      Segments:                segments,
    };

    navigate('/flight-results', { state: newState });
    window.location.reload();
  };

  const totalTravellers  = flightAdults + flightChildren + flightInfants;
  const cabinClassStr    = flightClass === 2 ? 'Economy' : flightClass === 3 ? 'Premium Economy' : flightClass === 4 ? 'Business' : flightClass === 6 ? 'First Class' : 'All Classes';
  const isRoundTrip      = journeyType === 2;

  // ── Calendar icon ────────────────────────────────────────────────────────
  const CalIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );

  return (
    <div
      ref={dropdownRef}
      style={{
        background:   'linear-gradient(to right, #911635, #412850)',
        color:        '#fff',
        boxShadow:    '0 4px 12px rgba(0,0,0,0.12)',
        position:     'relative',
        zIndex:       100,
        paddingBottom: 0,
      }}
    >
      {/* ── Global styles ── */}
      <style>{`
        .ms-row { max-width: 1200px; margin: 0 auto; padding: 0 20px 14px 20px; display: flex; align-items: flex-end; gap: 16px; flex-wrap: wrap; }
        .ms-col { flex: 1; border-bottom: 1.5px solid rgba(255,255,255,0.28); padding-bottom: 6px; cursor: pointer; position: relative; transition: border-color 0.2s; min-width: 130px; }
        .ms-col:hover { border-bottom-color:rgba(255,255,255,0.7); }
        .ms-label { font-size:10px; font-weight:600; color:rgba(255,255,255,0.65); margin-bottom:3px; font-family:'Inter',sans-serif; text-transform:uppercase; letter-spacing:0.3px; }
        .ms-val { font-size:15px; font-weight:800; font-family:'Inter',sans-serif; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .ms-dropdown { position:absolute; top:calc(100% + 12px); left:0; background:#fff; width:320px; border-radius:12px; box-shadow:0 12px 40px rgba(0,0,0,0.18); padding:10px; z-index:999; color:#111; cursor:default; }
        .ms-dropdown-search input { width:100%; padding:10px 12px; border-radius:8px; border:1px solid #ddd; outline:none; font-size:13px; font-family:'Inter',sans-serif; }
        .ms-dropdown-list { max-height:240px; overflow-y:auto; margin-top:8px; }
        .ms-dropdown-list::-webkit-scrollbar { width:5px; }
        .ms-dropdown-list::-webkit-scrollbar-thumb { background:#ccc; border-radius:4px; }
        .ms-dropdown-item { display:flex; align-items:center; gap:10px; padding:9px 10px; cursor:pointer; border-radius:8px; font-family:'Inter',sans-serif; }
        .ms-dropdown-item:hover { background:#f5f5f5; }
        .ms-trip-radio { display:flex; align-items:center; gap:6px; cursor:pointer; font-size:13px; font-weight:600; color:rgba(255,255,255,0.85); font-family:'Inter',sans-serif; }
        .ms-trip-radio input[type=radio] { accent-color:#fff; cursor:pointer; width:14px; height:14px; }
        .ms-trip-radio:hover { color:#fff; }
        /* DatePicker */
        .react-datepicker-popper { z-index:999 !important; }
        .react-datepicker { font-family:'Inter',sans-serif !important; border-radius:12px !important; border:none !important; box-shadow:0 12px 40px rgba(0,0,0,0.18) !important; overflow:hidden; }
        .react-datepicker__header { background:#911635 !important; border-bottom:none !important; border-radius:0 !important; }
        .react-datepicker__current-month,.react-datepicker__day-name { color:#fff !important; }
        .react-datepicker__day--selected,.react-datepicker__day--in-range,.react-datepicker__day--range-start,.react-datepicker__day--range-end { background:#d81b21 !important; border-radius:50% !important; color:#fff !important; }
        .react-datepicker__day--in-selecting-range { background:rgba(216,27,33,0.15) !important; }
        .react-datepicker__navigation-icon::before { border-color:#fff !important; }
        .ms-check-row { display:flex; align-items:center; gap:6px; font-size:12px; font-weight:500; color:rgba(255,255,255,0.8); cursor:pointer; white-space:nowrap; }
        .ms-check-row input[type=checkbox] { accent-color:#fff; cursor:pointer; width:13px; height:13px; }
      `}</style>

      {/* ── Row 1: Trip type selector ── */}
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '10px 20px 8px 20px', display: 'flex', alignItems: 'center', gap: '24px' }}>
        {[{ val: 1, label: 'One Way' }, { val: 2, label: 'Round Trip' }, { val: 3, label: 'Multicity' }].map(t => (
          <label key={t.val} className="ms-trip-radio">
            <input type="radio" name="journeyType" value={t.val} checked={journeyType === t.val} onChange={() => setJourneyType(t.val)} />
            {t.label}
          </label>
        ))}
      </div>

      {/* ── Row 2: Main search fields ── */}
      <div className="ms-row">

        {/* Plane icon */}
        <div style={{ paddingBottom: '10px', flexShrink: 0 }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff" stroke="none" style={{ transform: 'rotate(90deg)', opacity: 0.9 }}>
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5L21 16z"/>
          </svg>
        </div>

        {/* FROM */}
        <AirportAutocomplete
          label="From"
          value={fromAirport}
          onChange={(airport) => setFromAirport(airport)}
          onClick={() => setActiveDropdown(null)}
        />

        {/* Swap icon */}
        <div style={{ paddingBottom: '12px', flexShrink: 0, cursor: 'pointer' }} onClick={() => { const tmp = fromAirport; setFromAirport(toAirport); setToAirport(tmp); }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 10L3 14L7 18"/><path d="M21 14H3"/><path d="M17 4L21 8L17 12"/><path d="M3 8H21"/>
          </svg>
        </div>

        {/* TO */}
        <AirportAutocomplete
          label="To"
          value={toAirport}
          onChange={(airport) => setToAirport(airport)}
          onClick={() => setActiveDropdown(null)}
        />

        {/* DEPARTURE DATE */}
        <div className="ms-col" style={{ flexShrink: 0, minWidth: '110px', maxWidth: '140px' }}>
          <div className="ms-label">Departure</div>
          <DatePicker
            selected={departDate}
            onChange={(date) => {
              setDepartDate(date);
              // if return date is before new depart date, push it forward
              if (date > returnDate) setReturnDate(addDays(date, 3));
            }}
            minDate={new Date()}
            onCalendarOpen={() => setShowReturnCal(false)}
            customInput={
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <div className="ms-val">{format(departDate, 'dd MMM')}</div>
                <CalIcon />
              </div>
            }
          />
        </div>

        {/* RETURN DATE — only for Round Trip */}
        {isRoundTrip ? (
          <div className="ms-col" style={{ flexShrink: 0, minWidth: '120px', maxWidth: '150px', position: 'relative' }} ref={returnCalRef}>
            <div className="ms-label">Return</div>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
              onClick={() => setShowReturnCal(v => !v)}
            >
              <div className="ms-val">{format(returnDate, 'dd MMM')}</div>
              <CalIcon />
              <span
                title="Remove return date"
                onClick={e => { e.stopPropagation(); setJourneyType(1); }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '16px', height: '16px', borderRadius: '50%', background: 'rgba(255,255,255,0.22)', cursor: 'pointer', flexShrink: 0 }}
              >
                <X size={10} color="#fff" />
              </span>
            </div>
            {showReturnCal && (
              <div style={{ position: 'absolute', top: 'calc(100% + 12px)', left: 0, zIndex: 999 }}>
                <DatePicker
                  selected={returnDate}
                  onChange={(date) => { setReturnDate(date); setShowReturnCal(false); }}
                  minDate={addDays(departDate, 1)}
                  inline
                />
              </div>
            )}
          </div>
        ) : (
          /* One Way — placeholder to show "Add Return" */
          <div className="ms-col" style={{ flexShrink: 0, minWidth: '120px', maxWidth: '150px', opacity: 0.65, cursor: 'pointer' }} onClick={() => setJourneyType(2)}>
            <div className="ms-label">Return</div>
            <div className="ms-val" style={{ fontWeight: 500, fontSize: '13px' }}>+ Add Date</div>
          </div>
        )}

        {/* TRAVELLERS & CLASS */}
        <div className="ms-col"
          onClick={() => setActiveDropdown(activeDropdown === 'travellers' ? null : 'travellers')}
          style={{ flexShrink: 0, minWidth: '140px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}
        >
          <div>
            <div className="ms-label">Traveller(s), Class</div>
            <div className="ms-val">{totalTravellers} Traveller, {cabinClassStr}</div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '2px', flexShrink: 0 }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
          {activeDropdown === 'travellers' && (
            <div className="ms-dropdown" onClick={e => e.stopPropagation()} style={{ right: 0, left: 'auto', width: '280px', padding: '15px' }}>
              {/* Adults */}
              {[
                { label: 'Adults',   sub: '12+ years',    val: flightAdults,   min: 1, set: setFlightAdults },
                { label: 'Children', sub: '2-12 years',   val: flightChildren, min: 0, set: setFlightChildren },
                { label: 'Infants',  sub: 'Under 2 years',val: flightInfants,  min: 0, set: setFlightInfants },
              ].map(({ label, sub, val, min, set }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', fontFamily: "'Inter', sans-serif" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#222' }}>{label}</div>
                    <div style={{ fontSize: '11px', color: '#666' }}>{sub}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} disabled={val <= min} onClick={() => set(v => v - 1)}>−</button>
                    <span style={{ fontWeight: 700, fontSize: '15px', color: '#222', minWidth: '16px', textAlign: 'center' }}>{val}</span>
                    <button style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #d81b21', background: '#ffebeb', color: '#d81b21', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => set(v => v + 1)}>+</button>
                  </div>
                </div>
              ))}
              <div style={{ borderTop: '1px solid #eee', paddingTop: '10px', marginBottom: '10px' }}>
                <div style={{ fontWeight: 600, fontSize: '12px', marginBottom: '6px', color: '#333' }}>Cabin Class</div>
                <select value={flightClass} onChange={e => setFlightClass(parseInt(e.target.value))} style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #ddd', outline: 'none', fontSize: '13px' }}>
                  <option value={1}>All Classes</option>
                  <option value={2}>Economy</option>
                  <option value={3}>Premium Economy</option>
                  <option value={4}>Business</option>
                  <option value={6}>First Class</option>
                </select>
              </div>
              <button type="button" style={{ width: '100%', padding: '8px', background: '#d81b21', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }} onClick={() => setActiveDropdown(null)}>Done</button>
            </div>
          )}
        </div>

        {/* SEARCH AGAIN */}
        <div style={{ paddingBottom: '4px', flexShrink: 0 }}>
          <button
            onClick={handleSearch}
            style={{ background: '#d81b21', color: '#fff', border: 'none', borderRadius: '4px', padding: '10px 22px', fontSize: '14px', fontWeight: '800', fontFamily: "'Inter', sans-serif", cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 4px 12px rgba(216,27,33,0.35)', whiteSpace: 'nowrap' }}
            onMouseEnter={e => e.currentTarget.style.background = '#b81218'}
            onMouseLeave={e => e.currentTarget.style.background = '#d81b21'}
          >
            Search Again
          </button>
        </div>
      </div>

    </div>
  );
}
