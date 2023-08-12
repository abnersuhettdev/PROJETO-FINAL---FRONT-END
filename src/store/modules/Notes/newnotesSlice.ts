import {
	createAsyncThunk,
	createEntityAdapter,
	createSlice,
} from '@reduxjs/toolkit';

import { RootState } from '../..';
import serviceAPI from '../../../configs/services/integration.api';
import { INotes } from '../../../configs/types/Notes';
import { showLoading } from '../Loading/loadingSlice';
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
	async ({ authorId, title, archived }: GetNotes) => {
		const response = await serviceAPI.get(`/notes/${authorId}`, {
			params: {
				title,
				archived,
			},
		});

		return response.data as NotesListReturn;
	},
);

export const updateNotesAsyncThunk = createAsyncThunk(
	'notes/updateNote',
	async (data: UpdateNote) => {
		const response = await serviceAPI.put(
			`/notes/${data.authorId}/${data.id}`,
			{
				title: data.title,
				description: data.description,
			},
		);

		return response.data as UpdateNoteReturn;
	},
);

export const deleteNotesAsyncThunk = createAsyncThunk(
	'notes/delete',
	async ({ id, authorId }: { id: string; authorId: string }) => {
		const response = await serviceAPI.delete(`/notes/${authorId}/${id}`);

		return response.data as DeletedNoteReturn;
	},
);

export const archiveNotesAsyncThunk = createAsyncThunk(
	'notes/archive',
	async ({ id, authorId }: { id: string; authorId: string }) => {
		const response = await serviceAPI.put(
			`/notes/${authorId}/${id}/arquive`,
		);
		return response.data as UpdateNoteReturn;
	},
);

const notesSlice = createSlice({
	name: 'notes',
	initialState: notesAdapter.getInitialState(),
	reducers: {},
	extraReducers: (builder) => {
		//Create
		builder.addCase(createNoteAsyncThunk.fulfilled, (state, action) => {
			if (action.payload.success) {
				notesAdapter.addOne(state, action.payload.note);

				console.log(action.payload);
			}
		});
		builder.addCase(createNoteAsyncThunk.rejected, (state, action) => {
			console.log(action.payload);

			return notesAdapter.getInitialState();
		});

		//List
		builder.addCase(getNotesAsyncThunk.fulfilled, (state, action) => {
			if (action.payload.success) {
				notesAdapter.setAll(state, action.payload.notes);
			}
			setTimeout(() => {
				showLoading();
			}, 2000);
		});
		builder.addCase(getNotesAsyncThunk.rejected, (state) => {
			notesAdapter.setAll(state, []);
		});

		//update
		builder.addCase(updateNotesAsyncThunk.fulfilled, (state, action) => {
			if (action.payload.success) {
				notesAdapter.updateOne(state, {
					id: action.payload.updatedData.id,
					changes: action.payload.updatedData,
				});
			}
		});
		builder.addCase(updateNotesAsyncThunk.rejected, () => {
			return notesAdapter.getInitialState();
		});

		//Archive
		builder.addCase(archiveNotesAsyncThunk.fulfilled, (state, action) => {
			if (action.payload.success) {
				notesAdapter.updateOne(state, {
					id: action.payload.updatedData.id,
					changes: action.payload.updatedData,
				});
			}
		});
		builder.addCase(archiveNotesAsyncThunk.rejected, () => {
			return notesAdapter.getInitialState();
		});

		//Delete
		builder.addCase(deleteNotesAsyncThunk.fulfilled, (state, action) => {
			if (action.payload.success) {
				notesAdapter.removeOne(state, action.payload.deletedNote.id);
			}
		});
		builder.addCase(deleteNotesAsyncThunk.rejected, () => {
			return notesAdapter.getInitialState();
		});
	},
});

export const { selectAll: listAllNotes, selectById: selectNoteById } =
	notesAdapter.getSelectors((state: RootState) => state.notes);

export default notesSlice.reducer;
