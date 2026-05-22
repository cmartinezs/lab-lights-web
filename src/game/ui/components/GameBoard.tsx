import { memo, useEffect, useRef } from 'react';
import { animateIfAllowed, stagger } from '../../../shared/motion/createTimeline';
import type { Board, BoardCell, CellPosition } from '../../domain/board';

type GameBoardProps = {
  board: Board;
  disabled?: boolean;
  blind?: boolean;
  onCellPress: (position: CellPosition) => void;
};

export function GameBoard({ board, disabled = false, blind = false, onCellPress }: GameBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cells = boardRef.current?.querySelectorAll('[data-board-cell]');
    if (!cells?.length) return;
    animateIfAllowed(cells, {
      opacity: [0.45, 1],
      scale: [0.94, 1],
      delay: stagger(26),
      duration: 260,
      ease: 'outQuad',
    });
  }, [board.size.columns, board.size.rows]);

  const gap = board.size.columns > 6 ? 4 : 6;

  return (
    <div
      ref={boardRef}
      aria-label={`Tablero ${board.size.rows} por ${board.size.columns}`}
      role="grid"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${board.size.columns}, minmax(0, 1fr))`,
        gap,
        aspectRatio: '1',
        width: '100%',
        padding: 8,
        background: 'rgba(0,0,0,0.18)',
        borderRadius: 10,
        border: '1px solid var(--line)',
      }}
    >
      {board.cells.map((cell) => (
        <BoardCellButton
          key={cell.id}
          cell={cell}
          blind={blind}
          disabled={disabled}
          onCellPress={onCellPress}
        />
      ))}
    </div>
  );
}

const BoardCellButton = memo(function BoardCellButton({
  cell,
  disabled,
  blind,
  onCellPress,
}: {
  cell: BoardCell;
  disabled: boolean;
  blind: boolean;
  onCellPress: (position: CellPosition) => void;
}) {
  const cellRef = useRef<HTMLButtonElement>(null);
  const isOn = !blind && cell.state === 'on';

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
      aria-label={blind ? `Sala ${cell.row + 1},${cell.column + 1}` : `Sala ${cell.row + 1},${cell.column + 1}: ${isOn ? 'encendida' : 'apagada'}`}
      aria-pressed={blind ? undefined : isOn}
      className={'lab-cell' + (isOn ? ' on' : '')}
      data-board-cell
      data-testid={`cell-${cell.row}-${cell.column}`}
      disabled={disabled}
      role="gridcell"
      style={{ aspectRatio: '1', cursor: disabled ? 'default' : 'pointer' }}
      type="button"
      onClick={handlePress}
    >
      <span className="cell-dot" />
    </button>
  );
});
