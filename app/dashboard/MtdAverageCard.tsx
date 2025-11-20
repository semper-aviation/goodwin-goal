"use client"

import { motion } from "framer-motion"

type MtdAverageCardProps = {
  avgLegsMTD: number
  mtdLegs: number
  MONTH_TARGET: number
  DAILY_TARGET: number
  mtdPercent: number
  onTrack: boolean
}

export const MtdAverageCard: React.FC<MtdAverageCardProps> = ({
  avgLegsMTD,
  mtdLegs,
  MONTH_TARGET,
  DAILY_TARGET,
  mtdPercent,
  onTrack,
}) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-[var(--gw-grey-200)] p-3"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-medium)]">
          Month-to-date average
        </p>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium
          ${
            onTrack
              ? "bg-[var(--gw-primary-light)] text-[var(--gw-primary-dark)]"
              : "gw-soft-pulse bg-[rgb(255,227,227)] text-[rgb(180,30,30)]"
          }`}
        >
          {onTrack ? "ON TRACK" : "NEEDS BOOST"}
        </span>
      </div>

      <div className="flex items-baseline gap-1 mt-0.5">
        <span className="text-2xl font-semibold text-[var(--text-strong)]">
          {avgLegsMTD.toFixed(1)}
        </span>
        <span className="text-[11px] text-[var(--text-light)]">legs / day</span>
      </div>

      <p className="text-[11px] text-[var(--text-light)] mt-1">
        Target ≥ {DAILY_TARGET} legs / day
      </p>

      <div className="mt-3">
        <div className="flex justify-between text-[10px] text-[var(--text-medium)] mb-1">
          <span>Legs this month</span>
          <span>
            {mtdLegs} / {MONTH_TARGET}
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-[var(--gw-grey-100)] overflow-hidden">
          <div
            className="h-1.5 rounded-full bg-[var(--gw-primary)] transition-all"
            style={{ width: `${Math.min(mtdPercent, 100)}%` }}
          />
        </div>
      </div>
    </motion.div>
  )
}
