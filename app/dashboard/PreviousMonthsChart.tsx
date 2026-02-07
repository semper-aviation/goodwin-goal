import { motion } from "framer-motion"
import { PreviousMonth, PreviousMonthCreated } from "../utils/sample"
import { DAILY_TARGET } from "../utils/functions"

type PreviousMonthsChartProps = {
  previousMonths: PreviousMonth[] | null
  previousMonthsCreated: PreviousMonthCreated[] | null
}

export const PreviousMonthsChart: React.FC<PreviousMonthsChartProps> = ({
  previousMonths,
  previousMonthsCreated,
}) => {
  if (!previousMonths || previousMonths.length === 0) {
    return null
  }

  // Build a lookup for created legs by monthNumber
  const createdByMonth = new Map(
    (previousMonthsCreated ?? []).map((m) => [m.monthNumber, m])
  )

  // Find max legs across both datasets for scaling
  const allValues = [
    ...previousMonths.map((m) => m.completedLegs),
    ...(previousMonthsCreated ?? []).map((m) => m.createdLegs),
  ]
  const maxLegs = Math.max(...allValues)

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
            Booked &amp; created legs by month
          </p>
        </div>
        <div className="flex items-center gap-4 text-[10px]">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-[var(--gw-primary)]" />
            <span className="text-[var(--gw-primary-dark)]/70">Booked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#6366f1]" />
            <span className="text-[var(--gw-primary-dark)]/70">Created</span>
          </div>
        </div>
      </div>

      <div className="flex items-end gap-3 h-40">
        {previousMonths.map((month, index) => {
          const created = createdByMonth.get(month.monthNumber)
          const bookedHeight = (month.completedLegs / maxLegs) * 100
          const createdHeight = created
            ? (created.createdLegs / maxLegs) * 100
            : 0

          return (
            <motion.div
              key={month.monthNumber}
              className="flex-1 flex flex-col items-center gap-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Bars side by side */}
              <div className="w-full flex items-end justify-center gap-1 h-28 relative group">
                {/* Tooltip */}
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 bg-[var(--gw-primary-dark)] text-white text-[10px] px-2.5 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                  <div className="font-medium">Booked: {month.completedLegs} ({month.avgLegsPerDay.toFixed(1)}/day)</div>
                  {created && (
                    <div className="font-medium mt-0.5">Created: {created.createdLegs} ({created.avgLegsPerDay.toFixed(1)}/day)</div>
                  )}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-[var(--gw-primary-dark)]" />
                </div>

                {/* Booked bar */}
                <motion.div
                  className="flex-1 max-w-[22px] rounded-t-md bg-[var(--gw-primary)]"
                  initial={{ height: 0 }}
                  animate={{ height: `${bookedHeight}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                />

                {/* Created bar */}
                {created && (
                  <motion.div
                    className="flex-1 max-w-[22px] rounded-t-md bg-[#6366f1]"
                    initial={{ height: 0 }}
                    animate={{ height: `${createdHeight}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.05, ease: "easeOut" }}
                  />
                )}
              </div>

              {/* Month label */}
              <span className="text-[10px] font-medium text-[var(--gw-primary-dark)]/70 truncate max-w-full">
                {month.month.slice(0, 3)}
              </span>

              {/* Booked total + avg */}
              <div className="flex items-center gap-1">
                <span className="text-[9px] font-semibold text-[var(--gw-primary)]">
                  {month.completedLegs}
                </span>
                <span className="text-[8px] text-[var(--gw-primary)]/70">
                  (Avg: {month.avgLegsPerDay.toFixed(1)})
                </span>
              </div>

              {/* Created total + avg */}
              {created && (
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-semibold text-[#6366f1]">
                    {created.createdLegs}
                  </span>
                  <span className="text-[8px] text-[#6366f1]/70">
                    (Avg: {created.avgLegsPerDay.toFixed(1)})
                  </span>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
