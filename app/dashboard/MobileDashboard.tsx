import { motion } from "framer-motion"
import { FlightLevelCard } from "./FlightLevelCard"
import { TodayHeroCard } from "./TodayCard"
import { UpcomingForecastCard } from "./UpcomingForecastCard"
import { YtdAverageCard } from "./YtdAverageCard"
import { DashboardSnapshot, GameLevel } from "../utils/sample"
import { DAILY_TARGET, YEAR_TARGET } from "../utils/functions"
import { MtdAverageCard } from "./MtdAverageCard"

type MobileProps = {
  stats: DashboardSnapshot
  avgLegs: number
  gameLevel: GameLevel
  dayPercent: number
  todayGoalPercent: number
  annualPercent: number
  aheadOfPace: boolean
  onTrack: boolean
  timeLeftLabel: string
  celebrateToday: boolean
  avgLegsMTD: number
  mtdLegs: number
  MONTH_TARGET: number
  DAILY_TARGET: number
  mtdPercent: number
  onTrackMTD: boolean
}

export const MobileDashboard: React.FC<MobileProps> = ({
  stats,
  avgLegs,
  gameLevel,
  dayPercent,
  todayGoalPercent,
  annualPercent,
  aheadOfPace,
  onTrack,
  timeLeftLabel,
  celebrateToday,
  avgLegsMTD,
  mtdLegs,
  MONTH_TARGET,
  DAILY_TARGET,
  mtdPercent,
  onTrackMTD,
}) => {
  return (
    <div className="space-y-3">
      {/* Today */}
      <TodayHeroCard
        todayLegs={stats.todayLegs}
        todayGoalPercent={todayGoalPercent}
        DAILY_TARGET={DAILY_TARGET}
        celebrate={celebrateToday}
      />

      {/* Flight level card */}
      <FlightLevelCard gameLevel={gameLevel} avgLegs={avgLegs} />

      {/* Countdown / pace */}
      <motion.div
        className="bg-white rounded-xl shadow-sm p-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-1">
          <p className="text-[11px] text-[var(--gw-primary-dark)]/70 uppercase tracking-wide">
            Time left
          </p>
          <span className="text-lg font-semibold tabular-nums text-[var(--gw-primary-dark)]">
            {timeLeftLabel}
          </span>
        </div>
        <div className="mt-2 space-y-2">
          <div>
            <div className="flex justify-between text-[10px] text-[var(--gw-primary-dark)]/70 mb-1">
              <span>Day elapsed</span>
              <span>{dayPercent.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[var(--gw-grey-100)] overflow-hidden">
              <div
                className="h-1.5 rounded-full bg-[var(--gw-grey-300)] transition-all"
                style={{ width: `${dayPercent}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-[var(--gw-primary-dark)]/70 mb-1">
              <span>Goal progress</span>
              <span>{todayGoalPercent.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[var(--gw-grey-100)] overflow-hidden">
              <div
                className="h-1.5 rounded-full bg-[var(--gw-primary)] transition-all"
                style={{ width: `${Math.min(todayGoalPercent, 100)}%` }}
              />
            </div>
          </div>
        </div>
        <div className="mt-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
              aheadOfPace
                ? "bg-[var(--gw-primary-light)] text-[var(--gw-primary-dark)]"
                : "bg-[var(--gw-secondary)]/10 text-[var(--gw-secondary)]"
            }`}
          >
            {aheadOfPace ? "Ahead of pace" : "Behind pace"}
          </span>
        </div>
      </motion.div>

      <MtdAverageCard
        avgLegsMTD={avgLegsMTD}
        mtdLegs={stats.mtdLegs}
        MONTH_TARGET={MONTH_TARGET}
        DAILY_TARGET={DAILY_TARGET}
        mtdPercent={mtdPercent}
        onTrack={onTrackMTD}
      />

      {/* YTD */}
      <YtdAverageCard
        avgLegs={avgLegs}
        ytdLegs={stats.ytdLegs}
        YEAR_TARGET={YEAR_TARGET}
        onTrack={onTrack}
        DAILY_TARGET={DAILY_TARGET}
        annualPercent={annualPercent}
      />

      {/* Upcoming + forecast */}
      <UpcomingForecastCard
        upcoming={stats.upcoming}
        dailyTarget={DAILY_TARGET}
      />
    </div>
  )
}
