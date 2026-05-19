import { memo, useEffect, useRef } from 'react';
import { animateIfAllowed, stagger } from '../../../shared/motion/createTimeline';
import type { Board, BoardCell, CellPosition } from '../../domain/board';

type GameBoardProps = {
  board: Board;
  disabled?: boolean;
  onCellPress: (position: CellPosition) => void;
};

export function GameBoard({ board, disabled = false, onCellPress }: GameBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cells = boardRef.current?.querySelectorAll('[data-board-cell]');

    if (!cells?.length) {
      return;
    }

    animateIfAllowed(cells, {
      opacity: [0.45, 1],
      scale: [0.94, 1],
      delay: stagger(26),
      duration: 260,
      ease: 'outQuad',
    });
  }, [board.size.columns, board.size.rows]);

  return (
    <div
      ref={boardRef}
      aria-label="Tablero Classic 3 por 3"
      className="grid aspect-square w-full max-w-[min(84vw,28rem)] gap-2 rounded-panel border border-lab-line bg-black/25 p-3 shadow-glow"
      role="grid"
      style={{ gridTemplateColumns: `repeat(${board.size.columns}, minmax(0, 1fr))` }}
    >
      {board.cells.map((cell) => (
        <BoardCellButton key={cell.id} cell={cell} disabled={disabled} onCellPress={onCellPress} />
      ))}
    </div>
  );
}

const BoardCellButton = memo(function BoardCellButton({
  cell,
  disabled,
  onCellPress,
}: {
  cell: BoardCell;
  disabled: boolean;
  onCellPress: (position: CellPosition) => void;
}) {
  const cellRef = useRef<HTMLButtonElement>(null);
  const isOn = cell.state === 'on';

  function handlePress() {
    if (cellRef.current) {
      animateIfAllowed(cellRef.current, {
        scale: [1, 0.9, 1],
        duration: 180,
        ease: 'outQuad',
      });
    }
    onCellPress({ row: cell.row, column: cell.column });
  }

  return (
    <button
      ref={cellRef}
      aria-label={`Sala ${cell.row + 1},${cell.column + 1}: ${isOn ? 'encendida' : 'apagada'}`}
      aria-pressed={isOn}
      className={[
        'relative aspect-square rounded-md border font-mono text-sm font-black transition',
        'focus:outline-none focus:ring-2 focus:ring-lab-cyan focus:ring-offset-2 focus:ring-offset-lab-bg',
        disabled ? 'cursor-default opacity-80' : 'cursor-pointer hover:-translate-y-0.5',
        isOn
          ? 'lab-cell-on border-lab-green bg-lab-green text-lab-bg shadow-light'
          : 'border-lab-line bg-lab-panelStrong text-lab-muted shadow-inner',
      ].join(' ')}
      data-board-cell
      data-testid={`cell-${cell.row}-${cell.column}`}
      disabled={disabled}
      onClick={handlePress}
      role="gridcell"
      type="button"
    >
      <span className="relative z-10">{cell.row + 1}{cell.column + 1}</span>
      <span
        className={[
          'pointer-events-none absolute inset-2 rounded-full border',
          isOn ? 'lab-cell-glow border-white/50 bg-white/20' : 'border-lab-line/70 bg-black/20',
        ].join(' ')}
      />
    </button>
  );
});
