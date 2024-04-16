import axios from 'axios';
import { refreshToken } from '../actions/authAction';

axios.defaults.baseURL = import.meta.env.VITE_baseURL || 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_baseURL || 'http://localhost:5000',
  withCredentials: true
});

const axiosPublicInstance = axios.create({
  baseURL: import.meta.env.VITE_baseURL || 'http://localhost:5000',
  withCredentials: true
});

let store;

const injectStore = (_store) => {
  store = _store;
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.access_token;
    if (!config.headers['Authorization'] && token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevReq = error?.config;
    if (
      (error?.response?.status === 403 || error?.response?.status === 401) &&
      !prevReq.sent
    ) {
      prevReq.sent = true;
      try {
        await store.dispatch(refreshToken());
        prevReq.headers['Authorization'] = `Bearer ${
          store.getState().auth.access_token
        }`;
        return axiosInstance(prevReq);
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export { axiosInstance, axiosPublicInstance, injectStore };
