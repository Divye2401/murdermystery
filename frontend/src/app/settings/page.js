"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useGame } from "@/contexts/GameContext";
import { fetchUserGames } from "@/lib/helpers";
import { auth } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import AudioPlayer from "@/components/AudioPlayer";

export default function Settings() {
  const { user, checkingUser } = useAuth();
  const { setGame } = useGame();
  const [selectedGame, setSelectedGame] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  // Fetch user games data
  const {
    data: userGames,
    isLoading: gamesLoading,
    error: gamesError,
  } = useQuery({
    queryKey: ["user_games", user?.id],
    queryFn: () => fetchUserGames(user.id),
    enabled: !!user && !checkingUser,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: false,
  });

  // Protect this route - redirect to login if not authenticated
  useEffect(() => {
    if (!checkingUser && !user) {
      router.push("/login");
    }
  }, [user, checkingUser, router]);

  // Set first game as selected when games load
  useEffect(() => {
    if (userGames && userGames.length > 0 && !selectedGame) {
      setSelectedGame(
        userGames.find((game) => game.is_active && game.status === "CAST_READY")
          ?.id
      );
    }
  }, [userGames, selectedGame]);

  const getStatusInfo = (status) => {
    switch (status) {
      case "IN_PROGRESS":
        return {
          color: "text-brass-warm",
          icon: "🎮",
          label: "In Progress",
        };
      case "DONE":
        return {
          color: "text-study-paper",
          icon: "✅",
          label: "Completed",
        };
      case "INIT":
        return {
          color: "text-wood-light",
          icon: "🔄",
          label: "Initializing",
        };
      case "CAST_READY":
        return {
          color: "text-brass-warm",
          icon: "👥",
          label: "Cast Ready",
        };
      case "WORLD_READY":
        return {
          color: "text-wood-light",
          icon: "🌍",
          label: "World Ready",
        };
      default:
        return {
          color: "text-leather-dark",
          icon: "❓",
          label: "Unknown",
        };
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await auth.signOut();

      router.replace("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      setIsLoggingOut(false);
    }
  };

  // Show loading while checking authentication
  if (checkingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-moon-glow mx-auto mb-4"></div>
          <p className="text-moon-glow">Loading user session...</p>
        </div>
      </div>
    );
  }

  // Don't render if no user (will redirect)
  if (!user) {
    return null;
  }

  // Show loading while fetching games
  if (gamesLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.6)), url('/images/settings.png')",
        }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-moon-glow mx-auto mb-4"></div>
          <p className="text-moon-glow">Loading games...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (gamesError) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.6)), url('/images/settings.png')",
        }}
      >
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">
            Error Loading Games
          </h2>
          <p className="text-gray-300 mb-4">
            {gamesError?.message || "Failed to load games data"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat text-white p-4"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url('/images/settings.png')",
      }}
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10 pt-4">
        <div className="grid grid-cols-3 items-center justify-items-center">
          <Link
            href="/"
            className="text-study-paper hover:text-brass-warm transition-colors justify-self-start"
          >
            ← Back to Investigation
          </Link>
          <h1 className="font-bold text-2xl text-study-paper">⚙️ Settings</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Games Section */}
        <div className="mb-8">
          <h2 className="font-semibold text-xl text-study-paper mb-6">
            🎮 Your Cases
          </h2>

          {/* Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 items-start">
            {userGames &&
              userGames.map((game) => {
                const statusInfo = getStatusInfo(game.status);

                return (
                  <div
                    key={game.id}
                    onClick={() => {
                      if (game.status === "DONE") {
                        toast.error("This game is already completed");
                      } else {
                        setSelectedGame(game.id);
                      }
                    }}
                    className={`bg-black/60 border border-white/10 rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:bg-black/70 hover:scale-105 ${
                      selectedGame === game.id
                        ? "border-brass-warm bg-brass-warm/20 hover:bg-brass-warm/10"
                        : "hover:border-brass-warm/30"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-study-paper mb-1">
                          {game.title}
                        </h3>
                        <p className="text-white/60 text-sm">
                          Started:{" "}
                          {new Date(game.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      <div
                        className={`py-1 px-3 rounded-lg text-xs font-medium  ${statusInfo.color}`}
                      >
                        {statusInfo.icon} {statusInfo.label}
                      </div>
                    </div>

                    {selectedGame === game.id && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <button
                          className="w-full py-2 px-4 bg-brass-warm text-white rounded-lg hover:bg-wood-light transition-colors font-medium"
                          onClick={() => {
                            setGame(game.id);
                            toast.success(`Switched to ${game.title}`);
                          }}
                        >
                          Switch to This Case
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        {/* Account Section */}
        <div className="bg-black/60 border border-white/10 rounded-2xl p-8">
          <h2 className="font-semibold text-xl text-study-paper mb-6">
            👤 Account
          </h2>

          <div className="space-y-6">
            {/* User Info */}
            <div className="flex items-center justify-between py-4 border-b border-white/10">
              <div>
                <h3 className="font-semibold text-study-paper">
                  Detective Profile
                </h3>
                <p className="text-white/60 text-sm">
                  Manage your investigation profile
                </p>
              </div>
              <button className="px-4 py-2 bg-black/40 border border-white/20 rounded-lg text-white/80 hover:bg-black/60 transition-colors">
                Edit Profile
              </button>
            </div>

            {/* Preferences */}
            <div className="flex items-center justify-between py-4 border-b border-white/10">
              <div>
                <h3 className="font-semibold text-study-paper">
                  Investigation Preferences
                </h3>
                <p className="text-white/60 text-sm">
                  Audio, notifications, and game settings
                </p>
              </div>
              <button className="px-4 py-2 bg-black/40 border border-white/20 rounded-lg text-white/80 hover:bg-black/60 transition-colors">
                Configure
              </button>
            </div>

            {/* Logout */}
            <div className="flex items-center justify-between py-4">
              <div>
                <h3 className="font-semibold text-study-paper">Sign Out</h3>
                <p className="text-white/60 text-sm">
                  End your investigation session
                </p>
              </div>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="px-6 py-2 bg-mahogany text-white rounded-lg hover:bg-leather-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? "Signing Out..." : "Sign Out"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <AudioPlayer src="/audio/settings.wav" volume={0.03} />
    </div>
  );
}
