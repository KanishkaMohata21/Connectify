import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        user: null,
        token: ""
    });

    useEffect(() => {
        const data = localStorage.getItem('auth');
        if (data) {
            try {
                const parsedData = JSON.parse(data);
                setAuth({
                    user: parsedData.user,
                    token: parsedData.token
                });
            } catch (error) {
                console.error("Error parsing auth data from localStorage:", error);
                // Handle the error, e.g., clear localStorage or fallback to default state
                localStorage.removeItem('auth'); // Clear corrupted data
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
