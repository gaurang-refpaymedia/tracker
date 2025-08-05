import { useState, useCallback } from "react";

const useLocationData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState(null);

  // Wrap the async function in useCallback to memoize it.
  // The empty dependency array `[]` ensures the function is created only once.
  const fetchCountries = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/flag/images');

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const transformedCountries = data.data.map(country => ({
        value: country.iso3.toLowerCase().replace(/\s+/g, '-'),
        label: country.name,
        img: country.flag
      }));

      setCountries(transformedCountries);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means this function is stable

  return {
    loading,
    error,
    countries,
    states,
    cities,
    selectedOptions,
    fetchCountries
  };
};

export default useLocationData;
