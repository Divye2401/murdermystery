"use client";

import { useState } from "react";

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
    <div className="min-h-screen bg-mystery-dark text-foreground p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="text-gold hover:text-amber transition-colors">
              ← Back to Investigation
            </button>
            <h1 className="font-mystery-bold text-3xl text-gold">
              👥 Characters
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Character Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {mockCharacters.map((character) => (
            <div
              key={character.id}
              onClick={() => setSelectedCharacter(character)}
              className={`bg-mystery-medium border rounded-xl p-6 cursor-pointer transition-all duration-200 hover:bg-mystery-light ${
                selectedCharacter?.id === character.id
                  ? "border-gold bg-gold/10"
                  : "border-border-light hover:border-gold"
              }`}
            >
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{character.avatar}</div>
                <h3 className="font-mystery-bold text-xl text-gold">
                  {character.name}
                </h3>
                <p className="text-muted">{character.role}</p>
                <p className="text-sm text-muted">Age: {character.age}</p>
              </div>

              <div
                className={`text-center py-2 px-4 rounded-lg text-sm font-medium border ${getStatusColor(
                  character.status
                )}`}
              >
                {character.status.charAt(0).toUpperCase() +
                  character.status.slice(1)}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleTalkToCharacter(character);
                }}
                className="w-full mt-4 py-2 px-4 bg-gold text-mystery-dark rounded-lg hover:bg-amber transition-colors font-medium"
              >
                Talk
              </button>
            </div>
          ))}
        </div>

        {/* Selected Character Details */}
        {selectedCharacter && (
          <div className="bg-mystery-medium border border-border-light rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-mystery-bold text-2xl text-gold">
                Selected: {selectedCharacter.name}
              </h2>
              <button
                onClick={() => setSelectedCharacter(null)}
                className="text-muted hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Profile */}
              <div>
                <h3 className="font-mystery-bold text-lg text-gold mb-3">
                  📋 Profile
                </h3>
                <p className="text-foreground mb-4 leading-relaxed">
                  {selectedCharacter.profile}
                </p>

                <h3 className="font-mystery-bold text-lg text-gold mb-3">
                  🎯 Known Facts
                </h3>
                <ul className="space-y-2">
                  {selectedCharacter.facts.map((fact, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-gold">•</span>
                      <span className="text-foreground">{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Questions */}
              <div>
                <h3 className="font-mystery-bold text-lg text-gold mb-3">
                  ❓ Questions to Ask
                </h3>
                <div className="space-y-3">
                  {selectedCharacter.questions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleTalkToCharacter(selectedCharacter)}
                      className="w-full text-left p-3 bg-mystery-light border border-border rounded-lg hover:border-gold hover:bg-mystery-dark transition-all duration-200"
                    >
                      <span className="text-foreground">{question}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => handleTalkToCharacter(selectedCharacter)}
                    className="w-full py-3 px-6 bg-gold text-mystery-dark rounded-lg hover:bg-amber transition-colors font-medium"
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
