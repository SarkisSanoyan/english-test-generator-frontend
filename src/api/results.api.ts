import axios from "axios";
import { RESULTS_API } from "../config/api.config";

export const fetchAllResults = async () => {
    const res = await axios.get(RESULTS_API, {
        withCredentials: true,
    });

    return res.data;
};