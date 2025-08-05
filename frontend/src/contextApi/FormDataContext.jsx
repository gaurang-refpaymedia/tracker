import axios from 'axios';
import { createContext, useContext, useState } from 'react';

export const FormDataContext = createContext({
  // The signature is simplified, as user details are handled by the backend
  createSubUser: async (name, email, roleCode, password) => {}, 
});

const FormDataProvider = ({ children }) => {
  const [subUser, setSubUser] = useState(null); 

  // Updated function to not accept user_role_code and userCode from the client
  const createSubUser = async (name, email, roleCode, password) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/subusers/create-sub-user',
        {
          name: name,
          email: email,
          role_code: roleCode,
          password
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

  const formValue = { subUser, createSubUser };
  return <FormDataContext.Provider value={formValue}>{children}</FormDataContext.Provider>;
};

export default FormDataProvider;
