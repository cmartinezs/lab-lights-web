import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { createBoardFromSeed } from '../../game/domain/board';
import { R3_DEFAULT_SEED } from '../../game/ui/pages/GamePage';
import { App } from './App';

const CLASSIC_SIZE = { rows: 3, columns: 3 };

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the home screen', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Luces del Laboratorio' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Jugar Classic 3×3' })).toBeInTheDocument();
  });

  it('shows app navigation bar', () => {
    render(<App />);

    expect(screen.getByRole('navigation', { name: 'Navegación principal' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Rank' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Perfil' })).toBeInTheDocument();
  });

  it('navigates to game and shows the board', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Jugar Classic 3×3' }));

    expect(screen.getByRole('grid', { name: 'Tablero 3 por 3' })).toBeInTheDocument();
  });

  it('lets the player win and continue', async () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Jugar Classic 3×3' }));

    const { setupMoves } = createBoardFromSeed(R3_DEFAULT_SEED, CLASSIC_SIZE);
    for (const move of setupMoves) {
      fireEvent.click(screen.getByTestId(`cell-${move.row}-${move.column}`));
    }

    await waitFor(() => {
      expect(screen.getByText('Luces apagadas')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Jugar otra vez' }));

    expect(screen.getByRole('grid', { name: 'Tablero 3 por 3' })).toBeInTheDocument();
  });

  it('saves the result with arcade initials and updates ranking', async () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Jugar Classic 3×3' }));

    const { setupMoves } = createBoardFromSeed(R3_DEFAULT_SEED, CLASSIC_SIZE);
    for (const move of setupMoves) {
      fireEvent.click(screen.getByTestId(`cell-${move.row}-${move.column}`));
    }

    await waitFor(() => {
      expect(screen.getByText('Luces apagadas')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Registrar iniciales' }));

    fireEvent.click(screen.getByRole('button', { name: 'Inicial 1: L' }));
    fireEvent.click(screen.getByRole('button', { name: 'C' }));
    fireEvent.click(screen.getByRole('button', { name: 'M' }));
    fireEvent.click(screen.getByRole('button', { name: 'S' }));
    fireEvent.click(screen.getByRole('button', { name: 'Grabar resultado' }));

    expect(screen.getByRole('alert')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Ver ranking' }));

    expect(screen.getByRole('heading', { name: 'Mejores registros' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem').filter((el) => el.tagName === 'LI' && el.closest('ol'))).toHaveLength(1);
    expect(screen.getByText('CMS')).toBeInTheDocument();
  });

  it('navigates to rankings page', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Rank' }));

    expect(screen.getByRole('heading', { name: 'Mejores registros' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Volver' }));

    expect(screen.getByRole('heading', { name: 'Luces del Laboratorio' })).toBeInTheDocument();
  });

  it('navigates to profile page', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Perfil' }));

    expect(screen.getByRole('heading', { name: 'Jugadores' })).toBeInTheDocument();
  });

  it('navigates to settings page via profile', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Perfil' }));
    fireEvent.click(screen.getByRole('button', { name: 'Preferencias' }));

    expect(screen.getByRole('heading', { name: 'Preferencias' })).toBeInTheDocument();
  });
});
