import { createContext, useReducer, useContext, useEffect,useState } from 'react';
import { fetchPublishers, fetchPublisher, createPublisher, updatePublisher, deletePublisher } from '../../api/publisherApi';

const PublisherContext = createContext();

export const PublisherProvider = ({ children }) => {
  const [publishers, setPublishers] = useState([]);
  const [publisher, setPublisher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Load all Publishers
  const loadPublishers = async () => {
    setLoading(true);
    try {
      const res = await fetchPublishers();
      setPublishers(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load single Publisher
  const loadPublisher = async (id) => {
    setLoading(true);
    try {
      const res = await fetchPublisher(id);
      setPublisher(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Create Publisher
  const addPublisher = async (data) => {
    setLoading(true);
    try {
      const res = await createPublisher(data);
      setPublishers((prev) => [...prev, res.data]);
      setError(null);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update Publisher
  const editPublisher = async (id, data) => {
    setLoading(true);
    try {
      const res = await updatePublisher(id, data);
      setPublishers((prev) =>
        prev.map((adv) => (adv.id === id ? res.data : adv))
      );
      setError(null);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Publisher
  const removePublisher = async (id) => {
    setLoading(true);
    try {
      await deletePublisher(id);
      setPublishers((prev) => prev.filter((adv) => adv.id !== id));
      setError(null);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublisherContext.Provider
      value={{
        publishers,
        publisher,
        loading,
        error,
        loadPublishers,
        loadPublisher,
        addPublisher,
        editPublisher,
        removePublisher,
      }}
    >
      {children}
    </PublisherContext.Provider>
  );
};

export const usePublishers = () => useContext(PublisherContext);