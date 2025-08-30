"use client";

import { useState } from "react";

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
          color: "text-red-400 bg-red-500/20 border-red-500",
          icon: "☠️",
          label: "Crime Scene",
        };
      case "examined":
        return {
          color: "text-blue-400 bg-blue-500/20 border-blue-500",
          icon: "🔍",
          label: "Examined",
        };
      case "locked":
        return {
          color: "text-gray-400 bg-gray-500/20 border-gray-500",
          icon: "🔒",
          label: "Locked",
        };
      default:
        return {
          color: "text-yellow-400 bg-yellow-500/20 border-yellow-500",
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
    <div className="min-h-screen bg-mystery-dark text-foreground p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="text-gold hover:text-amber transition-colors">
              ← Back to Investigation
            </button>
            <h1 className="font-mystery-bold text-3xl text-gold">
              🏠 Locations
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Location Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mockLocations.map((location) => {
            const statusInfo = getStatusInfo(location.status);

            return (
              <div
                key={location.id}
                onClick={() => setSelectedLocation(location)}
                className={`bg-mystery-medium border rounded-xl p-6 cursor-pointer transition-all duration-200 hover:bg-mystery-light ${
                  selectedLocation?.id === location.id
                    ? "border-gold bg-gold/10"
                    : "border-border-light hover:border-gold"
                }`}
              >
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{location.icon}</div>
                  <h3 className="font-mystery-bold text-xl text-gold">
                    {location.name}
                  </h3>
                </div>

                <div
                  className={`text-center py-2 px-3 rounded-lg text-sm font-medium border mb-3 ${statusInfo.color}`}
                >
                  {statusInfo.icon} {statusInfo.label}
                </div>

                <div className="text-center text-sm text-muted mb-4">
                  {location.cluesFound > 0 ? (
                    <span>{location.cluesFound} Clues Found</span>
                  ) : (
                    <span>Not Searched</span>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExplore(location);
                  }}
                  disabled={location.accessLevel === "restricted"}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    location.accessLevel === "restricted"
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-gold text-mystery-dark hover:bg-amber"
                  }`}
                >
                  {location.accessLevel === "restricted"
                    ? "🔒 Locked"
                    : "Explore"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Selected Location Details */}
        {selectedLocation && (
          <div className="bg-mystery-medium border border-border-light rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-mystery-bold text-2xl text-gold">
                Selected: {selectedLocation.name}
              </h2>
              <button
                onClick={() => setSelectedLocation(null)}
                className="text-muted hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Description & Clues */}
              <div>
                <h3 className="font-mystery-bold text-lg text-gold mb-3">
                  🔍 Examination Results
                </h3>
                <p className="text-foreground mb-6 leading-relaxed">
                  {selectedLocation.description}
                </p>

                <h3 className="font-mystery-bold text-lg text-gold mb-3">
                  🎯 Clues Found Here
                </h3>
                {selectedLocation.clues.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedLocation.clues.map((clue, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-gold">•</span>
                        <span className="text-foreground">{clue}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted italic">No clues discovered yet.</p>
                )}
              </div>

              {/* People Present */}
              <div>
                <h3 className="font-mystery-bold text-lg text-gold mb-3">
                  👥 People Seen Here
                </h3>
                <div className="space-y-3">
                  {selectedLocation.peoplePresent.map((person, index) => (
                    <div
                      key={index}
                      className="p-3 bg-mystery-light border border-border rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-gold">
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
                        : "bg-gold text-mystery-dark hover:bg-amber"
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
