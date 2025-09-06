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
    if (payload.eventType === "UPDATE") {
      const name = payload.new.name;
      toast(`👤 ${name} information updated`, {
        id: "character-updated",
        icon: "📝",
      });
    } else if (payload.eventType === "INSERT") {
      const name = payload.new.name;
      toast(`👤 New character added: ${name}`, {
        id: "character-inserted",
        icon: "📝",
      });
    }
  };

  const handleClueChange = (payload) => {
    if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
      toast.success("🔍 New clue discovered!", {
        duration: 5000,
        id: "clue-inserted",
      });
    }
  };

  const handleTimelineChange = (payload) => {
    if (payload.eventType === "INSERT") {
      toast("⏰ Timeline updated", {
        id: "timeline-updated",
      });
    }
  };

  const handleLocationChange = (payload) => {
    if (payload.eventType === "UPDATE") {
      toast("🔍 New location discovered!", {
        duration: 5000,
        id: "location-updated",
      });
    }
  };

  useEffect(() => {
    if (!user?.id || !currentGameId) {
      return;
    }

    console.log("🔄 Setting up realtime subscriptions for:", {
      userId: user.id,
      gameId: currentGameId,
    });

    const gameChannel = supabase
      .channel(`game-${currentGameId}-debug`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "characters",
          filter: `game_id=eq.${currentGameId}`,
        },
        (payload) => {
          console.log("🎯 CHARACTERS change received:", payload);
          handleCharacterChange(payload);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "clues",
          filter: `game_id=eq.${currentGameId}`,
        },
        (payload) => {
          console.log("🎯 CLUES change received:", payload);
          handleClueChange(payload);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "timeline_events",
          filter: `game_id=eq.${currentGameId}`,
        },
        (payload) => {
          console.log("🎯 TIMELINE change received:", payload);
          handleTimelineChange(payload);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "locations",
          filter: `game_id=eq.${currentGameId}`,
        },
        (payload) => {
          console.log("🎯 LOCATIONS change received:", payload);
          handleLocationChange(payload);
        }
      )
      .subscribe((status, err) => {
        console.log("Realtime subscription status:", status);
        if (err) {
          console.error("❌ Subscription error:", err);
        }
        if (status === "SUBSCRIBED") {
          console.log("🎉 Realtime connected! for game:", currentGameId);

          // Test if ANY postgres changes are being received
          console.log("🔍 Testing realtime - insert a test record now!");
        } else if (status === "CHANNEL_ERROR") {
          console.error("❌ Channel error - replication likely broken");
        } else if (status === "TIMED_OUT") {
          console.error("⏰ Subscription timed out");
        } else if (status === "CLOSED") {
          console.warn("🔒 Channel closed");
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
