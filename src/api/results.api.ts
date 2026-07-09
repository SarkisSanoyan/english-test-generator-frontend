import axios from "axios";
import { BASE_URL, RESULTS_API } from "../config/api.config";
import { getAuthToken } from "./auth.api";

export const fetchAllResults = async () => {
    const res = await axios.get(RESULTS_API, {
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

    const res = await axios.post(`${BASE_URL}/results`, payload, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    return res.data;
};
