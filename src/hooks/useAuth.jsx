import { createContext, useContext, useState, useEffect } from "react";
import axios from "@/config/api";

// Create Auth Context to store auth state
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
    return useContext(AuthContext);
};

// Auth Provider component to wrap the app and provide auth state
// children is a prop that represents the nested components
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => {
        if(localStorage.getItem('token')){
            return localStorage.getItem('token');
        }
        else {
            return null;
        }
    });

    const onLogin = async (email, password) => {
        const options = {
            method: "POST",
            url: "/login",
            data: {
                email,
                password
            }
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);
            localStorage.setItem("token", response.data.token);
            setToken(response.data.token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
            return response.data;
        } catch (err) {
            console.log(err.response?.data || err.message);
            throw err;
        }
    };

    const register = async (formData) => {
        const options = {
            method: "POST",
            url: "/register",
            data: formData
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user || response.data));
                setToken(response.data.token);
                axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
            }

            return response.data;
        } catch (err) {
            console.log(err.response?.data || err.message);
            throw err;
        }
    };

    const onLogout = () => {
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common["Authorization"];
    };

    const value = {
        token,
        onLogin,
        onLogout,
        register
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>

};