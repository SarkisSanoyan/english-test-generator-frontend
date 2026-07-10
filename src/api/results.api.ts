import axios from "axios";
import { ADMIN_RESULTS_API, USER_RESULTS_API } from "../config/api.config";
import { getAuthToken } from "./auth.api";

const isCrossOriginResultSyncDisabled = () => {
    if (typeof window === "undefined") {
        return true;
    }

    const currentOrigin = window.location.origin;
    const apiOrigin = new URL(USER_RESULTS_API).origin;

    return currentOrigin !== apiOrigin;
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
    if (isCrossOriginResultSyncDisabled()) {
        return {
            success: false,
            skipped: true,
            message: "Result sync is disabled because the frontend and backend origins do not match.",
        };
    }

    const token = getAuthToken();

    const res = await axios.post(USER_RESULTS_API, payload, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    return res.data;
};
