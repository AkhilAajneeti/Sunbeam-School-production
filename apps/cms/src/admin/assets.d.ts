/**
 * Image imports for the admin bundle.
 *
 * Vite resolves `import logo from './assets/sunbeam-logo.png'` to a URL string
 * at build time, but TypeScript knows nothing about it — and this folder's
 * tsconfig runs `strict`, so without these declarations every logo import is a
 * "Cannot find module" error in the editor and in any typecheck.
 *
 * ⚠ THE TYPE IS `string`, NOT a component or a module object. Strapi's admin
 * config declares `auth.logo` and `menu.logo` as `string` — it passes the value
 * straight to an <img src>. Declaring these as anything else type-checks here
 * and then fails where they are used.
 */
declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}
