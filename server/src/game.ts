import { send_message } from "./server.js";
import { MESSAGE_ENUM } from "utils";
import { REQUIRE_UPDATES, SOCKETS } from "./cache.js";

const TICK_LENGTH = 1000 / 20;
let previous_tick = Date.now();

const GameLoop = () => {
  const now = Date.now();

  if (previous_tick + TICK_LENGTH <= now) {
    const delta = (now - previous_tick) / 1000;
    previous_tick = now;

    update(delta);
  }

  if (Date.now() - previous_tick < TICK_LENGTH - 16) {
    setTimeout(GameLoop);
  } else {
    setImmediate(GameLoop);
  }
};

const update = function (delta: number) {
  for (const id of REQUIRE_UPDATES) {
    REQUIRE_UPDATES.delete(id);
    const ws = SOCKETS.get(id);
    if (ws) {
      send_message(ws, MESSAGE_ENUM.CLIENT_UPDATE, {
        coin: 5,
        delta,
      });
    }
  }
};

export { GameLoop };
