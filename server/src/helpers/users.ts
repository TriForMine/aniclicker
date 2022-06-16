import { db } from "../utils/db.js";
import type { User } from "@prisma/client";
import * as argon2 from "argon2";

export async function findUserByEmail(email: User["email"]) {
  return db.user.findUnique({
    where: {
      email,
    },
  });
}

export async function createUser(
  user: Pick<User, "username" | "email" | "password">
) {
  return db.user.create({
    data: {
      username: user.username,
      email: user.email,
      // Following OWASP recommendation
      // https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#argon2id
      password: await argon2.hash(user.password, {
        type: 2,
        memoryCost: 1 << 14,
        timeCost: 2,
        parallelism: 1,
      }),
    },
  });
}

export async function findUserById(id: string) {
  return db.user.findUnique({
    where: {
      id,
    },
  });
}
