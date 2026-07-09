import axios from "axios";
import type { AxiosResponse } from "axios";
import { QUIZ_API } from "../config/api.config";
import { getAuthToken } from "./auth.api";
import type { CreatedQuizData, ReturnedQuizData } from "../types/types";

export const createQuiz = async (data: CreatedQuizData): Promise<ReturnedQuizData> => {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
      headers["x-access-token"] = token;
      headers["x-auth-token"] = token;
    }

    const res: AxiosResponse<{ quiz: ReturnedQuizData; stats: unknown }> =
      await axios.post(QUIZ_API, data, {
        withCredentials: true,
        headers,
      });

    if (!res.data.quiz) {
      throw new Error("Invalid response from server");
    }

    console.log("Backend response:", res.data.quiz);
    return res.data.quiz;
  } catch (err: unknown) {
    let errorMsg = "Unknown error";
    if (typeof err === "object" && err !== null) {
      const e = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      if (e.response?.data?.message) errorMsg = e.response.data.message;
      else if (e.message) errorMsg = e.message;
    }

    console.error("Error creating quiz:", errorMsg);
    throw new Error(errorMsg);
  }
};
