import { motion } from "framer-motion"
import { PreviousMonth } from "../utils/sample"
import { DAILY_TARGET } from "../utils/functions"

type PreviousMonthsChartProps = {
  previousMonths: PreviousMonth[] | null
}

export const PreviousMonthsChart: React.FC<PreviousMonthsChartProps> = ({
  previousMonths,
}) => {
  if (!previousMonths || previousMonths.length === 0) {
    return null
  }

  // Find max legs for scaling the bars
  const maxLegs = Math.max(...previousMonths.map((m) => m.completedLegs))

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-[var(--gw-grey-200)] p-5"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--gw-primary-dark)]/70">
            Monthly Performance
          </h3>
          <p className="text-[10px] text-[var(--gw-primary-dark)]/50 mt-0.5">
            Completed legs by month
          </p>
        </div>
        <div className="flex items-center gap-4 text-[10px]">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-[var(--gw-primary)]" />
            <span className="text-[var(--gw-primary-dark)]/70">≥ {DAILY_TARGET} avg</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-[var(--gw-secondary)]" />
            <span className="text-[var(--gw-primary-dark)]/70">&lt; {DAILY_TARGET} avg</span>
          </div>
        </div>
      </div>

      <div className="flex items-end gap-2 h-32">
        {previousMonths.map((month, index) => {
          const barHeight = (month.completedLegs / maxLegs) * 100
          const isOnTrack = month.avgLegsPerDay >= DAILY_TARGET

          return (
            <motion.div
              key={month.monthNumber}
              className="flex-1 flex flex-col items-center gap-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Bar */}
              <div className="w-full flex flex-col items-center justify-end h-24 relative group">
                {/* Tooltip */}
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-[var(--gw-primary-dark)] text-white text-[10px] px-2 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                  <div className="font-medium">{month.completedLegs} legs</div>
                  <div className="text-white/70">{month.avgLegsPerDay.toFixed(1)} avg/day</div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-[var(--gw-primary-dark)]" />
                </div>

                <motion.div
                  className={`w-full max-w-[48px] rounded-t-md ${
                    isOnTrack ? "bg-[var(--gw-primary)]" : "bg-[var(--gw-secondary)]"
                  }`}
                  initial={{ height: 0 }}
                  animate={{ height: `${barHeight}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                />
              </div>

              {/* Month label */}
              <span className="text-[10px] font-medium text-[var(--gw-primary-dark)]/70 truncate max-w-full">
                {month.month.slice(0, 3)}
              </span>

              {/* Avg legs label */}
              <span
                className={`text-[9px] font-medium ${
                  isOnTrack ? "text-[var(--gw-primary)]" : "text-[var(--gw-secondary)]"
                }`}
              >
                {month.avgLegsPerDay.toFixed(1)}
              </span>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
