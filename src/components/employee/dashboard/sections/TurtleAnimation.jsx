// components/TurtleAnimation.jsx

import { motion } from "framer-motion";

export default function TurtleAnimation() {
  return (
    <div className="absolute top-2 left-0 w-full pointer-events-none overflow-hidden z-10">

      {/* Path Line */}
      <div className="absolute top-1 w-full border-t-2 border-dashed border-slate-300/70"></div>

      {/* Turtle */}
      <motion.div
        className="text-4xl"
        initial={{ x: "112%" }}
        animate={{
          x: ["112%", "96%", "76%", "57%", "36%", "18%", "-12%"],
          y: [4, -3, 3, -5, 2, -2, 4],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          times: [0, 0.16, 0.32, 0.5, 0.68, 0.84, 1],
          ease: "easeInOut",
        }}
      >
        <motion.img
          src="/turtle.png"
          className="h-12"
          animate={{
            rotate: [0, -2, 2, -3, 2, -1, 0],
            scale: [1, 1.02, 0.98, 1.03, 0.99, 1.01, 1],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  );
}