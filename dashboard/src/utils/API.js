import axios from 'axios';
import store from '../store';

// Set up axios
const dev_envs = ['localhost', 'dev', '127.0.0.1'];
const env = (dev_envs.find(a => window.location.host.includes(a))) ? 'dev': 'production';
const API_BASE_URL = env === 'dev' ? 'http://localhost:3000/api' : 'https://api.company.org/api'; // REDACTED to just company.org

const service = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000
});

service.interceptors.request.use(
  async (config) => {
    const token = store.state.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject (error);
  }
);

export default service;
