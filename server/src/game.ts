import { send_message } from "./server";
import { MESSAGE_ENUM } from "utils";
import { REQUIRE_UPDATES, SOCKETS, USERS_STATES } from "./cache";
import { AutoDamage } from "./engine/combat";

const TICK_LENGTH = 1000 / 20;
let previous_tick = Date.now();

const update = function (delta: number) {
  for (const id of USERS_STATES.keys()) {
    const user_state = USERS_STATES.get(id);
    if (!user_state) continue;

    if (Date.now() - user_state.last_auto > 1000 && AutoDamage(id)) {
      REQUIRE_UPDATES.add(id);
    }
  }

  for (const id of REQUIRE_UPDATES) {
    REQUIRE_UPDATES.delete(id);
    const ws = SOCKETS.get(id);
    if (ws) {
      send_message(ws, MESSAGE_ENUM.CLIENT_UPDATE, {
        ...USERS_STATES.get(id),
        delta,
      });
    }
  }
};

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

export { GameLoop };
