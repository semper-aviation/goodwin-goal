"use client"

// GoalsDashboard.tsx
import React, { useEffect, useMemo, useState, useRef } from "react"
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
import { MtdAverageCard } from "./dashboard/MtdAverageCard"
import { DAILY_TARGET, YEAR_TARGET } from "./utils/functions"
import { MobileDashboard } from "./dashboard/MobileDashboard"

const GoalsDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardSnapshot>(initialSnapshot)
  const [now, setNow] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [justIncreasedToday, setJustIncreasedToday] = useState(false)
  const [isPresentationMode, setIsPresentationMode] = useState(false)
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInitialLoad = useRef(true)

  // Tick every second for countdown
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  // Real API call with 3s polling (via Next.js API route)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user's timezone
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
        const response = await fetch(`/api/goal?timezone=${encodeURIComponent(timezone)}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()

        // Check if recently completed legs increased for confetti (skip on initial load)
        setStats((prev) => {
          if (!isInitialLoad.current && data.recentlyCompletedLegs > prev.recentlyCompletedLegs) {
            setJustIncreasedToday(true)
          }
          isInitialLoad.current = false
          return data
        })

        setLastRefreshed(new Date())
        setLoading(false)
        setError(null)
      } catch (err) {
        console.error("Error fetching goal data:", err)
        setError("Failed to load dashboard data")
        setLoading(false)
      }
    }

    // Initial fetch
    fetchData()

    // Poll every 3 minutes
    const intervalId = setInterval(fetchData, 180000)

    return () => clearInterval(intervalId)
  }, [])

  // --- COMMENTED OUT: Simulated API call for local testing ---
  // useEffect(() => {
  //   // initial load
  //   setStats(sampleData)
  //   setLoading(false)
  //
  //   const intervalId = setInterval(() => {
  //     setStats((prev) => {
  //       const next = simulateNextSnapshot(prev)
  //
  //       // If today's legs increased, fire confetti
  //       if (next.recentlyCompletedLegs > prev.recentlyCompletedLegs) {
  //         setJustIncreasedToday(true)
  //       }
  //
  //       return next
  //     })
  //   }, 3000) // "API call" every 3s
  //
  //   return () => clearInterval(intervalId)
  // }, [])

  useEffect(() => {
    if (!justIncreasedToday) return

    const timeoutId = setTimeout(() => {
      setJustIncreasedToday(false)
    }, 1500)

    return () => clearTimeout(timeoutId)
  }, [justIncreasedToday])

  // Track presentation mode changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsPresentationMode(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  const { timeLeftLabel, dayPercent } = useMemo(() => getDayTiming(now), [now])

  const avgLegs = useMemo(
    () => (stats.daysElapsed > 0 ? stats.ytdLegs / stats.daysElapsed : 0),
    [stats.ytdLegs, stats.daysElapsed]
  )

  const todayGoalPercent = useMemo(
    () => Math.min((stats.recentlyCompletedLegs / DAILY_TARGET) * 100, 120),
    [stats.recentlyCompletedLegs]
  )

  const annualPercent = useMemo(
    () => Math.min((stats.ytdLegs / YEAR_TARGET) * 100, 120),
    [stats.ytdLegs]
  )

  // Days in current month
  const daysInMonth = useMemo(() => {
    const d = now
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
  }, [now])

  // Month target = DAILY_TARGET * daysInMonth
  const MONTH_TARGET = useMemo(() => DAILY_TARGET * daysInMonth, [daysInMonth])

  // MTD average legs / day
  const avgLegsMTD = useMemo(
    () => (stats.daysElapsedMTD > 0 ? stats.mtdLegs / stats.daysElapsedMTD : 0),
    [stats.mtdLegs, stats.daysElapsedMTD]
  )

  // MTD progress vs month target
  const mtdPercent = useMemo(
    () => Math.min((stats.mtdLegs / MONTH_TARGET) * 100, 120),
    [stats.mtdLegs, MONTH_TARGET]
  )

  const onTrackMTD = avgLegsMTD >= DAILY_TARGET

  const aheadOfPace = todayGoalPercent > dayPercent
  const onTrack = avgLegs >= DAILY_TARGET
  const gameLevel = useMemo(() => getGameLevel(avgLegs), [avgLegs])

  return (
    <div
      ref={containerRef}
      className={`min-h-screen bg-[var(--gw-grey-50)] ${
        isPresentationMode ? "h-screen overflow-hidden" : "overflow-y-auto"
      }`}
    >
      <GoodwinHeader containerRef={containerRef} />

      <div
        className={`max-w-6xl mx-auto px-4 bg-[var(--gw-grey-50)] ${
          isPresentationMode ? "pt-2 pb-0 space-y-3" : "py-6 pb-12 space-y-4"
        }`}
      >
        {/* As of timestamp */}
        {lastRefreshed && (
          <div
            className={`flex justify-end ${isPresentationMode ? "-mb-2" : ""}`}
          >
            <span className="text-xs text-[var(--gw-primary-dark)]/60">
              As of: {lastRefreshed.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                timeZoneName: 'short'
              })}
            </span>
          </div>
        )}

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
            <div
              className={`hidden md:block ${
                isPresentationMode ? "space-y-3" : "space-y-4"
              }`}
            >
              {/* TOP GRID */}
              <div
                className={`grid md:[grid-template-columns:2fr_1fr] ${
                  isPresentationMode ? "gap-3" : "gap-4"
                }`}
              >
                <TodayHeroCard
                  recentlyCompletedLegs={stats.recentlyCompletedLegs}
                  scheduledLegs={stats.scheduledLegs}
                  todayGoalPercent={todayGoalPercent}
                  DAILY_TARGET={DAILY_TARGET}
                  celebrate={justIncreasedToday}
                />

                <div
                  className={isPresentationMode ? "space-y-2.5" : "space-y-3"}
                >
                  <CountdownCard
                    timeLeftLabel={timeLeftLabel}
                    dayPercent={dayPercent}
                    todayGoalPercent={todayGoalPercent}
                    aheadOfPace={aheadOfPace}
                  />
                  <MtdAverageCard
                    avgLegsMTD={avgLegsMTD}
                    mtdLegs={stats.mtdLegs}
                    MONTH_TARGET={MONTH_TARGET}
                    DAILY_TARGET={DAILY_TARGET}
                    mtdPercent={mtdPercent}
                    onTrack={onTrackMTD}
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
                compact={isPresentationMode}
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
                avgLegsMTD={avgLegsMTD}
                mtdLegs={stats.mtdLegs}
                MONTH_TARGET={MONTH_TARGET}
                DAILY_TARGET={DAILY_TARGET}
                mtdPercent={mtdPercent}
                onTrackMTD={onTrackMTD}
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
