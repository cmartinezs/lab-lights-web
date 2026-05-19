export function formatGameTime(milliseconds: number): string {
  const safeMilliseconds = Math.max(0, milliseconds);
  const totalTenths = Math.floor(safeMilliseconds / 100);
  const minutes = Math.floor(totalTenths / 600);
  const seconds = Math.floor((totalTenths % 600) / 10);
  const tenths = totalTenths % 10;

  return `${minutes}:${seconds.toString().padStart(2, '0')}.${tenths}`;
}
