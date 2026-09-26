/**
 * ═══ THE ACADEMIC EXCELLENCE BOARDS, FROM THE CMS ══════════════════════════
 *
 * The two boards at the school entrance — one for Class X, one for Class XII —
 * each carrying a session, a topper and a percentage. Next session's name is a
 * new row in the admin; nothing here changes.
 *
 * ⚠ OLDEST FIRST IS THE STORED ORDER, BECAUSE IT IS THE ENGRAVED ORDER. It is
 * what makes the transcription checkable against a photograph of the board,
 * line by line — the only way an error in it would ever be found. The page
 * shows the newest at the top by reversing a copy.
 *
 * ⚠ NOTHING HERE CORRECTS A SPELLING OR A FIGURE. Names are stored in capitals
 * as the board engraves them and title-cased for reading by the component; a
 * percentage is a string so '98.20' keeps its trailing zero.
 */
import { cmsFetchAll } from '../client';

export interface TopperRow {
  /** As the board prints it: '2017-18'. */
  session: string;
  /** As the board spells it, in capitals. */
  name: string;
  /** Two decimals, exactly as printed. */
  percent: string;
  /** The figure is not legible on the board — the page renders an asterisk. */
  check?: true;
}

interface RawTopper {
  board: string | null;
  session: string | null;
  name: string | null;
  percent: string | null;
  needsCheck: boolean | null;
  order: number | null;
}

export interface Boards {
  classX: TopperRow[];
  classXII: TopperRow[];
  /** Whether either board still carries a figure nobody has confirmed. */
  needsFootnote: boolean;
  /** Both boards empty — the page says so rather than drawing empty tables. */
  hasBoards: boolean;
}

export async function getToppers(): Promise<Boards> {
  const rows = await cmsFetchAll<RawTopper>('/api/board-toppers', {
    sort: ['order:asc'],
  });

  /* ⚠ A ROW MISSING ANY OF THE THREE IS DROPPED, NOT PRINTED BLANK. A board
     line reading "2024-25 — —" says the school engraved nothing that year,
     which is a claim it has not made. */
  const pick = (board: string): TopperRow[] =>
    (rows ?? [])
      .filter((r) => r.board === board && r.session?.trim() && r.name?.trim() && r.percent?.trim())
      .map((r) => ({
        session: r.session!.trim(),
        name: r.name!.trim(),
        percent: r.percent!.trim(),
        ...(r.needsCheck ? { check: true as const } : {}),
      }));

  const classX = pick('class-x');
  const classXII = pick('class-xii');

  return {
    classX,
    classXII,
    needsFootnote: [...classX, ...classXII].some((r) => r.check),
    hasBoards: classX.length > 0 || classXII.length > 0,
  };
}
