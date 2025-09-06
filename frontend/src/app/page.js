"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchConversationHistory,
  sendMessage,
  createGame,
} from "@/lib/helpers";
import AudioPlayer from "@/components/AudioPlayer";
import { useGame } from "@/contexts/GameContext";
import { toast } from "react-hot-toast";

export default function Dashboard() {
  const { user, checkingUser } = useAuth();
  const router = useRouter();
  const {
    currentGameId: gameId,
    currentGamename: gameName,
    fetchCurrentGame,
  } = useGame();
  const queryClient = useQueryClient();

  const {
    data: conversations,
    isLoading: conversationsLoading,
    error: conversationsError,
    refetch,
  } = useQuery({
    queryKey: ["conversations", gameId],
    queryFn: () => fetchConversationHistory(gameId),
    enabled: !!gameId && !!user,
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
    refetchOnWindowFocus: false,
  });

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // New Game Modal state
  const [showNewGameModal, setShowNewGameModal] = useState(false);
  const [newGameData, setNewGameData] = useState({
    title: "",
    description: "",
    numberOfCharacters: 5,
  });
  const [creatingGame, setCreatingGame] = useState(false);

  // Protect this route - redirect to login if not authenticated
  useEffect(() => {
    if (!user && !checkingUser) {
      router.push("/login");
    }
  }, [user, checkingUser, router]);

  // Don't render dashboard if no user (will redirect)
  if (!user) {
    return null;
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    setInputValue("");
    setIsLoading(true);

    const response = await sendMessage(gameId, inputValue);
    console.log(response);
    setIsLoading(false);
    refetch();
  };

  const handleKeyPress = (e) => {
    if (isLoading) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCreateGame = async () => {
    if (!newGameData.title.trim()) {
      toast.error("Game title is required");
      return;
    }

    setCreatingGame(true);
    try {
      const response = await createGame(user.id, newGameData);
      console.log("Create game response:", response);

      if (response && !response.error) {
        toast.success("New game created successfully!");
        setShowNewGameModal(false);
        setNewGameData({
          title: "",
          description: "",
          numberOfCharacters: 5,
        });
        // Fetch and switch to the newly created game
        await fetchCurrentGame();
      } else {
        toast.error(response?.error || "Failed to create game");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setCreatingGame(false);
      setShowNewGameModal(false);
    }
  };

  return (
    <div
      className="min-h-screen text-white relative"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url('/images/dashboard1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Clean Header */}
      <header className="bg-black/40 border-b border-cream/20 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-cream">🕵️ {gameName}</h1>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowNewGameModal(true)}
              className="p-2 rounded-lg bg-cream/20 hover:bg-cream/30 transition-colors border border-cream/30"
              title="Create New Game"
            >
              ➕
            </button>
            <Link
              href="/settings"
              className="p-2 rounded-lg bg-cream/20 hover:bg-cream/30 transition-colors"
            >
              ⚙️
            </Link>
            <button className="p-2 rounded-lg bg-cream/20 hover:bg-cream/30 transition-colors">
              👤
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* HIGHLIGHT: Modern Investigation Chat */}
        <div className="bg-black/60 border border-cream/40 rounded-3xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-cream flex items-center gap-3">
              <div className="w-3 h-3 bg-cream rounded-full animate-pulse"></div>
              Investigation Chat
            </h2>
            <div className="text-sm text-cream bg-cream/20 px-3 py-1 rounded-full">
              AI Assistant Active
            </div>
          </div>

          {/* Modern Messages Area - HIGHLIGHTED */}
          <div className="h-96 overflow-y-auto space-y-4 mb-6 p-6 bg-gradient-to-b from-black/20 to-black/40 rounded-2xl border border-cream/20">
            {conversationsLoading ? (
              <div className="flex justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cream mx-auto mb-2"></div>
                  <p className="text-white/60 text-sm">
                    Loading conversation...
                  </p>
                </div>
              </div>
            ) : conversationsError ? (
              <div className="flex justify-center py-8">
                <div className="text-center">
                  <div className="text-red-400 text-2xl mb-2">⚠️</div>
                  <p className="text-white/60 text-sm">
                    Failed to load conversation
                  </p>
                </div>
              </div>
            ) : conversations && conversations.length > 0 ? (
              conversations.map((conversation, index) => (
                <div key={index} className="space-y-2">
                  {/* User Query */}
                  <div className="flex justify-end">
                    <div className="max-w-lg px-5 py-4 rounded-2xl bg-gradient-to-r from-cream to-cream text-black ">
                      <div className="text-sm leading-relaxed">
                        {conversation.user_query}
                      </div>
                      <div className="text-xs opacity-60 mt-2 flex items-center gap-1">
                        <span>•</span>
                        <span>
                          {new Date(conversation.created_at).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              day: "2-digit",
                              month: "2-digit",
                              timeZone: "UTC",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex justify-start">
                    <div className="max-w-2xl px-5 py-4 rounded-4xl bg-black/70 border border-cream/30 text-white">
                      <div className="text-sm leading-relaxed">
                        {conversation.agent_response}
                      </div>
                      <div className="text-xs opacity-60 mt-2 flex items-center gap-1">
                        <span>•</span>
                        <span>
                          {new Date(conversation.created_at).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              day: "2-digit",
                              month: "2-digit",
                              timeZone: "UTC",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-center py-8">
                <div className="text-center">
                  <div className="text-cream text-4xl mb-4">🕵️</div>
                  <p className="text-white/60 text-sm">
                    Welcome to your investigation, Detective.
                    <br />
                    What would you like to investigate first?
                  </p>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex justify-center">
                <div className="bg-black/70 border border-cream/30 px-5 py-4 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cream"></div>
                    <span className="text-sm text-cream">
                      Analyzing your question...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modern Input Area - SLEEK */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about the case..."
                className="w-full px-6 py-4 rounded-2xl bg-black/40 border border-cream/40 text-white placeholder-cream/60 focus:outline-none focus:ring-2 focus:ring-cream/60 focus:border-cream/60 transition-all text-lg"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cream/40">
                💬
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="px-8 py-4 bg-gradient-to-r from-cream to-cream text-black rounded-2xl hover:from-cream hover:to-cream transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
            >
              Send
            </button>
          </div>
        </div>

        {/* Sleek Quick Actions - Secondary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Link
            href="/characters"
            className="bg-black/40 border border-cream/20 rounded-2xl p-6 hover:bg-black/50 hover:border-cream/40 transition-all group block"
          >
            <div className="text-3xl mb-3 group-hover:scale-105 transition-transform">
              🎭
            </div>
            <div className="font-semibold group-hover:scale-105 transition-transform text-cream mb-1">
              Characters
            </div>
            <div className="text-sm group-hover:scale-105 transition-transform text-cream/60">
              Interview suspects
            </div>
          </Link>

          <Link
            href="/locations"
            className="bg-black/40 border border-cream/20 rounded-2xl p-6 hover:bg-black/50 hover:border-cream/40 transition-all group block"
          >
            <div className="text-3xl mb-3 group-hover:scale-105 transition-transform">
              🏛️
            </div>
            <div className="font-semibold group-hover:scale-105 transition-transform text-cream mb-1">
              Locations
            </div>
            <div className="text-sm group-hover:scale-105 transition-transform text-cream/60">
              Explore scenes
            </div>
          </Link>

          <Link
            href="/evidence"
            className="bg-black/40 border border-cream/20 rounded-2xl p-6 hover:bg-black/50 hover:border-cream/40 transition-all group block"
          >
            <div className="text-3xl mb-3 group-hover:scale-105 transition-transform">
              🔎
            </div>
            <div className="font-semibold group-hover:scale-105 transition-transform text-cream mb-1">
              Evidence
            </div>
            <div className="text-sm group-hover:scale-105 transition-transform text-cream/60">
              Examine clues
            </div>
          </Link>

          <Link
            href="/timeline"
            className="bg-black/40 border border-cream/20 rounded-2xl p-6 hover:bg-black/50 hover:border-cream/40 transition-all group block"
          >
            <div className="text-3xl mb-3 group-hover:scale-105 transition-transform">
              📅
            </div>
            <div className="font-semibold group-hover:scale-105 transition-transform text-cream mb-1">
              Timeline
            </div>
            <div className="text-sm group-hover:scale-105 transition-transform text-cream/60">
              Review events
            </div>
          </Link>
        </div>
      </div>

      {/* New Game Modal */}
      {showNewGameModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-black/90 border border-cream/40 rounded-3xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-cream mb-6 text-center">
              🎭 Create New Mystery
            </h3>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-cream text-sm font-medium mb-2">
                  Game Title *
                </label>
                <input
                  type="text"
                  value={newGameData.title}
                  onChange={(e) =>
                    setNewGameData({ ...newGameData, title: e.target.value })
                  }
                  placeholder="e.g., Murder at the Mansion"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-cream/40 text-white placeholder-cream/60 focus:outline-none focus:ring-2 focus:ring-cream/60"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-cream text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={newGameData.description}
                  onChange={(e) =>
                    setNewGameData({
                      ...newGameData,
                      description: e.target.value,
                    })
                  }
                  placeholder="A brief description of your mystery..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-cream/40 text-white placeholder-cream/60 focus:outline-none focus:ring-2 focus:ring-cream/60 resize-none"
                />
              </div>

              {/* Number of Characters */}
              <div>
                <label className="block text-cream text-sm font-medium mb-2">
                  Number of Characters
                </label>
                <select
                  value={newGameData.numberOfCharacters}
                  onChange={(e) =>
                    setNewGameData({
                      ...newGameData,
                      numberOfCharacters: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-cream/40 text-white focus:outline-none focus:ring-2 focus:ring-cream/60"
                >
                  <option value={3}>3 Characters</option>
                  <option value={4}>4 Characters</option>
                  <option value={5}>5 Characters</option>
                  <option value={6}>6 Characters</option>
                  <option value={7}>7 Characters</option>
                  <option value={8}>8 Characters</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  setShowNewGameModal(false);
                  setNewGameData({
                    title: "",
                    description: "",
                    numberOfCharacters: 5,
                  });
                }}
                className="flex-1 px-6 py-3 rounded-xl bg-gray-600/40 border border-gray-500/40 text-white hover:bg-gray-600/60 transition-colors"
                disabled={creatingGame}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGame}
                disabled={creatingGame || !newGameData.title.trim()}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-cream to-cream text-black hover:from-cream hover:to-cream transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {creatingGame ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                    Creating...
                  </div>
                ) : (
                  "Create Game"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <AudioPlayer src="/audio/dashboard.wav" volume={0.05} autoPlay />
    </div>
  );
}
