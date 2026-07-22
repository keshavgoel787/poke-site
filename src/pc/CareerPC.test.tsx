import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { CareerPC } from './CareerPC';

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
          path="/pc/:boxId/:entryId?"
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
  it('shows the selected career box and concise entry', () => {
    renderCareerPC('/pc/experience/amazon');

    expect(screen.getByRole('tab', { name: /experience/i })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('heading', { name: /amazon/i })).toBeVisible();
    expect(screen.getAllByRole('listitem', { name: /move:/i })).toHaveLength(4);
  });

  it('opens a box route from its tab', async () => {
    const user = userEvent.setup();
    renderCareerPC('/pc/experience/amazon');

    await user.click(screen.getByRole('tab', { name: /projects/i }));

    expect(screen.getByTestId('current-route')).toHaveTextContent('/pc/projects');
    expect(screen.getByRole('tab', { name: /projects/i })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('moves focus between box tabs with the arrow keys', async () => {
    const user = userEvent.setup();
    renderCareerPC('/pc/experience/amazon');
    const experience = screen.getByRole('tab', { name: /experience/i });
    const projects = screen.getByRole('tab', { name: /projects/i });

    experience.focus();
    await user.keyboard('{ArrowRight}');

    expect(projects).toHaveFocus();
  });

  it('moves grid focus with the arrow keys', async () => {
    const user = userEvent.setup();
    renderCareerPC('/pc/experience/amazon');
    const amazon = screen.getByRole('button', { name: /amazoar: amazon/i });
    const draftKings = screen.getByRole('button', { name: /draftion: draftkings/i });

    amazon.focus();
    await user.keyboard('{ArrowRight}');

    expect(draftKings).toHaveFocus();
  });

  it('selects a focused grid item with Enter', async () => {
    const user = userEvent.setup();
    renderCareerPC('/pc/experience/amazon');
    const amazon = screen.getByRole('button', { name: /amazoar: amazon/i });
    const draftKings = screen.getByRole('button', { name: /draftion: draftkings/i });

    amazon.focus();
    await user.keyboard('{ArrowRight}{Enter}');

    expect(draftKings).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('current-route')).toHaveTextContent(
      '/pc/experience/draftkings',
    );
  });

  it('wraps grid focus and selects a focused item with Space', async () => {
    const user = userEvent.setup();
    renderCareerPC('/pc/projects/breathe-easy');
    const breatheEasy = screen.getByRole('button', { name: /aeroroute: breathe easy/i });
    const forgetMeNot = screen.getByRole('button', { name: /memorai: forgetmenot/i });

    breatheEasy.focus();
    await user.keyboard('{ArrowLeft} ');

    expect(forgetMeNot).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('current-route')).toHaveTextContent('/pc/projects/forgetmenot');
  });

  it('recovers an invalid entry by replacing it with a canonical route', async () => {
    const user = userEvent.setup();
    renderCareerPC('/pc/projects/not-a-project', '/before-pc');

    expect(screen.getByRole('status')).toHaveTextContent(
      'That PC entry could not be found. Showing Box 1.',
    );
    expect(screen.getByTestId('current-route')).toHaveTextContent('/pc/projects');

    await user.click(screen.getByRole('button', { name: /back in history/i }));

    expect(screen.getByTestId('current-route')).toHaveTextContent('/before-pc');
  });
});
