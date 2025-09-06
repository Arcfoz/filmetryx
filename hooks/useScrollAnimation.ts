"use client";

import { useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { useRef, RefObject } from "react";

interface ScrollAnimationOptions {
  offset?: ["start end", "end start"] | ["start start", "end end"] | ["start center", "end center"];
  smooth?: boolean;
}

interface ScrollAnimationReturn {
  ref: RefObject<HTMLDivElement>;
  scrollYProgress: MotionValue<number>;
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
  y: MotionValue<number>;
  x: MotionValue<number>;
}

export function useScrollAnimation(options: ScrollAnimationOptions = {}): ScrollAnimationReturn {
  const { offset = ["start end", "end start"], smooth = true } = options;
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset
  });

  // Create smooth springs for smoother animations
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const smoothProgress = smooth ? useSpring(scrollYProgress, springConfig) : scrollYProgress;

  // Common animation transforms
  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);
  const y = useTransform(smoothProgress, [0, 1], [100, -100]);
  const x = useTransform(smoothProgress, [0, 1], [-50, 50]);

  return {
    ref,
    scrollYProgress: smoothProgress,
    opacity,
    scale,
    y,
    x
  };
}

export function useParallax(distance: number = 50) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return { ref, y: smoothY };
}

export function useScrollOpacity() {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });

  return { ref, opacity: smoothOpacity };
}

export function useScrollScale() {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.1]);
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });

  return { ref, scale: smoothScale };
}