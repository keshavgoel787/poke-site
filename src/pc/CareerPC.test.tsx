import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { beforeEach, vi } from 'vitest';
import { CareerPC } from './CareerPC';

function installWorkingAudioContext() {
  const oscillator = {
    type: 'sine',
    frequency: { setValueAtTime: vi.fn() },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    addEventListener: vi.fn(),
  };
  const gain = {
    gain: {
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    },
    connect: vi.fn(),
  };
  const context = {
    currentTime: 4,
    destination: {},
    state: 'running',
    createOscillator: vi.fn(() => oscillator),
    createGain: vi.fn(() => gain),
    resume: vi.fn(() => Promise.resolve()),
    close: vi.fn(() => Promise.resolve()),
  };
  const AudioContext = vi.fn(function AudioContext() {
    return context;
  });

  vi.stubGlobal('AudioContext', AudioContext);

  return { AudioContext, context, gain, oscillator };
}

function LocationProbe() {
  const location = useLocation();

  return <span data-testid="current-route">{location.pathname}</span>;
}

function HistoryBack() {
  const navigate = useNavigate();

  return <button onClick={() => navigate(-1)}>Back in history</button>;
}

function HistoryForward() {
  const navigate = useNavigate();

  return <button onClick={() => navigate(1)}>Forward in history</button>;
}

function NavigateToProjects() {
  const navigate = useNavigate();

  return <button onClick={() => navigate('/pokemon/projects')}>Navigate to projects</button>;
}

function renderCareerPC(path: string, priorPath?: string, nextPath?: string) {
  const entries = [priorPath, path, nextPath].filter(
    (entry): entry is string => entry !== undefined,
  );
  const initialIndex = priorPath ? 1 : 0;

  return render(
    <MemoryRouter initialEntries={entries} initialIndex={initialIndex}>
      <Routes>
        <Route
          path="/pokemon/:tab/:entryId?"
          element={
            <>
              <CareerPC />
              <LocationProbe />
              <HistoryBack />
              <HistoryForward />
              <NavigateToProjects />
            </>
          }
        />
        <Route path="/before-pc" element={<LocationProbe />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('CareerPC', () => {
  beforeEach(() => {
    const values = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    });
  });

  it('shows three roster tabs and current experience party', () => {
    renderCareerPC('/pokemon/experience/amazon');

    expect(screen.getAllByRole('tab', { hidden: true })).toHaveLength(3);
    expect(screen.getByRole('tab', { name: 'Experience', hidden: true })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(
      screen.getByRole('button', { name: 'DraftKings', hidden: true }),
    ).toBeVisible();
    expect(screen.queryByText('Generate')).not.toBeInTheDocument();
    expect(screen.queryByText('VDart')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'AWS details' })).toBeVisible();
    expect(screen.getAllByRole('listitem', { name: /move:/i }).length).toBeGreaterThan(0);
  });

  it('presents each party member with curated metadata and a completion bar', async () => {
    const user = userEvent.setup();
    renderCareerPC('/pokemon/experience');
    const draftKings = screen.getByRole('button', {
      name: 'DraftKings',
      hidden: true,
    });

    expect(draftKings).toHaveTextContent('DraftKings');
    expect(within(draftKings).getAllByText('DraftKings')).toHaveLength(1);
    expect(draftKings).not.toHaveTextContent('Draftion');
    expect(draftKings).toHaveTextContent('Software Engineering Intern');
    expect(draftKings).toHaveTextContent('Jun 2026 - Aug 2026');
    expect(draftKings).toHaveAccessibleName('DraftKings');
    expect(draftKings).toHaveAccessibleDescription('Entry complete');
    expect(draftKings).not.toHaveTextContent(/\b(?:HP|level|gender)\b/i);

    await user.click(screen.getByRole('tab', { name: 'Projects' }));

    expect(screen.getByText('React · Supabase · FastAPI')).toBeVisible();
    expect(screen.getByText('FastAPI · Snowflake · Gemini')).toBeVisible();
    expect(screen.getByText('Flutter · Dart · Google Maps')).toBeVisible();
    expect(screen.queryByText('Project')).not.toBeInTheDocument();
  });

  it('renders sprites in the creature grid and selected entry', () => {
    renderCareerPC('/pokemon/experience/amazon');

    expect(screen.getAllByRole('img', { name: 'AWS', hidden: true })).toHaveLength(2);
    expect(screen.getByRole('img', { name: 'DraftKings', hidden: true })).toBeVisible();
  });

  it('animates every roster sprite before and after selecting another entry', async () => {
    const user = userEvent.setup();
    renderCareerPC('/pokemon/experience');
    const careerEntries = screen.getByRole('list', { name: 'Career entries' });

    expect(careerEntries.querySelectorAll('.pixel-sprite')).not.toHaveLength(0);
    for (const sprite of careerEntries.querySelectorAll('.pixel-sprite')) {
      expect(sprite).toHaveAttribute('data-animate', 'true');
    }

    await user.click(screen.getByRole('button', { name: 'DraftKings' }));

    for (const sprite of careerEntries.querySelectorAll('.pixel-sprite')) {
      expect(sprite).toHaveAttribute('data-animate', 'true');
    }
  });

  it('opens a selected card dialog without changing the active tab route', async () => {
    const user = userEvent.setup();
    renderCareerPC('/pokemon/experience');

    await user.click(screen.getByRole('button', { name: 'DraftKings' }));

    expect(screen.getByTestId('current-route')).toHaveTextContent(
      /^\/pokemon\/experience$/,
    );
    expect(screen.getByRole('dialog', { name: 'DraftKings details' })).toBeVisible();
  });

  it('keeps sound off until the quick menu sound control is clicked', async () => {
    const user = userEvent.setup();
    const audio = installWorkingAudioContext();
    renderCareerPC('/pokemon/experience');
    const sound = screen.getByRole('button', { name: /sound/i });

    expect(sound).toHaveAttribute('aria-pressed', 'false');
    expect(audio.AudioContext).not.toHaveBeenCalled();

    await user.click(sound);

    expect(sound).toHaveAttribute('aria-pressed', 'true');
    expect(audio.AudioContext).toHaveBeenCalledTimes(1);
    expect(audio.context.createOscillator).toHaveBeenCalledTimes(1);
    expect(audio.context.createGain).toHaveBeenCalledTimes(1);
    expect(audio.oscillator.type).toBe('square');
    expect(audio.oscillator.connect).toHaveBeenCalledWith(audio.gain);
    expect(audio.gain.connect).toHaveBeenCalledWith(audio.context.destination);
    expect(audio.oscillator.start).toHaveBeenCalledWith(4);
    expect(audio.oscillator.stop).toHaveBeenCalledWith(4.07);
    expect(audio.gain.gain.exponentialRampToValueAtTime).toHaveBeenCalledWith(
      0.0001,
      4.07,
    );
  });

  it('plays enabled sound only for user-initiated menu, tab, and grid actions', async () => {
    const user = userEvent.setup();
    const audio = installWorkingAudioContext();
    renderCareerPC('/pokemon/experience');

    await user.click(screen.getByRole('button', { name: /sound/i }));
    await user.click(screen.getByRole('tab', { name: /projects/i }));
    await user.click(screen.getByRole('button', { name: 'ForgetMeNot' }));

    expect(audio.AudioContext).toHaveBeenCalledTimes(3);
  });

  it('does not play stored-on sound during hydration or recovered navigation', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem('career-pc:sound', 'on');
    const audio = installWorkingAudioContext();

    renderCareerPC('/pokemon/projects/missing');

    expect(screen.getByRole('button', { name: /sound/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(audio.AudioContext).not.toHaveBeenCalled();

    await user.click(screen.getByRole('tab', { name: /experience/i }));

    expect(audio.AudioContext).toHaveBeenCalledTimes(1);
  });

  it('ignores audio construction errors while enabling sound', async () => {
    const user = userEvent.setup();
    const AudioContext = vi.fn(function AudioContext() {
      throw new DOMException('Audio is blocked', 'NotAllowedError');
    });
    vi.stubGlobal('AudioContext', AudioContext);
    renderCareerPC('/pokemon/experience');

    await user.click(screen.getByRole('button', { name: /sound/i }));

    expect(AudioContext).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: /sound/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('ignores an unavailable Web Audio API while enabling sound', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('AudioContext', undefined);
    renderCareerPC('/pokemon/experience');

    await user.click(screen.getByRole('button', { name: /sound/i }));

    expect(screen.getByRole('button', { name: /sound/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('renders an embeddable roster section with sound controls', () => {
    renderCareerPC('/pokemon/experience');

    expect(screen.getByRole('region', { name: "Keshav's Pokémon", hidden: true })).toHaveClass(
      'career-pc',
    );
    expect(screen.queryByRole('link', { name: /back to trainer card/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sound/i, hidden: true })).toBeVisible();
    expect(screen.queryByRole('navigation', { name: /quick menu/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('main')).not.toBeInTheDocument();
  });

  it('opens a box route from its tab', async () => {
    const user = userEvent.setup();
    renderCareerPC('/pokemon/experience');

    await user.click(screen.getByRole('tab', { name: /projects/i }));

    expect(screen.getByTestId('current-route')).toHaveTextContent('/pokemon/projects');
    expect(screen.getByRole('tab', { name: /projects/i })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Remetra' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'ForgetMeNot' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'BreatheEasy' })).toBeVisible();
  });

  it('shows six informational Interest cards without opening professional dialogs', async () => {
    const user = userEvent.setup();
    renderCareerPC('/pokemon/experience');

    expect(screen.getAllByRole('tab')).toHaveLength(3);
    await user.click(screen.getByRole('tab', { name: 'Interests' }));

    expect(screen.getByTestId('current-route')).toHaveTextContent('/pokemon/interests');
    const list = screen.getByRole('list', { name: 'Interest entries' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(6);
    expect(within(list).queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('Fundraising & Academic Lead')).toBeVisible();
    expect(screen.getByText('Pokémon · Destiny 2 · League')).toBeVisible();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('keeps every box tab associated with the mounted active panel', () => {
    renderCareerPC('/pokemon/experience');

    for (const tab of screen.getAllByRole('tab')) {
      const panelId = tab.getAttribute('aria-controls');

      expect(panelId).toBeTruthy();
      expect(document.getElementById(panelId!)).toBe(screen.getByRole('tabpanel'));
    }
  });

  it('moves focus between box tabs with arrows, Home, and End', async () => {
    const user = userEvent.setup();
    renderCareerPC('/pokemon/experience');
    const experience = screen.getByRole('tab', { name: /experience/i });
    const projects = screen.getByRole('tab', { name: /projects/i });
    const interests = screen.getByRole('tab', { name: /interests/i });

    act(() => experience.focus());
    await user.keyboard('{End}');
    expect(interests).toHaveFocus();

    await user.keyboard('{Home}');
    expect(experience).toHaveFocus();

    await user.keyboard('{ArrowLeft}');
    expect(interests).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    expect(experience).toHaveFocus();
  });

  it('activates a focused box tab with Space without scrolling', async () => {
    const user = userEvent.setup();
    const audio = installWorkingAudioContext();
    renderCareerPC('/pokemon/experience');
    const projects = screen.getByRole('tab', { name: /projects/i });

    await user.click(screen.getByRole('button', { name: /sound/i }));
    act(() => projects.focus());

    expect(fireEvent.keyDown(projects, { key: ' ', code: 'Space' })).toBe(false);
    expect(screen.getByTestId('current-route')).toHaveTextContent('/pokemon/projects');
    expect(projects).toHaveFocus();
    expect(audio.AudioContext).toHaveBeenCalledTimes(2);
  });

  it('retains native Enter activation for a focused box tab', async () => {
    const user = userEvent.setup();
    renderCareerPC('/pokemon/experience');
    const projects = screen.getByRole('tab', { name: /projects/i });

    act(() => projects.focus());
    await user.keyboard('{Enter}');

    expect(screen.getByTestId('current-route')).toHaveTextContent('/pokemon/projects');
    expect(projects).toHaveFocus();
  });

  it('moves grid focus with the arrow keys', async () => {
    const user = userEvent.setup();
    renderCareerPC('/pokemon/experience');
    const amazon = screen.getByRole('button', { name: 'AWS' });
    const draftKings = screen.getByRole('button', { name: 'DraftKings' });

    amazon.focus();
    await user.keyboard('{ArrowRight}');

    expect(draftKings).toHaveFocus();
  });

  it('selects a focused grid item with Enter', async () => {
    const user = userEvent.setup();
    renderCareerPC('/pokemon/experience');
    const amazon = screen.getByRole('button', { name: 'AWS' });
    const draftKings = screen.getByRole('button', { name: 'DraftKings' });

    amazon.focus();
    await user.keyboard('{ArrowRight}{Enter}');

    expect(draftKings).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('current-route')).toHaveTextContent(/^\/pokemon\/experience$/);
    expect(screen.getByRole('dialog', { name: 'DraftKings details' })).toBeVisible();
  });

  it('wraps grid focus and selects a focused item with Space', async () => {
    const user = userEvent.setup();
    renderCareerPC('/pokemon/projects');
    const breatheEasy = screen.getByRole('button', { name: 'BreatheEasy' });
    const forgetMeNot = screen.getByRole('button', { name: 'ForgetMeNot' });

    breatheEasy.focus();
    await user.keyboard('{ArrowLeft} ');

    expect(forgetMeNot).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('current-route')).toHaveTextContent(/^\/pokemon\/projects$/);
    expect(screen.getByRole('dialog', { name: 'ForgetMeNot details' })).toBeVisible();
  });

  it('recovers an invalid entry by replacing it with a canonical route', async () => {
    const user = userEvent.setup();
    renderCareerPC('/pokemon/projects/not-a-project', '/before-pc');

    expect(screen.getByRole('status')).toHaveTextContent(
      'That PC entry could not be found. Showing Projects.',
    );
    expect(screen.getByTestId('current-route')).toHaveTextContent('/pokemon/projects');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /back in history/i }));

    expect(screen.getByTestId('current-route')).toHaveTextContent('/before-pc');
  });

  it('names the fallback box while recovering an invalid box route', () => {
    renderCareerPC('/pokemon/not-a-box/missing');

    expect(screen.getByRole('status')).toHaveTextContent(
      'That PC entry could not be found. Showing Experience.',
    );
    expect(screen.getByRole('tab', { name: /experience/i })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('reconstructs the selected entry dialog from a direct URL', () => {
    renderCareerPC('/pokemon/experience/draftkings');
    const dialog = screen.getByRole('dialog', { name: 'DraftKings details' });

    expect(dialog).toBeVisible();
    expect(screen.getByRole('tabpanel', { hidden: true })).toHaveAttribute('inert');
    expect(screen.getByRole('tabpanel', { hidden: true })).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(screen.getByRole('heading', { name: 'DraftKings' })).toBeVisible();
    expect(within(dialog).getByText('Jun 2026 - Aug 2026')).toBeVisible();
    expect(within(dialog).getByText('Boston, MA')).toBeVisible();
  });

  it('closes the dialog with Escape to the active tab route using replace', async () => {
    const user = userEvent.setup();
    renderCareerPC('/pokemon/experience/draftkings', '/before-pc');
    const selectedCard = screen.getByRole('button', {
      name: 'DraftKings',
      hidden: true,
    });

    await user.keyboard('{Escape}');

    expect(screen.getByTestId('current-route')).toHaveTextContent(/^\/pokemon\/experience$/);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(selectedCard).toHaveFocus();

    await user.click(screen.getByRole('button', { name: /back in history/i }));
    expect(screen.getByTestId('current-route')).toHaveTextContent('/before-pc');
  });

  it('restores focus to the selected card after closing a direct-route dialog', async () => {
    const user = userEvent.setup();
    renderCareerPC('/pokemon/projects/remetra');
    const selectedCard = screen.getByRole('button', {
      name: 'Remetra',
      hidden: true,
    });

    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.getByTestId('current-route')).toHaveTextContent('/pokemon/projects');
    expect(selectedCard).toHaveFocus();
  });

  it('closes a locally selected dialog without changing history and restores launcher focus', async () => {
    const user = userEvent.setup();
    renderCareerPC('/pokemon/experience', '/before-pc');
    const launcher = screen.getByRole('button', { name: 'DraftKings' });

    await user.click(launcher);
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.getByTestId('current-route')).toHaveTextContent('/pokemon/experience');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(launcher).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'Experience' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await user.click(screen.getByRole('button', { name: 'Back in history' }));
    expect(screen.getByTestId('current-route')).toHaveTextContent('/before-pc');
  });

  it('closes a locally selected dialog with Escape without changing history and restores launcher focus', async () => {
    const user = userEvent.setup();
    renderCareerPC('/pokemon/experience', '/before-pc');
    const launcher = screen.getByRole('button', { name: 'DraftKings' });

    await user.click(launcher);
    await user.keyboard('{Escape}');

    expect(screen.getByTestId('current-route')).toHaveTextContent('/pokemon/experience');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(launcher).toHaveFocus();

    await user.click(screen.getByRole('button', { name: 'Back in history' }));
    expect(screen.getByTestId('current-route')).toHaveTextContent('/before-pc');
  });

  it('closes a locally selected dialog from its backdrop without changing history and restores launcher focus', async () => {
    const user = userEvent.setup();
    renderCareerPC('/pokemon/experience', '/before-pc');
    const launcher = screen.getByRole('button', { name: 'DraftKings' });

    await user.click(launcher);
    const dialog = screen.getByRole('dialog', { name: 'DraftKings details' });
    vi.spyOn(dialog, 'getBoundingClientRect').mockReturnValue({
      left: 100,
      right: 500,
      top: 100,
      bottom: 500,
      width: 400,
      height: 400,
      x: 100,
      y: 100,
      toJSON: () => ({}),
    });

    fireEvent.click(dialog, { clientX: 50, clientY: 50 });

    expect(screen.getByTestId('current-route')).toHaveTextContent('/pokemon/experience');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(launcher).toHaveFocus();

    await user.click(screen.getByRole('button', { name: 'Back in history' }));
    expect(screen.getByTestId('current-route')).toHaveTextContent('/before-pc');
  });

  it('clears local selection across same-tab history navigation to direct entry routes', async () => {
    const user = userEvent.setup();
    renderCareerPC(
      '/pokemon/experience',
      '/pokemon/experience/amazon',
      '/pokemon/experience/draftkings',
    );

    await user.click(screen.getByRole('button', { name: 'DraftKings' }));
    await user.click(screen.getByRole('button', { name: 'Back in history' }));

    expect(screen.getByTestId('current-route')).toHaveTextContent('/pokemon/experience/amazon');
    expect(screen.getByRole('dialog', { name: 'AWS details' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Forward in history' }));
    expect(screen.getByTestId('current-route')).toHaveTextContent('/pokemon/experience');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Forward in history' }));
    expect(screen.getByTestId('current-route')).toHaveTextContent(
      '/pokemon/experience/draftkings',
    );
    expect(screen.getByRole('dialog', { name: 'DraftKings details' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.getByTestId('current-route')).toHaveTextContent('/pokemon/experience');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('clears local selection before recovering a same-tab invalid entry route', async () => {
    const user = userEvent.setup();
    renderCareerPC('/pokemon/experience', '/pokemon/experience/missing');

    await user.click(screen.getByRole('button', { name: 'DraftKings' }));
    await user.click(screen.getByRole('button', { name: 'Back in history' }));

    expect(screen.getByTestId('current-route')).toHaveTextContent('/pokemon/experience');
    expect(screen.getByRole('status')).toHaveTextContent(
      'That PC entry could not be found. Showing Experience.',
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('clears a local dialog when navigating to another tab route', async () => {
    const user = userEvent.setup();
    renderCareerPC('/pokemon/experience');

    await user.click(screen.getByRole('button', { name: 'DraftKings' }));
    expect(screen.getByRole('dialog', { name: 'DraftKings details' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Navigate to projects' }));

    expect(screen.getByTestId('current-route')).toHaveTextContent('/pokemon/projects');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
