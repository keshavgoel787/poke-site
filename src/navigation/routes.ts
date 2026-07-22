import { careerBoxes, getBox, getEntry, type BoxId } from '../data/portfolioData';

export type PcRouteState = {
  boxId: BoxId;
  entryId?: string;
  recovered: boolean;
};

export const pcPath = (boxId: BoxId, entryId?: string) =>
  entryId ? `/pc/${boxId}/${entryId}` : `/pc/${boxId}`;

export function resolvePcRoute(boxId?: string, entryId?: string): PcRouteState {
  const box = getBox(boxId as BoxId) ?? careerBoxes[0];
  const entry = entryId ? getEntry(box.id, entryId) : undefined;

  return {
    boxId: box.id,
    entryId: entry?.id,
    recovered: box.id !== boxId || (!!entryId && !entry),
  };
}
