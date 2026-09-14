import React, { useRef, useEffect } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";

export function LandingPage({ 
  onPlayNow,
  musicEnabled,
  onToggleMusic 
}: { 
  onPlayNow: () => void;
  musicEnabled: boolean;
  onToggleMusic: () => void;
}) {
  const bgVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Increase the playback speed of the background video
    if (bgVideoRef.current) {
      bgVideoRef.current.playbackRate = 1.35; // Speed increased slightly
    }
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-background font-sans">
      {/* Background Video (Muted, Accelerated) */}
      <video
        ref={bgVideoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        src="/current_front.mp4"
      />

      {/* Music Toggle Button - Fixed to top-right corner of viewport */}
      <button 
        onClick={onToggleMusic}
        title={musicEnabled ? "Turn music off" : "Turn music on"}
        className={`fixed top-5 right-5 z-[9999] flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all ${
          musicEnabled 
            ? "bg-primary text-white hover:bg-primary/90" 
            : "bg-white/50 text-charcoal hover:bg-white"
        }`}
      >
        {musicEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
      </button>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col items-center gap-8 p-4 mt-auto mb-20 md:mb-32">
        {/* Play Now Button */}
        <button
          onClick={onPlayNow}
          className="flex items-center gap-3 bg-primary hover:bg-primary-green/90 text-white px-12 py-5 rounded-full text-2xl md:text-3xl font-bold shadow-xl transition-all hover:scale-105 active:scale-95 hover:shadow-2xl ring-4 ring-white/20"
        >
          <Play className="w-8 h-8 fill-current" />
          Play Now
        </button>
      </div>
    </div>
  );
}
