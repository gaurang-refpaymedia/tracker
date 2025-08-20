import { createContext, useContext, useState } from 'react';

import { fetchAdvertisers, fetchAdvertiser } from '../../api/advertiserApi';

const AdvertiserContext = createContext();

export const AdvertiserProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [advertisers, setAdvertisers] = useState([]);
  const [advertiser, setAdvertiser] = useState(null);

  const loadAdvertisers = async () => {
    setLoading(true);
    try {
      const res = await fetchAdvertisers();
      setAdvertisers(res.data);
      setError(null);
    } catch (error) {
      setError(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadAdvertiser = async (id) => {
    setLoading(true);
    try {
      const res = await fetchAdvertiser(id);
      setAdvertiser(res.data);
      setError(null);
    } catch (error) {
      setError(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return <AdvertiserContext.Provider value={{ error, loading, advertisers, advertiser, loadAdvertisers, loadAdvertiser }}>{children}</AdvertiserContext.Provider>;
};

export const useAdvertisers = () => useContext(AdvertiserContext);
