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
      .catch(error => {
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
    axios.get(`https://crio-location-selector.onrender.com/countries=${country}/states`)
      .then(response => {
        setStates(response.data);
        setLoadingStates(false);
      })
      .catch(error => {
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
      .catch(error => {
        setError('Error fetching cities');
        setLoadingCities(false);
      });
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  return (
    <div className="location-selector">
      <h1>Select Location</h1>
      {error && <p className="error">{error}</p>}
      <div className="dropdowns">
        <div className="dropdown">
          <label>Select Country: </label>
          {loadingCountries ? (
            <p>Loading countries...</p>
          ) : (
            <select value={selectedCountry} onChange={handleCountryChange}>
              <option value="">Select Country</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          )}
        </div>
        <div className="dropdown">
          <label>Select State: </label>
          {loadingStates ? (
            <p>Loading states...</p>
          ) : (
            <select value={selectedState} onChange={handleStateChange} disabled={!selectedCountry}>
              <option value="">Select State</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          )}
        </div>
        <div className="dropdown">
          <label>Select City: </label>
          {loadingCities ? (
            <p>Loading cities...</p>
          ) : (
            <select value={selectedCity} onChange={handleCityChange} disabled={!selectedState}>
              <option value="">Select City</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          )}
        </div>
      </div>
      {selectedCity && selectedState && selectedCountry && (
        <div className="result">
          <h2>You Selected {selectedCity}, {selectedState}, {selectedCountry}</h2>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
