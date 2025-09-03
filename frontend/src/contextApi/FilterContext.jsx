import { createContext, useContext, useState } from 'react';

const FilterContext = createContext({});

export const FilterProvider = ({ children }) => {
  const filterItems = ['email', 'advcode', 'adv_country', 'pubcode', 'pub_country', 'pub_status', 'adv_status', 'contact_person'];
  const setFilterItems = localStorage.setItem('filterItems', JSON.stringify(filterItems));
  const getFilterItems = localStorage.getItem('filterItems');

  const parsedData = JSON.parse(getFilterItems);
  const [selectedFilters, setSelectedFilters] = useState(parsedData);

  return <FilterContext.Provider value={{ selectedFilters, setSelectedFilters }}>{children}</FilterContext.Provider>;
};

// Hook to use filter context
export const useFilter = () => useContext(FilterContext);
