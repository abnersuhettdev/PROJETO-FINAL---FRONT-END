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

// CRIAR A ACTION ASYNC PARA SIGNUP
// dispatch(cadastrarUsuario())
export const cadastrarUsuario = createAsyncThunk(
	'user/cadastrar',
	async (novoUsuario: IUser, { dispatch }) => {
		// to fazendo uma requisição à algo externo? try catch
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

// CRIAR A ACTION ASYNC PARA SIGNIN
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
					name: '',
					logged: true,
				},
			}; // string com o id do usuario logado
		},
		logoutUser: () => {
			localStorage.removeItem('userLogged');
			return initialState;
		},
	},
	extraReducers: (builder) => {
		// CADASTRO
		builder.addCase(cadastrarUsuario.pending, (estadoAtual) => {
			// ALTERAR DIRETAMENTE UM ESTADO LOCAL, NÃO POSSO ALTERAR DIRETAMENTE UM ESTADO GLOBAL
			return {
				...estadoAtual,
				loading: true,
			};
		});
		builder.addCase(cadastrarUsuario.fulfilled, (estadoAtual, action) => {
			// quando tiver concluida a promise

			// ou success é true -> cadastrou
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

			// ou caiu no catch e success é false -> não cadastrou
			if (!action.payload.success) {
				return {
					...estadoAtual,
					loading: false,
				};
			}
		});
		builder.addCase(cadastrarUsuario.rejected, (estadoAtual) => {
			// ultimo caso, erramos muito na construção da requisição
			return {
				...estadoAtual,
				loading: false,
			};
		});

		// LOGIN
		builder.addCase(logarUsuario.pending, (estadoAtual) => {
			return {
				...estadoAtual,
				loading: true,
			};
		});
		builder.addCase(logarUsuario.fulfilled, (estadoAtual, action) => {
			if (action.payload.success && action.payload.data) {
				// 1 - SALVAR O ID NO LOCALSTORAGE
				localStorage.setItem(
					'userLogged',
					JSON.stringify(action.payload.data),
				);

				// 2 - ter uma propriedade no estado de user que diga se ta logado ou não - logged
				return {
					user: {
						id: action.payload.data,
						name: '', // alterar a API para retornar o nome tambem
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
