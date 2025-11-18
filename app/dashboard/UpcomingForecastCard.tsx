import { motion } from "framer-motion"
import { formatShortDate, isTodayIso } from "../utils/functions"
import { DashboardSnapshot } from "./sample"

type UpcomingForecastCardProps = {
  upcoming: DashboardSnapshot["upcoming"]
  dailyTarget: number
}

export const UpcomingForecastCard: React.FC<UpcomingForecastCardProps> = ({
  upcoming,
  dailyTarget,
}) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-[var(--gw-grey-200)] p-4 md:p-5"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm md:text-base font-semibold text-[var(--gw-primary-dark)]">
          Next 7 days
        </h3>
        <p className="text-[10px] md:text-[12px] text-[var(--gw-primary-dark)]/70">
          Solid = booked, faint = forecast
        </p>
      </div>

      <div className="space-y-3">
        {upcoming.length === 0 && (
          <p className="text-[12px] md:text-sm text-[var(--gw-primary-dark)]/60">
            No upcoming data yet.
          </p>
        )}

        {upcoming.map((d) => {
          const bookedPercent = Math.min(
            (d.plannedLegs / dailyTarget) * 100,
            120
          )
          const forecastPercent = Math.min(
            (d.forecastLegs / dailyTarget) * 100,
            120
          )
          const hitTarget = d.plannedLegs >= dailyTarget
          const behindForecast = d.plannedLegs < d.forecastLegs

          // bar color logic
          let barColor = "bg-[var(--gw-grey-300)]"
          if (hitTarget) {
            barColor = "bg-emerald-700"
          } else if (d.plannedLegs < d.forecastLegs) {
            barColor = "bg-amber-500"
          }

          return (
            <motion.div
              key={d.date}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-1"
            >
              <div className="flex items-start justify-between gap-2">
                {/* Left: date + Today pill */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[var(--gw-primary-dark)]">
                    {formatShortDate(d.date)}
                  </span>
                  {isTodayIso(d.date) && (
                    <span className="text-[10px] rounded-full bg-[var(--gw-primary-light)] px-2 py-0.5 text-[var(--gw-primary-dark)] whitespace-nowrap">
                      Today
                    </span>
                  )}
                </div>

                {/* Right: numbers + badges, responsive + wrap-friendly */}
                <div className="flex flex-wrap items-center justify-end gap-1 md:gap-2 text-[10px] md:text-[12px]">
                  <span className="text-[var(--gw-primary-dark)]/80">
                    Booked:{" "}
                    <span className="font-semibold">{d.plannedLegs}</span>
                  </span>
                  <span className="text-[var(--gw-grey-300)]">|</span>
                  <span className="text-[var(--gw-primary-dark)]/80">
                    Forecast:{" "}
                    <span className="font-semibold">{d.forecastLegs}</span>
                  </span>

                  {hitTarget && (
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] md:text-[11px] font-medium bg-[var(--gw-primary-light)] text-[var(--gw-primary-dark)] whitespace-nowrap">
                      Goal hit
                    </span>
                  )}

                  {!hitTarget && behindForecast && (
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] md:text-[11px] font-medium bg-[var(--gw-secondary)]/10 text-[var(--gw-secondary)] whitespace-nowrap">
                      Behind forecast
                    </span>
                  )}
                </div>
              </div>

              <div className="relative h-1.5 md:h-2 w-full rounded-full bg-[var(--gw-grey-100)] overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-[var(--gw-grey-200)]"
                  style={{ width: `${Math.min(forecastPercent, 100)}%` }}
                />
                <div
                  className={`absolute inset-y-0 left-0 ${barColor}`}
                  style={{ width: `${Math.min(bookedPercent, 100)}%` }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
