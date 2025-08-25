import { createContext, useContext, useState } from 'react';

const FilterContext = createContext({});

export const FilterProvider = ({ children }) => {
  const [selectedFilters, setSelectedFilters] = useState(['id', 'advcode', 'adv_country_id', 'email', 'adv_status_id']);

  return <FilterContext.Provider value={{ selectedFilters, setSelectedFilters }}>{children}</FilterContext.Provider>;
};

export const useFilter = () => useContext(FilterContext);