export type GuessLocation = {
  latitude: number;
  longitude: number;
};

export type GeoPlayer = {
  id: string;
  name: string;
};

export type GeoRound = {
  city: string;
  country: string;
  heading: number;
  id: string;
  latitude: number;
  longitude: number;
  pitch: number;
  roundNumber: number;
};

export type GeoGuess = {
  distanceMeters: number;
  points: number;
  profileId: string;
};

export type GeoPlayerSummary = {
  displayName: string;
  hasGuessed: boolean;
  latestPoints: number;
  profileId: string;
  totalScore: number;
};

export type GeoGameState = {
  currentRoundNumber: number;
  finishedAt: string | null;
  gameId: string;
  inviteCode: string;
  myGuess: GeoGuess | null;
  players: GeoPlayerSummary[];
  revealLocation: GuessLocation & { city: string; country: string } | null;
  roundCount: number;
  status: "waiting" | "active" | "round_result" | "finished";
};
