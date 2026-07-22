import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TrainerProfile } from './TrainerProfile';

it('presents Keshav\'s Trainer Card and professional destinations', () => {
  render(
    <MemoryRouter>
      <TrainerProfile />
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { name: 'Trainer Card' })).toBeVisible();
  expect(screen.getByText('Keshav Goel')).toBeVisible();
  expect(screen.getByText('Northeastern University')).toBeVisible();
  expect(screen.getByText('May 2028')).toBeVisible();
  expect(screen.getByText('Data Science')).toBeVisible();
  expect(screen.getByText('Boston, MA')).toBeVisible();
  expect(screen.getByRole('img', { name: 'Pixel avatar of Keshav Goel' })).toBeVisible();
  expect(screen.getByRole('link', { name: /résumé/i })).toHaveAttribute('href', '/resume.pdf');
  expect(screen.getByRole('link', { name: "Keshav's Pokémon" })).toHaveAttribute(
    'href',
    '/pokemon/experience',
  );
  expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
    'href',
    expect.stringContaining('github.com'),
  );
  expect(screen.getByRole('link', { name: /linkedin/i })).toHaveAttribute(
    'href',
    expect.stringContaining('linkedin.com'),
  );
  expect(screen.getByRole('link', { name: /email/i })).toHaveAttribute(
    'href',
    expect.stringMatching(/^mailto:/),
  );
});
