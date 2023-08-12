import { INotes } from '../../../../configs/types/Notes';

export interface CreateNote {
	title: string;
	description: string;
	authorId: string;
}

export interface ReturnNote {
	message: string;
	success: boolean;
	note: INotes;
}

export interface GetNotes {
	authorId: string;
	title?: string;
	archived?: string;
}

export interface NotesListReturn {
	message: string;
	success: boolean;
	notes: INotes[];
}
