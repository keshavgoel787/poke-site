import { render, screen } from '@testing-library/react';
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

function renderCareerPC(path: string, priorPath?: string) {
  const entries = priorPath ? [priorPath, path] : [path];

  return render(
    <MemoryRouter initialEntries={entries} initialIndex={entries.length - 1}>
      <Routes>
        <Route
          path="/pokemon/:tab/:entryId?"
          element={
            <>
              <CareerPC />
              <LocationProbe />
              <HistoryBack />
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

  it('shows exactly the two professional roster tabs and current experience party', () => {
    renderCareerPC('/pokemon/experience/amazon');

    expect(screen.getAllByRole('tab')).toHaveLength(2);
    expect(screen.getByRole('tab', { name: 'Experience' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Draftion: DraftKings' })).toBeVisible();
    expect(screen.queryByText('Generate')).not.toBeInTheDocument();
    expect(screen.queryByText('VDart')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /amazon/i })).toBeVisible();
    expect(screen.getAllByRole('listitem', { name: /move:/i }).length).toBeGreaterThan(0);
  });

  it('presents each party member with professional details and a completion bar', () => {
    renderCareerPC('/pokemon/experience/draftkings');
    const draftKings = screen.getByRole('button', { name: 'Draftion: DraftKings' });

    expect(draftKings).toHaveTextContent('Draftion');
    expect(draftKings).toHaveTextContent('DraftKings');
    expect(draftKings).toHaveTextContent('Software Engineering Intern');
    expect(draftKings).toHaveTextContent('Experience');
    expect(draftKings).toHaveAccessibleName('Draftion: DraftKings');
    expect(draftKings).toHaveAccessibleDescription('Entry complete');
    expect(draftKings).not.toHaveTextContent(/\b(?:HP|level|gender)\b/i);
  });

  it('renders sprites in the creature grid and selected entry', () => {
    renderCareerPC('/pokemon/experience/amazon');

    expect(screen.getAllByRole('img', { name: 'Amazoar' })).toHaveLength(2);
    expect(screen.getByRole('img', { name: 'Draftion' })).toBeVisible();
  });

  it('keeps sound off until the quick menu sound control is clicked', async () => {
    const user = userEvent.setup();
    const audio = installWorkingAudioContext();
    renderCareerPC('/pokemon/experience/amazon');
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
    renderCareerPC('/pokemon/experience/amazon');

    await user.click(screen.getByRole('button', { name: /sound/i }));
    await user.click(screen.getByRole('tab', { name: /projects/i }));
    await user.click(screen.getByRole('button', { name: /memorai: forgetmenot/i }));

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
    renderCareerPC('/pokemon/experience/amazon');

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
    renderCareerPC('/pokemon/experience/amazon');

    await user.click(screen.getByRole('button', { name: /sound/i }));

    expect(screen.getByRole('button', { name: /sound/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('shows only the roster return and sound controls above the party', () => {
    renderCareerPC('/pokemon/experience/amazon');

    expect(screen.getByRole('link', { name: /back to trainer card/i })).toHaveAttribute(
      'href',
      '/',
    );
    expect(screen.getByRole('button', { name: /sound/i })).toBeVisible();
    expect(screen.queryByRole('navigation', { name: /quick menu/i })).not.toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveAttribute('data-reduced-motion', 'false');
    expect(screen.getByRole('main')).toHaveAttribute('data-booting');
  });

  it('opens a box route from its tab', async () => {
    const user = userEvent.setup();
    renderCareerPC('/pokemon/experience/amazon');

    await user.click(screen.getByRole('tab', { name: /projects/i }));

    expect(screen.getByTestId('current-route')).toHaveTextContent('/pokemon/projects');
    expect(screen.getByRole('tab', { name: /projects/i })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Remetrix: Remetra' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Memorai: ForgetMeNot' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'AeroRoute: BreatheEasy' })).toBeVisible();
  });

  it('keeps every box tab associated with the mounted active panel', () => {
    renderCareerPC('/pokemon/experience/amazon');

    for (const tab of screen.getAllByRole('tab')) {
      const panelId = tab.getAttribute('aria-controls');

      expect(panelId).toBeTruthy();
      expect(document.getElementById(panelId!)).toBe(screen.getByRole('tabpanel'));
    }
  });

  it('moves focus between box tabs with the arrow keys', async () => {
    const user = userEvent.setup();
    renderCareerPC('/pokemon/experience/amazon');
    const experience = screen.getByRole('tab', { name: /experience/i });
    const projects = screen.getByRole('tab', { name: /projects/i });

    experience.focus();
    await user.keyboard('{ArrowRight}');

    expect(projects).toHaveFocus();
  });

  it('moves grid focus with the arrow keys', async () => {
    const user = userEvent.setup();
    renderCareerPC('/pokemon/experience/amazon');
    const amazon = screen.getByRole('button', { name: /amazoar: amazon/i });
    const draftKings = screen.getByRole('button', { name: /draftion: draftkings/i });

    amazon.focus();
    await user.keyboard('{ArrowRight}');

    expect(draftKings).toHaveFocus();
  });

  it('selects a focused grid item with Enter', async () => {
    const user = userEvent.setup();
    renderCareerPC('/pokemon/experience/amazon');
    const amazon = screen.getByRole('button', { name: /amazoar: amazon/i });
    const draftKings = screen.getByRole('button', { name: /draftion: draftkings/i });

    amazon.focus();
    await user.keyboard('{ArrowRight}{Enter}');

    expect(draftKings).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('current-route')).toHaveTextContent(
      '/pokemon/experience/draftkings',
    );
    expect(screen.getByRole('dialog', { name: 'Draftion details' })).toBeVisible();
  });

  it('wraps grid focus and selects a focused item with Space', async () => {
    const user = userEvent.setup();
    renderCareerPC('/pokemon/projects/breathe-easy');
    const breatheEasy = screen.getByRole('button', { name: /aeroroute: breatheeasy/i });
    const forgetMeNot = screen.getByRole('button', { name: /memorai: forgetmenot/i });

    breatheEasy.focus();
    await user.keyboard('{ArrowLeft} ');

    expect(forgetMeNot).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('current-route')).toHaveTextContent(
      '/pokemon/projects/forgetmenot',
    );
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

    expect(screen.getByRole('dialog', { name: 'Draftion details' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'DraftKings' })).toBeVisible();
    expect(screen.getByText('Jun 2026 - Present')).toBeVisible();
    expect(screen.getByText('Boston, MA')).toBeVisible();
  });

  it('closes the dialog with Escape to the active tab route using replace', async () => {
    const user = userEvent.setup();
    renderCareerPC('/pokemon/experience/draftkings', '/before-pc');

    await user.keyboard('{Escape}');

    expect(screen.getByTestId('current-route')).toHaveTextContent(/^\/pokemon\/experience$/);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /back in history/i }));
    expect(screen.getByTestId('current-route')).toHaveTextContent('/before-pc');
  });

  it('restores focus to the launching card after the Close route update', async () => {
    const user = userEvent.setup();
    renderCareerPC('/pokemon/experience');
    const launcher = screen.getByRole('button', { name: 'Draftion: DraftKings' });

    await user.click(launcher);
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.getByTestId('current-route')).toHaveTextContent('/pokemon/experience');
    expect(launcher).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'Experience' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('lets Browser Back naturally remove the entry segment', async () => {
    const user = userEvent.setup();
    renderCareerPC('/pokemon/experience');

    await user.click(screen.getByRole('button', { name: 'Draftion: DraftKings' }));
    expect(screen.getByRole('dialog', { name: 'Draftion details' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: /back in history/i }));

    expect(screen.getByTestId('current-route')).toHaveTextContent(/^\/pokemon\/experience$/);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
