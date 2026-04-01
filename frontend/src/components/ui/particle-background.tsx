import React, { useEffect, useRef } from "react";

interface ParticleBackgroundProps {
  className?: string;
}

class Particle {
  x: number;
  y: number;
  directionX: number;
  directionY: number;
  size: number;
  color: string;

  constructor(x: number, y: number, directionX: number, directionY: number, size: number, color: string) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, mouse: { x: number | null; y: number | null; radius: number }) {
    if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
    if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < mouse.radius + this.size) {
        const forceX = dx / distance;
        const forceY = dy / distance;
        const force = (mouse.radius - distance) / mouse.radius;
        this.x -= forceX * force * 4;
        this.y -= forceY * force * 4;
      }
    }

    this.x += this.directionX;
    this.y += this.directionY;
    this.draw(ctx);
  }
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const mouse = { x: null as number | null, y: null as number | null, radius: 180 };

    const colors = [
      "rgba(140, 180, 255, 0.9)",
      "rgba(180, 210, 255, 0.8)",
      "rgba(200, 220, 255, 0.85)",
      "rgba(160, 195, 255, 0.75)",
    ];

    function init() {
      particles = [];
      const count = (canvas!.width * canvas!.height) / 10000;
      for (let i = 0; i < count; i++) {
        const size = Math.random() * 2.2 + 0.8;
        const x = Math.random() * (canvas!.width - size * 4) + size * 2;
        const y = Math.random() * (canvas!.height - size * 4) + size * 2;
        const dirX = (Math.random() * 0.3) - 0.15;
        const dirY = (Math.random() * 0.3) - 0.15;
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push(new Particle(x, y, dirX, dirY, size, color));
      }
    }

    function connect() {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distSq = dx * dx + dy * dy;
          const maxDist = (canvas!.width / 8) * (canvas!.height / 8);

          if (distSq < maxDist) {
            const opacity = 1 - distSq / maxDist;

            // Glow brighter near cursor
            if (mouse.x !== null && mouse.y !== null) {
              const mx = particles[a].x - mouse.x;
              const my = particles[a].y - mouse.y;
              const mDist = Math.sqrt(mx * mx + my * my);
              if (mDist < mouse.radius) {
                ctx!.strokeStyle = `rgba(200, 220, 255, ${opacity * 0.9})`;
              } else {
                ctx!.strokeStyle = `rgba(140, 180, 255, ${opacity * 0.45})`;
              }
            } else {
              ctx!.strokeStyle = `rgba(140, 180, 255, ${opacity * 0.45})`;
            }

            ctx!.lineWidth = 0.8;
            ctx!.beginPath();
            ctx!.moveTo(particles[a].x, particles[a].y);
            ctx!.lineTo(particles[b].x, particles[b].y);
            ctx!.stroke();
          }
        }
      }
    }

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      for (const p of particles) {
        p.update(canvas!, ctx!, mouse);
      }
      connect();
    }

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      init();
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseOut = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseOut);

    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed top-0 left-0 w-full h-full pointer-events-none z-0 ${className || ""}`}
    />
  );
};

export default ParticleBackground;
