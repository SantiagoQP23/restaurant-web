import axios from "axios";

import { getEnvVariables } from "../../shared/lib/helpers";
import { isApiResponse, type ApiResponseMeta } from "./api-response";

declare module "axios" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type
  export interface AxiosResponse<T = any, D = any, H = {}> {
    /** Paginación u otros datos extra de un ApiResponse. */
    meta?: ApiResponseMeta;
  }
}

const { VITE_API_URL } = getEnvVariables();

/**
 * Versión del formato de respuesta. Con `2` el backend envuelve todas las
 * respuestas en un ApiResponse ({ success, data, error, meta, ... }).
 */
export const API_VERSION = "2";

const restaurantApi = axios.create({
  baseURL: VITE_API_URL,
  //withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-Api-Version": API_VERSION,
  },
});

restaurantApi.interceptors.request.use(async (config) => {
  // Verificar si tenemos un token en el secure storage
  const token = localStorage.getItem("token") || "";
  // const restaurant = useAuthStore.getState().restaurant;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // if (restaurant) {
  //   config.headers["x-restaurant-id"] = restaurant.id;
  // }

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
  (resp) => {
    // Desenvuelve el ApiResponse para que `resp.data` siga siendo el
    // payload. Si el backend aún responde sin envoltura, no se toca nada.
    if (isApiResponse(resp.data)) {
      resp.meta = resp.data.meta;
      resp.data = resp.data.data;
    }
    return resp;
  },
  // Se rechaza el error de axios completo (no solo `err.response`) para
  // poder distinguir errores de red. Leerlo con `getApiError` o
  // `getErrorMessage` de `@/shared/lib/errors/get-error-message`.
  (err) => Promise.reject(err),
);

export default restaurantApi;
