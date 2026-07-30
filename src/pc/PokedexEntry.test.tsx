import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { rosterTabs, type CareerEntry } from '../data/portfolioData';
import { PokedexEntry } from './PokedexEntry';

const amazon = rosterTabs[0].entries[0];
const draftKings = rosterTabs[0].entries[1];

describe('PokedexEntry', () => {
  it('presents the selected experience as an accessible dialog', () => {
    render(<PokedexEntry entry={draftKings} onClose={vi.fn()} />);
    const entry = screen.getByRole('dialog', { name: 'DraftKings details' });

    expect(entry.tagName).toBe('DIALOG');
    expect(entry).toHaveAttribute('open');
    expect(entry).toHaveClass('pokedex-entry');
    expect(
      within(entry).getByRole('heading', { name: 'DraftKings details', level: 2 }),
    ).toBeVisible();
    expect(within(entry).getByRole('heading', { name: 'DraftKings' })).toBeVisible();
    expect(within(entry).getByText('Jun 2026 - Present')).toBeVisible();
    expect(within(entry).getByText('Boston, MA')).toBeVisible();
    expect(within(entry).getByText(/20\+ hrs\/week/i)).toBeVisible();
    expect(within(entry).getByText('Experience')).toBeVisible();
    expect(within(entry).getByText('Software Engineering Intern')).toBeVisible();
    expect(within(entry).getByText('Software Engineering')).toBeVisible();
    expect(within(entry).getAllByRole('listitem', { name: /move:/i })).toHaveLength(5);
  });

  it('renders the optional entry link when one is provided', () => {
    const linkedEntry: CareerEntry = {
      ...amazon,
      link: { label: 'View Amazon', href: 'https://example.com/amazon' },
    };

    render(<PokedexEntry entry={linkedEntry} onClose={vi.fn()} />);

    expect(screen.getByRole('link', { name: 'View Amazon' })).toHaveAttribute(
      'href',
      'https://example.com/amazon',
    );
  });

  it('does not render an entry link when one is not provided', () => {
    render(<PokedexEntry entry={amazon} onClose={vi.fn()} />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('does not present dates or locations for project entries', () => {
    const projectWithExperienceMetadata: CareerEntry = {
      ...rosterTabs[1].entries[0],
      dates: 'Jan 2026 - Present',
      location: 'Boston, MA',
    };

    render(<PokedexEntry entry={projectWithExperienceMetadata} onClose={vi.fn()} />);

    expect(screen.queryByText('Jan 2026 - Present')).not.toBeInTheDocument();
    expect(screen.queryByText('Boston, MA')).not.toBeInTheDocument();
  });

  it('renders one visible label when a move name and skill are identical', () => {
    render(<PokedexEntry entry={amazon} onClose={vi.fn()} />);
    const move = screen.getByRole('listitem', { name: 'Move: AWS' });

    expect(within(move).getAllByText('AWS')).toHaveLength(1);
  });

  it('keeps a distinct verified skill visible alongside its move name', () => {
    const entryWithDistinctMove: CareerEntry = {
      ...amazon,
      moves: [{ name: 'Graph workflow', skill: 'LangGraph' }],
    };

    render(<PokedexEntry entry={entryWithDistinctMove} onClose={vi.fn()} />);
    const move = screen.getByRole('listitem', { name: 'Move: Graph workflow' });

    expect(within(move).getByText('Graph workflow')).toBeVisible();
    expect(within(move).getByText('LangGraph')).toBeVisible();
  });

  it('focuses Close on open and wraps Tab focus inside the dialog', async () => {
    const user = userEvent.setup();
    const linkedEntry: CareerEntry = {
      ...amazon,
      link: { label: 'View Amazon', href: 'https://example.com/amazon' },
    };

    render(<PokedexEntry entry={linkedEntry} onClose={vi.fn()} />);
    const close = screen.getByRole('button', { name: 'Close' });
    const link = screen.getByRole('link', { name: 'View Amazon' });

    expect(close).toHaveFocus();

    await user.tab();
    expect(link).toHaveFocus();

    await user.tab({ shift: true });
    expect(close).toHaveFocus();
  });

  it('requests close when Escape is pressed', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<PokedexEntry entry={amazon} onClose={onClose} />);

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
