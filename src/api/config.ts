import axios, { AxiosHeaders, AxiosRequestConfig } from "axios";

const Request = axios.create({
  timeout: 30000,
  baseURL: import.meta.env.VITE_BASE_URL,
});

const requestConfiguration = (config: AxiosRequestConfig) => {
  return {
    ...config,
    headers: {
      Authorization: `Basic dXNlcm5hbWU6cGFzc3dvcmQ=`,
      ...config.headers,
    } as unknown as AxiosHeaders,
  };
};

Request.interceptors.request.use(requestConfiguration, (error) => {
  return Promise.reject(error);
});

export { Request }; 