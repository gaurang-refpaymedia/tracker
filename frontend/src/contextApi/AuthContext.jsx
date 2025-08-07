import { createContext, useEffect, useState } from 'react';
import axios from 'axios'; // Import axios

export const AuthContext = createContext({
  user: null,
  isLoggedIn: false,
  login: async (email, password) => {},
  register: async (company_name, company_code, super_user_name, super_user_email) => {},
  logout: () => {},
  changePassword: async (userCode, oldPassword, newPassword) => {}, // Added to context type
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registerCompany, setRegisterCompany] = useState(null); // This state variable seems unused
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Failed to parse user from localStorage', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email, password) => {
    console.log('AuthContext: Attempting login for email:', email);
    try {
      const response = await axios.post(
        'http://localhost:8000/api/login', // IMPORTANT: Verify this URL in your FastAPI routes.
        // Is it `/api/login` or `/users/api/login`?
        new URLSearchParams({ email, password }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          credentials: 'include',
          withCredentials: true, // This is correctly set for login
        }
      );

      console.log('AuthContext: Axios response status:', response.status);
      console.log('AuthContext: Axios response headers:', response.headers);
      console.log('AuthContext: Axios response data:', response.data);

      const parsedData = response.data;

      if (response.status >= 200 && response.status < 300) {
        console.log('AuthContext: Login successful, parsed data:', parsedData);
        setUser(parsedData.user_data);
        setIsLoggedIn(true);
        localStorage.setItem('user', JSON.stringify(parsedData.user_data));
        return { success: true, user: parsedData.user_data };
      } else {
        console.error('AuthContext: Login failed, server error:', response.status, parsedData);
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem('user');
        return {
          success: false,
          error: parsedData?.error || `Login failed with status ${response.status}`,
        };
      }
    } catch (error) {
      console.error('AuthContext: Axios error during login:', error);
      setIsLoggedIn(false);
      setUser(null);
      localStorage.removeItem('user');
      if (axios.isAxiosError(error) && error.response) {
        console.error('AuthContext: Server error:', error.response.data);
        return {
          success: false,
          error: error.response.data?.error || `Server error: ${error.response.status}`,
        };
      } else if (error.request) {
        return { success: false, error: 'No response from server' };
      } else {
        return {
          success: false,
          error: 'Error setting up request: ' + error.message,
        };
      }
    }
  };

  const register = async (company_name, company_code, subscription_code, super_user_name, super_user_email) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/register-company', // IMPORTANT: Verify this URL in your FastAPI routes.
        new URLSearchParams({
          company_name,
          company_code,
          subscription_code,
          super_user_name,
          super_user_email,
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const parsedData = response.data;

      if (response.status >= 200 && response.status < 300) {
        console.log('AuthContext: Company registration successful, data:', parsedData);
        // setRegisterCompany(parsedData); // This state variable is declared but not actively used or returned.
        return { success: true, data: parsedData };
      } else {
        console.error('AuthContext: Company registration failed, server error:', response.status, parsedData);
        let errorMessage = 'Registration failed due to an unexpected server response.';
        if (parsedData && typeof parsedData === 'object' && parsedData.detail) {
          if (typeof parsedData.detail === 'string') {
            errorMessage = parsedData.detail;
          } else if (Array.isArray(parsedData.detail) && parsedData.detail.length > 0) {
            errorMessage = parsedData.detail.map((err) => err.msg || 'Validation error').join(', ');
          } else if (typeof parsedData.detail === 'object' && parsedData.detail.message) {
            errorMessage = parsedData.detail.message;
          }
        }
        return {
          success: false,
          error: errorMessage,
        };
      }
    } catch (error) {
      // setRegisterCompany(null);
      let errorMessage = 'An unknown error occurred.';
      if (axios.isAxiosError(error) && error.response) {
        console.error('AuthContext: Registration error response:', error.response);
        const errorData = error.response.data;

        if (errorData) {
          if (typeof errorData.detail === 'string') {
            errorMessage = errorData.detail;
          } else if (Array.isArray(errorData.detail) && errorData.detail.length > 0) {
            errorMessage = errorData.detail.map((err) => err.msg || 'Validation error').join(', ');
          } else if (errorData.error) {
            errorMessage = errorData.error;
          } else if (typeof errorData === 'string') {
            errorMessage = errorData;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (typeof errorData === 'object') {
            try {
              errorMessage = JSON.stringify(errorData);
            } catch (e) {
              errorMessage = 'Server error: Invalid response format.';
            }
          }
        } else {
          errorMessage = `Server error: ${error.response.status}`;
        }
      } else if (axios.isAxiosError(error)) {
        console.error('AuthContext: Registration no response from server:', error.request);
        errorMessage = 'No response from server. Please check your network connection.';
      } else {
        console.error('AuthContext: Error setting up registration request:', error.message);
        errorMessage = 'Error setting up request: ' + error.message;
      }
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const changePassword = async (userCode, oldPassword, newPassword) => {
    try {
      if (!userCode || !oldPassword || !newPassword) {
        console.error('Old password and new password are required.');
        return { success: false, message: 'Please fill in all fields.' };
      }

      const response = await axios.post(
        'http://localhost:8000/api/change-password', // IMPORTANT: Verify this URL in your FastAPI routes.
        {
          user_code: userCode,
          old_password: oldPassword,
          new_password: newPassword,
        },
        {
          withCredentials: true, // This is correctly set for changePassword
        }
      );

      if (response.data.message === 'Password changed successfully.') {
        console.log('Password changed successfully:', response.data.message);
        return { success: true, message: response.data.message };
      } else {
        console.warn('Unexpected response from server:', response.data);
        return {
          success: false,
          message: response.data.message || 'An unexpected error occurred.',
        };
      }
    } catch (error) {
      console.error('Error changing password:', error);

      if (axios.isAxiosError(error) && error.response) {
        console.error('Server response data:', error.response.data);
        console.error('Server response status:', error.response.status);

        if (error.response.status === 400) {
          return {
            success: false,
            message: error.response.data.detail || 'Incorrect old password or invalid input.',
          };
        } else if (error.response.status === 401) {
          return {
            success: false,
            message: error.response.data.detail || 'You are not authorized. Please log in again',
          };
        } else if (error.response.status === 404) {
          return {
            success: false,
            message: error.response.data.detail || 'User not found.',
          };
        } else if (error.response.status === 500) {
          return {
            success: false,
            message: error.response.data.detail || 'Server error. Please try again later.',
          };
        } else {
          return {
            success: false,
            message: `An error occurred: ${error.response.status} - ${error.response.data.detail || error.message}`,
          };
        }
      } else if (axios.isAxiosError(error)) {
        return {
          success: false,
          message: 'Network error. Please check your internet connection.',
        };
      } else {
        return { success: false, message: 'An unexpected error occurred.' };
      }
    }
  };

  const logout = async () => {
    try {
      // ADDED THIS LINE HERE
      const response = await axios.post(
        'http://localhost:8000/api/logout',
        {},
        {
          withCredentials: true, // This is essential for logout to work with session cookies
        }
      );
      console.log(response.data);

      if (response.data.message === 'Successfully logged out') {
        setIsLoggedIn(false); // Update local state immediately
        setUser(null); // Clear user data
        localStorage.removeItem('user'); // Clear user from local storage
        window.location.href = '/login'; // Redirect
      }
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed. Please try again.');
    }
  };

  const otpGenerate = async (email) => {
    try {
      const response = await axios.post('http://localhost:8000/api/forgot-password', {
        email,
      });

      setForgotPasswordMessage(response.data.message);
    } catch (error) {
      console.error('Error in otp generations:', error);

      if (error.response && error.response.data && error.response.data.detail) {
        throw new Error(error.response.data.detail);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred during OTP generation.');
      }
    }
  };

  const forgotPassword = async (email, otp, new_password, confirm_password) => {
    try {
      const response = await axios.post('http://localhost:8000/api/reset-password', {
        email,
        otp,
        new_password,
        confirm_password,
      });
    } catch (error) {
      console.error('Error in reset password', error);

      if (error.response && error.response.data && error.response.data.detail) {
        throw new Error(error.response.data.detail);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred during OTP generation.');
      }
    }
  };

  const authValue = {
    user,
    registerCompany, // Still present, but unused state variable
    isLoggedIn,
    login,
    logout,
    register,
    forgotPasswordMessage,
    changePassword,
    otpGenerate,
    forgotPassword,
  };

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
