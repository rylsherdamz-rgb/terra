export type GameDefinition = {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  minPlayers: number;
  maxPlayers: number;
  enabled: boolean;
  color: string;
};

export type PlayerStats = {
  gamesPlayed: number;
  gamesWon: number;
  totalScore: number;
  bestScore: number;
};

export type ActiveGameSummary = {
  gameId: string;
  inviteCode: string;
  status: string;
  currentRoundNumber: number;
  roundCount: number;
  playerCount: number;
};