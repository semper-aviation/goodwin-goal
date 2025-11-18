"use client"

// GoalsDashboard.tsx
import React, { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  DashboardSnapshot,
  GameLevel,
  initialSnapshot,
  sampleData,
  simulateNextSnapshot,
} from "./utils/sample"
import { CountdownCard } from "./dashboard/CountdownCard"
import { TodayHeroCard } from "./dashboard/TodayCard"
import { YtdAverageCard } from "./dashboard/YtdAverageCard"
import { FlightLevelCard } from "./dashboard/FlightLevelCard"
import { UpcomingForecastCard } from "./dashboard/UpcomingForecastCard"
import { GoodwinHeader } from "./components/GoodwinHeader"

const DAILY_TARGET = 13
const YEAR_TARGET = DAILY_TARGET * 365

const GoalsDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardSnapshot>(initialSnapshot)
  const [now, setNow] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [justIncreasedToday, setJustIncreasedToday] = useState(false)

  // Tick every second for countdown
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  // Single API call on mount
  // Single API call on mount + simulated realtime updates
  useEffect(() => {
    // initial load
    setStats(sampleData)
    setLoading(false)

    const intervalId = setInterval(() => {
      setStats((prev) => {
        const next = simulateNextSnapshot(prev)

        // If today's legs increased, fire confetti
        if (next.todayLegs > prev.todayLegs) {
          setJustIncreasedToday(true)
        }

        return next
      })
    }, 3000) // “API call” every 3s

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    if (!justIncreasedToday) return

    const timeoutId = setTimeout(() => {
      setJustIncreasedToday(false)
    }, 1500)

    return () => clearTimeout(timeoutId)
  }, [justIncreasedToday])

  const { timeLeftLabel, dayPercent } = useMemo(() => getDayTiming(now), [now])

  const avgLegs = useMemo(
    () => (stats.daysElapsed > 0 ? stats.ytdLegs / stats.daysElapsed : 0),
    [stats.ytdLegs, stats.daysElapsed]
  )

  const todayGoalPercent = useMemo(
    () => Math.min((stats.todayLegs / DAILY_TARGET) * 100, 120),
    [stats.todayLegs]
  )

  const annualPercent = useMemo(
    () => Math.min((stats.ytdLegs / YEAR_TARGET) * 100, 120),
    [stats.ytdLegs]
  )

  const aheadOfPace = todayGoalPercent > dayPercent
  const onTrack = avgLegs >= DAILY_TARGET
  const gameLevel = useMemo(() => getGameLevel(avgLegs), [avgLegs])

  return (
    <div className="min-h-screen bg-[var(--gw-grey-50)]">
      <GoodwinHeader />

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-4 bg-[var(--gw-grey-50)]">
        {/* HEADER */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--gw-primary-dark)]">
              Flight Legs Goal Dashboard
            </h1>
            <p className="text-sm text-[var(--text-light)]">
              Snapshot of legs, forecast, and progress toward{" "}
              <span className="inline-flex items-baseline gap-1">
                <span className="gw-target-pulse font-bold text-[1.05rem] md:text-[1.15rem] text-[var(--gw-primary-dark)]">
                  13
                </span>
                <span className="font-medium text-[var(--text-medium)]">
                  legs/day
                </span>
                <span>goal.</span>
              </span>
            </p>
          </div>
          {stats.projectedYearEnd && (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-[var(--gw-primary-dark)]/70">
                Projected year-end avg:
              </span>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                  stats.projectedYearEnd.avgLegs >= DAILY_TARGET
                    ? "bg-[var(--gw-primary-light)] text-[var(--gw-primary-dark)]"
                    : "bg-[var(--gw-secondary)]/10 text-[var(--gw-secondary)]"
                }`}
              >
                {stats.projectedYearEnd.avgLegs.toFixed(2)} legs / day
              </span>
            </div>
          )}
        </div>

        {/* LOADING / ERROR STATES */}
        {loading && (
          <div className="flex items-center justify-center py-10">
            <div className="text-sm text-[var(--gw-primary-dark)]/70">
              Loading dashboard...
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center justify-center py-10">
            <div className="text-sm text-red-500">{error}</div>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* DESKTOP LAYOUT */}
            <div className="hidden md:block space-y-4">
              {/* TOP GRID */}
              <div className="grid gap-4 md:[grid-template-columns:2fr_1fr]">
                <TodayHeroCard
                  todayLegs={stats.todayLegs}
                  todayGoalPercent={todayGoalPercent}
                  DAILY_TARGET={DAILY_TARGET}
                  celebrate={justIncreasedToday}
                />

                <div className="space-y-4">
                  <CountdownCard
                    timeLeftLabel={timeLeftLabel}
                    dayPercent={dayPercent}
                    todayGoalPercent={todayGoalPercent}
                    aheadOfPace={aheadOfPace}
                  />
                  <YtdAverageCard
                    avgLegs={avgLegs}
                    ytdLegs={stats.ytdLegs}
                    YEAR_TARGET={YEAR_TARGET}
                    onTrack={onTrack}
                    DAILY_TARGET={DAILY_TARGET}
                    annualPercent={annualPercent}
                  />
                </div>
              </div>

              {/* Flight level card */}
              <FlightLevelCard gameLevel={gameLevel} avgLegs={avgLegs} />

              {/* UPCOMING + FORECAST */}
              <UpcomingForecastCard
                upcoming={stats.upcoming}
                dailyTarget={DAILY_TARGET}
              />
            </div>

            {/* MOBILE LAYOUT */}
            <div className="md:hidden space-y-3">
              <MobileDashboard
                stats={stats}
                avgLegs={avgLegs}
                gameLevel={gameLevel}
                dayPercent={dayPercent}
                todayGoalPercent={todayGoalPercent}
                annualPercent={annualPercent}
                aheadOfPace={aheadOfPace}
                onTrack={onTrack}
                timeLeftLabel={timeLeftLabel}
                celebrateToday={justIncreasedToday}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default GoalsDashboard

// ---------- MOBILE DASHBOARD ----------

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
}

const MobileDashboard: React.FC<MobileProps> = ({
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

// ---------- HELPERS ----------

function getDayTiming(now: Date) {
  const start = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0
  )
  const end = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59
  )

  const totalMs = end.getTime() - start.getTime()
  const elapsedMs = now.getTime() - start.getTime()
  const remainingMs = Math.max(end.getTime() - now.getTime(), 0)

  const dayPercent = Math.min((elapsedMs / totalMs) * 100, 100)

  const totalSeconds = Math.floor(remainingMs / 1000)
  const hrs = Math.floor(totalSeconds / 3600)
  const mins = Math.floor((totalSeconds % 3600) / 60)
  const secs = totalSeconds % 60

  const timeLeftLabel = `${pad(hrs)}:${pad(mins)}:${pad(secs)}`
  return { timeLeftLabel, dayPercent }
}

function pad(n: number) {
  return n.toString().padStart(2, "0")
}

function getGameLevel(avgLegs: number): GameLevel {
  if (avgLegs < 8) {
    return {
      name: "Taxiing",
      emoji: "🛫",
      description: "We’re still on the runway. Time to accelerate!",
      colorClasses: "bg-gray-200 text-gray-800",
      nextHint: "Hit 8+ legs/day to take off.",
    }
  } else if (avgLegs < 11) {
    return {
      name: "Takeoff",
      emoji: "🚀",
      description: "We’re lifting off. Momentum is building.",
      colorClasses: "bg-sky-100 text-sky-700",
      nextHint: "Push to 11+ legs/day to climb.",
    }
  } else if (avgLegs < 13) {
    return {
      name: "Climb",
      emoji: "🧗‍♂️",
      description: "We’re climbing toward cruising altitude.",
      colorClasses: "bg-blue-100 text-blue-700",
      nextHint: "13+ legs/day unlocks cruising.",
    }
  } else if (avgLegs < 16) {
    return {
      name: "Cruising",
      emoji: "✈️",
      description: "We’re at cruising altitude. Maintain the pace.",
      colorClasses: "bg-emerald-100 text-emerald-700",
      nextHint: "16+ legs/day turns us supersonic.",
    }
  } else {
    return {
      name: "Supersonic",
      emoji: "💥",
      description: "We’re smashing the target. Legendary pace.",
      colorClasses: "bg-amber-100 text-amber-800",
      nextHint: "Keep it steady and enjoy the view.",
    }
  }
}
