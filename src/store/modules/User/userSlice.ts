import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import minhaApi from '../../../configs/services/integration.api';
import {
	IUser,
	ResponseSignIn,
	ResponseSignUp,
} from '../../../configs/types/User';
import { showSnackbar } from '../Snackbar/snackbarSlice';

const initialState = {
	user: {
		id: '',
		name: '',
		logged: false,
	},
	loading: false,
};

export const cadastrarUsuario = createAsyncThunk(
	'user/cadastrar',
	async (novoUsuario: IUser, { dispatch }) => {
		try {
			const resposta = await minhaApi.post('/users/signup', novoUsuario);

			const dadosAPI = resposta.data as ResponseSignUp;

			dispatch(
				showSnackbar({
					mensagem: dadosAPI.message,
					tipo: 'success',
				}),
			);

			return dadosAPI;
		} catch (error) {
			if (error instanceof AxiosError) {
				const dadosAPI = error.response?.data as ResponseSignUp;

				dispatch(
					showSnackbar({
						mensagem: dadosAPI.message,
						tipo: 'error',
					}),
				);

				return dadosAPI;
			}

			console.log(error);

			return {
				success: false,
				message: 'Algo errado não tá certo no código. Chama o DEV.',
			};
		}
	},
);

export const logarUsuario = createAsyncThunk(
	'user/logar',
	async (dados: Omit<IUser, 'name'>, { dispatch }) => {
		try {
			const resposta = await minhaApi.post('/users/signin', dados);

			const dadosAPI = resposta.data as ResponseSignIn;

			dispatch(
				showSnackbar({
					mensagem: dadosAPI.message,
					tipo: 'success',
				}),
			);

			return dadosAPI;
		} catch (error) {
			if (error instanceof AxiosError) {
				const dadosAPI = error.response?.data as ResponseSignIn;

				dispatch(
					showSnackbar({
						mensagem: dadosAPI.message,
						tipo: 'error',
					}),
				);

				return dadosAPI;
			}

			return {
				success: false,
				message: 'Algo errado não tá certo no código. Chama o DEV.',
			};
		}
	},
);

const usersSlice = createSlice({
	name: 'user',
	initialState: initialState,
	reducers: {
		setUser: (estado, action) => {
			return {
				...estado,
				user: {
					id: action.payload,
					name: action.payload.name,
					logged: true,
				},
			};
		},
		logoutUser: () => {
			localStorage.removeItem('userLogged');
			return initialState;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(cadastrarUsuario.pending, (estadoAtual) => {
			return {
				...estadoAtual,
				loading: true,
			};
		});
		builder.addCase(cadastrarUsuario.fulfilled, (estadoAtual, action) => {
			if (action.payload.success && action.payload.data) {
				return {
					user: {
						id: action.payload.data.id,
						name: action.payload.data.name,
						logged: false,
					},
					loading: false,
				};
			}

			if (!action.payload.success) {
				return {
					...estadoAtual,
					loading: false,
				};
			}
		});
		builder.addCase(cadastrarUsuario.rejected, (estadoAtual) => {
			return {
				...estadoAtual,
				loading: false,
			};
		});

		builder.addCase(logarUsuario.pending, (estadoAtual) => {
			return {
				...estadoAtual,
				loading: true,
			};
		});
		builder.addCase(logarUsuario.fulfilled, (estadoAtual, action) => {
			if (action.payload.success && action.payload.data) {
				localStorage.setItem(
					'userLogged',
					JSON.stringify(action.payload.data),
				);

				return {
					user: {
						id: action.payload.data.id,
						name: action.payload.data.name,
						logged: true,
					},
					loading: false,
				};
			}

			if (!action.payload.success) {
				return initialState;
			}
		});
		builder.addCase(logarUsuario.rejected, () => {
			return initialState;
		});
	},
});
export const { setUser, logoutUser } = usersSlice.actions;
export default usersSlice.reducer;
