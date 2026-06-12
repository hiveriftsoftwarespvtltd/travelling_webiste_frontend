import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Building2, Clock, Loader2, X } from 'lucide-react';

const HOTEL_API = process.env.REACT_APP_HOTEL_API_BASE_URL || 'http://localhost:8009/api/hotel';

// Basic debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function HotelSearchAutocomplete({ onSelect, initialSelection }) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  
  const [results, setResults] = useState({ cities: [], hotels: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  
  const wrapperRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('hotel_recent_searches');
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch (e) {}
  }, []);

  // Handle outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [wrapperRef]);

  // Set initial value if provided
  useEffect(() => {
    if (initialSelection && !query) {
      if (initialSelection.type === 'city') {
        setQuery(initialSelection.name);
      } else if (initialSelection.type === 'hotel') {
        setQuery(initialSelection.name);
      } else {
        setQuery(initialSelection.city || '');
      }
    }
  }, [initialSelection]);

  // Fetch suggestions
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults({ cities: [], hotels: [] });
      setIsLoading(false);
      return;
    }

    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${HOTEL_API}/search-suggestions?q=${encodeURIComponent(debouncedQuery)}`);
        const data = await res.json();
        setResults({ cities: data.cities || [], hotels: data.hotels || [] });
      } catch (err) {
        console.error("Failed to fetch suggestions:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const handleSelect = (item, type) => {
    // Add to recent searches
    const newItem = { ...item, _type: type };
    const updatedRecents = [newItem, ...recentSearches.filter(
      r => r.CityCode !== item.CityCode || (r.HotelCode !== item.HotelCode)
    )].slice(0, 5);
    
    setRecentSearches(updatedRecents);
    try { localStorage.setItem('hotel_recent_searches', JSON.stringify(updatedRecents)); } catch (e) {}

    setQuery(type === 'city' ? item.CityName : item.HotelName);
    setIsOpen(false);
    
    if (onSelect) {
      onSelect(newItem);
    }
  };

  const clearRecents = (e) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem('hotel_recent_searches');
  };

  const removeRecent = (e, index) => {
    e.stopPropagation();
    const updated = [...recentSearches];
    updated.splice(index, 1);
    setRecentSearches(updated);
    localStorage.setItem('hotel_recent_searches', JSON.stringify(updated));
  };

  const popularDestinations = [
    { CityCode: '119805', CityName: 'Goa, India', CountryCode: 'IN', _type: 'city' },
    { CityCode: '144306', CityName: 'Mumbai, India', CountryCode: 'IN', _type: 'city' },
    { CityCode: '130443', CityName: 'New Delhi, India', CountryCode: 'IN', _type: 'city' },
    { CityCode: '144092', CityName: 'Bangkok, Thailand', CountryCode: 'TH', _type: 'city' },
    { CityCode: '115936', CityName: 'Dubai, UAE', CountryCode: 'AE', _type: 'city' },
    { CityCode: '110670', CityName: 'Bali, Indonesia', CountryCode: 'ID', _type: 'city' }
  ];

  return (
    <div className="sf-input-col" style={{ flex: 1.3, position: 'relative' }} ref={wrapperRef}>
      <span className="sf-label-text">City, Property Name or Location</span>
      
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder="Where are you going?"
        className="sf-autocomplete-input"
        style={{
          width: '100%', border: 'none', outline: 'none', background: 'transparent',
          fontSize: '20px', fontWeight: '800', color: '#111', padding: '0', margin: '4px 0 2px 0'
        }}
      />
      
      {isOpen && (
        <div className="sf-dropdown" style={{ left: 0, right: 'auto', width: '380px', maxHeight: '400px', overflowY: 'auto' }}>
          
          {/* If typing, show results */}
          {debouncedQuery.trim() ? (
            <>
              {isLoading && (
                <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                  <Loader2 size={24} className="fa-spin" style={{ margin: '0 auto', animation: 'spin 1s linear infinite' }} />
                  <div style={{ fontSize: '13px', marginTop: '8px' }}>Searching...</div>
                </div>
              )}

              {!isLoading && results.cities.length === 0 && results.hotels.length === 0 && (
                <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                  No matches found for "{query}"
                </div>
              )}

              {!isLoading && results.cities.length > 0 && (
                <div className="sf-dropdown-group">
                  <div className="sf-dropdown-group-title" style={{ padding: '8px 15px', background: '#f8f9fa', fontSize: '12px', fontWeight: '700', color: '#555', borderBottom: '1px solid #eee' }}>
                    CITIES
                  </div>
                  {results.cities.map(city => (
                    <div key={city.CityCode} className="sf-dropdown-item" onClick={() => handleSelect(city, 'city')}>
                      <MapPin className="sf-dropdown-icon" size={16} />
                      <div className="sf-dropdown-info">
                        <div className="sf-dropdown-city">{city.CityName}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isLoading && results.hotels.length > 0 && (
                <div className="sf-dropdown-group">
                  <div className="sf-dropdown-group-title" style={{ padding: '8px 15px', background: '#f8f9fa', fontSize: '12px', fontWeight: '700', color: '#555', borderBottom: '1px solid #eee' }}>
                    HOTELS
                  </div>
                  {results.hotels.map(hotel => (
                    <div key={hotel.HotelCode} className="sf-dropdown-item" onClick={() => handleSelect(hotel, 'hotel')}>
                      <Building2 className="sf-dropdown-icon" size={16} />
                      <div className="sf-dropdown-info">
                        <div className="sf-dropdown-city">{hotel.HotelName}</div>
                        <div className="sf-dropdown-name">{hotel.CityName || 'Property'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Empty state: Recent Searches & Popular Destinations */
            <>
              {recentSearches.length > 0 && (
                <div className="sf-dropdown-group" style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 15px', background: '#f8f9fa', borderBottom: '1px solid #eee' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#555' }}>RECENT SEARCHES</span>
                    <span style={{ fontSize: '12px', color: '#d81b21', cursor: 'pointer', fontWeight: '600' }} onClick={clearRecents}>Clear All</span>
                  </div>
                  {recentSearches.map((item, idx) => (
                    <div key={idx} className="sf-dropdown-item" style={{ position: 'relative' }} onClick={() => handleSelect(item, item._type)}>
                      <Clock className="sf-dropdown-icon" size={16} style={{ color: '#888' }} />
                      <div className="sf-dropdown-info">
                        <div className="sf-dropdown-city">{item._type === 'city' ? item.CityName : item.HotelName}</div>
                        <div className="sf-dropdown-name">{item._type === 'city' ? 'City' : 'Property'}</div>
                      </div>
                      <X size={14} style={{ color: '#ccc', cursor: 'pointer', position: 'absolute', right: '15px' }} onClick={(e) => removeRecent(e, idx)} />
                    </div>
                  ))}
                </div>
              )}

              <div className="sf-dropdown-group">
                <div className="sf-dropdown-group-title" style={{ padding: '8px 15px', background: '#f8f9fa', fontSize: '12px', fontWeight: '700', color: '#555', borderBottom: '1px solid #eee' }}>
                  POPULAR DESTINATIONS
                </div>
                {popularDestinations.map(dest => (
                  <div key={dest.CityCode} className="sf-dropdown-item" onClick={() => handleSelect(dest, 'city')}>
                    <MapPin className="sf-dropdown-icon" size={16} color="#d81b21" />
                    <div className="sf-dropdown-info">
                      <div className="sf-dropdown-city">{dest.CityName}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      )}
      
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
