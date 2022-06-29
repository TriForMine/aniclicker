import { createSigner, createVerifier } from "fast-jwt";

// Access Token that expires every 5 minutes
function generateAccessToken(userId: string) {
  const signSync = createSigner({
    key: process.env.JWT_ACCESS_SECRET,
    expiresIn: 1000 * 60 * 5,
  });

  return signSync({ userId });
}

// Refresh Token that expires every 7 days
function generateRefreshToken(userId: string, jti: string) {
  const refreshSignSync = createSigner({
    key: process.env.JWT_REFRESH_SECRET,
    expiresIn: 1000 * 60 * 60 * 24 * 7,
    jti,
  });

  return refreshSignSync({
    userId,
  });
}

// Generate both tokens
function generateTokens(userId: string, jti: string) {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId, jti);

  return {
    accessToken,
    refreshToken,
  };
}

// Verify the refresh token
function verifyRefreshToken(token: string) {
  const verifySync = createVerifier({
    key: process.env.JWT_REFRESH_SECRET,
  });

  return verifySync(token);
}

// Verify the token and return the jwt content
function verifyToken(token: string) {
  const verifySync = createVerifier({
    key: process.env.JWT_ACCESS_SECRET,
  });

  return verifySync(token);
}

export {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
  verifyRefreshToken,
  verifyToken,
};
