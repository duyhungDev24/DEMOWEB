import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:3000', // Sử dụng đường dẫn tương đối đã được proxy
    headers: {
        'Content-Type': 'application/json',
    },
});

// Thêm interceptor để gửi token nếu có
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Hoặc nơi bạn lưu trữ token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;
