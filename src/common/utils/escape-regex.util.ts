/**
 * Escapes regex metacharacters
 * for safe lookup in MongoDB regex queries.
 */
export function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
