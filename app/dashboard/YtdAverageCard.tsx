import { motion } from "framer-motion"

type YtdAverageCardProps = {
  avgLegs: number
  ytdLegs: number
  YEAR_TARGET: number
  onTrack: boolean
  DAILY_TARGET: number
  annualPercent: number
}

export const YtdAverageCard: React.FC<YtdAverageCardProps> = ({
  avgLegs,
  ytdLegs,
  YEAR_TARGET,
  onTrack,
  DAILY_TARGET,
  annualPercent,
}) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-[var(--gw-grey-200)] p-4 flex flex-col justify-between"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div>
        <div className="flex items-center justify-between mb-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--gw-primary-dark)]/70">
            Year-to-date average
          </p>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium
    ${
      onTrack
        ? "bg-[var(--gw-primary-light)] text-[var(--gw-primary-dark)]"
        : "gw-soft-pulse bg-[rgb(255,227,227)] text-[rgb(180,30,30)]"
    }`}
          >
            {onTrack ? "ON TRACK" : "NEEDS BOOST"}
          </span>
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-2xl font-semibold text-[var(--gw-primary-dark)]">
            {avgLegs.toFixed(2)}
          </span>
          <span className="text-xs text-[var(--gw-primary-dark)]/70">
            legs / day
          </span>
        </div>
        <p className="text-[11px] text-[var(--gw-primary-dark)]/60 mt-1">
          Target ≥ {DAILY_TARGET} legs / day
        </p>
      </div>
      <div className="mt-3">
        <div className="flex justify-between text-[10px] text-[var(--gw-primary-dark)]/70 mb-1">
          <span>Legs this year</span>
          <span>
            {ytdLegs} / {YEAR_TARGET}
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-[var(--gw-grey-100)] overflow-hidden">
          <div
            className="h-1.5 rounded-full bg-[var(--gw-secondary)] transition-all"
            style={{ width: `${Math.min(annualPercent, 100)}%` }}
          />
        </div>
      </div>
    </motion.div>
  )
}
