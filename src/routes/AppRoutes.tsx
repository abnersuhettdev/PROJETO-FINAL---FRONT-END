import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Archived } from '../pages/Archived';
import { Dashboard } from '../pages/Dashboard';
import Home from '../pages/Home';

const AppRoutes: React.FC = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/archived" element={<Archived />} />
			</Routes>
		</BrowserRouter>
	);
};

export default AppRoutes;
