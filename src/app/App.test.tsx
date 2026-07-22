import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, vi } from 'vitest';
import { App } from './App';

beforeEach(() => {
  const values = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  });
});

it('renders Keshav identity on the root route', () => {
  render(<MemoryRouter initialEntries={['/']}><App /></MemoryRouter>);
  expect(screen.getByRole('heading', { name: /keshav goel/i })).toBeVisible();
});

it('loads the selected project from a direct route', () => {
  render(<MemoryRouter initialEntries={['/pc/projects/forgetmenot']}><App /></MemoryRouter>);

  expect(screen.getByRole('tab', { name: 'Projects' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  expect(screen.getByRole('heading', { name: 'ForgetMeNot' })).toBeVisible();
});

it('recovers an unknown project route to the Projects box', () => {
  render(<MemoryRouter initialEntries={['/pc/projects/missing']}><App /></MemoryRouter>);

  expect(screen.getByRole('status')).toHaveTextContent(
    'That PC entry could not be found. Showing Box 1.',
  );
  expect(screen.getByRole('tab', { name: 'Projects' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
});
