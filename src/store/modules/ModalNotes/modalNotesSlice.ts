import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { INotes } from '../../../configs/types/Notes';

interface ModalNotesProps {
	open?: boolean;
	contexto?: 'create' | 'update' | 'delete';
	recadoSelecionado?: INotes;
}

const initialState: ModalNotesProps = {
	open: false,
};

const modalNotesSlice = createSlice({
	name: 'loading',
	initialState,
	reducers: {
		showModalNotes: (state, action: PayloadAction<ModalNotesProps>) => {
			return {
				open: true,
				contexto: action.payload.contexto,
				recadoSelecionado: action.payload.recadoSelecionado,
			};
		},
		hideModalNotes: (state, action: PayloadAction<ModalNotesProps>) => {
			return {
				open: false,
			};
		},
	},
});
export const { showModalNotes, hideModalNotes } = modalNotesSlice.actions;

export default modalNotesSlice.reducer;
