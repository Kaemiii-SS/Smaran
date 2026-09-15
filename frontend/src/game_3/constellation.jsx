import {
    useState,
    useRef,
    useCallback,
    useMemo,
    useEffect,
} from "react";
import axios from "axios";

import {
    VIEW_W,
    VIEW_H,
    POINTS,
    pickSequence,
    sleep,
    Thread,
    Starfield
} from "./gameUtils.jsx";

// ============================================================
// NEW SAGE GREEN THEME
// Overrides the dark mode COLORS from gameUtils.jsx
// ============================================================
const THEME = {
    bgLightest: "#e6eedb",
    bgLight: "#d2dfc2",
    bgMid: "#b3c89f",
    bgDark: "#92a880",

    textMain: "#1f3315",     // Very dark green for primary text
    textMuted: "#4a673c",    // Muted green for secondary text

    nodeDim: "#5a7248",      // Visible dark olive for unvisited nodes
    nodeActive: "#14360e",   // Almost black-green for current target node

    gold: "#d97706",         // Amber/Gold for success
    err: "#dc2626",          // Crimson for error
};

// ============================================================
// STAGGER WIPE TRANSITION (inlined from StaggerWipeTransition)
// ============================================================

const WIPE_CONFIG = {
    columns: 10,
    coverMs: 380,
    coverStagger: 35,
    hold: 100,
    revealMs: 380,
    revealStagger: 35,
};

function useStaggerTransition({ columns, coverMs, coverStagger, hold, revealMs, revealStagger }) {
    const [phase, setPhase] = useState("idle");
    const timers = useRef([]);

    useEffect(() => {
        return () => timers.current.forEach(clearTimeout);
    }, []);

    const run = useCallback(
        (onCovered) => {
            if (phase !== "idle") return false;
            const coverTotal = (columns - 1) * coverStagger + coverMs;
            const revealTotal = (columns - 1) * revealStagger + revealMs;
            setPhase("covering");
            timers.current.push(
                setTimeout(() => {
                    onCovered();
                    setPhase("revealing");
                }, coverTotal + hold)
            );
            timers.current.push(
                setTimeout(() => setPhase("idle"), coverTotal + hold + revealTotal)
            );
            return true;
        },
        [phase, columns, coverMs, coverStagger, hold, revealMs, revealStagger]
    );

    return { phase, run };
}

function StaggerCurtain({ phase, color, columns, coverMs, coverStagger, revealMs, revealStagger }) {
    let transform = "scaleY(0)";
    let transformOrigin = "top";
    let duration = coverMs;
    let stagger = coverStagger;

    if (phase === "covering") {
        transform = "scaleY(1)";
        transformOrigin = "top";
        duration = coverMs;
        stagger = coverStagger;
    } else if (phase === "revealing") {
        transform = "scaleY(0)";
        transformOrigin = "bottom";
        duration = revealMs;
        stagger = revealStagger;
    }

    return (
        <div className="game-curtain" aria-hidden="true">
            {Array.from({ length: columns }).map((_, i) => (
                <div
                    key={i}
                    className="game-curtain-col"
                    style={{
                        background: color,
                        transform,
                        transformOrigin,
                        transitionDuration: `${duration}ms`,
                        transitionDelay: `${i * stagger}ms`,
                    }}
                />
            ))}
        </div>
    );
}

// ============================================================
// MAIN GAME
// ============================================================

export default function ThreadTheStars() {
    // ========================================================
    // STATE
    // ========================================================

    const [level, setLevel] = useState(1);
    const [best, setBest] = useState(0);
    const [sequence, setSequence] = useState([]);
    const [playerIndex, setPlayerIndex] = useState(0);
    const [phase, setPhase] = useState("intro");
    /*
        intro
        showing
        input
        success
        fail
    */
    const [nodeStates, setNodeStates] = useState({});
    const [demoSegments, setDemoSegments] = useState([]);
    const [traceSegments, setTraceSegments] = useState([]);
    const [message, setMessage] = useState("");
    const [messageTone, setMessageTone] = useState("");

    // Used to cancel old animations
    const runIdRef = useRef(0);

    // ========================================================
    // STAGGER WIPE TRANSITION
    // ========================================================
    const { phase: wipePhase, run: runWipe } = useStaggerTransition(WIPE_CONFIG);

    // ========================================================
    // REDUCED MOTION
    // ========================================================

    const reduceMotion = useMemo(
        () =>
            typeof window !== "undefined" &&
            window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        []
    );

    // ========================================================
    // CLEAR NODE STATES
    // ========================================================

    const clearNodeStates = useCallback(() => {
        setNodeStates({});
    }, []);

    // ========================================================
    // MARK NODE
    // ========================================================

    const markNode = useCallback((idx, state) => {
        setNodeStates((prev) => ({
            ...prev,
            [idx]: state,
        }));
    }, []);

    // ========================================================
    // PLAY DEMO
    // ========================================================

    const playDemo = useCallback(
        async (seq) => {
            const myRun = ++runIdRef.current;
            setPhase("showing");
            clearNodeStates();
            setDemoSegments([]);
            setTraceSegments([]);
            setMessage("Watch closely…");
            setMessageTone("");

            // --------------------------------------------
            // SHOW SEQUENCE
            // --------------------------------------------
            for (let i = 0; i < seq.length; i++) {
                if (runIdRef.current !== myRun) return;

                const idx = seq[i];

                // Highlight current node
                markNode(idx, "armed");

                await sleep(180, reduceMotion);

                if (runIdRef.current !== myRun) return;

                // Draw connection
                if (i > 0) {
                    const prev = seq[i - 1];

                    setDemoSegments((segments) => [
                        ...segments,
                        {
                            from: prev,
                            to: idx,
                            key: `${prev}-${idx}-${i}`,
                        },
                    ]);

                    await sleep(520, reduceMotion);
                    if (runIdRef.current !== myRun) return;
                }
            }

            // Keep complete path visible
            await sleep(1000, reduceMotion);
            if (runIdRef.current !== myRun) return;

            // --------------------------------------------
            // FADE EVERYTHING
            // --------------------------------------------
            setDemoSegments([]);
            clearNodeStates();
            setPlayerIndex(0);
            setPhase("input");
            setMessage("Retrace the path, in order.");
            setMessageTone("");
        },
        [clearNodeStates, markNode, reduceMotion]
    );

    // ========================================================
    // FIRST ROUND
    // ========================================================

    const beginFirstRound = useCallback(() => {
        const seq = pickSequence(3);
        setSequence(seq);
        playDemo(seq);
    }, [playDemo]);

    useEffect(() => {
        // Play the stagger wipe intro only on first mount
        runWipe(() => {
            beginFirstRound();
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ========================================================
    // FAIL
    // ========================================================

    const onFail = useCallback(
        async (wrongIdx) => {
            const myRun = ++runIdRef.current;

            setPhase("fail");
            markNode(wrongIdx, "err");
            setMessage("Not quite — try again.");
            setMessageTone("err");

            setTraceSegments((segments) =>
                segments.map((segment) => ({
                    ...segment,
                    tone: "bad",
                }))
            );

            await sleep(700, reduceMotion);
            if (runIdRef.current !== myRun) return;

            setTraceSegments([]);
            clearNodeStates();
        },
        [clearNodeStates, markNode, reduceMotion]
    );

    // ========================================================
    // SUCCESS
    // ========================================================

    const onSuccess = useCallback(() => {
        setPhase("success");
        setMessage("Constellation complete.");
        setMessageTone("gold");

        setNodeStates((prev) => {
            const next = { ...prev };
            sequence.forEach((idx) => {
                next[idx] = "hit";
            });
            return next;
        });

        // Update longest chain
        setBest((currentBest) => Math.max(currentBest, sequence.length));

        // Increase level
        setLevel((currentLevel) => {
            const nextLvl = currentLevel + 1;
            
            // Send analytics to backend
            try {
                const token = localStorage.getItem('token');
                const user = JSON.parse(localStorage.getItem('user'));
                if (token && user) {
                    const patientId = user.id || user._id;
                    const score = sequence.length * 10;
                    
                    axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/analytics`, {
                        patientId,
                        gameId: 'constellation',
                        score: score,
                        details: {
                            level: nextLvl,
                            sequenceLength: sequence.length
                        }
                    }, {
                        headers: { Authorization: `Bearer ${token}` }
                    }).catch(err => console.error("Failed to save analytics", err));
                }
            } catch (e) {
                console.error(e);
            }
            
            return nextLvl;
        });
    }, [sequence]);

    // ========================================================
    // NODE CLICK
    // ========================================================

    const onNodeClick = useCallback(
        (i) => {
            // Don't allow clicks unless player is answering
            if (phase !== "input") return;

            const expected = sequence[playerIndex];

            // --------------------------------------------
            // CORRECT
            // --------------------------------------------
            if (i === expected) {
                markNode(i, "hit");

                // Draw player's path
                if (playerIndex > 0) {
                    const prev = sequence[playerIndex - 1];

                    setTraceSegments((segments) => [
                        ...segments,
                        {
                            from: prev,
                            to: i,
                            key: `t-${prev}-${i}-${playerIndex}`,
                        },
                    ]);
                }

                const nextIndex = playerIndex + 1;
                setPlayerIndex(nextIndex);

                // Complete
                if (nextIndex === sequence.length) {
                    onSuccess();
                }
            }
            // --------------------------------------------
            // WRONG
            // --------------------------------------------
            else {
                onFail(i);
            }
        },
        [phase, sequence, playerIndex, markNode, onSuccess, onFail]
    );

    // ========================================================
    // NEXT ROUND
    // ========================================================

    const nextRound = useCallback(() => {
        const len = Math.min(3 + (level - 1), POINTS.length - 2);
        const seq = pickSequence(len);
        setSequence(seq);
        setTraceSegments([]);
        clearNodeStates();
        playDemo(seq);
    }, [level, clearNodeStates, playDemo]);

    // ========================================================
    // RETRY SAME LEVEL
    // ========================================================

    const retrySameLevel = useCallback(() => {
        if (sequence.length === 0) {
            const seq = pickSequence(
                Math.max(3, Math.min(level + 2, POINTS.length - 2))
            );
            setSequence(seq);
            playDemo(seq);
            return;
        }
        playDemo(sequence);
    }, [playDemo, sequence, level]);

    // ========================================================
    // GAME STATUS
    // ========================================================

    const playable = phase === "input";

    // ========================================================
    // UI
    // ========================================================

    return (
        <div
            className="
                fixed
                inset-0
                w-full
                h-full
                overflow-hidden
                flex
                flex-col
            "
            style={{
                backgroundColor: "#8cb691",
                color: THEME.textMain,
                fontFamily: "Inter, system-ui, sans-serif",
                overscrollBehavior: "none",
                WebkitTapHighlightColor: "transparent",
            }}
        >
            {/* =================================================
                SVG WAVE BACKGROUND (matches landing page)
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
                        <filter id="paper-shadow-game" x="-10%" y="-10%" width="120%" height="120%">
                            <feDropShadow dx="0" dy="12" stdDeviation="15" floodColor="#2a402d" floodOpacity="0.12" />
                        </filter>
                    </defs>
                    <path d="M0,0 V650 C200,600 350,800 550,650 C750,500 800,250 1050,350 C1300,450 1350,700 1440,600 V0 Z" fill="#9bc1a0" filter="url(#paper-shadow-game)" />
                    <path d="M0,0 V450 C150,500 350,300 550,400 C750,500 850,800 1100,650 C1300,530 1350,350 1440,450 V0 Z" fill="#b0cfb4" filter="url(#paper-shadow-game)" />
                    <path d="M0,0 V250 C200,350 400,150 600,250 C800,350 950,600 1200,450 C1350,350 1400,200 1440,300 V0 Z" fill="#cbe5cf" filter="url(#paper-shadow-game)" />
                    <path d="M0,0 V100 C250,170 350,70 650,140 C950,210 1050,400 1250,280 C1400,190 1420,120 1440,170 V0 Z" fill="#e3f2e6" filter="url(#paper-shadow-game)" />
                </svg>
            </div>

            {/* =================================================
                BACKGROUND STARS 
                (Will look like soft pollen/dust on the green background)
            ================================================= */}
            <Starfield />

            {/* =================================================
                STAGGER WIPE CURTAIN
            ================================================= */}
            <style>{`
                .game-curtain {
                    position: fixed;
                    inset: 0;
                    display: flex;
                    z-index: 100;
                    pointer-events: none;
                }
                .game-curtain-col {
                    flex: 1;
                    height: 100%;
                    transition-property: transform;
                    transition-timing-function: cubic-bezier(.76, 0, .24, 1);
                }
            `}</style>
            <StaggerCurtain
                phase={wipePhase}
                color={THEME.bgDark}
                {...WIPE_CONFIG}
            />

            {/* =================================================
                MAIN APP
            ================================================= */}
            <div
                className="
                    relative
                    z-10
                    h-full
                    w-full
                    flex
                    flex-col
                "
            >
                {/* =================================================
                    TOP HUD 
                ================================================= */}
                <section
                    className="
                        shrink-0
                        px-4
                        pt-6
                        pb-2
                        w-full
                        max-w-xl
                        mx-auto
                    "
                >
                    {/* STATS & RESTART */}
                    <div className="grid grid-cols-4 gap-2 items-center px-2 sm:px-8">
                        {/* LEVEL */}
                        <div className="text-center min-w-[72px]">
                            <div className="text-[21px] sm:text-2xl font-semibold leading-none">
                                {level}
                            </div>
                            <div
                                className="mt-1 text-[9px] uppercase tracking-[0.18em]"
                                style={{ color: THEME.textMuted }}
                            >
                                Level
                            </div>
                        </div>

                        {/* PATH COUNT */}
                        <div className="text-center min-w-0">
                            <div className="text-[21px] sm:text-2xl font-semibold leading-none">
                                {sequence.length}
                            </div>
                            <div
                                className="mt-1 text-[9px] uppercase tracking-[0.12em]"
                                style={{ color: THEME.textMuted }}
                            >
                                Path Count
                            </div>
                        </div>

                        {/* RESTART */}
                        <button
                            onClick={retrySameLevel}
                            aria-label="Restart"
                            className="
                                w-11
                                h-11
                                rounded-full
                                flex
                                items-center
                                justify-center
                                text-xl
                                transition-all
                                active:scale-90
                                mx-auto
                            "
                            style={{
                                background: "rgba(255,255,255,0.4)",
                                border: "1px solid rgba(255,255,255,0.6)",
                                color: THEME.textMain,
                                boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                            }}
                        >
                            ↻
                        </button>

                        {/* LONGEST CHAIN */}
                        <div className="text-center min-w-0">
                            <div className="text-[21px] sm:text-2xl font-semibold leading-none">
                                {best}
                            </div>
                            <div
                                className="mt-1 text-[9px] uppercase tracking-[0.18em]"
                                style={{ color: THEME.textMuted }}
                            >
                                Longest Chain
                            </div>
                        </div>
                    </div>

                    {/* STATUS / WATCH AGAIN */}
                    <div
                        className="
                            mx-auto
                            mt-6
                            max-w-xl
                            h-[72px]
                            sm:h-20
                            px-8
                            sm:px-10
                            rounded-full
                            flex
                            items-center
                            justify-between
                        "
                        style={{
                            background: "rgba(255,255,255,0.45)",
                            border: "1px solid rgba(255,255,255,0.6)",
                            backdropFilter: "blur(12px)",
                            boxShadow: "0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.4)",
                        }}
                    >
                        {/* MESSAGE */}
                        <div
                            className="flex items-center gap-3 min-w-0"
                            style={{
                                color:
                                    messageTone === "gold"
                                        ? THEME.gold
                                        : messageTone === "err"
                                            ? THEME.err
                                            : THEME.textMain,
                            }}
                        >
                            <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{
                                    background:
                                        messageTone === "gold"
                                            ? THEME.gold
                                            : messageTone === "err"
                                                ? THEME.err
                                                : "#059669",
                                    boxShadow: `0 0 12px ${messageTone === "gold" ? THEME.gold : messageTone === "err" ? THEME.err : "#059669"}`,
                                }}
                            />
                            <span className="truncate text-lg sm:text-xl font-medium tracking-tight">
                                {message || "Follow the path"}
                            </span>
                        </div>

                        {/* WATCH AGAIN */}
                        {phase === "input" && (
                            <button
                                onClick={retrySameLevel}
                                className="
                                    text-lg
                                    sm:text-xl
                                    font-semibold
                                    ml-5
                                    px-5
                                    py-2.5
                                    shrink-0
                                    rounded-full
                                    transition-all
                                    duration-200
                                    hover:bg-white/40
                                    active:opacity-50
                                    active:scale-95
                                "
                                style={{ color: "#059669" }}
                            >
                                Watch again
                            </button>
                        )}
                    </div>
                </section>

                {/* =================================================
                    FULL SCREEN GAME BOARD
                ================================================= */}
                <main
                    className="
                        relative
                        flex-1
                        min-h-0
                        w-full
                        overflow-hidden
                    "
                >
                    {/* SVG GAME */}
                    <svg
                        className="
                            absolute
                            inset-0
                            w-full
                            h-full
                            block
                        "
                        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
                        preserveAspectRatio="xMidYMid meet"
                        style={{
                            touchAction: "none",
                            WebkitTapHighlightColor: "transparent",
                        }}
                    >
                        {/* SVG DEFINITIONS */}
                        <defs>
                            {/* Deep rich green gradients for highly visible lines on a light background */}
                            <linearGradient
                                id="threadGrad"
                                x1="0%"
                                y1="0%"
                                x2="100%"
                                y2="100%"
                            >
                                <stop offset="0%" stopColor="#064e3b" />
                                <stop offset="50%" stopColor="#0f766e" />
                                <stop offset="100%" stopColor="#047857" />
                            </linearGradient>

                            <filter
                                id="softGlow"
                                x="-60%"
                                y="-60%"
                                width="220%"
                                height="220%"
                            >
                                <feGaussianBlur stdDeviation="3.5" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>

                            <filter
                                id="nodeGlow"
                                x="-150%"
                                y="-150%"
                                width="400%"
                                height="400%"
                            >
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* PATH LINES */}
                        <g>
                            {/* DEMO PATH */}
                            {demoSegments.map((segment) => (
                                <Thread
                                    key={segment.key}
                                    from={segment.from}
                                    to={segment.to}
                                />
                            ))}

                            {/* PLAYER PATH */}
                            {traceSegments.map((segment) => (
                                <Thread
                                    key={segment.key}
                                    from={segment.from}
                                    to={segment.to}
                                    tone={segment.tone}
                                />
                            ))}
                        </g>

                        {/* NODES */}
                        <g>
                            {POINTS.map(([x, y], i) => {
                                const state = nodeStates[i];

                                const fill =
                                    state === "hit"
                                        ? THEME.gold
                                        : state === "err"
                                            ? THEME.err
                                            : state === "armed"
                                                ? THEME.nodeActive
                                                : THEME.nodeDim;

                                const haloStroke =
                                    state === "hit"
                                        ? THEME.gold
                                        : state === "err"
                                            ? THEME.err
                                            : THEME.nodeActive;

                                const haloOpacity =
                                    state === "armed"
                                        ? 0.75
                                        : state === "hit"
                                            ? 0.9
                                            : state === "err"
                                                ? 0.85
                                                : 0;

                                return (
                                    <g
                                        key={i}
                                        tabIndex={playable ? 0 : -1}
                                        role="button"
                                        aria-label={`Star ${i + 1}`}
                                        onClick={() => onNodeClick(i)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                e.preventDefault();
                                                onNodeClick(i);
                                            }
                                        }}
                                        style={{
                                            cursor: playable ? "pointer" : "default",
                                            outline: "none",
                                            WebkitTapHighlightColor: "transparent",
                                        }}
                                    >
                                        {/* LARGE INVISIBLE TOUCH AREA */}
                                        <circle cx={x} cy={y} r={27} fill="transparent" />

                                        {/* OUTER GLOW RING */}
                                        <circle
                                            cx={x}
                                            cy={y}
                                            r={17}
                                            fill="none"
                                            stroke={haloStroke}
                                            strokeWidth={1.8}
                                            style={{
                                                opacity: haloOpacity,
                                                transition: "opacity 0.3s ease",
                                            }}
                                        />

                                        {/* SECONDARY GLOW */}
                                        {state && (
                                            <circle
                                                cx={x}
                                                cy={y}
                                                r={11}
                                                fill="none"
                                                stroke={haloStroke}
                                                strokeWidth={1.5}
                                                opacity={0.35}
                                                filter="url(#nodeGlow)"
                                            />
                                        )}

                                        {/* MAIN NODE */}
                                        <circle
                                            cx={x}
                                            cy={y}
                                            r={6.5}
                                            fill={fill}
                                            filter="url(#nodeGlow)"
                                            style={{ transition: "fill 0.3s ease" }}
                                        />

                                        {/* WHITE CENTER */}
                                        {state === "armed" && (
                                            <circle cx={x} cy={y} r={2} fill="#ffffff" opacity={0.9} />
                                        )}
                                        {state === "hit" && (
                                            <circle cx={x} cy={y} r={2.2} fill="#ffffff" opacity={0.95} />
                                        )}
                                    </g>
                                );
                            })}
                        </g>
                    </svg>

                    {/* ================================================= 
                        RIGHT SIDE STAT CARDS
                    ================================================= */}
                    <div
                        className="
                            absolute
                            right-8
                            sm:right-24
                            md:right-32
                            lg:right-48
                            top-1/2
                            -translate-y-1/2
                            flex
                            flex-col
                            gap-6
                            pointer-events-none
                            z-20
                        "
                    >
                        {/* LEVEL CARD */}
                        <div
                            className="rounded-3xl text-center px-6 py-6 sm:px-8 sm:py-8"
                            style={{
                                background: "rgba(255,255,255,0.45)",
                                border: "1px solid rgba(255,255,255,0.6)",
                                backdropFilter: "blur(14px)",
                                boxShadow: "0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.5)",
                                minWidth: 140,
                            }}
                        >
                            <div
                                className="text-xs sm:text-sm uppercase tracking-[0.2em] font-bold mb-3"
                                style={{ color: THEME.textMuted }}
                            >
                                Level
                            </div>
                            <div
                                className="text-5xl sm:text-6xl font-extrabold leading-none"
                                style={{ color: THEME.textMain }}
                            >
                                {level}
                            </div>
                        </div>

                        {/* POINTS / LONGEST CHAIN CARD */}
                        <div
                            className="rounded-3xl text-center px-6 py-6 sm:px-8 sm:py-8"
                            style={{
                                background: "rgba(255,255,255,0.45)",
                                border: "1px solid rgba(255,255,255,0.6)",
                                backdropFilter: "blur(14px)",
                                boxShadow: "0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.5)",
                                minWidth: 140,
                            }}
                        >
                            <div
                                className="text-xs sm:text-sm uppercase tracking-[0.2em] font-bold mb-3"
                                style={{ color: THEME.textMuted }}
                            >
                                Points
                            </div>
                            <div
                                className="text-5xl sm:text-6xl font-extrabold leading-none"
                                style={{ color: best > 0 ? THEME.gold : THEME.textMain }}
                            >
                                {best}
                            </div>
                        </div>
                    </div>

                    {/* BOTTOM GAME HINT */}
                    <div
                        className="
                            absolute
                            bottom-6
                            left-0
                            right-0
                            flex
                            justify-center
                            pointer-events-none
                            px-4
                        "
                    >
                        <div
                            className="
                                px-5
                                py-2.5
                                rounded-full
                                text-xs
                                sm:text-sm
                                font-medium
                                backdrop-blur-md
                            "
                            style={{
                                background: "rgba(255,255,255,0.6)",
                                border: "1px solid rgba(255,255,255,0.8)",
                                color: THEME.textMain,
                                boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                            }}
                        >
                            {phase === "input"
                                ? "Tap the stars in order"
                                : phase === "showing"
                                    ? "Memorize the constellation"
                                    : phase === "success"
                                        ? "Constellation complete ✦"
                                        : phase === "fail"
                                            ? "The pattern slipped away"
                                            : "Follow the path"}
                        </div>
                    </div>
                </main>

                {/* =================================================
                    SUCCESS POPUP
                ================================================= */}
                {phase === "success" && (
                    <div
                        className="absolute inset-0 z-50 flex items-center justify-center px-5"
                        style={{
                            background: "rgba(240, 248, 235, 0.45)",
                            backdropFilter: "blur(12px)",
                            animation: "successOverlayIn 0.35s ease-out",
                        }}
                    >
                        <style>{`
                            @keyframes successOverlayIn {
                                from { opacity: 0; }
                                to   { opacity: 1; }
                            }
                            @keyframes successCardIn {
                                from { opacity: 0; transform: scale(0.88) translateY(24px); }
                                to   { opacity: 1; transform: scale(1) translateY(0); }
                            }
                            @keyframes successPulseRing {
                                0%   { transform: scale(1); opacity: 0.6; }
                                100% { transform: scale(2.4); opacity: 0; }
                            }
                            @keyframes successStarSpin {
                                0%   { transform: rotate(0deg) scale(1); }
                                50%  { transform: rotate(180deg) scale(1.15); }
                                100% { transform: rotate(360deg) scale(1); }
                            }
                        `}</style>

                        <div
                            className="w-full max-w-md rounded-[28px] text-center relative overflow-hidden"
                            style={{
                                background: "rgba(255, 255, 255, 0.95)",
                                border: "1px solid rgba(255, 255, 255, 1)",
                                boxShadow: `
                                    0 40px 100px rgba(0,0,0,0.1),
                                    0 0 80px rgba(52,211,153,0.10)
                                `,
                                animation: "successCardIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both",
                                padding: "52px 40px 44px",
                            }}
                        >
                            {/* TOP DECORATIVE GLOW */}
                            <div
                                className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
                                style={{
                                    width: 300,
                                    height: 140,
                                    background: "radial-gradient(ellipse at center, rgba(52,211,153,0.14) 0%, transparent 70%)",
                                    filter: "blur(30px)",
                                }}
                            />

                            {/* ICON WITH PULSE RING */}
                            <div className="relative mx-auto mb-8" style={{ width: 90, height: 90 }}>
                                <div
                                    className="absolute inset-0 rounded-full"
                                    style={{ border: "2px solid #059669", animation: "successPulseRing 2s ease-out infinite" }}
                                />
                                <div
                                    className="absolute inset-0 rounded-full"
                                    style={{ border: "2px solid #059669", animation: "successPulseRing 2s ease-out 0.6s infinite" }}
                                />
                                <div
                                    className="relative w-full h-full rounded-full flex items-center justify-center"
                                    style={{
                                        background: "radial-gradient(circle at 30% 30%, rgba(16,185,129,0.15), rgba(16,185,129,0.05))",
                                        border: "1px solid rgba(16,185,129,0.4)",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: 40,
                                            color: "#059669",
                                            animation: "successStarSpin 3s ease-in-out infinite",
                                            display: "inline-block",
                                        }}
                                    >
                                        ✦
                                    </span>
                                </div>
                            </div>

                            {/* TITLE */}
                            <h2
                                className="font-bold tracking-tight mb-3"
                                style={{ fontSize: 30, color: THEME.textMain }}
                            >
                                Constellation Complete!
                            </h2>

                            {/* SUBTITLE */}
                            <p
                                className="leading-relaxed mb-4"
                                style={{ color: THEME.textMuted, fontSize: 18, maxWidth: 320, margin: "0 auto" }}
                            >
                                You traced the path perfectly.
                            </p>

                            {/* NEXT ROUND BUTTON */}
                            <button
                                onClick={nextRound}
                                className="w-full mt-6 py-4 rounded-2xl font-semibold text-white transition-all active:scale-[0.97]"
                                style={{
                                    fontSize: 18,
                                    background: "linear-gradient(135deg, #065f46 0%, #10b981 100%)",
                                    boxShadow: "0 10px 30px rgba(16,185,129,0.25)",
                                }}
                            >
                                Next Round →
                            </button>
                        </div>
                    </div>
                )}

                {/* =================================================
                    FAILURE RETRY POPUP
                ================================================= */}
                {phase === "fail" && (
                    <div
                        className="absolute inset-0 z-50 flex items-center justify-center px-5"
                        style={{
                            background: "rgba(248, 235, 235, 0.45)",
                            backdropFilter: "blur(12px)",
                            animation: "failOverlayIn 0.35s ease-out",
                        }}
                    >
                        <style>{`
                            @keyframes failOverlayIn {
                                from { opacity: 0; }
                                to   { opacity: 1; }
                            }
                            @keyframes failCardIn {
                                from { opacity: 0; transform: scale(0.88) translateY(24px); }
                                to   { opacity: 1; transform: scale(1) translateY(0); }
                            }
                            @keyframes failPulseRing {
                                0%   { transform: scale(1); opacity: 0.6; }
                                100% { transform: scale(2.2); opacity: 0; }
                            }
                            @keyframes failIconShake {
                                0%, 100% { transform: translateX(0); }
                                15%  { transform: translateX(-4px) rotate(-2deg); }
                                30%  { transform: translateX(4px) rotate(2deg); }
                                45%  { transform: translateX(-3px) rotate(-1deg); }
                                60%  { transform: translateX(2px) rotate(1deg); }
                                75%  { transform: translateX(-1px); }
                            }
                        `}</style>

                        <div
                            className="w-full max-w-md rounded-[28px] text-center relative overflow-hidden"
                            style={{
                                background: "rgba(255, 255, 255, 0.95)",
                                border: "1px solid rgba(255, 255, 255, 1)",
                                boxShadow: `
                                    0 40px 100px rgba(0,0,0,0.1),
                                    0 0 60px rgba(226,139,139,0.1)
                                `,
                                animation: "failCardIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both",
                                padding: "48px 40px 40px",
                            }}
                        >
                            {/* TOP DECORATIVE GLOW */}
                            <div
                                className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
                                style={{
                                    width: 260,
                                    height: 120,
                                    background: "radial-gradient(ellipse at center, rgba(226,139,139,0.15) 0%, transparent 70%)",
                                    filter: "blur(30px)",
                                }}
                            />

                            {/* ICON WITH PULSE RING */}
                            <div className="relative mx-auto mb-7" style={{ width: 80, height: 80 }}>
                                <div
                                    className="absolute inset-0 rounded-full"
                                    style={{ border: `2px solid ${THEME.err}`, animation: "failPulseRing 1.8s ease-out infinite" }}
                                />
                                <div
                                    className="relative w-full h-full rounded-full flex items-center justify-center"
                                    style={{
                                        background: `radial-gradient(circle at 30% 30%, rgba(226,139,139,0.2), rgba(226,139,139,0.05))`,
                                        border: "1px solid rgba(226,139,139,0.4)",
                                        animation: "failIconShake 0.6s ease-in-out 0.3s",
                                    }}
                                >
                                    <span style={{ fontSize: 36, color: THEME.err, fontWeight: 700 }}>✕</span>
                                </div>
                            </div>

                            {/* TITLE */}
                            <h2
                                className="font-bold tracking-tight mb-3"
                                style={{ fontSize: 30, color: THEME.textMain }}
                            >
                                Path Incomplete
                            </h2>

                            {/* SUBTITLE */}
                            <p
                                className="leading-relaxed mb-8"
                                style={{ color: THEME.textMuted, fontSize: 18, maxWidth: 320, margin: "0 auto" }}
                            >
                                That wasn't the right sequence.
                            </p>

                            {/* BUTTONS */}
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={retrySameLevel}
                                    className="w-full py-4 rounded-2xl font-semibold text-white transition-all active:scale-[0.97]"
                                    style={{
                                        fontSize: 18,
                                        background: "linear-gradient(135deg, #065f46 0%, #10b981 100%)",
                                        boxShadow: "0 10px 25px rgba(16,185,129,0.25)",
                                    }}
                                >
                                    Try Again
                                </button>
                                <button
                                    onClick={retrySameLevel}
                                    className="w-full py-3.5 rounded-2xl font-medium transition-all active:scale-[0.97]"
                                    style={{
                                        fontSize: 17,
                                        background: "rgba(0,0,0,0.03)",
                                        color: THEME.textMain,
                                    }}
                                >
                                    Watch Replay
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}