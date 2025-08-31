"use client";

import { useState } from "react";
import Link from "next/link";
import AudioPlayer from "@/components/AudioPlayer";

export default function Dashboard() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "detective",
      content:
        "Welcome to the investigation room, Detective. The Ravenscroft Manor case files are ready. What would you like to investigate first?",
      timestamp: "10:00 PM",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // TODO: Call AI backend here
    // For now, simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: "ai",
        content:
          "Let me analyze that evidence for you... [This will connect to your CrewAI backend]",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 4500);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className="min-h-screen text-white relative"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url('/images/dashboard1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Clean Header */}
      <header className="bg-black/40 border-b border-cream/20 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-cream">
              🕵️ Murder Mystery Case #001
            </h1>
            <span className="text-cream/70 text-sm">
              Ravenscroft Manor Murder
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-lg bg-cream/20 hover:bg-cream/30 transition-colors">
              ⚙️
            </button>
            <button className="p-2 rounded-lg bg-cream/20 hover:bg-cream/30 transition-colors">
              👤
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* HIGHLIGHT: Modern Investigation Chat */}
        <div className="bg-black/60 border border-cream/40 rounded-3xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-cream flex items-center gap-3">
              <div className="w-3 h-3 bg-cream rounded-full animate-pulse"></div>
              Investigation Chat
            </h2>
            <div className="text-sm text-cream bg-cream/20 px-3 py-1 rounded-full">
              AI Assistant Active
            </div>
          </div>

          {/* Modern Messages Area - HIGHLIGHTED */}
          <div className="h-96 overflow-y-auto space-y-4 mb-6 p-6 bg-gradient-to-b from-black/20 to-black/40 rounded-2xl border border-cream/20">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-lg px-5 py-4 rounded-2xl ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-cream to-cream text-black"
                      : "bg-black/70 border border-cream/30 text-white"
                  }`}
                >
                  <div className="text-sm leading-relaxed">
                    {message.type === "detective" && "🕵️ Detective: "}
                    {message.type === "ai" && "🤖 AI: "}
                    {message.content}
                  </div>
                  <div className="text-xs opacity-60 mt-2 flex items-center gap-1">
                    <span>•</span>
                    <span>{message.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-black/70 border border-cream/30 px-5 py-4 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cream"></div>
                    <span className="text-sm text-cream">
                      AI is analyzing your question...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modern Input Area - SLEEK */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about the case..."
                className="w-full px-6 py-4 rounded-2xl bg-black/40 border border-cream/40 text-white placeholder-cream/60 focus:outline-none focus:ring-2 focus:ring-cream/60 focus:border-cream/60 transition-all text-lg"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cream/40">
                💬
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="px-8 py-4 bg-gradient-to-r from-cream to-cream text-black rounded-2xl hover:from-cream hover:to-cream transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
            >
              Send
            </button>
          </div>
        </div>

        {/* Sleek Quick Actions - Secondary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Link
            href="/characters"
            className="bg-black/40 border border-cream/20 rounded-2xl p-6 hover:bg-black/50 hover:border-cream/40 transition-all group block"
          >
            <div className="text-3xl mb-3 group-hover:scale-105 transition-transform">
              🎭
            </div>
            <div className="font-semibold group-hover:scale-105 transition-transform text-cream mb-1">
              Characters
            </div>
            <div className="text-sm group-hover:scale-105 transition-transform text-cream/60">
              Interview suspects
            </div>
          </Link>

          <Link
            href="/locations"
            className="bg-black/40 border border-cream/20 rounded-2xl p-6 hover:bg-black/50 hover:border-cream/40 transition-all group block"
          >
            <div className="text-3xl mb-3 group-hover:scale-105 transition-transform">
              🏛️
            </div>
            <div className="font-semibold group-hover:scale-105 transition-transform text-cream mb-1">
              Locations
            </div>
            <div className="text-sm group-hover:scale-105 transition-transform text-cream/60">
              Explore scenes
            </div>
          </Link>

          <Link
            href="/clues"
            className="bg-black/40 border border-cream/20 rounded-2xl p-6 hover:bg-black/50 hover:border-cream/40 transition-all group block"
          >
            <div className="text-3xl mb-3 group-hover:scale-105 transition-transform">
              🔎
            </div>
            <div className="font-semibold group-hover:scale-105 transition-transform text-cream mb-1">
              Evidence
            </div>
            <div className="text-sm group-hover:scale-105 transition-transform text-cream/60">
              Examine clues
            </div>
          </Link>

          <Link
            href="/timeline"
            className="bg-black/40 border border-cream/20 rounded-2xl p-6 hover:bg-black/50 hover:border-cream/40 transition-all group block"
          >
            <div className="text-3xl mb-3 group-hover:scale-105 transition-transform">
              📅
            </div>
            <div className="font-semibold group-hover:scale-105 transition-transform text-cream mb-1">
              Timeline
            </div>
            <div className="text-sm group-hover:scale-105 transition-transform text-cream/60">
              Review events
            </div>
          </Link>
        </div>
      </div>

      <AudioPlayer src="/audio/dashboard.wav" volume={0.05} autoPlay />
    </div>
  );
}
