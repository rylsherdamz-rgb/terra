import { createMMKV } from "react-native-mmkv";

const storage = createMMKV({ id: "world-trail-profile" });

const KEYS = {
  playerId: "player_id",
  displayName: "display_name",
  createdAt: "created_at",
};

export type StoredProfile = {
  playerId: string;
  displayName: string;
  createdAt: string;
};

function makePlayerId(): string {
  return `player_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function makePlayerName(): string {
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `Explorer-${suffix}`;
}

export function loadProfile(): StoredProfile {
  const playerId = storage.getString(KEYS.playerId);
  const displayName = storage.getString(KEYS.displayName);
  const createdAt = storage.getString(KEYS.createdAt);

  if (playerId && displayName && createdAt) {
    return { playerId, displayName, createdAt };
  }

  const newProfile: StoredProfile = {
    playerId: makePlayerId(),
    displayName: makePlayerName(),
    createdAt: new Date().toISOString(),
  };

  storage.set(KEYS.playerId, newProfile.playerId);
  storage.set(KEYS.displayName, newProfile.displayName);
  storage.set(KEYS.createdAt, newProfile.createdAt);

  return newProfile;
}

export function saveProfile(profile: Partial<StoredProfile>): void {
  if (profile.playerId) storage.set(KEYS.playerId, profile.playerId);
  if (profile.displayName) storage.set(KEYS.displayName, profile.displayName);
  if (profile.createdAt) storage.set(KEYS.createdAt, profile.createdAt);
}