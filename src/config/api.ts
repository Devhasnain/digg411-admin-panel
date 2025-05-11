import axios from "axios";

const baseApi = axios.create({
  baseURL: process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_API_URL : "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});


baseApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Axios error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const endpoints = {
  login: "/auth/login",
  signup: "/auth/sign-up",
  lookup: "/auth/lookup",
  google: "/auth/google",
  checkout: "/stripe/checkout",
  portal: "/stripe/portal",
  logout: "/auth/logout",
  updatePassword: "/auth/update-password",
  setNewPassword: "/auth/new-password",
  getOtp: "/auth/get-otp",
  verifyOtp: "/auth/verify-otp",
  queryOwners: "/owners/query-owners",
  ownerDetails: "/owners",
}

export default baseApi;
