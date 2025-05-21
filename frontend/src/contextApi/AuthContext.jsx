import { createContext, useEffect, useState } from "react";
import axios from "axios"; // Import axios

export const AuthContext = createContext({
  user: null,
  isLoggedIn: false,
  login: async (email, password) => {},
  register: async (company_name, company_code, super_user_name, super_user_email) => {},
  logout: () => {},
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registerCompany, setRegisterCompany] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (email, password) => {
    console.log("AuthContext: Attempting login for email:", email);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login",
        new URLSearchParams({ email, password }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      console.log("AuthContext: Axios response status:", response.status);
      console.log("AuthContext: Axios response headers:", response.headers);
      console.log("AuthContext: Axios response data:", response.data);

      const parsedData = response.data;

      if (response.status >= 200 && response.status < 300) {
        console.log("AuthContext: Login successful, parsed data:", parsedData);
        setUser(parsedData);
        setIsLoggedIn(true);
        localStorage.setItem("user", JSON.stringify(parsedData));
        return { success: true, user: parsedData };
      } else {
        console.error(
          "AuthContext: Login failed, server error:",
          response.status,
          parsedData
        );
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem("user");
        return {
          success: false,
          error:
            parsedData?.error || `Login failed with status ${response.status}`,
        }; // Include status
      }
    } catch (error) {
      console.error("AuthContext: Axios error during login:", error);
      setIsLoggedIn(false);
      setUser(null);
      localStorage.removeItem("user");
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("AuthContext: Server error:", error.response.data);
        return {
          success: false,
          error:
            error.response.data?.error ||
            `Server error: ${error.response.status}`,
        };
      } else if (error.request) {
        // The request was made but no response was received
        return { success: false, error: "No response from server" };
      } else {
        // Something happened in setting up the request that triggered an Error
        return {
          success: false,
          error: "Error setting up request: " + error.message,
        };
      }
    }
  };

  const register = async (
    company_name,
    company_code,
    subscription_code,
    super_user_name,
    super_user_email
  ) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/register-company",
        new URLSearchParams({
          company_name,
          company_code,
          subscription_code,
          super_user_name,
          super_user_email,
        }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const parsedData = response.data;

      if (response.status >= 200 && response.status < 300) {
        console.log(
          "AuthContext: Company registration successful, data:",
          parsedData
        );
        // setRegisterCompany(parsedData);
        return { success: true, data: parsedData };
      } else {
        console.error(
          "AuthContext: Company registration failed, server error:",
          response.status,
          parsedData
        );
        // Attempt to extract a clear error message
        let errorMessage =
          "Registration failed due to an unexpected server response.";
        if (parsedData && typeof parsedData === "object" && parsedData.detail) {
          if (typeof parsedData.detail === "string") {
            errorMessage = parsedData.detail;
          } else if (
            Array.isArray(parsedData.detail) &&
            parsedData.detail.length > 0
          ) {
            // For Pydantic validation errors, detail is often an array of objects
            errorMessage = parsedData.detail
              .map((err) => err.msg || "Validation error")
              .join(", ");
          } else if (
            typeof parsedData.detail === "object" &&
            parsedData.detail.message
          ) {
            // Check for a 'message' key within detail if it's an object
            errorMessage = parsedData.detail.message;
          }
        }
        return {
          success: false,
          error: errorMessage,
        };
      }
    } catch (error) {
      // setRegisterCompany(null); // Clear registration status on error

      let errorMessage = "An unknown error occurred.";
      if (error.response) {
        console.error(
          "AuthContext: Registration error response:",
          error.response
        );
        const errorData = error.response.data;

        if (errorData) {
          if (typeof errorData.detail === "string") {
            errorMessage = errorData.detail;
          } else if (
            Array.isArray(errorData.detail) &&
            errorData.detail.length > 0
          ) {
            errorMessage = errorData.detail
              .map((err) => err.msg || "Validation error")
              .join(", ");
          } else if (errorData.error) {
            // Your custom error like {"error": "Invalid credentials"}
            errorMessage = errorData.error;
          } else if (typeof errorData === "string") {
            errorMessage = errorData; // Sometimes the response data might just be a string
          } else if (errorData.message) {
            // Common generic error message key
            errorMessage = errorData.message;
          }
          // Fallback if none of the above match, try to stringify if it's an object
          else if (typeof errorData === "object") {
            try {
              errorMessage = JSON.stringify(errorData);
            } catch (e) {
              errorMessage = "Server error: Invalid response format.";
            }
          }
        } else {
          errorMessage = `Server error: ${error.response.status}`;
        }
      } else if (error.request) {
        console.error(
          "AuthContext: Registration no response from server:",
          error.request
        );
        errorMessage =
          "No response from server. Please check your network connection.";
      } else {
        console.error(
          "AuthContext: Error setting up registration request:",
          error.message
        );
        errorMessage = "Error setting up request: " + error.message;
      }
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("user");
  };

  const authValue = {
    user,
    registerCompany,
    isLoggedIn,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
