import {
  getRoster,
  publishedRosterTabs,
  type RosterTab,
} from '../data/portfolioData';

export type PokemonRouteState = {
  tab: RosterTab;
  entryId?: string;
  recovered: boolean;
};

export const pokemonPath = (tab: RosterTab, entryId?: string) =>
  entryId ? `/pokemon/${tab}/${entryId}` : `/pokemon/${tab}`;

export function resolvePokemonRoute(tab?: string, entryId?: string): PokemonRouteState {
  const roster = publishedRosterTabs.find((item) => item.id === tab) ?? publishedRosterTabs[0];
  const entry = roster.entries.find((item) => item.id === entryId);
  const hasExplicitTab = tab !== undefined;

  return {
    tab: roster.id,
    entryId: entry?.id,
    recovered: hasExplicitTab && (roster.id !== tab || (!!entryId && !entry)),
  };
}

export function legacyPcPath(boxId?: string, entryId?: string) {
  if (boxId !== 'experience' && boxId !== 'projects') {
    return '/';
  }

  const roster = getRoster(boxId);
  const retainedEntry = roster?.entries.find((entry) => entry.id === entryId);

  return pokemonPath(boxId, retainedEntry?.id);
}
