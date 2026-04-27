'use client';
import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
};

const NUM_PARTICLES = 60;
const TWO_PI = Math.PI * 2;

export default function CanvasParticles({
  className = 'fixed inset-0 z-[-1]',
}: {
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number>(0);
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const setCanvasSize = () => {
      const { innerWidth, innerHeight } = window;
      canvas.width = innerWidth;
      canvas.height = innerHeight;
      return { width: innerWidth, height: innerHeight };
    };

    let { width, height } = setCanvasSize();
    const particles: Particle[] = [];

    const createParticles = () => {
      particles.length = 0;
      for (
        let particleIndex = 0;
        particleIndex < NUM_PARTICLES;
        particleIndex++
      ) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
    };

    createParticles();

    const currentTheme = resolvedTheme || theme;
    const particleColor =
      currentTheme === 'light' ? '0, 0, 0' : '255, 255, 255';

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (
        let particleIndex = 0;
        particleIndex < particles.length;
        particleIndex++
      ) {
        const particle = particles?.[particleIndex];
        if (!particle) continue;

        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0) {
          particle.x = 0;
          particle.vx *= -1;
        } else if (particle.x > width) {
          particle.x = width;
          particle.vx *= -1;
        }

        if (particle.y < 0) {
          particle.y = 0;
          particle.vy *= -1;
        } else if (particle.y > height) {
          particle.y = height;
          particle.vy *= -1;
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, TWO_PI);
        ctx.fillStyle = `rgba(${particleColor}, ${particle.opacity})`;
        ctx.fill();
      }

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animationIdRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      const dimensions = setCanvasSize();
      width = dimensions.width;
      height = dimensions.height;
      createParticles();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationIdRef.current);
    };
  }, [theme, resolvedTheme]);

  return <canvas ref={canvasRef} className={cn(className)} />;
}
