import { motion } from "framer-motion"

type CountdownCardProps = {
  timeLeftLabel: string
  dayPercent: number
  todayGoalPercent: number
  aheadOfPace: boolean
}

export const CountdownCard: React.FC<CountdownCardProps> = ({
  timeLeftLabel,
  dayPercent,
  todayGoalPercent,
  aheadOfPace,
}) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-[var(--gw-grey-200)] p-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-1">
        <p className="text-[var(--text-xs)] uppercase tracking-[0.14em] text-[var(--text-medium)]">
          Time left today
        </p>
        <span className="tabular-nums font-semibold text-[var(--text-lg)] text-[var(--text-strong)]">
          {timeLeftLabel}
        </span>
      </div>

      {/* Smaller description */}
      <p className="text-[11px] text-[var(--text-light)] mt-1">
        Day progress vs booking pace
      </p>

      {/* PROGRESS BARS */}
      <div className="mt-3 space-y-3">
        {/* Day elapsed */}
        <div>
          <div className="flex justify-between text-[var(--text-xs)] text-[var(--text-medium)] mb-1">
            <span>Day elapsed</span>
            <span>{dayPercent.toFixed(0)}%</span>
          </div>

          <div className="h-2 w-full rounded-full bg-[var(--gw-grey-100)] overflow-hidden">
            <div
              className="h-2 rounded-full bg-[var(--gw-grey-300)] transition-all"
              style={{ width: `${dayPercent}%` }}
            />
          </div>
        </div>

        {/* Goal progress */}
        <div>
          <div className="flex justify-between text-[var(--text-xs)] text-[var(--text-medium)] mb-1">
            <span>Goal progress</span>
            <span>{todayGoalPercent.toFixed(0)}%</span>
          </div>

          <div className="h-2 w-full rounded-full bg-[var(--gw-grey-100)] overflow-hidden">
            <div
              className="h-2 rounded-full bg-[var(--gw-primary)] transition-all"
              style={{ width: `${Math.min(todayGoalPercent, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* BADGE — smaller font */}
      <div className="mt-3">
        <span
          className={`
            inline-flex items-center rounded-full px-2 py-0.5 
            text-[12px] font-medium whitespace-nowrap
            ${
              aheadOfPace
                ? "bg-[var(--gw-primary-light)] text-[var(--gw-primary-dark)]"
                : "gw-soft-pulse bg-[rgb(255,227,227)] text-[rgb(180,30,30)]"
            }
          `}
        >
          {aheadOfPace ? "Ahead of pace ⏱️✈️" : "Behind pace — push a bit 💪"}
        </span>
      </div>
    </motion.div>
  )
}
