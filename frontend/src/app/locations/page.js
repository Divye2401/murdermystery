"use client";

import { useState } from "react";
import Link from "next/link";

const mockLocations = [
  {
    id: 1,
    name: "Library",
    icon: "📚",
    status: "examined",
    accessLevel: "open",
    cluesFound: 3,
    description:
      "A grand library with floor-to-ceiling mahogany shelves filled with leather-bound books. The air smells of old paper and dust.",
    clues: [
      "Torn letter hidden behind Shakespeare collection",
      "Fingerprints on reading desk",
      "Muddy footprints near window",
    ],
    peoplePresent: [
      { name: "Butler", time: "7:30 PM", activity: "Dusting shelves" },
      {
        name: "Victim",
        time: "8:00 PM",
        activity: "Reading financial documents",
      },
    ],
  },
  {
    id: 2,
    name: "Study",
    icon: "🚪",
    status: "crime_scene",
    accessLevel: "investigated",
    cluesFound: 5,
    description:
      "A dark mahogany room with leather furniture. The victim's private office where the murder took place. Blood stains on the carpet.",
    clues: [
      "Bloody letter opener on desk",
      "Torn photograph behind painting",
      "Glass with fingerprints",
      "Open safe with missing items",
      "Overturned chair indicating struggle",
    ],
    peoplePresent: [
      {
        name: "Victim",
        time: "9:00-10:00 PM",
        activity: "Working on documents",
      },
      { name: "Butler", time: "8:00 PM", activity: "Delivering tea" },
      { name: "Maid", time: "9:30 PM", activity: "Heard near door" },
    ],
  },
  {
    id: 3,
    name: "Garden",
    icon: "🌿",
    status: "locked",
    accessLevel: "restricted",
    cluesFound: 0,
    description:
      "Extensive gardens with maze-like hedgerows. Currently locked by police for further investigation.",
    clues: [],
    peoplePresent: [
      {
        name: "Lord Ashford",
        time: "8:30-10:30 PM",
        activity: "Walking alone",
      },
      { name: "Unknown figure", time: "10:00 PM", activity: "Seen by maid" },
    ],
  },
  {
    id: 4,
    name: "Dining Room",
    icon: "🍽️",
    status: "examined",
    accessLevel: "open",
    cluesFound: 1,
    description:
      "Elegant dining room with crystal chandelier. Site of the last dinner before the murder.",
    clues: ["Wine glass with lipstick stain - not victim's shade"],
    peoplePresent: [
      { name: "All guests", time: "7:00-8:30 PM", activity: "Dinner" },
      { name: "Butler", time: "7:00-9:00 PM", activity: "Serving" },
    ],
  },
];

export default function Locations() {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const getStatusInfo = (status) => {
    switch (status) {
      case "crime_scene":
        return {
          color: "text-shadow bg-shadow/20 border-shadow",
          icon: "☠️",
          label: "Crime Scene",
        };
      case "examined":
        return {
          color: "text-moonbeam bg-moonbeam/20 border-moonbeam",
          icon: "🔍",
          label: "Examined",
        };
      case "locked":
        return {
          color: "text-stone bg-stone/20 border-stone",
          icon: "🔒",
          label: "Locked",
        };
      default:
        return {
          color: "text-moonlight bg-moonlight/20 border-moonlight",
          icon: "❓",
          label: "Unknown",
        };
    }
  };

  const handleExplore = (location) => {
    if (location.accessLevel === "restricted") {
      console.log(`Cannot access ${location.name} - restricted by police`);
      return;
    }
    console.log(`Exploring ${location.name}...`);
    // TODO: Open exploration interface or chat focused on location
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat text-white p-4"
      style={{
        backgroundImage:
          "linear-gradient(rgba(90, 100, 112, 0), rgba(90, 100, 112, 0)), url('/images/locations.png')",
      }}
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10 pt-4">
        <div className="grid grid-cols-3 items-center justify-items-center">
          <Link
            href="/"
            className="text-moon-glow hover:text-moonbeam transition-colors justify-self-start"
          >
            ← Back to Investigation
          </Link>
          <h1 className="font-bold text-2xl text-moon-glow">🏰 Locations</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Location Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {mockLocations.map((location) => {
            const statusInfo = getStatusInfo(location.status);

            return (
              <div
                key={location.id}
                onClick={() => setSelectedLocation(location)}
                className={`bg-black/60 border border-white/10 rounded-3xl p-6 cursor-pointer transition-all duration-200 hover:bg-black/70 hover:scale-105 ${
                  selectedLocation?.id === location.id
                    ? "border-moonbeam bg-moonbeam/50 hover:bg-moonbeam/40"
                    : "hover:border-moonbeam/30"
                }`}
              >
                <div className="text-center mb-3">
                  <div className="text-3xl mb-3">{location.icon}</div>
                  <h3 className="font-semibold text-moon-glow mb-1">
                    {location.name}
                  </h3>
                </div>

                <div
                  className={`text-center py-1 px-3 rounded-lg text-xs font-medium border mb-3 ${statusInfo.color}`}
                >
                  {statusInfo.icon} {statusInfo.label}
                </div>

                <div className="text-center text-sm text-white/60">
                  {location.cluesFound > 0 ? (
                    <span>{location.cluesFound} Clues Found</span>
                  ) : (
                    <span>Not Searched</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Location Details */}
        {selectedLocation && (
          <div className="bg-black/60 border border-white/10 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-xl text-moon-glow">
                Selected: {selectedLocation.name}
              </h2>
              <button
                onClick={() => setSelectedLocation(null)}
                className="text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Description & Clues */}
              <div>
                <h3 className="font-semibold text-base text-moon-glow mb-3">
                  🔍 Examination Results
                </h3>
                <p className="text-foreground mb-6 leading-relaxed">
                  {selectedLocation.description}
                </p>

                <h3 className="font-semibold text-base text-moon-glow mb-3">
                  🎯 Clues Found Here
                </h3>
                {selectedLocation.clues.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedLocation.clues.map((clue, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-moonbeam">•</span>
                        <span className="text-white">{clue}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted italic">No clues discovered yet.</p>
                )}
              </div>

              {/* People Present */}
              <div>
                <h3 className="font-semibold text-base text-moon-glow mb-3">
                  👥 People Seen Here
                </h3>
                <div className="space-y-3">
                  {selectedLocation.peoplePresent.map((person, index) => (
                    <div
                      key={index}
                      className="p-3 bg-mystery-light border border-border rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-moonbeam">
                          {person.name}
                        </span>
                        <span className="text-sm text-muted">
                          {person.time}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">
                        {person.activity}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => handleExplore(selectedLocation)}
                    disabled={selectedLocation.accessLevel === "restricted"}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                      selectedLocation.accessLevel === "restricted"
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-moonlight text-white hover:bg-shadow"
                    }`}
                  >
                    {selectedLocation.accessLevel === "restricted"
                      ? "🔒 Access Restricted"
                      : "🔍 Investigate Further"}
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
