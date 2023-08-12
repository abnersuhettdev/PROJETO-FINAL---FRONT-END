/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react/prop-types */
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	Grid,
	TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { IsValidCredentials } from '../../../configs/types/IsValidCredentials';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { hideModalNotes } from '../../../store/modules/ModalNotes/modalNotesSlice';
import {
	createNoteAsyncThunk,
	deleteNotesAsyncThunk,
	updateNotesAsyncThunk,
} from '../../../store/modules/Notes/notesSlice';

interface ModalNotesProps {
	idUserLogged: string;
}

export const ModalNotes: React.FC<ModalNotesProps> = ({ idUserLogged }) => {
	const select = useAppSelector((state) => state.modal);
	const dispatch = useAppDispatch();

	const [title, setTitle] = useState('');

	const [description, setDescription] = useState('');

	const [erroTitulo, setErroTitulo] = useState<IsValidCredentials>({
		helperText: '',
		isValid: true,
	});

	const [erroDescricao, setErroDescricao] = useState<IsValidCredentials>({
		helperText: '',
		isValid: true,
	});

	useEffect(() => {
		if (select.recadoSelecionado) {
			setTitle(select.recadoSelecionado.title);
			setDescription(select.recadoSelecionado.description);
		} else {
			limpaInputs();
		}
	}, [select.recadoSelecionado]);

	useEffect(() => {
		if (title && title.length < 3) {
			setErroTitulo({
				helperText: 'Insira um title válido',
				isValid: false,
			});
		} else {
			setErroTitulo({
				helperText: '',
				isValid: true,
			});
		}
	}, [title]);

	useEffect(() => {
		if (description && description.length < 3) {
			setErroDescricao({
				helperText: 'Insira uma descrição válida',
				isValid: false,
			});
		} else {
			setErroDescricao({
				helperText: '',
				isValid: true,
			});
		}
	}, [description]);

	async function handleConfirm() {
		if (
			!title ||
			!description ||
			!erroTitulo.isValid ||
			!erroDescricao.isValid
		) {
			return;
		}

		switch (select.contexto) {
			case 'create':
				await dispatch(
					createNoteAsyncThunk({
						title: title,
						description: description,
						authorId: idUserLogged,
					}),
				);

				dispatch(hideModalNotes({ open: false }));
				limpaInputs();

				break;

			case 'update':
				if (select.recadoSelecionado) {
					await dispatch(
						updateNotesAsyncThunk({
							id: select.recadoSelecionado.id,
							description: description,
							title: title,
						}),
					);
				}

				dispatch(hideModalNotes({ open: false }));
				limpaInputs();

				break;
			case 'delete':
				if (select.recadoSelecionado) {
					dispatch(
						deleteNotesAsyncThunk({
							id: select.recadoSelecionado.id,
						}),
					);
				}
				dispatch(hideModalNotes({ open: false }));

				break;
		}
	}

	function limpaInputs() {
		setTitle('');
		setDescription('');
	}

	return (
		<Dialog
			open={select.open!}
			onClose={() =>
				dispatch(hideModalNotes({ contexto: 'create', open: false }))
			}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">
				{select.contexto === 'delete' && 'Deletar Recado'}
				{select.contexto === 'update' && 'Atualizar Recado'}
				{select.contexto === 'create' && 'Criar Recado'}
			</DialogTitle>
			<Divider />
			<DialogContent>
				{select.contexto !== 'delete' && (
					<Grid container spacing={3} marginTop={1}>
						<Grid item xs={12}>
							<TextField
								label={'Titulo'}
								type="text"
								value={title}
								fullWidth
								helperText={erroTitulo.helperText}
								error={!erroTitulo.isValid}
								onChange={(ev) => setTitle(ev.target.value)}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								label={'Descrição'}
								type="text"
								value={description}
								fullWidth
								helperText={erroDescricao.helperText}
								error={!erroDescricao.isValid}
								onChange={(ev) =>
									setDescription(ev.target.value)
								}
							/>
						</Grid>
					</Grid>
				)}
				{select.contexto === 'delete' &&
					'Tem certeza de que deseja deletar este recado? essa ação é irreversível e não poderá ser desfeita'}
			</DialogContent>
			<DialogActions>
				<Button
					variant="outlined"
					onClick={() => dispatch(hideModalNotes({ open: false }))}
				>
					Cancelar
				</Button>
				<Button
					autoFocus
					variant="contained"
					sx={{
						background: '#F786AA',
						'&:hover': { background: '#576CA8' },
					}}
					onClick={handleConfirm}
				>
					Confirmar
				</Button>
			</DialogActions>
		</Dialog>
	);
};
