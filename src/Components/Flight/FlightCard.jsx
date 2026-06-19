import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Clock, Luggage, Info, Loader2 } from 'lucide-react';
import FareOptionsModal, { extractUpsellFamilies } from './FareOptionsModal';
import PremiumFareDetailsModal from './PremiumFareDetailsModal';

// Real airline logo via aviasales CDN - no static map needed
function AirlineLogo({ code, name }) {
    const [errored, setErrored] = useState(false);
    const logoUrl = `https://pics.avs.io/60/60/${code}.png`;
    return (
        <div style={{ width: '44px', height: '44px', background: '#f5f8ff', borderRadius: '8px', border: '1px solid #e8edf2', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
            {!errored
                ? <img src={logoUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} onError={() => setErrored(true)} />
                : <span style={{ fontSize: '11px', fontWeight: '800', color: '#d81b21', textAlign: 'center', lineHeight: 1.1 }}>{code}</span>
            }
        </div>
    );
}

function FlightCard({ flight }) {
    const navigate = useNavigate();
    const [showDetails, setShowDetails] = useState(false);
    const [isUpsellLoading, setIsUpsellLoading] = useState(false);
    const [fetchedFareData, setFetchedFareData] = useState(null);
    const [showFareModal, setShowFareModal] = useState(false);

    const fare = flight.Fare;
    const totalSegments = flight.Segments.length;

    const formatTime = (d) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    const formatDuration = (m) => `${Math.floor(m / 60)}h ${m % 60}m`;

    const handleBook = async () => {
        if (isUpsellLoading) return;
        setIsUpsellLoading(true);
        try {
            const base = process.env.REACT_APP_FLIGHT_API_BASE_URL || 'http://localhost:8009/api/flight';
            const payload = { TraceId: flight.TraceId, ResultIndex: flight.ResultIndex };
            
            const [quoteRes, ruleRes, ssrRes, upsellRes] = await Promise.all([
                fetch(`${base}/fare-quote`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
                fetch(`${base}/fare-rule`,  { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).catch(() => null),
                fetch(`${base}/ssr`,        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).catch(() => null),
                fetch(`${base}/fare-upsell`,{ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).catch(() => null),
            ]);

            if (!quoteRes.ok) {
                // FareQuote failed — still open modal with fallback data from search
                setFetchedFareData({ quoteData: null, ruleData: null, ssrData: null, upsellData: null });
                setShowFareModal(true);
                return;
            }

            const quoteData  = await quoteRes.json();
            const ruleData   = ruleRes?.ok   ? await ruleRes.json()   : null;
            const ssrData    = ssrRes?.ok    ? await ssrRes.json()    : null;
            const upsellData = upsellRes?.ok ? await upsellRes.json() : null;

            if (!quoteData?.Response?.Results) {
                throw new Error('Seat not available or pricing failed.');
            }



            // Always open the modal — user clicked "View Fare" explicitly
            // (even 1 fare family should show baggage, rules, price before booking)
            setFetchedFareData({ quoteData, ruleData, ssrData, upsellData });
            setShowFareModal(true);
        } catch (err) {
            console.error('❌ Fare fetch error:', err);
            alert('This flight is no longer available or the search has expired. Please refresh the search.');
        } finally {
            setIsUpsellLoading(false);
        }
    };

    return (
        <>
            {extractUpsellFamilies(fetchedFareData?.upsellData).length > 1 ? (
                <FareOptionsModal 
                    isOpen={showFareModal} 
                    onClose={() => setShowFareModal(false)} 
                    outbound={flight} 
                    navigate={navigate}
                    fetchedFareData={fetchedFareData}
                />
            ) : (
                <PremiumFareDetailsModal 
                    isOpen={showFareModal} 
                    onClose={() => setShowFareModal(false)} 
                    outbound={flight} 
                    navigate={navigate}
                    fetchedFareData={fetchedFareData}
                />
            )}

            <style>{`
                .fc-row { display: flex; align-items: center; padding: 6px 12px; }
                .fc-route { flex: 1; display: flex; align-items: center; padding: 0 20px; }
                .fc-price { min-width: 150px; padding-left: 12px; border-left: 1px solid #e8edf2; display: flex; flex-direction: column; justify-content: center; height: 100%; align-items: flex-end; }
                .fc-airline { width: 155px; flex-shrink: 0; display: flex; flex-direction: column; gap: 5px; }
                @media(max-width: 1024px) {
                    .fc-row { flex-direction: column; align-items: stretch; gap: 16px; padding: 16px 12px; }
                    .fc-route { padding: 0; width: auto; justify-content: space-between; }
                    .fc-route > div { min-width: 0 !important; }
                    .fc-airline { width: auto; flex-direction: row; align-items: center; gap: 12px; }
                    .fc-price { 
                        min-width: 0; padding-left: 0; border-left: none; border-top: 1px solid #e8edf2; 
                        padding-top: 12px; width: auto; 
                        display: grid !important; grid-template-columns: 1fr auto; align-items: center; gap: 6px; 
                    }
                    .fc-price > div:nth-child(1) { text-align: left !important; margin-bottom: 0 !important; }
                    .fc-price > div:nth-child(3) { grid-column: 1; grid-row: 2; justify-content: flex-start; }
                    .fc-price > button { grid-column: 2; grid-row: 1 / 3; width: auto !important; padding: 10px 24px !important; }
                }
            `}</style>

            <div
                style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e8edf2', marginBottom: '10px', overflow: 'hidden', transition: 'box-shadow 0.25s', fontFamily: "'Outfit','Inter',sans-serif", boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.1)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'}
            >
                {flight.Segments.map((segGroup, gi) => {
                    const first = segGroup[0];
                    const last = segGroup[segGroup.length - 1];
                    const airline = first.Airline;
                    const stops = segGroup.length - 1;
                    const totalDur = segGroup.reduce((a, leg, i) => a + leg.Duration + (i > 0 ? Math.max(0, (new Date(leg.Origin.DepTime) - new Date(segGroup[i - 1].Destination.ArrTime)) / 60000) : 0), 0);

                    return (
                        <div key={gi} className="fc-row" style={{ borderBottom: gi < totalSegments - 1 ? '1px dashed #e8edf2' : 'none' }}>
                            {/* LEFT: Airline */}
                            <div className="fc-airline">
                                {totalSegments > 1 && (
                                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#d81b21', background: '#ffebeb', padding: '2px 7px', borderRadius: '4px', textTransform: 'uppercase', display: 'inline-block', width: 'fit-content', marginBottom: '3px' }}>
                                        {gi === 0 ? 'Outbound' : gi === 1 ? 'Return' : `Leg ${gi + 1}`}
                                    </div>
                                )}
                                <AirlineLogo code={airline.AirlineCode} name={airline.AirlineName} />
                                <div style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a2e', lineHeight: 1.2 }}>{airline.AirlineName}</div>
                                <div style={{ fontSize: '11px', color: '#687b8f' }}>{airline.AirlineCode}-{airline.FlightNumber}</div>
                                {/* CO2 from API data: estimate based on duration */}
                                {first.Co2Emission ? (
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#e6f7ee', border: '1px solid #b2e0c4', borderRadius: '12px', padding: '2px 8px', width: 'fit-content' }}>
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1a9a52" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                        <span style={{ fontSize: '10px', fontWeight: '700', color: '#1a9a52' }}>{first.Co2Emission} Kg CO2</span>
                                    </div>
                                ) : first.Craft ? (
                                    <div style={{ fontSize: '10px', color: '#687b8f', fontStyle: 'italic' }}>{first.Craft}</div>
                                ) : null}
                            </div>

                            {/* CENTER: Route */}
                            <div className="fc-route">
                                {/* Departure */}
                                <div style={{ minWidth: '100px' }}>
                                    <div style={{ fontSize: '20px', fontWeight: '800', color: '#1a1a2e', letterSpacing: '-0.5px', lineHeight: 1 }}>{formatTime(first.Origin.DepTime)}</div>
                                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#222', marginTop: '4px' }}>{first.Origin.Airport.CityName}</div>
                                    <div style={{ fontSize: '10px', color: '#687b8f', marginTop: '2px' }}>{formatDate(first.Origin.DepTime)}</div>
                                </div>

                                {/* Duration line */}
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '100px', padding: '0 8px' }}>
                                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#687b8f', marginBottom: '5px' }}>{formatDuration(Math.round(totalDur))}</div>
                                    <div style={{ width: '100%', display: 'flex', alignItems: 'center', position: 'relative' }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#9dafc0', flexShrink: 0 }} />
                                        <div style={{ flex: 1, height: '1.5px', background: '#c5d0db', position: 'relative' }}>
                                            {stops > 0 && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', border: '2px solid #fff', boxShadow: '0 0 0 1px #f59e0b' }} />}
                                        </div>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#9dafc0', flexShrink: 0 }} />
                                    </div>
                                    <div style={{ fontSize: '11px', fontWeight: '700', color: stops === 0 ? '#16a34a' : '#d97706', marginTop: '4px' }}>
                                        {stops === 0 ? 'Non Stop' : `${stops} Stop${stops > 1 ? 's' : ''}`}
                                    </div>
                                </div>

                                {/* Arrival */}
                                <div style={{ minWidth: '100px', textAlign: 'right' }}>
                                    <div style={{ fontSize: '20px', fontWeight: '800', color: '#1a1a2e', letterSpacing: '-0.5px', lineHeight: 1 }}>{formatTime(last.Destination.ArrTime)}</div>
                                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#222', marginTop: '4px' }}>{last.Destination.Airport.CityName}</div>
                                    <div style={{ fontSize: '10px', color: '#687b8f', marginTop: '2px' }}>{formatDate(last.Destination.ArrTime)}</div>
                                </div>
                            </div>

                            {/* RIGHT: Price + Book (only first segment row) */}
                            {gi === 0 && (
                                <div className="fc-price">
                                    <div style={{ marginBottom: '6px', textAlign: 'right' }}>
                                        <div style={{ fontSize: '20px', fontWeight: '800', color: '#1a1a2e', letterSpacing: '-0.5px', lineHeight: 1 }}>₹{Math.round(fare.OfferedFare).toLocaleString('en-IN')}</div>
                                        {fare.Discount > 0 && (
                                            <div style={{ fontSize: '10px', color: '#16a34a', fontWeight: '700', marginTop: '2px' }}>
                                                Save ₹{Math.round(fare.Discount).toLocaleString('en-IN')}
                                            </div>
                                        )}
                                    </div>
                                    <button onClick={handleBook} disabled={isUpsellLoading}
                                        style={{ width: '100%', padding: '6px 14px', background: '#d81b21', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: '800', fontSize: '13px', cursor: isUpsellLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', opacity: isUpsellLoading ? 0.7 : 1, transition: 'background 0.2s', fontFamily: "'Outfit','Inter',sans-serif" }}
                                        onMouseEnter={e => !isUpsellLoading && (e.currentTarget.style.background = '#b8141a')}
                                        onMouseLeave={e => !isUpsellLoading && (e.currentTarget.style.background = '#d81b21')}
                                    >
                                        {isUpsellLoading ? <><Loader2 size={14} className="fa-spin" />Checking...</> : 'Select'}
                                    </button>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: flight.IsRefundable ? '#16a34a' : '#ef4444', flexShrink: 0 }} />
                                        <span style={{ fontSize: '11px', fontWeight: '600', color: flight.IsRefundable ? '#16a34a' : '#ef4444' }}>
                                            {flight.IsRefundable ? 'Refundable' : 'Non-Refundable'}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* ── Bottom bar: Baggage + Tags + Actions ── */}
                <div style={{ background: '#f8fafc', borderTop: '1px solid #edf2f7', padding: '8px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                        {flight.Segments[0][0].Baggage && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#4a5568', fontWeight: '500' }}>
                                <Luggage size={12} style={{ color: '#687b8f' }} /> {flight.Segments[0][0].Baggage} Check-in
                            </span>
                        )}
                        {flight.Segments[0][0].CabinBaggage && (
                            <span style={{ fontSize: '11px', color: '#4a5568', fontWeight: '500' }}>🎒 {flight.Segments[0][0].CabinBaggage} Cabin</span>
                        )}
                        {flight.IsLCC && <span style={{ fontSize: '10px', color: '#6b7280', border: '1px solid #e5e7eb', padding: '1px 6px', borderRadius: '4px', fontWeight: '500' }}>LCC</span>}
                        <button onClick={handleBook}
                            style={{ background: 'none', border: 'none', color: '#e8151b', fontSize: '12px', fontWeight: '600', cursor: isUpsellLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: '0 10px 0 0', borderRight: '1px solid #e2e8f0', opacity: isUpsellLoading ? 0.6 : 1 }}>
                            {isUpsellLoading ? <Loader2 size={13} className="fa-spin" /> : <Info size={13} />}
                            {isUpsellLoading ? 'Loading...' : 'Fare Rules'}
                        </button>
                    </div>
                    <button onClick={() => setShowDetails(!showDetails)}
                        style={{ background: 'none', border: 'none', color: '#1a6dcf', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}>
                        Flight Details {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                </div>

                {/* ── Expandable Details ── */}
                {showDetails && (
                    <div style={{ borderTop: '1px solid #edf2f7', background: '#fafbfc', padding: '20px', animation: 'fd 0.25s ease' }}>
                        <style>{`@keyframes fd{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}`}</style>
                        {flight.Segments.map((sg, si) => (
                            <div key={si} style={{ marginBottom: si < flight.Segments.length - 1 ? '20px' : 0 }}>
                                {totalSegments > 1 && <div style={{ fontSize: '13px', fontWeight: '800', color: '#333', marginBottom: '12px', borderBottom: '1px solid #eee', paddingBottom: '4px' }}>{si === 0 ? 'Outbound flight details' : 'Return flight details'}</div>}
                                {sg.map((leg, li) => {
                                    const lay = li > 0 ? (new Date(leg.Origin.DepTime) - new Date(sg[li - 1].Destination.ArrTime)) / 60000 : 0;
                                    return (
                                        <div key={li}>
                                            {li > 0 && <div style={{ background: '#fef3c7', color: '#d97706', padding: '7px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', margin: '10px 0', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={13} />Layover: {formatDuration(lay)} in {leg.Origin.Airport.CityName} ({leg.Origin.Airport.AirportCode})</div>}
                                            <div style={{ display: 'flex', gap: '16px', alignItems: 'stretch' }}>
                                                <div style={{ minWidth: '140px' }}>
                                                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a2e' }}>{leg.Airline.AirlineName}</div>
                                                    <div style={{ fontSize: '12px', color: '#687b8f' }}>Flight: {leg.Airline.AirlineCode}-{leg.Airline.FlightNumber}</div>
                                                    {leg.Craft && <div style={{ fontSize: '11px', color: '#99aab5', marginTop: '3px' }}>Aircraft: {leg.Craft}</div>}
                                                    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '3px' }}>Class: {leg.CabinClass === 2 ? 'Economy' : leg.CabinClass === 3 ? 'Premium Economy' : leg.CabinClass === 4 ? 'Business' : 'First Class'}</div>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '18px' }}>
                                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d81b21', zIndex: 2 }} />
                                                    <div style={{ flex: 1, width: '2px', background: '#e2e8f0', margin: '4px 0' }} />
                                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#687b8f', zIndex: 2 }} />
                                                </div>
                                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                    <div>
                                                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a2e' }}>{formatTime(leg.Origin.DepTime)} – {leg.Origin.Airport.CityName}</div>
                                                        <div style={{ fontSize: '12px', color: '#4a5568', marginTop: '2px' }}>{leg.Origin.Airport.AirportName}, T-{leg.Origin.Airport.Terminal || '1'}</div>
                                                    </div>
                                                    <div style={{ margin: '6px 0', fontSize: '11px', color: '#99aab5', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={11} />Duration: {formatDuration(leg.Duration)}</div>
                                                    <div>
                                                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a2e' }}>{formatTime(leg.Destination.ArrTime)} – {leg.Destination.Airport?.CityName || leg.Destination.CityName}</div>
                                                        <div style={{ fontSize: '12px', color: '#4a5568', marginTop: '2px' }}>{leg.Destination.Airport?.AirportName}, T-{leg.Destination.Airport?.Terminal || '1'}</div>
                                                    </div>
                                                </div>
                                                <div style={{ minWidth: '145px', borderLeft: '1px solid #eee', paddingLeft: '14px', fontSize: '12px' }}>
                                                    <div style={{ fontWeight: '700', color: '#4a5568', marginBottom: '8px' }}>Baggage Allowance</div>
                                                    <div>🎒 <strong>Cabin:</strong> {leg.CabinBaggage || '7 KG'}</div>
                                                    <div style={{ marginTop: '4px' }}>🧳 <strong>Check-in:</strong> {leg.Baggage || '15 KG'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default FlightCard;
