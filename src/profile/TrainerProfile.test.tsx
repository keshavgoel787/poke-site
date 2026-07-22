import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TrainerProfile } from './TrainerProfile';

it('presents Keshav\'s positioning and professional destinations', () => {
  render(
    <MemoryRouter>
      <TrainerProfile />
    </MemoryRouter>,
  );

  expect(
    screen.getByText(/software engineering.*data.*ml.*ai/i),
  ).toBeVisible();
  expect(screen.getByRole('link', { name: /résumé/i })).toHaveAttribute('href', '/resume.pdf');
  expect(screen.getByRole('link', { name: /open keshav\'s pc/i })).toHaveAttribute(
    'href',
    '/pc/experience',
  );
  expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
    'href',
    expect.stringContaining('github.com'),
  );
});
