import axios from "axios";
import { auth } from "../helper/firebaseClient";
// import { authStateKnown } from "../helper/firebaseClient";

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
  // const user = await authStateKnown;
  const user = auth.currentUser;
  if (user) {
    try {
      const token = await user.getIdToken();
      // console.log({ token });
      if (token) {
        config.headers.Authorization = token;
      }
    } catch (error) {
      console.error("Error fetching token:", { error });
    }
  }

  return config;
});

export { api };
