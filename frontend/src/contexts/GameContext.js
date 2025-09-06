"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";
import { toast } from "react-hot-toast";

const GameContext = createContext({});

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};

export function GameProvider({ children }) {
  const { user } = useAuth();
  const [currentGameId, setCurrentGameId] = useState(null);
  const [currentGamename, setCurrentGamename] = useState(null);

  const fetchCurrentGame = async () => {
    try {
      const { data, error } = await supabase
        .from("games")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .eq("status", "CAST_READY")
        .single();

      if (data) {
        setCurrentGameId(data.id);
        setCurrentGamename(data.title);
        console.log(data.title);
      } else {
        console.log("No active game found, setting current game id to null");
        setCurrentGameId(null);
        setCurrentGamename(null);
      }

      if (error) {
        console.error("Error fetching active game:", error);
        return;
      }
    } catch (error) {
      console.error("Error in fetchActiveGame:", error);
    }
  };

  // Fetch active game when user changes
  useEffect(() => {
    if (user?.id) {
      fetchCurrentGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    if (!user) {
      console.log("User is null, setting current game id to null");
      setCurrentGameId(null);
    }
  }, [user]);

  const setGame = async (gameId) => {
    try {
      // Set new game as active
      const { error } = await supabase
        .from("games")
        .update({ is_active: true })
        .eq("id", gameId)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error setting active game:", error);
        return;
      }

      // Deactivate other games
      await supabase
        .from("games")
        .update({ is_active: false })
        .neq("id", gameId)
        .eq("user_id", user.id);

      // Refresh active game
      await fetchCurrentGame();
      console.log("Refreshed current game");
    } catch (error) {
      console.error("Error in setGame:", error);
    }
  };

  const resetGame = async () => {
    setCurrentGameId(null);
    setCurrentGamename(null);
    toast.success("Game reset successfully");
  };

  const value = {
    currentGameId,
    currentGamename,
    setGame,
    fetchCurrentGame,
    resetGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
