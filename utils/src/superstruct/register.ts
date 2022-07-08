import { object } from "superstruct";
import {
  customSize,
  customString,
  email,
  match,
  zxcvbnPassword,
} from "./customStruct";

export const registerStruct = object({
  email: email(),
  username: customSize(customString(), 1, 64),
  password: zxcvbnPassword(),
  confirmPassword: match("password"),
});
