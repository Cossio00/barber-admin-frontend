import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
  baseURL: 'https://barber-admin-backend.onrender.com',   
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      const isExpired = error.response?.data?.message?.toLowerCase().includes("token") || 
                       error.response?.data?.error?.includes("TOKEN");

      if (isExpired || status === 401) {
        toast.error("Sua sessão expirou. Faça login novamente.");
        
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        setTimeout(() => {
          window.location.href = '/login';
        }, 800);
      }
    }

    return Promise.reject(error);
  }
);

export default api;