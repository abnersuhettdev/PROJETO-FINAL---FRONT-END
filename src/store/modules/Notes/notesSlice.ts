import {
	createAsyncThunk,
	createEntityAdapter,
	createSlice,
} from '@reduxjs/toolkit';

import { RootState } from '../..';
import serviceAPI from '../../../configs/services/integration.api';
import {
	CreateNote,
	DeletedNoteReturn,
	GetNotes,
	INotes,
	NotesListReturn,
	ReturnNote,
	UpdateNote,
	UpdateNoteReturn,
} from '../../../configs/types/Notes';
import { showSnackbar } from '../Snackbar/snackbarSlice';

const notesAdapter = createEntityAdapter<INotes>({
	selectId: (state) => state.id,
});

export const createNoteAsyncThunk = createAsyncThunk(
	'/notes/create',
	async (data: CreateNote, { dispatch }) => {
		try {
			const response = await serviceAPI.post(`/notes/${data.authorId}`, {
				title: data.title,
				description: data.description,
			});

			dispatch(
				showSnackbar({
					tipo: 'success',
					mensagem: 'Recado criado com sucesso',
				}),
			);

			return response.data as ReturnNote;
		} catch (err) {
			dispatch(
				showSnackbar({
					tipo: 'error',
					mensagem: 'Erro ao criar o recado',
				}),
			);
			throw err;
		}
	},
);

export const getNotesAsyncThunk = createAsyncThunk(
	'notes/list',
	async ({ title }: GetNotes, { getState, dispatch }) => {
		try {
			const user = (getState() as RootState).users.user;

			const response = await serviceAPI.get(`/notes/${user.id}`, {
				params: {
					title,
				},
			});

			dispatch(
				showSnackbar({
					tipo: 'success',
					mensagem: 'Recados carregados com sucesso',
				}),
			);

			return response.data as NotesListReturn;
		} catch (err) {
			dispatch(
				showSnackbar({
					tipo: 'error',
					mensagem: 'Erro ao carregar as notas',
				}),
			);
			throw err;
		}
	},
);

export const updateNotesAsyncThunk = createAsyncThunk(
	'notes/updateNote',
	async (data: UpdateNote, { getState, dispatch }) => {
		try {
			const user = (getState() as RootState).users.user;

			const response = await serviceAPI.put(
				`/notes/${user.id}/${data.id}`,
				{
					title: data.title,
					description: data.description,
				},
			);

			dispatch(
				showSnackbar({
					tipo: 'success',
					mensagem: 'Recado atualizado com sucesso',
				}),
			);

			return response.data as UpdateNoteReturn;
		} catch (err) {
			dispatch(
				showSnackbar({
					tipo: 'error',
					mensagem: 'Erro ao atualizar',
				}),
			);
			throw err;
		}
	},
);

export const deleteNotesAsyncThunk = createAsyncThunk(
	'notes/delete',
	async ({ id }: { id: string }, { getState, dispatch }) => {
		try {
			const user = (getState() as RootState).users.user;

			const response = await serviceAPI.delete(`/notes/${user.id}/${id}`);

			dispatch(
				showSnackbar({
					tipo: 'success',
					mensagem: 'Recado deletado com sucesso',
				}),
			);

			return response.data as DeletedNoteReturn;
		} catch (err) {
			dispatch(
				showSnackbar({
					tipo: 'error',
					mensagem: 'Não foi possível deletar o recado',
				}),
			);
			throw err;
		}
	},
);

export const archiveNotesAsyncThunk = createAsyncThunk(
	'notes/archive',
	async ({ id }: { id: string }, { getState, dispatch }) => {
		try {
			const user = (getState() as RootState).users.user;

			const response = await serviceAPI.put(
				`/notes/${user.id}/${id}/archive`,
			);

			dispatch(
				showSnackbar({
					tipo: 'success',
					mensagem:
						window.location.pathname == '/dashboard'
							? 'Recado arquivado com sucesso'
							: 'Recado desarquivado com sucesso',
				}),
			);

			return response.data as UpdateNoteReturn;
		} catch (err) {
			dispatch(
				showSnackbar({
					tipo: 'error',
					mensagem: 'Erro ao arquivar',
				}),
			);
			throw err;
		}
	},
);

const notesSlice = createSlice({
	name: 'notes',
	initialState: notesAdapter.getInitialState(),
	reducers: {},
	extraReducers: (builder) => {
		//Create
		builder.addCase(createNoteAsyncThunk.fulfilled, (state, action) => {
			if (action.payload.data.success) {
				notesAdapter.addOne(state, action.payload.data.data);
			}
		});

		//List
		builder.addCase(getNotesAsyncThunk.fulfilled, (state, action) => {
			if (action.payload.success) {
				notesAdapter.setAll(state, action.payload.data);
			}
		});
		builder.addCase(getNotesAsyncThunk.rejected, (state) => {
			notesAdapter.setAll(state, []);
		});

		//update
		builder.addCase(updateNotesAsyncThunk.fulfilled, (state, action) => {
			if (action.payload.success) {
				notesAdapter.updateOne(state, {
					id: action.payload.data.id,
					changes: action.payload.data,
				});
			}
		});

		//Archive
		builder.addCase(archiveNotesAsyncThunk.fulfilled, (state, action) => {
			if (action.payload.success) {
				notesAdapter.updateOne(state, {
					id: action.payload.data.id,
					changes: {
						archived: action.payload.data.archived,
					},
				});
			}
		});

		//Delete
		builder.addCase(deleteNotesAsyncThunk.fulfilled, (state, action) => {
			if (action.payload) {
				notesAdapter.removeOne(state, action.payload.data.id);
			}
		});
	},
});

export const { selectAll: listAllNotes, selectById: selectNoteById } =
	notesAdapter.getSelectors((state: RootState) => state.notes);

export default notesSlice.reducer;
