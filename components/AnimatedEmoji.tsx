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

    return {
      x: random(-40, 40),
      y: random(-40, 40),
      duration: random(3, 8),
      rotateDuration: random(2, 6),
      rotateAmount: random(-360, 360),
      scaleDuration: random(2, 5),
      scaleAmount: [1, random(0.7, 1.4), 1],
      delay: random(0, 2),
    };
  }, [index]);

  return (
    <motion.div
      className="absolute text-4xl select-none pointer-events-none"
      style={{
        left: `${(index % 10) * 10}%`,
        top: `${Math.floor(index / 10) * 20}%`,
        filter: 'saturate(0.8)',
      }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0.6, 1, 0.6],
        x: [0, animations.x, 0],
        y: [0, animations.y, 0],
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
