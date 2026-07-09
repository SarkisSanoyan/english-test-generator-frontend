import { createContext, useState, useEffect } from "react";
import axios from "axios";
import type { User } from "../types/types";
import { apiLogout, getAuthToken, setAuthToken } from "../api/auth.api";
import { AUTH_API } from "../config/api.config";

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (userData: User, token?: string | null) => void;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = { children: React.ReactNode };

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Ensure axios sends cookies for cross-site requests (cookie-based auth)
    axios.defaults.withCredentials = true;

    useEffect(() => {
        const token = getAuthToken();
        if (token) {
            setAuthToken(token);
        }

        const interceptorId = axios.interceptors.request.use((config) => {
            const activeToken = getAuthToken();
            if (activeToken && config.headers) {
                config.headers.Authorization = `Bearer ${activeToken}`;
            }
            return config;
        });

        return () => {
            axios.interceptors.request.eject(interceptorId);
        };
    }, []);

    // Initialize auth on app mount
    useEffect(() => {
        const initAuth = async () => {
            try {
                const res = await axios.get(`${AUTH_API}/refresh`, {
                    withCredentials: true,
                });

                if (res.data?.user) {
                    setUser(res.data.user);
                    setIsAuthenticated(true);
                    if (res.data?.token) {
                        setAuthToken(res.data.token);
                    }
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                    setAuthToken(null);
                }
            } catch (err) {
                console.error("Auth initialization failed:", err);
                setUser(null);
                setIsAuthenticated(false);
                setAuthToken(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);


    const login = (userData: User, token?: string | null) => {
        setUser(userData);
        setIsAuthenticated(true);
        setAuthToken(token ?? null);
    };

    const logout = async () => {
        try {
            await apiLogout();
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            window.location.reload();
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, isAuthenticated, login, logout, loading }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

export { AuthContext };
