import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { RootState } from '../..';
import { INotes } from '../../../configs/types/Notes';

const notesAdapter = createEntityAdapter<INotes>({
	selectId: (state) => state.id,
});

const notesSlice = createSlice({
	name: 'notes',
	initialState: notesAdapter.getInitialState(),
	reducers: {
		createNote: notesAdapter.addOne,
		updateNote: notesAdapter.updateOne,
		deleteNote: notesAdapter.removeOne,
	},
});

export const { createNote, deleteNote, updateNote } = notesSlice.actions;

export const { selectAll: listAllNotes } = notesAdapter.getSelectors(
	(state: RootState) => state.notes,
);

export default notesSlice.reducer;
