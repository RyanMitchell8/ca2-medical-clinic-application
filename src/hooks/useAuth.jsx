import { createContext, useContext, useState, useEffect } from "react";
import axios from "@/config/api";
import { set } from "zod";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem("token") || null);
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);

    // Load user info automatically when token exists
    // useEffect(() => {
    //     if (!token || user) return;

    //     const fetchUser = async () => {
    //         try {
    //             const { data } = await axios.get("/", {
    //                 headers: { Authorization: `Bearer ${token}` }
    //             });

    //             setUser(data);
    //             localStorage.setItem("user", JSON.stringify(data));
    //         } catch (err) {
    //             console.error("Failed to load user:", err);
    //             setUser(null);
    //         }
    //     };

    //     fetchUser();
    // }, [token]);

    const onLogin = async (email, password) => {
        try {
            const { data } = await axios.post("/login", { email, password });

            // Store token
            localStorage.setItem("token", data.token);

            axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

            // Store user if returned
            if (data) {
                setToken(data.token);
                setUser(data);
                localStorage.setItem("user", JSON.stringify(data));
            }

            return data;
        } catch (err) {
            console.error(err.response?.data || err.message);
            throw err;
        }
    };

    const register = async (formData) => {
        try {
            const { data } = await axios.post("/register", formData);

            if (data.token) {
                localStorage.setItem("token", data.token);
                axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
                setToken(data.token);
            }

            if (data) {
                setUser(data);
                localStorage.setItem("user", JSON.stringify(data));
            }

            return data;
        } catch (err) {
            console.error(err.response?.data || err.message);
            throw err;
        }
    };

    const onLogout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common["Authorization"];
    };

    const value = {
        token,
        user,
        setUser,
        onLogin,
        onLogout,
        register,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
