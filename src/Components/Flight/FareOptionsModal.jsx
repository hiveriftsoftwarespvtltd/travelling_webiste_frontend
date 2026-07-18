import React, { useState, useMemo } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY: Extract fare family array from TBO FareUpsell Response
// ─────────────────────────────────────────────────────────────────────────────
export const extractUpsellFamilies = (upsellData) => {
    const raw = upsellData?.Response?.Results;
    if (!raw) return [];
    if (Array.isArray(raw)) {
        if (Array.isArray(raw[0])) return raw[0].filter(f => f?.Fare);
        if (raw[0]?.Fare) return raw;
        if (raw[0]?.FareFamilies) return raw[0].FareFamilies;
    } else if (typeof raw === 'object') {
        if (Array.isArray(raw.FareFamilies)) return raw.FareFamilies;
        if (raw.Fare) return [raw];
    }
    return [];
};

// ─────────────────────────────────────────────────────────────────────────────
// Format an hour number → display string  (0 → "0h", 3 → "3h", 72 → "3d")
// ─────────────────────────────────────────────────────────────────────────────
const fmtHour = (h) => {
    if (h == null || h === 0) return '0h';
    if (h < 24) return `${h}h`;
    const d = Math.floor(h / 24);
    const rem = h % 24;
    return rem === 0 ? `${d}d` : `${d}d ${rem}h`;
};

// ─────────────────────────────────────────────────────────────────────────────
// Format MiniFareRules into multiline text  (like "0h - 3h: Non Refundable\n...")
// type: 'cancel' | 'dateChange'
// ─────────────────────────────────────────────────────────────────────────────
export const formatRulesText = (miniRules, segIdx = 0, type = 'cancel') => {
    if (!miniRules) return null;
    const seg = Array.isArray(miniRules[0]) ? miniRules[segIdx] : miniRules;
    if (!seg || seg.length === 0) return null;

    const lines = seg.map((rule, i) => {
        const fromH = rule.Hour ?? 0;
        const nextRule = seg[i + 1];
        const to = nextRule ? fmtHour(nextRule.Hour ?? 0) : '365d';
        const from = fmtHour(fromH);

        const charge = type === 'cancel' ? rule.CancellationCharges : rule.DateChangeCharges;
        let chargeStr;

        if (charge == null) {
            chargeStr = rule.IsRefundable === false
                ? (type === 'cancel' ? 'Non Refundable' : 'Non Changeable')
                : '—';
        } else if (charge === 0) {
            if (type === 'cancel') {
                chargeStr = rule.IsRefundable === false ? 'Non Refundable' : 'Free';
            } else {
                chargeStr = 'Free Date Change';
            }
        } else {
            chargeStr = `INR ${Math.round(charge).toLocaleString('en-IN')}`;
        }

        return `${from} - ${to}: ${chargeStr}`;
    });

    return lines.join('\n');
};

// ─────────────────────────────────────────────────────────────────────────────
// Parse raw fare rule text (fallback)
// ─────────────────────────────────────────────────────────────────────────────
export const parseFareRuleText = (rawDetail = '', isRefundable) => {
    const t = rawDetail.replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').toLowerCase();
    const findCharge = (keyword) => {
        const idx = t.search(new RegExp(keyword, 'i'));
        if (idx === -1) return null;
        const slice = t.slice(idx, idx + 600);
        if (/non[- ]?refund|not.?permitted|no refund/i.test(slice)) return 'Non Refundable';
        if (/no.?charge|free of charge|nil\b/i.test(slice)) return 'Free';
        const m = slice.match(/(?:inr|rs\.?|₹)\s*([\d,]+)/i);
        if (m) return `₹${parseInt(m[1].replace(/,/g, '')).toLocaleString('en-IN')}`;
        return null;
    };
    return {
        cancel: findCharge('cancell') ?? (isRefundable === false ? 'Non Refundable' : null),
        dateChange: findCharge('date.?change|reschedul|reissu|amendment'),
        isRefundable,
    };
};

// ─────────────────────────────────────────────────────────────────────────────
// Get sector rules (priority chain: upsell miniRules → quote inline → standalone API)
// ─────────────────────────────────────────────────────────────────────────────
export const getSectorRules = (upsell, quoteResults, ruleData, segIdx, fallbackRefundable) => {
    if (upsell?.MiniFareRules) {
        const seg = Array.isArray(upsell.MiniFareRules[0])
            ? upsell.MiniFareRules[segIdx]
            : upsell.MiniFareRules;
        if (seg && seg.length > 0) {
            const rule = seg[0];
            const cancelAmt = rule?.CancellationCharges;
            const changeAmt = rule?.DateChangeCharges;
            const cancelStr = cancelAmt != null ? (cancelAmt === 0 ? 'Free' : `₹${Math.round(cancelAmt).toLocaleString('en-IN')}`) : null;
            const changeStr = changeAmt != null ? (changeAmt === 0 ? 'Free' : `₹${Math.round(changeAmt).toLocaleString('en-IN')}`) : null;
            if (cancelStr || changeStr) return { cancel: cancelStr, dateChange: changeStr, isRefundable: rule?.IsRefundable };
        }
    }
    const inline = quoteResults?.FareRules?.[segIdx];
    if (inline?.FareRuleDetail) return parseFareRuleText(inline.FareRuleDetail, fallbackRefundable);
    const standalone = ruleData?.Response?.FareRules?.[segIdx];
    if (standalone?.FareRuleDetail) return parseFareRuleText(standalone.FareRuleDetail, fallbackRefundable);
    return { cancel: fallbackRefundable === false ? 'Non Refundable' : null, dateChange: null, isRefundable: fallbackRefundable };
};

export const getBaggage = (uSeg, qSeg, ssrEntry, sSeg) =>
    uSeg?.Baggage || qSeg?.Baggage || ssrEntry?.Desc || sSeg?.Baggage || null;

export const getCabin = (uSeg, qSeg, sSeg) =>
    uSeg?.CabinBaggage || qSeg?.CabinBaggage || sSeg?.CabinBaggage || null;

export const getSeat = (ssrData, segIdx) => {
    const pref = ssrData?.Response?.SeatPreferences?.[segIdx]
        || ssrData?.Response?.SeatDynamic?.[segIdx];
    if (!pref || pref.length === 0) return null;
    const flat = Array.isArray(pref[0]) ? pref.flat() : pref;
    if (!flat.length) return null;
    return flat.some(s => s?.Price === 0 || s?.SeatType === 1) ? 'Free' : 'Chargeable';
};

export const getMeal = (ssrData, segIdx) => {
    const dyn = ssrData?.Response?.MealDynamic?.[segIdx];
    if (dyn && dyn.length > 0) {
        const flat = Array.isArray(dyn[0]) ? dyn.flat() : dyn;
        if (!flat.length) return null;
        return flat.some(m => m?.Price === 0) ? 'Free' : 'Chargeable';
    }
    const stat = ssrData?.Response?.Meal?.[segIdx];
    if (stat && stat.length > 0) return 'Available';
    return null;
};

// ─────────────────────────────────────────────────────────────────────────────
// Build fare family objects
// ─────────────────────────────────────────────────────────────────────────────
const buildFareFamilies = ({ upsellFamilies, quoteResults, ruleData, ssrData, searchFlight, isRet, basePriceFallback }) => {
    return upsellFamilies.map((upsell, idx) => {
        const price = Math.round(upsell.Fare?.PublishedFare || basePriceFallback);
        const uSeg = upsell.Segments?.[isRet ? 1 : 0]?.[0] || upsell.Segments?.[0]?.[0];
        const qSeg = quoteResults?.Segments?.[isRet ? 1 : 0]?.[0];
        const sSeg = searchFlight?.Segments?.[0]?.[0];
        const ssrBag = ssrData?.Response?.Baggage?.[isRet ? 1 : 0]?.[0];
        const isRef = upsell.IsRefundable ?? searchFlight?.IsRefundable;
        const rules = getSectorRules(upsell, quoteResults, ruleData, isRet ? 1 : 0, isRef);
        const resIdx = upsell.ResultIndex || searchFlight?.ResultIndex;

        let familyQuoteData = null;
        if (quoteResults) {
            familyQuoteData = {
                Response: {
                    ResponseStatus: 1,
                    Results: {
                        ...quoteResults,
                        ResultIndex: resIdx,
                        Fare: {
                            ...(upsell.Fare || quoteResults.Fare),
                            PublishedFare: price,
                            OfferedFare: upsell.Fare?.OfferedFare || 0,
                            BaseFare: upsell.Fare?.BaseFare || 0,
                            Tax: upsell.Fare?.Tax || 0,
                        },
                        FareBreakdown: upsell.FareBreakdown || quoteResults.FareBreakdown,
                        Segments: upsell.Segments || quoteResults.Segments || []
                    }
                }
            };
        }

        const fareData = upsell.Fare || {};
        const baseFare = Math.round(fareData.BaseFare || 0);
        const tax      = Math.round(fareData.Tax || 0);
        const fareBreakdown = upsell.FareBreakdown || quoteResults?.FareBreakdown || null;

        return {
            id: idx + 1,
            name: upsell.FareFamilyName || upsell.ResultFareType || upsell.FareClassification?.Type || (idx === 0 ? 'Basic' : idx === 1 ? 'Standard' : idx === 2 ? 'Flexi' : 'Premium'),
            price, baseFare, tax, fareBreakdown, resultIndex: resIdx,
            prefetchedQuote: familyQuoteData, prefetchedSsr: ssrData, isRefundable: upsell.IsRefundable,
            cancelTextOut: formatRulesText(upsell.MiniFareRules, isRet ? 1 : 0, 'cancel'),
            dateChangeTextOut: formatRulesText(upsell.MiniFareRules, isRet ? 1 : 0, 'dateChange'),
            out: {
                cancel: rules.cancel, dateChange: rules.dateChange,
                baggage: getBaggage(uSeg, qSeg, ssrBag, sSeg),
                cabinBag: getCabin(uSeg, qSeg, sSeg),
                seat: getSeat(ssrData, isRet ? 1 : 0), meal: getMeal(ssrData, isRet ? 1 : 0),
            },
        };
    });
};



// ─────────────────────────────────────────────────────────────────────────────
// Build tab info from a flight object
// ─────────────────────────────────────────────────────────────────────────────
export const buildTabInfo = (flight) => {
    if (!flight) return null;
    const legs = flight.Segments[0];
    const first = legs[0];
    const last = legs[legs.length - 1];
    const nums = legs.map(l => `${l.Airline.AirlineCode}-${l.Airline.FlightNumber}`).join('/');
    const dep = new Date(first.Origin.DepTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const arr = new Date(last.Destination.ArrTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const date = new Date(first.Origin.DepTime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    return {
        code: first.Airline.AirlineCode,
        nums,
        from: first.Origin.Airport.CityCode || first.Origin.Airport.AirportCode,
        to: last.Destination.Airport.CityCode || last.Destination.Airport.AirportCode,
        dep, arr, date,
    };
};

// ─────────────────────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────────────────────
const IconCancel = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
    </svg>
);
const IconCalendar = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);
const IconSeat = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
    </svg>
);
const IconBag = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
);
const IconCabin = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
    </svg>
);
const IconMeal = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
    </svg>
);
const IconRupee = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <line x1="6" y1="3" x2="18" y2="3"/><line x1="6" y1="8" x2="18" y2="8"/><line x1="6" y1="13" x2="18" y2="21"/><path d="M6 8a6 6 0 0 0 0 5h6"/>
    </svg>
);
const IconRefund = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
    </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN MODAL COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const FareOptionsModal = ({ isOpen, onClose, outbound, returnFlight, navigate, fetchedFareData }) => {
    const [selectedOutId, setSelectedOutId] = useState(null);
    const [selectedRetId, setSelectedRetId] = useState(null);
    const [activeSegTab, setActiveSegTab] = useState(0);   // 0=outbound, 1=return
    const [mainTab, setMainTab]           = useState('FARES'); // 'FARES' | 'ITINERARY' | 'RULES'

    const isRoundTrip  = !!returnFlight;
    const quoteResults = fetchedFareData?.quoteData?.Response?.Results;
    const ruleData     = fetchedFareData?.ruleData;
    const ssrData      = fetchedFareData?.ssrData;
    const outUpsellFamilies = useMemo(() => extractUpsellFamilies(fetchedFareData?.upsellData?.outbound || fetchedFareData?.upsellData), [fetchedFareData]);
    const retUpsellFamilies = useMemo(() => extractUpsellFamilies(fetchedFareData?.upsellData?.return), [fetchedFareData]);

    const buildFallbackFamily = (flight, isRet) => {
        if (!flight) return null;
        const isRef = flight.IsRefundable;
        const rules = getSectorRules(null, quoteResults, ruleData, isRet ? 1 : 0, isRef);
        return {
            id: 1, name: 'Standard Fare', 
            price: flight.Fare?.PublishedFare || 0, 
            isRefundable: isRef,
            resultIndex: flight.ResultIndex,
            cancelTextOut: null, dateChangeTextOut: null,
            out: {
                cancel: rules.cancel, dateChange: rules.dateChange,
                baggage: getBaggage(null, quoteResults?.Segments?.[isRet ? 1 : 0]?.[0], ssrData?.Response?.Baggage?.[isRet ? 1 : 0]?.[0], flight.Segments?.[0]?.[0]),
                cabinBag: getCabin(null, quoteResults?.Segments?.[isRet ? 1 : 0]?.[0], flight.Segments?.[0]?.[0]),
                seat: getSeat(ssrData, isRet ? 1 : 0),
                meal: getMeal(ssrData, isRet ? 1 : 0),
            }
        };
    };

    const outFareFamilies = useMemo(() => {
        if (!outbound) return [];
        if (outUpsellFamilies.length === 0) return [buildFallbackFamily(outbound, false)];
        return buildFareFamilies({
            upsellFamilies: outUpsellFamilies,
            quoteResults, ruleData, ssrData, searchFlight: outbound, isRet: false,
            basePriceFallback: outbound.Fare?.PublishedFare || 0
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchedFareData, outbound, outUpsellFamilies]);

    const retFareFamilies = useMemo(() => {
        if (!isRoundTrip || !returnFlight) return [];
        if (retUpsellFamilies.length === 0) return [buildFallbackFamily(returnFlight, true)];
        return buildFareFamilies({
            upsellFamilies: retUpsellFamilies,
            quoteResults, ruleData, ssrData, searchFlight: returnFlight, isRet: true,
            basePriceFallback: returnFlight.Fare?.PublishedFare || 0
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchedFareData, returnFlight, retUpsellFamilies, isRoundTrip]);

    if (!isOpen || !outbound) return null;

    const cheapestOutId = outFareFamilies.reduce((min, f) => f.price < (outFareFamilies.find(x => x.id === min)?.price ?? Infinity) ? f.id : min, outFareFamilies[0]?.id);
    const cheapestRetId = isRoundTrip ? retFareFamilies.reduce((min, f) => f.price < (retFareFamilies.find(x => x.id === min)?.price ?? Infinity) ? f.id : min, retFareFamilies[0]?.id) : null;

    const activeOutId = selectedOutId ?? cheapestOutId;
    const activeRetId = selectedRetId ?? cheapestRetId;

    const selectedOut = outFareFamilies.find(f => f.id === activeOutId) || outFareFamilies[0];
    const selectedRet = isRoundTrip ? (retFareFamilies.find(f => f.id === activeRetId) || retFareFamilies[0]) : null;

    const activeFareFamilies = activeSegTab === 0 ? outFareFamilies : retFareFamilies;
    const activeSelectedId = activeSegTab === 0 ? activeOutId : activeRetId;
    const setActiveSelectedId = activeSegTab === 0 ? setSelectedOutId : setSelectedRetId;

    const totalPrice = selectedOut.price + (selectedRet?.price || 0);

    const outTab = buildTabInfo(outbound);
    const retTab = buildTabInfo(returnFlight);

    // ── Row definitions — all TBO API fields ──
    const ROWS = [
        {
            icon: <IconRefund />,
            label: 'Refundable',
            sub: null,
            alwaysShow: true,
            getText: (fare) => {
                if (fare.isRefundable === true)  return '✓ Refundable';
                if (fare.isRefundable === false) return '✗ Non Refundable';
                return '—';
            },
        },
        {
            icon: <IconCancel />,
            label: 'Cancellation',
            sub: 'Charges from departure',
            alwaysShow: true,
            renderCell: (fare) => {
                const txt = activeSegTab === 0
                    ? (fare.cancelTextOut || fare.out.cancel)
                    : (fare.cancelTextRet || fare.ret?.cancel);
                if (!txt) return null;
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {txt.split('\n').map((line, i) => {
                            const parts = line.split(':');
                            if (parts.length === 2) {
                                return (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e5e7eb', paddingBottom: '2px', fontSize: '12px' }}>
                                        <span style={{ color: '#475569' }}>{parts[0]}</span>
                                        <span style={{ fontWeight: '600', color: '#1e293b' }}>{parts[1]}</span>
                                    </div>
                                );
                            }
                            return <div key={i} style={{ fontSize: '12px', color: '#1e293b' }}>{line}</div>;
                        })}
                    </div>
                );
            },
            getText: (fare) => {
                const txt = activeSegTab === 0
                    ? (fare.cancelTextOut || fare.out.cancel)
                    : (fare.cancelTextRet || fare.ret?.cancel);
                return txt || '—';
            },
        },
        {
            icon: <IconCalendar />,
            label: 'Date Change',
            sub: 'Charges from departure',
            alwaysShow: true,
            renderCell: (fare) => {
                const txt = activeSegTab === 0
                    ? (fare.dateChangeTextOut || fare.out.dateChange)
                    : (fare.dateChangeTextRet || fare.ret?.dateChange);
                if (!txt) return null;
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {txt.split('\n').map((line, i) => {
                            const parts = line.split(':');
                            if (parts.length === 2) {
                                return (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e5e7eb', paddingBottom: '2px', fontSize: '12px' }}>
                                        <span style={{ color: '#475569' }}>{parts[0]}</span>
                                        <span style={{ fontWeight: '600', color: '#1e293b' }}>{parts[1]}</span>
                                    </div>
                                );
                            }
                            return <div key={i} style={{ fontSize: '12px', color: '#1e293b' }}>{line}</div>;
                        })}
                    </div>
                );
            },
            getText: (fare) => {
                const txt = activeSegTab === 0
                    ? (fare.dateChangeTextOut || fare.out.dateChange)
                    : (fare.dateChangeTextRet || fare.ret?.dateChange);
                return txt || '—';
            },
        },
        {
            icon: <IconBag />,
            label: 'Check-in Baggage',
            sub: 'Per passenger',
            alwaysShow: false,
            getText: (fare) => {
                const v = activeSegTab === 0 ? fare.out.baggage : fare.ret?.baggage;
                return v || null;
            },
        },
        {
            icon: <IconCabin />,
            label: 'Cabin Baggage',
            sub: 'Per passenger',
            alwaysShow: false,
            getText: (fare) => {
                const v = activeSegTab === 0 ? fare.out.cabinBag : fare.ret?.cabinBag;
                return v || null;
            },
        },
        {
            icon: <IconSeat />,
            label: 'Seat Selection',
            sub: null,
            alwaysShow: false,
            getText: (fare) => {
                const v = activeSegTab === 0 ? fare.out.seat : fare.ret?.seat;
                if (!v) return null;
                if (v === 'Free') return 'Standard: FREE\nXL seats: FREE';
                return 'Standard: Chargeable\nXL seats: Chargeable';
            },
        },
        {
            icon: <IconMeal />,
            label: 'Meals',
            sub: null,
            alwaysShow: false,
            getText: (fare) => {
                const v = activeSegTab === 0 ? fare.out.meal : fare.ret?.meal;
                if (!v) return null;
                if (v === 'Free') return 'Complimentary Meal';
                if (v === 'Available') return 'Available (Chargeable)';
                return 'Chargeable';
            },
        },
        {
            icon: <IconRupee />,
            label: 'Base Fare',
            sub: 'Excl. taxes & fees',
            alwaysShow: true,
            getText: (fare) => {
                if (!fare.baseFare) return '—';
                return `₹${fare.baseFare.toLocaleString('en-IN')}`;
            },
        },
        {
            icon: <IconRupee />,
            label: 'Taxes & Fees',
            sub: null,
            alwaysShow: true,
            getText: (fare) => {
                if (!fare.tax) return '—';
                return `₹${fare.tax.toLocaleString('en-IN')}`;
            },
        },
        {
            icon: <IconRupee />,
            label: 'Fare Breakdown',
            sub: 'Per passenger type',
            alwaysShow: false,
            renderCell: (fare) => {
                const bd = fare.fareBreakdown;
                if (!bd || bd.length === 0) return null;
                const PAX = { 1: 'Adult', 2: 'Child', 3: 'Infant' };
                return bd.map((b, i) => (
                    <div key={i} style={{ marginBottom: i < bd.length - 1 ? '6px' : 0 }}>
                        <div style={{ fontWeight: '600', fontSize: '12px', color: '#444' }}>
                            {PAX[b.PassengerType] || `Pax ${b.PassengerType}`} × {b.PassengerCount || 1}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>Base: ₹{Math.round(b.BaseFare || 0).toLocaleString('en-IN')}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>Tax: ₹{Math.round(b.Tax || 0).toLocaleString('en-IN')}</div>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#222' }}>Total: ₹{Math.round((b.BaseFare || 0) + (b.Tax || 0)).toLocaleString('en-IN')}</div>
                    </div>
                ));
            },
            getText: (fare) => {
                const bd = fare.fareBreakdown;
                if (!bd || bd.length === 0) return null;
                return '__HAS_DATA__';
            },
        },
    ];

    // Show: always-show rows + rows that have data in at least one fare
    const visibleRows = ROWS.filter(r => r.alwaysShow || activeFareFamilies.some(f => r.getText(f)));

    const LEFT_W = 170;
    const COL_W  = Math.max(200, Math.floor((860 - LEFT_W) / activeFareFamilies.length));

    const handleContinue = () => {
        
        let prefetchedQuote = fetchedFareData?.quoteData;

        if (isRoundTrip && prefetchedQuote && selectedOut?.prefetchedQuote && selectedRet?.prefetchedQuote) {
            // Re-merge the selected out and ret quote data for the checkout page
            prefetchedQuote = {
                Response: {
                    ...prefetchedQuote.Response,
                    Results: {
                        ...prefetchedQuote.Response.Results,
                        ResultIndex: `${selectedOut.resultIndex},${selectedRet.resultIndex}`,
                        Fare: {
                            ...prefetchedQuote.Response.Results.Fare,
                            PublishedFare: totalPrice,
                            BaseFare: selectedOut.baseFare + selectedRet.baseFare,
                            Tax: selectedOut.tax + selectedRet.tax,
                        },
                        Segments: [
                            selectedOut.prefetchedQuote.Response.Results.Segments[0],
                            selectedRet.prefetchedQuote.Response.Results.Segments[0]
                        ].filter(Boolean)
                    }
                }
            };
        } else if (selectedOut?.prefetchedQuote) {
            prefetchedQuote = selectedOut.prefetchedQuote;
        }

        const statePayload = {
            TraceId: outbound.TraceId,
            ResultIndex: isRoundTrip ? `${selectedOut?.resultIndex},${selectedRet?.resultIndex}` : selectedOut?.resultIndex,
            fareFamilyId: selectedOut?.id,
            fareFamilyName: selectedOut?.name,
            totalPrice,
            prefetchedQuote,
            prefetchedSsr: fetchedFareData?.ssrData, // keep existing ssrData
            // Add exact split sector data for round trips
            outboundFareFamily: selectedOut?.id,
            returnFareFamily: selectedRet?.id,
        };
        
        navigate('/flight-checkout', { state: statePayload });
    };

    return (
        <div
            onClick={e => e.target === e.currentTarget && onClose()}
            className="fo-overlay"
        >
            <style>{`
                .fo-overlay { position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.55); display: flex; align-items: center; justify-content: center; padding: 12px; }
                .fo-modal { background:#fff; width:100%; max-width:980px; border-radius:4px; display:flex; flex-direction:column; max-height:92vh; overflow:hidden; box-shadow:0 24px 64px rgba(0,0,0,0.28); font-family:'Segoe UI','Inter',sans-serif; }
                .fo-tab { display:flex; align-items:center; gap:10px; padding:12px 20px 10px; cursor:pointer; border-bottom:3px solid transparent; flex-shrink:0; transition:border-color 0.15s; }
                .fo-tab.active { border-bottom-color:#d81b21; }
                .fo-tab-code { font-size:13px; font-weight:700; color:#222; }
                .fo-tab-route { font-size:12px; color:#555; }
                .fo-col-head { padding:14px 16px 12px; border-bottom:1px solid #e8e8e8; cursor:pointer; transition:background 0.15s; user-select:none; }
                .fo-col-head:hover { background:#fafafa; }
                .fo-cell { padding:14px 16px; border-bottom:1px solid #eee; vertical-align:top; }
                .fo-left-cell { padding:14px 16px; border-bottom:1px solid #eee; display:flex; align-items:flex-start; gap:10px; }
                .fo-radio { width:16px; height:16px; border-radius:50%; border:2px solid #ccc; flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:border-color 0.15s; margin-top:2px; }
                .fo-radio.checked { border-color:#15803d; border-width:5px; }
                .fo-col.selected { border:2px solid #15803d !important; }
                .fo-continue-btn { background:#d81b21; color:#fff; border:none; padding:10px 32px; border-radius:4px; font-size:15px; font-weight:700; cursor:pointer; transition:background 0.2s; font-family:inherit; white-space:nowrap; }
                .fo-continue-btn:hover { background:#b81218; }
                @media(max-width: 768px) {
                    .fo-overlay { padding: 0; }
                    .fo-modal { max-height: 100vh; height: 100vh; border-radius: 0; }
                }
            `}</style>

            <div className="fo-modal">

                {/* ── HEADER ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px 0', flexShrink: 0, borderBottom: '1px solid #e8e8e8' }}>
                    <span style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a' }}>Fare Options</span>
                    <button
                        onClick={onClose}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', color: '#666', lineHeight: 1, padding: '0 0 8px', fontWeight: '300' }}
                        aria-label="Close"
                    >×</button>
                </div>

                {/* ── MAIN TABS: Fare Options | Flight Details | Fare Rules ── */}
                <div style={{ display: 'flex', borderBottom: '1px solid #e8e8e8', background: '#fff', flexShrink: 0, padding: '0 4px' }}>
                    {[
                        { key: 'FARES',     label: 'Fare Options' },
                        { key: 'ITINERARY', label: 'Flight Details' },
                        { key: 'RULES',     label: 'Fare Rules' },
                    ].map(({ key, label }) => (
                        <div
                            key={key}
                            onClick={() => setMainTab(key)}
                            style={{ padding: '12px 20px', fontSize: '13px', fontWeight: '700', color: mainTab === key ? '#d81b21' : '#555', borderBottom: mainTab === key ? '3px solid #d81b21' : '3px solid transparent', cursor: 'pointer', transition: 'color 0.15s', whiteSpace: 'nowrap' }}
                        >
                            {label}
                        </div>
                    ))}
                </div>

                {/* ── FLIGHT SEGMENT TABS (only in Fare Options tab) ── */}
                {mainTab === 'FARES' && (
                <div style={{ display: 'flex', borderBottom: '1px solid #e8e8e8', background: '#fafafa', flexShrink: 0, overflowX: 'auto' }}>
                    {[{ tab: outTab, idx: 0 }, isRoundTrip && retTab ? { tab: retTab, idx: 1 } : null].filter(Boolean).map(({ tab, idx }) => (
                        <div
                            key={idx}
                            className={`fo-tab${activeSegTab === idx ? ' active' : ''}`}
                            onClick={() => setActiveSegTab(idx)}
                        >
                            <img
                                src={`https://pics.avs.io/30/30/${tab.code}.png`}
                                alt={tab.code}
                                style={{ width: '28px', height: '28px', objectFit: 'contain', flexShrink: 0 }}
                                onError={e => e.target.style.display = 'none'}
                            />
                            <div>
                                <div className="fo-tab-code">{tab.nums}</div>
                                <div className="fo-tab-route">
                                    {tab.from} → {tab.to} &nbsp; {tab.date} {tab.dep} - {tab.arr}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                )}

                {/* ── FARE OPTIONS TABLE ── */}
                {mainTab === 'FARES' && (
                <div style={{ flex: 1, overflowY: 'auto', overflowX: 'auto', minHeight: 0 }}>
                    <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: `${LEFT_W + COL_W * activeFareFamilies.length}px`, tableLayout: 'fixed' }}>

                        {/* COLUMN HEADERS — price + fare name + radio */}
                        <thead>
                            <tr>
                                {/* Left corner: "Services" */}
                                <th style={{ width: `${LEFT_W}px`, padding: '14px 16px 12px', background: '#fff', borderBottom: '1px solid #e8e8e8', textAlign: 'left', fontWeight: '600', fontSize: '15px', color: '#222', verticalAlign: 'bottom' }}>
                                    Services
                                </th>

                                {activeFareFamilies.map((fare) => {
                                    const isActive = fare.id === activeSelectedId;
                                    return (
                                        <th
                                            key={fare.id}
                                            className={`fo-col-head${isActive ? ' fo-col' : ''}`}
                                            onClick={() => setActiveSelectedId(fare.id)}
                                            style={{
                                                width: `${COL_W}px`,
                                                background: '#fff',
                                                border: isActive ? '2px solid #15803d' : '1px solid #e8e8e8',
                                                borderBottom: isActive ? '2px solid #15803d' : '1px solid #e8e8e8',
                                                textAlign: 'left',
                                                fontWeight: 'normal',
                                                verticalAlign: 'top',
                                            }}
                                        >
                                            {/* Radio + price */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                <div className={`fo-radio${isActive ? ' checked' : ''}`} />
                                                <span style={{ fontSize: '22px', fontWeight: '800', color: '#222', letterSpacing: '-0.5px' }}>
                                                    ₹{fare.price.toLocaleString('en-IN')}
                                                </span>
                                            </div>
                                            {/* Fare name */}
                                            <div style={{ fontSize: '12px', color: '#666', fontWeight: '400', paddingLeft: '24px' }}>
                                                {fare.name}
                                            </div>
                                            {/* Base + Tax sub-line */}
                                            {(fare.baseFare > 0 || fare.tax > 0) && (
                                                <div style={{ fontSize: '11px', color: '#999', paddingLeft: '24px', marginTop: '3px' }}>
                                                    Base ₹{fare.baseFare?.toLocaleString('en-IN') || '—'}
                                                    &nbsp;+&nbsp;
                                                    Tax ₹{fare.tax?.toLocaleString('en-IN') || '—'}
                                                </div>
                                            )}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>

                        {/* BODY — service rows */}
                        <tbody>
                            {visibleRows.map((row, ri) => (
                                <tr key={ri}>
                                    {/* Left label */}
                                    <td className="fo-left-cell">
                                        {row.icon}
                                        <div>
                                            <div style={{ fontSize: '13px', fontWeight: '600', color: '#222' }}>{row.label}</div>
                                            {row.sub && <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{row.sub}</div>}
                                        </div>
                                    </td>

                                    {/* Fare columns */}
                                    {activeFareFamilies.map((fare) => {
                                        const isActive = fare.id === activeSelectedId;
                                        const text = row.getText(fare);
                                        return (
                                            <td
                                                key={fare.id}
                                                className="fo-cell"
                                                onClick={() => setActiveSelectedId(fare.id)}
                                                style={{
                                                    border: isActive ? '2px solid #15803d' : '1px solid #eee',
                                                    borderTop: 'none',
                                                    cursor: 'pointer',
                                                    verticalAlign: 'top',
                                                }}
                                            >
                                                {/* Use renderCell for rich JSX content (e.g. FareBreakdown) */}
                                                {row.renderCell ? (
                                                    <div style={{ fontSize: '13px', color: '#222', lineHeight: '1.55' }}>
                                                        {row.renderCell(fare) || <span style={{ color: '#bbb' }}>—</span>}
                                                    </div>
                                                ) : (
                                                    <div style={{
                                                        fontSize: '13px',
                                                        lineHeight: '1.55',
                                                        whiteSpace: 'pre-line',
                                                        color: row.label === 'Refundable'
                                                            ? (text === '✓ Refundable' ? '#15803d' : text === '✗ Non Refundable' ? '#dc2626' : '#555')
                                                            : '#222',
                                                        fontWeight: row.label === 'Refundable' ? '600' : 'normal',
                                                    }}>
                                                        {text || <span style={{ color: '#bbb' }}>—</span>}
                                                    </div>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                )}

                {/* ── FLIGHT DETAILS (ITINERARY) ── */}
                {mainTab === 'ITINERARY' && (
                    <div style={{ flex: 1, overflowY: 'auto', padding: '20px', background: '#fafbfc', minHeight: 0 }}>
                        {[
                            { segs: quoteResults?.Segments?.[0] || outbound?.Segments?.[0], label: isRoundTrip ? 'Onward Flight' : 'Flight Details' },
                            isRoundTrip ? { segs: quoteResults?.Segments?.[1] || returnFlight?.Segments?.[0], label: 'Return Flight' } : null,
                        ].filter(Boolean).map(({ segs, label }) =>
                            segs && segs.length > 0 ? (
                                <div key={label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '16px', overflow: 'hidden' }}>
                                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #e8e8e8', fontWeight: '700', fontSize: '13px', color: '#333', background: '#f8f9fa' }}>{label}</div>
                                    {segs.map((leg, li) => {
                                        const layMs = li > 0 ? new Date(leg.Origin.DepTime) - new Date(segs[li-1].Destination.ArrTime) : 0;
                                        const durStr = `${Math.floor(leg.Duration/60)}h ${leg.Duration%60}m`;
                                        const layStr = li > 0 ? `${Math.floor(layMs/3600000)}h ${Math.floor((layMs%3600000)/60000)}m` : '';
                                        const dep = new Date(leg.Origin.DepTime);
                                        const arr = new Date(leg.Destination.ArrTime);
                                        return (
                                            <div key={li}>
                                                {li > 0 && (
                                                    <div style={{ background: '#fff8e1', color: '#b45309', padding: '6px 16px', fontSize: '12px', fontWeight: '600' }}>
                                                        Layover: {layStr} in {leg.Origin.Airport.CityName}
                                                    </div>
                                                )}
                                                <div style={{ padding: '14px 16px', display: 'flex', gap: '16px', alignItems: 'flex-start', borderBottom: li < segs.length-1 ? '1px solid #f0f0f0' : 'none' }}>
                                                    {/* Airline info */}
                                                    <div style={{ minWidth: '140px' }}>
                                                        <div style={{ fontWeight: '700', fontSize: '13px', color: '#222' }}>{leg.Airline.AirlineName}</div>
                                                        <div style={{ fontSize: '12px', color: '#666' }}>{leg.Airline.AirlineCode}-{leg.Airline.FlightNumber}</div>
                                                        {leg.Craft && <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>{leg.Craft}</div>}
                                                        <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
                                                            {leg.CabinClass === 2 ? 'Economy' : leg.CabinClass === 3 ? 'Premium Economy' : leg.CabinClass === 4 ? 'Business' : 'First'}
                                                        </div>
                                                    </div>
                                                    {/* Route timeline */}
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                                                            <span style={{ fontSize: '18px', fontWeight: '800', color: '#111' }}>{dep.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',hour12:false})}</span>
                                                            <span style={{ fontSize: '12px', color: '#666' }}>{leg.Origin.Airport.CityName} ({leg.Origin.Airport.AirportCode})</span>
                                                        </div>
                                                        <div style={{ fontSize: '11px', color: '#888', marginBottom: '6px' }}>{dep.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})} · {leg.Origin.Airport.AirportName}</div>
                                                        <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '6px', paddingLeft: '4px' }}>── {durStr} ──</div>
                                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                                                            <span style={{ fontSize: '18px', fontWeight: '800', color: '#111' }}>{arr.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',hour12:false})}</span>
                                                            <span style={{ fontSize: '12px', color: '#666' }}>{leg.Destination.Airport?.CityName} ({leg.Destination.Airport?.AirportCode})</span>
                                                        </div>
                                                        <div style={{ fontSize: '11px', color: '#888' }}>{arr.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})} · {leg.Destination.Airport?.AirportName}</div>
                                                    </div>
                                                    {/* Baggage */}
                                                    <div style={{ minWidth: '110px', borderLeft: '1px solid #eee', paddingLeft: '14px', fontSize: '12px', color: '#444' }}>
                                                        <div style={{ fontWeight: '700', marginBottom: '6px', fontSize: '11px', color: '#888', textTransform: 'uppercase' }}>Baggage</div>
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

                {/* ── FARE RULES ── */}
                {mainTab === 'RULES' && (
                    <div style={{ flex: 1, overflowY: 'auto', padding: '20px', background: '#fafbfc', minHeight: 0 }}>
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

                {/* ── FOOTER ── */}
                <div style={{ flexShrink: 0, borderTop: '1px solid #e8e8e8', background: '#fff', padding: '10px 20px' }}>
                    {/* Disclaimer */}
                    <div style={{ fontSize: '12px', color: '#555', marginBottom: '10px' }}>
                        <strong>Important:</strong> Details are based on information provided by the airline. Fees mentioned apply per traveller and do not include the service fee.
                    </div>
                    {/* Price + Continue */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '24px' }}>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '20px', fontWeight: '800', color: '#1a1a1a' }}>
                                ₹{totalPrice.toLocaleString('en-IN')}
                            </span>
                            <span style={{ fontSize: '13px', color: '#666', marginLeft: '4px' }}>/adult</span>
                        </div>
                        <button className="fo-continue-btn" onClick={handleContinue}>
                            Continue
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FareOptionsModal;
