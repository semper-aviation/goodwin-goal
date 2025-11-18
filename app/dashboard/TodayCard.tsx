import { AnimatePresence, motion } from "framer-motion"

type TodayHeroProps = {
  todayLegs: number
  todayGoalPercent: number
  DAILY_TARGET: number
}

export const TodayHeroCard: React.FC<TodayHeroProps> = ({
  todayLegs,
  todayGoalPercent,
  DAILY_TARGET,
}) => {
  const clampedPercent = Math.min(todayGoalPercent, 120)

  return (
    <motion.div
      className="rounded-2xl bg-white shadow-sm border border-[var(--gw-grey-200)] px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Left: big number */}
      <div className="flex-1 flex flex-col items-start">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-[var(--text-medium)]">
          Today&apos;s legs
        </p>

        <div className="mt-3 flex items-end gap-3">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={todayLegs}
              initial={{ scale: 0.8, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.05, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="font-mono tabular-nums text-7xl md:text-8xl font-bold text-[var(--text-strong)] leading-none"
            >
              {todayLegs}
            </motion.div>
          </AnimatePresence>

          <span className="pb-1 text-base font-medium text-[var(--text-medium)]">
            / {DAILY_TARGET}
          </span>
        </div>

        <p className="mt-2 text-sm text-[var(--text-light)]">
          Legs completed so far today
        </p>
      </div>

      {/* Right: compact stats */}
      <div className="w-full md:w-56 space-y-4">
        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between text-[12px] font-medium text-[var(--text-medium)] mb-1">
            <span>Progress</span>
            <span>{clampedPercent.toFixed(0)}%</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-[var(--gw-grey-100)] overflow-hidden">
            <div
              className="h-2.5 rounded-full bg-[var(--gw-primary)] transition-all"
              style={{ width: `${Math.min(clampedPercent, 100)}%` }}
            />
          </div>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-[var(--gw-grey-50)] px-3 py-2">
            <p className="text-[12px] text-[var(--text-light)]">Remaining</p>
            <p className="text-[var(--text-strong)] text-base font-semibold">
              {Math.max(DAILY_TARGET - todayLegs, 0)} legs
            </p>
          </div>

          <div className="rounded-lg bg-[var(--gw-primary-soft)] px-3 py-2 min-w-0">
            <p className="text-[12px] text-[var(--text-medium)]">Status</p>

            <p className="text-[var(--text-strong)] text-base font-semibold whitespace-nowrap">
              {todayLegs >= DAILY_TARGET ? "Goal hit 🎉" : "In progress"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
