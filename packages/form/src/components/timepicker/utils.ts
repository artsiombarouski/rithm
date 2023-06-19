export function getAmPm(hours: number) {
  return hours >= 12 ? 'PM' : 'AM';
}

export function getTime(hours: number, minutes: number) {
  return `${hours % 12 || 12}:${minutes < 10 ? '0' + minutes : minutes}`;
}