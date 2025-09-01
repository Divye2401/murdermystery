"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/supabase";

const mockGames = [
  {
    id: 1,
    title: "The Blackwood Manor Mystery",
    date: "March 15, 2024",
    status: "active",
  },
  {
    id: 2,
    title: "Death at the Opera House",
    date: "March 10, 2024",
    status: "completed",
  },
  {
    id: 3,
    title: "The Poisoned Chalice",
    date: "March 8, 2024",
    status: "paused",
  },
  {
    id: 4,
    title: "Murder on the Orient Express",
    date: "March 5, 2024",
    status: "completed",
  },
];

export default function Settings() {
  const [selectedGame, setSelectedGame] = useState(1);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const getStatusInfo = (status) => {
    switch (status) {
      case "active":
        return {
          color: "text-brass-warm  ",
          icon: "🎮",
          label: "Active",
        };
      case "completed":
        return {
          color: "text-study-paper ",
          icon: "✅",
          label: "Completed",
        };
      case "paused":
        return {
          color: "text-wood-light ",
          icon: "⏸️",
          label: "Paused",
        };
      default:
        return {
          color: "text-leather-dark ",
          icon: "❓",
          label: "Unknown",
        };
    }
  };

  const handleGameSwitch = (gameId) => {
    setSelectedGame(gameId);
    // TODO: Implement actual game switching logic
    console.log(`Switching to game ${gameId}`);
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
            {mockGames.map((game) => {
              const statusInfo = getStatusInfo(game.status);

              return (
                <div
                  key={game.id}
                  onClick={() => handleGameSwitch(game.id)}
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
                        Started: {game.date}
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
                      <button className="w-full py-2 px-4 bg-brass-warm text-white rounded-lg hover:bg-wood-light transition-colors font-medium">
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
    </div>
  );
}
