import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

let instance: AxiosInstance;

export const getInstance = () => {
  if (instance) return instance;

  instance = Axios.create({
    baseURL: process.env.REACT_APP_CARDURL,
  });
  // instance.interceptors.request.use(async (config) => {
  //   let token = getStoredSynapseToken();
  //   if (!token) {
  //     token = await authenticationService.getSynpaseToken();
  //     storeSynapseToken(token);
  //   }

  //   return Promise.resolve({
  //     ...config,
  //     headers: {
  //       ...config.headers,
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  // });

  // instance.interceptors.response.use(undefined, async (error) => {
  //   console.error(error);

  //   if (!error.isAxiosError || error.response?.status !== 403) {
  //     return Promise.reject(error);
  //   }

  //   if (error.config?.__retryCount === 1) {
  //     return Promise.reject(error);
  //   }

  //   removeStoredSynapseToken();
  //   return instance.request({
  //     ...error.config,
  //     __retryCount: 1,
  //   });
  // });

  return instance;
};

export const cardApi = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const { data } = await getInstance()(config);
  return data;
};

export default cardApi;
