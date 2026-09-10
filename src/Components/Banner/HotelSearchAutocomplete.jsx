import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import axios from 'axios';

const HOTEL_API = process.env.REACT_APP_HOTEL_API_BASE_URL || 'http://localhost:8009/api/hotel';

export default function HotelSearchAutocomplete({ onSelect, initialSelection }) {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  
  const [selectedCountryCode, setSelectedCountryCode] = useState('');
  const [countrySearchText, setCountrySearchText] = useState('');
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  
  const [selectedCityCode, setSelectedCityCode] = useState('');
  const [citySearchText, setCitySearchText] = useState('');
  const [isCityOpen, setIsCityOpen] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isCityLoading, setIsCityLoading] = useState(false);
  const [showCountryWarning, setShowCountryWarning] = useState(false);
  
  const wrapperRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsCountryOpen(false);
        setIsCityOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch Countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${HOTEL_API}/countries`);
        if (response.data?.CountryList) {
          setCountries(response.data.CountryList);
        }
      } catch (err) {
        console.error("Failed to fetch countries:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCountries();
  }, []);

  // Fetch Cities when Country changes
  useEffect(() => {
    if (!selectedCountryCode) {
      setCities([]);
      return;
    }
    const fetchCities = async () => {
      setIsCityLoading(true);
      try {
        const response = await axios.post(`${HOTEL_API}/cities`, { CountryCode: selectedCountryCode });
        if (response.data?.CityList) {
          setCities(response.data.CityList);
        }
      } catch (err) {
        console.error("Failed to fetch cities:", err);
      } finally {
        setIsCityLoading(false);
      }
    };
    fetchCities();
  }, [selectedCountryCode]);

  // Handle Initial Selection
  useEffect(() => {
    if (initialSelection) {
      if (initialSelection.CountryCode) {
        setSelectedCountryCode(initialSelection.CountryCode);
        // Find country name to display in input
        const country = countries.find(c => c.Code === initialSelection.CountryCode);
        if (country) setCountrySearchText(country.Name);
      }
      if (initialSelection.CityCode && initialSelection.CityName) {
        setSelectedCityCode(initialSelection.CityCode);
        setCitySearchText(initialSelection.CityName);
      }
    }
  }, [initialSelection, countries]);

  const normalizeText = (text) => (text || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  const filteredCountries = countries.filter(c => normalizeText(c.Name).includes(normalizeText(countrySearchText)));
  const filteredCities = cities.filter(c => normalizeText(c.Name).includes(normalizeText(citySearchText)));

  const handleCountrySelect = (country) => {
    setSelectedCountryCode(country.Code);
    setCountrySearchText(country.Name);
    setIsCountryOpen(false);
    
    // Reset City
    setSelectedCityCode('');
    setCitySearchText('');
    setCities([]);
  };

  const handleCitySelect = (city) => {
    setSelectedCityCode(city.Code);
    setCitySearchText(city.Name);
    setIsCityOpen(false);
    
    if (onSelect) {
      onSelect({
        CityCode: city.Code,
        CityName: city.Name,
        CountryCode: selectedCountryCode,
        _type: 'city'
      });
    }
  };

  return (
    <div className="sf-input-col" ref={wrapperRef} style={{ flex: 1.3, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '15px', position: 'relative' }}>
      
      {/* Country Search */}
      <div style={{ flex: 0.8, position: 'relative' }}>
        <span className="sf-label-text">Select Country</span>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={countrySearchText}
            onChange={(e) => {
              setCountrySearchText(e.target.value);
              setIsCountryOpen(true);
              setIsCityOpen(false);
            }}
            onFocus={() => {
              setIsCountryOpen(true);
              setIsCityOpen(false);
            }}
            onClick={() => {
              setIsCountryOpen(true);
              setIsCityOpen(false);
            }}
            placeholder="Search Country..."
            className="sf-autocomplete-input"
            style={{
              width: '100%', border: 'none', outline: 'none', background: 'transparent',
              fontSize: '18px', fontWeight: '700', color: '#111', padding: '0', margin: '4px 0 2px 0',
              textOverflow: 'ellipsis'
            }}
          />
          {isLoading && <Loader2 size={16} className="fa-spin" style={{ position: 'absolute', right: '0', top: '5px', animation: 'spin 1s linear infinite' }} />}
        </div>
        
        {/* Country Dropdown */}
        {isCountryOpen && (
          <div className="sf-dropdown" style={{ left: 0, right: 'auto', width: '300px', maxHeight: '300px', overflowY: 'auto', zIndex: 1000 }}>
            {filteredCountries.length === 0 ? (
              <div style={{ padding: '10px 15px', color: '#666' }}>No matches found</div>
            ) : (
              filteredCountries.map(country => (
                <div 
                  key={country.Code} 
                  className="sf-dropdown-item" 
                  onClick={() => handleCountrySelect(country)}
                  style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                >
                  <div style={{ fontWeight: '600', color: '#333' }}>{country.Name}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div style={{ width: '1px', background: '#eee', height: '40px' }}></div>

      {/* City Search */}
      <div style={{ flex: 1.5, position: 'relative' }}>
        <span className="sf-label-text">Select City</span>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={citySearchText}
            onChange={(e) => {
              if (selectedCountryCode) {
                setCitySearchText(e.target.value);
                setIsCityOpen(true);
                setIsCountryOpen(false);
              }
            }}
            onFocus={() => {
              if (!selectedCountryCode) {
                setShowCountryWarning(true);
                setTimeout(() => setShowCountryWarning(false), 3000);
              } else {
                setIsCityOpen(true);
                setIsCountryOpen(false);
              }
            }}
            onClick={() => {
              if (selectedCountryCode) {
                setIsCityOpen(true);
                setIsCountryOpen(false);
              }
            }}
            placeholder={selectedCountryCode ? "Search City..." : "Select City ..."}
            readOnly={!selectedCountryCode}
            className="sf-autocomplete-input"
            title={citySearchText}
            style={{
              width: '100%', border: 'none', outline: 'none', background: 'transparent',
              fontSize: '18px', fontWeight: '700', color: selectedCountryCode ? '#111' : '#ccc', padding: '0', margin: '4px 0 2px 0',
              textOverflow: 'ellipsis', cursor: selectedCountryCode ? 'text' : 'pointer'
            }}
          />
          
          {/* Warning Message Box */}
          {showCountryWarning && (
            <div style={{
              position: 'absolute', top: '-35px', left: '0', background: '#d81b21', color: '#fff', 
              padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)', whiteSpace: 'nowrap', zIndex: 10
            }}>
              Please select a country first
              <div style={{
                position: 'absolute', bottom: '-4px', left: '15px', width: '8px', height: '8px', 
                background: '#d81b21', transform: 'rotate(45deg)'
              }}></div>
            </div>
          )}

          {isCityLoading && <Loader2 size={16} className="fa-spin" style={{ position: 'absolute', right: '0', top: '5px', animation: 'spin 1s linear infinite' }} />}
        </div>

        {/* City Dropdown */}
        {isCityOpen && selectedCountryCode && (
          <div className="sf-dropdown" style={{ left: 0, right: 'auto', width: '350px', maxHeight: '300px', overflowY: 'auto', zIndex: 1000 }}>
            {filteredCities.length === 0 ? (
              <div style={{ padding: '10px 15px', color: '#666' }}>No matches found</div>
            ) : (
              filteredCities.map(city => (
                <div 
                  key={city.Code} 
                  className="sf-dropdown-item" 
                  onClick={() => handleCitySelect(city)}
                  style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                >
                  <div style={{ fontWeight: '600', color: '#333' }}>{city.Name}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
