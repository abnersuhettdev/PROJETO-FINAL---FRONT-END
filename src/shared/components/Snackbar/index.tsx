/* eslint-disable react/prop-types */
import { Alert, Snackbar } from '@mui/material';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { hideSnackbar } from '../../../store/modules/Snackbar/snackbarSlice';

export const MySnackbar: React.FC = () => {
	const select = useAppSelector((state) => state.snackbar);
	const dispatch = useAppDispatch();

	return (
		<div>
			<Snackbar
				open={select.show}
				autoHideDuration={3000}
				onClose={() =>
					dispatch(hideSnackbar({ mensagem: '', tipo: 'warning' }))
				}
			>
				<Alert severity={select.tipo}>{select.mensagem}</Alert>
			</Snackbar>
		</div>
	);
};
