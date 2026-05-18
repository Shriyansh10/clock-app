import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/')({ component: Home })
export type CurrentDateAndTimeType = {
  hours: number
  mins: number
  secs: number
  date: number
  month: number
  year: number
}

function Home() {
  const [currentDateAndTime, setCurrenDateAndTime] =
    useState<CurrentDateAndTimeType>({
      hours: 0,
      mins: 0,
      secs: 0,
      date: 0,
      month: 0,
      year: 0,
    })

  useEffect(() => {
    function update() {
      const currenttime = new Date(Date.now())
      setCurrenDateAndTime({
        hours: currenttime.getHours(),
        mins: currenttime.getMinutes(),
        secs: currenttime.getSeconds(),
        date: currenttime.getDate(),
        month: currenttime.getMonth(),
        year: currenttime.getFullYear(),
      })
    }

    update()
    const currIntervalId = setInterval(update, 1000)
    return () => {
      clearInterval(currIntervalId)
    }
  }, [])

  const hoursDeg =
    ((currentDateAndTime.hours % 12) + currentDateAndTime.mins / 60) * 30
  const minsDeg = (currentDateAndTime.mins + currentDateAndTime.secs / 60) * 6
  const secsDeg = currentDateAndTime.secs * 6

  const dateObj = new Date(
    currentDateAndTime.year,
    currentDateAndTime.month,
    currentDateAndTime.date,
  )
  const monthName = dateObj.toLocaleString(undefined, { month: 'long' })
  const weekdayName = dateObj.toLocaleString(undefined, { weekday: 'long' })

  return (
    <div className="home">
      <div className="clock-card">
        <div
          className="analog-clock"
          style={{
            ['--h' as any]: `${hoursDeg}deg`,
            ['--m' as any]: `${minsDeg}deg`,
            ['--s' as any]: `${secsDeg}deg`,
          }}
          aria-label="Analog clock"
          role="img"
        >
          <div className="tick tick-12" />
          <div className="tick tick-3" />
          <div className="tick tick-6" />
          <div className="tick tick-9" />

          <div className="hand hour" />
          <div className="hand minute" />
          <div className="hand second" />
          <div className="center-dot" />
        </div>

        <div className="digital">
          <span className="digital-time">
            {String(currentDateAndTime.hours).padStart(2, '0')}:
            {String(currentDateAndTime.mins).padStart(2, '0')}:
            {String(currentDateAndTime.secs).padStart(2, '0')}
          </span>
          <div className="calendar" aria-label="Date">
            <div className="calendar-month">{monthName}</div>
            <div className="calendar-day">{currentDateAndTime.date}</div>
            <div className="calendar-meta">
              {weekdayName}, {currentDateAndTime.year}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
