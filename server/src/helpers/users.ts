import { builder as e, db } from "./db";
import * as argon2 from "argon2";
import type { User } from "../../dbschema/edgeql-js";

export function findUserByEmail(email: User["email"]) {
  const query = e.select(e.User, (user) => ({
    ...e.User["*"],
    filter: e.op(user.email, "=", email),
  }));

  return query.run(db);
}

export async function createUser(
  user: Pick<User, "username" | "email" | "password">
) {
  const query = e.insert(e.User, {
    username: user.username,
    email: user.email,
    password: await argon2.hash(user.password, {
      type: 2,
      memoryCost: 1 << 14,
      timeCost: 2,
      parallelism: 1,
    }),
  });

  return await query.run(db);
}

export function findUserById(id: string) {
  const query = e.select(e.User, (user) => ({
    id: true,
    username: true,
    createdAt: true,
    updatedAt: true,
    filter: e.op(user.id, "=", e.uuid(id)),
  }));

  return query.run(db);
}
