import zxcvbnFrPackage from "@zxcvbn-ts/language-fr";
import zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import zxcvbnEnPackage from "@zxcvbn-ts/language-en";
import {define, refine, Struct} from "superstruct";
import isEmail from "@rearguard/is-email";
import {zxcvbn, zxcvbnOptions} from "@zxcvbn-ts/core";

const options = {
	translations: zxcvbnFrPackage.translations,
	graphs: zxcvbnCommonPackage.adjacencyGraphs,
	dictionary: {
		...zxcvbnCommonPackage.dictionary,
		...zxcvbnEnPackage.dictionary,
		...zxcvbnFrPackage.dictionary,
	},
};

export const match = (field) =>
	define<string>("match", (value, { branch }) => {
		if (!value) {
			return "This field is required.";
		}

		if (branch[0][field] === value) {
			return true;
		} else {
			return "Both passwords must match.";
		}
	});

export const email = () =>
	define<string>("email", (value: string) => {
		if (value && isEmail(value)) {
			return true;
		} else {
			return "The email is invalid.";
		}
	});

export const zxcvbnPassword = () =>
	define<string>("zxcvbnPassword", (value, { branch }) => {
		if (typeof value === "string") {
			if (value.length < 8 && value.length > 128) {
				return "The password must be between 8 and 128 characters.";
			}

			zxcvbnOptions.setOptions(options);

			const passwordCheck = zxcvbn(value);

			if (passwordCheck.score < 3) {
				return (
					passwordCheck.feedback.warning ||
					passwordCheck.feedback.suggestions[0]
				);
			}

			return true;
		} else {
			return "This field is required.";
		}
	});

export const customString = () =>
	define<string>("string", (value) => {
		return typeof value === "string" || "This field is required.";
	});

export const customSize = (struct: Struct<string, null>, min: number, max: number) => {
	return refine(struct, "size", (value) => {
		if (value.length < min || value.length > max) {
			return `This field must be between ${min} and ${max} characters.`;
		} else {
			return true;
		}
	});
};
