"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useIsPresent, useMotionValue, useReducedMotion, useSpring, useScroll } from "framer-motion";
import { Pause, Play } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;
const AmbientContext = createContext({ paused: false, toggle: () => {} });

export function MotionExperience({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false);
  return <AmbientContext.Provider value={{ paused, toggle: () => setPaused(value => !value) }}>{children}</AmbientContext.Provider>;
}

function useAmbientActivity<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const { paused } = useContext(AmbientContext);
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [foreground, setForeground] = useState(true);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (ref.current) observer.observe(ref.current);
    const update = () => setForeground(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, []);
  return { ref, active: visible && foreground && !paused && !reduced, reduced };
}

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  return <motion.div className="reading-progress" aria-hidden="true" style={{ scaleX: scrollYProgress }} />;
}

export function HeroParticles() {
  const { ref, active } = useAmbientActivity<HTMLDivElement>();
  const canvas = useRef<HTMLCanvasElement>(null);
  const elapsed = useRef(0);
  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context || !ref.current) return;
    let width = 0, height = 0, frame = 0, last = 0;
    const dots = Array.from({ length: 28 }, (_, i) => ({ x: ((i * 37 + 11) % 101) / 101, y: ((i * 61 + 19) % 103) / 103, phase: i * 1.7 }));
    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      const count = width < 768 ? 10 : dots.length;
      const points = dots.slice(0, count).map(dot => ({ x: dot.x * width + Math.sin(time / 9000 + dot.phase) * 14, y: dot.y * height + Math.cos(time / 11000 + dot.phase) * 18 }));
      context.fillStyle = "rgba(4,52,44,.24)";
      points.forEach((point, index) => {
        context.beginPath(); context.arc(point.x, point.y, index % 3 === 0 ? 2 : 1.2, 0, Math.PI * 2); context.fill();
        points.slice(index + 1).forEach(other => {
          const distance = Math.hypot(point.x - other.x, point.y - other.y);
          if (distance > 135) return;
          context.strokeStyle = `rgba(4,52,44,${0.1 * (1 - distance / 135)})`;
          context.beginPath(); context.moveTo(point.x, point.y); context.lineTo(other.x, other.y); context.stroke();
        });
      });
    };
    const resize = () => {
      const rect = element.getBoundingClientRect(); width = rect.width; height = rect.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      element.width = Math.round(width * ratio); element.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0); draw(elapsed.current);
    };
    const observer = new ResizeObserver(resize); observer.observe(ref.current); resize();
    const tick = (time: number) => {
      if (!last) last = time;
      if (time - last >= 32) { elapsed.current += Math.min(time - last, 64); draw(elapsed.current); last = time; }
      frame = requestAnimationFrame(tick);
    };
    if (active) frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [active, ref]);
  return <div ref={ref} className="hero-particles" aria-hidden="true"><canvas ref={canvas} /></div>;
}

export function HeroVisual({ children }: { children: ReactNode }) {
  const { ref, active } = useAmbientActivity<HTMLDivElement>();
  const x = useMotionValue(0), y = useMotionValue(0);
  const rotateX = useSpring(x, { stiffness: 100, damping: 24 });
  const rotateY = useSpring(y, { stiffness: 100, damping: 24 });
  useEffect(() => { if (!active) { x.set(0); y.set(0); } }, [active, x, y]);
  return <div ref={ref} className="hero-visual" data-ambient-active={active} onPointerMove={event => {
    if (!active || event.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(-((event.clientY - rect.top) / rect.height - 0.5) * 5);
    y.set(((event.clientX - rect.left) / rect.width - 0.5) * 5);
  }} onPointerLeave={() => { x.set(0); y.set(0); }}><motion.div className="hero-tilt" style={{ rotateX, rotateY }}><div className="hero-float">{children}</div></motion.div></div>;
}

export function ExpertiseMarquee({ children }: { children: ReactNode }) {
  const { ref, active, reduced } = useAmbientActivity<HTMLDivElement>();
  const { paused, toggle } = useContext(AmbientContext);
  return <div ref={ref} className="expertise-strip motion-marquee" data-ambient-active={active}>
    <div className="marquee-window"><div className="marquee-track"><div className="marquee-copy">{children}</div><div className="marquee-copy marquee-duplicate" aria-hidden="true">{children}</div></div></div>
    <button type="button" className="ambient-toggle" onClick={toggle} aria-pressed={paused || !!reduced} disabled={!!reduced} aria-label={reduced ? "已依系統偏好減少動態" : paused ? "播放背景動態與跑馬燈" : "暫停背景動態與跑馬燈"}>{paused || reduced ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}<span>{reduced ? "減少動態" : paused ? "播放動態" : "暫停動態"}</span></button>
  </div>;
}

function SwapFrame({ children, onEntered }: { children: ReactNode; onEntered?: () => void }) {
  const present = useIsPresent();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.toggleAttribute("inert", !present); }, [present]);
  return <motion.div ref={ref} aria-hidden={!present || undefined} initial={{ opacity: 0, y: reduced ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -4 }} transition={{ duration: reduced ? 0 : 0.22, ease }} onAnimationComplete={() => { if (present) onEntered?.(); }}>{children}</motion.div>;
}

export function AnimatedSwap({ stateKey, children, onEntered }: { stateKey: string; children: ReactNode; onEntered?: () => void }) {
  return <AnimatePresence mode="wait" initial={false}><SwapFrame key={stateKey} onEntered={onEntered}>{children}</SwapFrame></AnimatePresence>;
}

export function AccordionPanel({ open, id, labelledBy, children }: { open: boolean; id: string; labelledBy: string; children: ReactNode }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.toggleAttribute("inert", !open); }, [open]);
  return <motion.div ref={ref} id={id} role="region" aria-labelledby={labelledBy} aria-hidden={!open} initial={false} animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }} transition={{ duration: reduced ? 0 : 0.28, ease }} className="accordion-panel"><div className="accordion-content">{children}</div></motion.div>;
}

export function PresenceAside({ children, className, label }: { children: ReactNode; className: string; label: string }) {
  const present = useIsPresent();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  useEffect(() => { ref.current?.toggleAttribute("inert", !present); }, [present]);
  return <motion.aside ref={ref} className={className} aria-label={label} aria-hidden={!present || undefined} initial={{ opacity: 0, y: reduced ? 0 : 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : 12 }} transition={{ duration: reduced ? 0 : 0.22, ease }}>{children}</motion.aside>;
}
