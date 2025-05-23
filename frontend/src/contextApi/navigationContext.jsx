import { createContext, useState } from "react";

export const NavigationContext = createContext();

const NavigationProvider = ({ children }) => {
  const [navigationOpen, setNavigationOpen] = useState(true);
  const [navigationExpend, setnavigationExpend] = useState(true);

  const obj = {
    navigationOpen,
    navigationExpend,
    setNavigationOpen,
    setnavigationExpend,
  };

  return (
    <NavigationContext.Provider value={obj}>
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationProvider;
