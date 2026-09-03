/**
 * READ THE CONSTS OUT OF AN .astro FILE'S FRONTMATTER.
 *
 * ═══ WHY THIS IS NEEDED ════════════════════════════════════════════════════
 *
 * Most content in this project lives in apps/web/src/data/*.ts, which
 * load-web-data.mjs can bundle and evaluate. But a good deal does not: the
 * homepage's achievements and events arrays sit inline in Achievements.astro and
 * EventsNews.astro, both About messages hold their paragraphs in the route file,
 * and the academics pages keep almost everything that way.
 *
 * Re-typing those into a fixture would put a transcription error between the
 * repository and the CMS — the one risk this whole migration has otherwise
 * avoided by reading the source rather than copying it. So the frontmatter is
 * evaluated instead.
 *
 * ⚠ ONLY THE FRONTMATTER IS EVALUATED, never the template. Everything between
 * the opening and closing `---` is plain TypeScript; the markup below is not,
 * and bundling it would need the Astro compiler.
 *
 * ⚠ ASTRO-ONLY IMPORTS ARE STUBBED. Frontmatter routinely imports .astro
 * components, `astro:assets` and the project's own lib — none of which matter
 * for reading a const array, and all of which would drag the whole site into the
 * bundle. Image imports resolve to their path on disk, exactly as in
 * load-web-data.mjs, so an extracted array can still be seeded with its images.
 *
 * ⚠ TOP-LEVEL `await` IS STRIPPED WITH ITS STATEMENT. A page that does
 * `const school = await getSchool()` cannot run here — there is no CMS at
 * extraction time. Any const initialised from an await is dropped rather than
 * faked, and asking for one by name returns undefined rather than a wrong value.
 */
import { build } from 'esbuild';
import { readFile, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname, extname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg']);

/** Image imports → their absolute path, so the seed can upload them. */
const imagePlugin = {
  name: 'astro-image-as-path',
  setup(b) {
    b.onResolve({ filter: /.*/ }, (args) => {
      if (!IMAGE_EXT.has(extname(args.path).toLowerCase())) return null;
      return { path: resolve(args.resolveDir, args.path), namespace: 'astro-image' };
    });
    b.onLoad({ filter: /.*/, namespace: 'astro-image' }, (args) => ({
      contents: `export default { src: ${JSON.stringify(args.path)}, absolutePath: ${JSON.stringify(args.path)}, width: 0, height: 0, format: ${JSON.stringify(extname(args.path).slice(1).toLowerCase())} };`,
      loader: 'js',
    }));
  },
};

/** .astro components, astro:assets and the cms layer → inert stubs. */
const stubPlugin = {
  name: 'astro-stub',
  setup(b) {
    b.onResolve({ filter: /\.astro$|^astro:|lib\/cms/ }, (args) => ({
      path: args.path, namespace: 'astro-stub',
    }));
    /**
     * ⚠⚠ COMMONJS, NOT ESM, AND THAT IS THE WHOLE POINT.
     *
     * An ESM stub has to name every export it provides, and esbuild checks those
     * names statically: the first frontmatter to import something the list did
     * not anticipate fails the whole build. That happened the moment academics
     * reached a page importing `getAcademicCalendarPageData` — a file with real
     * content in it dropped out of the extraction over a missing stub name.
     *
     * A CommonJS module exporting a Proxy accepts ANY named import, because the
     * interop resolves the names at runtime rather than at build time. So the
     * stub can never again be the reason a page goes missing.
     */
    b.onLoad({ filter: /.*/, namespace: 'astro-stub' }, () => ({
      contents: `
const noop = new Proxy(function () {}, {
  get: (t, k) => (k === '__esModule' ? false : noop),
  apply: () => noop,
});
module.exports = noop;
`,
      loader: 'js',
    }));
  },
};

/**
 * @param {string} astroFile absolute path
 * @param {string[]} names   consts to return
 * @returns {Promise<Record<string, unknown>>}
 */
export async function loadAstroFrontmatter(astroFile, names, globals = {}) {
  const src = await readFile(astroFile, 'utf8');

  const first = src.indexOf('---');
  const second = src.indexOf('\n---', first + 3);
  if (first !== 0 || second === -1) {
    throw new Error(`${astroFile} has no frontmatter fence`);
  }
  let fm = src.slice(first + 3, second);

  /**
   * Drop any statement that awaits — nothing async can run at extraction time.
   *
   * ⚠⚠ STATEMENTS, NOT LINES. The first version filtered line by line, which
   * misses the shape every CMS-backed page in this project actually uses:
   *
   *     const { calendars, calendarSource, calendarCarries } =
   *       await getAcademicCalendarPageData();
   *
   * Neither line matches on its own — the first has no `await`, the second has
   * no `const` — so the whole destructure survived, and the extraction failed at
   * RUNTIME with "is not a function" rather than at parse time. A page with real
   * content in it dropped out of the fixture for a reason that looked like a
   * stub problem.
   *
   * So the scan finds `= await` and removes backwards to the opening `const` and
   * forwards to the end of the statement.
   */
  for (;;) {
    const at = fm.search(/=\s*await\s/);
    if (at === -1) break;

    const start = fm.lastIndexOf('const ', at);
    if (start === -1) break;

    /* End of statement: the first `;` or newline that is not inside brackets. */
    let depth = 0;
    let end = at;
    for (; end < fm.length; end++) {
      const c = fm[end];
      if ('([{'.includes(c)) depth++;
      else if (')]}'.includes(c)) depth--;
      else if (c === ';' && depth <= 0) { end++; break; }
      else if (c === '\n' && depth <= 0 && fm[end - 1] === ';') break;
    }
    fm = fm.slice(0, start) + fm.slice(end);
  }

  /**
   * ⚠ `export { name }`, NOT `export const name = name`.
   *
   * The second redeclares a binding the frontmatter already made, and esbuild
   * rejects it outright: "The symbol has already been declared". Re-exporting
   * the existing binding is what was meant.
   *
   * ⚠ AND ONLY NAMES THAT ACTUALLY EXIST. Exporting an undeclared symbol is a
   * build error rather than `undefined`, so the frontmatter is checked first and
   * a missing name is simply absent from the result — which is what a caller
   * asking for an optional const expects.
   *
   * ⚠⚠ AN IMPORT IS A BINDING TOO. `import portrait from './x.jpg'` declares
   * `portrait` just as firmly as a const does, and the leader-message pages get
   * their photographs exactly that way. Matching only const/let/var/function
   * quietly dropped them: the seed asked for `portrait`, got undefined, and
   * would have written a record with no picture and no error anywhere.
   *
   * ⚠⚠⚠ THE `\b` GOES INSIDE THE BARE-NAME ALTERNATIVE, NOT AFTER THE GROUP.
   * Trailing the whole group, it sat between `}` and a space — two non-word
   * characters, where a word boundary cannot exist — so `import { school }` was
   * reported as unbound while `import portrait from …` matched. That asymmetry
   * is invisible until a braced import is the one you need.
   */
  const bound = (n) =>
    new RegExp(`(^|\\n)\\s*(?:const|let|var|function)\\s+${n}\\b`).test(fm) ||
    new RegExp(`(^|\\n)\\s*import\\s+(?:[\\w$]+\\s*,\\s*)?(?:\\{[^}]*\\b${n}\\b[^}]*\\}|${n}\\b)`).test(fm);

  const present = names.filter(bound);
  const exports = present.length ? `export { ${present.join(', ')} };` : '';

  /* ⚠ THE ENTRY FILE IS WRITTEN BESIDE THE .astro, NOT IN A TEMP DIRECTORY.
     esbuild resolves a relative import from the location of the file containing
     it, so an entry in /tmp turns '../../assets/x.jpg' into a path outside the
     repository and every build fails. Writing it next to the source keeps every
     relative specifier meaning what it meant. The output still goes to temp. */
  const dir = await mkdtemp(join(tmpdir(), 'sunbeam-astro-'));
  const entry = join(dirname(astroFile), '.__extract.ts');
  const outfile = join(dir, 'bundle.mjs');

  try {
    /**
     * ⚠ VALUES THE STRIPPED AWAITS WOULD HAVE PROVIDED, SUPPLIED BY THE CALLER.
     *
     * history-legacy.astro interpolates `school.name` inside its arrays, so
     * dropping `const school = await getSchool()` leaves a ReferenceError. The
     * seed already holds the real Site Settings record and passes it in.
     *
     * A stub object would have "worked" and produced text that differs from what
     * the page actually renders — the quiet kind of wrong the production diff
     * exists to catch. Passing the real record means the extracted strings are
     * the rendered strings.
     */
    /**
     * ⚠ A GLOBAL IS SKIPPED IF THE FRONTMATTER ALREADY BINDS THAT NAME.
     * Affiliations.astro imported `school` from data/site rather than awaiting
     * it from the CMS, so prepending one too was a redeclaration and esbuild
     * refused the whole build. Where the file has its own binding it is the
     * right one — this preamble exists only to replace the awaits that were
     * stripped, not to shadow real imports.
     */
    const preamble = Object.entries(globals)
      .filter(([k]) => !bound(k))
      .map(([k, v]) => `const ${k} = ${JSON.stringify(v)};`)
      .join('\n');

    await writeFile(entry, `${preamble}\n${fm}\n${exports}\n`, 'utf8');
    await build({
      entryPoints: [entry],
      outfile,
      bundle: true,
      format: 'esm',
      platform: 'node',
      target: 'node20',
      plugins: [stubPlugin, imagePlugin],
      logLevel: process.env.EXTRACT_DEBUG ? 'info' : 'silent',
      /* The frontmatter's relative imports resolve from the .astro file, not
         from the temp directory the entry point lives in. */
    });
    return await import(`${pathToFileURL(outfile).href}?t=${Date.now()}`);
  } finally {
    await rm(dir, { recursive: true, force: true });
    await rm(entry, { force: true });
  }
}

export default loadAstroFrontmatter;
