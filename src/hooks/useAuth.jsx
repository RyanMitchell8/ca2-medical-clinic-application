import { createContext, useContext, useState, useEffect } from "react";
import axios from "@/config/api";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem("token") || null);
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });

    // Load user info automatically when token exists
    useEffect(() => {
        if (!token || user) return;

        const fetchUser = async () => {
            try {
                const { data } = await axios.get("/me", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setUser(data);
                localStorage.setItem("user", JSON.stringify(data));
            } catch (err) {
                console.error("Failed to load user:", err);
                setUser(null);
            }
        };

        fetchUser();
    }, [token]);

    const onLogin = async (email, password) => {
        try {
            const { data } = await axios.post("/login", { email, password });

            // Store token
            localStorage.setItem("token", data.token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
            setToken(data.token);

            // Store user if returned
            if (data.user) {
                setUser(data.user);
                localStorage.setItem("user", JSON.stringify(data.user));
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

            if (data.user) {
                setUser(data.user);
                localStorage.setItem("user", JSON.stringify(data.user));
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
