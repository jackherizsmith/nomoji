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

    // Random starting position across entire arena
    const startX = random(5, 95);
    const startY = random(5, 95);

    // Random movement range (20-60% of arena)
    const moveX = random(-30, 30);
    const moveY = random(-30, 30);

    return {
      startX,
      startY,
      moveX,
      moveY,
      duration: random(4, 10),
      rotateAmount: random(-360, 360),
      scaleAmount: [1, random(0.6, 1.5), 1],
      delay: random(0, 3),
    };
  }, [index]);

  return (
    <motion.div
      className="absolute text-4xl select-none pointer-events-none"
      style={{
        left: `${animations.startX}%`,
        top: `${animations.startY}%`,
        filter: 'saturate(0.8)',
      }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0.6, 1, 0.6],
        x: [`0%`, `${animations.moveX}%`, `0%`],
        y: [`0%`, `${animations.moveY}%`, `0%`],
        scale: animations.scaleAmount,
        rotate: [0, animations.rotateAmount, 0],
        filter: [
          'saturate(0.5) hue-rotate(0deg)',
          'saturate(1.5) hue-rotate(180deg)',
          'saturate(0.5) hue-rotate(360deg)',
        ],
      }}
      transition={{
        duration: animations.duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: animations.delay,
        times: [0, 0.5, 1],
      }}
    >
      {emoji}
    </motion.div>
  );
}
