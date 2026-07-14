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


    useEffect(() => {
        axios.defaults.withCredentials = true;


        // Add access token to every request
        const requestInterceptor = axios.interceptors.request.use(
            (config) => {
                const token = getAuthToken();

                if (token) {
                    config.headers.Authorization =
                        `Bearer ${token}`;
                }

                return config;
            },
            (error) => Promise.reject(error)
        );


        // Refresh token automatically when access token expires
        const responseInterceptor = axios.interceptors.response.use(
            (response) => response,

            async (error) => {
                const originalRequest = error.config;


                if (
                    (error.response?.status === 401 ||
                        error.response?.status === 403) &&
                    !originalRequest._retry
                ) {
                    originalRequest._retry = true;

                    try {
                        const response = await axios.post(
                            `${AUTH_API}/refresh`,
                            {},
                            {
                                withCredentials: true,
                            }
                        );


                        const newAccessToken =
                            response.data.accessToken;


                        if (newAccessToken) {
                            setAuthToken(newAccessToken);

                            originalRequest.headers.Authorization =
                                `Bearer ${newAccessToken}`;
                        }


                        return axios(originalRequest);

                    } catch (refreshError) {
                        setAuthToken(null);
                        setUser(null);
                        setIsAuthenticated(false);

                        return Promise.reject(refreshError);
                    }
                }


                return Promise.reject(error);
            }
        );


        return () => {
            axios.interceptors.request.eject(
                requestInterceptor
            );

            axios.interceptors.response.eject(
                responseInterceptor
            );
        };

    }, []);



    // Initialize authentication
    useEffect(() => {

        const initAuth = async () => {
            try {

                const response = await axios.post(
                    `${AUTH_API}/refresh`,
                    {},
                    {
                        withCredentials: true,
                    }
                );


                if (response.data?.user) {

                    setUser(response.data.user);
                    setIsAuthenticated(true);


                    if (response.data.accessToken) {
                        setAuthToken(
                            response.data.accessToken
                        );
                    }

                } else {

                    setUser(null);
                    setIsAuthenticated(false);
                    setAuthToken(null);

                }


            } catch (error) {

                console.error(
                    "Auth initialization failed:",
                    error
                );

                setUser(null);
                setIsAuthenticated(false);
                setAuthToken(null);

            } finally {

                setLoading(false);

            }
        };


        initAuth();

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

        } catch (error) {

            console.error(
                "Logout failed:",
                error
            );

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
                loading,
                login,
                logout,
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};


export { AuthContext };