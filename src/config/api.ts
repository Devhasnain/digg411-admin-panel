import axios from "axios";


const baseApi = axios.create({
  baseURL: process.env.NODE_ENV === "production"? import.meta.env.VITE_API_URL: "http://localhost:3000/api",
  timeout: 20000,
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
  getCustomers:"/admin/get-customers",
  getUser:"/admin/get-user",
  createUser:"/admin/create-user",
  getFaqs:"/admin/faq",
  createFaqs:"/admin/faq/create",
  updateFaqs:"/admin/faq/update",
  deleteFaqs:"/admin/faq/delete",
  getPage:"/admin/page/get",
  updatePage:"/admin/page/update",
  updateUser:"/admin/update-user",
  deleteUser:"/admin/delete-user",
  addLocation:"/admin/locations/add",
  getLocations:"/admin/locations",
  deleteLocation:"/admin/locations/delete",
  deleteNewsletter:"/admin/newsletter/delete",
  deleteContact:"/admin/contact/delete",
  getContacts:"/admin/contact",
  getNewsLetters:"/admin/newsletter",
  getAnalytics:"/admin/analytics",
  updatePassword:"/admin/update-password",
  addMineral:"/admin/mineral/add",
  uploadBulkMineral:"/admin/mineral/add-bulk",
  getMinerals:"/admin/mineral",
  getPaginatedMinerals:"/admin/mineral/list",
  deleteMineral:"/admin/mineral/delete",
  editMineral:"/admin/mineral/edit",
  getPlans:"/admin/plan",
  createPlan:"/admin/plan/create",
  deletePlan:"/admin/plan/delete",
  editPlan:"/admin/plan/edit",
}


export const UserTypes = {
  user:"user",
  admin:"admin"
}

export default baseApi;
