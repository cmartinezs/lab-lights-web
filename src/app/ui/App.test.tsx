import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createClassicBoardFromSeed } from '../../game/domain/board';
import { R1_DEFAULT_SEED } from '../../game/ui/pages/ClassicGamePage';
import { App } from './App';

describe('App', () => {
  it('renders the R1 Classic local game', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Luces del Laboratorio' })).toBeInTheDocument();
    expect(screen.getByText('R1 · Classic 3x3')).toBeInTheDocument();
    expect(screen.getByRole('grid', { name: 'Tablero Classic 3 por 3' })).toBeInTheDocument();
  });

  it('lets the player win and repeat the local loop', () => {
    render(<App />);

    const { setupMoves } = createClassicBoardFromSeed(R1_DEFAULT_SEED);

    for (const move of setupMoves) {
      fireEvent.click(screen.getByTestId(`cell-${move.row}-${move.column}`));
    }

    expect(screen.getByRole('heading', { name: 'Laboratorio apagado' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Repetir seed' }));

    expect(screen.queryByRole('heading', { name: 'Laboratorio apagado' })).not.toBeInTheDocument();
    expect(screen.getByText('En curso')).toBeInTheDocument();
  });
});
