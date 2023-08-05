export interface IUser {
	name: string;
	email: string;
	password: string;
}

export type ResponseSignUp = {
	success: boolean;
	message: string;
	data?: IUser & { id: string };
};

export type ResponseSignIn = {
	success: boolean;
	message: string;
	data?: { id: string; name: string };
};
