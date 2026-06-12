import React, { useState, useEffect, useRef } from 'react';
import { Plane } from 'lucide-react';
import axios from 'axios';

// Ensure the backend API URL is configured or default to local backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8009/api';

const DEFAULT_AIRPORTS = [
  { AIRPORTCODE: 'DEL', CITYNAME: 'New Delhi', AIRPORTNAME: 'Indira Gandhi International Airport', COUNTRYNAME: 'India' },
  { AIRPORTCODE: 'BOM', CITYNAME: 'Mumbai', AIRPORTNAME: 'Chhatrapati Shivaji International Airport', COUNTRYNAME: 'India' },
  { AIRPORTCODE: 'BLR', CITYNAME: 'Bengaluru', AIRPORTNAME: 'Kempegowda International Airport', COUNTRYNAME: 'India' },
  { AIRPORTCODE: 'HYD', CITYNAME: 'Hyderabad', AIRPORTNAME: 'Rajiv Gandhi International Airport', COUNTRYNAME: 'India' },
  { AIRPORTCODE: 'CCU', CITYNAME: 'Kolkata', AIRPORTNAME: 'Netaji Subhas Chandra Bose International Airport', COUNTRYNAME: 'India' },
  { AIRPORTCODE: 'DXB', CITYNAME: 'Dubai', AIRPORTNAME: 'Dubai International Airport', COUNTRYNAME: 'UAE' },
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
        const response = await axios.get(`${API_BASE_URL}/airports/search`, {
          params: { q: searchQuery }
        });
        if (response.data && response.data.success) {
          setResults(response.data.data);
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
      code: airport.AIRPORTCODE,
      city: airport.CITYNAME,
      name: airport.AIRPORTNAME,
      country: airport.COUNTRYNAME
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
                <div key={ap.AIRPORTCODE} className="ms-dropdown-item" onClick={() => handleSelect(ap)}>
                  <Plane size={15} color="#888" style={{ flexShrink: 0 }} />
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ap.CITYNAME}, {ap.COUNTRYNAME}
                    </div>
                    <div style={{ fontSize: '11px', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ap.AIRPORTNAME}
                    </div>
                  </div>
                  <div style={{ marginLeft: 'auto', fontWeight: 700, color: '#aaa', fontSize: '12px', flexShrink: 0 }}>
                    {ap.AIRPORTCODE}
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
