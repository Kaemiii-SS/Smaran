import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import LandingPage from "./land_page_find_it";
import backgroundImage from "./Gemini_Generated_Image_gttwnqgttwnqgttw.png";

/* =========================================================
   FIND IT - GAME PAGE
   React + Tailwind CSS
========================================================= */

const ROUNDS_TO_COMPLETE = 4;

/* =========================================================
   LEVELS
========================================================= */

const LEVELS = [
    { level: 1, count: 3, type: "direct", hintDelay: null, complexity: "Single object type" },
    { level: 2, count: 5, type: "color", hintDelay: null, complexity: "Simple" },
    { level: 3, count: 6, type: "spatial", hintDelay: null, complexity: "Simple" },
    { level: 4, count: 8, type: "sizeColor", hintDelay: null, complexity: "Medium" },
    { level: 5, count: 10, type: "relational", hintDelay: 10, complexity: "Medium" },
    { level: 6, count: 12, type: "semantic", hintDelay: 8, complexity: "Medium" },
    { level: 7, count: 15, type: "functional", hintDelay: 8, complexity: "Complex" },
    { level: 8, count: 18, type: "oddOneOut", hintDelay: 6, complexity: "Complex" },
    { level: 9, count: 20, type: "abstract", hintDelay: 6, complexity: "Complex" },
    { level: 10, count: 25, type: "personal", hintDelay: null, complexity: "Expert" },
];

/* =========================================================
   OBJECT LABELS
========================================================= */

const LABELS = {
    cup: "cup", teaCup: "tea cup", plate: "plate", spoon: "spoon", bread: "bread",
    apple: "apple", medicine: "medicine bottle", glasses: "glasses", sunglasses: "sunglasses",
    newspaper: "newspaper", wateringCan: "watering can", flowerPot: "flower pot", bird: "bird",
    hat: "hat", book: "book", keys: "keys", comb: "comb", watch: "watch",
    photoFrame: "photo frame", pillBox: "pill box", lamp: "lamp", tvRemote: "remote control",
    blanket: "blanket", clock: "clock", phone: "phone", toothbrush: "toothbrush",
    toothpaste: "toothpaste", soap: "soap", towel: "towel",
};

const ALL_TYPES = Object.keys(LABELS);

/* =========================================================
   CATEGORIES
========================================================= */

const CATEGORY = {
    cup: "drink", teaCup: "drink", medicine: "medicine", pillBox: "medicine",
    comb: "morning", watch: "morning", toothbrush: "morning", toothpaste: "morning",
    glasses: "morning", soap: "morning",
};

/* =========================================================
   COLORS
========================================================= */

const PALETTE = ["#C0524A", "#4A7FA5", "#6B8F71", "#D9A441", "#8A6FA0", "#D98A72"];

const PALETTE_NAMES = {
    "#C0524A": "red", "#4A7FA5": "blue", "#6B8F71": "green",
    "#D9A441": "yellow", "#8A6FA0": "purple", "#D98A72": "orange",
};

const DEFAULT_COLOR = {
    cup: "#C0524A", teaCup: "#C0524A", plate: "#E8D9B5", spoon: "#B0B0B0",
    bread: "#D9A441", apple: "#C0524A", medicine: "#8AA5C4", newspaper: "#E7E2D3",
    wateringCan: "#6B8F71", flowerPot: "#B98C63", bird: "#D9A441", hat: "#8A6FA0",
    book: "#6B8F71", keys: "#8B7355", comb: "#8A6FA0", watch: "#E7E2D3",
    photoFrame: "#B98C63", pillBox: "#8AA5C4", lamp: "#D9A441", tvRemote: "#5A4E42",
    blanket: "#8A6FA0", clock: "#E7E2D3", phone: "#5A4E42", toothbrush: "#4A7FA5",
    toothpaste: "#E7E2D3", soap: "#D9C9A3", towel: "#4A7FA5",
};

const COLORABLE = ["cup", "apple", "teaCup", "plate", "hat", "flowerPot", "blanket", "towel"];

/* =========================================================
   SCENES
========================================================= */

const SCENES = [
    { id: "kitchen", name: "Kitchen Table", bg: "#F6EEDD", surface: "#C89B6D", core: ["cup", "plate", "spoon", "bread", "apple", "medicine", "glasses", "newspaper"] },
    { id: "garden", name: "Garden Bench", bg: "#E3EEDD", surface: "#8FA87C", core: ["wateringCan", "flowerPot", "bird", "hat", "book", "keys", "sunglasses"] },
    { id: "bedroom", name: "Bedroom Dresser", bg: "#F0E6EF", surface: "#B98C63", core: ["comb", "watch", "photoFrame", "pillBox", "glasses", "book", "lamp"] },
    { id: "livingroom", name: "Living Room", bg: "#F5EEDF", surface: "#C9AE86", core: ["tvRemote", "teaCup", "blanket", "clock", "phone", "glasses", "book"] },
    { id: "bathroom", name: "Bathroom Sink", bg: "#DFF0EC", surface: "#A9CAC3", core: ["toothbrush", "toothpaste", "soap", "towel", "medicine", "comb", "cup"] },
];

/* =========================================================
   PERSONAL STORIES
========================================================= */

const STORIES = [
    "the gift from Sarah", "the one from your wedding day", "your favorite from home",
    "the one your granddaughter picked out", "the one you've had for years",
];

/* =========================================================
   UTILS
========================================================= */

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function shuffle(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

function objectLabel(type) {
    return LABELS[type] || type;
}

/* =========================================================
   OBJECT POSITIONS
   FIX: Constrained tightly within the table coordinates
========================================================= */

function generatePositions(count) {
    const positions = [];
    let minimumDistance = count <= 8 ? 16 : count <= 15 ? 12 : 9;
    let attempts = 0;

    while (positions.length < count && attempts < 5000) {
        attempts++;
        // Bounded coordinates so icons fit perfectly inside the inner surface area
        const x = 12 + Math.random() * 76;
        const y = 25 + Math.random() * 56;
        let valid = true;

        for (const position of positions) {
            const dx = position.x - x;
            const dy = position.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < minimumDistance) {
                valid = false;
                break;
            }
        }

        if (valid) {
            positions.push({ x, y });
        }

        if (attempts > 2500) {
            minimumDistance *= 0.96;
        }
    }

    while (positions.length < count) {
        positions.push({
            x: 12 + Math.random() * 76,
            y: 25 + Math.random() * 56,
        });
    }

    return shuffle(positions);
}

/* =========================================================
   OBJECT ICON COMPONENT
========================================================= */

function ObjectIcon({ type, color, size = 1 }) {
    const ink = "#3E332B";
    const common = { stroke: ink, strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" };
    const svgStyle = { width: `${82 * size}px`, height: `${82 * size}px` };

    switch (type) {
        case "cup":
            return (
                <svg viewBox="0 0 100 100" style={svgStyle}>
                    <rect x="27" y="30" width="43" height="48" rx="8" fill={color} {...common} />
                    <path d="M70 40 C92 40 92 67 70 67" fill="none" {...common} />
                </svg>
            );
        case "teaCup":
            return (
                <svg viewBox="0 0 100 100" style={svgStyle}>
                    <path d="M24 39 Q24 75 50 75 Q76 75 76 39 Z" fill={color} {...common} />
                    <path d="M76 45 Q92 45 92 58 Q92 70 76 70" fill="none" {...common} />
                    <ellipse cx="50" cy="38" rx="26" ry="8" fill={color} {...common} />
                </svg>
            );
        case "plate":
            return (
                <svg viewBox="0 0 100 100" style={svgStyle}>
                    <ellipse cx="50" cy="55" rx="40" ry="22" fill={color} {...common} />
                    <ellipse cx="50" cy="53" rx="27" ry="12" fill="none" stroke={ink} strokeWidth="2" />
                </svg>
            );
        case "spoon":
            return (
                <svg viewBox="0 0 100 100" style={svgStyle}>
                    <ellipse cx="50" cy="28" rx="14" ry="18" fill={color} {...common} />
                    <rect x="46" y="42" width="8" height="45" rx="4" fill={color} {...common} />
                </svg>
            );
        case "bread":
            return (
                <svg viewBox="0 0 100 100" style={svgStyle}>
                    <path d="M18 66 Q18 28 50 24 Q82 28 82 66 Q82 81 50 81 Q18 81 18 66Z" fill={color} {...common} />
                    <path d="M33 48 Q50 35 67 48" fill="none" stroke={ink} strokeWidth="2" />
                </svg>
            );
        case "apple":
            return (
                <svg viewBox="0 0 100 100" style={svgStyle}>
                    <circle cx="50" cy="57" r="28" fill={color} {...common} />
                    <path d="M50 30 Q48 17 60 12" fill="none" stroke="#7A4B2A" strokeWidth="5" />
                    <path d="M55 18 Q70 10 73 23 Q61 29 55 18Z" fill="#7BAA5E" stroke={ink} strokeWidth="2" />
                </svg>
            );
        case "medicine":
            return (
                <svg viewBox="0 0 100 100" style={svgStyle}>
                    <rect x="33" y="32" width="34" height="48" rx="6" fill={color} {...common} />
                    <rect x="39" y="18" width="22" height="16" rx="3" fill="#999" {...common} />
                    <rect x="39" y="51" width="22" height="17" fill="#fff" opacity="0.65" />
                </svg>
            );
        case "glasses":
            return (
                <svg viewBox="0 0 100 100" style={svgStyle}>
                    <circle cx="30" cy="50" r="18" fill="none" {...common} />
                    <circle cx="70" cy="50" r="18" fill="none" {...common} />
                    <line x1="48" y1="49" x2="52" y2="49" {...common} />
                    <line x1="13" y1="45" x2="4" y2="38" {...common} />
                    <line x1="87" y1="45" x2="96" y2="38" {...common} />
                </svg>
            );
        case "sunglasses":
            return (
                <svg viewBox="0 0 100 100" style={svgStyle}>
                    <circle cx="30" cy="50" r="18" fill="#3E332B" {...common} />
                    <circle cx="70" cy="50" r="18" fill="#3E332B" {...common} />
                    <line x1="48" y1="49" x2="52" y2="49" {...common} />
                    <line x1="13" y1="45" x2="4" y2="38" {...common} />
                    <line x1="87" y1="45" x2="96" y2="38" {...common} />
                </svg>
            );
        case "newspaper":
            return (
                <svg viewBox="0 0 100 100" style={svgStyle}>
                    <rect x="18" y="25" width="64" height="50" rx="4" fill={color} {...common} />
                    <line x1="27" y1="40" x2="73" y2="40" {...common} />
                    <line x1="27" y1="49" x2="73" y2="49" {...common} />
                    <line x1="27" y1="58" x2="60" y2="58" {...common} />
                </svg>
            );
        case "wateringCan":
            return (
                <svg viewBox="0 0 100 100" style={svgStyle}>
                    <ellipse cx="42" cy="58" rx="25" ry="20" fill={color} {...common} />
                    <path d="M63 51 L88 34" stroke={ink} strokeWidth="7" fill="none" />
                    <path d="M37 39 Q48 22 62 39" fill="none" {...common} />
                </svg>
            );
        case "flowerPot":
            return (
                <svg viewBox="0 0 100 100" style={svgStyle}>
                    <path d="M28 53 L72 53 L64 84 L36 84 Z" fill={color} {...common} />
                    <circle cx="50" cy="32" r="9" fill="#E8B84B" {...common} />
                    <circle cx="36" cy="40" r="8" fill="#D98A72" {...common} />
                    <circle cx="64" cy="40" r="8" fill="#D98A72" {...common} />
                </svg>
            );
        case "bird":
            return (
                <svg viewBox="0 0 100 100" style={svgStyle}>
                    <ellipse cx="50" cy="57" rx="27" ry="19" fill={color} {...common} />
                    <circle cx="76" cy="45" r="11" fill={color} {...common} />
                    <path d="M86 44 L97 48 L86 52Z" fill="#D9A441" {...common} />
                    <circle cx="79" cy="43" r="2" fill={ink} />
                    <path d="M35 56 Q20 62 14 51 Q26 51 35 47" fill="none" {...common} />
                </svg>
            );
        case "hat":
            return (
                <svg viewBox="0 0 100 100" style={svgStyle}>
                    <ellipse cx="50" cy="68" rx="39" ry="10" fill={color} {...common} />
                    <path d="M31 67 Q30 34 50 29 Q70 34 69 67Z" fill={color} {...common} />
                </svg>
            );
        case "book":
            return (
                <svg viewBox="0 0 100 100" style={svgStyle}>
                    <rect x="23" y="24" width="54" height="52" rx="4" fill={color} {...common} />
                    <line x1="50" y1="24" x2="50" y2="76" {...common} />
                </svg>
            );
        case "keys":
            return (
                <svg viewBox="0 0 100 100" style={svgStyle}>
                    <circle cx="32" cy="37" r="13" fill="none" {...common} />
                    <line x1="43" y1="47" x2="80" y2="78" {...common} />
                    <line x1="66" y1="66" x2="75" y2="57" {...common} />
                    <line x1="74" y1="74" x2="83" y2="65" {...common} />
                </svg>
            );
        case "comb":
            return (
                <svg viewBox="0 0 100 100" style={svgStyle}>
                    <rect x="22" y="27" width="56" height="14" rx="4" fill={color} {...common} />
                    {Array.from({ length: 9 }).map((_, i) => (
                        <line key={i} x1={27 + i * 5.8} y1="41" x2={27 + i * 5.8} y2="78" stroke={ink} strokeWidth="2.5" />
                    ))}
                </svg>
            );
        case "watch":
            return (
                <svg viewBox="0 0 100 100" style={svgStyle}>
                    <rect x="40" y="10" width="20" height="20" rx="3" fill="#B0A57A" {...common} />
                    <circle cx="50" cy="50" r="22" fill="#fff" {...common} />
                    <line x1="50" y1="50" x2="50" y2="37" {...common} />
                    <line x1="50" y1="50" x2="62" y2="56" {...common} />
                    <rect x="40" y="70" width="20" height="20" rx="3" fill="#B0A57A" {...common} />
                </svg>
            );
        case "photoFrame":
            return (
                <svg viewBox="0 0 100 100" style={svgStyle}>
                    <rect x="23" y="18" width="54" height="65" rx="4" fill={color} {...common} />
                    <rect x="32" y="28" width="36" height="44" fill="#EFE6D2" stroke={ink} strokeWidth="2" />
                    <circle cx="50" cy="43" r="7" fill="#D9A441" />
                    <path d="M35 66 Q45 50 55 62 Q62 52 67 66" fill="#8FA87C" />
                </svg>
            );
        case "pillBox":
            return (
                <svg viewBox="0 0 100 100" style={svgStyle}>
                    <rect x="18" y="35" width="64" height="32" rx="6" fill={color} {...common} />
                    <line x1="34" y1="35" x2="34" y2="67" {...common} />
                    <line x1="50" y1="35" x2="50" y2="67" {...common} />
                    <line x1="66" y1="35" x2="66" y2="67" {...common} />
                </svg>
            );
        case "lamp":
            return (
                <svg viewBox="0 0 100 100" style={svgStyle}>
                    <path d="M31 39 L69 39 L61 12 L39 12 Z" fill={color} {...common} />
                    <line x1="50" y1="39" x2="50" y2="77" {...common} />
                    <ellipse cx="50" cy="82" rx="21" ry="7" fill="#8A7A63" {...common} />
                </svg>
            );
        case "tvRemote":
            return (
                <svg viewBox="0 0 100 100" style={svgStyle}>
                    <rect x="37" y="12" width="26" height="76" rx="10" fill={color} {...common} />
                    <circle cx="50" cy="30" r="5" fill="#F5EFE0" />
                    <circle cx="50" cy="48" r="5" fill="#F5EFE0" />
                    <circle cx="50" cy="66" r="5" fill="#F5EFE0" />
                </svg>
            );
        case "blanket":
            return (
                <svg viewBox="0 0 100 100" style={svgStyle}>
                    <rect x="15" y="32" width="70" height="45" rx="8" fill={color} {...common} />
                    <line x1="15" y1="47" x2="85" y2="47" stroke={ink} strokeWidth="2" opacity="0.5" />
                    <line x1="15" y1="62" x2="85" y2="62" stroke={ink} strokeWidth="2" opacity="0.5" />
                </svg>
            );
        case "clock":
            return (
                <svg viewBox="0 0 100 100" style={svgStyle}>
                    <circle cx="50" cy="50" r="31" fill={color} {...common} />
                    <line x1="50" y1="50" x2="50" y2="32" {...common} />
                    <line x1="50" y1="50" x2="64" y2="57" {...common} />
                </svg>
            );
        case "phone":
            return (
                <svg viewBox="0 0 100 100" style={svgStyle}>
                    <rect x="33" y="12" width="34" height="76" rx="8" fill={color} {...common} />
                    <rect x="39" y="22" width="22" height="48" rx="2" fill="#EFE9DA" />
                    <circle cx="50" cy="78" r="3" fill="#EFE9DA" />
                </svg>
            );
        case "toothbrush":
            return (
                <svg viewBox="0 0 100 100" style={svgStyle}>
                    <rect x="44" y="17" width="11" height="55" rx="4" fill={color} {...common} />
                    {Array.from({ length: 5 }).map((_, i) => (
                        <line key={i} x1={35 + i * 7} y1="14" x2={35 + i * 7} y2="5" stroke={ink} strokeWidth="2.5" />
                    ))}
                    <rect x="28" y="68" width="44" height="11" rx="4" fill={color} {...common} />
                </svg>
            );
        case "toothpaste":
            return (
                <svg viewBox="0 0 100 100" style={svgStyle}>
                    <path d="M31 30 L69 30 L65 81 Q64 89 50 89 Q36 89 35 81Z" fill={color} {...common} />
                    <rect x="38" y="15" width="24" height="16" rx="3" fill="#B0A57A" {...common} />
                </svg>
            );
        case "soap":
            return (
                <svg viewBox="0 0 100 100" style={svgStyle}>
                    <rect x="23" y="37" width="54" height="32" rx="15" fill={color} {...common} />
                    <circle cx="62" cy="47" r="4" fill="#fff" opacity="0.5" />
                </svg>
            );
        case "towel":
            return (
                <svg viewBox="0 0 100 100" style={svgStyle}>
                    <rect x="22" y="16" width="56" height="68" rx="6" fill={color} {...common} />
                    <line x1="22" y1="33" x2="78" y2="33" stroke={ink} strokeWidth="2" opacity="0.5" />
                    <line x1="22" y1="50" x2="78" y2="50" stroke={ink} strokeWidth="2" opacity="0.5" />
                    <line x1="22" y1="67" x2="78" y2="67" stroke={ink} strokeWidth="2" opacity="0.5" />
                </svg>
            );
        default:
            return <div style={svgStyle} className="flex items-center justify-center rounded-xl bg-gray-300">?</div>;
    }
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function GamePage() {
    /* -------------------------------------------------------
       GAME STATE
    ------------------------------------------------------- */
    const [showLanding, setShowLanding] = useState(true);
    const [levelIndex, setLevelIndex] = useState(0);
    const [roundsAtLevel, setRoundsAtLevel] = useState(0);
    const [completedLevels, setCompletedLevels] = useState([]);
    const [currentRound, setCurrentRound] = useState(null);
    const [found, setFound] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [correctFirstTry, setCorrectFirstTry] = useState(0);
    const [falseTaps, setFalseTaps] = useState([]);
    const [hintUsedCount, setHintUsedCount] = useState(0);
    const [wrongTapsThisRound, setWrongTapsThisRound] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [feedbackType, setFeedbackType] = useState("");
    const [voiceOn, setVoiceOn] = useState(true);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [showStart, setShowStart] = useState(true);
    const [showSummary, setShowSummary] = useState(false);
    const [showLevelComplete, setShowLevelComplete] = useState(false);
    const [completedLevelNumber, setCompletedLevelNumber] = useState(null);
    const [sessionStartedAt, setSessionStartedAt] = useState(new Date());
    const [scenesPlayed, setScenesPlayed] = useState([]);
    const [lastSceneId, setLastSceneId] = useState(null);

    const hintTimerRef = useRef(null);
    const roundTimerRef = useRef(null);

    /* -------------------------------------------------------
       CURRENT LEVEL
    ------------------------------------------------------- */
    const currentLevel = useMemo(() => LEVELS[levelIndex], [levelIndex]);

    /* -------------------------------------------------------
       VOICE
    ------------------------------------------------------- */
    const speak = useCallback((text) => {
        if (!voiceOn) return;
        if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.92;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    }, [voiceOn]);

    /* -------------------------------------------------------
       CLEAR TIMERS
    ------------------------------------------------------- */
    const clearTimers = useCallback(() => {
        if (hintTimerRef.current) {
            clearTimeout(hintTimerRef.current);
            hintTimerRef.current = null;
        }
        if (roundTimerRef.current) {
            clearTimeout(roundTimerRef.current);
            roundTimerRef.current = null;
        }
    }, []);

    useEffect(() => {
        return () => {
            clearTimers();
            if (typeof window !== "undefined" && "speechSynthesis" in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, [clearTimers]);

    /* =========================================================
       LEVEL UNLOCK LOGIC
    ========================================================= */
    const isLevelUnlocked = useCallback((levelNumber) => {
        if (levelNumber === 1) return true;
        return completedLevels.includes(levelNumber - 1);
    }, [completedLevels]);

    const isLevelCompleted = useCallback((levelNumber) => {
        return completedLevels.includes(levelNumber);
    }, [completedLevels]);

    /* =========================================================
       SELECT SCENE
    ========================================================= */
    const pickScene = useCallback((excludeId = null) => {
        let options = SCENES;
        if (excludeId) {
            const filtered = SCENES.filter((scene) => scene.id !== excludeId);
            if (filtered.length > 0) options = filtered;
        }
        return randomItem(options);
    }, []);

    /* =========================================================
       GENERATE ROUND
    ========================================================= */
    const generateRound = useCallback((levelConfig) => {
        const scene = pickScene(lastSceneId);
        const count = levelConfig.count;
        const items = [];
        let targetIndex = 0;
        let promptText = "";
        let speechText = "";
        let descriptionType = "direct";

        const addFillers = (usedTypes, number, pool) => {
            const available = shuffle(pool.filter((type) => !usedTypes.includes(type)));
            for (let i = 0; i < number; i++) {
                let type = available[i];
                if (!type) {
                    type = randomItem(ALL_TYPES.filter((t) => !usedTypes.includes(t)));
                }
                if (!type) {
                    type = randomItem(ALL_TYPES);
                }
                items.push({ type, color: DEFAULT_COLOR[type] || "#B7A98C", size: 1 });
            }
        };

        if (levelConfig.type === "direct") {
            const targetType = randomItem(scene.core);
            items.push({ type: targetType, color: DEFAULT_COLOR[targetType] || "#B7A98C", size: 1 });
            addFillers([targetType], count - 1, scene.core);
            promptText = `Can you find the ${objectLabel(targetType)}?`;
            speechText = promptText;
            descriptionType = "direct";
        } else if (levelConfig.type === "color") {
            const colorableInScene = COLORABLE.filter((type) => scene.core.includes(type));
            const targetType = randomItem(colorableInScene.length ? colorableInScene : COLORABLE);
            const variantColors = shuffle(PALETTE).slice(0, Math.min(3, count));
            const targetColor = variantColors[0];
            variantColors.forEach((color) => {
                items.push({ type: targetType, color, size: 1 });
            });
            addFillers([targetType], count - variantColors.length, ALL_TYPES);
            promptText = `Can you find the ${PALETTE_NAMES[targetColor]} ${objectLabel(targetType)}?`;
            speechText = promptText;
            descriptionType = "color";
        } else if (levelConfig.type === "spatial" || levelConfig.type === "relational") {
            const targetType = randomItem(scene.core);
            const landmarkPool = scene.core.filter((type) => type !== targetType);
            const landmarkType = randomItem(landmarkPool.length ? landmarkPool : ALL_TYPES.filter((type) => type !== targetType));
            items.push({ type: targetType, color: DEFAULT_COLOR[targetType] || "#B7A98C", size: 1 });
            items.push({ type: landmarkType, color: DEFAULT_COLOR[landmarkType] || "#B7A98C", size: 1 });
            addFillers([targetType, landmarkType], count - 2, ALL_TYPES);
            promptText = `Can you find the ${objectLabel(targetType)} next to the ${objectLabel(landmarkType)}?`;
            speechText = promptText;
            descriptionType = "spatial";
        } else if (levelConfig.type === "sizeColor") {
            const colorableInScene = COLORABLE.filter((type) => scene.core.includes(type));
            const targetType = randomItem(colorableInScene.length ? colorableInScene : COLORABLE);
            const sizes = [
                { name: "small", value: 0.72 },
                { name: "medium", value: 1 },
                { name: "large", value: 1.28 },
            ];
            const variants = shuffle(
                sizes.flatMap((size) => PALETTE.slice(0, 3).map((color) => ({ size, color })))
            ).slice(0, Math.min(3, count));
            const target = variants[0];
            variants.forEach((variant) => {
                items.push({ type: targetType, color: variant.color, size: variant.size.value });
            });
            addFillers([targetType], count - variants.length, ALL_TYPES);
            promptText = `Can you find the ${target.size.name} ${PALETTE_NAMES[target.color]} ${objectLabel(targetType)}?`;
            speechText = promptText;
            descriptionType = "color";
        } else if (levelConfig.type === "semantic") {
            const medicineTypes = ["medicine", "pillBox"];
            let targetType = "medicine";
            if (scene.core.includes("medicine")) targetType = "medicine";
            else if (scene.core.includes("pillBox")) targetType = "pillBox";
            else targetType = randomItem(medicineTypes);
            items.push({ type: targetType, color: DEFAULT_COLOR[targetType], size: 1 });
            addFillers([targetType], count - 1, ALL_TYPES);
            promptText = "Where is your medicine?";
            speechText = promptText;
            descriptionType = "abstract";
        } else if (levelConfig.type === "functional") {
            const drinkTypes = ["cup", "teaCup"];
            let targetType = "cup";
            if (scene.core.includes("cup")) targetType = "cup";
            else if (scene.core.includes("teaCup")) targetType = "teaCup";
            else targetType = randomItem(drinkTypes);
            items.push({ type: targetType, color: DEFAULT_COLOR[targetType], size: 1 });
            addFillers([targetType], count - 1, ALL_TYPES);
            promptText = "Can you find the thing you drink from?";
            speechText = promptText;
            descriptionType = "functional";
        } else if (levelConfig.type === "oddOneOut") {
            const otherScenes = SCENES.filter((s) => s.id !== scene.id);
            const oddScene = randomItem(otherScenes);
            const oddCandidates = oddScene.core.filter((type) => !scene.core.includes(type));
            const oddType = randomItem(oddCandidates.length ? oddCandidates : ALL_TYPES);
            items.push({ type: oddType, color: DEFAULT_COLOR[oddType] || "#B7A98C", size: 1 });
            addFillers([oddType], count - 1, scene.core);
            promptText = "Find the object that doesn't belong here.";
            speechText = promptText;
            descriptionType = "abstract";
        } else if (levelConfig.type === "abstract") {
            const morningTypes = Object.keys(CATEGORY).filter((type) => CATEGORY[type] === "morning");
            const inScene = morningTypes.filter((type) => scene.core.includes(type));
            const targetType = randomItem(inScene.length ? inScene : morningTypes);
            items.push({ type: targetType, color: DEFAULT_COLOR[targetType] || "#B7A98C", size: 1 });
            addFillers([targetType], count - 1, ALL_TYPES);
            promptText = "Can you find the thing you use in the morning?";
            speechText = promptText;
            descriptionType = "abstract";
        } else if (levelConfig.type === "personal") {
            const targetType = randomItem(scene.core);
            const story = randomItem(STORIES);
            items.push({ type: targetType, color: DEFAULT_COLOR[targetType] || "#B7A98C", size: 1, story });
            addFillers([targetType], count - 1, ALL_TYPES);
            promptText = `Can you find ${story}?`;
            speechText = promptText;
            descriptionType = "personal";
        }

        const order = shuffle(items.map((_, index) => index));
        const positions = generatePositions(items.length);
        const placed = order.map((originalIndex, index) => {
            const item = items[originalIndex];
            return {
                ...item,
                id: `object-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`,
                x: positions[index].x,
                y: positions[index].y,
                rotation: Math.round((Math.random() - 0.5) * 18),
                isTarget: originalIndex === targetIndex,
            };
        });

        return { scene, items: placed, promptText, speechText, descriptionType, level: levelConfig.level };
    }, [lastSceneId, pickScene]);

    /* =========================================================
       START ROUND
    ========================================================= */
    const startRound = useCallback((specificLevelIndex = levelIndex) => {
        clearTimers();
        setWrongTapsThisRound(0);
        setFeedback("");
        setFeedbackType("");

        const levelConfig = LEVELS[specificLevelIndex];
        const round = generateRound(levelConfig);

        setCurrentRound(round);
        setLastSceneId(round.scene.id);
        setScenesPlayed((previous) => {
            if (previous.includes(round.scene.id)) return previous;
            return [...previous, round.scene.id];
        });

        speak(round.speechText);

        if (levelConfig.hintDelay) {
            hintTimerRef.current = setTimeout(() => {
                setCurrentRound((previous) => {
                    if (!previous) return previous;
                    return { ...previous, hintActive: true };
                });
            }, levelConfig.hintDelay * 1000);
        }
    }, [clearTimers, generateRound, levelIndex, speak]);

    /* =========================================================
       COMPLETE LEVEL
    ========================================================= */
    const completeCurrentLevel = useCallback(() => {
        clearTimers();
        const completed = LEVELS[levelIndex].level;

        setCompletedLevels((previous) => {
            if (previous.includes(completed)) return previous;
            return [...previous, completed];
        });
        setCompletedLevelNumber(completed);
        setShowLevelComplete(true);
        setFeedback("");
        setCurrentRound((previous) => previous ? { ...previous, hintActive: false } : previous);
        speak(`Excellent! You completed level ${completed}.`);
    }, [clearTimers, levelIndex, speak]);

    /* =========================================================
       HANDLE OBJECT CLICK
    ========================================================= */
    const handleObjectClick = useCallback((item) => {
        if (!currentRound) return;
        if (item.locked) return;

        if (item.isTarget) {
            clearTimers();
            setCurrentRound((previous) => {
                if (!previous) return previous;
                return {
                    ...previous,
                    items: previous.items.map((object) => object.id === item.id ? { ...object, locked: true, clickedCorrect: true } : object),
                };
            });

            setAttempts((previous) => previous + 1);
            setFound((previous) => previous + 1);

            if (wrongTapsThisRound === 0) {
                setCorrectFirstTry((previous) => previous + 1);
            }

            const story = item.story;
            const message = story ? `Yes! That's ${story}.` : `Yes, that's the ${objectLabel(item.type)}!`;
            setFeedback(message);
            setFeedbackType("good");
            speak(message);

            const nextRoundCount = roundsAtLevel + 1;
            if (nextRoundCount >= ROUNDS_TO_COMPLETE) {
                setRoundsAtLevel(ROUNDS_TO_COMPLETE);
                roundTimerRef.current = setTimeout(() => { completeCurrentLevel(); }, 900);
            } else {
                setRoundsAtLevel(nextRoundCount);
                roundTimerRef.current = setTimeout(() => { startRound(); }, 1100);
            }
            return;
        }

        setAttempts((previous) => previous + 1);
        const newWrongCount = wrongTapsThisRound + 1;
        setWrongTapsThisRound(newWrongCount);

        if (newWrongCount === 3) {
            setHintUsedCount((previous) => previous + 1);
        }

        setFalseTaps((previous) => [
            ...previous,
            {
                targetObject: currentRound.items.find((object) => object.isTarget)?.type,
                mistakenObject: item.type,
                sceneId: currentRound.scene.id,
                timestamp: new Date().toISOString(),
            },
        ]);

        setCurrentRound((previous) => {
            if (!previous) return previous;
            return { ...previous, wrongObjectId: item.id };
        });

        setFeedback(`That's the ${objectLabel(item.type)}. Keep looking!`);
        setFeedbackType("bad");
        speak(`That's the ${objectLabel(item.type)}. Keep looking.`);

        setTimeout(() => {
            setCurrentRound((previous) => {
                if (!previous) return previous;
                return { ...previous, wrongObjectId: null };
            });
        }, 450);
    }, [clearTimers, completeCurrentLevel, currentRound, roundsAtLevel, speak, startRound, wrongTapsThisRound]);

    /* =========================================================
       SELECT LEVEL
    ========================================================= */
    const selectLevel = useCallback((levelNumber) => {
        if (!isLevelUnlocked(levelNumber)) return;
        const newIndex = levelNumber - 1;

        clearTimers();
        setLevelIndex(newIndex);
        setRoundsAtLevel(0);
        setFeedback("");
        setFeedbackType("");
        setShowLevelComplete(false);
        setShowStart(false);

        setTimeout(() => {
            startRound(newIndex);
        }, 0);
    }, [clearTimers, isLevelUnlocked, startRound]);

    /* =========================================================
       NEXT LEVEL
    ========================================================= */
    const goToNextLevel = () => {
        if (!completedLevelNumber || completedLevelNumber >= LEVELS.length) {
            setShowLevelComplete(false);
            setShowSummary(true);
            return;
        }
        const nextLevel = completedLevelNumber + 1;
        setShowLevelComplete(false);
        selectLevel(nextLevel);
    };

    /* =========================================================
       SUMMARY
    ========================================================= */
    const accuracy = attempts > 0 ? Math.round((found / attempts) * 100) : 0;
    const engagementScore = Math.max(0, Math.min(100, accuracy - hintUsedCount * 3));
    const avgFindTime = found > 0 ? Math.round((Date.now() - sessionStartedAt.getTime()) / found) : 0;

    const exportSession = () => {
        const data = {
            sessionId: "find-it-" + Date.now(), patientId: "guest", timestamp: new Date().toISOString(),
            currentLevel: currentLevel.level, completedLevels, objectsFound: found, attempts,
            accuracy, correctFirstTry, scenesPlayed, falseTaps, hintsUsed: hintUsedCount,
            engagementScore, averageFindTimeMs: avgFindTime,
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `find-it-session-${Date.now()}.json`;
        anchor.click();
        URL.revokeObjectURL(url);
    };

    const playAgain = () => {
        clearTimers();
        setLevelIndex(0);
        setRoundsAtLevel(0);
        setFound(0);
        setAttempts(0);
        setCorrectFirstTry(0);
        setFalseTaps([]);
        setHintUsedCount(0);
        setWrongTapsThisRound(0);
        setScenesPlayed([]);
        setLastSceneId(null);
        setCurrentRound(null);
        setCompletedLevels([]);
        setCompletedLevelNumber(null);
        setShowSummary(false);
        setShowLevelComplete(false);
        setSessionStartedAt(new Date());
        setTimeout(() => { startRound(0); }, 0);
    };

    /* =========================================================
       RENDER
    ========================================================= */
    if (showLanding) {
        return <LandingPage onEnterGame={() => setShowLanding(false)} />;
    }

    return (
        <div className="relative min-h-screen w-full overflow-hidden text-[#3E332B]">
            {/* =========================================================
          BACKGROUND IMAGE
      ========================================================= */}
            <div
                className="fixed inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                }}
            />

            {/* Blue blurred overlay */}
            <div className="fixed inset-0 bg-sky-200/30 backdrop-blur-sm" />

            <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1100px] flex-col gap-4 px-3 py-4 sm:px-5 sm:py-6">

                {/* =================================================
            HEADER
        ================================================= */}
                <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Find It</h1>
                        <p className="text-sm text-[#6B5D4F]">A gentle visual search game</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="rounded-full border border-white/40 bg-white/50 px-4 py-2 text-sm shadow-sm backdrop-blur-sm">
                            Level <strong>{currentLevel.level}</strong>
                        </div>
                        <div className="rounded-full border border-white/40 bg-white/50 px-4 py-2 text-sm shadow-sm backdrop-blur-sm">
                            Found <strong>{found}</strong>
                        </div>
                        <div className="rounded-full border border-white/40 bg-white/50 px-4 py-2 text-sm shadow-sm backdrop-blur-sm">
                            Accuracy <strong>{attempts ? `${accuracy}%` : "—"}</strong>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowStart(true)}
                            className="rounded-xl border border-white/40 bg-white/50 px-4 py-2 text-sm font-semibold text-[#3E332B] shadow-sm backdrop-blur-sm transition hover:bg-white/70 active:scale-95"
                        >
                            Select Level
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowLanding(true)}
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/50 text-xl shadow-sm backdrop-blur-sm transition hover:scale-105 active:scale-95"
                            aria-label="Home"
                        >
                            🏠
                        </button>
                        <button
                            type="button"
                            onClick={() => setSettingsOpen((previous) => !previous)}
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/50 text-xl shadow-sm backdrop-blur-sm transition hover:scale-105 active:scale-95"
                            aria-label="Settings"
                        >
                            ⚙️
                        </button>
                    </div>
                </header>

                {/* =================================================
            SETTINGS
        ================================================= */}
                {settingsOpen && (
                    <div className="flex flex-col gap-3 rounded-2xl bg-white/50 p-4 shadow-md backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={voiceOn} onChange={(event) => setVoiceOn(event.target.checked)} className="h-4 w-4" />
                            Speak prompts
                        </label>
                        <button type="button" onClick={() => setShowSummary(true)} className="rounded-xl border border-[#E3D8C3] px-4 py-2 text-sm transition hover:bg-[#F5EFE0]">
                            End session & see summary
                        </button>
                    </div>
                )}

                {/* =================================================
            PROMPT
        ================================================= */}
                <section className="rounded-[22px] bg-white/30 p-4 shadow-lg backdrop-blur-xl sm:p-5">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => currentRound && speak(currentRound.speechText)}
                            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#D9A441] text-xl text-white shadow-md transition active:scale-95"
                            aria-label="Repeat prompt"
                        >
                            🔊
                        </button>
                        <div className="min-w-0">
                            <p className="text-lg font-bold sm:text-2xl">
                                {currentRound?.promptText || "Getting the scene ready…"}
                            </p>
                            {currentRound && (
                                <p className="mt-1 text-xs text-[#6B5D4F] sm:text-sm">
                                    {currentRound.scene.name} {" · "} Level {currentLevel.level} {" · "} {currentLevel.complexity}
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                {/* =================================================
            GAME BOARD
        ================================================= */}
                <section className="relative overflow-hidden rounded-[24px] border border-white/20 p-2 shadow-md sm:p-3">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[18px]">
                        {currentRound && (
                            <div className="absolute left-4 top-3 z-10 rounded-full bg-white/50 px-3 py-1 text-xs font-bold text-[#3E332B] backdrop-blur-sm sm:left-5 sm:top-4 sm:text-sm">
                                {currentRound.scene.name}
                            </div>
                        )}

                        <div
                            className="absolute bottom-[6%] left-[5%] right-[5%] top-[17%] overflow-hidden rounded-[24px]"
                            style={{ backgroundColor: "transparent" }}
                        />

                        {currentRound?.items.map((item) => {
                            const isWrong = currentRound.wrongObjectId === item.id;
                            const isCorrect = item.clickedCorrect;
                            const isHint = currentRound.hintActive && item.isTarget;

                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => handleObjectClick(item)}
                                    disabled={item.locked}
                                    aria-label={objectLabel(item.type)}
                                    className={`
                    absolute z-20 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center
                    rounded-2xl border-0 bg-transparent p-1 transition-all duration-200 focus:outline-none
                    ${isWrong ? "animate-[shake_0.4s_ease-in-out] drop-shadow-[0_0_12px_rgba(217,138,114,0.9)]" : ""}
                    ${isCorrect ? "scale-110 drop-shadow-[0_0_18px_rgba(232,184,75,0.95)]" : ""}
                    ${isHint ? "animate-pulse drop-shadow-[0_0_18px_rgba(232,184,75,0.9)]" : ""}
                    ${!item.locked ? "cursor-pointer hover:scale-110 active:scale-95" : "cursor-default"}
                  `}
                                    style={{
                                        left: `${item.x}%`,
                                        top: `${item.y}%`,
                                        transform: `translate(-50%, -50%) rotate(${item.rotation}deg) ${isCorrect ? "scale(1.08)" : ""}`,
                                    }}
                                >
                                    <ObjectIcon type={item.type} color={item.color} size={item.size || 1} />
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* =================================================
            FEEDBACK
        ================================================= */}
                <div className={`min-h-[30px] px-3 text-center text-base font-bold ${feedbackType === "good" ? "text-[#4C7350]" : feedbackType === "bad" ? "text-[#B06A52]" : "text-[#6B5D4F]"}`}>
                    {feedback}
                </div>

                {/* =================================================
            BOTTOM CONTROLS
        ================================================= */}
                <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-1.5">
                        {LEVELS.map((level) => {
                            const completed = isLevelCompleted(level.level);
                            const active = currentLevel.level === level.level;
                            return (
                                <span
                                    key={level.level}
                                    className={`h-2.5 w-2.5 rounded-full transition-all ${completed ? "bg-[#6B8F71]" : active ? "scale-125 bg-[#D9A441]" : "bg-[#E3D8C3]"}`}
                                />
                            );
                        })}
                    </div>
                    <button
                        type="button"
                        onClick={() => { setRoundsAtLevel((previous) => previous); startRound(); }}
                        className="rounded-xl border border-[#E3D8C3] bg-[#FFFDF8] px-4 py-2.5 text-sm font-semibold text-[#6B5D4F] shadow-sm transition hover:bg-white active:scale-95"
                    >
                        Try a different scene
                    </button>
                </div>
            </div>

            {/* =====================================================
          FLOATING LEVEL CARDS (START OVERLAY)
      ===================================================== */}
            {showStart && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#F5EFE0]/40 p-4 backdrop-blur-md overflow-y-auto">
                    <div className="m-auto w-full max-w-[1000px] py-10">

                        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-[#3E332B] drop-shadow-sm">Levels</h2>
                                <p className="mt-1 text-sm font-medium text-[#3E332B]/80">Complete each level to unlock the next</p>
                            </div>
                            <div className="rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-[#5D855F] shadow-sm backdrop-blur-sm">
                                {completedLevels.length} / {LEVELS.length} complete
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                            {LEVELS.map((level) => {
                                const unlocked = isLevelUnlocked(level.level);
                                const completed = isLevelCompleted(level.level);
                                const active = currentLevel.level === level.level;
                                const progress = active && !completed ? Math.min(100, (roundsAtLevel / ROUNDS_TO_COMPLETE) * 100) : completed ? 100 : 0;

                                return (
                                    <button
                                        key={level.level}
                                        type="button"
                                        disabled={!unlocked}
                                        onClick={() => {
                                            setShowStart(false);
                                            selectLevel(level.level);
                                        }}
                                        className={`
                      relative flex min-h-[140px] flex-col overflow-hidden rounded-[20px] p-4 text-left transition-all duration-300
                      ${active ? "z-10 scale-105 border-2 border-[#6B8F71] bg-[#E8F0E7] shadow-lg"
                                                : completed ? "border-2 border-transparent bg-[#F1F6EF] shadow-md hover:-translate-y-1 hover:shadow-lg"
                                                    : unlocked ? "border-2 border-transparent bg-white shadow-md hover:-translate-y-1 hover:shadow-lg"
                                                        : "cursor-not-allowed border-2 border-transparent bg-white/60 opacity-70 shadow-sm"
                                            }
                    `}
                                    >
                                        <div className="absolute right-3 top-3 text-sm">
                                            {completed ? "✓" : !unlocked ? "🔒" : "●"}
                                        </div>

                                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-bold ${completed ? "bg-[#6B8F71] text-white" : active ? "bg-[#D9A441] text-white" : unlocked ? "bg-[#F0E5C9] text-[#3E332B]" : "bg-[#DDD8CC] text-[#8D877D]"}`}>
                                            {level.level}
                                        </div>

                                        <div className="mt-3">
                                            <p className="text-base font-bold text-[#3E332B]">Level {level.level}</p>
                                            <p className="mt-0.5 text-xs text-[#6B5D4F]">{level.complexity}</p>
                                        </div>

                                        {active && !completed && (
                                            <div className="mt-auto w-full pt-3">
                                                <div className="mb-1.5 flex justify-between text-[10px] font-medium text-[#6B5D4F]">
                                                    <span>Progress</span>
                                                    <span>{roundsAtLevel}/{ROUNDS_TO_COMPLETE}</span>
                                                </div>
                                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E3D8C3]/70">
                                                    <div className="h-full rounded-full bg-[#D9A441] transition-all duration-500" style={{ width: `${progress}%` }} />
                                                </div>
                                            </div>
                                        )}

                                        {!unlocked && (
                                            <p className="mt-auto pt-3 text-[11px] font-medium text-[#8D877D]">
                                                Complete Level {level.level - 1} first
                                            </p>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* =====================================================
          LEVEL COMPLETE
      ===================================================== */}
            {showLevelComplete && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#3E332B]/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-[460px] rounded-[30px] bg-[#FFFDF8] p-6 text-center shadow-2xl sm:p-9">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#E8F0E7] text-4xl">🎉</div>
                        <h2 className="mt-5 text-2xl font-bold sm:text-3xl">Level {completedLevelNumber} Complete!</h2>
                        <p className="mt-3 text-sm leading-relaxed text-[#6B5D4F] sm:text-base">
                            Excellent work! You successfully completed all {ROUNDS_TO_COMPLETE} rounds in this level.
                        </p>

                        {completedLevelNumber < LEVELS.length ? (
                            <>
                                <div className="mt-5 rounded-2xl bg-[#F1F6EF] p-4">
                                    <p className="text-xs text-[#6B5D4F]">New level unlocked</p>
                                    <p className="mt-1 text-xl font-bold text-[#5D855F]">Level {completedLevelNumber + 1}</p>
                                    <p className="mt-1 text-xs text-[#6B5D4F]">{LEVELS[completedLevelNumber].complexity}</p>
                                </div>
                                <button type="button" onClick={goToNextLevel} className="mt-5 w-full rounded-2xl bg-[#6B8F71] px-6 py-3.5 text-lg font-bold text-white shadow-lg transition hover:bg-[#5D805F] active:scale-[0.98]">
                                    Start Level {completedLevelNumber + 1} {" →"}
                                </button>
                                <button type="button" onClick={() => setShowLevelComplete(false)} className="mt-2 w-full px-4 py-2 text-sm text-[#6B5D4F]">
                                    Stay on this level
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="mt-5 rounded-2xl bg-[#F1F6EF] p-5">
                                    <p className="text-xl font-bold text-[#5D855F]">🏆 All Levels Complete!</p>
                                    <p className="mt-2 text-sm text-[#6B5D4F]">You completed all {LEVELS.length} levels. Excellent work!</p>
                                </div>
                                <button type="button" onClick={() => { setShowLevelComplete(false); setShowSummary(true); }} className="mt-5 w-full rounded-2xl bg-[#6B8F71] px-6 py-3.5 text-lg font-bold text-white shadow-lg">
                                    View Final Summary
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* =====================================================
          SUMMARY
      ===================================================== */}
            {showSummary && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#3E332B]/60 p-4 backdrop-blur-sm">
                    <div className="max-h-[90vh] w-full max-w-[500px] overflow-y-auto rounded-[30px] bg-[#FFFDF8] p-6 shadow-2xl sm:p-9">
                        <div className="text-center">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#F1F6EF] text-4xl">🏆</div>
                            <h2 className="mt-5 text-2xl font-bold">Nice work!</h2>
                            <p className="mt-2 text-sm text-[#6B5D4F]">Here's how this session went.</p>
                        </div>
                        <div className="mt-6 space-y-1">
                            <div className="flex justify-between border-b border-dashed border-[#E3D8C3] py-2.5 text-sm"><span>Objects found</span><strong>{found}</strong></div>
                            <div className="flex justify-between border-b border-dashed border-[#E3D8C3] py-2.5 text-sm"><span>Accuracy</span><strong>{accuracy}%</strong></div>
                            <div className="flex justify-between border-b border-dashed border-[#E3D8C3] py-2.5 text-sm"><span>Level reached</span><strong>{currentLevel.level}</strong></div>
                            <div className="flex justify-between border-b border-dashed border-[#E3D8C3] py-2.5 text-sm"><span>Levels completed</span><strong>{completedLevels.length}</strong></div>
                            <div className="flex justify-between border-b border-dashed border-[#E3D8C3] py-2.5 text-sm"><span>Scenes explored</span><strong>{scenesPlayed.length}</strong></div>
                            <div className="flex justify-between border-b border-dashed border-[#E3D8C3] py-2.5 text-sm"><span>Hints used</span><strong>{hintUsedCount}</strong></div>
                            <div className="flex justify-between border-b border-dashed border-[#E3D8C3] py-2.5 text-sm"><span>Engagement score</span><strong>{engagementScore}</strong></div>
                        </div>
                        <button type="button" onClick={playAgain} className="mt-6 w-full rounded-2xl bg-[#6B8F71] px-6 py-3.5 text-lg font-bold text-white shadow-lg transition active:scale-[0.98]">
                            Play again
                        </button>
                        <button type="button" onClick={exportSession} className="mt-3 w-full rounded-xl border border-[#E3D8C3] px-5 py-3 text-sm font-semibold text-[#6B5D4F] transition hover:bg-[#F5EFE0]">
                            Export session data
                        </button>
                        <button type="button" onClick={() => setShowSummary(false)} className="mt-2 w-full px-4 py-2 text-sm text-[#6B5D4F]">
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* =====================================================
          ANIMATION
      ===================================================== */}
            <style>{`
        @keyframes shake {
          0%, 100% { transform: translate(-50%, -50%); }
          20% { transform: translate(calc(-50% - 6px), -50%); }
          40% { transform: translate(calc(-50% + 6px), -50%); }
          60% { transform: translate(calc(-50% - 4px), -50%); }
          80% { transform: translate(calc(-50% + 4px), -50%); }
        }
      `}</style>
        </div>
    );
}