import { createContext, useState } from "react";
import axios from "axios"; // Import axios

export const SubUserContext = createContext({});

const SubUserProvider = ({ children }) => {
  const [subUser, setSubUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:8000/api/subusers/login", { email, password });

      console.log("Login successful:", response.data.message);
      setSubUser({
        email: email,
        isLoggedIn: true,
      });
      setIsLoading(false);
      return true;
    } catch (err) {
      if (err.response) {
        console.error("Login failed:", err.response.data.detail || err.response.statusText);
        setError(err.response.data.detail || "Login failed. Please try again.");
      } else if (err.request) {
        console.error("Network error during login:", err.message);
        setError("Network error. Please check your connection.");
      } else {
        console.error("Error setting up login request:", err.message);
        setError("An unexpected error occurred. Please try again.");
      }
      setSubUser(null);
      setIsLoading(false);
      return false; 
    }
  };

  const logout = async () => {
    setSubUser(null);
    setError(null);
    setIsLoading(false);
    console.log("Logged out successfully.");
  };

  const subUserValue = {
    subUser,
    isLoading,
    error,
    login,
    logout,
    setSubUser,
  };

  return (
    <SubUserContext.Provider value={subUserValue}>
      {children}
    </SubUserContext.Provider>
  );
};

export default SubUserProvider;
