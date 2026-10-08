/** next/link, next/image and CSS imports get basePath added; plain src and href strings do not. */
export function withBasePath(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
