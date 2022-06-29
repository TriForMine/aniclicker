import { builder as e, db } from "../helpers/db";
import { hashToken } from "./hashToken";
import type { RefreshToken, User } from "../../dbschema/edgeql-js";

export function saveRefreshToken(
  jti: RefreshToken["id"],
  refreshToken: string,
  userId: User["id"]
) {
  const query = e.insert(e.RefreshToken, {
    jti: e.uuid(jti),
    hashedToken: hashToken(refreshToken),
    user: e.select(e.User, (user) => ({
      filter: e.op(user.id, "=", e.uuid(userId)),
    })),
  });

  return query.run(db);
}

export function findRefreshTokenById(id: RefreshToken["id"]) {
  const query = e.select(e.RefreshToken, (token) => ({
    ...e.RefreshToken["*"],
    filter: e.op(token.jti, "=", e.uuid(id)),
  }));

  return query.run(db);
}

export function deleteRefreshToken(id: RefreshToken["id"]) {
  const query = e.delete(e.RefreshToken, (token) => ({
    filter: e.op(token.jti, "=", e.uuid(id)),
  }));

  return query.run(db);
}

export function revokeToken(userId: User["id"]) {
  const query = e.update(e.RefreshToken, (token) => ({
    filter: e.op(token.user.id, "=", e.uuid(userId)),
    set: {
      revoked: true,
    },
  }));

  return query.run(db);
}
