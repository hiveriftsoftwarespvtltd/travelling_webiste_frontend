import React, { useMemo, useState } from 'react';
import {
    extractUpsellFamilies,
    getSectorRules,
    getBaggage,
    getCabin,
    getSeat,
    getMeal,
    buildTabInfo
} from './FareOptionsModal';
import { CheckCircle, Info, Luggage, Utensils, XCircle, ChevronRight, AlertCircle, Clock } from 'lucide-react';

export default function PremiumFareDetailsModal({ isOpen, onClose, outbound, returnFlight, navigate, fetchedFareData }) {
    const [mainTab, setMainTab] = useState('FARES');
    const isRoundTrip = !!returnFlight;
    const quoteResults = fetchedFareData?.quoteData?.Response?.Results;
    const ruleData = fetchedFareData?.ruleData;
    const ssrData = fetchedFareData?.ssrData;

    // Handle both One-Way (upsellData is the API response) and Round-Trip (upsellData is {outbound, return})
    const outUpsellFamilies = useMemo(() => extractUpsellFamilies(fetchedFareData?.upsellData?.outbound || fetchedFareData?.upsellData), [fetchedFareData]);
    const retUpsellFamilies = useMemo(() => extractUpsellFamilies(fetchedFareData?.upsellData?.return), [fetchedFareData]);

    const fareInfo = useMemo(() => {
        if (!outbound) return null;

        let targetOutUpsell = outUpsellFamilies[0];
        let targetRetUpsell = retUpsellFamilies[0];

        const isRefOut = targetOutUpsell?.IsRefundable ?? outbound.IsRefundable;
        const isRefRet = targetRetUpsell?.IsRefundable ?? returnFlight?.IsRefundable;

        const outRules = getSectorRules(targetOutUpsell, quoteResults, ruleData, 0, isRefOut);
        const retRules = isRoundTrip ? getSectorRules(targetRetUpsell, quoteResults, ruleData, 1, isRefRet) : null;

        const price = Math.round(
            (targetOutUpsell?.Fare?.PublishedFare || quoteResults?.Fare?.PublishedFare || outbound.Fare?.PublishedFare || 0) +
            (isRoundTrip ? (targetRetUpsell?.Fare?.PublishedFare || returnFlight?.Fare?.PublishedFare || 0) : 0)
        );

        const baseFare = Math.round(
            (targetOutUpsell?.Fare?.BaseFare || quoteResults?.Fare?.BaseFare || outbound.Fare?.BaseFare || 0) +
            (isRoundTrip ? (targetRetUpsell?.Fare?.BaseFare || returnFlight?.Fare?.BaseFare || 0) : 0)
        );

        const tax = Math.round(
            (targetOutUpsell?.Fare?.Tax || quoteResults?.Fare?.Tax || outbound.Fare?.Tax || 0) +
            (isRoundTrip ? (targetRetUpsell?.Fare?.Tax || returnFlight?.Fare?.Tax || 0) : 0)
        );

        const resIdx = isRoundTrip ? `${outbound.ResultIndex},${returnFlight.ResultIndex}` : outbound.ResultIndex;

        let preQuote = null;
        if (quoteResults) {
            preQuote = {
                Response: {
                    ResponseStatus: 1,
                    Results: {
                        ...quoteResults,
                        ResultIndex: resIdx,
                        Fare: {
                            ...(targetOutUpsell?.Fare || quoteResults.Fare),
                            PublishedFare: price,
                            BaseFare: baseFare,
                            Tax: tax
                        },
                        Segments: [
                            targetOutUpsell?.Segments?.[0] || quoteResults.Segments?.[0] || [],
                            isRoundTrip ? (targetRetUpsell?.Segments?.[0] || quoteResults.Segments?.[1] || []) : []
                        ].filter(s => s && s.length > 0)
                    }
                }
            };
        }

        return {
            id: targetOutUpsell?.id || 1,
            name: targetOutUpsell?.FareFamilyName || targetOutUpsell?.ResultFareType || 'Standard Fare',
            price,
            baseFare,
            tax,
            isRefundable: isRefOut,
            resultIndex: resIdx,
            prefetchedQuote: preQuote,
            prefetchedSsr: ssrData,
            out: {
                cancel: outRules.cancel,
                dateChange: outRules.dateChange,
                baggage: getBaggage(targetOutUpsell?.Segments?.[0]?.[0], quoteResults?.Segments?.[0]?.[0], ssrData?.Response?.Baggage?.[0]?.[0], outbound.Segments?.[0]?.[0]),
                cabinBag: getCabin(targetOutUpsell?.Segments?.[0]?.[0], quoteResults?.Segments?.[0]?.[0], outbound.Segments?.[0]?.[0]),
                seat: getSeat(ssrData, 0),
                meal: getMeal(ssrData, 0),
            },
            ret: isRoundTrip ? {
                cancel: retRules?.cancel,
                dateChange: retRules?.dateChange,
                baggage: getBaggage(targetRetUpsell?.Segments?.[0]?.[0], quoteResults?.Segments?.[1]?.[0], ssrData?.Response?.Baggage?.[1]?.[0], returnFlight.Segments?.[0]?.[0]),
                cabinBag: getCabin(targetRetUpsell?.Segments?.[0]?.[0], quoteResults?.Segments?.[1]?.[0], returnFlight.Segments?.[0]?.[0]),
                seat: getSeat(ssrData, 1),
                meal: getMeal(ssrData, 1),
            } : null,
        };
    }, [outbound, returnFlight, fetchedFareData, isRoundTrip, quoteResults, ruleData, ssrData, outUpsellFamilies, retUpsellFamilies]);

    if (!isOpen || !outbound || !fareInfo) return null;

    const handleContinue = () => {
        navigate('/flight-checkout', {
            state: {
                TraceId: outbound.TraceId,
                ResultIndex: fareInfo.resultIndex,
                fareFamilyId: fareInfo.id,
                fareFamilyName: fareInfo.name,
                totalPrice: fareInfo.price,
                prefetchedQuote: fareInfo.prefetchedQuote || fetchedFareData?.quoteData,
                prefetchedSsr: fareInfo.prefetchedSsr || fetchedFareData?.ssrData,
            },
        });
    };

    const outTab = buildTabInfo(outbound);
    const retTab = buildTabInfo(returnFlight);

    return (
        <div className="pfd-backdrop" style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', animation: 'fadeIn 0.2s ease-out' }}>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .pfd-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
                .pfd-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
                
                @media(max-width: 768px) {
                    .pfd-backdrop { padding: 0 !important; display: block !important; }
                    .pfd-modal { position: fixed !important; inset: 0 !important; max-height: 100dvh !important; height: 100dvh !important; width: 100vw !important; border-radius: 0 !important; display: flex !important; flex-direction: column !important; }
                    .pfd-header { padding: 10px 14px 0 !important; flex-shrink: 0 !important; }
                    .pfd-header-top { align-items: center !important; margin-bottom: 6px !important; }
                    .pfd-header-top h2 { font-size: 18px !important; }
                    .pfd-header-desc { display: none !important; }
                    .pfd-tabs { gap: 12px !important; overflow-x: auto !important; scrollbar-width: none; -ms-overflow-style: none; display: flex !important; flex-wrap: nowrap !important; }
                    .pfd-tabs::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }
                    .pfd-tabs div { white-space: nowrap !important; flex-shrink: 0 !important; padding: 0 0 6px 0 !important; font-size: 13px !important; }
                    .pfd-body { padding: 12px 14px !important; min-height: 0 !important; flex: 1 1 auto !important; overflow-y: auto !important; height: 100% !important; }
                    .pfd-card-row { flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; }
                    .pfd-footer { padding: 10px 14px !important; flex-direction: row !important; align-items: center !important; justify-content: space-between !important; flex-shrink: 0 !important; background: #fff !important; box-shadow: 0 -4px 12px rgba(0,0,0,0.05) !important; z-index: 10 !important; gap: 10px !important; }
                    .pfd-footer-price { flex-direction: column !important; align-items: flex-start !important; gap: 0 !important; }
                    .pfd-price-amount { font-size: 18px !important; }
                    .pfd-price-sub { font-size: 10px !important; }
                    .pfd-footer button { width: auto !important; padding: 10px 16px !important; font-size: 13px !important; flex-grow: 1; justify-content: center; max-width: 150px; }
                    .pfd-leg-row { flex-direction: column !important; gap: 12px !important; }
                    .pfd-leg-col-right { border-left: none !important; padding-left: 0 !important; padding-top: 12px !important; border-top: 1px solid #e2e8f0; width: 100%; }
                }
            `}</style>

            <div className="pfd-modal" style={{ background: '#fff', width: '100%', maxWidth: '800px', borderRadius: '16px', display: 'flex', flexDirection: 'column', maxHeight: '90vh', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)', fontFamily: "'Outfit', 'Inter', sans-serif" }}>

                {/* Header */}
                <div className="pfd-header" style={{ padding: '20px 24px 0', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                    <div className="pfd-header-top" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>Fare Details</h2>
                            <div className="pfd-header-desc" style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', fontWeight: '500' }}>Review your flight benefits and rules before booking</div>
                        </div>
                        <button onClick={onClose} style={{ flexShrink: 0, background: '#f1f5f9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'} onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                    {/* TABS */}
                    <div className="pfd-tabs" style={{ display: 'flex', gap: '24px' }}>
                        {[
                            { key: 'FARES', label: 'Fare Details' },
                            { key: 'ITINERARY', label: 'Flight Details' },
                            { key: 'RULES', label: 'Fare Rules' }
                        ].map(t => (
                            <div
                                key={t.key}
                                onClick={() => setMainTab(t.key)}
                                style={{
                                    padding: '0 0 12px 0',
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    color: mainTab === t.key ? '#d81b21' : '#64748b',
                                    borderBottom: mainTab === t.key ? '3px solid #d81b21' : '3px solid transparent',
                                    cursor: 'pointer',
                                    transition: 'color 0.2s',
                                }}
                            >
                                {t.label}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Body */}
                <div className="pfd-scroll pfd-body" style={{ flex: 1, overflowY: 'auto', padding: '24px', background: '#f8fafc' }}>

                    {mainTab === 'FARES' && (
                        <>
                            {/* Flight Timeline Card */}
                            <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                                <div className="pfd-card-row" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                                    <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                        <img src={`https://pics.avs.io/60/60/${outTab.code}.png`} alt="Airline" style={{ width: '40px', height: '40px', objectFit: 'contain' }} onError={e => e.target.style.display = 'none'} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#e8151b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Outbound • {outTab.date}</div>
                                        <div style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b' }}>{outTab.from} <ChevronRight size={18} style={{ verticalAlign: 'middle', color: '#94a3b8', margin: '0 4px' }} /> {outTab.to}</div>
                                        <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={12} /> {outTab.dep} - {outTab.arr} • Flight {outTab.nums}</div>
                                    </div>
                                </div>

                                {isRoundTrip && retTab && (
                                    <div className="pfd-card-row" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                            <img src={`https://pics.avs.io/60/60/${retTab.code}.png`} alt="Airline" style={{ width: '40px', height: '40px', objectFit: 'contain' }} onError={e => e.target.style.display = 'none'} />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '12px', fontWeight: '700', color: '#e8151b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Return • {retTab.date}</div>
                                            <div style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b' }}>{retTab.from} <ChevronRight size={18} style={{ verticalAlign: 'middle', color: '#94a3b8', margin: '0 4px' }} /> {retTab.to}</div>
                                            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={12} /> {retTab.dep} - {retTab.arr} • Flight {retTab.nums}</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                                {/* Benefits & Amenities */}
                                <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                                    <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#1e293b', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Info size={18} color="#e8151b" /> Benefits Included
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                            <Luggage size={18} color="#0284c7" style={{ marginTop: '2px' }} />
                                            <div>
                                                <div style={{ fontSize: '14px', fontWeight: '700', color: '#334155' }}>Baggage</div>
                                                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                                                    Cabin: {fareInfo.out.cabinBag || '7 KG'}<br />
                                                    Check-in: {fareInfo.out.baggage || '15 KG'}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                            <Utensils size={18} color="#10b981" style={{ marginTop: '2px' }} />
                                            <div>
                                                <div style={{ fontSize: '14px', fontWeight: '700', color: '#334155' }}>Meals</div>
                                                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>{fareInfo.out.meal || 'Chargeable'}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                            <AlertCircle size={18} color="#f59e0b" style={{ marginTop: '2px' }} />
                                            <div>
                                                <div style={{ fontSize: '14px', fontWeight: '700', color: '#334155' }}>Seat Selection</div>
                                                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>{fareInfo.out.seat === 'Free' ? 'Free seats available' : 'Standard seats are chargeable'}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Rules & Policies */}
                                <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                                    <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#1e293b', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {fareInfo.isRefundable ? <CheckCircle size={18} color="#10b981" /> : <XCircle size={18} color="#ef4444" />}
                                        {fareInfo.isRefundable ? 'Refundable Fare' : 'Non-Refundable Fare'}
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                                            <div style={{ fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>Cancellation Fee</div>
                                            {(fareInfo.out.cancel || (fareInfo.isRefundable ? 'Subject to airline policy' : 'Non-Refundable')).split('\n').map((line, i) => {
                                                const parts = line.split(':');
                                                if (parts.length === 2) {
                                                    return (
                                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px dashed #e2e8f0', fontSize: '13px' }}>
                                                            <span style={{ color: '#475569' }}>{parts[0]}</span>
                                                            <span style={{ fontWeight: '600', color: '#1e293b' }}>{parts[1]}</span>
                                                        </div>
                                                    );
                                                }
                                                return <div key={i} style={{ fontSize: '14px', color: '#1e293b', fontWeight: '600' }}>{line}</div>;
                                            })}
                                        </div>
                                        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                                            <div style={{ fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>Date Change Fee</div>
                                            {(fareInfo.out.dateChange || 'Subject to airline policy').split('\n').map((line, i) => {
                                                const parts = line.split(':');
                                                if (parts.length === 2) {
                                                    return (
                                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px dashed #e2e8f0', fontSize: '13px' }}>
                                                            <span style={{ color: '#475569' }}>{parts[0]}</span>
                                                            <span style={{ fontWeight: '600', color: '#1e293b' }}>{parts[1]}</span>
                                                        </div>
                                                    );
                                                }
                                                return <div key={i} style={{ fontSize: '14px', color: '#1e293b', fontWeight: '600' }}>{line}</div>;
                                            })}
                                            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px' }}>*Fare difference may apply</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {mainTab === 'ITINERARY' && (
                        <div>
                            {[
                                { segs: quoteResults?.Segments?.[0] || outbound?.Segments?.[0], label: isRoundTrip ? 'Onward Flight' : 'Flight Details' },
                                isRoundTrip ? { segs: quoteResults?.Segments?.[1] || returnFlight?.Segments?.[0], label: 'Return Flight' } : null,
                            ].filter(Boolean).map(({ segs, label }) =>
                                segs && segs.length > 0 ? (
                                    <div key={label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '16px', overflow: 'hidden' }}>
                                        <div style={{ padding: '12px 16px', borderBottom: '1px solid #e8e8e8', fontWeight: '700', fontSize: '13px', color: '#333', background: '#f8f9fa' }}>{label}</div>
                                        {segs.map((leg, li) => {
                                            const layMs = li > 0 ? new Date(leg.Origin.DepTime) - new Date(segs[li - 1].Destination.ArrTime) : 0;
                                            const durStr = `${Math.floor(leg.Duration / 60)}h ${leg.Duration % 60}m`;
                                            const layStr = li > 0 ? `${Math.floor(layMs / 3600000)}h ${Math.floor((layMs % 3600000) / 60000)}m` : '';
                                            const dep = new Date(leg.Origin.DepTime);
                                            const arr = new Date(leg.Destination.ArrTime);
                                            return (
                                                <div key={li}>
                                                    {li > 0 && (
                                                        <div style={{ background: '#fff8e1', color: '#b45309', padding: '6px 16px', fontSize: '12px', fontWeight: '600' }}>
                                                            Layover: {layStr} in {leg.Origin.Airport.CityName}
                                                        </div>
                                                    )}
                                                    <div className="pfd-leg-row" style={{ padding: '14px 16px', display: 'flex', gap: '16px', alignItems: 'flex-start', borderBottom: li < segs.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                                                        <div style={{ minWidth: '140px' }}>
                                                            <div style={{ fontWeight: '700', fontSize: '13px', color: '#222' }}>{leg.Airline.AirlineName}</div>
                                                            <div style={{ fontSize: '12px', color: '#666' }}>{leg.Airline.AirlineCode}-{leg.Airline.FlightNumber}</div>
                                                            {leg.Craft && <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{leg.Craft}</div>}
                                                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                                                                {leg.CabinClass === 2 ? 'Economy' : leg.CabinClass === 3 ? 'Premium Economy' : leg.CabinClass === 4 ? 'Business' : 'First'}
                                                            </div>
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                                                                <span style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b' }}>{dep.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                                                                <span style={{ fontSize: '12px', color: '#475569' }}>{leg.Origin.Airport.CityName} ({leg.Origin.Airport.AirportCode})</span>
                                                            </div>
                                                            <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>{dep.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} · {leg.Origin.Airport.AirportName}</div>
                                                            <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px', paddingLeft: '4px' }}>── {durStr} ──</div>
                                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                                                                <span style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b' }}>{arr.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                                                                <span style={{ fontSize: '12px', color: '#475569' }}>{leg.Destination.Airport?.CityName} ({leg.Destination.Airport?.AirportCode})</span>
                                                            </div>
                                                            <div style={{ fontSize: '11px', color: '#64748b' }}>{arr.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} · {leg.Destination.Airport?.AirportName}</div>
                                                        </div>
                                                        <div className="pfd-leg-col-right" style={{ minWidth: '110px', borderLeft: '1px solid #e2e8f0', paddingLeft: '14px', fontSize: '12px', color: '#475569' }}>
                                                            <div style={{ fontWeight: '700', marginBottom: '6px', fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Baggage</div>
                                                            <div>🎒 Cabin: {leg.CabinBaggage || '7 KG'}</div>
                                                            <div style={{ marginTop: '4px' }}>🧳 Check-in: {leg.Baggage || '15 KG'}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : null
                            )}
                        </div>
                    )}

                    {mainTab === 'RULES' && (
                        <div>
                            {(ruleData?.Response?.FareRules?.length > 0)
                                ? ruleData.Response.FareRules.map((fr, idx) => (
                                    <div key={idx} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '14px', overflow: 'hidden' }}>
                                        <div style={{ padding: '10px 16px', borderBottom: '1px solid #e8e8e8', fontWeight: '700', fontSize: '13px', color: '#333', background: '#f8f9fa' }}>
                                            {fr.Origin} → {fr.Destination} — Fare Rules
                                        </div>
                                        <div
                                            style={{ padding: '14px 16px', fontSize: '13px', color: '#444', lineHeight: 1.6, whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}
                                            dangerouslySetInnerHTML={{ __html: fr.FareRuleDetail }}
                                        />
                                    </div>
                                ))
                                : <div style={{ textAlign: 'center', padding: '48px', color: '#888', fontSize: '14px' }}>No fare rules available for this flight.</div>
                            }
                        </div>
                    )}
                </div>

                {/* Footer / Price Breakdown */}
                <div className="pfd-footer" style={{ padding: '20px 24px', background: '#fff', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', flexShrink: 0 }}>
                    <div>
                        <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Fare</div>
                        <div className="pfd-footer-price" style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <span className="pfd-price-amount" style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px' }}>₹{fareInfo.price.toLocaleString('en-IN')}</span>
                            <span className="pfd-price-sub" style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>Base: ₹{fareInfo.baseFare.toLocaleString('en-IN')} • Tax: ₹{fareInfo.tax.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                    <button
                        onClick={handleContinue}
                        style={{ background: '#d81b21', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: '8px', fontSize: '16px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(216, 27, 33, 0.2)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#b8141a'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#d81b21'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                        Continue to Book <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
