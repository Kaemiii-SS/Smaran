import { useRef, useLayoutEffect, useMemo } from "react";

// ============================================================
// CONSTANTS
// ============================================================

export const VIEW_W = 640;
export const VIEW_H = 880; // Increased to ensure all bottom nodes remain fully visible

// Scattered constellation points.
// Designed for a tall mobile screen.
export const POINTS = [
    [70, 100],
    [250, 70],
    [430, 120],
    [570, 80],

    [120, 220],
    [310, 190],
    [500, 250],

    [60, 350],
    [220, 330],
    [390, 370],
    [570, 350],

    [120, 500],
    [300, 470],
    [470, 520],

    [70, 650],
    [250, 610],
    [410, 680],
    [570, 620],

    [180, 760],
    [360, 740],
    [520, 770],
];

export const COLORS = {
    bg0: "#03050c",
    bg1: "#070b18",

    glass: "rgba(255,255,255,0.035)",
    glassBorder: "rgba(255,255,255,0.09)",

    ink0: "#eef0fb",
    ink1: "#9aa1c4",

    node: "#c9d2ff",
    nodeDim: "#4c5378",

    gold: "#f2c879",
    err: "#e28b8b",
};

// ============================================================
// DISTANCE
// ============================================================

export function dist(a, b) {
    return Math.hypot(
        POINTS[a][0] - POINTS[b][0],
        POINTS[a][1] - POINTS[b][1]
    );
}

// ============================================================
// GENERATE RANDOM SEQUENCE
// ============================================================

export function pickSequence(len) {
    const pool = POINTS.map((_, i) => i);
    const seq = [];
    let last = -1;

    for (let k = 0; k < len; k++) {
        let choices = pool.filter(
            (i) =>
                i !== last &&
                !(
                    seq.length &&
                    dist(i, seq[seq.length - 1]) < 55
                )
        );

        if (!choices.length) {
            choices = pool.filter(
                (i) => i !== last
            );
        }

        const pick =
            choices[
            Math.floor(
                Math.random() * choices.length
            )
            ];

        seq.push(pick);
        last = pick;
    }

    return seq;
}

// ============================================================
// SVG PATH
// ============================================================

export function pathD(from, to) {
    const [x1, y1] = POINTS[from];
    const [x2, y2] = POINTS[to];
    return `M${x1} ${y1} L${x2} ${y2}`;
}

// ============================================================
// SLEEP
// ============================================================

export function sleep(ms, reduceMotion) {
    return new Promise((resolve) =>
        setTimeout(
            resolve,
            reduceMotion ? 0 : ms
        )
    );
}

// ============================================================
// ANIMATED THREAD
// ============================================================

export function Thread({
    from,
    to,
    tone = "live",
}) {
    const ref = useRef(null);

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;

        const len = el.getTotalLength();
        el.style.strokeDasharray = String(len);
        el.style.strokeDashoffset = String(len);

        // Force browser reflow
        el.getBoundingClientRect();

        el.style.transition =
            "stroke-dashoffset 0.55s ease, opacity 0.5s ease";

        requestAnimationFrame(() => {
            el.style.strokeDashoffset = "0";
        });
    }, [from, to]);

    return (
        <path
            ref={ref}
            d={pathD(from, to)}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            stroke={
                tone === "bad"
                    ? COLORS.err
                    : "url(#threadGrad)"
            }
            filter="url(#softGlow)"
        />
    );
}

// ============================================================
// STAR FIELD
// ============================================================

export function Starfield() {
    const dust = useMemo(
        () =>
            Array.from(
                { length: 110 },
                () => ({
                    left: Math.random() * 100,
                    top: Math.random() * 100,
                    size: Math.random() * 1.7 + 0.5,
                    delay: Math.random() * 4,
                    duration: Math.random() * 4 + 3,
                    opacity: Math.random() * 0.45 + 0.1,
                })
            ),
        []
    );

    return (
        <div
            className="
                fixed
                inset-0
                z-0
                pointer-events-none
                overflow-hidden
            "
        >
            <style>{`
                @keyframes smaranTwinkle {
                    0%, 100% {
                        opacity: var(--opacity);
                    }
                    50% {
                        opacity: calc(
                            var(--opacity) * 0.2
                        );
                    }
                }
            `}</style>

            {dust.map((star, i) => (
                <span
                    key={i}
                    className="
                        absolute
                        rounded-full
                    "
                    style={{
                        left: `${star.left}%`,
                        top: `${star.top}%`,
                        width: star.size,
                        height: star.size,
                        background: "#e6ebff",
                        "--opacity": star.opacity,
                        opacity: star.opacity,
                        animation: `smaranTwinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
                    }}
                />
            ))}
        </div>
    );
}
