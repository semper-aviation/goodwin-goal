type UpcomingDay = {
  date: string
  plannedLegs: number
  forecastLegs: number
}

type ProjectedYearEnd = {
  totalLegs: number
  avgLegs: number
}

export type DashboardSnapshot = {
  todayLegs: number
  ytdLegs: number
  daysElapsed: number
  upcoming: UpcomingDay[]
  projectedYearEnd: ProjectedYearEnd | null
}

export type GameLevel = {
  name: string
  emoji: string
  description: string
  colorClasses: string
  nextHint: string
}

export const initialSnapshot: DashboardSnapshot = {
  todayLegs: 0,
  ytdLegs: 0,
  daysElapsed: 1,
  upcoming: [],
  projectedYearEnd: null,
}

export const sampleData: DashboardSnapshot = {
  todayLegs: 8,
  ytdLegs: 3115,
  daysElapsed: 240,
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
  projectedYearEnd: {
    totalLegs: 4755,
    avgLegs: 13.03,
  },
}
