/* eslint-disable react/prop-types */
import { Folder, Logout } from '@mui/icons-material';
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
							variant="filled"
							sx={{
								width: '100%',
								borderBottom: 'none',
							}}
						/>
					</Grid>

					<Grid>
						<IconButton
							onClick={() => console.log('Arquivar')}
							color="inherit"
							sx={{
								'&:hover': {
									background: '#576CA8',
								},
							}}
						>
							<Folder />
						</IconButton>
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
