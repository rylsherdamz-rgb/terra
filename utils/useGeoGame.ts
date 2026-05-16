import { useEffect, useMemo, useState } from "react";
import { supabase, supabaseConfigError } from "@/utils/supabase";
import type {
  GeoGameState,
  GeoGuess,
  GeoPlayer,
  GeoPlayerSummary,
  GeoRound,
  GuessLocation,
} from "@/types/geogame";

type BusyState =
  | "idle"
  | "creating"
  | "matching"
  | "joining"
  | "submitting"
  | "refreshing"
  | "advancing";

type RawGame = {
  current_round_number: number;
  finished_at: string | null;
  id: string;
  invite_code: string;
  round_count: number;
  status: GeoGameState["status"];
};

type RawRound = {
  geo_locations: {
    city: string;
    country: string;
    heading: number;
    latitude: number;
    longitude: number;
    pitch: number;
  } | null;
  id: string;
  round_number: number;
};

type RawPlayer = {
  profile_id: string;
  profiles: {
    display_name: string;
  } | null;
  total_score: number;
};

type RawGuess = {
  distance_meters: number;
  points: number;
  profile_id: string;
  round_id: string;
};

type RawRpcResponse = {
  game_id: string;
  invite_code: string;
  status: GeoGameState["status"];
};

let cachedPlayer: GeoPlayer | null = null;

function makePlayerId() {
  return `player_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function makePlayerName() {
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `Guest-${suffix}`;
}

function ensureLocalPlayer(): GeoPlayer {
  if (!cachedPlayer) {
    cachedPlayer = {
      id: makePlayerId(),
      name: makePlayerName(),
    };
  }

  return cachedPlayer;
}

function normalizeRound(round: RawRound | null | undefined): GeoRound | null {
  if (!round?.geo_locations) {
    return null;
  }

  return {
    city: round.geo_locations.city,
    country: round.geo_locations.country,
    heading: round.geo_locations.heading,
    id: round.id,
    latitude: round.geo_locations.latitude,
    longitude: round.geo_locations.longitude,
    pitch: round.geo_locations.pitch,
    roundNumber: round.round_number,
  };
}

function normalizePlayers(
  rawPlayers: RawPlayer[],
  rawGuesses: RawGuess[],
  currentRoundId: string | null,
): GeoPlayerSummary[] {
  return rawPlayers
    .map((player) => {
      const playerGuess = rawGuesses.find(
        (guess) =>
          guess.profile_id === player.profile_id &&
          guess.round_id === currentRoundId,
      );

      return {
        displayName: player.profiles?.display_name ?? player.profile_id,
        hasGuessed: Boolean(playerGuess),
        latestPoints: playerGuess?.points ?? 0,
        profileId: player.profile_id,
        totalScore: player.total_score ?? 0,
      };
    })
    .sort((left, right) => right.totalScore - left.totalScore);
}

function normalizeGameState(
  game: RawGame,
  players: RawPlayer[],
  rounds: RawRound[],
  guesses: RawGuess[],
  playerId: string,
): { game: GeoGameState; round: GeoRound | null } {
  const currentRoundRaw =
    rounds.find((round) => round.round_number === game.current_round_number) ??
    rounds[0] ??
    null;

  const currentRound = normalizeRound(currentRoundRaw);
  const myGuessRaw =
    guesses.find(
      (guess) =>
        guess.profile_id === playerId && guess.round_id === currentRoundRaw?.id,
    ) ?? null;

  const myGuess: GeoGuess | null = myGuessRaw
    ? {
        distanceMeters: myGuessRaw.distance_meters,
        points: myGuessRaw.points,
        profileId: myGuessRaw.profile_id,
      }
    : null;

  const revealLocation =
    game.status === "round_result" || game.status === "finished"
      ? currentRound
        ? {
            city: currentRound.city,
            country: currentRound.country,
            latitude: currentRound.latitude,
            longitude: currentRound.longitude,
          }
        : null
      : null;

  return {
    game: {
      currentRoundNumber: game.current_round_number,
      finishedAt: game.finished_at,
      gameId: game.id,
      inviteCode: game.invite_code,
      myGuess,
      players: normalizePlayers(players, guesses, currentRoundRaw?.id ?? null),
      revealLocation,
      roundCount: game.round_count,
      status: game.status,
    },
    round: currentRound,
  };
}

async function syncProfile(player: GeoPlayer) {
  const { error } = await supabase.rpc("ensure_profile", {
    p_display_name: player.name,
    p_profile_id: player.id,
  });

  if (error) {
    throw error;
  }
}

async function fetchGameState(gameId: string, playerId: string) {
  const [gameResult, playersResult, roundsResult, guessesResult] =
    await Promise.all([
      supabase
        .from("games")
        .select("id, invite_code, status, round_count, current_round_number, finished_at")
        .eq("id", gameId)
        .single<RawGame>(),
      supabase
        .from("game_players")
        .select("profile_id, total_score, profiles(display_name)")
        .eq("game_id", gameId)
        .returns<RawPlayer[]>(),
      supabase
        .from("game_rounds")
        .select(
          "id, round_number, geo_locations(city, country, latitude, longitude, heading, pitch)",
        )
        .eq("game_id", gameId)
        .order("round_number", { ascending: true })
        .returns<RawRound[]>(),
      supabase
        .from("round_guesses")
        .select("profile_id, round_id, distance_meters, points")
        .eq("game_id", gameId)
        .returns<RawGuess[]>(),
    ]);

  if (gameResult.error) {
    throw gameResult.error;
  }
  if (playersResult.error) {
    throw playersResult.error;
  }
  if (roundsResult.error) {
    throw roundsResult.error;
  }
  if (guessesResult.error) {
    throw guessesResult.error;
  }

  return normalizeGameState(
    gameResult.data,
    playersResult.data ?? [],
    roundsResult.data ?? [],
    guessesResult.data ?? [],
    playerId,
  );
}

export function useGeoGame() {
  const [busy, setBusy] = useState<BusyState>("idle");
  const [activeGame, setActiveGame] = useState<GeoGameState | null>(null);
  const [currentRound, setCurrentRound] = useState<GeoRound | null>(null);
  const [selectedGuess, setSelectedGuess] = useState<GuessLocation | null>(null);
  const [gameIdInput, setGameIdInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submittingGuess, setSubmittingGuess] = useState(false);
  const [player, setPlayer] = useState<GeoPlayer>(() => ensureLocalPlayer());

  const refreshState = async (gameId: string, playerId: string) => {
    const next = await fetchGameState(gameId, playerId);
    setActiveGame(next.game);
    setCurrentRound(next.round);
  };

  useEffect(() => {
    if (supabaseConfigError) {
      setError(supabaseConfigError);
      return;
    }

    void syncProfile(player).catch((syncError: Error) => {
      setError(syncError.message);
    });
  }, [player]);

  useEffect(() => {
    if (!activeGame?.gameId) {
      return;
    }

    const channel = supabase
      .channel(`geogame:${activeGame.gameId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "games", filter: `id=eq.${activeGame.gameId}` },
        () => {
          void refreshState(activeGame.gameId, player.id).catch((refreshError: Error) => {
            setError(refreshError.message);
          });
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "game_players",
          filter: `game_id=eq.${activeGame.gameId}`,
        },
        () => {
          void refreshState(activeGame.gameId, player.id).catch((refreshError: Error) => {
            setError(refreshError.message);
          });
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "game_rounds",
          filter: `game_id=eq.${activeGame.gameId}`,
        },
        () => {
          void refreshState(activeGame.gameId, player.id).catch((refreshError: Error) => {
            setError(refreshError.message);
          });
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "round_guesses",
          filter: `game_id=eq.${activeGame.gameId}`,
        },
        () => {
          void refreshState(activeGame.gameId, player.id).catch((refreshError: Error) => {
            setError(refreshError.message);
          });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [activeGame?.gameId, player.id]);

  useEffect(() => {
    setSelectedGuess(null);
  }, [currentRound?.id]);

  const runAction = async <T,>(
    nextBusy: BusyState,
    action: () => Promise<T>,
  ) => {
    setBusy(nextBusy);
    setError(null);

    try {
      return await action();
    } catch (actionError) {
      const message =
        actionError instanceof Error ? actionError.message : "Unknown error";
      setError(message);
      throw actionError;
    } finally {
      setBusy("idle");
    }
  };

  const loadFromRpc = async (response: RawRpcResponse) => {
    setGameIdInput(response.invite_code);
    await refreshState(response.game_id, player.id);
  };

  const createPrivateGame = async () => {
    await runAction("creating", async () => {
      if (supabaseConfigError) {
        throw new Error(supabaseConfigError);
      }
      await syncProfile(player);
      const { data, error: rpcError } = await supabase
        .rpc("create_private_game", {
          p_profile_id: player.id,
          p_round_count: 5,
        })
        .single<RawRpcResponse>();

      if (rpcError) {
        throw rpcError;
      }

      await loadFromRpc(data);
    });
  };

  const startAutomatch = async () => {
    await runAction("matching", async () => {
      if (supabaseConfigError) {
        throw new Error(supabaseConfigError);
      }
      await syncProfile(player);
      const { data, error: rpcError } = await supabase
        .rpc("automatch_game", {
          p_profile_id: player.id,
        })
        .single<RawRpcResponse>();

      if (rpcError) {
        throw rpcError;
      }

      await loadFromRpc(data);
    });
  };

  const joinByCode = async () => {
    await runAction("joining", async () => {
      if (supabaseConfigError) {
        throw new Error(supabaseConfigError);
      }
      await syncProfile(player);
      const { data, error: rpcError } = await supabase
        .rpc("join_game_by_code", {
          p_invite_code: gameIdInput.trim().toUpperCase(),
          p_profile_id: player.id,
        })
        .single<RawRpcResponse>();

      if (rpcError) {
        throw rpcError;
      }

      await loadFromRpc(data);
    });
  };

  const refreshGame = async () => {
    if (!activeGame?.gameId) {
      return;
    }

    await runAction("refreshing", async () => {
      await refreshState(activeGame.gameId, player.id);
    });
  };

  const submitGuess = async () => {
    if (!activeGame || !currentRound || !selectedGuess) {
      return;
    }

    if (supabaseConfigError) {
      throw new Error(supabaseConfigError);
    }

    setSubmittingGuess(true);
    try {
      const { error: rpcError } = await supabase.rpc("submit_guess", {
        p_guess_latitude: selectedGuess.latitude,
        p_guess_longitude: selectedGuess.longitude,
        p_profile_id: player.id,
        p_round_id: currentRound.id,
      });

      if (rpcError) {
        throw rpcError;
      }

      await refreshState(activeGame.gameId, player.id);
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Unknown error";
      setError(message);
      throw submitError;
    } finally {
      setSubmittingGuess(false);
    }
  };

  const nextRound = async () => {
    if (!activeGame) {
      return;
    }

    await runAction("advancing", async () => {
      if (supabaseConfigError) {
        throw new Error(supabaseConfigError);
      }
      const { error: rpcError } = await supabase.rpc("advance_round", {
        p_game_id: activeGame.gameId,
        p_profile_id: player.id,
      });

      if (rpcError) {
        throw rpcError;
      }

      await refreshState(activeGame.gameId, player.id);
    });
  };

  const revealLocation = useMemo(
    () => activeGame?.revealLocation ?? null,
    [activeGame?.revealLocation],
  );

  return {
    activeGame,
    busy,
    createPrivateGame,
    currentRound,
    error,
    gameIdInput,
    joinByCode,
    nextRound,
    player,
    refreshGame,
    revealLocation,
    selectedGuess,
    setGameIdInput,
    setPlayerName: (name: string) => {
      setPlayer((currentPlayer) => {
        const nextPlayer = {
          ...currentPlayer,
          name,
        };
        cachedPlayer = nextPlayer;
        return nextPlayer;
      });
    },
    setSelectedGuess,
    startAutomatch,
    submitGuess,
    submittingGuess,
  };
}
