interface Duration {
  hour: number;
  min: number;
}

export const formatDuration = (duration: Duration): string => {
  const { hour, min } = duration;
  if (hour === 0) return `${min} min`;
  if (min === 0) return `${hour} hr`;
  return `${hour} hr ${min} min`;
};
