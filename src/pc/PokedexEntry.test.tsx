import { render, screen, within } from '@testing-library/react';
import { careerBoxes, type CareerEntry } from '../data/portfolioData';
import { PokedexEntry } from './PokedexEntry';

const amazon = careerBoxes[0].entries[0];

describe('PokedexEntry', () => {
  it('shows the creature name while keeping the organization as its heading', () => {
    render(<PokedexEntry entry={amazon} />);
    const entry = screen.getByRole('article');

    expect(within(entry).getByRole('heading', { name: 'Amazon' })).toBeVisible();
    expect(within(entry).getByText('Creature: Amazoar')).toBeVisible();
  });

  it('renders the optional entry link when one is provided', () => {
    const linkedEntry: CareerEntry = {
      ...amazon,
      link: { label: 'View Amazon', href: 'https://example.com/amazon' },
    };

    render(<PokedexEntry entry={linkedEntry} />);

    expect(screen.getByRole('link', { name: 'View Amazon' })).toHaveAttribute(
      'href',
      'https://example.com/amazon',
    );
  });

  it('does not render an entry link when one is not provided', () => {
    render(<PokedexEntry entry={amazon} />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
