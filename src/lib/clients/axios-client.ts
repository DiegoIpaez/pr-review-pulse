import axios from 'axios';
import { CONFIG } from '@/constants';

const axiosClient = axios.create({
  baseURL: CONFIG.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosClient;
