"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useGame } from "@/contexts/GameContext";
import { useQuery } from "@tanstack/react-query";
import { fetchTimelineEvents, sendMessage } from "@/lib/helpers";
import { toast } from "react-hot-toast";
import AudioPlayer from "@/components/AudioPlayer";

export default function Timeline() {
  const { user, checkingUser } = useAuth();
  const { currentGameId } = useGame();
  const router = useRouter();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState({});

  // Typewriter effect state
  const [streamingResponse, setStreamingResponse] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef(null);

  // State to persist each event's input content
  const [eventInputs, setEventInputs] = useState({});

  // Fetch timeline events data
  const {
    data: timelineEvents,
    isLoading: timelineLoading,
    error: timelineError,
  } = useQuery({
    queryKey: ["timeline_events", currentGameId],
    queryFn: () => fetchTimelineEvents(currentGameId),
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

  // Typewriter effect function
  const typewriterEffect = (text, callback, speed = 30) => {
    let i = 0;
    const timer = setInterval(() => {
      callback(text.slice(0, i + 1));
      i++;
      if (i === text.length) {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, speed);
    return timer;
  };

  // Restore content when switching events
  useEffect(() => {
    if (selectedEvent && inputRef.current) {
      const savedContent = eventInputs[selectedEvent.id] || "";
      inputRef.current.textContent = savedContent;
    }
  }, [selectedEvent, eventInputs]);

  const handleSendMessage = async () => {
    const inputValue =
      inputRef.current?.textContent || inputRef.current?.innerText;

    if (!inputValue?.trim()) return;

    setIsLoading(true);
    setStreamingResponse(""); // Clear previous streaming text

    const query = `I want to investigate the timeline event "${selectedEvent.event_description}" regarding "${inputValue}"`;

    try {
      const apiResponse = await sendMessage(currentGameId, query);
      console.log(apiResponse);

      if (apiResponse?.response) {
        setIsTyping(true);
        typewriterEffect(apiResponse.response, setStreamingResponse, 30);
      }

      // Update responses state with the AI response for this timeline event
      setResponses((prev) => ({
        ...prev,
        [selectedEvent.id]: {
          message: apiResponse.response || "No response received",
        },
      }));

      // Don't clear selected event - keep it to show response for this event
      // setSelectedEvent(null);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");

      // Set error response for this timeline event
      setResponses((prev) => ({
        ...prev,
        [selectedEvent.id]: {
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-shadow mx-auto mb-4"></div>
          <p className="text-shadow">Loading user session...</p>
        </div>
      </div>
    );
  }

  // Don't render if no user (will redirect)
  if (!user) {
    return null;
  }

  // Show loading while fetching timeline events
  if (timelineLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url('/images/timeline.png')",
        }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-shadow mx-auto mb-4"></div>
          <p className="text-shadow">Loading timeline...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (timelineError) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url('/images/timeline.png')",
        }}
      >
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">
            Error Loading Timeline
          </h2>
          <p className="text-gray-300 mb-4">
            {timelineError?.message || "Failed to load timeline data"}
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

  // Show no timeline events state
  if (!timelineEvents || timelineEvents.length === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url('/images/timeline.png')",
        }}
      >
        <div className="text-center">
          <div className="text-shadow text-6xl mb-4">⏰</div>
          <h2 className="text-2xl font-bold text-red-bright mb-2">
            No Timeline Events Found
          </h2>
          <p className="text-gray-300">
            No timeline events have been recorded yet.
          </p>
        </div>
      </div>
    );
  }

  // Sort events chronologically
  const sortedEvents = [...timelineEvents].sort((a, b) => {
    const timeA = new Date(a.event_time);
    const timeB = new Date(b.event_time);
    return timeA - timeB;
  });

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat text-white p-4"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.5)), url('/images/timeline.png')",
      }}
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10 pt-4">
        <div className="grid grid-cols-3 items-center justify-items-center">
          <Link
            href="/"
            className="text-white hover:text-red-bright transition-colors justify-self-start"
          >
            ← Back to Investigation
          </Link>
          <h1 className="font-bold text-2xl text-red-bright">Timeline</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto ">
        {/* Timeline Events - Horizontal Flow */}
        <div className="mb-8">
          <div className="flex flex-wrap items-stretch justify-start gap-6 px-4 py-6">
            {sortedEvents.map((event, index) => {
              const eventDate = new Date(event.event_time);
              const eventTimeString = eventDate.toLocaleTimeString();
              const eventDateString = eventDate.toLocaleDateString();

              return (
                <div key={event.id} className="flex">
                  {/* Event Card */}
                  <div
                    onClick={() => {
                      // Save current event's content before switching
                      if (selectedEvent && inputRef.current) {
                        const currentContent =
                          inputRef.current.textContent ||
                          inputRef.current.innerText ||
                          "";
                        setEventInputs((prev) => ({
                          ...prev,
                          [selectedEvent.id]: currentContent,
                        }));
                      }
                      // Switch to new event
                      setSelectedEvent(event);
                    }}
                    className={`bg-black/80 border border-white/10 rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:bg-black/70 w-55  flex-shrink-0 hover:scale-105 ${
                      selectedEvent?.id === event.id
                        ? "!border-white bg-investigation-red/50 hover:bg-investigation-red/40"
                        : "hover:border-investigation-red/30"
                    }`}
                  >
                    {/* Event content */}
                    <div className="text-center">
                      <div className="mb-3">
                        <span className="font-semibold text-calendar-paper text-lg block">
                          {eventTimeString}
                        </span>
                        <span className="text-white/60 text-sm">
                          {eventDateString}
                        </span>
                      </div>

                      <div
                        className={`py-1 px-3 rounded-lg text-xs font-medium mb-3 mx-auto inline-block border border-investigation-red text-investigation-red ${
                          selectedEvent?.id === event.id ? "bg-white" : ""
                        }`}
                      >
                        {event.event_type || "general"}
                      </div>

                      <h3 className="font-base text-calendar-paper text-sm mb-2 italic  ">
                        {event.event_description}
                      </h3>

                      <div className="space-y-1 text-sm text-white/80">
                        <div>📍 {event.location_id || "Unknown"}</div>
                      </div>
                    </div>
                  </div>

                  {/* Arrow to next event */}
                  {index < sortedEvents.length - 1 && (
                    <div className="flex items-center justify-center w-12 flex-shrink-0 ml-4">
                      <div className="text-investigation-red text-6xl">→</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Event Details */}
        {selectedEvent && (
          <div className="bg-black/60 border border-white/10 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-xl text-investigation-red">
                Event Details:
              </h2>
              <button
                onClick={() => {
                  // Save current event's content before closing
                  if (selectedEvent && inputRef.current) {
                    const currentContent =
                      inputRef.current.textContent ||
                      inputRef.current.innerText ||
                      "";
                    setEventInputs((prev) => ({
                      ...prev,
                      [selectedEvent.id]: currentContent,
                    }));
                  }
                  setSelectedEvent(null);
                }}
                className="text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Event Info */}
              <div>
                <h3 className="font-semibold text-base text-investigation-red mb-3">
                  📋 Event Summary
                </h3>
                <p className="text-white mb-6 leading-relaxed italic">
                  {selectedEvent.event_description}
                </p>

                <h3 className="font-semibold text-base text-investigation-red mb-3">
                  📍 Event Details
                </h3>
                <ul className="space-y-1 mb-6">
                  <li className="text-white italic">
                    • Time:{" "}
                    {new Date(selectedEvent.event_time).toLocaleString()}
                  </li>
                  <li className="text-white italic">
                    • Location: {selectedEvent.location_id || "Unknown"}
                  </li>
                  <li className="text-white italic">
                    • Type: {selectedEvent.event_type || "general"}
                  </li>
                  {selectedEvent.character_ids &&
                    selectedEvent.character_ids.length > 0 && (
                      <li className="text-white italic">
                        • Characters: {selectedEvent.character_ids.join(", ")}
                      </li>
                    )}
                  {selectedEvent.witness_ids &&
                    selectedEvent.witness_ids.length > 0 && (
                      <li className="text-white italic">
                        • Witnesses: {selectedEvent.witness_ids.join(", ")}
                      </li>
                    )}
                </ul>
              </div>

              {/* Right Column - Analysis */}
              <div className="flex flex-col">
                <h3 className="font-semibold text-base text-calendar-paper mb-3">
                  🔍 Analyze Event
                </h3>
                <p className="text-white mb-4 text-sm italic">
                  What would you like to investigate about this event?
                </p>
                <div
                  contentEditable
                  ref={inputRef}
                  className="flex-1 border-2 border-investigation-red/70 rounded-lg px-3 py-2 focus:outline-none focus:border-calendar-paper text-white bg-black/40 min-h-0"
                  suppressContentEditableWarning={true}
                  onKeyPress={handleKeyPress}
                  data-placeholder="Enter your investigation focus (e.g., 'Check for inconsistencies', 'Cross-reference with other events', 'Interview witnesses')..."
                />

                {/* Response Display */}
                {(responses[selectedEvent.id] || isTyping) && (
                  <>
                    <h3 className="font-semibold text-base text-calendar-paper mb-3 mt-4">
                      Timeline event reveals:
                    </h3>
                    <div className="border-2 border-investigation-red/70 rounded-lg px-3 py-2 text-white bg-black/40">
                      <div className="leading-relaxed px-2 py-4">
                        {isTyping ? (
                          <>
                            {streamingResponse}
                            <span className="animate-pulse text-green-400">
                              |
                            </span>
                          </>
                        ) : (
                          responses[selectedEvent.id]?.message
                        )}
                      </div>
                    </div>
                  </>
                )}

                <div className="mt-4">
                  <button
                    onClick={() => {
                      handleSendMessage();
                    }}
                    className="w-full py-3 px-6 rounded-lg font-medium transition-colors bg-investigation-red text-white hover:bg-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
                    ) : (
                      "🔍 Start Investigation"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <AudioPlayer src="/audio/timeline.wav" volume={0.005} />
    </div>
  );
}
