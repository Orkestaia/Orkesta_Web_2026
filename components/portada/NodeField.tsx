"use client";

import { useEffect, useRef } from "react";

/**
 * Campo de nodos en canvas 2D nativo — brief §5b.3. Sin librerías.
 * ~120 nodos que derivan lentamente, líneas entre los cercanos y reacción
 * suave al ratón. Es el fallback del orkestador 3D (spec §6.5) construido
 * antes de tiempo: en F4 el 3D se monta encima y esto queda de respaldo.
 *
 * Los gates (reduced-motion, saveData, <768px) viven en NodeFieldGate.
 * Aquí: pausa fuera de viewport y con document.hidden, y limitación a
 * 30 fps si el frame medio de los primeros 60 supera 22 ms.
 */

const N = 120;
const LINK_DIST = 130;
const MOUSE_DIST = 160;

export default function NodeField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = true;
    let last = 0;
    // medición de los primeros 60 frames → cap a 30 fps si va justo
    let frameCount = 0;
    let frameAccum = 0;
    let minFrameMs = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

    const nodes = Array.from({ length: N }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00016,
      vy: (Math.random() - 0.5) * 0.00016,
    }));

    const mouse = { x: -1e4, y: -1e4 };

    function resize() {
      w = canvas!.clientWidth;
      h = canvas!.clientHeight;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function frame(t: number) {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      const dt = last ? t - last : 16;
      if (minFrameMs && dt < minFrameMs) return; // cap 30 fps
      if (frameCount < 60) {
        frameAccum += dt;
        frameCount++;
        if (frameCount === 60 && frameAccum / 60 > 22) minFrameMs = 30;
      }
      last = t;

      ctx!.clearRect(0, 0, w, h);
      ctx!.globalCompositeOperation = "lighter";

      // deriva + reacción suave al ratón
      for (const n of nodes) {
        n.x += n.vx * dt;
        n.y += n.vy * dt;
        if (n.x < 0 || n.x > 1) n.vx *= -1;
        if (n.y < 0 || n.y > 1) n.vy *= -1;
        const dx = n.x * w - mouse.x;
        const dy = n.y * h - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < MOUSE_DIST * MOUSE_DIST && d2 > 1) {
          const f = 0.0000004 * dt;
          n.x += (dx / Math.sqrt(d2)) * f * (MOUSE_DIST - Math.sqrt(d2));
          n.y += (dy / Math.sqrt(d2)) * f * (MOUSE_DIST - Math.sqrt(d2));
        }
      }

      // líneas: violeta al 15%
      ctx!.strokeStyle = "rgba(138, 43, 226, 0.15)";
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const ax = nodes[i].x * w;
          const ay = nodes[i].y * h;
          const bx = nodes[j].x * w;
          const by = nodes[j].y * h;
          const dx = ax - bx;
          const dy = ay - by;
          if (dx * dx + dy * dy < LINK_DIST * LINK_DIST) {
            ctx!.moveTo(ax, ay);
            ctx!.lineTo(bx, by);
          }
        }
      }
      ctx!.stroke();

      // nodos: cyan al 40%
      ctx!.fillStyle = "rgba(0, 180, 216, 0.4)";
      for (const n of nodes) {
        ctx!.beginPath();
        ctx!.arc(n.x * w, n.y * h, 1.6, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function start() {
      if (!running) {
        running = true;
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    function onMouse(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    function onVisibility() {
      if (document.hidden) stop();
      else start();
    }

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    });

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouse, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    io.observe(canvas);
    running = false;
    start();

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
