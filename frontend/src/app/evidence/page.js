"use client";

import { useState } from "react";
import Link from "next/link";

const mockEvidence = [
  {
    id: 1,
    name: "Bloody Letter Opener",
    type: "weapon",
    location: "Study",
    description:
      "Ornate silver letter opener found on the victim's desk. Blood traces match the victim's blood type.",
    significance: "high",
    dateFound: "March 15, 2024",
    foundBy: "Detective Williams",
    tags: ["weapon", "blood", "study", "desk"],
  },
  {
    id: 2,
    name: "Torn Photograph",
    type: "document",
    location: "Study",
    description:
      "Half of a family photograph found behind a painting. Shows the victim with an unknown woman.",
    significance: "medium",
    dateFound: "March 15, 2024",
    foundBy: "Detective Williams",
    tags: ["photograph", "family", "hidden", "unknown person"],
  },
  {
    id: 3,
    name: "Muddy Footprints",
    type: "trace",
    location: "Library",
    description:
      "Size 10 boot prints leading from the window to the bookshelf. Fresh mud from garden.",
    significance: "high",
    dateFound: "March 16, 2024",
    foundBy: "Forensics Team",
    tags: ["footprints", "entry point", "size 10", "garden mud"],
  },
  {
    id: 4,
    name: "Wine Glass",
    type: "object",
    location: "Study",
    description:
      "Crystal wine glass with lipstick traces and partial fingerprints on the stem.",
    significance: "medium",
    dateFound: "March 15, 2024",
    foundBy: "Detective Williams",
    tags: ["fingerprints", "lipstick", "guest", "drinking"],
  },
];

export default function Evidence() {
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [filterType, setFilterType] = useState("all");

  const getSignificanceInfo = (significance) => {
    switch (significance) {
      case "high":
        return {
          icon: "🔴",
          label: "Critical",
        };
      case "medium":
        return {
          icon: "🟡",
          label: "Important",
        };
      case "low":
        return {
          icon: "🟢",
          label: "Minor",
        };
      default:
        return {
          icon: "⚪",
          label: "Unknown",
        };
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "weapon":
        return "🗡️";
      case "document":
        return "📄";
      case "trace":
        return "👣";
      case "object":
        return "🔍";
      default:
        return "❓";
    }
  };

  const filteredEvidence =
    filterType === "all"
      ? mockEvidence
      : mockEvidence.filter((item) => item.type === filterType);

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
            className="text-paper-light hover:text-gold-bright transition-colors justify-self-start"
          >
            ← Back to Investigation
          </Link>
          <h1 className="font-bold text-2xl text-paper-light">🔍 Evidence</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Filter Tabs */}
        <div className="flex space-x-4 mb-8">
          {["all", "weapon", "document", "trace", "object"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === type
                  ? "bg-brass text-white"
                  : "bg-black/60 border border-white/10 text-white/80 hover:bg-black/70"
              }`}
            >
              {type === "all"
                ? "All Evidence"
                : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Evidence Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {filteredEvidence.map((evidence) => {
            const significanceInfo = getSignificanceInfo(evidence.significance);

            return (
              <div
                key={evidence.id}
                onClick={() => setSelectedEvidence(evidence)}
                className={`bg-black/60 border border-white/10 rounded-3xl p-6 cursor-pointer transition-all duration-200 hover:bg-black/70 hover:scale-105 ${
                  selectedEvidence?.id === evidence.id
                    ? "!border-white border bg-gold-bright/20 hover:bg-gold-bright/10"
                    : "hover:border-gold-bright/30"
                }`}
              >
                <div className="text-center mb-3">
                  <div className="text-3xl mb-3">
                    {getTypeIcon(evidence.type)}
                  </div>
                  <h3
                    className={`font-semibold text-paper-light mb-1 ${
                      selectedEvidence?.id === evidence.id
                        ? "text-white"
                        : "text-paper-light"
                    }`}
                  >
                    {evidence.name}
                  </h3>
                </div>

                <div
                  className={`text-center py-1 px-3 rounded-lg text-xs font-medium  mb-3 
                    
                  ${
                    selectedEvidence?.id === evidence.id
                      ? " bg-black/60"
                      : "text-paper-light"
                  }`}
                >
                  {significanceInfo.icon} {significanceInfo.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Evidence Details */}
        {selectedEvidence && (
          <div className="bg-black/60 border border-white/10 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-xl text-paper-light">
                Evidence: {selectedEvidence.name}
              </h2>
              <button
                onClick={() => setSelectedEvidence(null)}
                className="text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Details */}
              <div>
                <h3 className="font-semibold text-base text-paper-light mb-3">
                  📋 Description
                </h3>
                <p className="text-white mb-4 leading-relaxed">
                  {selectedEvidence.description}
                </p>

                <h3 className="font-semibold text-base text-paper-light mb-3">
                  📍 Discovery Details
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="text-gold-bright">•</span>
                    <span className="text-white">
                      Location: {selectedEvidence.location}
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-gold-bright">•</span>
                    <span className="text-white">
                      Date Found: {selectedEvidence.dateFound}
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-gold-bright">•</span>
                    <span className="text-white">
                      Found By: {selectedEvidence.foundBy}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Tags & Analysis */}
              <div>
                <h3 className="font-semibold text-base text-paper-light mb-3">
                  🏷️ Evidence Tags
                </h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedEvidence.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-brass/20 border border-brass/40 rounded-lg text-sm text-paper-light"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-6">
                  <button className="w-full py-3 px-6 bg-brass text-white rounded-lg hover:bg-gold-bright transition-colors font-medium">
                    🔬 Analyze Further
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
