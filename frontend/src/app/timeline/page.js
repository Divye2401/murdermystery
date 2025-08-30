"use client";

import { useState } from "react";

const timelineEvents = [
  {
    id: 1,
    time: "7:00 PM",
    event: "Dinner served in dining room",
    icon: "🍽️",
    type: "confirmed",
    participants: ["All guests", "Butler"],
    details:
      "Formal dinner with victim, Lord Ashford, and household staff. All present and accounted for.",
  },
  {
    id: 2,
    time: "7:30 PM",
    event: "All guests present at dinner",
    icon: "👥",
    type: "confirmed",
    participants: ["Victim", "Lord Ashford", "Butler", "Maid"],
    details:
      "Everyone confirmed at dinner table. Light conversation about business and weather.",
  },
  {
    id: 3,
    time: "8:00 PM",
    event: "Butler begins evening cleaning",
    icon: "🧹",
    type: "confirmed",
    participants: ["Butler"],
    details:
      "Butler starts his routine evening cleaning duties. Seen dusting library shelves.",
  },
  {
    id: 4,
    time: "8:30 PM",
    event: "Lord Ashford leaves for garden",
    icon: "🚶",
    type: "confirmed",
    participants: ["Lord Ashford"],
    details:
      "Lord Ashford excuses himself from dinner, saying he needs fresh air. Goes to garden alone.",
  },
  {
    id: 5,
    time: "9:00 PM",
    event: "Victim goes to study to work",
    icon: "📚",
    type: "confirmed",
    participants: ["Victim"],
    details:
      "Victim retires to private study to work on financial documents. Last confirmed sighting alive.",
  },
  {
    id: 6,
    time: "9:30 PM",
    event: "Maid seen near study door",
    icon: "🔍",
    type: "suspicious",
    participants: ["Maid"],
    details:
      "Maid claims she was cleaning upstairs, but butler saw her near study door. Claims she heard voices.",
  },
  {
    id: 7,
    time: "10:00 PM",
    event: "TIME OF MURDER",
    icon: "💀",
    type: "critical",
    participants: ["Unknown"],
    details:
      "Estimated time of death based on body temperature and evidence. Victim killed in study.",
  },
  {
    id: 8,
    time: "10:30 PM",
    event: "Body discovered by maid",
    icon: "😱",
    type: "confirmed",
    participants: ["Maid"],
    details:
      "Maid enters study to deliver evening tea, finds victim dead on floor. Immediately screams for help.",
  },
  {
    id: 9,
    time: "11:00 PM",
    event: "Police called and arrived",
    icon: "🚔",
    type: "confirmed",
    participants: ["Police", "All household"],
    details:
      "Butler calls police. Officers arrive and secure crime scene. Begin initial questioning of all present.",
  },
];

const timelineGaps = [
  {
    id: 1,
    timeRange: "9:30 PM - 10:30 PM",
    question: "Where was butler during this hour?",
    importance: "high",
    details:
      "Butler's alibi unclear. Claims kitchen duty but no witnesses confirm this timeframe.",
  },
  {
    id: 2,
    timeRange: "8:30 PM - 10:30 PM",
    question: "What was Lord Ashford doing in garden?",
    importance: "high",
    details:
      "Lord Ashford admits being in garden but vague about specific activities and locations.",
  },
  {
    id: 3,
    timeRange: "9:30 PM",
    question: "Why was maid near study at this time?",
    importance: "medium",
    details:
      "Maid's explanation inconsistent. Claims cleaning upstairs but seen near study door.",
  },
  {
    id: 4,
    timeRange: "9:00 PM - 10:00 PM",
    question: "Who had access to study during this period?",
    importance: "critical",
    details:
      "Study door unlocked. Multiple suspects had opportunity to enter undetected.",
  },
];

const investigationSuggestions = [
  "Question butler about missing time between 9:30-10:30 PM",
  "Examine garden for evidence of Lord Ashford's presence",
  "Verify maid's cleaning schedule and route",
  "Check study for signs of forced entry",
  "Interview neighbors about sounds from manor",
  "Analyze victim's work documents for threats",
];

export default function Timeline() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTab, setActiveTab] = useState("timeline"); // timeline, gaps, investigate

  const getEventTypeColor = (type) => {
    switch (type) {
      case "critical":
        return "border-red-500 bg-red-500/20";
      case "suspicious":
        return "border-yellow-500 bg-yellow-500/20";
      case "confirmed":
        return "border-blue-500 bg-blue-500/20";
      default:
        return "border-gray-500 bg-gray-500/20";
    }
  };

  const getImportanceColor = (importance) => {
    switch (importance) {
      case "critical":
        return "text-red-400 bg-red-500/20 border-red-500";
      case "high":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500";
      case "medium":
        return "text-blue-400 bg-blue-500/20 border-blue-500";
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
              ⏰ Timeline
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-mystery-medium rounded-lg p-1">
          {["timeline", "gaps", "investigate"].map((tab) => (
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

        {/* Timeline Tab */}
        {activeTab === "timeline" && (
          <>
            <div className="bg-mystery-medium border border-border-light rounded-3xl p-8 mb-8">
              <h2 className="font-mystery-bold text-2xl text-gold mb-6 text-center">
                Evening of the Murder
              </h2>

              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-16 top-0 bottom-0 w-0.5 bg-gold"></div>

                <div className="space-y-6">
                  {timelineEvents.map((event, index) => (
                    <div
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className={`relative flex items-start space-x-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:bg-mystery-light ${getEventTypeColor(
                        event.type
                      )} ${
                        selectedEvent?.id === event.id ? "ring-2 ring-gold" : ""
                      }`}
                    >
                      {/* Timeline Dot */}
                      <div className="flex-shrink-0 w-8 h-8 bg-gold rounded-full flex items-center justify-center text-mystery-dark font-bold text-sm relative z-10">
                        {index + 1}
                      </div>

                      {/* Event Content */}
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-mystery-bold text-lg text-gold">
                            {event.time}
                          </h3>
                          <span className="text-2xl">{event.icon}</span>
                        </div>
                        <p className="text-foreground font-medium mb-1">
                          {event.event}
                        </p>
                        <p className="text-sm text-muted">
                          Participants: {event.participants.join(", ")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Event Details */}
            {selectedEvent && (
              <div className="bg-mystery-medium border border-border-light rounded-3xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-mystery-bold text-2xl text-gold">
                    {selectedEvent.time} - {selectedEvent.event}
                  </h2>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-muted hover:text-foreground transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-foreground leading-relaxed">
                  {selectedEvent.details}
                </p>
              </div>
            )}
          </>
        )}

        {/* Gaps Tab */}
        {activeTab === "gaps" && (
          <div className="space-y-6">
            <h2 className="font-mystery-bold text-2xl text-gold mb-6">
              ❓ Gaps & Questions
            </h2>

            {timelineGaps.map((gap) => (
              <div
                key={gap.id}
                className="bg-mystery-medium border border-border-light rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-mystery-bold text-xl text-gold">
                    {gap.timeRange}
                  </h3>
                  <div
                    className={`py-2 px-3 rounded-lg text-sm font-medium border ${getImportanceColor(
                      gap.importance
                    )}`}
                  >
                    {gap.importance.charAt(0).toUpperCase() +
                      gap.importance.slice(1)}
                  </div>
                </div>

                <h4 className="font-medium text-foreground mb-3 text-lg">
                  {gap.question}
                </h4>
                <p className="text-muted leading-relaxed">{gap.details}</p>
              </div>
            ))}
          </div>
        )}

        {/* Investigate Tab */}
        {activeTab === "investigate" && (
          <div className="bg-mystery-medium border border-border-light rounded-3xl p-8">
            <h2 className="font-mystery-bold text-2xl text-gold mb-6">
              🎯 Investigation Suggestions
            </h2>

            <div className="space-y-4">
              {investigationSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full text-left p-4 bg-mystery-light border border-border rounded-lg hover:border-gold hover:bg-mystery-dark transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-gold text-mystery-dark rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="text-foreground group-hover:text-gold transition-colors">
                      {suggestion}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 p-6 bg-mystery-light border border-border rounded-lg">
              <h3 className="font-mystery-bold text-gold mb-4">
                🔍 Next Steps
              </h3>
              <p className="text-foreground mb-4">
                Focus your investigation on the critical time period between
                9:30 PM and 10:30 PM. This hour contains the murder and several
                suspicious activities.
              </p>
              <div className="flex space-x-4">
                <button className="px-6 py-3 bg-gold text-mystery-dark rounded-lg hover:bg-amber transition-colors font-medium">
                  Interview Suspects
                </button>
                <button className="px-6 py-3 border border-gold text-gold rounded-lg hover:bg-gold hover:text-mystery-dark transition-colors font-medium">
                  Examine Evidence
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
