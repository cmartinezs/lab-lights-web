import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { createClassicBoardFromSeed } from '../../game/domain/board';
import { R1_DEFAULT_SEED } from '../../game/ui/pages/ClassicGamePage';
import { App } from './App';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the R1 Classic local game', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Luces del Laboratorio' })).toBeInTheDocument();
    expect(screen.getByText('R1 · Classic 3x3')).toBeInTheDocument();
    expect(screen.getByText('0:00.0')).toBeInTheDocument();
    expect(screen.getByRole('grid', { name: 'Tablero Classic 3 por 3' })).toBeInTheDocument();
  });

  it('lets the player win and repeat the local loop', () => {
    render(<App />);

    const { setupMoves } = createClassicBoardFromSeed(R1_DEFAULT_SEED);

    for (const move of setupMoves) {
      fireEvent.click(screen.getByTestId(`cell-${move.row}-${move.column}`));
    }

    expect(screen.getByRole('dialog', { name: 'Laboratorio apagado' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Grabar' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Repetir' }));

    expect(screen.queryByRole('heading', { name: 'Laboratorio apagado' })).not.toBeInTheDocument();
    expect(screen.getByText('En curso')).toBeInTheDocument();
  });

  it('saves the result with arcade initials', () => {
    render(<App />);

    const { setupMoves } = createClassicBoardFromSeed(R1_DEFAULT_SEED);

    for (const move of setupMoves) {
      fireEvent.click(screen.getByTestId(`cell-${move.row}-${move.column}`));
    }

    fireEvent.click(screen.getByRole('button', { name: 'Inicial 1: L' }));
    fireEvent.click(screen.getByRole('button', { name: 'C' }));
    fireEvent.click(screen.getByRole('button', { name: 'M' }));
    fireEvent.click(screen.getByRole('button', { name: 'S' }));
    fireEvent.click(screen.getByRole('button', { name: 'Grabar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Grabado' }));

    expect(screen.getByRole('button', { name: 'Grabado' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Nuevo' }));
    fireEvent.click(screen.getByRole('button', { name: 'Ranking local' }));

    expect(screen.getByRole('dialog', { name: 'Mejores registros' })).toBeInTheDocument();
    expect(screen.getAllByText('CMS')).toHaveLength(1);
  });
});
