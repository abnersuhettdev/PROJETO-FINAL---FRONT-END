import { Button, CircularProgress, Grid, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';

import { IsValidCredentials } from '../../../../configs/types/IsValidCredentials';
import { IUser } from '../../../../configs/types/User';
import {
	validateConfirmaSenha,
	validateEmail,
	validateSenha,
	validateUsuario,
} from '../../../../configs/Validators';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { cadastrarUsuario } from '../../../../store/modules/User/userSlice';

const style = {
	position: 'absolute' as const,
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	borderRadius: '10px',
	boxShadow: 24,
	p: 4,
};

interface ModalProps {
	aberto: boolean;
	fecharModal: () => void;
}

export const ModalCadastro: React.FC<ModalProps> = ({
	aberto,
	fecharModal,
}) => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmaSenha, setConfirmaSenha] = useState('');
	const estadoUser = useAppSelector((estado) => estado.users);

	const dispatch = useAppDispatch();

	const [errorUsuario, setErrorUsuario] = useState<IsValidCredentials>({
		helperText: '',
		isValid: true,
	});

	const [errorEmail, setErrorEmail] = useState<IsValidCredentials>({
		helperText: '',
		isValid: true,
	});
	const [errorSenha, setErrorSenha] = useState<IsValidCredentials>({
		helperText: '',
		isValid: true,
	});

	const [errorConfirmaSenha, setErrorConfirmaSenha] =
		useState<IsValidCredentials>({
			helperText: '',
			isValid: true,
		});

	useEffect(() => {
		if (name && !validateUsuario(name)) {
			setErrorUsuario({
				helperText: 'Insira no minimo 5 caracteres',
				isValid: false,
			});
		} else {
			setErrorUsuario({
				helperText: '',
				isValid: true,
			});
		}
	}, [name]);

	useEffect(() => {
		if (email && !validateEmail(email)) {
			setErrorEmail({
				helperText: 'Insira um email válido',
				isValid: false,
			});
		} else {
			setErrorEmail({
				helperText: '',
				isValid: true,
			});
		}
	}, [email]);

	useEffect(() => {
		if (password && !validateSenha(password)) {
			setErrorSenha({
				helperText: 'Insira no minimo 5 caracteres',
				isValid: false,
			});
		} else {
			setErrorSenha({
				helperText: '',
				isValid: true,
			});
		}

		if (confirmaSenha && !validateConfirmaSenha(password, confirmaSenha)) {
			setErrorConfirmaSenha({
				helperText: 'As senhas não são idênticas',
				isValid: false,
			});
		} else {
			setErrorConfirmaSenha({
				helperText: '',
				isValid: true,
			});
		}
	}, [password, confirmaSenha]);

	useEffect(() => {
		limpaModal();
	}, [fecharModal]);

	function validateInputs() {
		if (
			validateUsuario(name) &&
			validateEmail(email) &&
			validateSenha(password) &&
			validateConfirmaSenha(password, confirmaSenha)
		) {
			return true;
		}
		return false;
	}

	function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
		ev.preventDefault();

		const usuarioValido = validateInputs();

		if (!usuarioValido) {
			console.log('Usuario inválido');
			return;
		}

		const user: IUser = {
			name,
			email,
			password,
		};

		dispatch(cadastrarUsuario(user));

		setTimeout(() => {
			limpaModal();
			fecharModal();
		}, 3000);
	}

	function limpaModal() {
		setName('');
		setEmail('');
		setPassword('');
		setConfirmaSenha('');
	}

	return (
		<div>
			<Modal
				open={aberto}
				onClose={fecharModal}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<Grid
						container
						flexDirection={'column'}
						width={'100%'}
						alignItems={'center'}
						gap={3}
					>
						<Typography
							id="modal-modal-title"
							variant="h5"
							component="h2"
						>
							Cadastre-se
						</Typography>
						<Box
							component={'form'}
							display={'flex'}
							flexDirection={'column'}
							gap={3}
							onSubmit={(ev) => handleSubmit(ev)}
						>
							<TextField
								variant="standard"
								label="Usuário"
								helperText={errorUsuario.helperText}
								error={!errorUsuario.isValid}
								onChange={(ev) =>
									setName(ev.currentTarget.value)
								}
							/>
							<TextField
								variant="standard"
								label="Email"
								type="email"
								helperText={errorEmail.helperText}
								error={!errorEmail.isValid}
								onChange={(ev) =>
									setEmail(ev.currentTarget.value)
								}
							/>
							<TextField
								variant="standard"
								label="Senha"
								type="password"
								helperText={errorSenha.helperText}
								error={!errorSenha.isValid}
								onChange={(ev) =>
									setPassword(ev.currentTarget.value)
								}
							/>
							<TextField
								variant="standard"
								type="password"
								label="Confirme sua Senha"
								helperText={errorConfirmaSenha.helperText}
								error={!errorConfirmaSenha.isValid}
								onChange={(ev) =>
									setConfirmaSenha(ev.currentTarget.value)
								}
							/>

							<Button
								type="submit"
								variant="contained"
								startIcon={
									estadoUser.loading ? (
										<CircularProgress color="secondary" />
									) : (
										<></>
									)
								}
								sx={{
									padding: '16px',
									borderRadius: '100px',
									background: '#576CA8',

									'&:hover': {
										background: '#F786AA',
									},
								}}
							>
								Cadastrar
							</Button>
						</Box>
					</Grid>
				</Box>
			</Modal>
		</div>
	);
};
