import { createContext, useState } from 'react';
import axios from 'axios'; // Import axios

export const SubUserContext = createContext({});

const SubUserProvider = ({ children }) => {
  const [subUser, setSubUser] = useState(null);
  const [subUserListing, setSubUserListing] = useState([]);
  const [listingLoading, setListingLoading] = useState(false);
  const [listingError, setListingError] = useState(null);


  // Updated function to not accept user_role_code and userCode from the client
  const createSubUser = async (name, email, roleCode, password) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/subusers/create-sub-user',
        {
          name: name,
          email: email,
          role_code: roleCode,
          password,
        },
        {
          withCredentials: true,
        }
      );

      // Check for successful status codes (e.g., 201 Created)
      if (response.status === 201) {
        console.log('Sub user created successfully', response.data);
        setSubUser(response.data);
        return response.data; // Return data for potential success message in component
      } else {
        console.warn('Unexpected status code:', response.status, response.data);
        throw new Error(response.data.detail || 'Sub-user creation failed with an unexpected status.');
      }
    } catch (error) {
      console.error('Error creating the sub user:', error.response ? error.response.data : error.message);
      throw error; // Re-throw to be caught by the component
    }
  };

  const fetchSubUserListing = async () => {
    setListingLoading(true); // Set loading state for listing
    setListingError(null); // Clear any previous listing errors

    try {
      // Make a GET request to the subusers API
      // Axios automatically handles sending cookies for same-origin requests
      const response = await axios.get('http://localhost:8000/api/subusers/',
        {
          withCredentials: true,
      });

      // Set the fetched data to the subUserListing state
      setSubUserListing(response.data);
      console.log("Sub-user listing fetched successfully:", response.data);
    } catch (err) {
      // Handle errors during the fetch operation
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx (e.g., 401, 403, 404, 500)
        console.error("Failed to fetch sub-user listing:", err.response.data.detail || err.response.statusText);
        setListingError(err.response.data.detail || "Failed to load sub-users. Please try again.");
      } else if (err.request) {
        // The request was made but no response was received (e.g., network error)
        console.error("Network error fetching sub-user listing:", err.message);
        setListingError("Network error. Please check your connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up sub-user listing request:", err.message);
        setListingError("An unexpected error occurred while fetching sub-users.");
      }
      setSubUserListing([]); // Clear listing on error
    } finally {
      setListingLoading(false); // Always reset loading state
    }
  };

  const subUserValue = {
    subUser,
    createSubUser,
    subUserListing,   
    listingLoading,
    listingError,
    fetchSubUserListing
  };

  return <SubUserContext.Provider value={subUserValue}>{children}</SubUserContext.Provider>;
};

export default SubUserProvider;
