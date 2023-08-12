export interface INotes {
	id: string;
	title: string;
	description: string;
	archived: boolean;
	createdAt: string;
}

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
}

export interface NotesListReturn {
	message: string;
	success: boolean;
	data: INotes[];
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
