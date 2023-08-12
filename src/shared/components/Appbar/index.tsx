/* eslint-disable react/prop-types */
import { Folder, Home, Logout } from '@mui/icons-material';
import {
	AppBar,
	Box,
	Divider,
	Grid,
	IconButton,
	TextField,
	Toolbar,
	Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';

import { useAppDispatch } from '../../../store/hooks';
import {
	hideLoading,
	showLoading,
} from '../../../store/modules/Loading/loadingSlice';
import { getNotesAsyncThunk } from '../../../store/modules/Notes/newnotesSlice';
import { logoutUser } from '../../../store/modules/User/userSlice';

interface AppbarProps {
	usuario: string;
}

export const MyAppbar: React.FC<AppbarProps> = ({ usuario }) => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const route = useLocation();
	const [filter, setFilter] = useState('');
	const [value] = useDebounce(filter, 1000);

	function logout() {
		dispatch(showLoading());
		setTimeout(() => {
			dispatch(hideLoading());
			dispatch(logoutUser());
			navigate('/');
		}, 3000);
	}

	useEffect(() => {
		if (value) {
			dispatch(
				getNotesAsyncThunk({
					title: filter,
				}),
			);
		}
	}, [value]);

	return (
		<Box sx={{ flexGrow: 1, height: '10vh' }}>
			<AppBar
				position="static"
				sx={{
					background: 'transparent',
					boxShadow: 0,
				}}
			>
				<Toolbar
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<Grid>
						<Typography
							variant="h4"
							component="div"
							fontWeight={'bold'}
							sx={{ flexGrow: 1 }}
						>
							Olá {usuario}!
						</Typography>
					</Grid>

					<Grid
						sx={{
							marginBottom: 2,
							bgcolor: '#ffff',
							borderRadius: 3,
							width: '50%',
						}}
					>
						<TextField
							id="outlined-basic"
							label="Buscar"
							value={filter}
							variant="filled"
							sx={{
								width: '100%',
								borderBottom: 'none',
							}}
							onChange={(ev) => {
								setFilter(ev.target.value);
							}}
						/>
					</Grid>

					<Grid>
						{route.pathname !== '/arquived' ? (
							<IconButton
								onClick={() => {
									navigate('/arquived');
								}}
								color="inherit"
								sx={{
									'&:hover': {
										background: '#576CA8',
									},
								}}
							>
								<Folder />
							</IconButton>
						) : (
							<IconButton
								onClick={() => {
									navigate('/dashboard');
								}}
								color="inherit"
								sx={{
									'&:hover': {
										background: '#576CA8',
									},
								}}
							>
								<Home />
							</IconButton>
						)}

						<IconButton
							onClick={logout}
							color="inherit"
							sx={{
								'&:hover': {
									background: '#576CA8',
								},
							}}
						>
							<Logout />
						</IconButton>
					</Grid>
				</Toolbar>
			</AppBar>
			<Divider sx={{ height: '2px', background: '#fff' }} />
		</Box>
	);
};
