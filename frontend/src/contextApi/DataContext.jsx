// DataContext.js
import { createContext, useState } from 'react';
import axios from 'axios'; // <--- THIS IS ESSENTIAL. MAKE SURE IT'S HERE.

export const DataContext = createContext({
  checkCompanyCode: async (companyCode) => {},
  subscriptionsItems: async () => {},
  countriesItems: async () => {},
  statesItems: async () => {},
  statusesItems: async () => {},
  timezonesItems: async () => {},
});

const DataProvider = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(true);
  const [subscriptionError, setSubscriptionError] = useState('');

  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [countryError, setCountryError] = useState('');

  const [states, setStates] = useState([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [stateError, setStateError] = useState('');

  const [statuses, setStatuses] = useState([]);
  const [loadingStatuses, setLoadingStatuses] = useState(true);
  const [statusError, setStatusError] = useState('');

  const [timezones, setTimezones] = useState([]);
  const [loadingTimezones, setLoadingTimezones] = useState(true);
  const [timezoneError, setTimezoneError] = useState('');

  const subscriptionsItems = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/subscriptions');
      setSubscriptions(response.data);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      setSubscriptionError('Failed to load subscription options.');
    } finally {
      setLoadingSubscriptions(false);
    }
  };

  const countriesItems = async () => {
    try {
      setLoadingCountries(true);
      const response = await axios.get('http://localhost:8000/api/countries', { withCredentials: true });
      setCountries(response.data);
    } catch (error) {
      console.error('Error fetching countries:', error);
      setCountryError('Failed to load country options.');
    } finally {
      setLoadingCountries(false);
    }
  };

  const statesItems = async () => {
    try {
      setLoadingStates(true);
      const response = await axios.get('http://localhost:8000/api/states', { withCredentials: true });
      setStates(response.data);
    } catch (error) {
      console.error('Error fetching states:', error);
      setStateError('Failed to load state options.');
    } finally {
      setLoadingStates(false);
    }
  };

  const statusesItems = async () => {
    try {
      setLoadingStatuses(true);
      const response = await axios.get('http://localhost:8000/api/statuses', { withCredentials: true });
      setStatuses(response.data);
    } catch (error) {
      console.error('Error fetching statuses:', error);
      setStatusError('Failed to load status options.');
    } finally {
      setLoadingStatuses(false);
    }
  };

  const timezonesItems = async () => {
    try {
      setLoadingTimezones(true);
      const response = await axios.get('http://localhost:8000/api/timezones');
      setTimezones(response.data);
    } catch (error) {
      console.error('Error fetching timezones:', error);
      setTimezoneError('Failed to load timezone options.');
    } finally {
      setLoadingTimezones(false);
    }
  };

  const checkCompanyCode = async (companyCode) => {
    // --- ADD DEBUG LOGS HERE ---
    console.log('DataContext: Attempting to check company code:', companyCode);
    try {
      const response = await axios.get(`http://localhost:8000/api/check-company-code/${companyCode}`);
      // --- LOG THE RAW API RESPONSE DATA ---
      console.log('DataContext: Raw API Response Data:', response.data);

      const exists = response.data.exists;
      // --- LOG THE BOOLEAN RESULT ---
      console.log("DataContext: checkCompanyCode returning 'exists':", exists);
      return exists; // This must be a boolean (true or false)
    } catch (error) {
      // --- LOG API CALL ERRORS ---
      console.error('DataContext: Error during API call for company code:', error);
      // Common errors here: Network error, CORS issue, 404/500 from backend
      return false; // Always return false if an error occurs
    }
  };

  const dataValue = {
    subscriptions,
    loadingSubscriptions,
    subscriptionError,
    subscriptionsItems,
    countries,
    loadingCountries,
    countryError,
    countriesItems,
    states,
    loadingStates,
    stateError,
    statesItems,
    statuses,
    loadingStatuses,
    statusError,
    statusesItems,
    timezones,
    loadingTimezones,
    timezoneError,
    timezonesItems,
    checkCompanyCode,
  };

  return <DataContext.Provider value={dataValue}>{children}</DataContext.Provider>;
};

export default DataProvider;
