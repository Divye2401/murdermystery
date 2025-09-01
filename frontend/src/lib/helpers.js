const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
import { supabase } from "@/lib/supabase";

export const fetchConversationHistory = async (gameId) => {
  const { data, error } = await supabase
    .from("interactions")
    .select("user_query, agent_response, created_at")
    .eq("game_id", gameId)
    .order("created_at", { ascending: false })
    .limit(5);
  return data;
  sortedData = data.sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );
  return data;
};
