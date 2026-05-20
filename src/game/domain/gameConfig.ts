import type { BoardSize } from './board';

export type GameMode = 'classic' | 'dimensional' | 'time-attack' | 'move-limit';

export const BOARD_SIZE_MIN = 3;
export const BOARD_SIZE_MAX = 10;

export type GameConfig = {
  mode: GameMode;
  size: BoardSize;
  timeLimit?: number; // seconds, time-attack only
  moveLimit?: number; // move-limit only
};

export const DEFAULT_GAME_CONFIG: GameConfig = {
  mode: 'classic',
  size: { rows: 3, columns: 3 },
};

export function calculateTimeLimit(size: BoardSize): number {
  return size.rows * size.columns * 3;
}

export function calculateMoveLimit(size: BoardSize): number {
  return Math.ceil(size.rows * size.columns * 1.5);
}

export function createGameConfig(mode: GameMode, size: BoardSize): GameConfig {
  const effectiveSize = mode === 'classic' ? { rows: 3, columns: 3 } : size;

  switch (mode) {
    case 'time-attack':
      return { mode, size: effectiveSize, timeLimit: calculateTimeLimit(effectiveSize) };
    case 'move-limit':
      return { mode, size: effectiveSize, moveLimit: calculateMoveLimit(effectiveSize) };
    default:
      return { mode, size: effectiveSize };
  }
}

export function configLabel(config: GameConfig): string {
  const size = `${config.size.rows}×${config.size.columns}`;

  switch (config.mode) {
    case 'classic':
      return 'Classic 3×3';
    case 'dimensional':
      return `Dimensional ${size}`;
    case 'time-attack':
      return `Time Attack ${size}`;
    case 'move-limit':
      return `Move Limit ${size}`;
  }
}
