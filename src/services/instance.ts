import { accessTokenAtom, csrfTokenAtom } from '@/atoms/atoms';
import _axios, { AxiosError } from 'axios';
import { useAtom } from 'jotai';

_axios.defaults.xsrfCookieName = 'csrftoken';
_axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';

const useSetAccessToken = () => {
  const [accessToken] = useAtom(accessTokenAtom);
  return accessToken;
};
const useSetCSRFToken = () => {
  const [csrfToken] = useAtom(csrfTokenAtom);
  return csrfToken;
};

export const axios = _axios.create({
  baseURL: 'https://api.oz-02-main-04.xyz/api/v1/',
  timeout: 0,
  withXSRFToken: true,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(
    config => {
      const [accessToken] = useAtom(accessTokenAtom);
      const [csrfToken] = useAtom(csrfTokenAtom);
      if (accessToken && csrfToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
        config.headers['x-csrftoken'] = `${csrfToken}`;
      }
      // config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE4NzIyMjc3LCJpYXQiOjE3MTg2ODYyNzcsImp0aSI6IjMxNjBlZTJjYjk1MjQxYmM5MWY1NzZiOWM4ZTQ3NmI5IiwidXNlcl9pZCI6MTF9._qiyWUifsE-n_5mCbzf2GN27i5wxdcIhO8mkeUxoznQ`;
      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );
};

axios.interceptors.response.use(
  response => response,
  error => {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      console.error('Error Response:', axiosError.response.data);
      console.error('Status:', axiosError.response.status);
      console.error('Headers:', axiosError.response.headers);
    } else if (axiosError.request) {
      console.error('Error Request:', axiosError.request);
    } else {
      console.error('Error Message:', axiosError.message);
    }
  },
);

// 로컬 테스트용 인증토큰 (혹시목라서..)
// import { accessTokenAtom } from '@/atoms/atoms';
// import _axios, { AxiosError } from 'axios';
// import { useAtom } from 'jotai';

// _axios.defaults.xsrfCookieName = 'csrftoken';
// _axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';

// export const axios = _axios.create({
//   baseURL: 'https://api.oz-02-main-04.xyz/api/v1/',
//   timeout: 0,
//   withXSRFToken: true,
//   withCredentials: true,
//   headers: {
//     Accept: 'application/json',
//   },
// });

// axios.interceptors.request.use(
//   config => {
//     config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE4Nzk1MzQ3LCJpYXQiOjE3MTg3NTkzNDcsImp0aSI6IjUyZWU2YmQ4NWEzYTQ4OTg5OGQxMDBjMjQ5MTkwODEyIiwidXNlcl9pZCI6Mn0.LMx1t7CDW_5mLWr9OJwFibXhMU4Ytq5zsrzKGoHx7v8`;
//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   },
// );

// axios.interceptors.response.use(
//   response => response,
//   error => {
//     const axiosError = error as AxiosError;
//     if (axiosError.response) {
//       console.error('Error Response:', axiosError.response.data);
//       console.error('Status:', axiosError.response.status);
//       console.error('Headers:', axiosError.response.headers);
//     } else if (axiosError.request) {
//       console.error('Error Request:', axiosError.request);
//     } else {
//       console.error('Error Message:', axiosError.message);
//     }
//   },
// );
