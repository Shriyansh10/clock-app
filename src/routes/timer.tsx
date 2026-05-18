import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'

export const Route = createFileRoute('/timer')({
  component: RouteComponent,
})

function RouteComponent() {
  const [initialTime, setInitialTime] = useState(0)
  const [milisecs, setMilisecs] = useState(0)
  const [isStarted, setIsStarted] = useState(false)
  const [canReset, setCanReset] = useState(false)
  const [intervalId, setIntervalId] = useState<ReturnType<
    typeof setInterval
  > | null>(null)

  const time = useMemo(() => {
    const clamped = Math.max(milisecs, 0)
    return {
      secs: Math.floor(clamped / 100) % 60,
      mins: Math.floor(clamped / 6000) % 60,
      hrs: Math.floor(clamped / (60 * 6000)),
    }
  }, [milisecs])

  const progress = useMemo(() => {
    if (initialTime <= 0) return 0
    const elapsed = Math.min(Math.max(initialTime - milisecs, 0), initialTime)
    return elapsed / initialTime
  }, [initialTime, milisecs])

  const handleStart = () => {
    if (isStarted) return
    if (milisecs <= 0) return

    setIsStarted(true)
    if (!canReset) {
      setCanReset(true)
      setInitialTime(milisecs)
    }
    if (intervalId) return

    const id = setInterval(() => {
      setMilisecs((prev) => Math.max(prev - 1, 0))
    }, 10)
    setIntervalId(id)
  }

  const handlePause = () => {
    if (!isStarted) return
    setIsStarted(false)
    if (intervalId) clearInterval(intervalId)
    setIntervalId(null)
  }

  const handleReset = () => {
    if (intervalId) clearInterval(intervalId)
    setIntervalId(null)
    setIsStarted(false)
    setCanReset(false)
    setMilisecs(0)
    setInitialTime(0)
  }

  useEffect(() => {
    if (milisecs <= 0) {
      if (intervalId) clearInterval(intervalId)
      setIntervalId(null)
      setIsStarted(false)
      setCanReset(false)
    }
  }, [milisecs, intervalId])

  return (
    <>
      <div className="timer">
        <div className="timer-card">
          <div
            className="timer-ring"
            style={{ ['--progress' as any]: `${progress * 100}%` }}
            aria-label="Timer remaining"
          >
            <div className="timer-display">
              <span className="timer-digits">
                {String(time.hrs).padStart(2, '0')}:
                {String(time.mins).padStart(2, '0')}:
                {String(time.secs).padStart(2, '0')}
              </span>
            </div>
          </div>

          <div
            className="timer-presets"
            style={canReset ? { visibility: 'hidden' } : { display: 'flex' }}
          >
            <button onClick={() => setMilisecs((prev) => prev + 3000)}>
              +30 sec
            </button>
            <button onClick={() => setMilisecs((prev) => prev + 6000)}>
              +1 min
            </button>
            <button onClick={() => setMilisecs((prev) => prev + 30000)}>
              +5 min
            </button>
            <button onClick={() => setMilisecs((prev) => prev + 60000)}>
              +10 min
            </button>
          </div>

          <div className="timer-controls">
            <button
              onClick={handleStart}
              disabled={isStarted || milisecs === 0}
              data-variant="primary"
            >
              Start
            </button>
            <button onClick={handlePause} disabled={!isStarted}>
              Pause
            </button>
            <button
              onClick={handleReset}
              disabled={!canReset}
              data-variant="danger"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
