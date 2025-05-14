import axios from "axios";

const baseApi = axios.create({
  baseURL: process.env.NODE_ENV === "production" ? import.meta.env.VITE_API_URL : "http://localhost:3000/api",
  timeout: 10000,
  withCredentials:true,
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
  updateProfile:"/admin/update-profile",
  getUsers:"/admin/get-users",
  getUser:"/admin/get-user",
  getFaqs:"/admin/faq",
  createFaqs:"/admin/faq/create",
  updateFaqs:"/admin/faq/update",
  deleteFaqs:"/admin/faq/delete",
}


export const UserTypes = {
  user:"user",
  admin:"admin"
}

export default baseApi;
