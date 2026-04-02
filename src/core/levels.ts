export const XP_PER_LEVEL = 100;

export function calculateLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function calculateProgress(xp: number): number {
  return (xp % XP_PER_LEVEL) / XP_PER_LEVEL * 100;
}
