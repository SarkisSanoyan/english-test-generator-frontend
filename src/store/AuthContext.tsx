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

type AuthProviderProps = {
    children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Send cookies with every request
    axios.defaults.withCredentials = true;

    // Add token interceptor once
    useEffect(() => {
        const interceptorId = axios.interceptors.request.use((config) => {
            const token = getAuthToken();

            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        });

        return () => {
            axios.interceptors.request.eject(interceptorId);
        };
    }, []);


    // Restore authentication after refresh
    useEffect(() => {
        const initAuth = async () => {
            try {
                const res = await axios.get(`${AUTH_API}/refresh`, {
                    withCredentials: true,
                });

                if (res.data?.user) {
                    setUser(res.data.user);
                    setIsAuthenticated(true);

                    if (res.data.token) {
                        setAuthToken(res.data.token);
                    }
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                    setAuthToken(null);
                }

            } catch (error) {
                console.error("Auth restore failed:", error);

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
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            setAuthToken(null);
        }
    };


    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                login,
                logout,
                loading,
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};


export { AuthContext };