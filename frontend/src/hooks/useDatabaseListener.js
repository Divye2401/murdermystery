"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useGame } from "@/contexts/GameContext";
import { toast } from "react-hot-toast";

export function useDatabaseListener() {
  const { user } = useAuth();
  const { currentGameId } = useGame();

  const handleCharacterChange = (payload) => {
    //Payload has fields eventType, new, old, schema, table, filter
    console.log("Character changddddde:", payload);
    console.log("Event type:", payload.eventType);

    if (payload.eventType === "UPDATE") {
      toast("👤 Character information updated", {
        icon: "📝",
      });
    } else if (payload.eventType === "INSERT") {
      console.log("New character added:", payload.new);
      toast("👤 New character added", {
        icon: "📝",
      });
    }
  };

  const handleClueChange = (payload) => {
    console.log("Clue change:", payload);

    if (payload.eventType === "INSERT") {
      toast.success("🔍 New clue discovered!", {
        duration: 5000,
      });
    }
  };

  const handleTimelineChange = (payload) => {
    console.log("Timeline change:", payload);

    if (payload.eventType === "INSERT") {
      toast("⏰ Timeline updated", {
        icon: "📅",
      });
    }
  };

  const handleLocationChange = (payload) => {
    console.log("Location change:", payload);

    if (payload.eventType === "UPDATE") {
      toast("🔍 New location discovered!", {
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    if (!user?.id || !currentGameId) return;

    console.log("Setting up Realtime for game:", currentGameId);

    const gameChannel = supabase
      .channel(`game-${currentGameId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "characters",
        },
        handleCharacterChange
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "clues",
          filter: `game_id=eq.${currentGameId}`,
        },
        handleClueChange
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "timeline_events",
          filter: `game_id=eq.${currentGameId}`,
        },
        handleTimelineChange
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "locations",
          filter: `game_id=eq.${currentGameId}`,
        },
        handleLocationChange
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
        if (status === "SUBSCRIBED") {
          console.log("🎉 Realtime connected!");
        }
      });

    // Cleanup
    return () => {
      supabase.removeChannel(gameChannel);
    };
  }, [user?.id, currentGameId]);
}

// Component wrapper to easily add database listening to any page
export function DatabaseListener({ children }) {
  useDatabaseListener();
  return children;
}
