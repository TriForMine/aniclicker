import { USERS_STATES } from "../cache";
import { GameState } from "utils";

export function initPlayerState(user_id: string) {
  USERS_STATES.set(user_id, {
    coin: 0,
    health: 20,
    max_health: 20,
    delta: 0,
    damage: 2,
    auto_damage: 0,
    last_auto: Date.now(),
  });
}

export function updatePlayerState(
  user_id: string,
  new_state: (old_state: GameState) => Partial<GameState>
) {
  let old_state = USERS_STATES.get(user_id);

  if (!old_state) {
    initPlayerState(user_id);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    old_state = USERS_STATES.get(user_id)!;
  }

  USERS_STATES.set(user_id, {
    ...old_state,
    ...new_state(old_state),
  });
}
