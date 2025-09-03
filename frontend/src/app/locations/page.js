"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useGame } from "@/contexts/GameContext";
import { useQuery } from "@tanstack/react-query";
import { fetchLocations } from "@/lib/helpers";

export default function Locations() {
  const { user, checkingUser } = useAuth();
  const { currentGameId } = useGame();
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const inputRef = useRef(null);

  // Fetch locations data
  const {
    data: locations,
    isLoading: locationsLoading,
    error: locationsError,
  } = useQuery({
    queryKey: ["locations", currentGameId],
    queryFn: () => fetchLocations(currentGameId),
    enabled: !!currentGameId && !!user && !checkingUser,
    staleTime: 60 * 1000 * 3, // 3 minutes
    refetchOnWindowFocus: false,
  });

  // Protect this route - redirect to login if not authenticated
  useEffect(() => {
    if (!checkingUser && !user) {
      router.push("/login");
    }
  }, [user, checkingUser, router]);

  const handleExplore = (location) => {
    console.log(`Exploring ${location.name}...`);
    // TODO: Open exploration interface or chat focused on location
  };

  // Show loading while checking authentication
  if (checkingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-moonlight mx-auto mb-4"></div>
          <p className="text-moonlight">Loading user session...</p>
        </div>
      </div>
    );
  }

  // Don't render if no user (will redirect)
  if (!user) {
    return null;
  }

  // Show loading while fetching locations
  if (locationsLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.6)), url('/images/locations.png')",
        }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-moonlight mx-auto mb-4"></div>
          <p className="text-moonlight">Loading locations...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (locationsError) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.6)), url('/images/locations.png')",
        }}
      >
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">
            Error Loading Locations
          </h2>
          <p className="text-gray-300 mb-4">
            {locationsError?.message || "Failed to load location data"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show no locations state
  if (!locations || locations.length === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.6)), url('/images/locations.png')",
        }}
      >
        <div className="text-center">
          <div className="text-moonlight text-6xl mb-4">🏛️</div>
          <h2 className="text-2xl font-bold text-moonlight mb-2">
            No Locations Found
          </h2>
          <p className="text-gray-300">
            No locations available for this game yet.
          </p>
        </div>
      </div>
    );
  }

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
          <h1 className="font-bold text-2xl text-moon-glow"> Locations</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Location Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {locations.map((location) => {
            return (
              <div
                key={location.id}
                onClick={() => setSelectedLocation(location)}
                className={`bg-black/60 border border-white/10 rounded-3xl p-6 cursor-pointer transition-all duration-200 hover:bg-black/70 hover:scale-105 ${
                  selectedLocation?.id === location.id
                    ? "border-moonbeam bg-moonbeam/20 hover:bg-moonbeam/10"
                    : "hover:border-moonbeam/30"
                }`}
              >
                <div className="text-center mb-3">
                  <div className="text-3xl mb-3">🏛️</div>
                  <h3
                    className={`font-semibold  mb-1 ${
                      selectedLocation?.id === location.id
                        ? "text-moon-glow"
                        : "text-moonlight"
                    }`}
                  >
                    {location.name}
                  </h3>
                </div>

                <div className="mb-3">
                  <div
                    className={`text-center py-1 px-3 rounded-lg text-sm font-medium ${
                      selectedLocation?.id === location.id
                        ? "text-moon-glow"
                        : "text-moonlight"
                    }`}
                  >
                    {location.atmosphere || "neutral"}
                  </div>
                </div>

                <div className="text-center text-sm text-white/60">
                  {location.connected_locations &&
                  location.connected_locations.length > 0 ? (
                    <span>
                      {location.connected_locations.length} Connected Areas
                    </span>
                  ) : (
                    <span>Isolated Location</span>
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
              {/* Left Column - Location Details */}
              <div className="flex flex-col">
                <div className="flex-1">
                  <h3 className="font-semibold text-base text-moon-glow mb-3">
                    📋 Description
                  </h3>
                  <p className="text-moonlight mb-6 leading-relaxed italic">
                    {selectedLocation.description}
                  </p>

                  <h3 className="font-semibold text-base text-moon-glow mb-3">
                    🌟 Atmosphere
                  </h3>
                  <p className="text-moonlight mb-6 italic">
                    {selectedLocation.atmosphere || "neutral"}
                  </p>

                  {/* Connected Locations */}
                  {selectedLocation.connected_locations &&
                    selectedLocation.connected_locations.length > 0 && (
                      <>
                        <h3 className="font-semibold text-base text-moon-glow mb-3">
                          🚪 Connected Locations
                        </h3>
                        <ul className="space-y-1 mb-6">
                          {selectedLocation.connected_locations.map(
                            (connectedLocation, index) => (
                              <li key={index} className="text-moonlight italic">
                                • {connectedLocation}
                              </li>
                            )
                          )}
                        </ul>
                      </>
                    )}
                </div>
              </div>

              {/* Right Column - Investigation */}
              <div className="flex flex-col">
                <h3 className="font-semibold text-base text-moon-glow mb-3">
                  🔍 Investigate Location
                </h3>
                <p className="text-white mb-4 text-sm italic">
                  What would you like to investigate about this location?
                </p>
                <div
                  contentEditable
                  ref={inputRef}
                  className="flex-1 border-2 border-moonlight/70 rounded-lg px-3 py-2 focus:outline-none focus:border-moonlight text-white bg-black/40 min-h-0"
                  suppressContentEditableWarning={true}
                  data-placeholder="Enter your investigation focus (e.g., 'Look for hidden clues', 'Examine the furniture', 'Check for signs of struggle')..."
                />
                <div className="mt-4">
                  <button
                    onClick={() => {
                      handleExplore(selectedLocation);
                      inputRef.current.innerHTML = "";
                    }}
                    className="w-full py-3 px-6 rounded-lg font-medium transition-colors bg-moonlight text-white hover:bg-shadow"
                  >
                    🔍 Start Investigation
                  </button>
                </div>{" "}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
