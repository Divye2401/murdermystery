"use client";

import { useState } from "react";

const mockEvidence = [
  {
    id: 1,
    name: "Letter Opener",
    icon: "🔪",
    type: "weapon",
    location: "Study desk",
    importance: "key",
    description:
      "Ornate silver letter opener with victim's blood. Fingerprints match the butler's.",
    connections: ["Butler fingerprints", "Study location", "Time of death"],
  },
  {
    id: 2,
    name: "Threatening Letter",
    icon: "📝",
    type: "document",
    location: "Study safe",
    importance: "key",
    description:
      "Handwritten letter threatening the victim over unpaid debts. Handwriting analysis pending.",
    connections: ["Financial motive", "Unknown sender", "Recent timeline"],
  },
  {
    id: 3,
    name: "Victim's Glasses",
    icon: "👓",
    type: "personal",
    location: "Study floor",
    importance: "important",
    description:
      "Broken glasses found near the body. Suggests struggle occurred.",
    connections: ["Physical struggle", "Time of death", "Defensive wounds"],
  },
  {
    id: 4,
    name: "Wine Glass",
    icon: "🍷",
    type: "personal",
    location: "Dining room",
    importance: "minor",
    description:
      "Wine glass with lipstick stain that doesn't match victim's shade. Unknown guest?",
    connections: ["Unknown woman", "Dinner party", "Missing guest"],
  },
  {
    id: 5,
    name: "Torn Photograph",
    icon: "📸",
    type: "document",
    location: "Library",
    importance: "important",
    description:
      "Partially burned photograph showing victim with unknown woman. Recently taken.",
    connections: ["Unknown woman", "Secret relationship", "Motive unclear"],
  },
  {
    id: 6,
    name: "Muddy Footprints",
    icon: "👟",
    type: "physical",
    location: "Study window",
    importance: "important",
    description:
      "Fresh muddy footprints leading from garden to study window. Size 10 men's shoe.",
    connections: ["Garden access", "Window entry", "Male suspect"],
  },
];

const mockTheories = [
  {
    id: 1,
    title: "Butler's Revenge",
    confidence: "high",
    evidence: [
      "Letter Opener fingerprints",
      "Access to all rooms",
      "Found the body",
    ],
    reasoning:
      "Butler had means, opportunity, and discovered victim was planning to fire him.",
  },
  {
    id: 2,
    title: "Financial Murder",
    confidence: "medium",
    evidence: [
      "Threatening letter",
      "Lord Ashford's debts",
      "Missing safe items",
    ],
    reasoning:
      "Victim was killed over money. Lord Ashford owed large sum and was desperate.",
  },
  {
    id: 3,
    title: "Unknown Woman",
    confidence: "low",
    evidence: ["Wine glass lipstick", "Torn photograph", "Secret relationship"],
    reasoning:
      "Mystery woman connected to victim. Jealousy or blackmail motive possible.",
  },
];

export default function Clues() {
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [activeTab, setActiveTab] = useState("evidence"); // evidence, theories, connections

  const getImportanceColor = (importance) => {
    switch (importance) {
      case "key":
        return "text-red-400 bg-red-500/20 border-red-500";
      case "important":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500";
      case "minor":
        return "text-gray-400 bg-gray-500/20 border-gray-500";
      default:
        return "text-blue-400 bg-blue-500/20 border-blue-500";
    }
  };

  const getConfidenceColor = (confidence) => {
    switch (confidence) {
      case "high":
        return "text-green-400 bg-green-500/20 border-green-500";
      case "medium":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500";
      case "low":
        return "text-red-400 bg-red-500/20 border-red-500";
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-500";
    }
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
              🔍 Evidence Board
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-mystery-medium rounded-lg p-1">
          {["evidence", "theories", "connections"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
                activeTab === tab
                  ? "bg-gold text-mystery-dark"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Evidence Tab */}
        {activeTab === "evidence" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {mockEvidence.map((evidence) => (
                <div
                  key={evidence.id}
                  onClick={() => setSelectedEvidence(evidence)}
                  className={`bg-mystery-medium border rounded-xl p-6 cursor-pointer transition-all duration-200 hover:bg-mystery-light ${
                    selectedEvidence?.id === evidence.id
                      ? "border-gold bg-gold/10"
                      : "border-border-light hover:border-gold"
                  }`}
                >
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{evidence.icon}</div>
                    <h3 className="font-mystery-bold text-lg text-gold">
                      {evidence.name}
                    </h3>
                    <p className="text-sm text-muted">
                      Found: {evidence.location}
                    </p>
                  </div>

                  <div
                    className={`text-center py-2 px-3 rounded-lg text-sm font-medium border ${getImportanceColor(
                      evidence.importance
                    )}`}
                  >
                    {evidence.importance === "key" && "⭐"}{" "}
                    {evidence.importance.charAt(0).toUpperCase() +
                      evidence.importance.slice(1)}{" "}
                    Clue
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Evidence Details */}
            {selectedEvidence && (
              <div className="bg-mystery-medium border border-border-light rounded-3xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-mystery-bold text-2xl text-gold">
                    {selectedEvidence.icon} {selectedEvidence.name}
                  </h2>
                  <button
                    onClick={() => setSelectedEvidence(null)}
                    className="text-muted hover:text-foreground transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-mystery-bold text-lg text-gold mb-3">
                      📋 Description
                    </h3>
                    <p className="text-foreground mb-6 leading-relaxed">
                      {selectedEvidence.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-mystery-bold text-lg text-gold mb-3">
                      🔗 Connections
                    </h3>
                    <ul className="space-y-2">
                      {selectedEvidence.connections.map((connection, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-gold">•</span>
                          <span className="text-foreground">{connection}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Theories Tab */}
        {activeTab === "theories" && (
          <div className="space-y-6">
            {mockTheories.map((theory) => (
              <div
                key={theory.id}
                className="bg-mystery-medium border border-border-light rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-mystery-bold text-xl text-gold">
                    {theory.title}
                  </h3>
                  <div
                    className={`py-2 px-3 rounded-lg text-sm font-medium border ${getConfidenceColor(
                      theory.confidence
                    )}`}
                  >
                    {theory.confidence.charAt(0).toUpperCase() +
                      theory.confidence.slice(1)}{" "}
                    Confidence
                  </div>
                </div>

                <p className="text-foreground mb-4 leading-relaxed">
                  {theory.reasoning}
                </p>

                <div>
                  <h4 className="font-mystery-bold text-gold mb-2">
                    Supporting Evidence:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {theory.evidence.map((evidence, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-mystery-light border border-border rounded-lg text-sm text-foreground"
                      >
                        {evidence}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Connections Tab */}
        {activeTab === "connections" && (
          <div className="bg-mystery-medium border border-border-light rounded-3xl p-8">
            <h2 className="font-mystery-bold text-2xl text-gold mb-6">
              🔗 Evidence Connections
            </h2>

            <div className="space-y-6">
              <div className="p-4 bg-mystery-light border border-border rounded-lg">
                <h3 className="font-mystery-bold text-gold mb-2">
                  Letter Opener → Study → Butler
                </h3>
                <p className="text-foreground">
                  Murder weapon found in study with butler&apos;s fingerprints.
                  Direct physical evidence.
                </p>
              </div>

              <div className="p-4 bg-mystery-light border border-border rounded-lg">
                <h3 className="font-mystery-bold text-gold mb-2">
                  Threatening Letter → Victim → Financial Motive
                </h3>
                <p className="text-foreground">
                  Letter found in victim&apos;s safe suggests money was motive
                  for murder.
                </p>
              </div>

              <div className="p-4 bg-mystery-light border border-border rounded-lg">
                <h3 className="font-mystery-bold text-gold mb-2">
                  Broken Glasses → Struggle → Time of Death
                </h3>
                <p className="text-foreground">
                  Victim&apos;s broken glasses indicate violent struggle
                  occurred around time of death.
                </p>
              </div>

              <div className="mt-8">
                <h3 className="font-mystery-bold text-lg text-gold mb-4">
                  ❓ Missing Pieces
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="text-gold">•</span>
                    <span className="text-foreground">
                      What was stolen from the safe?
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-gold">•</span>
                    <span className="text-foreground">
                      Who wrote the threatening letter?
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-gold">•</span>
                    <span className="text-foreground">
                      Identity of woman in photograph?
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-gold">•</span>
                    <span className="text-foreground">
                      Who left muddy footprints?
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
