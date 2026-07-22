import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TrainerProfile } from './TrainerProfile';

it('presents Keshav\'s profile fields and professional destinations', () => {
  render(
    <MemoryRouter>
      <TrainerProfile />
    </MemoryRouter>,
  );

  expect(screen.getByText('Northeastern University')).toBeVisible();
  expect(screen.getByText('May 2028')).toBeVisible();
  expect(screen.getByText('Data Science')).toBeVisible();
  expect(screen.getByText('Boston, MA')).toBeVisible();
  expect(screen.getByRole('link', { name: /résumé/i })).toHaveAttribute('href', '/resume.pdf');
  expect(screen.getByRole('link', { name: /open keshav\'s pc/i })).toHaveAttribute(
    'href',
    '/pokemon/experience',
  );
  expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
    'href',
    expect.stringContaining('github.com'),
  );
});
