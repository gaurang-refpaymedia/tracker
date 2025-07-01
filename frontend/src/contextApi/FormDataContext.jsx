import axios from "axios";
import { createContext } from "react";
import { useContext, useState } from "react";

export const FormDataContext = createContext({
    createSubUser: async (name, email, roleCode, userCode) => {}, // Updated signature
});

const FormDataProvider = ({ children }) => {
  const [subUser, setSubUser] = useState(null); // Changed to null as initial state might not be an empty string

  const createSubUser = async (name, email, roleCode, userCode) => { // Updated signature
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/create-sub-user",
        {
          name: name,
          email: email,
          role_code: roleCode,
          user_code: userCode,
        },
        {
          withCredentials: true,
        }
      );

      // Check for successful status codes (e.g., 201 Created) rather than just response.data.status_code
      if (response.status === 201) {
        console.log("Sub user created successfully", response.data);
        setSubUser(response.data);
        return response.data; // Return data for potential success message in component
      } else {
        // Handle other successful but non-201 status codes if needed
        console.warn("Unexpected status code:", response.status, response.data);
        throw new Error(response.data.detail || "Sub-user creation failed with unexpected status.");
      }
    } catch (error) {
      console.error("Error creating the sub user:", error.response ? error.response.data : error.message);
      throw error; // Re-throw to be caught by the component
    }
  };

  const formValue = { subUser, createSubUser };
  return (
    <FormDataContext.Provider value={formValue}>
      {children}
    </FormDataContext.Provider>
  );
};

export default FormDataProvider;