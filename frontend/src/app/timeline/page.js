"use client";

import { useState } from "react";
import Link from "next/link";

const mockTimelineEvents = [
  {
    id: 1,
    time: "7:30 PM",
    date: "March 15, 2024",
    event: "Butler arrives at manor",
    location: "Front entrance",
    witness: "Security guard",
    importance: "low",
    description: "James Wilson arrives for evening duties as scheduled.",
  },
  {
    id: 2,
    time: "8:00 PM",
    date: "March 15, 2024",
    event: "Victim last seen alive",
    location: "Library",
    witness: "Maid",
    importance: "high",
    description:
      "Lord Blackwood seen reading financial documents in the library.",
  },
  {
    id: 3,
    time: "8:30 PM",
    date: "March 15, 2024",
    event: "Argument overheard",
    location: "Study",
    witness: "Multiple staff",
    importance: "critical",
    description:
      "Loud argument between victim and unknown person in the study.",
  },
  {
    id: 4,
    time: "9:15 PM",
    date: "March 15, 2024",
    event: "Guest arrives unexpectedly",
    location: "Front entrance",
    witness: "Butler",
    importance: "medium",
    description: "Lady Margaret arrives unannounced, appears distressed.",
  },
  {
    id: 5,
    time: "10:00 PM",
    date: "March 15, 2024",
    event: "Power outage",
    location: "Entire manor",
    witness: "All present",
    importance: "high",
    description: "Electricity cuts out for approximately 15 minutes.",
  },
  {
    id: 6,
    time: "10:30 PM",
    date: "March 15, 2024",
    event: "Body discovered",
    location: "Study",
    witness: "Butler",
    importance: "critical",
    description: "James Wilson discovers Lord Blackwood's body in the study.",
  },
];

export default function Timeline() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterImportance, setFilterImportance] = useState("all");

  const getImportanceInfo = (importance) => {
    switch (importance) {
      case "critical":
        return {
          icon: "🔴",
          label: "Critical",
        };
      case "high":
        return {
          icon: "🟠",
          label: "High",
        };
      case "medium":
        return {
          icon: "🟡",
          label: "Medium",
        };
      case "low":
        return {
          icon: "🟢",
          label: "Low",
        };
      default:
        return {
          icon: "⚪",
          label: "Unknown",
        };
    }
  };

  const filteredEvents =
    filterImportance === "all"
      ? mockTimelineEvents
      : mockTimelineEvents.filter(
          (event) => event.importance === filterImportance
        );

  // Sort events chronologically
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const timeA = new Date(`${a.date} ${a.time}`);
    const timeB = new Date(`${b.date} ${b.time}`);
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
            className="text-calendar-paper hover:text-pin-yellow transition-colors justify-self-start"
          >
            ← Back to Investigation
          </Link>
          <h1 className="font-bold text-2xl text-calendar-paper">
            📅 Timeline
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Filter Tabs */}
        <div className="flex space-x-4 mb-8">
          {["all", "critical", "high", "medium", "low"].map((importance) => (
            <button
              key={importance}
              onClick={() => setFilterImportance(importance)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterImportance === importance
                  ? "bg-investigation-red text-white"
                  : "bg-black/60 border border-white/10 text-white/80 hover:bg-black/70"
              }`}
            >
              {importance === "all"
                ? "All Events"
                : importance.charAt(0).toUpperCase() + importance.slice(1)}
            </button>
          ))}
        </div>

        {/* Timeline Events - Horizontal Flow */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-6 px-4 py-6">
            {sortedEvents.map((event, index) => {
              const importanceInfo = getImportanceInfo(event.importance);

              return (
                <div key={event.id} className="flex items-center">
                  {/* Event Card */}
                  <div
                    onClick={() => setSelectedEvent(event)}
                    className={`bg-black/80 border border-white/10 rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:bg-black/70 w-80 flex-shrink-0 hover:scale-105 ${
                      selectedEvent?.id === event.id
                        ? "!border-white bg-investigation-red/50 hover:bg-investigation-red/40"
                        : "hover:border-investigation-red/30"
                    }`}
                  >
                    {/* Event content */}
                    <div className="text-center">
                      <div className="mb-3">
                        <span className="font-semibold text-calendar-paper text-lg block">
                          {event.time}
                        </span>
                        <span className="text-white/60 text-sm">
                          {event.date}
                        </span>
                      </div>

                      <div
                        className={`py-1 px-3 rounded-lg text-xs font-medium  mb-3 mx-auto inline-block ${importanceInfo.color}`}
                      >
                        {importanceInfo.icon} {importanceInfo.label}
                      </div>

                      <h3 className="font-semibold text-calendar-paper mb-2">
                        {event.event}
                      </h3>

                      <div className="space-y-1 text-sm text-white/80">
                        <div>📍 {event.location}</div>
                        <div>👁️ {event.witness}</div>
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
              <h2 className="font-bold text-xl text-calendar-paper">
                Event Details: {selectedEvent.time}
              </h2>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Event Info */}
              <div>
                <h3 className="font-semibold text-base text-calendar-paper mb-3">
                  📋 Event Summary
                </h3>
                <p className="text-white mb-4 leading-relaxed">
                  {selectedEvent.description}
                </p>

                <h3 className="font-semibold text-base text-calendar-paper mb-3">
                  📍 Event Details
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="text-investigation-red">•</span>
                    <span className="text-white">
                      Time: {selectedEvent.time}
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-investigation-red">•</span>
                    <span className="text-white">
                      Location: {selectedEvent.location}
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-investigation-red">•</span>
                    <span className="text-white">
                      Witness: {selectedEvent.witness}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Analysis */}
              <div>
                <h3 className="font-semibold text-base text-calendar-paper mb-3">
                  🔍 Investigation Notes
                </h3>
                <div className="bg-black/40 border border-white/10 rounded-lg p-4 mb-6">
                  <p className="text-white/80 text-sm">
                    This event has been marked as{" "}
                    <strong>{selectedEvent.importance}</strong> importance in
                    the investigation timeline. Cross-reference with witness
                    statements and physical evidence.
                  </p>
                </div>

                <div className="mt-6">
                  <button className="w-full py-3 px-6 bg-investigation-red text-white rounded-lg hover:bg-red-bright transition-colors font-medium">
                    📝 Add Investigation Note
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
