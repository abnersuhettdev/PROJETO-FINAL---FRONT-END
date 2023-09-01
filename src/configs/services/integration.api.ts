import axios from 'axios';

const serviceAPI = axios.create({
	baseURL: 'https://api-notes-h3mx.onrender.com',
	// baseURL: import.meta.env.VITE_API_URL,
});

export default serviceAPI;
