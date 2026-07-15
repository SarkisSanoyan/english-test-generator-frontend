import {
    createContext,
    useState,
    useEffect,
    useCallback,
} from "react";
import axios from "axios";

import type { User } from "../types/types";
import {
    apiLogout,
    getAuthToken,
    setAuthToken,
} from "../api/auth.api";

import { AUTH_API } from "../config/api.config";

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (userData: User, token?: string | null) => void;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

type AuthProviderProps = {
    children: React.ReactNode;
};

export const AuthProvider = ({
    children,
}: AuthProviderProps) => {

    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const clearAuth = () => {
        setUser(null);
        setIsAuthenticated(false);
        setAuthToken(null);
    };

    const refreshSession = useCallback(async () => {
        try {
            const response = await axios.post(
                `${AUTH_API}/refresh`,
                {},
                {
                    withCredentials: true,
                }
            );

            const {
                user,
                accessToken,
            } = response.data;

            if (accessToken) {
                setAuthToken(accessToken);
            }

            if (user) {
                setUser(user);
                setIsAuthenticated(true);
            }
            return response.data;
        } catch (error) {
            clearAuth();
            throw error;
        }
    }, []);

    useEffect(() => {
        axios.defaults.withCredentials = true;
        // Add access token
        const requestInterceptor =
            axios.interceptors.request.use(
                (config) => {
                    const token = getAuthToken();
                    if (token) {
                        config.headers.Authorization =
                            `Bearer ${token}`;

                    }
                    return config;
                }, (error) =>
                Promise.reject(error)
            );
        // Refresh expired access token
        const responseInterceptor =
            axios.interceptors.response.use(

                (response) =>
                    response, async (error) => {

                        const originalRequest =
                            error.config;
                        if (!originalRequest) {
                            return Promise.reject(error);
                        }
                        const isRefreshRequest =
                            originalRequest.url?.includes(
                                "/auth/refresh"
                            );
                        if (
                            (error.response?.status === 401 ||
                                error.response?.status === 403) &&
                            !originalRequest._retry &&
                            !isRefreshRequest
                        ) {
                            originalRequest._retry = true;


                            try {
                                const response =
                                    await axios.post(
                                        `${AUTH_API}/refresh`,
                                        {},
                                        {
                                            withCredentials: true,
                                        }
                                    );
                                const newToken =
                                    response.data.accessToken;
                                if (newToken) {

                                    setAuthToken(
                                        newToken
                                    );
                                    originalRequest.headers.Authorization =
                                        `Bearer ${newToken}`;

                                }
                                return axios(
                                    originalRequest
                                );
                            } catch (refreshError) {
                                clearAuth();
                                return Promise.reject(
                                    refreshError
                                );
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
    // Restore user session on app start
    useEffect(() => {
        const initAuth = async () => {
            try {
                await refreshSession();
            } catch (error) {

                // Expected when user is not logged in
                console.log(
                    "No active session"
                );
            } finally {
                setLoading(false);

            }
        };
        initAuth();
    }, [refreshSession]);
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
                "Logout error:",
                error
            );
        } finally {
            clearAuth();
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
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };