/* eslint-disable import/prefer-default-export */
import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3002/api';
export const axiosInstance = axios.create({
  baseURL,
});
