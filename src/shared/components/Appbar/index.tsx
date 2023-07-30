/* eslint-disable react/prop-types */
import { Logout } from '@mui/icons-material';
import {
	AppBar,
	Box,
	Divider,
	IconButton,
	Toolbar,
	Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '../../../store/hooks';
import {
	hideLoading,
	showLoading,
} from '../../../store/modules/Loading/loadingSlice';
import { logoutUser } from '../../../store/modules/User/userSlice';

interface AppbarProps {
	usuario: string;
}

export const MyAppbar: React.FC<AppbarProps> = ({ usuario }) => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	function logout() {
		dispatch(showLoading());
		setTimeout(() => {
			dispatch(hideLoading());
			dispatch(logoutUser());
			navigate('/');
		}, 3000);
	}

	return (
		<Box sx={{ flexGrow: 1, height: '10vh' }}>
			<AppBar
				position="static"
				sx={{
					background: 'transparent',
					boxShadow: 0,
				}}
			>
				<Toolbar>
					<Typography
						variant="h4"
						component="div"
						fontWeight={'bold'}
						sx={{ flexGrow: 1 }}
					>
						Olá {usuario}!
					</Typography>

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
				</Toolbar>
			</AppBar>
			<Divider sx={{ height: '2px', background: '#fff' }} />
		</Box>
	);
};
