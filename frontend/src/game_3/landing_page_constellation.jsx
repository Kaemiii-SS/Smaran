import React from "react";
import { motion } from "framer-motion";

export default function LandingPage({ onPlayGame }) {

    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 },
        },
    };

    return (
        <div className="relative min-h-screen w-full font-sans overflow-x-hidden" style={{ backgroundColor: "#8cb691", color: "#1f3315" }}>

            {/* ================================================= 
                SVG WAVE BACKGROUND 
            ================================================= */}
            <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
                <svg
                    className="absolute top-0 left-0 w-full h-full"
                    preserveAspectRatio="xMidYMin slice"
                    viewBox="0 0 1440 800"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ width: "100%", height: "100%" }}
                >
                    <defs>
                        <filter id="paper-shadow-landing" x="-10%" y="-10%" width="120%" height="120%">
                            <feDropShadow dx="0" dy="12" stdDeviation="15" floodColor="#2a402d" floodOpacity="0.12" />
                        </filter>
                    </defs>
                    <path d="M0,0 V650 C200,600 350,800 550,650 C750,500 800,250 1050,350 C1300,450 1350,700 1440,600 V0 Z" fill="#9bc1a0" filter="url(#paper-shadow-landing)" />
                    <path d="M0,0 V450 C150,500 350,300 550,400 C750,500 850,800 1100,650 C1300,530 1350,350 1440,450 V0 Z" fill="#b0cfb4" filter="url(#paper-shadow-landing)" />
                    <path d="M0,0 V250 C200,350 400,150 600,250 C800,350 950,600 1200,450 C1350,350 1400,200 1440,300 V0 Z" fill="#cbe5cf" filter="url(#paper-shadow-landing)" />
                    <path d="M0,0 V100 C250,170 350,70 650,140 C950,210 1050,400 1250,280 C1400,190 1420,120 1440,170 V0 Z" fill="#e3f2e6" filter="url(#paper-shadow-landing)" />
                </svg>
            </div>

            {/* Content layer */}
            <div className="relative z-10">

                {/* Navbar */}
                <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-black/10 px-6 py-4 flex justify-between items-center" style={{ background: "rgba(230, 238, 219, 0.6)" }}>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#4a673c]/30 shadow-[0_0_15px_rgba(74,103,60,0.15)]" style={{ background: "rgba(255,255,255,0.5)", color: "#1f3315" }}>
                            ✦
                        </div>
                        <span className="font-bold text-lg tracking-tight" style={{ color: "#1f3315" }}>Thread The Stars</span>
                    </div>
                </nav>

                {/* Hero Section */}
                <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto flex flex-col items-center text-center">

                    {/* Decorative background glow */}
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none -z-10" style={{ background: "rgba(255,255,255,0.15)" }} />

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="max-w-3xl"
                    >
                        <motion.div variants={fadeUp} className="inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase backdrop-blur-md border border-[#1f3315]/20" style={{ background: "rgba(255,255,255,0.35)", color: "#1f3315" }}>
                            Memory &amp; Focus Game
                        </motion.div>

                        <motion.h1 variants={fadeUp} className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6 leading-tight" style={{ color: "#1f3315" }}>
                            Memorize the <br className="hidden sm:block" />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#14360e] to-[#4a673c] drop-shadow-sm">
                                Constellations
                            </span>
                        </motion.h1>

                        <motion.p variants={fadeUp} className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: "#4a673c" }}>
                            Watch the stars connect in the night sky. Remember the exact sequence, recreate the pattern, and build your longest chain as the universe expands.
                        </motion.p>

                        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={onPlayGame}
                                className="px-8 py-4 rounded-full font-semibold shadow-lg transition-all hover:-translate-y-0.5 active:scale-95 text-white"
                                style={{ background: "linear-gradient(135deg, #14360e 0%, #4a673c 100%)", boxShadow: "0 10px 30px rgba(20,54,14,0.25)" }}
                            >
                                Start Game
                            </button>
                            <a
                                href="#how-to-play"
                                className="px-8 py-4 rounded-full font-semibold backdrop-blur-md border transition-all hover:bg-white/20 active:scale-95"
                                style={{ borderColor: "rgba(31,51,21,0.2)", color: "#1f3315" }}
                            >
                                How to Play
                            </a>
                        </motion.div>
                    </motion.div>

                    {/* Features Grid */}
                    <motion.div
                        id="how-to-play"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
                    >
                        {[
                            {
                                icon: "👁️",
                                title: "Watch Carefully",
                                desc: "A sequence of stars will light up and connect. Pay close attention to the exact path and order."
                            },
                            {
                                icon: "👆",
                                title: "Trace the Path",
                                desc: "Tap the stars in the exact sequence you just saw to rebuild the constellation."
                            },
                            {
                                icon: "📈",
                                title: "Progressive Difficulty",
                                desc: "With every successful round, the chain grows longer. Make one mistake, and the pattern slips away."
                            }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeUp}
                                className="p-8 rounded-3xl backdrop-blur-xl border flex flex-col items-center text-center transition-transform hover:-translate-y-1"
                                style={{
                                    background: "rgba(255,255,255,0.35)",
                                    borderColor: "rgba(255,255,255,0.5)",
                                    boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
                                }}
                            >
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold mb-2" style={{ color: "#1f3315" }}>{feature.title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: "#4a673c" }}>
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>

                </main>

                {/* Footer */}
                <footer className="py-8 text-center text-sm border-t border-black/10" style={{ color: "#4a673c" }}>
                    <p>Thread The Stars © {new Date().getFullYear()}</p>
                </footer>
            </div>
        </div>
    );
}
