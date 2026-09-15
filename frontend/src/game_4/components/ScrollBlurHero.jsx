import React, { useCallback, useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ *
 * ScrollBlurHero
 *
 * A full-bleed hero (image + title + optional subtitle) that, as it
 * scrolls out of view:
 *   - blurs and dims the image + text together
 *   - scales the image up slightly (subtle ken-burns push)
 *   - shrinks the hero's own height down to `shrinkTo` of its start
 *     height, like a collapsing header
 *
 * Progress (0 -> 1) is scrollTop (of the nearest [data-scroll-container],
 * or window.scrollY when there isn't one) divided by the section's
 * height *at mount* - frozen in a ref so the shrinking height doesn't
 * feed back into its own denominator mid-scroll.
 *
 * Props:
 *   title        - headline text
 *   subtitle     - optional line/paragraph shown below the title
 *   imageSrc     - background image URL (or a data: URL from a file)
 *   height       - starting CSS height, default "100vh"
 *   shrinkTo     - fraction of the starting height to collapse to (0-1)
 *   maxBlur      - blur in px reached once fully scrolled past
 *   maxDim       - how much darker (0-1) it gets at full scroll
 * ------------------------------------------------------------------ */
export function ScrollBlurHero({
  title = "PRAGUE",
  subtitle = "",
  imageSrc,
  height = "100vh",
  shrinkTo = 0.45,
  maxBlur = 18,
  maxDim = 0.55,
}) {
  const sectionRef = useRef(null);
  const frameRef = useRef(null);
  const fullHeightRef = useRef(null);
  const startTopRef = useRef(null); // absolute doc position, only used for window-scroll case
  const [progress, setProgress] = useState(0);
  const [fullHeight, setFullHeight] = useState(null);

  const measure = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;
    const scroller = el.closest("[data-scroll-container]");

    // Freeze the starting height the first time we measure, so the
    // hero shrinking doesn't change the denominator mid-scroll.
    if (fullHeightRef.current == null) {
      fullHeightRef.current = el.getBoundingClientRect().height;
      setFullHeight(fullHeightRef.current);
    }

    // Track how far we've scrolled using scrollTop directly instead of
    // viewport-relative rect.top - rect.top gets confusing once the
    // section lives inside its own overflow:auto container, since it's
    // relative to the browser viewport, not that container.
    let scrolled;
    if (scroller) {
      scrolled = scroller.scrollTop;
    } else {
      if (startTopRef.current == null) {
        startTopRef.current = el.getBoundingClientRect().top + window.scrollY;
      }
      scrolled = window.scrollY - startTopRef.current;
    }

    const p = scrolled / fullHeightRef.current;
    setProgress(Math.min(1, Math.max(0, p)));
  }, []);

  useEffect(() => {
    const scroller = sectionRef.current?.closest("[data-scroll-container]") || window;

    const onScroll = () => {
      if (frameRef.current) return;
      frameRef.current = requestAnimationFrame(() => {
        measure();
        frameRef.current = null;
      });
    };

    measure();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [measure]);

  const blur = progress * maxBlur;
  const brightness = 1 - progress * maxDim;
  const scale = 1 + progress * 0.06;

  const collapsedHeight = fullHeight != null ? fullHeight * shrinkTo : null;
  const currentHeightPx =
    fullHeight != null ? fullHeight - (fullHeight - collapsedHeight) * progress : null;

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        height: currentHeightPx != null ? `${currentHeightPx}px` : height,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: imageSrc
            ? `url(${imageSrc})`
            : "linear-gradient(160deg, #1b1f2a 0%, #0a0c10 60%, #05070a 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: `blur(${blur}px) brightness(${brightness})`,
          transform: `scale(${scale})`,
          transformOrigin: "center",
          willChange: "filter, transform",
        }}
      />
      <h1
        style={{
          position: "relative",
          margin: 0,
          padding: "0 24px",
          textAlign: "center",
          color: "var(--color-text-dark)",
          fontFamily: "var(--font-mono), ui-sans-serif, system-ui, Segoe UI, Roboto, sans-serif",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          lineHeight: 0.95,
          fontSize: "clamp(32px, 9vw, 110px)",
          filter: `blur(${blur}px) brightness(${brightness})`,
          willChange: "filter, transform",
        }}
      >
        {title}
      </h1>
      {subtitle ? (
        <p
          style={{
            position: "relative",
            margin: "14px 0 0",
            padding: "0 24px",
            maxWidth: 560,
            textAlign: "center",
            color: "var(--color-ghibli-navy)",
            fontFamily: "var(--font-mono), ui-sans-serif, system-ui, Segoe UI, Roboto, sans-serif",
            fontSize: "clamp(13px, 1.6vw, 17px)",
            fontWeight: 600,
            lineHeight: 1.5,
            filter: `blur(${blur}px) brightness(${brightness})`,
            willChange: "filter, transform",
          }}
        >
          {subtitle}
        </p>
      ) : null}
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Demo - editable title, subtitle, and background image, inside a
 * self-contained scroll area so the effect is visible immediately.
 * ------------------------------------------------------------------ */
export default function ScrollBlurHeroDemo() {
  const [title, setTitle] = useState("PRAGUE");
  const [subtitle, setSubtitle] = useState("A city of a thousand spires, best seen after dark.");
  const [imageSrc, setImageSrc] = useState(null);
  const [urlDraft, setUrlDraft] = useState("");
  const fileInputRef = useRef(null);

  const applyUrl = () => {
    if (urlDraft.trim()) setImageSrc(urlDraft.trim());
  };

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="wrap">
      <style>{`
        .wrap {
          background: #0a0a0c;
          border: 1px solid #1e1e22;
          border-radius: 12px;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
          color: #e8e8ec;
          max-width: 760px;
          margin: 0 auto;
          overflow: hidden;
        }
        .controls {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 14px 16px;
          border-bottom: 1px solid #1e1e22;
        }
        .controls input[type="text"],
        .controls textarea {
          background: #101013;
          border: 1px solid #2a2a30;
          border-radius: 6px;
          color: #e8e8ec;
          padding: 8px 10px;
          font-size: 13px;
          outline: none;
          font-family: inherit;
        }
        .controls input[type="text"]:focus,
        .controls textarea:focus { border-color: #4a4a54; }
        .title-input { width: 140px; }
        .subtitle-input { flex: 1 1 220px; resize: none; height: 34px; }
        .url-input { flex: 1; min-width: 160px; }
        .controls button {
          background: #16161a;
          border: 1px solid #2a2a30;
          color: #e8e8ec;
          border-radius: 6px;
          padding: 8px 12px;
          font-size: 13px;
          cursor: pointer;
        }
        .controls button:hover { background: #1c1c21; }
        .row { display: flex; flex-wrap: wrap; gap: 8px; width: 100%; }
        .scroll-area {
          height: 420px;
          overflow-y: auto;
          scroll-behavior: smooth;
        }
        .next-section {
          min-height: 420px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0f1410;
          color: #8fa89a;
          font-size: 14px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        }
      `}</style>

      <div className="controls">
        <div className="row">
          <input
            className="title-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
          <textarea
            className="subtitle-input"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Subtitle text below the title..."
          />
        </div>
        <div className="row">
          <input
            className="url-input"
            type="text"
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyUrl()}
            placeholder="Paste an image URL..."
          />
          <button onClick={applyUrl}>Use URL</button>
          <button onClick={() => fileInputRef.current.click()}>Upload image</button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFile}
            style={{ display: "none" }}
          />
        </div>
      </div>

      <div className="scroll-area" data-scroll-container>
        <ScrollBlurHero title={title} subtitle={subtitle} imageSrc={imageSrc} height="420px" />
        <div className="next-section">scroll past the hero to see it shrink and blur out ↑</div>
      </div>
    </div>
  );
}
