import axios from 'axios';

const serviceAPI = axios.create({
	baseURL: 'https://api-notes-cft2.onrender.com',
	// baseURL: import.meta.env.VITE_API_URL,
});

export default serviceAPI;
