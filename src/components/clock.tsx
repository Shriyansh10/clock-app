const Clock = ({
  hours,
  minutes,
  seconds,
}: {
  hours: number
  minutes: number
  seconds: number
}) => {
  return (
    <div>
      {hours}:{minutes}:{seconds}
    </div>
  )
}

export default Clock
