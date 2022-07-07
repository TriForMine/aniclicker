import {FormContainer, PasswordElement, TextFieldElement} from "react-hook-form-mui";
import {Button, Stack} from "@mui/material";
import {superstructResolver} from "@hookform/resolvers/superstruct";
import {registerStruct} from "utils";
import {is} from "superstruct";
import {register} from "../src/auth";
import {useRouter} from "next/router";
import {useStore} from "../src/store";
import {useSnackbar} from "notistack";

export const RegisterForm = () => {
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
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
				if (is(data, registerStruct)) {
					const {accessToken, message} = await register(data.username, data.email, data.password, data.confirmPassword)

					enqueueSnackbar(message, {
						variant: 'success',
					})

					if (accessToken) {
						setAccessToken(accessToken);
						await router.replace(router.asPath);
					}
				} else {
					enqueueSnackbar("Le formulaire n'a pas été rempli correctement", {
						variant: 'error'
					})
				}
			}} resolver={superstructResolver(registerStruct)}>
				<Stack direction={'column'}>
					<TextFieldElement autoComplete="username" name={'username'} label={"Nom d'utilisateur"} required /> <br />
					<TextFieldElement autoComplete="email" name={'email'} label={'E-mail'} type="email" required /> <br />
					<PasswordElement autoComplete="new-password" name={'password'} label={'Mot de Passe'} required /> <br />
					<PasswordElement autoComplete="new-password" name={'confirmPassword'} label={'Confirmer le mot de passe'} required /> <br />
					<Button type={'submit'} variant={'contained'} color={'primary'}>S&apos;inscrire</Button>
				</Stack>
			</FormContainer>
		</>
	)
}
