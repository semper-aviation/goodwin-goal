type UpcomingDay = {
  date: string
  plannedLegs: number
  forecastLegs: number
}

type ProjectedYearEnd = {
  totalLegs: number
  avgLegs: number
}

type ProjectedMonthEnd = {
  totalLegs: number
  avgLegs: number
}

export type PreviousMonth = {
  month: string
  monthNumber: number
  completedLegs: number
  daysInMonth: number
  avgLegsPerDay: number
}

export type DashboardSnapshot = {
  scheduledLegs: number
  recentlyCompletedLegs: number
  ytdLegs: number
  mtdLegs: number
  daysElapsed: number
  daysElapsedMTD: number
  projectedYearEnd: ProjectedYearEnd | null
  projectedMonthEnd: ProjectedMonthEnd | null
  upcoming: UpcomingDay[]
  previousMonths: PreviousMonth[] | null
}

export type GameLevel = {
  name: string
  emoji: string
  description: string
  colorClasses: string
  nextHint: string
}

export const initialSnapshot: DashboardSnapshot = {
  scheduledLegs: 0,
  recentlyCompletedLegs: 0,
  ytdLegs: 0,
  mtdLegs: 0,
  daysElapsed: 1,
  daysElapsedMTD: 1,
  projectedYearEnd: null,
  projectedMonthEnd: null,
  upcoming: [],
  previousMonths: null,
}

export const sampleData: DashboardSnapshot = {
  scheduledLegs: 4,
  recentlyCompletedLegs: 8,
  ytdLegs: 3115,
  mtdLegs: 1,
  daysElapsed: 240,
  daysElapsedMTD: 24,
  projectedYearEnd: {
    totalLegs: 4755,
    avgLegs: 13.03,
  },
  projectedMonthEnd: {
    totalLegs: 300,
    avgLegs: 12.5,
  },
  upcoming: [
    {
      date: "2025-02-10",
      plannedLegs: 9,
      forecastLegs: 12,
    },
    {
      date: "2025-02-11",
      plannedLegs: 7,
      forecastLegs: 11,
    },
    {
      date: "2025-02-12",
      plannedLegs: 12,
      forecastLegs: 13,
    },
    {
      date: "2025-02-13",
      plannedLegs: 5,
      forecastLegs: 10,
    },
    {
      date: "2025-02-14",
      plannedLegs: 13,
      forecastLegs: 14,
    },
    {
      date: "2025-02-15",
      plannedLegs: 4,
      forecastLegs: 9,
    },
    {
      date: "2025-02-16",
      plannedLegs: 6,
      forecastLegs: 11,
    },
  ],
  previousMonths: [
    { month: "January", monthNumber: 1, completedLegs: 420, daysInMonth: 31, avgLegsPerDay: 13.55 },
  ],
}

// utils/sample.ts

const SIM_DAILY_TARGET = 13 // keep in sync with DAILY_TARGET in the dashboard

export function simulateNextSnapshot(
  prev: DashboardSnapshot
): DashboardSnapshot {
  // 1) Recently completed legs + YTD
  const shouldIncrementToday = Math.random() < 0.5 // 50% of ticks
  const todayIncrement = shouldIncrementToday ? 1 : 0

  const recentlyCompletedLegs = prev.recentlyCompletedLegs + todayIncrement
  const ytdLegs = prev.ytdLegs + todayIncrement

  // 2) Upcoming 7 days evolution
  const upcoming = prev.upcoming.map((day, index) => {
    let plannedLegs = day.plannedLegs
    let forecastLegs = day.forecastLegs

    // Higher chance of new bookings in the next 1–3 days,
    // lower chance further out.
    const bookingProb =
      index === 0 ? 0.7 : index === 1 ? 0.5 : index === 2 ? 0.35 : 0.2

    if (Math.random() < bookingProb) {
      plannedLegs += 1
    }

    // Occasionally adjust forecast slightly (market demand, etc.)
    if (Math.random() < 0.18) {
      const delta = Math.random() < 0.5 ? -1 : 1
      forecastLegs = Math.max(0, forecastLegs + delta)
    }

    // Clamp values so they stay believable
    const maxPlanned = SIM_DAILY_TARGET + 6
    const maxForecast = SIM_DAILY_TARGET + 4

    plannedLegs = Math.max(0, Math.min(plannedLegs, maxPlanned))
    forecastLegs = Math.max(0, Math.min(forecastLegs, maxForecast))

    // Optional: keep planned reasonably close to forecast
    if (plannedLegs > forecastLegs + 3) {
      forecastLegs = plannedLegs - 2
    }

    return {
      ...day,
      plannedLegs,
      forecastLegs,
    }
  })

  // 3) Update projected year-end based on new YTD
  const projectedYearEnd = recalcProjection({
    daysElapsed: prev.daysElapsed,
    ytdLegs,
  })

  return {
    ...prev,
    recentlyCompletedLegs,
    ytdLegs,
    upcoming,
    projectedYearEnd,
  }
}

function recalcProjection({
  daysElapsed,
  ytdLegs,
}: {
  daysElapsed: number
  ytdLegs: number
}): DashboardSnapshot["projectedYearEnd"] {
  if (!daysElapsed || daysElapsed <= 0) return { avgLegs: 0, totalLegs: 0 }

  const avgLegs = ytdLegs / daysElapsed
  const avgRounded = Number(avgLegs.toFixed(2))

  // Full-year projection
  const totalLegs = avgRounded * 365

  return {
    avgLegs: avgRounded,
    totalLegs,
  }
}
