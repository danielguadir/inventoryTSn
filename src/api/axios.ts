import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api', // Ajustar según puerto del backend
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // O obtener del state
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
