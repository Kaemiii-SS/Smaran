import { useRef, useEffect } from "react";
import { Lock, Star, ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { cn } from "../lib/utils";
function LevelsPage({
  levels,
  unlockedLevel,
  levelStars,
  onSelectLevel,
  onBack,
  musicEnabled,
  onToggleMusic
}) {
  const bgVideoRef = useRef(null);
  useEffect(() => {
    if (bgVideoRef.current) {
      bgVideoRef.current.playbackRate = 1.35;
    }
  }, []);
  return <div className="relative min-h-screen w-full flex flex-col overflow-hidden bg-background font-sans">
      {
    /* Background Video */
  }
      <video
    ref={bgVideoRef}
    autoPlay
    loop
    muted
    playsInline
    className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none blur-sm opacity-50"
    src="/game5/live_bg_image.mp4"
  />

      {
    /* Top Bar */
  }
      <div className="relative z-10 p-4 flex justify-between items-center">
        <button
    onClick={onBack}
    className="flex items-center justify-center w-12 h-12 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all text-charcoal hover:text-deep-forest hover:scale-105 active:scale-95"
    aria-label="Back to home"
  >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <h1
    className="text-3xl md:text-5xl font-normal leading-none tracking-wider flex items-center gap-2 drop-shadow-xl"
    style={{ fontFamily: "'Chewy', system-ui, sans-serif" }}
  >
          <span className="text-white" style={{
    WebkitTextStroke: "1px #166534",
    textShadow: "0px 3px 0px #14532d, 0px 4px 4px rgba(0,0,0,0.3)"
  }}>
            SELECT
          </span>
          <span className="text-amber-400" style={{
    WebkitTextStroke: "1px #9a3412",
    textShadow: "0px 3px 0px #7c2d12, 0px 4px 4px rgba(0,0,0,0.3)"
  }}>
            LEVEL
          </span>
        </h1>

        <button
    onClick={onToggleMusic}
    title={musicEnabled ? "Turn music off" : "Turn music on"}
    className={cn(
      "flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95",
      musicEnabled ? "bg-primary text-white hover:bg-primary/90" : "bg-white/80 text-charcoal hover:bg-white"
    )}
  >
          {musicEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
        </button>
      </div>

      {
    /* Levels Grid */
  }
      <div className="relative z-10 flex-1 w-full max-w-4xl mx-auto p-4 flex flex-col items-center justify-center pb-10">
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 md:gap-6 w-full place-items-center">
          {levels.map((lvl) => {
    const isUnlocked = lvl <= unlockedLevel;
    const stars = levelStars[lvl] || 0;
    return <button
      key={lvl}
      disabled={!isUnlocked}
      onClick={() => onSelectLevel(lvl)}
      className={cn(
        "relative w-full aspect-square max-w-[90px] md:max-w-[110px] rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border-[3px]",
        isUnlocked ? "bg-gradient-to-b from-orange-400 to-orange-500 border-orange-300 shadow-[0_6px_0_#c2410c,0_10px_10px_rgba(0,0,0,0.3)] hover:translate-y-[2px] hover:shadow-[0_4px_0_#c2410c,0_8px_8px_rgba(0,0,0,0.3)] active:translate-y-[6px] active:shadow-none" : "bg-gradient-to-b from-orange-500/80 to-orange-600/80 border-orange-400/50 shadow-[0_6px_0_#9a3412,0_10px_10px_rgba(0,0,0,0.2)] opacity-80 cursor-not-allowed grayscale-[0.2]"
      )}
    >
                {
      /* Shine effect for unlocked */
    }
                {isUnlocked && <div className="absolute top-1 left-2 right-2 h-1/3 bg-white/20 rounded-full blur-[1px]" />}
                
                {
      /* Content */
    }
                <div className="flex-1 flex items-center justify-center pt-1 md:pt-2 w-full">
                  {isUnlocked ? <span
      className="text-4xl md:text-5xl font-bold text-white drop-shadow-md"
      style={{
        fontFamily: "'Fredoka', 'Chewy', sans-serif",
        WebkitTextStroke: "1px #9a3412",
        textShadow: "0px 3px 0px #7c2d12"
      }}
    >
                      {lvl}
                    </span> : <Lock className="w-8 h-8 md:w-10 md:h-10 text-slate-300 drop-shadow-[0_2px_0_rgba(0,0,0,0.5)] fill-slate-200" strokeWidth={1.5} />}
                </div>

                {
      /* Stars container */
    }
                <div className="w-full flex justify-center gap-0.5 pb-2 px-2 z-10">
                  {[1, 2, 3].map((starIdx) => <Star
      key={starIdx}
      className={cn(
        "w-4 h-4 md:w-5 md:h-5 transition-all duration-300",
        isUnlocked && starIdx <= stars ? "fill-yellow-300 text-yellow-600 drop-shadow-[0_1px_0_#b45309]" : "fill-red-900/40 text-red-950/30"
      )}
      strokeWidth={isUnlocked && starIdx <= stars ? 1.5 : 2}
    />)}
                </div>
              </button>;
  })}
        </div>
      </div>
    </div>;
}
export {
  LevelsPage
};
