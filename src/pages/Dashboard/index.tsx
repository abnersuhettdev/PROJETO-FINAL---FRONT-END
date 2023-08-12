import { Add } from '@mui/icons-material';
import { Grid, IconButton } from '@mui/material';
import Fab from '@mui/material/Fab';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { MyAppbar } from '../../shared/components/Appbar';
import { MyCard } from '../../shared/components/Card';
import { Loading } from '../../shared/components/Loading';
import { ModalNotes } from '../../shared/components/ModalNotes';
import { MySnackbar } from '../../shared/components/Snackbar';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { showModalNotes } from '../../store/modules/ModalNotes/modalNotesSlice';
import { listAllNotes } from '../../store/modules/Notes/newnotesSlice';

export const Dashboard = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const select = useAppSelector(listAllNotes);
	const estadoUser = useAppSelector((estado) => estado.users);
	const userLogged = localStorage.getItem('userLogged');

	const [username, setUsername] = useState('');
	const [idUserLogged, setIdUserLogged] = useState('');

	useEffect(() => {
		setUsername(estadoUser.user.name);
		setIdUserLogged(estadoUser.user.id);
	}, [estadoUser.user.name, estadoUser.user.id, username, idUserLogged]);

	// useEffect(() => {
	// 	if (!estadoUser.user.logged) {
	// 		navigate('/');
	// 	}
	// }, [estadoUser, navigate]);

	useEffect(() => {
		if (!userLogged) {
			navigate('/');
		}
		console.log(userLogged);
	});

	return (
		<>
			<Grid
				container
				paddingTop={2}
				sx={{
					position: 'relative',
				}}
			>
				<MyAppbar usuario={username} />

				<Grid
					container
					spacing={2}
					padding={2}
					marginTop={1}
					minWidth={'fit-content'}
				>
					{select.map(
						(note) =>
							note.criadoPor === idUserLogged && (
								<Grid key={note.id} item xs={12} sm={6} md={4}>
									<MyCard note={note} />
								</Grid>
							),
					)}
				</Grid>

				<IconButton
					onClick={() =>
						dispatch(showModalNotes({ contexto: 'create' }))
					}
				>
					<Fab
						sx={{
							position: 'fixed',
							bottom: 0,
							right: 0,
							margin: '30px',
							width: '50px',
							height: '50px',
							background: '#F786AA',

							'&:hover': {
								background: '#576CA8',
							},
						}}
					>
						<Add color="action" />
					</Fab>
				</IconButton>
				<Loading />
			</Grid>
			<ModalNotes idUserLogged={idUserLogged} />
			<MySnackbar />
		</>
	);
};
