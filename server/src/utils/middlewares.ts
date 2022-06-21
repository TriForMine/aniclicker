import { HttpRequest } from "uWebSockets.js";
import { verifyToken } from "./jwt";

export function isAuthenticated(req: HttpRequest) {
  const authorization = req.getHeader("authorization");

  if (!authorization) return false;

  try {
    const token = authorization.split(" ")[1];
    return verifyToken(token);
  } catch (err) {
    return false;
  }
}
