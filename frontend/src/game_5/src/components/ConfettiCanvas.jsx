import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef
} from "react";
import ReactDOM from "react-dom";
const COLORS = ["#FF4D8D", "#FF9F40", "#2DD4FF", "#6EE7A8", "#FFE066", "#B18CFF"];
function makeParticle(x, y, { startVelocity, spread, gravity }) {
  const angleDeg = 90 + (Math.random() - 0.5) * spread;
  const angle = angleDeg * Math.PI / 180;
  const speed = startVelocity * (0.6 + Math.random() * 0.4) * 10;
  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: -Math.sin(angle) * speed,
    gravity: gravity * 800,
    // px/s^2
    color: COLORS[Math.random() * COLORS.length | 0],
    shape: Math.random() < 0.5 ? "rect" : "circle",
    size: 4 + Math.random() * 5,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 10,
    age: 0
  };
}
const ConfettiCanvas = forwardRef(function ConfettiCanvas2(_props, ref) {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const rafRef = useRef(null);
  const lastTime = useRef(0);
  const decayRef = useRef(1);
  const durationRef = useRef(3);
  useImperativeHandle(ref, () => ({
    burst(x, y, opts = {}) {
      const {
        particleCount = 100,
        startVelocity = 30,
        spread = 360,
        gravity = 1,
        decay = 0.94,
        duration = 4
      } = opts;
      decayRef.current = decay;
      durationRef.current = duration;
      for (let i = 0; i < particleCount; i++) {
        particles.current.push(makeParticle(x, y, { startVelocity, spread, gravity }));
      }
      if (rafRef.current == null) {
        lastTime.current = performance.now();
        rafRef.current = requestAnimationFrame(tick);
      }
    }
  }));
  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);
  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [resize]);
  function tick(now) {
    const dt = Math.min((now - lastTime.current) / 1e3, 0.05);
    lastTime.current = now;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const decay = decayRef.current;
    const duration = durationRef.current;
    const damp = Math.pow(decay, dt * 60);
    particles.current = particles.current.filter((p) => {
      p.age += dt;
      const alpha = 1 - p.age / duration;
      if (alpha <= 0 || p.y > canvas.height + 40) return false;
      p.vx *= damp;
      p.vy = p.vy * damp + p.gravity * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rotation += p.rotationSpeed * dt;
      ctx.save();
      ctx.globalAlpha = Math.max(alpha, 0);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      if (p.shape === "rect") {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2.4);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      return true;
    });
    if (particles.current.length > 0) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      rafRef.current = null;
    }
  }
  if (typeof document === "undefined") return null;
  return ReactDOM.createPortal(
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[9999]"
    />,
    document.body
  );
});
export {
  ConfettiCanvas
};
