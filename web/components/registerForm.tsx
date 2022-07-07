import {FormContainer, PasswordElement, TextFieldElement} from "react-hook-form-mui";
import {Button, Stack} from "@mui/material";
import {superstructResolver} from "@hookform/resolvers/superstruct";
import {registerStruct} from "../src/superstruct/register";

export const RegisterForm = () => {
	return (
		<>
			<FormContainer resolver={superstructResolver(registerStruct)}>
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
