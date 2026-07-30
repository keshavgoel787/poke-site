import { render, screen, within } from '@testing-library/react';
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

it('renders the Trainer Card and Experience roster together on the root route', () => {
  renderApp('/');

  expect(screen.getByRole('heading', { name: 'Trainer Card' })).toBeVisible();
  expect(screen.getByRole('heading', { name: "Keshav's Pokémon" })).toBeVisible();
  expect(screen.getByRole('tab', { name: 'Experience' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  expect(screen.getByRole('button', { name: 'Draftion: DraftKings' })).toBeVisible();
  expect(screen.queryByRole('link', { name: "Keshav's Pokémon" })).not.toBeInTheDocument();
  expect(screen.getAllByRole('main')).toHaveLength(1);
  expect(screen.getByTestId('current-route')).toHaveTextContent(/^\/$/);
});

it('keeps the Trainer Card content on the root route', () => {
  renderApp('/');

  expect(screen.getByRole('heading', { name: 'Keshav Goel' })).toBeVisible();
  expect(screen.getByText('Northeastern University')).toBeVisible();
  expect(screen.getByText('May 2028')).toBeVisible();
  expect(screen.getByText('Data Science')).toBeVisible();
  expect(screen.getByText('Boston, MA')).toBeVisible();
  expect(screen.getByRole('img', { name: 'Keshav walking with Gengar' })).toBeVisible();
  expect(screen.getByRole('link', { name: /résumé/i })).toHaveAttribute('href', '/resume.pdf');
  expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
    'href',
    'https://github.com/keshavgoel787',
  );
  expect(screen.getByRole('link', { name: /linkedin/i })).toHaveAttribute(
    'href',
    'https://www.linkedin.com/in/goel-keshav',
  );
  expect(screen.getByRole('link', { name: /email/i })).toHaveAttribute(
    'href',
    'mailto:kgoel9657@gmail.com',
  );
});

it('reconstructs the DraftKings dialog from its direct route', () => {
  renderApp('/pokemon/experience/draftkings');

  const dialog = screen.getByRole('dialog', { name: 'Draftion details' });

  expect(screen.getByRole('heading', { name: 'Trainer Card', hidden: true })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: "Keshav's Pokémon", hidden: true })).toBeInTheDocument();
  expect(screen.getByTestId('current-route')).toHaveTextContent(
    '/pokemon/experience/draftkings',
  );
  expect(within(dialog).getByRole('heading', { name: 'DraftKings' })).toBeVisible();
  expect(within(dialog).getByText('Software Engineering Intern')).toBeVisible();
  expect(within(dialog).getByText('Jun 2026 - Present')).toBeVisible();
  expect(within(dialog).getByText('Boston, MA')).toBeVisible();
  expect(within(dialog).getByText(/20\+ hrs\/week/i)).toBeVisible();
  expect(within(dialog).getAllByRole('listitem', { name: /move:/i })).toHaveLength(5);
});

it('reconstructs the Remetra dialog from its direct route', () => {
  renderApp('/pokemon/projects/remetra');

  const dialog = screen.getByRole('dialog', { name: 'Remetrix details' });

  expect(screen.getByRole('heading', { name: 'Trainer Card', hidden: true })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: "Keshav's Pokémon", hidden: true })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: 'Projects' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  expect(screen.getByTestId('current-route')).toHaveTextContent('/pokemon/projects/remetra');
  expect(within(dialog).getByRole('heading', { name: 'Remetra' })).toBeVisible();
  expect(within(dialog).getByText('Autoimmune symptom-tracking application')).toBeVisible();
  expect(within(dialog).getByText(/250 users logging 10K\+ entries/i)).toBeVisible();
  expect(within(dialog).getAllByRole('listitem', { name: /move:/i })).toHaveLength(5);
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

it('redirects the retained DraftKings legacy route to its pokemon dialog', () => {
  renderApp('/pc/experience/draftkings');

  expect(screen.getByTestId('current-route')).toHaveTextContent(
    '/pokemon/experience/draftkings',
  );
  const dialog = screen.getByRole('dialog', { name: 'Draftion details' });
  expect(within(dialog).getByRole('heading', { name: 'DraftKings' })).toBeVisible();
});

it('redirects a catch-all route to the Trainer Card', () => {
  renderApp('/not-a-route');

  expect(screen.getByTestId('current-route')).toHaveTextContent('/');
  expect(screen.getByRole('heading', { name: 'Trainer Card' })).toBeVisible();
});
