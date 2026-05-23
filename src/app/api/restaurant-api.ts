import axios from "axios";

import { getEnvVariables } from "../../shared/lib/helpers";
import { useAuthStore } from "@/modules/auth/store/auth.store";

const { VITE_API_URL } = getEnvVariables();

const restaurantApi = axios.create({
  baseURL: VITE_API_URL,
  //withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

restaurantApi.interceptors.request.use(async (config) => {
  // Verificar si tenemos un token en el secure storage
  const token = localStorage.getItem("token") || "";
  const restaurant = useAuthStore.getState().restaurant;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (restaurant) {
    config.headers["x-restaurant-id"] = restaurant.id;
  }

  return config;
});

// restauranteApi.interceptors.request.use((config) => {
//   const restaurant = useAuthStore.getState().restaurant;
//
//   config.headers = {
//     ...config.headers,
//     Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
//   };
//
//   if (restaurant) {
//     config.headers["x-restaurant-id"] = restaurant.id;
//   }
//
//   return config;
// });
//
restaurantApi.interceptors.response.use(
  (resp) => resp,
  (err) => {
    // toast.error(
    //   err.response?.data?.message ||
    //     "An error occurred while processing your request.",
    // );
    return Promise.reject(err.response);
  },
);

export default restaurantApi;
