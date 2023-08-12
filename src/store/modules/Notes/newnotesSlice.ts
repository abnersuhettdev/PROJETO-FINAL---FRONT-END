import {
	createAsyncThunk,
	createEntityAdapter,
	createSlice,
} from '@reduxjs/toolkit';

import { RootState } from '../..';
import serviceAPI from '../../../configs/services/integration.api';
import { INotes } from '../../../configs/types/Notes';
import { showSnackbar } from '../Snackbar/snackbarSlice';
import {
	CreateNote,
	DeletedNoteReturn,
	GetNotes,
	NotesListReturn,
	ReturnNote,
	UpdateNote,
	UpdateNoteReturn,
} from './types';

const notesAdapter = createEntityAdapter<INotes>({
	selectId: (state) => state.id,
});

export const createNoteAsyncThunk = createAsyncThunk(
	'/notes/create',
	async (data: CreateNote) => {
		const response = await serviceAPI.post(`/notes/${data.authorId}`, {
			title: data.title,
			description: data.description,
		});

		return response.data as ReturnNote;
	},
);

export const getNotesAsyncThunk = createAsyncThunk(
	'notes/list',
	async ({ title, arquived }: GetNotes, { getState }) => {
		const user = (getState() as RootState).users.user;

		const response = await serviceAPI.get(`/notes/${user.id}`, {
			params: {
				title,
				arquived,
			},
		});

		return response.data as NotesListReturn;
	},
);

export const updateNotesAsyncThunk = createAsyncThunk(
	'notes/updateNote',
	async (data: UpdateNote, { getState }) => {
		const user = (getState() as RootState).users.user;

		const response = await serviceAPI.put(`/notes/${user.id}/${data.id}`, {
			title: data.title,
			description: data.description,
		});

		return response.data as UpdateNoteReturn;
	},
);

export const deleteNotesAsyncThunk = createAsyncThunk(
	'notes/delete',
	async ({ id }: { id: string }, { getState }) => {
		const user = (getState() as RootState).users.user;

		const response = await serviceAPI.delete(`/notes/${user.id}/${id}`);

		return response.data as DeletedNoteReturn;
	},
);

export const archiveNotesAsyncThunk = createAsyncThunk(
	'notes/archive',
	async ({ id }: { id: string }, { getState, dispatch }) => {
		try {
			const user = (getState() as RootState).users.user;

			const response = await serviceAPI.put(
				`/notes/${user.id}/${id}/arquive`,
			);

			dispatch(
				showSnackbar({
					tipo: 'success',
					mensagem: 'Recado Arquivado com sucesso',
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
				console.log('cheguei no if');
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
						arquived: action.payload.data.arquived,
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
