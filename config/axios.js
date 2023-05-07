
import 'dotenv/config';
import axios from 'axios';
import HEADER from '../constants/HTTP_HEADERS';
export const
  appApi = axios.create({
    baseURL: process.env.IBOT_API_URL,
    //baseURL: process.env.CP_ENDPOINT,
    headers: {
      //'Ocp-Apim-Subscription-Key': HEADER.Ocp_Apim_Subscription_Key,
      //  'Ocp-Apim-Trace': HEADER.Ocp_Apim_Trace,
    }
  });

export const updateApi = axios.create({
  baseURL: process.env.IBOT_API_URL_UPDATE_SYNC,
  headers: {
    'Ocp-Apim-Subscription-Key': HEADER.Ocp_Apim_Subscription_Key,
    'Ocp-Apim-Trace': HEADER.Ocp_Apim_Trace
  }
});

export const functionsApi = axios.create({
  baseURL: process.env.IBOT_API_URL_FUNCTIONS_APP,
  headers: {
    'Ocp-Apim-Subscription-Key': HEADER.Ocp_Apim_Subscription_Key,
    'Ocp-Apim-Trace': HEADER.Ocp_Apim_Trace
  }
});


export const cronRCPcalls = axios.create({
  baseURL: process.env.RCP_ENDPOINT,
});

export const cpApi = axios.create({
  baseURL: process.env.CP_ENDPOINT,
});

// Add a request interceptor
cpApi.interceptors.request.use(function (config) {
  config.params['access_token'] = HEADER.cpAccessToken;
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

cpApi.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response.data.data;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
});


// Add a request interceptor
appApi.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
appApi.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
});


// Add a request interceptor
functionsApi.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
functionsApi.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
});


export const epdclServer = axios.create({
  baseURL: process.env.EPDCL_SERVER,
  headers: {
    'Authorization': HEADER.EPDCL_JWT,
  }
});
// Add a response interceptor
epdclServer.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
});


// Add a request interceptor
epdclServer.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});