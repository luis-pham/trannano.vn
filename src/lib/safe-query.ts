/** Run a Prisma (or other) query without crashing the page when DB is down. */
export async function safeQuery<T>(
  label: string,
  fn: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    console.error(`[safeQuery:${label}]`, e);
    return fallback;
  }
}
