const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
import { supabase } from "@/lib/supabase";

export const fetchConversationHistory = async (gameId) => {
  const { data, error } = await supabase
    .from("interactions")
    .select("user_query, agent_response, created_at")
    .eq("game_id", gameId)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) throw error;

  const sortedData = data.sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );
  return sortedData;
};

export const fetchCharacters = async (gameId) => {
  const { data, error } = await supabase
    .from("characters")
    .select("*")
    .eq("game_id", gameId)
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
};

export const fetchLocations = async (gameId) => {
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("game_id", gameId)
    .eq("is_accessible", true)
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
};

export const fetchClues = async (gameId) => {
  const { data, error } = await supabase
    .from("clues")
    .select("*")
    .eq("game_id", gameId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const fetchTimelineEvents = async (gameId) => {
  const { data, error } = await supabase
    .from("timeline_events")
    .select("*")
    .eq("game_id", gameId)
    .order("event_time", { ascending: true });

  if (error) throw error;
  return data;
};

export const fetchUserGames = async (userId) => {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const createGame = async (userId, gamedetails) => {
  try {
    console.log("Creating game:", userId, gamedetails);
    const res = await fetch(`${API_URL}/api/games/create/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: gamedetails.title,
        description: gamedetails.description,
        character_count: gamedetails.numberOfCharacters,
      }),
    });
    console.log("Response:", res);

    const data = await res.json();
    console.log("Response data:", data);

    if (!res.ok) {
      // Extract the actual error message from backend
      throw new Error(data.detail);
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const sendMessage = async (gameId, message) => {
  const res = await fetch(`${API_URL}/api/games/query/${gameId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: message }),
  });
  const data = await res.json();
  console.log(data);
  return data;
};
