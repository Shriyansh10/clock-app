import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/stopwatch')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isRunning, setIsRunning] = useState(false)
  const [canReset, setCanReset] = useState(false)
  const [milisecs, setMilisecs] = useState(0)
  const [intervalId, setIntervalId] = useState<ReturnType<
    typeof setInterval
  > | null>(null)

  const handleStart = () => {
    if (!isRunning) {
      setIsRunning(true)
    }
    if (!canReset) setCanReset(true)
    setIntervalId(
      setInterval(() => {
        setMilisecs((prev) => prev + 1)
      }, 10),
    )
  }

  const handlePause = () => {
    if (isRunning) {
      setIsRunning(false)
    }
    clearInterval(intervalId!)
  }

  const handleReset = () => {
    if (canReset) {
      clearInterval(intervalId!)
      setCanReset(false)
    }
    setIsRunning(false)
    setIntervalId(null)
    setMilisecs(0)
  }

  const updateTime = () => {
    return {
      ms: milisecs % 100,
      secs: Math.floor(milisecs / 100) % 60,
      mins: Math.floor(milisecs / 6000) % 60,
      hrs: Math.floor(milisecs / (60 * 6000)),
    }
  }
  return (
    <>
      <div className="stopwatch">
        <div className="stopwatch-card">
          <div className="stopwatch-display" aria-label="Stopwatch time">
            <span className="stopwatch-digits">
              {String(updateTime().hrs).padStart(2, '0')}:
              {String(updateTime().mins).padStart(2, '0')}:
              {String(updateTime().secs).padStart(2, '0')}
            </span>
            <span className="stopwatch-cs">
              {String(updateTime().ms).padStart(2, '0')}
            </span>
          </div>

          <div className="stopwatch-controls">
            <button onClick={handleStart} disabled={isRunning} data-variant="primary">
              Start
            </button>
            <button onClick={handlePause} disabled={!isRunning}>
              Pause
            </button>
            <button onClick={handleReset} disabled={!canReset} data-variant="danger">
              Reset
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
