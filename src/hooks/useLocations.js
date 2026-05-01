import { useState, useCallback } from 'react';
import { Country, State, City } from 'country-state-city';

/**
 * Hook to manage Country, State, and City selections and data using the 
 * 'country-state-city' package.
 */
export const useLocations = () => {
  const [countries] = useState(() => Country.getAllCountries().map(c => ({
    id: c.isoCode,
    name: c.name,
    flag: c.flag
  })));
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  
  const [selection, setSelection] = useState({
    country: '',
    state: '',
    city: ''
  });

  const handleCountryChange = useCallback((countryCode) => {
    setSelection({ country: countryCode, state: '', city: '' });
    
    if (countryCode) {
      const countryStates = State.getStatesOfCountry(countryCode).map(s => ({
        id: s.isoCode,
        name: s.name
      }));
      setStates(countryStates);
    } else {
      setStates([]);
    }
    setCities([]);
  }, []);

  const handleStateChange = useCallback((stateCode, countryCode) => {
    setSelection(prev => ({ ...prev, state: stateCode, city: '' }));
    
    if (countryCode && stateCode) {
      const stateCities = City.getCitiesOfState(countryCode, stateCode).map(c => ({
        id: c.name, // Cities often don't have isoCodes, using name as ID
        name: c.name
      }));
      setCities(stateCities);
    } else {
      setCities([]);
    }
  }, []);

  const handleCityChange = useCallback((cityName) => {
    setSelection(prev => ({ ...prev, city: cityName }));
  }, []);

  return {
    countries,
    states,
    cities,
    selection,
    handleCountryChange,
    handleStateChange,
    handleCityChange
  };
};

export default useLocations;
