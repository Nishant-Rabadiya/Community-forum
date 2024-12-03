import axios from "axios";

export const axiosIntance = axios?.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});
