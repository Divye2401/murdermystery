"use client";

import { useState } from "react";
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
      <header className="bg-black/40 border-b border-amber-400/20 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-amber-400">
              🕵️ Murder Mystery Case #001
            </h1>
            <span className="text-amber-200/70 text-sm">
              Ravenscroft Manor Murder
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 transition-colors">
              ⚙️
            </button>
            <button className="p-2 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 transition-colors">
              👤
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* HIGHLIGHT: Modern Investigation Chat */}
        <div className="bg-black/60 border border-amber-400/40 rounded-3xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-amber-400 flex items-center gap-3">
              <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
              Investigation Chat
            </h2>
            <div className="text-sm text-amber-300 bg-amber-400/20 px-3 py-1 rounded-full">
              AI Assistant Active
            </div>
          </div>

          {/* Modern Messages Area - HIGHLIGHTED */}
          <div className="h-96 overflow-y-auto space-y-4 mb-6 p-6 bg-gradient-to-b from-black/20 to-black/40 rounded-2xl border border-amber-400/20">
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
                      ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black"
                      : "bg-black/70 border border-amber-400/30 text-white"
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
                <div className="bg-black/70 border border-amber-400/30 px-5 py-4 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-400"></div>
                    <span className="text-sm text-amber-200">
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
                className="w-full px-6 py-4 rounded-2xl bg-black/40 border border-amber-400/40 text-white placeholder-amber-200/60 focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400/60 transition-all text-lg"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-amber-400/40">
                💬
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-black rounded-2xl hover:from-amber-300 hover:to-amber-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
            >
              Send
            </button>
          </div>
        </div>

        {/* Sleek Quick Actions - Secondary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <button className="bg-black/40 border border-amber-400/20 rounded-2xl p-6 hover:bg-black/50 hover:border-amber-400/40 transition-all group">
            <div className="text-2xl mb-3 group-hover:scale-105 transition-transform">
              👥
            </div>
            <div className="font-semibold text-amber-400 mb-1">Characters</div>
            <div className="text-sm text-amber-200/60">Interview suspects</div>
          </button>

          <button className="bg-black/40 border border-amber-400/20 rounded-2xl p-6 hover:bg-black/50 hover:border-amber-400/40 transition-all group">
            <div className="text-2xl mb-3 group-hover:scale-105 transition-transform">
              🏠
            </div>
            <div className="font-semibold text-amber-400 mb-1">Locations</div>
            <div className="text-sm text-amber-200/60">Explore scenes</div>
          </button>

          <button className="bg-black/40 border border-amber-400/20 rounded-2xl p-6 hover:bg-black/50 hover:border-amber-400/40 transition-all group">
            <div className="text-2xl mb-3 group-hover:scale-105 transition-transform">
              🔍
            </div>
            <div className="font-semibold text-amber-400 mb-1">Evidence</div>
            <div className="text-sm text-amber-200/60">Examine clues</div>
          </button>

          <button className="bg-black/40 border border-amber-400/20 rounded-2xl p-6 hover:bg-black/50 hover:border-amber-400/40 transition-all group">
            <div className="text-2xl mb-3 group-hover:scale-105 transition-transform">
              ⏰
            </div>
            <div className="font-semibold text-amber-400 mb-1">Timeline</div>
            <div className="text-sm text-amber-200/60">Review events</div>
          </button>
        </div>
      </div>

      <AudioPlayer src="/audio/dashboard.wav" volume={0.05} autoPlay />
    </div>
  );
}
