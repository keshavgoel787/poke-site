import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { playBleep } from '../audio/playBleep';
import { getRoster, rosterTabs } from '../data/portfolioData';
import { pokemonPath, resolvePokemonRoute } from '../navigation/routes';
import { CreatureGrid } from './CreatureGrid';
import { PokedexEntry } from './PokedexEntry';
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
  const selectedEntry = box.entries.find((entry) => entry.id === resolvedRoute.entryId);
  const selectedCardId = selectedEntry?.id ?? box.entries[0].id;
  const recoveryState = location.state as RecoveryLocationState | null;
  const showRecoveryMessage =
    resolvedRoute.recovered || recoveryState?.pokemonRouteRecovered === true;
  const [focusedBoxId, setFocusedBoxId] = useState(box.id);
  const boxTabRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const boxPanelRef = useRef<HTMLElement>(null);
  const launchingCardRef = useRef<HTMLButtonElement | null>(null);
  const launchingEntryIdRef = useRef<string | null>(null);
  const previousEntryIdRef = useRef(resolvedRoute.entryId);
  const { soundEnabled, setSoundEnabled } = usePreferences();

  const playEnabledBleep = () => {
    if (soundEnabled) {
      playBleep();
    }
  };

  const toggleSound = () => {
    const nextSoundEnabled = !soundEnabled;

    setSoundEnabled(nextSoundEnabled);
    if (nextSoundEnabled) {
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

  useEffect(() => {
    if (selectedEntry) {
      launchingEntryIdRef.current = selectedEntry.id;
    }
  }, [selectedEntry]);

  useEffect(() => {
    const previousEntryId = previousEntryIdRef.current;
    previousEntryIdRef.current = resolvedRoute.entryId;

    if (
      resolvedRoute.entryId ||
      !previousEntryId ||
      launchingEntryIdRef.current !== previousEntryId
    ) {
      return;
    }

    const expectedDescriptionId = `party-card-${previousEntryId}-completion`;
    const launchingCard = launchingCardRef.current;
    const card =
      launchingCard?.isConnected &&
      launchingCard.getAttribute('aria-describedby') === expectedDescriptionId
        ? launchingCard
        : Array.from(boxPanelRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? []).find(
            (button) => button.getAttribute('aria-describedby') === expectedDescriptionId,
          );

    card?.focus({ preventScroll: true });
    launchingEntryIdRef.current = null;
    launchingCardRef.current = null;
  }, [resolvedRoute.entryId]);

  const selectEntry = (selectedId: string) => {
    const expectedDescriptionId = `party-card-${selectedId}-completion`;
    launchingEntryIdRef.current = selectedId;
    launchingCardRef.current =
      Array.from(boxPanelRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? []).find(
        (button) => button.getAttribute('aria-describedby') === expectedDescriptionId,
      ) ?? null;
    playEnabledBleep();
    navigate(pokemonPath(box.id, selectedId));
  };

  const closeEntry = () => {
    navigate(pokemonPath(resolvedRoute.tab), { replace: true });
  };

  const moveTabFocus = (event: KeyboardEvent<HTMLAnchorElement>, currentIndex: number) => {
    if (event.key === ' ') {
      const selectedTab = rosterTabs[currentIndex];

      event.preventDefault();
      setFocusedBoxId(selectedTab.id);
      boxTabRefs.current[currentIndex]?.focus();
      playEnabledBleep();
      navigate(pokemonPath(selectedTab.id));
      return;
    }

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
    <section className="career-pc" data-booting aria-labelledby="career-pc-title">
      <header className="career-pc__header">
        <h2 id="career-pc-title">Keshav&apos;s Pokémon</h2>
        <button type="button" aria-pressed={soundEnabled} onClick={toggleSound}>
          Sound
        </button>
      </header>

      {showRecoveryMessage ? (
        <p role="status">
          That PC entry could not be found. Showing {box.label}.
        </p>
      ) : null}

      <nav aria-label="Professional roster">
        <div role="tablist" aria-label="Roster tabs">
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
        ref={boxPanelRef}
        id="box-panel-active"
        role="tabpanel"
        aria-labelledby={`box-tab-${box.id}`}
        aria-hidden={selectedEntry ? true : undefined}
        inert={selectedEntry ? true : undefined}
      >
        <CreatureGrid
          entries={box.entries}
          selectedId={selectedCardId}
          onSelect={selectEntry}
        />
      </section>
      {selectedEntry ? <PokedexEntry entry={selectedEntry} onClose={closeEntry} /> : null}
    </section>
  );
}
