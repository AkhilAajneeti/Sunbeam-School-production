/**
 * READ A FILE FROM apps/web/src/data/ INSIDE PLAIN NODE.
 *
 * ═══ THE PROBLEM ═══════════════════════════════════════════════════════════
 *
 * Every data file in apps/web/src/data/ imports its images the Astro way:
 *
 *     import n01 from '../assets/notices/n01.jpg';
 *
 * Astro's Vite pipeline turns that into an ImageMetadata object. Node cannot —
 * `import` of a .jpg throws `ERR_UNKNOWN_FILE_EXTENSION`. So a seed script
 * cannot simply `import { notices } from '.../notices'`, and that is the one
 * thing every seed script in this project needs to do.
 *
 * ═══ WHY NOT THE OBVIOUS ALTERNATIVES ══════════════════════════════════════
 *
 *   · Re-typing the data as JSON duplicates content that was carefully sourced
 *     and read off the posters themselves, and puts a transcription error
 *     between the repository and the CMS. The data files are the source of
 *     truth for the migration; they must be read, not copied.
 *   · Regex-parsing the .ts file breaks on the first nested object or template
 *     literal, and these files have both.
 *
 * ═══ WHAT THIS DOES ════════════════════════════════════════════════════════
 *
 * Bundles the requested data file with esbuild, intercepting image imports and
 * replacing each with a module that exports the image's ABSOLUTE PATH ON DISK —
 * which is exactly what a seed script needs in order to upload the file.
 *
 * The shape stays `{ src, width, height, format }` so any code reading
 * `notice.image.src` still works; `src` is a filesystem path rather than a
 * built URL, and `absolutePath` is provided explicitly for clarity.
 *
 * ⚠ WIDTH AND HEIGHT ARE NOT READ HERE. Measuring 716 images to seed 24 would
 * be wasted work; the uploader reads dimensions from the file it is already
 * holding. They are present as 0 so destructuring never throws.
 */
import { build } from 'esbuild';
import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, extname, dirname as pathDirname, sep as sepChar } from 'node:path';
import { pathToFileURL } from 'node:url';

/** Extensions Astro treats as images. Case-insensitive: the repo has .JPG too. */
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg']);

const imageAsPathPlugin = {
  name: 'image-as-path',
  setup(pluginBuild) {
    // Catch every import whose extension looks like an image, wherever it
    // resolves from, and hand it to our own loader instead of esbuild's.
    pluginBuild.onResolve({ filter: /.*/ }, (args) => {
      if (!IMAGE_EXT.has(extname(args.path).toLowerCase())) return null;
      return {
        path: resolve(args.resolveDir, args.path),
        namespace: 'web-image',
      };
    });

    pluginBuild.onLoad({ filter: /.*/, namespace: 'web-image' }, (args) => ({
      // JSON.stringify handles Windows backslashes and spaces in folder names —
      // and this repo has both ("School Activity in Uniform").
      contents: `export default {
        src: ${JSON.stringify(args.path)},
        absolutePath: ${JSON.stringify(args.path)},
        width: 0,
        height: 0,
        format: ${JSON.stringify(extname(args.path).slice(1).toLowerCase())}
      };`,
      loader: 'js',
    }));
  },
};

/** Recursively list every file under `dir`. */
function walkFiles(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) walkFiles(full, out);
    else out.push(full);
  }
  return out;
}

/**
 * Turn a Vite glob pattern into a RegExp.
 * Supports the three forms this project uses: `**`, `*` and `{a,b,c}`.
 */
function globToRegExp(pattern) {
  let out = '';
  for (let i = 0; i < pattern.length; i++) {
    const c = pattern[i];
    if (c === '*') {
      if (pattern[i + 1] === '*') {
        out += '.*';
        i++;
        if (pattern[i + 1] === '/') i++;
      } else {
        out += '[^/]*';
      }
    } else if (c === '{') {
      const close = pattern.indexOf('}', i);
      const opts = pattern.slice(i + 1, close).split(',');
      out += `(?:${opts.map((o) => o.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`;
      i = close;
    } else if ('.+?^$()|[]\\'.includes(c)) {
      out += `\\${c}`;
    } else {
      out += c;
    }
  }
  return new RegExp(`^${out}$`);
}

/**
 * ⚠⚠ `import.meta.glob` IS A VITE COMPILE-TIME FEATURE. NODE HAS NOTHING LIKE IT.
 *
 * Four data files build indexes by globbing asset folders eagerly —
 * workshopPhotos, sportsRecord, campusTour and excursions — and other data
 * files import them. Any seed that touches news, sport, the campus tour or
 * excursions therefore dies on
 *
 *     TypeError: (intermediate value).glob is not a function
 *
 * before it reads a line of content.
 *
 * ⚠ THE FIRST ATTEMPT AT THIS WAS TOO NARROW. It substituted the one module
 * (workshopPhotos) that news was thought to depend on — and news still failed,
 * because newsEvents.ts reaches import.meta.glob through sportsRecord instead.
 * Patching modules one at a time would have meant discovering this again in G4
 * and again in G5. This replaces the CALL, wherever it appears.
 *
 * esbuild's `define` rewrites `import.meta.glob(...)` to `__viteGlob(...)`, and
 * the banner below supplies that function reading the real filesystem.
 *
 * ⚠ PATTERNS RESOLVE RELATIVE TO src/data/, WHICH IS TRUE FOR EVERY CALLER. All
 * four live in that directory and all their patterns start `../assets/`. A glob
 * added elsewhere would resolve from the wrong base — hence the explicit throw
 * rather than silently returning nothing.
 *
 * ⚠ KEYS KEEP THE PATTERN'S OWN SHAPE (`../assets/workshops/x/y.jpg`), because
 * the consuming code does `path.includes('/assets/workshops/')` on them. Values
 * are `{ default: … }` to match Vite's `eager: true`.
 */
function buildGlobBanner(webSrcDir) {
  /* Every file under src/assets, keyed the way a pattern in src/data/ sees it:
     `../assets/<...>`. Computed once here so the injected runtime is pure JS
     with no filesystem access of its own. */
  const assetsDir = join(webSrcDir, 'assets');
  const table = {};
  for (const abs of walkFiles(assetsDir)) {
    const key = `../assets/${abs.slice(assetsDir.length + 1).split(sepChar).join('/')}`;
    table[key] = abs;
  }

  return `
// ─── injected by scripts/lib/load-web-data.mjs — see buildGlobBanner ─────────
const __GLOB_FILES = ${JSON.stringify(table)};
function __globToRegExp(p) {
  let o = '';
  for (let i = 0; i < p.length; i++) {
    const c = p[i];
    if (c === '*') {
      if (p[i + 1] === '*') { o += '.*'; i++; if (p[i + 1] === '/') i++; }
      else o += '[^/]*';
    } else if (c === '{') {
      const e = p.indexOf('}', i);
      o += '(?:' + p.slice(i + 1, e).split(',').map(s => s.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&')).join('|') + ')';
      i = e;
    } else if ('.+?^\$()|[]\\\\'.includes(c)) { o += '\\\\' + c; }
    else o += c;
  }
  return new RegExp('^' + o + '$');
}
function __viteGlob(pattern) {
  const re = __globToRegExp(pattern.replace(/^\\.\\//, ''));
  const out = {};
  for (const key in __GLOB_FILES) {
    if (!re.test(key)) continue;
    const abs = __GLOB_FILES[key];
    out[key] = { default: { src: abs, absolutePath: abs, width: 0, height: 0,
      format: (abs.split('.').pop() || '').toLowerCase() } };
  }
  return out;
}
// ────────────────────────────────────────────────────────────────────────────
`;
}

/**
 * Bundle and evaluate one file from apps/web/src/data/.
 *
 * @param {string} dataFileAbsPath absolute path to the .ts file
 * @returns {Promise<Record<string, unknown>>} the file's exports
 */
export async function loadWebData(dataFileAbsPath) {
  const dir = await mkdtemp(join(tmpdir(), 'sunbeam-seed-'));
  const outfile = join(dir, 'bundle.mjs');

  try {
    await build({
      entryPoints: [dataFileAbsPath],
      outfile,
      bundle: true,
      format: 'esm',
      platform: 'node',
      target: 'node20',
      // Types only — they would drag Astro's whole type surface into the bundle.
      external: ['astro:assets', 'astro/*'],
      /* Vite's compile-time glob → our injected runtime. See buildGlobBanner. */
      define: { 'import.meta.glob': '__viteGlob' },
      banner: { js: buildGlobBanner(resolve(pathDirname(dataFileAbsPath), '..')) },
      plugins: [imageAsPathPlugin],
      logLevel: 'silent',
    });

    // Cache-bust so repeated calls in one process re-read a changed file.
    return await import(`${pathToFileURL(outfile).href}?t=${Date.now()}`);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

export default loadWebData;
