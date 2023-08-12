import { combineReducers } from '@reduxjs/toolkit';

import loadingSlice from './Loading/loadingSlice';
import modalNotesSlice from './ModalNotes/modalNotesSlice';
import notesSlice from './Notes/notesSlice';
import snackbarSlice from './Snackbar/snackbarSlice';
import usersSlice from './User/userSlice';

const rootReducer = combineReducers({
	users: usersSlice,
	loading: loadingSlice,
	snackbar: snackbarSlice,
	modal: modalNotesSlice,
	notes: notesSlice,
});

export default rootReducer;
