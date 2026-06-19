import React, { useState, useRef, useEffect } from 'react';

/* ── Time-slot SVG Icons ─────────────────────────────────── */
function TimeIcon({ slot }) {
    const p = { fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' };
    if (slot === '00-06') return (
        <svg width="22" height="22" viewBox="0 0 24 24" {...p}>
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" opacity=".15" stroke="currentColor"/>
        </svg>
    );
    if (slot === '06-12') return (
        <svg width="22" height="22" viewBox="0 0 24 24" {...p}>
            <circle cx="12" cy="12" r="4" fill="currentColor" opacity=".2"/>
            <line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/>
            <line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
            <line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/>
            <line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/>
        </svg>
    );
    if (slot === '12-18') return (
        <svg width="22" height="22" viewBox="0 0 24 24" {...p}>
            <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
    );
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" {...p}>
            <path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="9" x2="12" y2="2"/>
            <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/>
            <line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/>
            <line x1="23" y1="22" x2="1" y2="22"/><polyline points="8 6 12 2 16 6"/>
        </svg>
    );
}

/* ── Airline Logo (small, for panel) ────────────────────── */
function AirlineLogoSmall({ code, name }) {
    const [err, setErr] = useState(false);
    if (err) return <span style={{ fontSize: '10px', fontWeight: '800', color: '#c0392b' }}>{code}</span>;
    return <img src={`https://pics.avs.io/36/36/${code}.png`} alt={name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={() => setErr(true)} />;
}

/* ── Chevron ──────────────────────────────────────────────── */
function Chevron({ open }) {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"
            style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
            <polyline points="6 9 12 15 18 9"/>
        </svg>
    );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════ */
function FlightSidebar({
    flights = [],
    filteredCount = 0,
    totalCount = 0,
    activeFilters = {},
    priceRange = { min: 0, max: 100000 },
    originCity = '',
    onFiltersApply,
    onStopToggle,
}) {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const wrapRef = useRef(null);

    /* Pending state inside panel */
    const [pd, setPd] = useState({
        stops: [], airlines: [], priceMax: priceRange.max, departTimes: [], aircraft: [],
    });
    const [airlineSearch, setAirlineSearch] = useState('');
    const [aircraftSearch, setAircraftSearch] = useState('');

    /* Sync pending to active when panel opens */
    const openPanel = () => {
        setPd({
            stops:       [...(activeFilters.stops       || [])],
            airlines:    [...(activeFilters.airlines    || [])],
            priceMax:    activeFilters.priceMax ?? priceRange.max,
            departTimes: [...(activeFilters.departTimes || [])],
            aircraft:    [...(activeFilters.aircraft    || [])],
        });
        setAirlineSearch('');
        setAircraftSearch('');
        setIsPanelOpen(true);
    };

    const handleCancel = () => setIsPanelOpen(false);

    const handleApply = () => {
        onFiltersApply(pd);
        setIsPanelOpen(false);
    };

    const handleClearAll = () => {
        const empty = { stops: [], airlines: [], priceMax: priceRange.max, departTimes: [], aircraft: [] };
        onFiltersApply(empty);
        setIsPanelOpen(false);
    };

    /* Outside click */
    useEffect(() => {
        if (!isPanelOpen) return;
        const h = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setIsPanelOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, [isPanelOpen]);

    /* Derived data from real flights */
    const airlines = (() => {
        const map = {};
        flights.forEach(fl => {
            const seg = fl.Segments?.[0]?.[0];
            if (!seg) return;
            const code = seg.Airline.AirlineCode;
            const name = seg.Airline.AirlineName || code;
            if (!map[code]) map[code] = { code, name, count: 0 };
            map[code].count++;
        });
        return Object.values(map).sort((a, b) => b.count - a.count);
    })();

    const aircraftList = (() => {
        const s = new Set();
        flights.forEach(fl => fl.Segments.forEach(sg => sg.forEach(leg => { if (leg.Craft?.trim()) s.add(leg.Craft.trim()); })));
        return [...s].sort();
    })();

    const shownAirlines = airlines.filter(a => a.name.toLowerCase().includes(airlineSearch.toLowerCase()));
    const shownAircraft  = aircraftList.filter(a => a.toLowerCase().includes(aircraftSearch.toLowerCase()));

    /* Active filter check */
    const af = activeFilters;
    const stopCount    = af.stops?.length || 0;
    const airlineCount = af.airlines?.length || 0;
    const dtCount      = af.departTimes?.length || 0;
    const acCount      = af.aircraft?.length || 0;
    const priceActive  = af.priceMax !== null && af.priceMax !== undefined && af.priceMax < priceRange.max;
    const hasAny       = stopCount + airlineCount + dtCount + acCount > 0 || priceActive;

    /* Helpers */
    const toggle = (key, val) => setPd(p => ({ ...p, [key]: p[key].includes(val) ? p[key].filter(x => x !== val) : [...p[key], val] }));

    const sliderPct = () => {
        const max = priceRange.max || 1;
        const min = priceRange.min || 0;
        return (((pd.priceMax ?? max) - min) / (max - min)) * 100;
    };

    const STOP_OPTIONS = [{ id: '0', label: '0' }, { id: '1', label: '1' }, { id: '2+', label: '2' }];
    const TIME_SLOTS   = [{ id: '00-06', label: '00 - 06' }, { id: '06-12', label: '06 - 12' }, { id: '12-18', label: '12 - 18' }, { id: '18 - 00', id2: '18-00', label: '18 - 00' }].map(s => ({ ...s, id: s.id2 || s.id }));

    /* ── Label button in top bar ── */
    const BarBtn = ({ label, count = 0, blue = false, onClick }) => (
        <button
            onClick={onClick}
            className="flt-bar-btn"
            style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '0 18px', height: '100%', background: 'none',
                border: 'none', borderRight: '1px solid #e8edf2',
                cursor: 'pointer', whiteSpace: 'nowrap',
                color: blue ? '#1a5cba' : '#1a1a2e',
                fontWeight: '600', fontSize: '13px',
                fontFamily: "'Outfit','Inter',sans-serif",
                transition: 'background 0.15s',
                position: 'relative',
            }}>
            {label}
            {count > 0 && (
                <span style={{ background: '#d81b21', color: '#fff', borderRadius: '10px', padding: '1px 6px', fontSize: '10px', fontWeight: '800', lineHeight: 1.5 }}>{count}</span>
            )}
            <Chevron open={false} />
        </button>
    );

    return (
        <div ref={wrapRef} style={{ position: 'relative', zIndex: isPanelOpen ? 1100 : 300, marginBottom: '14px', marginTop: '0', fontFamily: "'Outfit','Inter',sans-serif", width: '100%', boxSizing: 'border-box' }}>

            {/* ═══ CSS ══════════════════════════════════════════ */}
            <style>{`
                .flt-bar-btn:hover { background: #f5f7fa !important; }
                .flt-stop-btn:hover { border-color: #1a3c6e !important; }
                .flt-chk-row { display:flex; align-items:center; gap:10px; padding:7px 10px; border-radius:6px; cursor:pointer; }
                .flt-chk-row:hover { background:#f5f7fa; }
                .flt-slot-btn:hover { border-color: #1a3c6e !important; }
                .flt-panel-col { padding: 22px 20px; border-right: 1px solid #edf0f5; }
                .flt-panel-col:last-child { border-right: none; }
                .flt-scrolllist { overflow-y: auto; max-height: 240px; margin-top: 10px; }
                .flt-scrolllist::-webkit-scrollbar { width: 4px; }
                .flt-scrolllist::-webkit-scrollbar-thumb { background: #d0d7e3; border-radius: 4px; }
                .range-sl { -webkit-appearance:none; appearance:none; width:100%; height:3px; border-radius:2px; outline:none; cursor:pointer;
                    background: linear-gradient(to right, #d81b21 0%, #d81b21 var(--pct,100%), #dde3ed var(--pct,100%), #dde3ed 100%); }
                .range-sl::-webkit-slider-thumb { -webkit-appearance:none; width:16px; height:16px; border-radius:50%; background:#d81b21; border:2px solid #fff; box-shadow:0 1px 4px rgba(0,0,0,0.25); cursor:pointer; }
                .range-sl::-moz-range-thumb { width:16px; height:16px; border-radius:50%; background:#d81b21; border:2px solid #fff; box-shadow:0 1px 4px rgba(0,0,0,0.25); cursor:pointer; }
                .flt-search-box { display:flex; align-items:center; gap:7px; border:1px solid #dde3ed; border-radius:6px; padding:8px 10px; background:#fafbfc; }
                .flt-search-box input { border:none; outline:none; background:transparent; font-size:13px; width:100%; font-family:"Outfit","Inter",sans-serif; color:#1a1a2e; }
                .flt-search-box input::placeholder { color:#9aabb8; }
                @keyframes panelSlide { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
                
                /* Responsive */
                .flt-panel-grid { display: grid; grid-template-columns: repeat(4, 1fr); min-height: 320px; width: 100%; }
                .flt-top-bar { display: flex; align-items: stretch; background: #fff; border: 1px solid #e4e7ed; border-radius: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.04); height: 52px; overflow: hidden; }
                .flt-desktop-only { display: flex; align-items: stretch; flex: 1; }
                .flt-panel-container { position: absolute; top: 100%; left: 0; right: 0; width: 100%; background: #fff; border: 1px solid #e4e7ed; border-top: none; box-shadow: 0 16px 48px rgba(0,0,0,0.12); z-index: 400; animation: panelSlide 0.2s ease; overflow: hidden; }
                
                @media(max-width: 900px) {
                    .flt-panel-grid { grid-template-columns: 1fr; }
                    .flt-desktop-only { display: none !important; }
                    .flt-panel-col { border-right: none !important; border-bottom: 1px solid #edf0f5; }
                    .flt-panel-container { position: fixed; top: 0; bottom: 0; height: 100vh; overflow-y: auto; z-index: 9999; }
                }
            `}</style>

            {/* ═══ TOP FILTER BAR ═══════════════════════════════ */}
            <div className="flt-top-bar" style={{ borderBottom: isPanelOpen ? '1px solid #edf0f5' : '1px solid #e4e7ed', justifyContent: 'center' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', width: '100%', alignItems: 'stretch' }}>

                    {/* ── Filters icon label ── */}
                    <button
                        onClick={() => isPanelOpen ? handleCancel() : openPanel()}
                        style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            gap: '2px', padding: '0 16px', background: isPanelOpen ? '#f0f3f9' : 'none',
                            border: 'none', borderRight: '1px solid #e8edf2', cursor: 'pointer',
                            color: isPanelOpen ? '#1a3c6e' : '#1a1a2e', transition: 'background 0.15s', flexShrink: 0,
                        }}
                        className="flt-bar-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                        </svg>
                        <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.2px' }}>Filters</span>
                        {hasAny && <span style={{ position: 'absolute', top: '6px', right: '4px', width: '7px', height: '7px', borderRadius: '50%', background: '#d81b21' }} />}
                    </button>

                    <div className="flt-desktop-only" style={{ display: 'flex', flex: 1 }}>
                        {/* ── Stops ── */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '0 18px', borderRight: '1px solid #e8edf2', flexShrink: 0 }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a2e', marginRight: '2px' }}>Stops:</span>
                        {STOP_OPTIONS.map(s => {
                            const act = (af.stops || []).includes(s.id);
                            return (
                                <button key={s.id} onClick={() => onStopToggle(s.id)} className="flt-stop-btn"
                                    style={{ width: '30px', height: '30px', borderRadius: '5px', border: `1.5px solid ${act ? '#1a3c6e' : '#c8d0db'}`, background: act ? '#1a3c6e' : '#fff', color: act ? '#fff' : '#3a4a5c', fontWeight: '700', fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {s.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* ── Price ▼ ── */}
                    <button onClick={openPanel} className="flt-bar-btn"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '0 18px', height: '100%', background: priceActive ? '#f0f3f9' : 'none', border: 'none', borderRight: '1px solid #e8edf2', cursor: 'pointer', color: '#1a1a2e', fontWeight: '600', fontSize: '13px', fontFamily: "'Outfit','Inter',sans-serif", whiteSpace: 'nowrap', flex: 1 }}>
                        Price
                        {priceActive && <span style={{ background: '#1a3c6e', color: '#fff', borderRadius: '10px', padding: '1px 6px', fontSize: '10px', fontWeight: '800' }}>1</span>}
                        <Chevron open={isPanelOpen} />
                    </button>

                    {/* ── Depart Time ▼ ── */}
                    <button onClick={openPanel} className="flt-bar-btn"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '0 18px', height: '100%', background: dtCount > 0 ? '#f0f3f9' : 'none', border: 'none', borderRight: '1px solid #e8edf2', cursor: 'pointer', color: '#1a1a2e', fontWeight: '600', fontSize: '13px', fontFamily: "'Outfit','Inter',sans-serif", whiteSpace: 'nowrap', flex: 1 }}>
                        Depart Time
                        {dtCount > 0 && <span style={{ background: '#1a3c6e', color: '#fff', borderRadius: '10px', padding: '1px 6px', fontSize: '10px', fontWeight: '800' }}>{dtCount}</span>}
                        <Chevron open={isPanelOpen} />
                    </button>

                    {/* ── Airlines ▼ ── */}
                    <button onClick={openPanel} className="flt-bar-btn"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '0 18px', height: '100%', background: airlineCount > 0 ? '#f0f3f9' : 'none', border: 'none', borderRight: '1px solid #e8edf2', cursor: 'pointer', color: '#1a1a2e', fontWeight: '600', fontSize: '13px', fontFamily: "'Outfit','Inter',sans-serif", whiteSpace: 'nowrap', flex: 1 }}>
                        Airlines
                        {airlineCount > 0 && <span style={{ background: '#1a3c6e', color: '#fff', borderRadius: '10px', padding: '1px 6px', fontSize: '10px', fontWeight: '800' }}>{airlineCount}</span>}
                        <Chevron open={isPanelOpen} />
                    </button>

                    {/* ── Aircraft ▼ ── */}
                    <button onClick={openPanel} className="flt-bar-btn"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '0 18px', height: '100%', background: acCount > 0 ? '#f0f3f9' : 'none', border: 'none', borderRight: '1px solid #e8edf2', cursor: 'pointer', color: '#1a1a2e', fontWeight: '600', fontSize: '13px', fontFamily: "'Outfit','Inter',sans-serif", whiteSpace: 'nowrap', flex: 1 }}>
                        Aircraft
                        {acCount > 0 && <span style={{ background: '#1a3c6e', color: '#fff', borderRadius: '10px', padding: '1px 6px', fontSize: '10px', fontWeight: '800' }}>{acCount}</span>}
                        <Chevron open={isPanelOpen} />
                    </button>

                    {/* ── More Filters ▼ ── */}
                    <button onClick={openPanel} className="flt-bar-btn"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '0 18px', height: '100%', background: 'none', border: 'none', cursor: 'pointer', color: '#1a5cba', fontWeight: '700', fontSize: '13px', fontFamily: "'Outfit','Inter',sans-serif", whiteSpace: 'nowrap', flex: 1 }}>
                        More Filters
                        <Chevron open={isPanelOpen} />
                    </button>

                    {/* ── Clear all (far right) ── */}
                    {hasAny && (
                        <button onClick={handleClearAll}
                            style={{ marginLeft: 'auto', padding: '0 16px', background: 'none', border: 'none', borderLeft: '1px solid #e8edf2', color: '#d81b21', fontSize: '12px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: "'Outfit','Inter',sans-serif" }}>
                            Clear All
                        </button>
                    )}
                    </div>
                </div>
            </div>

            {/* ═══ FULL FILTER PANEL ════════════════════════════ */}
            {isPanelOpen && (
                <div className="flt-panel-container">

                    {/* Panel header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', background: '#fafbfc', borderBottom: '1px solid #edf0f5' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a2e' }}>
                            {filteredCount} of {totalCount} Flights
                        </span>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={handleCancel}
                                style={{ padding: '8px 22px', border: '1.5px solid #c8d0db', borderRadius: '6px', background: '#fff', fontWeight: '600', fontSize: '13px', cursor: 'pointer', color: '#3a4a5c', fontFamily: "'Outfit','Inter',sans-serif", transition: 'all 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = '#9aabb8'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = '#c8d0db'}>
                                Cancel
                            </button>
                            <button onClick={handleApply}
                                style={{ padding: '8px 24px', border: 'none', borderRadius: '6px', background: '#d81b21', color: '#fff', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: "'Outfit','Inter',sans-serif", boxShadow: '0 2px 8px rgba(216,27,33,0.25)', transition: 'background 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#b8141a'}
                                onMouseLeave={e => e.currentTarget.style.background = '#d81b21'}>
                                Apply Filters
                            </button>
                        </div>
                    </div>

                    {/* 4-column body */}
                    <div className="flt-panel-grid">

                        {/* ── COL 1: Stops + Price ── */}
                        <div className="flt-panel-col">
                            <div style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a2e', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '11px' }}>STOPS</div>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
                                {STOP_OPTIONS.map(s => {
                                    const act = pd.stops.includes(s.id);
                                    return (
                                        <button key={s.id} onClick={() => toggle('stops', s.id)}
                                            style={{ width: '42px', height: '42px', borderRadius: '6px', border: `2px solid ${act ? '#1a3c6e' : '#c8d0db'}`, background: act ? '#1a3c6e' : '#fff', color: act ? '#fff' : '#3a4a5c', fontWeight: '700', fontSize: '15px', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {s.label}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Divider */}
                            <div style={{ borderTop: '1px solid #edf0f5', marginBottom: '18px' }} />

                            <div style={{ fontSize: '11px', fontWeight: '700', color: '#1a1a2e', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>PRICE</div>
                            <div style={{ fontSize: '12px', color: '#687b8f', marginBottom: '14px', fontWeight: '500' }}>
                                Upto: <strong style={{ color: '#1a1a2e' }}>₹{(pd.priceMax || priceRange.max).toLocaleString('en-IN')}</strong>
                            </div>
                            <div style={{ background: '#f5f7fa', borderRadius: '8px', padding: '16px 14px' }}>
                                <input type="range" className="range-sl"
                                    min={priceRange.min} max={priceRange.max}
                                    value={pd.priceMax ?? priceRange.max}
                                    style={{ '--pct': `${sliderPct()}%` }}
                                    onChange={e => setPd(p => ({ ...p, priceMax: parseInt(e.target.value) }))} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#4a5568' }}>₹{priceRange.min.toLocaleString('en-IN')}</span>
                                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#4a5568' }}>₹{priceRange.max.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>

                        {/* ── COL 2: Depart Time ── */}
                        <div className="flt-panel-col">
                            <div style={{ fontSize: '11px', fontWeight: '700', color: '#1a1a2e', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>DEPART TIME</div>
                            {originCity && (
                                <div style={{ fontSize: '12px', color: '#687b8f', fontWeight: '500', marginBottom: '18px' }}>From {originCity}</div>
                            )}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: originCity ? '0' : '18px' }}>
                                {TIME_SLOTS.map(slot => {
                                    const act = pd.departTimes.includes(slot.id);
                                    return (
                                        <button key={slot.id} className="flt-slot-btn"
                                            onClick={() => toggle('departTimes', slot.id)}
                                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '7px', padding: '14px 8px', borderRadius: '8px', border: `1.5px solid ${act ? '#1a3c6e' : '#dde3ed'}`, background: act ? '#eef2ff' : '#fff', color: act ? '#1a3c6e' : '#5a6a7a', cursor: 'pointer', fontSize: '11px', fontWeight: '700', transition: 'all 0.15s', letterSpacing: '0.3px' }}>
                                            <TimeIcon slot={slot.id} />
                                            {slot.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ── COL 3: Airlines ── */}
                        <div className="flt-panel-col" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: '11px', fontWeight: '700', color: '#1a1a2e', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>AIRLINES</div>
                            <div className="flt-search-box">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9aabb8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                                <input value={airlineSearch} onChange={e => setAirlineSearch(e.target.value)} placeholder="Search Airlines" />
                            </div>
                            <div className="flt-scrolllist">
                                {shownAirlines.map(al => {
                                    const chk = pd.airlines.includes(al.code);
                                    return (
                                        <label key={al.code} className="flt-chk-row">
                                            <input type="checkbox" checked={chk}
                                                onChange={() => toggle('airlines', al.code)}
                                                style={{ width: '15px', height: '15px', accentColor: '#d81b21', cursor: 'pointer', flexShrink: 0 }} />
                                            <div style={{ width: '26px', height: '26px', background: '#f5f8ff', borderRadius: '4px', border: '1px solid #edf0f5', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                                                <AirlineLogoSmall code={al.code} name={al.name} />
                                            </div>
                                            <span style={{ flex: 1, fontSize: '13px', fontWeight: '500', color: '#1a1a2e' }}>{al.name}</span>
                                            <span style={{ fontSize: '11px', color: '#9aabb8', fontWeight: '600' }}>({al.count})</span>
                                        </label>
                                    );
                                })}
                                {shownAirlines.length === 0 && <div style={{ fontSize: '12px', color: '#9aabb8', textAlign: 'center', padding: '20px' }}>No airlines found</div>}
                            </div>
                        </div>

                        {/* ── COL 4: Aircraft ── */}
                        <div className="flt-panel-col" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: '11px', fontWeight: '700', color: '#1a1a2e', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>AIRCRAFT</div>
                            <div className="flt-search-box">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9aabb8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                                <input value={aircraftSearch} onChange={e => setAircraftSearch(e.target.value)} placeholder="Search Aircraft" />
                            </div>
                            <div className="flt-scrolllist">
                                {shownAircraft.map(craft => {
                                    const chk = pd.aircraft.includes(craft);
                                    return (
                                        <label key={craft} className="flt-chk-row">
                                            <input type="checkbox" checked={chk}
                                                onChange={() => toggle('aircraft', craft)}
                                                style={{ width: '15px', height: '15px', accentColor: '#d81b21', cursor: 'pointer', flexShrink: 0 }} />
                                            <span style={{ fontSize: '13px', fontWeight: '500', color: '#1a1a2e' }}>{craft}</span>
                                        </label>
                                    );
                                })}
                                {shownAircraft.length === 0 && <div style={{ fontSize: '12px', color: '#9aabb8', textAlign: 'center', padding: '20px' }}>No aircraft data</div>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FlightSidebar;
