/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useGame } from "@/contexts/GameContext";
import { QueryCache, queryOptions, useQuery } from "@tanstack/react-query";
import { fetchCharacters, sendMessage } from "@/lib/helpers";
import { toast } from "react-hot-toast";

export default function Characters() {
  const { user, checkingUser } = useAuth();
  const { currentGameId } = useGame();
  const router = useRouter();
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState({});
  const inputRef = useRef(null);
  // Fetch characters data
  const {
    data: characters,
    isLoading: charactersLoading,
    error: charactersError,
  } = useQuery({
    queryKey: ["characters", currentGameId],
    queryFn: () => fetchCharacters(currentGameId),
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

  const handleSendMessage = async () => {
    const inputValue =
      inputRef.current?.textContent || inputRef.current?.innerText;

    if (!inputValue?.trim()) return;

    setIsLoading(true);

    const query = `I want to talk to ${selectedCharacter.name} about "${inputValue}"`;

    try {
      const apiResponse = await sendMessage(currentGameId, query);
      console.log(apiResponse);

      // Update responses state with the AI response for this character
      setResponses((prev) => ({
        ...prev,
        [selectedCharacter.id]: {
          message: apiResponse.response || "No response received",
        },
      }));

      // Don't clear selected character - keep it to show response for this character
      // setSelectedCharacter(null);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");

      // Set error response for this character
      setResponses((prev) => ({
        ...prev,
        [selectedCharacter.id]: {
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-gold mx-auto mb-4"></div>
          <p className="text-rose-gold">Loading user session...</p>
        </div>
      </div>
    );
  }

  // Don't render if no user (will redirect)
  if (!user) {
    return null;
  }

  // Show loading while fetching characters
  if (charactersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-[linear-gradient(rgba(0,0,0,1),rgba(0,0,0,0.4)),url('/images/characters.png')] text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-gold mx-auto mb-4"></div>
          <p className="text-rose-gold">Loading characters...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (charactersError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-[linear-gradient(rgba(0,0,0,1),rgba(0,0,0,0.4)),url('/images/characters.png')] text-white">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">
            Error Loading Characters
          </h2>
          <p className="text-gray-300 mb-4">
            {charactersError?.message || "Failed to load character data"}
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

  // Show no characters state
  if (!characters || characters.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-[linear-gradient(rgba(0,0,0,1),rgba(0,0,0,0.4)),url('/images/characters.png')] text-white">
        <div className="text-center">
          <div className="text-rose-gold text-6xl mb-4">👥</div>
          <h2 className="text-2xl font-bold text-rose-gold mb-2">
            No Characters Found
          </h2>
          <p className="text-gray-300">
            No characters available for this game yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat text-white p-4 bg-[linear-gradient(rgba(0,0,0,1),rgba(0,0,0,0.4)),url('/images/characters.png')]">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10 pt-4">
        <div className="grid grid-cols-3 items-center justify-items-center ">
          <Link
            href="/"
            className="text-rose-gold hover:text-wine transition-colors justify-self-start"
          >
            ← Back to Investigation
          </Link>
          <h1 className="font-mystery-bold text-3xl text-rose-gold">
            Characters
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Character Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {characters.map((character) => (
            <div
              key={character.id}
              onClick={() => setSelectedCharacter(character)}
              className={`bg-black/40 border rounded-2xl p-6 cursor-pointer transition-all  hover:scale-105 ${
                selectedCharacter?.id === character.id
                  ? " bg-rose-gold/90 hover:bg-rose-gold/70"
                  : "border-white/20 hover:border-rose-gold hover:bg-black/60"
              }`}
            >
              <div className="text-center mb-4  transition-transform">
                {character.image_url ? (
                  <div className="w-full h-60 mx-auto mb-2 rounded-4xl overflow-hidden border-2 border-rose-gold/50">
                    <img
                      src={character.image_url}
                      alt={character.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="text-4xl hidden">👤</div>
                  </div>
                ) : (
                  <div className="text-4xl mb-2 h-60 text-center  rounded-4xl flex items-center justify-center">
                    {character.avatar || "👤"}
                  </div>
                )}
                <h3
                  className={`font-mystery-bold text-lg  ${
                    selectedCharacter?.id === character.id
                      ? "text-burgundy-dark"
                      : "text-rose-gold"
                  }`}
                >
                  {character.name}
                </h3>
                <p
                  className={`text-sm  mb-2 font-base leading-snug italic ${
                    selectedCharacter?.id === character.id
                      ? "text-burgundy-dark"
                      : "text-rose-gold"
                  }`}
                >
                  {character.description || "Character"}
                </p>
                <span
                  className={`inline-block px-3 py-1 text-xs rounded-full border-2 ${
                    selectedCharacter?.id === character.id
                      ? "border-burgundy-light text-white bg-burgundy-light"
                      : "text-rose-gold"
                  }`}
                >
                  {character.is_victim
                    ? "Victim"
                    : character.is_alive
                    ? "Alive"
                    : "Suspect"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Character Details */}
        {selectedCharacter && (
          <div className="bg-black/60 border border-white/20 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-mystery-bold text-2xl text-rose-gold">
                {selectedCharacter.name}
              </h2>
              <button
                onClick={() => setSelectedCharacter(null)}
                className="text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Profile */}
              <div>
                <h3 className="font-mystery-bold text-lg text-rose-gold mb-3">
                  📋 Profile
                </h3>
                <p className="text-white italic mb-4 leading-relaxed">
                  {selectedCharacter.description ||
                    selectedCharacter.profile ||
                    "No profile information available."}
                </p>

                {/* Personality Section */}
                <h3 className="font-mystery-bold text-lg text-rose-gold mb-3">
                  🧠 Personality
                </h3>
                <ul className="space-y-2 mb-4">
                  {selectedCharacter.personality &&
                  Object.keys(selectedCharacter.personality).length > 0
                    ? Object.values(selectedCharacter.personality)[0] instanceof
                      Array
                      ? Object.values(selectedCharacter.personality)
                          .flat()
                          .map((trait) => (
                            <li
                              key={trait}
                              className="flex items-start space-x-2"
                            >
                              <span className="text-rose-gold">•</span>
                              <span className="text-white italic">{trait}</span>
                            </li>
                          ))
                      : Object.keys(selectedCharacter.personality).map(
                          (trait) => (
                            <li
                              key={trait}
                              className="flex items-start space-x-2"
                            >
                              <span className="text-rose-gold">•</span>
                              <span className="text-white italic">{trait}</span>
                            </li>
                          )
                        )
                    : "DEFAULT"}
                </ul>

                {/* Secrets Section */}
                {selectedCharacter.secrets &&
                  selectedCharacter.secrets.length > 0 && (
                    <>
                      <h3 className="font-mystery-bold text-lg text-rose-gold mb-3">
                        🤫 Secrets
                      </h3>
                      <ul className="space-y-2 mb-4">
                        {selectedCharacter.secrets.map((secret, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2"
                          >
                            <span className="text-rose-gold">•</span>
                            <span className="text-white italic">{secret}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                {/* Relationships Section */}
                {selectedCharacter.relationships &&
                  Object.keys(selectedCharacter.relationships).length > 0 && (
                    <>
                      <h3 className="font-mystery-bold text-lg text-rose-gold mb-3">
                        👥 Relationships
                      </h3>
                      <div className="space-y-2 mb-4">
                        {Object.entries(selectedCharacter.relationships).map(
                          ([person, relationship], index) => (
                            <div
                              key={index}
                              className="flex items-start space-x-2"
                            >
                              <span className="text-rose-gold">•</span>
                              <span className="text-white italic">
                                {" "}
                                {relationship}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </>
                  )}

                <h3 className="font-mystery-bold text-lg text-rose-gold mb-3">
                  👁️ Observations
                </h3>
                <ul className="space-y-2">
                  {selectedCharacter.observations &&
                  Object.keys(selectedCharacter.observations).length > 0 ? (
                    Object.values(selectedCharacter.observations).map(
                      (value, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-rose-gold">•</span>
                          <span className="text-white italic">{value}</span>
                        </li>
                      )
                    )
                  ) : (
                    <li className="text-white italic">
                      No observations yet...
                    </li>
                  )}
                </ul>
              </div>

              {/* Questions */}
              <div className=" rounded-lg h-full flex flex-col">
                <h3 className="font-mystery-bold text-lg text-rose-gold mb-3">
                  Interrogate Character
                </h3>
                <div
                  contentEditable
                  ref={inputRef}
                  className="flex-1 border-2 border-rose-gold/70 rounded-lg px-3 py-2 focus:outline-none focus:border-rose-gold" // Style like input
                  suppressContentEditableWarning={true}
                  onKeyPress={handleKeyPress}
                />

                {/* Response Display */}
                {responses[selectedCharacter.id] && (
                  <>
                    <h3 className="font-mystery-bold text-lg text-rose-gold mb-3 mt-4">
                      {selectedCharacter.name} says:
                    </h3>
                    <div className=" border-2 border-rose-gold/70 rounded-lg px-3 py-2">
                      <div className="text-white leading-relaxed px-2 py-4">
                        {responses[selectedCharacter.id].message}
                      </div>
                    </div>
                  </>
                )}

                <div className="mt-6">
                  <button
                    onClick={() => {
                      handleSendMessage();
                    }}
                    className="w-full py-3 px-6 bg-rose-gold text-burgundy-dark rounded-lg hover:bg-wine hover:text-white transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mx-auto"></div>
                    ) : (
                      "💬 Start Conversation"
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
