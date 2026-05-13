export function formatInboxTimestamp(iso: string, now: Date = new Date()): string {
  const date = new Date(iso);
  const diffDays = daysBetween(startOfDay(date), startOfDay(now));

  if (diffDays === 0) {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  }
  if (diffDays === 1) {
    return 'вчера';
  }
  if (diffDays < 7) {
    return date.toLocaleDateString('ru-RU', { weekday: 'short' });
  }
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
  }
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function daysBetween(earlier: Date, later: Date): number {
  return Math.round((later.getTime() - earlier.getTime()) / (1000 * 60 * 60 * 24));
}
