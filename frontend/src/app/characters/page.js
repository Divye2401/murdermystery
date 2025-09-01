"use client";

import { useState } from "react";
import Link from "next/link";

const mockCharacters = [
  {
    id: 1,
    name: "James Wilson",
    role: "Butler",
    age: 45,
    status: "suspect",
    avatar: "👤",
    profile:
      "Worked at the manor for 15 years. Known for his discretion and attention to detail.",
    facts: [
      "Has access to all rooms",
      "Was seen near study at 9 PM",
      "Claims to have been in kitchen",
      "Found the body at 10:30 PM",
    ],
    questions: [
      "Where exactly were you at 10 PM?",
      "Did you see anyone else that night?",
      "Why were you near the study?",
    ],
  },
  {
    id: 2,
    name: "Mary Smith",
    role: "Maid",
    age: 32,
    status: "witness",
    avatar: "👤",
    profile: "New to the manor, started 3 months ago. Nervous and observant.",
    facts: [
      "Limited access to private rooms",
      "Heard argument from study",
      "Was cleaning upstairs at time of murder",
      "Saw mysterious figure in garden",
    ],
    questions: [
      "What did you hear during the argument?",
      "Can you describe the figure you saw?",
      "What time did you go upstairs?",
    ],
  },
  {
    id: 3,
    name: "Lord Ashford",
    role: "Guest",
    age: 60,
    status: "suspect",
    avatar: "👤",
    profile:
      "Business associate of the victim. Known for his temper and financial troubles.",
    facts: [
      "Had heated argument with victim",
      "In debt to victim for large sum",
      "Left dinner early",
      "Was in garden during murder",
    ],
    questions: [
      "What was the argument about?",
      "Where exactly were you in the garden?",
      "Did anyone see you there?",
    ],
  },
];

export default function Characters() {
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "suspect":
        return "text-red-400 bg-red-500/20 border-red-500";
      case "witness":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500";
      case "cleared":
        return "text-green-400 bg-green-500/20 border-green-500";
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-500";
    }
  };

  const handleTalkToCharacter = (character) => {
    // TODO: Open chat focused on this character
    console.log(`Opening chat with ${character.name}`);
  };

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
          {mockCharacters.map((character) => (
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
                <div className="text-4xl mb-2">{character.avatar}</div>
                <h3
                  className={`font-mystery-bold text-lg  ${
                    selectedCharacter?.id === character.id
                      ? "text-burgundy-dark"
                      : "text-rose-gold"
                  }`}
                >
                  {character.name}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Character Details */}
        {selectedCharacter && (
          <div className="bg-black/60 border border-white/20 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-mystery-bold text-2xl text-rose-gold">
                Selected: {selectedCharacter.name}
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
                <p className="text-white mb-4 leading-relaxed">
                  {selectedCharacter.profile}
                </p>

                <h3 className="font-mystery-bold text-lg text-rose-gold mb-3">
                  🎯 Known Facts
                </h3>
                <ul className="space-y-2">
                  {selectedCharacter.facts.map((fact, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-rose-gold">•</span>
                      <span className="text-white">{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Questions */}
              <div>
                <h3 className="font-mystery-bold text-lg text-rose-gold mb-3">
                  ❓ Questions to Ask
                </h3>
                <div className="space-y-3">
                  {selectedCharacter.questions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleTalkToCharacter(selectedCharacter)}
                      className="w-full text-left p-3 bg-black/30 border border-white/20 rounded-lg hover:border-rose-gold hover:bg-black/50 transition-all duration-200"
                    >
                      <span className="text-white">{question}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => handleTalkToCharacter(selectedCharacter)}
                    className="w-full py-3 px-6 bg-rose-gold text-burgundy-dark rounded-lg hover:bg-wine hover:text-white transition-colors font-medium"
                  >
                    💬 Start Conversation
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
