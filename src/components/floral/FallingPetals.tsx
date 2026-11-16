"use client";

import { motion } from "framer-motion";

const petals = [
  { id: 1, left: "8%", delay: 0, duration: 12, size: 16 },
  { id: 2, left: "24%", delay: 3, duration: 15, size: 12 },
  { id: 3, left: "48%", delay: 1.5, duration: 14, size: 18 },
  { id: 4, left: "72%", delay: 4, duration: 13, size: 14 },
  { id: 5, left: "89%", delay: 2, duration: 16, size: 15 },
];

export default function FallingPetals() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          initial={{ y: -40, x: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: ["0vh", "105vh"],
            x: [0, 30, -25, 15],
            rotate: [0, 120, 240, 360],
            opacity: [0, 0.55, 0.55, 0],
          }}
          transition={{
            duration: petal.duration,
            repeat: Infinity,
            delay: petal.delay,
            ease: "linear",
          }}
          style={{ left: petal.left, width: petal.size, height: petal.size }}
          className="absolute rounded-tl-full rounded-br-full bg-rose-300/60 blur-[0.5px]"
        />
      ))}
    </div>
  );
}