"use client";

import { useState, useRef, useEffect } from "react";

export default function AudioPlayer({ src, autoPlay = false, volume = 0.3 }) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (autoPlay) {
      const handleUserInteraction = () => {
        if (audioRef.current) {
          audioRef.current.play();
        }
        document.removeEventListener("click", handleUserInteraction);
        document.removeEventListener("keydown", handleUserInteraction);
      };

      document.addEventListener("click", handleUserInteraction);
      document.addEventListener("keydown", handleUserInteraction);
    }
  }, [autoPlay]);

  const togglePlay = () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current.volume = volume;
          audioRef.current.play();
          setIsPlaying(true);
        }
      } catch (error) {
        console.log("Audio play interrupted:", error);
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={togglePlay}
        className="bg-black text-white p-3 rounded-full transition-colors duration-200 text-2xl"
        title={isPlaying ? "Pause Music" : "Play Music"}
      >
        {isPlaying ? "🔇" : "🎵"}
      </button>
      <audio ref={audioRef} src={src} loop />
    </div>
  );
}
