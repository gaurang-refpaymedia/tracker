// DataContext.js
import { createContext, useState } from "react";
import axios from 'axios'; // <--- THIS IS ESSENTIAL. MAKE SURE IT'S HERE.

export const DataContext = createContext({
    checkCompanyCode: async (companyCode) => {},
    subscriptionsItems: async () => {}
});

const DataProvider = ({ children }) => {

    const [subscriptions, setSubscriptions] = useState([]);
    const [loadingSubscriptions, setLoadingSubscriptions] = useState(true);
    const [subscriptionError, setSubscriptionError] = useState("");

    const subscriptionsItems = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/subscriptions');
            setSubscriptions(response.data);
        } catch (error) {
            console.error("Error fetching subscriptions:", error);
            setSubscriptionError("Failed to load subscription options.");
        } finally {
            setLoadingSubscriptions(false);
        }
    }

    const checkCompanyCode = async (companyCode) => {
        // --- ADD DEBUG LOGS HERE ---
        console.log("DataContext: Attempting to check company code:", companyCode);
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/api/check-company-code/${companyCode}`
            );
            // --- LOG THE RAW API RESPONSE DATA ---
            console.log("DataContext: Raw API Response Data:", response.data);

            const exists = response.data.exists;
            // --- LOG THE BOOLEAN RESULT ---
            console.log("DataContext: checkCompanyCode returning 'exists':", exists);
            return exists; // This must be a boolean (true or false)
        } catch (error) {
            // --- LOG API CALL ERRORS ---
            console.error("DataContext: Error during API call for company code:", error);
            // Common errors here: Network error, CORS issue, 404/500 from backend
            return false; // Always return false if an error occurs
        }
    };

    const dataValue = {
        subscriptions,
        loadingSubscriptions,
        subscriptionError,
        subscriptionsItems,
        checkCompanyCode
    };
    return (
        <DataContext.Provider value={dataValue}>{children}</DataContext.Provider>
    );
};

export default DataProvider;