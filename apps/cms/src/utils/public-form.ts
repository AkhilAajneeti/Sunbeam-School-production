/**
 * SHARED GUARDS FOR THE PUBLIC FORM ENDPOINTS.
 *
 * Two endpoints in this CMS accept a POST from anybody on the internet — the
 * contact form and the parents' feedback form — and both need the same three
 * defences. This module exists so there is ONE copy of them.
 *
 * ⚠⚠ THE ALTERNATIVE WAS TWO COPIES THAT DRIFT. The second endpoint was
 * originally going to paste the first one's rate limiter. A tightened limit or
 * a fixed bug would then land on one form and not the other, and nobody would
 * notice until the unfixed one was the way in.
 *
 * What is NOT here: the field whitelists. Those are per-form by nature — the
 * whole point is that each controller names its own columns — and a generic
 * "copy these fields" helper would be the thing that eventually lets an
 * unexpected field through.
 */

/* ── Rate limiting ─────────────────────────────────────────────────────────
 *
 * ⚠ FIVE SUBMISSIONS PER TEN MINUTES, PER IP, PER FORM. A deliberate floor,
 * not a ceiling: it stops a script hammering the endpoint and never stands
 * between a real family and a message, because nobody legitimately sends six in
 * ten minutes.
 *
 * ⚠⚠ THE COUNTER IS PER PROCESS AND DIES ON RESTART. Fine for a single Strapi
 * instance, which is what this deployment is. Behind more than one node it
 * becomes per-node and the real limit multiplies — move it to Redis or to the
 * proxy at that point, and do not discover that by surprise.
 *
 * ⚠ ATTEMPTS ARE COUNTED, NOT SUCCESSES. A script that submits invalid bodies
 * is still abusing the endpoint, so a failed validation consumes budget too.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

/** Keyed by `${form}:${ip}`, so one form's traffic cannot exhaust the other's. */
const hits = new Map<string, number[]>();

export function rateLimited(form: string, ip: string): boolean {
  const key = `${form}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);

  /* Keep the map bounded on a long-running process: any key whose window has
     fully elapsed is forgotten. Cheap, because it only runs on a submission and
     submissions are rare by construction. */
  if (hits.size > 500) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }

  return recent.length > MAX_PER_WINDOW;
}

/** The client's address, for the rate-limit window only — never stored. */
export function clientIp(ctx: {
  request: { ip?: string; header: Record<string, unknown> };
}): string {
  return String(ctx.request.ip || ctx.request.header['x-forwarded-for'] || 'unknown');
}

/* ── Input shaping ─────────────────────────────────────────────────────── */

/**
 * Accept both `{ data: {…} }` (Strapi's own convention) and a flat object, so a
 * form is not broken by which shape it happens to send.
 */
export function payloadOf(body: unknown): Record<string, unknown> {
  const b = (body ?? {}) as Record<string, unknown>;
  return ((b.data ?? b) ?? {}) as Record<string, unknown>;
}

/** Trim, coerce to string, and cap — mirrors the schema's maxLength. */
export const clean = (v: unknown, max: number): string =>
  typeof v === 'string' ? v.trim().slice(0, max) : '';

/**
 * Deliberately loose. The job is to reject what is obviously not an address,
 * not to adjudicate RFC 5322 — an over-clever regex rejects real addresses, and
 * the schema's `email` type does the strict pass anyway.
 */
export const looksLikeEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

/**
 * ⚠⚠ THE HONEYPOT IS ANSWERED WITH A SILENT SUCCESS, NOT A 400.
 *
 * `company` is a field no human can see or reach — it is off-screen,
 * `tabindex="-1"` and `aria-hidden` on the form. If it arrives filled, a bot
 * filled it. A 400 would tell that bot's author exactly which field gave them
 * away and they would drop it from their script; a 200 that writes nothing
 * keeps the trap invisible and therefore durable.
 */
export const trippedHoneypot = (input: Record<string, unknown>): boolean =>
  clean(input.topicRef, 200) !== '';
