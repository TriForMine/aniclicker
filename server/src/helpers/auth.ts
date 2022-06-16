import { db } from "../utils/db.js";
import { hashToken } from "../utils/hashToken.js";
import type { User, RefreshToken } from "@prisma/client";

export function saveRefreshToken(
  jti: RefreshToken["id"],
  refreshToken: string,
  userId: User["id"]
) {
  return db.refreshToken.create({
    data: {
      id: jti,
      hashedToken: hashToken(refreshToken),
      userId,
    },
  });
}

export function findRefreshTokenById(id: RefreshToken["id"]) {
  return db.refreshToken.findUnique({
    where: {
      id,
    },
  });
}

export function deleteRefreshToken(id: RefreshToken["id"]) {
  return db.refreshToken.delete({
    where: {
      id,
    },
  });
}

export function revokeToken(userId: User["id"]) {
  return db.refreshToken.updateMany({
    where: {
      userId,
    },
    data: {
      revoked: true,
    },
  });
}
