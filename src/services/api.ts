import axios from 'axios';

const api = axios.create({
  baseURL: 'http://rfb-backend.test/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export default api;
