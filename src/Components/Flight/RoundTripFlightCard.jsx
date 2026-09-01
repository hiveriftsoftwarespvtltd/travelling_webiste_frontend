import React, { useState } from 'react';

function AirlineLogo({ code, name }) {
    const [errored, setErrored] = useState(false);
    const logoUrl = `https://pics.avs.io/60/60/${code}.png`;
    return (
        <div style={{ width: '28px', height: '28px', background: '#f5f8ff', borderRadius: '6px', border: '1px solid #e8edf2', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
            {!errored
                ? <img src={logoUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '2px' }} onError={() => setErrored(true)} />
                : <span style={{ fontSize: '9px', fontWeight: '800', color: '#d81b21', textAlign: 'center' }}>{code}</span>
            }
        </div>
    );
}

function RoundTripFlightCard({ flight, isSelected, onSelect, hidePrice = false }) {
    const fare = flight.Fare;
    const first = flight.Segments[0][0];
    const last = flight.Segments[0][flight.Segments[0].length - 1];
    const airline = first.Airline;
    const stops = flight.Segments[0].length - 1;
    const totalDur = flight.Segments[0].reduce((a, leg, i) => a + leg.Duration + (i > 0 ? Math.max(0, (new Date(leg.Origin.DepTime) - new Date(flight.Segments[0][i - 1].Destination.ArrTime)) / 60000) : 0), 0);

    const formatTime = (d) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    const formatDuration = (m) => `${Math.floor(m / 60)}h ${m % 60}m`;

    return (
        <>
        <style>{`
            .rtc-row { display: flex; align-items: center; }
            .rtc-airline { width: 100px; display: flex; flex-direction: column; gap: 4px; }
            .rtc-route { flex: 1; display: flex; align-items: center; justify-content: space-between; padding: 0 10px; }
            .rtc-price { width: 70px; text-align: right; }
            @media(max-width: 1024px) {
                .rtc-row { flex-wrap: wrap; align-items: flex-start; gap: 8px; }
                .rtc-airline { width: auto; flex-direction: row; align-items: center; gap: 10px; flex: 1; }
                .rtc-route { width: 100%; padding: 0; margin-top: 4px; }
                .rtc-price { width: 100%; text-align: right; border-top: 1px solid #e8edf2; padding-top: 8px; }
            }
        `}</style>
        <div
            onClick={() => onSelect(flight)}
            className="rtc-row"
            style={{ 
                background: isSelected ? '#f5f8ff' : '#fff', 
                borderRadius: '8px', 
                border: isSelected ? '1px solid #d81b21' : '1px solid #e4e7ed', 
                marginBottom: '10px', 
                padding: '12px',
                cursor: 'pointer',
                boxShadow: isSelected ? '0 2px 8px rgba(216, 27, 33, 0.15)' : '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'all 0.2s',
                fontFamily: "'Outfit','Inter',sans-serif"
            }}
        >
            {/* Radio Button */}
            <div style={{ marginRight: '12px', display: 'flex', alignItems: 'center' }}>
                <div style={{
                    width: '18px', height: '18px', borderRadius: '50%', border: isSelected ? '5px solid #d81b21' : '1px solid #c5d0db',
                    background: '#fff', transition: 'all 0.2s'
                }} />
            </div>

            {/* Airline Info */}
            <div className="rtc-airline">
                <AirlineLogo code={airline.AirlineCode} name={airline.AirlineName} />
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#1a1a2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{airline.AirlineName}</div>
                <div style={{ fontSize: '10px', color: '#687b8f' }}>{airline.AirlineCode}-{airline.FlightNumber}</div>
            </div>

            {/* Route & Times */}
            <div className="rtc-route">
                {/* Dep */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#1a1a2e', lineHeight: 1 }}>{formatTime(first.Origin.DepTime)}</div>
                    <div style={{ fontSize: '11px', color: '#d81b21', marginTop: '4px', fontWeight: '700' }}>{formatDate(first.Origin.DepTime)}</div>
                    <div style={{ fontSize: '11px', color: '#687b8f', marginTop: '2px' }}>{first.Origin.Airport.CityCode}</div>
                </div>

                {/* Duration */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 8px' }}>
                    <div style={{ fontSize: '10px', fontWeight: '600', color: '#687b8f', marginBottom: '4px' }}>{formatDuration(Math.round(totalDur))}</div>
                    <div style={{ width: '100%', height: '1px', background: '#c5d0db', position: 'relative' }}>
                        {stops > 0 && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b' }} />}
                    </div>
                    <div style={{ fontSize: '9px', fontWeight: '700', color: stops === 0 ? '#16a34a' : '#d97706', marginTop: '3px' }}>
                        {stops === 0 ? 'Non Stop' : `${stops} Stop${stops > 1 ? 's' : ''}`}
                    </div>
                </div>

                {/* Arr */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#1a1a2e', lineHeight: 1 }}>{formatTime(last.Destination.ArrTime)}</div>
                    <div style={{ fontSize: '11px', color: '#d81b21', marginTop: '4px', fontWeight: '700' }}>{formatDate(last.Destination.ArrTime)}</div>
                    <div style={{ fontSize: '11px', color: '#687b8f', marginTop: '2px' }}>{last.Destination.Airport.CityCode}</div>
                </div>
            </div>

            {/* Price */}
            {!hidePrice && (
                <div className="rtc-price">
                    <div style={{ fontSize: '15px', fontWeight: '800', color: '#1a1a2e' }}>₹{Math.round(fare.OfferedFare).toLocaleString('en-IN')}</div>
                </div>
            )}
        </div>
        </>
    );
}

export default RoundTripFlightCard;
