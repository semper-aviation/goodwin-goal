import { motion } from "framer-motion"
import { GameLevel } from "../utils/sample"

type FlightLevelCardProps = {
  gameLevel: GameLevel
  avgLegs: number
}

export const FlightLevelCard: React.FC<FlightLevelCardProps> = ({
  gameLevel,
  avgLegs,
}) => {
  const levels = [
    "Taxiing",
    "Takeoff",
    "Climb",
    "Cruising",
    "Supersonic",
  ] as const

  const currentIndexRaw = levels.indexOf(
    gameLevel.name as (typeof levels)[number]
  )
  const currentIndex = currentIndexRaw === -1 ? 0 : currentIndexRaw
  const progressPercent = (currentIndex / Math.max(levels.length - 1, 1)) * 100

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-[var(--gw-grey-200)] p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-5 overflow-hidden relative"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* subtle background accent */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(36,209,168,0.06),_transparent_55%)]" />

      {/* Left: emoji + title + description */}
      <div className="relative z-10 flex items-center gap-4">
        {/* Bouncy emoji bubble */}
        <motion.div
          className={`flex items-center justify-center rounded-full w-14 h-14 ${gameLevel.colorClasses}`}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-3xl">{gameLevel.emoji}</span>
        </motion.div>

        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-[var(--text-2xl)] leading-tight text-[var(--text-strong)]">
              {gameLevel.name}
            </h2>
            <span className="text-xs md:text-sm rounded-full bg-[var(--gw-grey-100)] px-3 py-1 text-[var(--text-strong)]">
              {avgLegs.toFixed(1)} / day
            </span>
          </div>
          <p className="mt-2 text-[var(--text-sm)] text-[var(--text-medium)]">
            {gameLevel.description}
          </p>
        </div>
      </div>

      {/* Right: level timeline & progress bar */}
      <div className="relative z-10 flex-1 md:max-w-xs space-y-3">
        {/* Level timeline */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[var(--text-xs)] text-[var(--text-medium)]">
            <span>Level progress</span>
            <span className="font-medium">
              {levels[currentIndex]}{" "}
              {currentIndex < levels.length - 1 &&
                `→ ${levels[currentIndex + 1]}`}
            </span>
          </div>
          <div className="relative flex items-center gap-2">
            {/* track */}
            <div className="flex-1 h-1.5 rounded-full bg-[var(--gw-grey-100)] relative">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-[var(--gw-primary)]"
                style={{ width: `${progressPercent}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
              />
            </div>
          </div>

          {/* level dots + labels */}
          <div className="mt-2 flex justify-between">
            {levels.map((lvl, index) => {
              const isPast = index < currentIndex
              const isCurrent = index === currentIndex
              return (
                <div
                  key={lvl}
                  className="flex flex-col items-center gap-1 flex-1"
                >
                  <div className="relative flex items-center justify-center">
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${
                        isCurrent
                          ? "bg-[var(--gw-primary)]"
                          : isPast
                          ? "bg-[var(--gw-primary)]/50"
                          : "bg-[var(--gw-grey-200)]"
                      }`}
                    />
                    {isCurrent && (
                      <motion.div
                        className="absolute h-5 w-5 rounded-full border border-[var(--gw-primary)]/70"
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 180,
                          damping: 12,
                        }}
                      />
                    )}
                  </div>
                  <span className="text-[9px] font-medium text-[var(--text-light)] text-center truncate max-w-[60px]">
                    {lvl}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Helper hint: jet-thrust micro animation */}
        {/* Helper hint: jet-thrust micro animation */}
        <motion.div
          className="inline-flex items-center gap-1 cursor-pointer mt-1"
          initial="rest"
          animate="rest"
          whileHover="hover"
        >
          {/* Flame BEHIND the plane */}
          <motion.span
            variants={{
              rest: { opacity: 0, x: 0, scale: 0.8 },
              hover: { opacity: 1, x: -3, scale: 1 },
            }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="text-[10px]"
          >
            🔥
          </motion.span>

          {/* Plane + text */}
          <motion.span
            variants={{
              rest: { x: 0 },
              hover: { x: 4 },
            }}
            transition={{ type: "spring", stiffness: 220, damping: 16 }}
            className="inline-flex items-center gap-1"
          >
            <span className="text-[11px]">✈️</span>

            <span className="text-[10px] text-[var(--text-medium)]">
              Next unlock:{" "}
              <span className="font-semibold text-[var(--text-strong)]">
                {gameLevel.nextHint}
              </span>
            </span>
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  )
}
