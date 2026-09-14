import React, { useRef, useEffect } from 'react';

export default function GreenScreenVideo({ src, className, width = 250, height = 250 }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const rafId = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const processFrame = () => {
      if (video.paused || video.ended) {
        rafId.current = requestAnimationFrame(processFrame);
        return;
      }

      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Get image data
      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const l = frame.data.length / 4;

      // Basic Chroma Key (Green Screen removal)
      for (let i = 0; i < l; i++) {
        const r = frame.data[i * 4 + 0];
        const g = frame.data[i * 4 + 1];
        const b = frame.data[i * 4 + 2];

        // If the pixel is very green, make it transparent
        // These thresholds might need tweaking depending on the exact shade of green
        if (g > 100 && g > r * 1.4 && g > b * 1.4) {
          // It's a green pixel
          // We can feather the edge based on how dominant the green is
          const dominantGreen = g - Math.max(r, b);
          
          if (dominantGreen > 40) {
            frame.data[i * 4 + 3] = 0; // Fully transparent
          } else {
            // Partial transparency for edge feathering
            const alpha = 255 - ((dominantGreen / 40) * 255);
            frame.data[i * 4 + 3] = alpha;
          }
        }
      }

      ctx.putImageData(frame, 0, 0);
      rafId.current = requestAnimationFrame(processFrame);
    };

    video.addEventListener('play', () => {
      rafId.current = requestAnimationFrame(processFrame);
    });

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div className={className} style={{ width, height, position: 'relative' }}>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        style={{ display: 'none' }} // Hide actual video
        crossOrigin="anonymous"
      />
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </div>
  );
}
