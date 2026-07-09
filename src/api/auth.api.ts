import axios from "axios";
import { AUTH_API } from "../config/api.config";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ForgotPasswordRequest,
  ChangePasswordRequest,
} from "../types/types";

const AUTH_STORAGE_KEY = "english_test_auth_token";

let inMemoryAuthToken: string | null = null;

const extractAuthToken = (payload: unknown): string | null => {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const data = payload as Record<string, unknown>;
  const candidates = [
    data.token,
    data.accessToken,
    data.access_token,
    data.jwt,
    data.authToken,
    data.authorization,
    data.Authorization,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  return null;
};

export const setAuthToken = (token?: string | null) => {
  inMemoryAuthToken = token ?? null;

  if (typeof window !== "undefined") {
    if (token) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, token);
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }

  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete axios.defaults.headers.common.Authorization;
};

export const getAuthToken = () => {
  if (inMemoryAuthToken) {
    return inMemoryAuthToken;
  }

  if (typeof window === "undefined") {
    return null;
  }

  const storedToken = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (storedToken) {
    inMemoryAuthToken = storedToken;
  }

  return inMemoryAuthToken;
};

export const apiLogin = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await axios.post(`${AUTH_API}/login`, data, {
    withCredentials: true,
  });

  setAuthToken(extractAuthToken(response.data));
  return response.data;
};

export const apiAdminLogin = async (
  data: LoginRequest,
): Promise<AuthResponse> => {
  const response = await axios.post(`${AUTH_API}/admin/login`, data, {
    withCredentials: true,
  });

  setAuthToken(extractAuthToken(response.data));
  return response.data;
};

export const apiRegister = async (
  data: RegisterRequest,
): Promise<AuthResponse> => {
  const response = await axios.post(`${AUTH_API}/register`, data, {
    withCredentials: true,
  });

  setAuthToken(extractAuthToken(response.data));
  return response.data;
};

export const apiLogout = async (): Promise<void> => {
  try {
    await axios.post(`${AUTH_API}/logout`, {}, { withCredentials: true });
  } catch (e) {
    console.error("Logout failed", e);
  } finally {
    setAuthToken(null);
    console.log("Clearing local auth state");
  }
};

export const apiForgotPassword = async (
  data: ForgotPasswordRequest,
): Promise<void> => {
  await axios.post(`${AUTH_API}/forgot-password`, data);
};

export const apiResetPassword = async (data: {
  token: string;
  newPassword: string;
}): Promise<{ message: string }> => {
  const response = await axios.post(`${AUTH_API}/reset-password`, data);
  return response.data;
};

export const apiChangePassword = async (
  data: ChangePasswordRequest,
): Promise<{ message: string }> => {
  // We use withCredentials: true because the route is protected by verifyToken (cookie-based)
  const response = await axios.post(`${AUTH_API}/change-password`, data, {
    withCredentials: true,
  });
  return response.data;
};
