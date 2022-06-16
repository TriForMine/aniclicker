import type { WebSocket } from "uWebSockets.js";

export const SOCKETS = new Map<string, WebSocket>();
export const REQUIRE_UPDATES = new Set<string>();
