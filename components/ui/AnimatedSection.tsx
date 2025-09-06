"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: "fade" | "slide-up" | "slide-down" | "slide-left" | "slide-right" | "scale" | "bounce";
  delay?: number;
  duration?: number;
  stagger?: boolean;
  staggerDelay?: number;
  once?: boolean;
}

export function AnimatedSection({
  children,
  className = "",
  animation = "fade",
  delay = 0,
  duration = 0.6,
  stagger = false,
  staggerDelay = 0.1,
  once = true
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { 
    once,
    margin: "-50px 0px"
  });

  const getAnimations = () => {
    switch (animation) {
      case "slide-up":
        return {
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 }
        };
      case "slide-down":
        return {
          hidden: { opacity: 0, y: -50 },
          visible: { opacity: 1, y: 0 }
        };
      case "slide-left":
        return {
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0 }
        };
      case "slide-right":
        return {
          hidden: { opacity: 0, x: 50 },
          visible: { opacity: 1, x: 0 }
        };
      case "scale":
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1 }
        };
      case "bounce":
        return {
          hidden: { opacity: 0, y: 50, scale: 0.8 },
          visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1
          }
        };
      case "fade":
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        };
    }
  };

  const itemVariants = getAnimations();

  const containerVariants = stagger ? {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay
      }
    }
  } : itemVariants;

  const getTransition = () => {
    if (animation === "bounce") {
      return {
        type: "spring",
        bounce: 0.4,
        duration: duration * 1.2
      };
    }
    return {
      duration,
      delay: stagger ? 0 : delay,
      ease: [0.25, 0.46, 0.45, 0.94]
    };
  };

  if (stagger) {
    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
        className={className}
      >
        {Array.isArray(children) ? (
          children.map((child, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              transition={getTransition()}
            >
              {child}
            </motion.div>
          ))
        ) : (
          <motion.div
            variants={itemVariants}
            transition={getTransition()}
          >
            {children}
          </motion.div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      transition={getTransition()}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Specialized components for common use cases
export function StaggeredGrid({ 
  children, 
  className = "", 
  delay = 0.1 
}: { 
  children: ReactNode; 
  className?: string; 
  delay?: number; 
}) {
  return (
    <AnimatedSection
      animation="slide-up"
      stagger
      staggerDelay={delay}
      className={className}
    >
      {children}
    </AnimatedSection>
  );
}

export function FadeInSection({ 
  children, 
  className = "", 
  delay = 0 
}: { 
  children: ReactNode; 
  className?: string; 
  delay?: number; 
}) {
  return (
    <AnimatedSection
      animation="fade"
      delay={delay}
      className={className}
    >
      {children}
    </AnimatedSection>
  );
}

export function SlideUpSection({ 
  children, 
  className = "", 
  delay = 0 
}: { 
  children: ReactNode; 
  className?: string; 
  delay?: number; 
}) {
  return (
    <AnimatedSection
      animation="slide-up"
      delay={delay}
      className={className}
    >
      {children}
    </AnimatedSection>
  );
}