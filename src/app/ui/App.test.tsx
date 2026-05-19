import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { createClassicBoardFromSeed } from '../../game/domain/board';
import { R2_DEFAULT_SEED } from '../../game/ui/pages/ClassicGamePage';
import { App } from './App';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the R2 Classic local game', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Luces del Laboratorio' })).toBeInTheDocument();
    expect(screen.getByText('R2 · Classic 3×3')).toBeInTheDocument();
    expect(screen.getByText('0:00.0')).toBeInTheDocument();
    expect(screen.getByRole('grid', { name: 'Tablero Classic 3 por 3' })).toBeInTheDocument();
  });

  it('shows app navigation bar', () => {
    render(<App />);

    expect(screen.getByRole('navigation', { name: 'Navegación principal' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ranking' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Perfil' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Config' })).toBeInTheDocument();
  });

  it('lets the player win and repeat the local loop', () => {
    render(<App />);

    const { setupMoves } = createClassicBoardFromSeed(R2_DEFAULT_SEED);

    for (const move of setupMoves) {
      fireEvent.click(screen.getByTestId(`cell-${move.row}-${move.column}`));
    }

    expect(screen.getByRole('dialog', { name: 'Laboratorio apagado' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Grabar' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Repetir' }));

    expect(screen.queryByRole('heading', { name: 'Laboratorio apagado' })).not.toBeInTheDocument();
    expect(screen.getByText('En curso')).toBeInTheDocument();
  });

  it('saves the result with arcade initials and updates profile stats', () => {
    render(<App />);

    const { setupMoves } = createClassicBoardFromSeed(R2_DEFAULT_SEED);

    for (const move of setupMoves) {
      fireEvent.click(screen.getByTestId(`cell-${move.row}-${move.column}`));
    }

    fireEvent.click(screen.getByRole('button', { name: 'Inicial 1: L' }));
    fireEvent.click(screen.getByRole('button', { name: 'C' }));
    fireEvent.click(screen.getByRole('button', { name: 'M' }));
    fireEvent.click(screen.getByRole('button', { name: 'S' }));
    fireEvent.click(screen.getByRole('button', { name: 'Grabar' }));

    expect(screen.getByRole('button', { name: 'Grabado' })).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: 'Nuevo' }));
    fireEvent.click(screen.getByRole('button', { name: 'Ranking local' }));

    const dialog = screen.getByRole('dialog', { name: 'Mejores registros' });
    expect(dialog).toBeInTheDocument();
    expect(dialog.querySelectorAll('li')).toHaveLength(1);
    expect(dialog.querySelector('li span.text-lab-green')?.textContent).toBe('CMS');
  });

  it('navigates to rankings page', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Ranking' }));

    expect(screen.getByRole('heading', { name: 'Mejores registros' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '← Volver' }));

    expect(screen.getByRole('heading', { name: 'Luces del Laboratorio' })).toBeInTheDocument();
  });

  it('navigates to profile page', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Perfil' }));

    expect(screen.getByRole('heading', { name: 'LAB' })).toBeInTheDocument();
  });

  it('navigates to settings page', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Config' }));

    expect(screen.getByRole('heading', { name: 'Preferencias' })).toBeInTheDocument();
  });
});
