import { WebSocket, App, SHARED_COMPRESSOR } from "uWebSockets.js";
import { nanoid } from "nanoid";
import { decode, encode, MESSAGE_ENUM } from "utils";
import { logger } from "./utils/logger.js";
import { REQUIRE_UPDATES, SOCKETS } from "./cache.js";
import { readCbor } from "./utils/parsing.js";
import { createUser, findUserByEmail, findUserById } from "./helpers/users.js";
import { randomUUID } from "crypto";
import { generateTokens, verifyRefreshToken } from "./utils/jwt.js";
import {
  deleteRefreshToken,
  findRefreshTokenById,
  saveRefreshToken,
} from "./helpers/auth.js";
import * as argon2 from "argon2";
import { isAuthenticated } from "./utils/middlewares.js";
import setupCors from "./utils/cors.js";

export const WebApiApp = App()
  .ws("/*", {
    /* Options */
    compression: SHARED_COMPRESSOR,
    maxPayloadLength: 16 * 1024 * 1024,
    idleTimeout: 10,
    /* Handlers */
    open: (ws) => {
      ws.id = nanoid();
      ws.username = `user-${Math.floor(Math.random() * Math.floor(9999))}`;

      ws.subscribe(MESSAGE_ENUM.CLIENT_CONNECTED);
      ws.subscribe(MESSAGE_ENUM.CLIENT_DISCONNECTED);
      ws.subscribe(MESSAGE_ENUM.CLIENT_MESSAGE);

      SOCKETS.set(ws.id, ws);

      logger.debug(`A WebSocket (${ws.id}) connected!`);

      send_message(ws, MESSAGE_ENUM.SELF_CONNECTED, {
        id: ws.id,
        username: ws.username,
      });
      broadcast_message(MESSAGE_ENUM.CLIENT_CONNECTED, {
        id: ws.id,
        username: ws.username,
      });

      REQUIRE_UPDATES.add(ws.id);
    },
    message: (ws, message) => {
      const clientMsg = decode(new Uint8Array(message));

      switch (clientMsg.type) {
        case MESSAGE_ENUM.CLIENT_MESSAGE:
          broadcast_message(MESSAGE_ENUM.CLIENT_MESSAGE, {
            sender: ws.username,
            content: clientMsg.data,
          });
          break;
        default:
          logger.error(`Unknown message type: ${clientMsg.type}`);
      }
    },
    drain: (ws) => {
      logger.debug("WebSocket backpressure: " + ws.getBufferedAmount());
    },
    close: (ws) => {
      SOCKETS.delete(ws.id);
      logger.debug(`WebSocket closed: ${ws.id}`);

      broadcast_message(MESSAGE_ENUM.CLIENT_DISCONNECTED, {
        id: ws.id,
        username: ws.username,
      });
    },
  })
  .post("/register", async (res, req) => {
    if (isAuthenticated(req)) {
      res.writeStatus("401");
      setupCors(res);
      return res.end("401 Unauthorized");
    }

    try {
      const data = await readCbor(res);

      if (!data.username || !data.email || !data.password)
        return res.end("Invalid request");

      try {
        const user = await createUser({
          username: data.username,
          email: data.email,
          password: data.password,
        });
        const jti = randomUUID();
        const { accessToken, refreshToken } = generateTokens(user, jti);
        await saveRefreshToken(jti, refreshToken, user.id);

        res.writeStatus("201 Created");
        setupCors(res);
        res.end(
          encode({
            accessToken,
            refreshToken,
          })
        );
      } catch (e) {
        res.writeStatus("201 Created");
        setupCors(res);
        res.end();
      }
    } catch (err) {
      logger.error(err);
    }
  })
  .post("/login", async (res, req) => {
    if (isAuthenticated(req)) {
      res.writeStatus("401");
      setupCors(res);
      return res.end("401 Unauthorized");
    }

    try {
      const data = await readCbor(res);

      if (!data.email || !data.password) {
        return res.end("Invalid request");
      }

      const existingUser = await findUserByEmail(data.email);

      if (!existingUser) {
        return res.writeStatus("403").end("Invalid login credentials");
      }

      const validPassword = await argon2.verify(
        existingUser.password,
        data.password
      );
      if (!validPassword) {
        return res.writeStatus("403").end("Invalid login credentials");
      }

      const jti = randomUUID();
      const { accessToken, refreshToken } = generateTokens(existingUser, jti);
      await saveRefreshToken(jti, refreshToken, existingUser.id);

      res.writeHeader(
        "Set-Cookie",
        `refreshToken=${refreshToken}; Path=/; HttpOnly;`
      );

      res.writeStatus("200");
      setupCors(res);
      res.end(
        encode({
          accessToken,
        })
      );
    } catch (err) {
      logger.error(err);
    }
  })
  .post("/refreshToken", async (res, req) => {
    res.onAborted(() => {
      res.aborted = true;
    });

    try {
      const cookies = req.getHeader("cookie");
      const cookieToken = cookies
        .split(";")
        .filter((cookie) => cookie.split("=")[0] === "refreshToken")
        .map((cookie) => cookie.split("=")[1])[0];

      if (!cookieToken) {
        res.writeStatus("401");
        setupCors(res);
        res.end("Missing refresh token.");
        return;
      }

      const payload = verifyRefreshToken(cookieToken);
      const savedRefreshToken = await findRefreshTokenById(payload.jti);

      if (!savedRefreshToken || savedRefreshToken.revoked) {
        res.writeStatus("401");
        setupCors(res);
        if (!res.aborted) {
          res.end("Unauthorized");
        }
        return;
      }

      const user = await findUserById(payload.userId);
      if (!user) {
        res.writeStatus("401");
        setupCors(res);
        if (!res.aborted) {
          res.end("Unauthorized");
        }
        return;
      }

      await deleteRefreshToken(savedRefreshToken.id);
      const jti = randomUUID();
      const { accessToken, refreshToken } = generateTokens(user, jti);
      await saveRefreshToken(jti, refreshToken, user.id);

      res.writeHeader(
        "Set-Cookie",
        `refreshToken=${refreshToken}; Path=/; HttpOnly;`
      );

      res.writeStatus("200");
      setupCors(res);
      if (!res.aborted) {
        res.end(
          encode({
            accessToken,
          })
        );
      }
    } catch (err) {
      res.writeStatus("401");
      setupCors(res);
      logger.error(err);
      if (!res.aborted) {
        res.end();
      }
    }
  })
  .get("/profile", (res, req) => {
    const user = isAuthenticated(req);

    if (!user) {
      res.writeStatus("401 Unauthorized");
      setupCors(res);
      res.end("401 Unauthorized");
    } else {
      res.writeStatus("200 OK");
      setupCors(res);
      res.end(encode("hi"));
    }
  })
  .any("/*", (res) => {
    setupCors(res);

    res.writeStatus("404").end("404");
  });

/* eslint-disable @typescript-eslint/no-explicit-any */
export function broadcast_message(topic: MESSAGE_ENUM, message: any) {
  return WebApiApp.publish(
    topic,
    encode({
      type: topic,
      data: message,
    }),
    true,
    false
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function send_message(
  socket: WebSocket,
  topic: MESSAGE_ENUM,
  message: any
) {
  return socket.send(
    encode({
      type: topic,
      data: message,
    }),
    true,
    false
  );
}
