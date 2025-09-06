"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useGame } from "@/contexts/GameContext";
import { useQuery } from "@tanstack/react-query";
/* eslint-disable @next/next/no-img-element */
import { fetchClues, sendMessage } from "@/lib/helpers";
import { toast } from "react-hot-toast";

export default function Evidence() {
  const { user, checkingUser } = useAuth();
  const { currentGameId } = useGame();
  const router = useRouter();
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState({});
  const inputRef = useRef(null);

  // Fetch clues data
  const {
    data: clues,
    isLoading: cluesLoading,
    error: cluesError,
  } = useQuery({
    queryKey: ["clues", currentGameId],
    queryFn: () => fetchClues(currentGameId),
    enabled: !!currentGameId && !!user && !checkingUser,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: false,
  });

  // Protect this route - redirect to login if not authenticated
  useEffect(() => {
    if (!checkingUser && !user) {
      router.push("/login");
    }
  }, [user, checkingUser, router]);

  const clueurgency = (clue) => {
    console.log(clue);
    if (clue.significance_level === 1) {
      return "📝 Minor";
    } else if (clue.significance_level > 1 && clue.significance_level <= 4) {
      return "⚡ Important";
    } else {
      return "🔥 Critical";
    }
  };

  const handleSendMessage = async () => {
    const inputValue =
      inputRef.current?.textContent || inputRef.current?.innerText;

    if (!inputValue?.trim()) return;
    if (inputRef.current) {
      inputRef.current.textContent = "";
    }
    setIsLoading(true);

    const query = `I want to analyze the clue "${selectedEvidence.title}" regarding "${inputValue}"`;

    try {
      const apiResponse = await sendMessage(currentGameId, query);
      console.log(apiResponse);

      // Update responses state with the AI response for this clue
      setResponses((prev) => ({
        ...prev,
        [selectedEvidence.id]: {
          message: apiResponse.response || "No response received",
        },
      }));

      // Don't clear selected evidence - keep it to show response for this clue
      // setSelectedEvidence(null);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");

      // Set error response for this clue
      setResponses((prev) => ({
        ...prev,
        [selectedEvidence.id]: {
          message: "Sorry, I couldn't process your request. Please try again.",
        },
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (isLoading) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Show loading while checking authentication
  if (checkingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-paper-light mx-auto mb-4"></div>
          <p className="text-paper-light">Loading user session...</p>
        </div>
      </div>
    );
  }

  // Don't render if no user (will redirect)
  if (!user) {
    return null;
  }

  // Show loading while fetching clues
  if (cluesLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.4)),url('/images/clues.png')",
        }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-paper-light mx-auto mb-4"></div>
          <p className="text-paper-light">Loading evidence...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (cluesError) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.4)),url('/images/clues.png')",
        }}
      >
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">
            Error Loading Evidence
          </h2>
          <p className="text-gray-300 mb-4">
            {cluesError?.message || "Failed to load evidence data"}
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

  // Show no clues state
  if (!clues || clues.length === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.4)),url('/images/clues.png')",
        }}
      >
        <div className="text-center">
          <div className="text-paper-light text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-paper-light mb-2">
            No Evidence Found
          </h2>
          <p className="text-gray-300">No evidence has been discovered yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat text-white p-4"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.4)),url('/images/clues.png')",
      }}
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10 pt-4">
        <div className="grid grid-cols-3 items-center justify-items-center">
          <Link
            href="/"
            className="text-paper-light hover:text-brass transition-colors justify-self-start"
          >
            ← Back to Investigation
          </Link>
          <h1 className="font-bold text-2xl text-paper-light ">Evidence</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Evidence Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {clues.map((evidence) => {
            return (
              <div
                key={evidence.id}
                onClick={() => setSelectedEvidence(evidence)}
                className={`bg-black/60 border border-white/10 rounded-3xl p-6 cursor-pointer transition-all duration-200 hover:bg-black/70 hover:scale-105 ${
                  selectedEvidence?.id === evidence.id
                    ? "!border-white border bg-gold-bright/40 hover:bg-gold-bright/30"
                    : "hover:border-gold-bright/30"
                }`}
              >
                <div className="text-center mb-3">
                  {evidence.image_url ? (
                    <div className="w-full h-60 mx-auto mb-2 rounded-4xl overflow-hidden border-2 border-gold-bright/50">
                      <img
                        src={evidence.image_url}
                        alt={evidence.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "block";
                        }}
                      />
                      <div className="text-4xl hidden">🔍</div>
                    </div>
                  ) : (
                    <div className="text-3xl mb-3 h-60 rounded-4xl flex items-center justify-center">
                      🔍
                    </div>
                  )}
                  <h3
                    className={`font-semibold text-medium italic mb-1 ${
                      selectedEvidence?.id === evidence.id
                        ? "text-paper-light"
                        : "text-gold-bright"
                    }`}
                  >
                    {evidence.title}
                  </h3>
                </div>

                <div
                  className={`text-center py-1 px-3 rounded-lg text-xs font-medium  mb-3 
                    
                  ${
                    selectedEvidence?.id === evidence.id
                      ? "text-paper-light"
                      : "text-gold-bright/80"
                  }`}
                >
                  {clueurgency(evidence)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Evidence Details */}
        {selectedEvidence && (
          <div className="bg-black/60 border border-white/10 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-xl text-gold-bright">
                Evidence: {selectedEvidence.title}
              </h2>
              <button
                onClick={() => setSelectedEvidence(null)}
                className="text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Evidence Details */}
              <div className="flex flex-col">
                <div className="flex-1">
                  <h3 className="font-semibold text-base text-gold-bright mb-3">
                    📋 Description
                  </h3>
                  <p className="text-paper-light mb-6 leading-relaxed italic">
                    {selectedEvidence.description}
                  </p>

                  <h3 className="font-semibold text-base text-gold-bright mb-3">
                    📍 Discovery Details
                  </h3>
                  <ul className="space-y-1 mb-6">
                    <li className="text-paper-light italic">
                      • Discovered By: {selectedEvidence.discovered_by}
                    </li>
                    <li className="text-paper-light italic">
                      • Discovery Method: {selectedEvidence.discovery_method}
                    </li>
                    {selectedEvidence.points_to &&
                      selectedEvidence.points_to.length > 0 && (
                        <li className="text-paper-light italic">
                          • Points To: {selectedEvidence.points_to.join(", ")}
                        </li>
                      )}
                  </ul>
                </div>
              </div>

              {/* Right Column - Analysis */}
              <div className="flex flex-col">
                <h3 className="font-semibold text-base text-gold-bright mb-3">
                  🔬 Analyze Evidence
                </h3>
                <p className="text-paper-light mb-4 text-sm italic">
                  What would you like to analyze about this evidence?
                </p>
                <div
                  contentEditable
                  ref={inputRef}
                  className="flex-1 border-2 border-brass/70 rounded-lg px-3 py-2 focus:outline-none focus:border-gold-bright text-paper-light bg-black/40 min-h-0"
                  suppressContentEditableWarning={true}
                  onKeyPress={handleKeyPress}
                  data-placeholder="Enter your analysis focus (e.g., 'Test for fingerprints', 'Compare with other evidence', 'Check for DNA traces')..."
                />

                {/* Response Display */}
                {responses[selectedEvidence.id] && (
                  <>
                    <h3 className="font-semibold text-base text-gold-bright mb-3 mt-4">
                      Analysis reveals:
                    </h3>
                    <div className="border-2 border-brass/70 rounded-lg px-3 py-2 text-paper-light bg-black/40">
                      <div className="leading-relaxed">
                        {responses[selectedEvidence.id].message}
                      </div>
                    </div>
                  </>
                )}

                <div className="mt-4">
                  <button
                    onClick={() => {
                      handleSendMessage();
                    }}
                    className="w-full py-3 px-6 rounded-lg font-medium transition-colors bg-brass text-white hover:bg-gold-bright disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
                    ) : (
                      "🔬 Start Analysis"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
