import * as Sentry from "@sentry/react-native";
import axios from "axios";

export const backendAPI = axios.create({
  baseURL: "https://nebula-backend-wzrs.onrender.com",
  // baseURL: "http://localhost:3000",
  // baseURL: "http://192.168.1.37:3000",
});

backendAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    Sentry.captureException(error);
    return Promise.reject(error);
  },
);
