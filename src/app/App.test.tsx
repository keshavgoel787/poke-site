import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from './App';

it('renders Keshav identity on the root route', () => {
  render(<MemoryRouter initialEntries={['/']}><App /></MemoryRouter>);
  expect(screen.getByRole('heading', { name: /keshav goel/i })).toBeVisible();
});
