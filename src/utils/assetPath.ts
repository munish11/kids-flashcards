/**
 * Resolves an absolute asset path (e.g. "/images/fruits/apple.jpg")
 * to work with Vite's base URL configuration.
 * 
 * This is needed for GitHub Pages where the app is served from a subpath
 * like /repo-name/ instead of /.
 * 
 * Data URIs (data:image/...) are returned as-is.
 */
export function assetPath(src: string): string {
  // Don't touch data URIs
  if (src.startsWith('data:')) return src;

  const base = import.meta.env.BASE_URL;
  // If base is just '/', no transformation needed
  if (base === '/') return src;

  // Strip leading slash from src, base already ends with /
  return base + src.replace(/^\//, '');
}
