import {FormContainer, PasswordElement, TextFieldElement} from "react-hook-form-mui";
import {Button, Stack} from "@mui/material";
import {superstructResolver} from "@hookform/resolvers/superstruct";
import {loginStruct} from "utils";
import {is} from "superstruct";
import {login} from "../src/auth";
import {useRouter} from "next/router";
import {useStore} from "../src/store";
import {useSnackbar} from "notistack";

export const LoginForm = () => {
	const { enqueueSnackbar } = useSnackbar();
	const router = useRouter();

	const { setAccessToken } = useStore((store) => ({
		access_token: store.access_token,
		user_info: store.user_info,
		setUserInfo: store.setUserInfo,
		setAccessToken: store.setAccessToken,
	}));

	return (
		<>
			<FormContainer onSuccess={async (data) => {
				if (is(data, loginStruct)) {
					const {accessToken, message, error} = await login(data.email, data.password)

					enqueueSnackbar(message, {
						variant: error ? 'error' : 'success',
					})

					if (accessToken) {
						setAccessToken(accessToken);
						await router.replace(router.asPath);
					}
				} else {
					enqueueSnackbar("The form was not filled correctly.", {
						variant: 'error'
					})
				}
			}} resolver={superstructResolver(loginStruct)}>
				<Stack direction={'column'}>
					<TextFieldElement autoComplete="email" name={'email'} label={'E-mail'} type="email" required /> <br />
					<PasswordElement autoComplete="new-password" name={'password'} label={'Password'} required /> <br />
					<Button type={'submit'} variant={'contained'} color={'primary'}>Login</Button>
				</Stack>
			</FormContainer>
		</>
	)
}
