import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { playBleep } from '../audio/playBleep';
import { getRoster, rosterTabs } from '../data/portfolioData';
import { pokemonPath, resolvePokemonRoute } from '../navigation/routes';
import { CreatureGrid } from './CreatureGrid';
import { PokedexEntry } from './PokedexEntry';
import { QuickMenu } from './QuickMenu';
import { usePreferences } from '../preferences/usePreferences';

type RecoveryLocationState = {
  pokemonRouteRecovered?: boolean;
};

export function CareerPC() {
  const { tab, entryId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const resolvedRoute = resolvePokemonRoute(tab, entryId);
  const box = getRoster(resolvedRoute.tab) ?? rosterTabs[0];
  const selectedEntry =
    box.entries.find((entry) => entry.id === resolvedRoute.entryId) ?? box.entries[0];
  const recoveryState = location.state as RecoveryLocationState | null;
  const showRecoveryMessage =
    resolvedRoute.recovered || recoveryState?.pokemonRouteRecovered === true;
  const [focusedBoxId, setFocusedBoxId] = useState(box.id);
  const boxTabRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const { soundEnabled, setSoundEnabled, reducedMotion } = usePreferences();

  const playEnabledBleep = () => {
    if (soundEnabled) {
      playBleep();
    }
  };

  useEffect(() => {
    if (resolvedRoute.recovered) {
      navigate(pokemonPath(resolvedRoute.tab, resolvedRoute.entryId), {
        replace: true,
        state: { pokemonRouteRecovered: true } satisfies RecoveryLocationState,
      });
    }
  }, [navigate, resolvedRoute.tab, resolvedRoute.entryId, resolvedRoute.recovered]);

  useEffect(() => {
    setFocusedBoxId(box.id);
  }, [box.id]);

  const moveTabFocus = (event: KeyboardEvent<HTMLAnchorElement>, currentIndex: number) => {
    let nextIndex: number | undefined;

    if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + rosterTabs.length) % rosterTabs.length;
    } else if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % rosterTabs.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = rosterTabs.length - 1;
    }

    if (nextIndex === undefined) {
      return;
    }

    event.preventDefault();
    setFocusedBoxId(rosterTabs[nextIndex].id);
    boxTabRefs.current[nextIndex]?.focus();
  };

  return (
    <main data-reduced-motion={reducedMotion} data-booting>
      <h1>Keshav's PC</h1>

      <QuickMenu
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {showRecoveryMessage ? (
        <p role="status">
          That PC entry could not be found. Showing {box.label}.
        </p>
      ) : null}

      <nav aria-label="PC boxes">
        <div role="tablist" aria-label="Career boxes">
          {rosterTabs.map((careerBox, index) => (
            <Link
              key={careerBox.id}
              ref={(element) => {
                boxTabRefs.current[index] = element;
              }}
              id={`box-tab-${careerBox.id}`}
              role="tab"
              aria-selected={careerBox.id === box.id}
              aria-controls="box-panel-active"
              tabIndex={careerBox.id === focusedBoxId ? 0 : -1}
              to={pokemonPath(careerBox.id)}
              onFocus={() => setFocusedBoxId(careerBox.id)}
              onClick={playEnabledBleep}
              onKeyDown={(event) => moveTabFocus(event, index)}
            >
              {careerBox.label}
            </Link>
          ))}
        </div>
      </nav>

      <section
        id="box-panel-active"
        role="tabpanel"
        aria-labelledby={`box-tab-${box.id}`}
      >
        <CreatureGrid
          entries={box.entries}
          selectedId={selectedEntry.id}
          onSelect={(selectedId) => {
            playEnabledBleep();
            navigate(pokemonPath(box.id, selectedId));
          }}
        />
        <PokedexEntry entry={selectedEntry} />
      </section>
    </main>
  );
}
