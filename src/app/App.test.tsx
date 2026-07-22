import { render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { beforeEach, vi } from 'vitest';
import { App } from './App';

beforeEach(() => {
  const values = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  });
});

function LocationProbe() {
  return <span data-testid="current-route">{useLocation().pathname}</span>;
}

function renderApp(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
      <LocationProbe />
    </MemoryRouter>,
  );
}

it('renders Keshav identity on the root route', () => {
  renderApp('/');

  expect(screen.getByRole('heading', { name: /keshav goel/i })).toBeVisible();
});

it('loads the selected project from a pokemon direct route', () => {
  renderApp('/pokemon/projects/forgetmenot');

  expect(screen.getByRole('tab', { name: 'Projects' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  expect(screen.getByRole('heading', { name: 'ForgetMeNot' })).toBeVisible();
});

it('recovers an unknown project route to the Projects roster', () => {
  renderApp('/pokemon/projects/missing');

  expect(screen.getByRole('status')).toHaveTextContent(
    'That PC entry could not be found. Showing Projects.',
  );
  expect(screen.getByTestId('current-route')).toHaveTextContent('/pokemon/projects');
  expect(screen.getByRole('tab', { name: 'Projects' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  expect(screen.getByRole('button', { name: 'Remetrix: Remetra' })).toBeVisible();
});

it('redirects retained legacy entries to their pokemon routes', () => {
  renderApp('/pc/experience/draftkings');

  expect(screen.getByTestId('current-route')).toHaveTextContent(
    '/pokemon/experience/draftkings',
  );
  expect(screen.getByRole('heading', { name: 'DraftKings' })).toBeVisible();
});

it('redirects trainer-only legacy routes and unknown routes to the trainer card', () => {
  const { unmount } = renderApp('/pc/trainer/interests');

  expect(screen.getByTestId('current-route')).toHaveTextContent('/');
  expect(screen.getByRole('heading', { name: /keshav goel/i })).toBeVisible();

  unmount();
  renderApp('/not-a-route');

  expect(screen.getByTestId('current-route')).toHaveTextContent('/');
  expect(screen.getByRole('heading', { name: /keshav goel/i })).toBeVisible();
});
