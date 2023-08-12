import { INotes } from '../../../../configs/types/Notes';

export interface CreateNote {
	title: string;
	description: string;
	authorId: string;
}

export interface UpdateNote {
	id: string;
	title?: string;
	description?: string;
}

export interface ReturnNote {
	data: {
		message: string;
		success: boolean;
		data: INotes;
	};
}

export interface GetNotes {
	title?: string;
	arquived?: string;
}

export interface NotesListReturn {
	// data: {
	message: string;
	success: boolean;
	data: INotes[];
	// };
}

export interface UpdateNoteReturn {
	message: string;
	success: boolean;
	data: INotes;
}

export interface DeletedNoteReturn {
	message: string;
	success: boolean;
	data: INotes;
}

export interface ArchivedNoteReturn {
	message: string;
	success: boolean;
	updatedData: INotes;
}
