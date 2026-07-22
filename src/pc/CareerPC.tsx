import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { careerBoxes, getBox } from '../data/portfolioData';
import { pcPath, resolvePcRoute } from '../navigation/routes';
import { CreatureGrid } from './CreatureGrid';
import { PokedexEntry } from './PokedexEntry';
import { QuickMenu } from './QuickMenu';
import { usePreferences } from '../preferences/usePreferences';

type RecoveryLocationState = {
  pcRouteRecovered?: boolean;
};

export function CareerPC() {
  const { boxId, entryId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const resolvedRoute = resolvePcRoute(boxId, entryId);
  const box = getBox(resolvedRoute.boxId) ?? careerBoxes[0];
  const selectedEntry =
    box.entries.find((entry) => entry.id === resolvedRoute.entryId) ?? box.entries[0];
  const recoveryState = location.state as RecoveryLocationState | null;
  const showRecoveryMessage = resolvedRoute.recovered || recoveryState?.pcRouteRecovered === true;
  const [focusedBoxId, setFocusedBoxId] = useState(box.id);
  const boxTabRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const { reducedMotion } = usePreferences();

  useEffect(() => {
    if (resolvedRoute.recovered) {
      navigate(pcPath(resolvedRoute.boxId, resolvedRoute.entryId), {
        replace: true,
        state: { pcRouteRecovered: true } satisfies RecoveryLocationState,
      });
    }
  }, [navigate, resolvedRoute.boxId, resolvedRoute.entryId, resolvedRoute.recovered]);

  useEffect(() => {
    setFocusedBoxId(box.id);
  }, [box.id]);

  const moveTabFocus = (event: KeyboardEvent<HTMLAnchorElement>, currentIndex: number) => {
    let nextIndex: number | undefined;

    if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + careerBoxes.length) % careerBoxes.length;
    } else if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % careerBoxes.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = careerBoxes.length - 1;
    }

    if (nextIndex === undefined) {
      return;
    }

    event.preventDefault();
    setFocusedBoxId(careerBoxes[nextIndex].id);
    boxTabRefs.current[nextIndex]?.focus();
  };

  return (
    <main data-reduced-motion={reducedMotion} data-booting>
      <h1>Keshav's PC</h1>

      <QuickMenu />

      {showRecoveryMessage ? (
        <p role="status">That PC entry could not be found. Showing Box 1.</p>
      ) : null}

      <nav aria-label="PC boxes">
        <div role="tablist" aria-label="Career boxes">
          {careerBoxes.map((careerBox, index) => (
            <Link
              key={careerBox.id}
              ref={(element) => {
                boxTabRefs.current[index] = element;
              }}
              id={`box-tab-${careerBox.id}`}
              role="tab"
              aria-selected={careerBox.id === box.id}
              aria-controls={`box-panel-${careerBox.id}`}
              tabIndex={careerBox.id === focusedBoxId ? 0 : -1}
              to={pcPath(careerBox.id)}
              onFocus={() => setFocusedBoxId(careerBox.id)}
              onKeyDown={(event) => moveTabFocus(event, index)}
            >
              {careerBox.label}
            </Link>
          ))}
        </div>
      </nav>

      <section
        id={`box-panel-${box.id}`}
        role="tabpanel"
        aria-labelledby={`box-tab-${box.id}`}
      >
        <CreatureGrid
          entries={box.entries}
          selectedId={selectedEntry.id}
          onSelect={(selectedId) => navigate(pcPath(box.id, selectedId))}
        />
        <PokedexEntry entry={selectedEntry} />
      </section>
    </main>
  );
}
