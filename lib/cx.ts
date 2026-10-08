/**
 * Joins class names, dropping anything falsy.
 *
 * One definition for the whole site: conditional classes are how nearly every
 * component here states a variant, so the helper is shared rather than
 * redeclared per file.
 */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
