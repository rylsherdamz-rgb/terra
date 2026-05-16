# World Trail: GeoGuessr Duel

This app is now a single-game multiplayer GeoGuessr build for Expo + Supabase Realtime.

## What it does

- Create a private match and share a `game ID`
- Join a match by `game ID`
- Use automatch to fill the oldest open lobby
- Play a 5-round Street View guessing duel
- Score both players in Supabase and stream updates live

## Required env vars

Create an `.env` file for Expo with:

```bash
EXPO_PUBLIC_SUPABASE_URL=your-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_MAPS_KEY=your-google-maps-key
```

`EXPO_PUBLIC_MAPS_KEY` must have Maps Embed API access for the Street View panel.

## Supabase setup

Run the migration in [supabase/migrations/20260516_geoguessr.sql](/home/richie/App/world-trail/supabase/migrations/20260516_geoguessr.sql:1).

That migration:

- Drops the old multiplayer tables/functions in `public`
- Creates the GeoGuessr tables, RPCs, and permissive first-pass RLS policies
- Seeds playable Street View locations
- Adds `games`, `game_players`, `game_rounds`, and `round_guesses` to `supabase_realtime`

## Run locally

```bash
npm install
npx expo start
```

For actual playtesting, run two simulator/device sessions against the same Supabase project.
