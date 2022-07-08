import { object } from "superstruct";
import {customSize, customString, email} from "./customStruct";

export const loginStruct = object({
  email: email(),
  password: customSize(customString(), 1, 128)
});
