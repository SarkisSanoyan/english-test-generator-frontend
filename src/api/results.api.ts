import axios from "axios";
import { ADMIN_RESULTS_API, USER_RESULTS_API } from "../config/api.config";
import { getAuthToken } from "./auth.api";

const RESULT_SYNC_SKIP_STATUS_CODES = new Set([400, 401, 403, 404, 405, 409, 410, 422]);

const shouldSkipResultSync = (error: unknown) => {
    if (!axios.isAxiosError(error)) {
        return false;
    }

    const status = error.response?.status;
    return typeof status === "number" && RESULT_SYNC_SKIP_STATUS_CODES.has(status);
};

export const fetchAllResults = async () => {
    const res = await axios.get(ADMIN_RESULTS_API, {
        withCredentials: true,
    });

    return res.data;
};

export const saveResult = async (payload: {
    quizId: string;
    score: number;
    elapsedTime: number;
    totalQuestions: number;
    userId?: string;
    email?: string;
}) => {
    const token = getAuthToken();

    try {
        const res = await axios.post(USER_RESULTS_API, payload, {
            withCredentials: true,
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        return res.data;
    } catch (error) {
        if (shouldSkipResultSync(error)) {
            return {
                success: false,
                skipped: true,
                message: "Results sync is temporarily unavailable on the backend.",
            };
        }

        throw error;
    }
};
