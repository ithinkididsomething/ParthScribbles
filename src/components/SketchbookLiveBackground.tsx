import React, { useEffect, useRef } from 'react';

interface DoodleParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vRot: number;
  color: string;
  type: 'star' | 'spiral' | 'lightning' | 'plane' | 'heart' | 'coin';
  phase: number;
}

export const SketchbookLiveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Track mouse for interactive repulsion/drift
    let mouseX = -1000;
    let mouseY = -1000;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Color palette for sketchbook doodles
    const colors = [
      '#EA580C', // Crayon Orange
      '#2563EB', // Blue Ink
      '#16A34A', // Green Crayon
      '#EAB308', // Yellow Pencil
      '#DB2777', // Punk Pink
      '#78716C', // Soft Graphite
    ];

    const types: DoodleParticle['type'][] = ['star', 'spiral', 'lightning', 'plane', 'heart', 'coin'];

    // Spawn 24 gentle doodle particles
    const particles: DoodleParticle[] = Array.from({ length: 24 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.2 - Math.random() * 0.3,
      size: 14 + Math.random() * 16,
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.015,
      color: colors[Math.floor(Math.random() * colors.length)],
      type: types[Math.floor(Math.random() * types.length)],
      phase: Math.random() * Math.PI * 2,
    }));

    let tick = 0;

    const render = () => {
      tick += 0.015;
      ctx.clearRect(0, 0, width, height);

      // 1. Subtle Paper Texture: notebook ruling lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(28, 25, 23, 0.035)';
      const lineSpacing = 32;
      for (let y = lineSpacing; y < height; y += lineSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Vertical Notebook Margin (classic left hand-drawn red line)
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.08)';
      ctx.beginPath();
      ctx.moveTo(72, 0);
      ctx.lineTo(72, height);
      ctx.stroke();

      // 2. Animate and draw each doodle
      particles.forEach((p) => {
        // Natural floating motion
        p.x += p.vx + Math.sin(tick + p.phase) * 0.25;
        p.y += p.vy;
        p.rotation += p.vRot;

        // Mouse interaction: push away gently if mouse is close
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.hypot(dx, dy);
        if (dist < 140 && dist > 0) {
          const force = (140 - dist) / 140;
          p.x += (dx / dist) * force * 2.2;
          p.y += (dy / dist) * force * 2.2;
        }

        // Screen wrap
        if (p.y < -40) {
          p.y = height + 30;
          p.x = Math.random() * width;
        }
        if (p.x < -40) p.x = width + 30;
        if (p.x > width + 40) p.x = -30;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.strokeStyle = p.color;
        ctx.fillStyle = p.color;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = 0.42;

        const s = p.size;

        if (p.type === 'star') {
          // Hand-drawn 5-pointed star
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const px = Math.cos(angle) * (s * 0.55);
            const py = Math.sin(angle) * (s * 0.55);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
        } else if (p.type === 'spiral') {
          // Doodled spiral
          ctx.beginPath();
          const coils = 2.5;
          for (let t = 0; t < Math.PI * 2 * coils; t += 0.2) {
            const r = (s * 0.45 * t) / (Math.PI * 2 * coils);
            const px = Math.cos(t) * r;
            const py = Math.sin(t) * r;
            if (t === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
        } else if (p.type === 'lightning') {
          // Doodle lightning bolt
          ctx.beginPath();
          ctx.moveTo(-s * 0.15, -s * 0.5);
          ctx.lineTo(-s * 0.35, 0);
          ctx.lineTo(-s * 0.05, 0);
          ctx.lineTo(-s * 0.25, s * 0.5);
          ctx.lineTo(s * 0.35, -s * 0.1);
          ctx.lineTo(s * 0.05, -s * 0.1);
          ctx.closePath();
          ctx.stroke();
        } else if (p.type === 'heart') {
          // Doodled heart
          ctx.beginPath();
          const topCurveHeight = s * 0.3;
          ctx.moveTo(0, topCurveHeight);
          ctx.bezierCurveTo(0, 0, -s * 0.5, 0, -s * 0.5, topCurveHeight);
          ctx.bezierCurveTo(-s * 0.5, s * 0.6, 0, s * 0.8, 0, s);
          ctx.bezierCurveTo(0, s * 0.8, s * 0.5, s * 0.6, s * 0.5, topCurveHeight);
          ctx.bezierCurveTo(s * 0.5, 0, 0, 0, 0, topCurveHeight);
          ctx.stroke();
        } else if (p.type === 'coin') {
          // Doodle retro coin with smiley
          ctx.beginPath();
          ctx.arc(0, 0, s * 0.4, 0, Math.PI * 2);
          ctx.stroke();
          // Eyes
          ctx.beginPath();
          ctx.arc(-s * 0.12, -s * 0.08, 1.5, 0, Math.PI * 2);
          ctx.arc(s * 0.12, -s * 0.08, 1.5, 0, Math.PI * 2);
          ctx.fill();
          // Smile
          ctx.beginPath();
          ctx.arc(0, 0, s * 0.22, 0.2, Math.PI - 0.2);
          ctx.stroke();
        } else if (p.type === 'plane') {
          // Paper airplane doodle
          ctx.beginPath();
          ctx.moveTo(-s * 0.4, s * 0.35);
          ctx.lineTo(0, -s * 0.5);
          ctx.lineTo(s * 0.4, s * 0.35);
          ctx.lineTo(0, s * 0.15);
          ctx.closePath();
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(0, -s * 0.5);
          ctx.lineTo(0, s * 0.15);
          ctx.stroke();
        }

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
    />
  );
};
