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

export type PreviousMonthCreated = {
  month: string
  monthNumber: number
  createdLegs: number
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
  previousMonthsCreated: PreviousMonthCreated[] | null
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
  previousMonthsCreated: null,
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
    { month: "February", monthNumber: 2, completedLegs: 350, daysInMonth: 28, avgLegsPerDay: 12.5 },
    { month: "March", monthNumber: 3, completedLegs: 465, daysInMonth: 31, avgLegsPerDay: 15.0 },
    { month: "April", monthNumber: 4, completedLegs: 378, daysInMonth: 30, avgLegsPerDay: 12.6 },
    { month: "May", monthNumber: 5, completedLegs: 410, daysInMonth: 31, avgLegsPerDay: 13.23 },
    { month: "June", monthNumber: 6, completedLegs: 396, daysInMonth: 30, avgLegsPerDay: 13.2 },
    { month: "July", monthNumber: 7, completedLegs: 450, daysInMonth: 31, avgLegsPerDay: 14.52 },
    { month: "August", monthNumber: 8, completedLegs: 372, daysInMonth: 31, avgLegsPerDay: 12.0 },
    { month: "September", monthNumber: 9, completedLegs: 405, daysInMonth: 30, avgLegsPerDay: 13.5 },
    { month: "October", monthNumber: 10, completedLegs: 434, daysInMonth: 31, avgLegsPerDay: 14.0 },
    { month: "November", monthNumber: 11, completedLegs: 360, daysInMonth: 30, avgLegsPerDay: 12.0 },
    { month: "December", monthNumber: 12, completedLegs: 480, daysInMonth: 31, avgLegsPerDay: 15.48 },
  ],
  previousMonthsCreated: [
    { month: "January", monthNumber: 1, createdLegs: 390, daysInMonth: 31, avgLegsPerDay: 12.58 },
    { month: "February", monthNumber: 2, createdLegs: 310, daysInMonth: 28, avgLegsPerDay: 11.07 },
    { month: "March", monthNumber: 3, createdLegs: 440, daysInMonth: 31, avgLegsPerDay: 14.19 },
    { month: "April", monthNumber: 4, createdLegs: 355, daysInMonth: 30, avgLegsPerDay: 11.83 },
    { month: "May", monthNumber: 5, createdLegs: 395, daysInMonth: 31, avgLegsPerDay: 12.74 },
    { month: "June", monthNumber: 6, createdLegs: 410, daysInMonth: 30, avgLegsPerDay: 13.67 },
    { month: "July", monthNumber: 7, createdLegs: 425, daysInMonth: 31, avgLegsPerDay: 13.71 },
    { month: "August", monthNumber: 8, createdLegs: 340, daysInMonth: 31, avgLegsPerDay: 10.97 },
    { month: "September", monthNumber: 9, createdLegs: 388, daysInMonth: 30, avgLegsPerDay: 12.93 },
    { month: "October", monthNumber: 10, createdLegs: 415, daysInMonth: 31, avgLegsPerDay: 13.39 },
    { month: "November", monthNumber: 11, createdLegs: 345, daysInMonth: 30, avgLegsPerDay: 11.5 },
    { month: "December", monthNumber: 12, createdLegs: 460, daysInMonth: 31, avgLegsPerDay: 14.84 },
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
