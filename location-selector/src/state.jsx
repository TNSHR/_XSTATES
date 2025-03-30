import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LocationSelector.css';

const LocationSelector = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoadingCountries(true);
    axios.get('https://crio-location-selector.onrender.com/countries')
      .then(response => {
        setCountries(response.data);
        setLoadingCountries(false);
      })
      .catch(() => {
        setError('Error fetching countries');
        setLoadingCountries(false);
      });
  }, []);

  const handleCountryChange = (event) => {
    const country = event.target.value;
    setSelectedCountry(country);
    setSelectedState('');
    setSelectedCity('');
    setStates([]);
    setCities([]);
    setLoadingStates(true);
    axios.get(`https://crio-location-selector.onrender.com/country=${country}/states`)
      .then(response => {
        setStates(response.data);
        setLoadingStates(false);
      })
      .catch(() => {
        setError('Error fetching states');
        setLoadingStates(false);
      });
  };

  const handleStateChange = (event) => {
    const state = event.target.value;
    setSelectedState(state);
    setSelectedCity('');
    setCities([]);
    setLoadingCities(true);
    axios.get(`https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${state}/cities`)
      .then(response => {
        setCities(response.data);
        setLoadingCities(false);
      })
      .catch(() => {
        setError('Error fetching cities');
        setLoadingCities(false);
      });
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  return (
    <div className="location-container">
      <h1 className="title">Select Location</h1>
      
      {error && <p className="error">{error}</p>}

      <div className="selectors">
        <select value={selectedCountry} onChange={handleCountryChange}>
          <option value="">Select Country</option>
          {loadingCountries ? (
            <option>Loading...</option>
          ) : (
            countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))
          )}
        </select>

        <select value={selectedState} onChange={handleStateChange} disabled={!selectedCountry}>
          <option value="">Select State</option>
          {loadingStates ? (
            <option>Loading...</option>
          ) : (
            states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))
          )}
        </select>

        <select value={selectedCity} onChange={handleCityChange} disabled={!selectedState}>
          <option value="">Select City</option>
          {loadingCities ? (
            <option>Loading...</option>
          ) : (
            cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))
          )}
        </select>
      </div>

      {selectedCity && selectedState && selectedCountry && (
        <div className="result">
          You selected <strong>{selectedCity}</strong>, <span className="gray">{selectedState}</span>, <span className="gray">{selectedCountry}</span>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
