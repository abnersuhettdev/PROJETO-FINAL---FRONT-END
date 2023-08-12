import {
	createAsyncThunk,
	createEntityAdapter,
	createSlice,
} from '@reduxjs/toolkit';

import { RootState } from '../..';
import serviceAPI from '../../../configs/services/integration.api';
import { INotes } from '../../../configs/types/Notes';
import { useAppDispatch } from '../../hooks';
import { CreateNote, ReturnNote } from './types';

const notesAdapter = createEntityAdapter<INotes>({
	selectId: (state) => state.id,
});

const dispatch = useAppDispatch;

export const createNoteAsyncThunk = createAsyncThunk(
	'/notes/:authorId',
	async (data: CreateNote) => {
		const response = await serviceAPI.post(`/notes/${data.authorId}`, {
			title: data.title,
			description: data.description,
		});

		return response.data as ReturnNote;
	},
);

// export const getNotesAsyncThunk = createAsyncThunk(
// 	'notes/:authorId',
// 	async ({ authorId, title, archived }: GetNotes) => {
// 		const response = await serviceAPI.get(`/notes/${authorId}`, {
// 			params: {
// 				title,
// 				archived,
// 			},
// 		});

// 		return response.data as NotesListReturn;
// 	},
// );

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
	},
});

export const { selectAll: listAllNotes, selectById: selectNoteById } =
	notesAdapter.getSelectors((state: RootState) => state.notes);

export default notesSlice.reducer;
