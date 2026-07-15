import { createContext, useState, useEffect } from "react";
import axios from "axios";
import type { User } from "../types/types";
import { apiLogout } from "../api/auth.api";
import { AUTH_API } from "../config/api.config";
import { setAuthToken } from "../api/auth.api";

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (userData: User) => void;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = { children: React.ReactNode };

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Initialize auth on app mount
    useEffect(() => {
        const initAuth = async () => {
            try {
                const res = await axios.post(`${AUTH_API}/refresh`, {
                    withCredentials: true,
                });

                if (res.data?.user) {
                    setUser(res.data.user);
                    setIsAuthenticated(true);
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } catch (err) {
                console.error("Auth initialization failed:", err);
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    // Axios interceptor to handle token refresh on 401/403 responses
    useEffect(() => {
        axios.defaults.withCredentials = true;

        const interceptor =
            axios.interceptors.response.use(
                response => response,
                async error => {
                    const originalRequest = error.config;
                    if (!originalRequest) {
                        return Promise.reject(error);
                    }
                    if (
                        (error.response?.status === 401 ||
                            error.response?.status === 403) &&

                        !originalRequest._retry &&

                        !originalRequest.url.includes("/auth/refresh")
                    ) {

                        originalRequest._retry = true;
                        try {
                            const res = await axios.post(
                                `${AUTH_API}/refresh`,
                                {},
                                {
                                    withCredentials: true,
                                }
                            );
                            const token =
                                res.data.accessToken;
                            if (token) {
                                setAuthToken(token);
                                originalRequest.headers.Authorization =
                                    `Bearer ${token}`;
                            }
                            return axios(originalRequest);
                        } catch (err) {
                            setAuthToken(null);
                            setUser(null);
                            setIsAuthenticated(false);

                            return Promise.reject(err);
                        }
                    }
                    return Promise.reject(error);
                }
            );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    const login = (
        userData: User,
        token?: string | null
    ) => {
        setUser(userData);
        setIsAuthenticated(true);

        if (token) {
            setAuthToken(token);
        }
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