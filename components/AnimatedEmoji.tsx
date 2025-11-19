'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface AnimatedEmojiProps {
  emoji: string;
  index: number;
}

export function AnimatedEmoji({ emoji, index }: AnimatedEmojiProps) {
  const animations = useMemo(() => {
    const seed = index * 12345;
    const random = (min: number, max: number) => {
      const x = Math.sin(seed + index) * 10000;
      return min + (x - Math.floor(x)) * (max - min);
    };

    // Random starting position
    const startX = random(5, 95);
    const startY = random(5, 95);

    // Create multiple waypoints for bouncing movement
    const numPoints = 8; // Number of bounce points
    const xPoints = [startX];
    const yPoints = [startY];

    for (let i = 0; i < numPoints; i++) {
      xPoints.push(random(5, 95));
      yPoints.push(random(5, 95));
    }

    return {
      startX,
      startY,
      xPoints: xPoints.map(x => `${x}%`),
      yPoints: yPoints.map(y => `${y}%`),
      duration: random(15, 30),
      rotateAmount: random(-720, 720),
      scaleAmount: [1, random(0.5, 1.6), random(0.6, 1.4), 1],
      delay: random(0, 5),
    };
  }, [index]);

  return (
    <motion.div
      className="absolute text-4xl select-none pointer-events-none will-change-transform"
      style={{
        left: animations.xPoints[0],
        top: animations.yPoints[0],
        filter: 'saturate(0.8)',
      }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0.5, 0.9, 0.7, 1, 0.6, 0.8, 1, 0.5],
        left: animations.xPoints,
        top: animations.yPoints,
        scale: animations.scaleAmount,
        rotate: [0, animations.rotateAmount / 2, animations.rotateAmount, animations.rotateAmount / 2, 0],
        filter: [
          'saturate(0.4) hue-rotate(0deg)',
          'saturate(1.2) hue-rotate(90deg)',
          'saturate(1.8) hue-rotate(180deg)',
          'saturate(1.2) hue-rotate(270deg)',
          'saturate(0.4) hue-rotate(360deg)',
        ],
      }}
      transition={{
        duration: animations.duration,
        repeat: Infinity,
        ease: 'linear',
        delay: animations.delay,
      }}
    >
      {emoji}
    </motion.div>
  );
}
