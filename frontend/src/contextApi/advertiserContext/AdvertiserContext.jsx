import { createContext, useReducer, useContext, useEffect,useState } from 'react';
import { fetchAdvertisers, fetchAdvertiser, createAdvertiser, updateAdvertiser, deleteAdvertiser } from '../../api/advertiserApi';

const AdvertiserContext = createContext();

export const AdvertiserProvider = ({ children }) => {
  const [advertisers, setAdvertisers] = useState([]);
  const [advertiser, setAdvertiser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Load all advertisers
  const loadAdvertisers = async () => {
    setLoading(true);
    try {
      const res = await fetchAdvertisers();
      setAdvertisers(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load single advertiser
  const loadAdvertiser = async (id) => {
    setLoading(true);
    try {
      const res = await fetchAdvertiser(id);
      setAdvertiser(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Create advertiser
  const addAdvertiser = async (data) => {
    setLoading(true);
    try {
      const res = await createAdvertiser(data);
      setAdvertisers((prev) => [...prev, res.data]);
      setError(null);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update advertiser
  const editAdvertiser = async (id, data) => {
    setLoading(true);
    try {
      const res = await updateAdvertiser(id, data);
      setAdvertisers((prev) =>
        prev.map((adv) => (adv.id === id ? res.data : adv))
      );
      setError(null);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete advertiser
  const removeAdvertiser = async (id) => {
    setLoading(true);
    try {
      await deleteAdvertiser(id);
      setAdvertisers((prev) => prev.filter((adv) => adv.id !== id));
      setError(null);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdvertiserContext.Provider
      value={{
        advertisers,
        advertiser,
        loading,
        error,
        loadAdvertisers,
        loadAdvertiser,
        addAdvertiser,
        editAdvertiser,
        removeAdvertiser,
      }}
    >
      {children}
    </AdvertiserContext.Provider>
  );
};

export const useAdvertisers = () => useContext(AdvertiserContext);