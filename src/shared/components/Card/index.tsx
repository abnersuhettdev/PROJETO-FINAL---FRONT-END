/* eslint-disable react/prop-types */
import { Folder, FolderOutlined } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Divider, Grid, IconButton, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

import { INotes } from '../../../configs/types/Notes';
import { useAppDispatch } from '../../../store/hooks';
import { showModalNotes } from '../../../store/modules/ModalNotes/modalNotesSlice';
import { archiveNotesAsyncThunk } from '../../../store/modules/Notes/newnotesSlice';

interface NotesProps {
	note: INotes;
}

export const MyCard: React.FC<NotesProps> = ({ note }) => {
	const dispatch = useAppDispatch();

	const archiveNote = async () => {
		console.log('arquivar');
		await dispatch(archiveNotesAsyncThunk({ id: note.id }));
	};

	return (
		<Card sx={{ minWidth: 260 }}>
			<CardContent>
				<Typography
					variant="h5"
					component={'h3'}
					sx={{
						marginBottom: 1,
					}}
				>
					{note.title}
				</Typography>
				<Divider />
				<Typography variant="body1" component={'p'} marginTop={1}>
					{note.description}
				</Typography>
			</CardContent>
			<Divider />
			<CardActions>
				<Grid container alignItems={'center'}>
					<Grid item flexGrow={1}>
						<Typography
							variant="caption"
							color={'text.secondary'}
							component={'span'}
						>
							Criado Em : {note.createdAt}
						</Typography>
					</Grid>
					<Grid item justifyContent={'flex-end'}>
						<IconButton onClick={archiveNote}>
							{!note.arquived && <Folder />}
							{note.arquived && <FolderOutlined />}
						</IconButton>
						<IconButton
							onClick={() =>
								dispatch(
									showModalNotes({
										contexto: 'update',
										recadoSelecionado: note,
									}),
								)
							}
						>
							<EditIcon color="primary" />
						</IconButton>
						<IconButton
							onClick={() =>
								dispatch(
									showModalNotes({
										contexto: 'delete',
										recadoSelecionado: note,
									}),
								)
							}
						>
							<DeleteIcon color="error" />
						</IconButton>
					</Grid>
				</Grid>
			</CardActions>
		</Card>
	);
};
