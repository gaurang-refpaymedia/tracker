import { createContext, useContext, useState } from 'react';

const FilterContext = createContext({});

export const FilterProvider = ({ children }) => {
  const [selectedFilters, setSelectedFilters] = useState(['email', 'advcode', 'adv_country', 'pubcode', 'pub_country', 'pub_status','adv_status']);

  return <FilterContext.Provider value={{ selectedFilters, setSelectedFilters }}>{children}</FilterContext.Provider>;
};

// Hook to use filter context
export const useFilter = () => useContext(FilterContext);
