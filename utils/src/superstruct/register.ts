import {object, define, refine, Struct} from 'superstruct'
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import zxcvbnEnPackage from '@zxcvbn-ts/language-en'
import zxcvbnFrPackage from '@zxcvbn-ts/language-fr'
import isEmail from '@rearguard/is-email'

const options = {
	translations: zxcvbnFrPackage.translations,
	graphs: zxcvbnCommonPackage.adjacencyGraphs,
	dictionary: {
		...zxcvbnCommonPackage.dictionary,
		...zxcvbnEnPackage.dictionary,
		...zxcvbnFrPackage.dictionary,
	},
}

const match = (field) => define<string>('match', (value, { branch }) => {
	if (!value) {
		return 'Ce champ est requis.';
	}

	if (branch[0][field] === value) {
		return true;
	} else {
		return 'Les deux mot de passes doivent être identiques.'
	}
});

const email = () => define<string>('email', (value: string) => {
	if (value && isEmail(value)) {
		return true;
	} else {
		return "L'email n'est pas valide.";
	}
})

const zxcvbnPassword = () => define<string>('zxcvbnPassword', (value, { branch}) => {
	if (typeof value === "string") {
		if (value.length < 8 && value.length > 64) {
			return 'Le mot de passe doit être compris entre 8 et 64 caractères.';
		}

		zxcvbnOptions.setOptions(options)

		const passwordCheck = zxcvbn(value)

		if (passwordCheck.score < 3) {
			return passwordCheck.feedback.warning || passwordCheck.feedback.suggestions[0];
		}

		return true;
	} else {
		return 'Ce champ est requis.';
	}
})

const customString = () => define<string>('string', (value) => {
	return typeof value === "string" || "Ce champ est requis.";
});

const customSize = (struct: Struct<string, null>, min: number, max: number) => {
	return refine(struct, 'size', (value) => {
		if (value.length < min || value.length > max) {
			return `Ce champ doit être compris entre ${min} et ${max} caractères.`;
		} else {
			return true;
		}
	});
};

export const registerStruct = object({
	email: email(),
	username: customSize(customString(), 1, 64),
	password: zxcvbnPassword(),
	confirmPassword: match('password')
})
