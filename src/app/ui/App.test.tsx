import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('renders the R0 foundation screen', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Luces del Laboratorio' })).toBeInTheDocument();
    expect(screen.getByText('R0 · Fundación técnica')).toBeInTheDocument();
  });
});
