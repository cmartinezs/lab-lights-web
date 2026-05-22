import type { BoardSize } from './board';

export type GameMode =
  | 'classic'
  | 'dimensional'
  | 'time-attack'
  | 'move-limit'
  | 'blind'
  | 'mirror'
  | 'chaos'
  | 'chain'
  | 'puzzle';

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

// Modes locked to 3×3 — no board-size selection
const FIXED_3X3_MODES: ReadonlySet<GameMode> = new Set([
  'classic', 'blind', 'mirror', 'chaos', 'chain', 'puzzle',
]);

export function isFixed3x3Mode(mode: GameMode): boolean {
  return FIXED_3X3_MODES.has(mode);
}

export function createGameConfig(mode: GameMode, size: BoardSize): GameConfig {
  const effectiveSize = isFixed3x3Mode(mode) ? { rows: 3, columns: 3 } : size;

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
    case 'classic':     return 'Classic 3×3';
    case 'dimensional': return `Dimensional ${size}`;
    case 'time-attack': return `Time Attack ${size}`;
    case 'move-limit':  return `Move Limit ${size}`;
    case 'blind':       return 'Blind 3×3';
    case 'mirror':      return 'Mirror 3×3';
    case 'chaos':       return 'Chaos 3×3';
    case 'chain':       return 'Chain 3×3';
    case 'puzzle':      return 'Puzzle 3×3';
  }
}
