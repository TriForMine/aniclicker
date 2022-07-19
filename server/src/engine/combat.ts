import { USERS_STATES } from "../cache";
import { updatePlayerState } from "./stateManager";

export function DealDamage(user_id: string, damage: number) {
  const current_state = USERS_STATES.get(user_id);

  if (!current_state) return;

  if (current_state.health - current_state.damage <= 0) {
    updatePlayerState(user_id, (old_state) => ({
      health: old_state.max_health,
      coin: old_state.coin + 1,
      auto_damage: old_state.auto_damage + 1,
    }));
  } else {
    updatePlayerState(user_id, (old_state) => ({
      health: Math.max(0, old_state.health - damage),
    }));
  }
}

export function ClickDamage(user_id: string): boolean {
  const current_state = USERS_STATES.get(user_id);

  if (!current_state || current_state.damage === 0) return false;

  DealDamage(user_id, current_state.damage);
  return true;
}

// Execute the auto damage, and return whether the player requires an update or not
export function AutoDamage(user_id: string): boolean {
  const current_state = USERS_STATES.get(user_id);

  if (!current_state || current_state.auto_damage === 0) return false;

  DealDamage(user_id, current_state.auto_damage);

  updatePlayerState(user_id, () => ({
    last_auto: Date.now(),
  }));

  return true;
}
