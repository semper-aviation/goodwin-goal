import { AnimatePresence, motion } from "framer-motion"
import React from "react"

export const CardConfetti: React.FC<{ active: boolean }> = ({ active }) => {
  const pieces = React.useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 0.25,
        duration: 0.9 + Math.random() * 0.6,
      })),
    []
  )

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-40 flex justify-center items-start"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {pieces.map((p) => (
            <motion.span
              key={p.id}
              className="absolute top-0 text-2xl"
              style={{ left: p.left }}
              initial={{ y: -20, opacity: 0, rotate: 0 }}
              animate={{
                y: 600,
                opacity: [1, 1, 0],
                rotate: 360,
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: "easeOut", // ✅ camelCase
              }}
            >
              🎉
            </motion.span>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
