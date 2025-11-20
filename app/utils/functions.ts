export const DAILY_TARGET = 13
export const YEAR_TARGET = DAILY_TARGET * 365

export function isTodayIso(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  )
}

export function formatShortDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}
