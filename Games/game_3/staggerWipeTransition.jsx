import React, { useCallback, useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ *
 * useStaggerTransition
 *
 * Drives a two-phase "curtain wipe":
 *   1. COVER   - columns sweep down over the current content, each
 *                column delayed slightly more than the last (left -> right)
 *   2. REVEAL  - once fully covered, the caller swaps content, then the
 *                columns shrink back up (same left -> right stagger),
 *                uncovering the new content underneath
 *
 * It only tracks timing/phase - it doesn't know about colors or content,
 * so you can reuse it for any curtain-style transition.
 * ------------------------------------------------------------------ */
function useStaggerTransition({
    columns,
    coverMs,
    coverStagger,
    hold,
    revealMs,
    revealStagger,
}) {
    const [phase, setPhase] = useState("idle"); // "idle" | "covering" | "revealing"
    const timers = useRef([]);

    useEffect(() => {
        return () => timers.current.forEach(clearTimeout);
    }, []);

    const run = useCallback(
        (onCovered) => {
            if (phase !== "idle") return false; // ignore taps mid-transition

            const coverTotal = (columns - 1) * coverStagger + coverMs;
            const revealTotal = (columns - 1) * revealStagger + revealMs;

            setPhase("covering");

            timers.current.push(
                setTimeout(() => {
                    onCovered(); // swap the real content while fully covered
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

/* ------------------------------------------------------------------ *
 * StaggerCurtain
 *
 * Renders the columns and animates them with plain CSS transitions:
 *  - covering: transform-origin TOP,    scaleY 0 -> 1  (grows downward)
 *  - revealing: transform-origin BOTTOM, scaleY 1 -> 0  (shrinks upward)
 * Changing the origin doesn't itself animate, so flipping it between
 * phases is free - only the scaleY transition costs anything.
 * ------------------------------------------------------------------ */
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
        <div className="curtain" aria-hidden="true">
            {Array.from({ length: columns }).map((_, i) => (
                <div
                    key={i}
                    className="curtain-col"
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

/* ------------------------------------------------------------------ *
 * Demo
 * ------------------------------------------------------------------ */
const PAGES = [
    { id: "wipe", label: "Stagger wipe", title: "Stagger\nwipe", accent: "#A9B2F7" },
    { id: "studio", label: "Studio", title: "Studio", accent: "#F0B93E" },
    { id: "archive", label: "Archive", title: "Archive", accent: "#F15C79" },
];

const CONFIG = {
    columns: 10,
    coverMs: 420,
    coverStagger: 40,
    hold: 120,
    revealMs: 420,
    revealStagger: 40,
};

export default function StaggerWipeDemo() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [curtainColor, setCurtainColor] = useState(PAGES[0].accent);
    const { phase, run } = useStaggerTransition(CONFIG);

    const goTo = (index) => {
        if (index === activeIndex) return;
        setCurtainColor(PAGES[index].accent);
        run(() => setActiveIndex(index));
    };

    const page = PAGES[activeIndex];
    const num = (n) => String(n).padStart(2, "0");

    return (
        <div className="wrap">
            <style>{`
        .wrap {
          background: #0a0a0c;
          border: 1px solid #1e1e22;
          border-radius: 12px;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
          color: #e8e8ec;
          max-width: 720px;
          margin: 0 auto;
          overflow: hidden;
        }
        .stage {
          position: relative;
          height: 340px;
          overflow: hidden;
          padding: 32px;
          box-sizing: border-box;
        }
        .stage-content {
          position: relative;
          z-index: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .page-label {
          font-size: 13px;
          color: ${page.accent};
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        }
        .page-title {
          font-size: clamp(40px, 8vw, 72px);
          font-weight: 700;
          line-height: 0.95;
          color: ${page.accent};
          white-space: pre-line;
          margin: 0;
        }
        .page-index {
          font-size: 13px;
          color: #6b6b74;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        }
        .curtain {
          position: absolute;
          inset: 0;
          display: flex;
          z-index: 2;
          pointer-events: none;
        }
        .curtain-col {
          flex: 1;
          height: 100%;
          transition-property: transform;
          transition-timing-function: cubic-bezier(.76, 0, .24, 1);
        }
        .nav {
          display: flex;
          gap: 8px;
          padding: 16px 20px;
          border-top: 1px solid #1e1e22;
        }
        .nav button {
          flex: 1;
          padding: 10px 12px;
          border-radius: 6px;
          border: 1px solid #2a2a30;
          background: transparent;
          color: #cfcfd6;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .nav button:disabled { cursor: default; }
        .nav button.active {
          color: #0a0a0c;
        }
      `}</style>

            <div className="stage">
                <StaggerCurtain phase={phase} color={curtainColor} {...CONFIG} />
                <div className="stage-content">
                    <span className="page-label">PAGE {num(activeIndex + 1)}</span>
                    <h1 className="page-title">{page.title}</h1>
                    <span className="page-index">
                        {num(activeIndex + 1)} / {num(PAGES.length)}
                    </span>
                </div>
            </div>

            <nav className="nav">
                {PAGES.map((p, i) => (
                    <button
                        key={p.id}
                        className={i === activeIndex ? "active" : ""}
                        style={i === activeIndex ? { background: p.accent, borderColor: p.accent } : undefined}
                        disabled={phase !== "idle"}
                        onClick={() => goTo(i)}
                    >
                        {p.label}
                    </button>
                ))}
            </nav>
        </div>
    );
}
