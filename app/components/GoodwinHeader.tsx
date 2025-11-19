// GoodwinHeader.tsx
import React, { useState, useEffect } from "react"

interface GoodwinHeaderProps {
  containerRef?: React.RefObject<HTMLDivElement | null>
}

export const GoodwinHeader: React.FC<GoodwinHeaderProps> = ({
  containerRef,
}) => {
  const [isPresentationMode, setIsPresentationMode] = useState(false)

  // Handle fullscreen changes and ESC key
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsPresentationMode(!!document.fullscreenElement)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isPresentationMode) {
        exitPresentationMode()
      }
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isPresentationMode])

  const togglePresentationMode = async () => {
    if (!containerRef?.current) return

    try {
      if (!isPresentationMode) {
        await containerRef.current.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (err) {
      console.error("Error toggling presentation mode:", err)
    }
  }

  const exitPresentationMode = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      }
    } catch (err) {
      console.error("Error exiting presentation mode:", err)
    }
  }
  return (
    <header className="w-full bg-[var(--gw-primary-dark)] text-[var(--gw-primary-light)] border-b border-[var(--gw-primary-dark)]/40">
      <div className="px-4 py-2 flex items-center justify-between">
        <span className="font-serif text-xl tracking-[0.12em] uppercase">
          GOODWIN
        </span>

        {containerRef && (
          <>
            {/* Show Present button when not in presentation mode */}
            {!isPresentationMode && (
              <button
                onClick={togglePresentationMode}
                className="inline-flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-[var(--gw-primary-dark)] bg-[var(--gw-primary-light)] hover:bg-white border border-[var(--gw-primary-light)] rounded-lg transition-colors cursor-pointer"
                title="Enter presentation mode"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
            )}

            {/* Show Exit button only on mobile when in presentation mode */}
            {isPresentationMode && (
              <button
                onClick={togglePresentationMode}
                className="md:hidden inline-flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-[var(--gw-primary-dark)] bg-[var(--gw-primary-light)] hover:bg-white border border-[var(--gw-primary-light)] rounded-lg transition-colors cursor-pointer"
                title="Exit presentation mode"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </>
        )}
      </div>
    </header>
  )
}
