import axios from "axios";
import { ADMIN_RESULTS_API, USER_RESULTS_API } from "../config/api.config";
import { getAuthToken } from "./auth.api";

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

    const res = await axios.post(USER_RESULTS_API, payload, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    return res.data;
};
