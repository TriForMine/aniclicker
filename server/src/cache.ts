import type { WebSocket } from "uWebSockets.js";
import { GameState } from "utils";

export const SOCKETS = new Map<string, WebSocket>();
export const REQUIRE_UPDATES = new Set<string>();
export const USERS_STATES = new Map<string, GameState>();
