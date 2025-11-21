export const DAILY_TARGET = 13
export const YEAR_TARGET = DAILY_TARGET * 365

// Parse date string as local date (not UTC)
function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function isTodayIso(dateStr: string) {
  const d = parseLocalDate(dateStr)
  const now = new Date()
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  )
}

export function formatShortDate(dateStr: string) {
  const d = parseLocalDate(dateStr)
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}
