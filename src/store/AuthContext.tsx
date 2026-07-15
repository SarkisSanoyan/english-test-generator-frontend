import { createContext, useState, useEffect } from "react";
import axios from "axios";
import type { User } from "../types/types";
import { apiLogout } from "../api/auth.api";
import { AUTH_API } from "../config/api.config";

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
                const res = await axios.get(`${AUTH_API}/refresh`, {
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


    const login = (userData: User) => {
        setUser(userData);
        setIsAuthenticated(true);
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