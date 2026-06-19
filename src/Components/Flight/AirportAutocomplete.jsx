import React, { useState, useEffect, useRef } from 'react';
import { Plane } from 'lucide-react';
import axios from 'axios';

// Ensure the backend API URL is configured or default to local backend
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8009/api';

const DEFAULT_AIRPORTS = [
  { code: 'DEL', city: 'New Delhi', name: 'Indira Gandhi International Airport', country: 'India' },
  { code: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji International Airport', country: 'India' },
  { code: 'BLR', city: 'Bengaluru', name: 'Kempegowda International Airport', country: 'India' },
  { code: 'HYD', city: 'Hyderabad', name: 'Rajiv Gandhi International Airport', country: 'India' },
  { code: 'CCU', city: 'Kolkata', name: 'Netaji Subhas Chandra Bose International Airport', country: 'India' },
  { code: 'DXB', city: 'Dubai', name: 'Dubai International Airport', country: 'UAE' },
];

export default function AirportAutocomplete({ 
  label, 
  value, 
  onChange, 
  placeholder = "Search city or airport",
  onClick 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState(DEFAULT_AIRPORTS);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!isOpen) return;

    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length === 0) {
        setResults(DEFAULT_AIRPORTS);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const flightApiBase = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8009/api';
        const response = await fetch(`${flightApiBase}/airports/search?q=${searchQuery}`);
        const data = await response.json();
        if (data && data.success) {
          const mapped = data.data.map(ap => ({
            code: ap.AIRPORTCODE,
            city: ap.CITYNAME,
            name: ap.AIRPORTNAME,
            country: ap.COUNTRYNAME
          }));
          setResults(mapped);
        }
      } catch (error) {
        console.error("Error fetching airports:", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, isOpen]);

  const handleSelect = (airport) => {
    onChange({
      code: airport.code,
      city: airport.city,
      name: airport.name,
      country: airport.country
    });
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="ms-col" onClick={(e) => { 
        if (onClick) onClick(e);
        setIsOpen(true);
      }} 
      ref={dropdownRef}
    >
      <div className="ms-label">{label}</div>
      <div className="ms-val">{value?.city ? `${value.city} (${value.code})` : 'Select Airport'}</div>
      
      {isOpen && (
        <div className="ms-dropdown" onClick={e => e.stopPropagation()}>
          <div className="ms-dropdown-search">
            <input
              type="text"
              placeholder={placeholder}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
          <div className="ms-dropdown-list">
            {loading ? (
              <div style={{ padding: '10px', fontSize: '13px', color: '#888', textAlign: 'center' }}>Loading...</div>
            ) : results.length > 0 ? (
              results.map(ap => (
                <div key={ap.code} className="ms-dropdown-item" onClick={() => handleSelect(ap)}>
                  <Plane size={15} color="#888" style={{ flexShrink: 0 }} />
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ap.city}, {ap.country}
                    </div>
                    <div style={{ fontSize: '11px', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ap.name}
                    </div>
                  </div>
                  <div style={{ marginLeft: 'auto', fontWeight: 700, color: '#aaa', fontSize: '12px', flexShrink: 0 }}>
                    {ap.code}
                  </div>
                </div>
              ))
            ) : searchQuery.length > 0 ? (
              <div style={{ padding: '10px', fontSize: '13px', color: '#888', textAlign: 'center' }}>No airports found</div>
            ) : (
              <div style={{ padding: '10px', fontSize: '13px', color: '#888', textAlign: 'center' }}>Type to search</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
