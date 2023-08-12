import axios from 'axios';

const serviceAPI = axios.create({
	baseURL: import.meta.env.example.VITE_API_URL,
});

export default serviceAPI;
