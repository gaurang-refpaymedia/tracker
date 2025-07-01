import { use, useState } from "react";

const useLocationData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState(null);

  const fetchCountries = async () => {
    setError(null);
    setLoading(true);
    try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries/flag/images');

        if(!response.ok)
        {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const transformedCountries = data.data.map(country => ({
            value: country.iso3.toLowerCase().replace(/\s+/g, '-'),
            label:country.name,
            img: country.flag
        }))

        setCountries(transformedCountries);

    } catch (error) {
        setError(error.message);
        setLoading(false);
    }
    finally{
        setLoading(false);
    }
  }

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
