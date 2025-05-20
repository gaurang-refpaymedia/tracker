import { createContext, useEffect, useState } from "react";
import axios from 'axios'; // Import axios

export const AuthContext = createContext({
    user: null,
    isLoggedIn: false,
    login: async (email, password) => { },
    logout: () => { },
});

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
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
            const response = await axios.post("/login", new URLSearchParams({ email, password }).toString(), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

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
                 console.error("AuthContext: Login failed, server error:", response.status, parsedData);
                setIsLoggedIn(false);
                setUser(null);
                localStorage.removeItem("user");
                return { success: false, error: parsedData?.error || `Login failed with status ${response.status}` }; // Include status
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
                    error: error.response.data?.error || `Server error: ${error.response.status}`,
                };
            } else if (error.request) {
                // The request was made but no response was received
                return { success: false, error: "No response from server" };
            } else {
                // Something happened in setting up the request that triggered an Error
                return { success: false, error: "Error setting up request: " + error.message };
            }
        }
    };

    const logout = () => {
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem("user");
    };

    const authValue = {
        user,
        isLoggedIn,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
    );
};

export default AuthProvider;
