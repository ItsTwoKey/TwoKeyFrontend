import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import { auth } from "../helper/firebaseClient";

const apiEndpoint = process.env.REACT_APP_BACKEND_BASE_URL;

if (!apiEndpoint) throw new Error("Are you sure about the api url env");

/**
 * @name Axios Interceptor
 * @description Pre fills access token for every call
 */
const api = axios.create({
  baseURL: apiEndpoint,
});

api.interceptors.request.use(async (config) => {
  const token = await auth.currentUser.getIdToken();
  console.log({ token });
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export { api };
