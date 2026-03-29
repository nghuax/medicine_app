export function startOfDayLocal(date = new Date()) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function dateKey(date = new Date()) {
  return startOfDayLocal(date).toISOString().slice(0, 10);
}

export function formatShortDate(value: string | number | Date) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

export function formatMonth(value: string | number | Date) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatClock(time: string | number | Date) {
  if (typeof time === "string" && /^\d{2}:\d{2}$/.test(time)) {
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return formatClock(date);
  }

  const date = new Date(time);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function addDays(value: string | number | Date, days: number) {
  const date = new Date(value);
  date.setDate(date.getDate() + days);
  return date;
}

export function hoursFromNow(hours: number) {
  return Date.now() + hours * 60 * 60 * 1000;
}

export function getPastDateKeys(days: number) {
  return Array.from({ length: days }, (_, index) => {
    const date = startOfDayLocal();
    date.setDate(date.getDate() - (days - index - 1));
    return dateKey(date);
  });
}

export function isSameDateKey(left: string, right: string) {
  return left === right;
}
