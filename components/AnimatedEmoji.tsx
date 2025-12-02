'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface AnimatedEmojiProps {
  emoji: string;
  index: number;
}

export function AnimatedEmoji({ emoji, index }: AnimatedEmojiProps) {
  const animations = useMemo(() => {
    // Create a proper seeded random generator that produces different values
    let seed = index * 9301 + 49297;
    const random = (min: number, max: number) => {
      seed = (seed * 9301 + 49297) % 233280;
      const rnd = seed / 233280;
      return min + rnd * (max - min);
    };

    // Random starting position in viewport coordinates
    // X: 5-95% of width, Y: 15-70% to keep above bottom buttons
    const startX = random(5, 95);
    const startY = random(15, 70);

    // Create multiple waypoints for bouncing movement
    const numPoints = 6;
    const xPoints = [startX];
    const yPoints = [startY];

    for (let i = 0; i < numPoints; i++) {
      xPoints.push(random(5, 95));
      yPoints.push(random(15, 70));
    }

    // Close the loop by returning to start
    xPoints.push(startX);
    yPoints.push(startY);

    return {
      startX,
      startY,
      xPoints,
      yPoints,
      duration: random(20, 40),
      rotateAmount: random(-720, 720),
      scaleRange: [
        1,
        random(0.5, 1.7),
        random(0.6, 1.3),
        random(0.7, 1.5),
        random(0.5, 1.6),
        1
      ],
    };
  }, [index]);

  return (
    <motion.div
      className="absolute text-4xl select-none pointer-events-none will-change-transform"
      style={{
        left: 0,
        top: 0,
      }}
      initial={{
        x: `${animations.startX}vw`,
        y: `${animations.startY}vh`,
        opacity: 0,
      }}
      animate={{
        x: animations.xPoints.map(x => `${x}vw`),
        y: animations.yPoints.map(y => `${y}vh`),
        opacity: [0.6, 0.9, 0.7, 1, 0.8, 0.95, 0.75, 0.6],
        scale: animations.scaleRange,
        rotate: [0, animations.rotateAmount / 3, animations.rotateAmount * 0.6, animations.rotateAmount, animations.rotateAmount * 0.6, animations.rotateAmount / 3, 0],
      }}
      transition={{
        duration: animations.duration,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {emoji}
    </motion.div>
  );
}
