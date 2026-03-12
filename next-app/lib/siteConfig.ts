/** Базовый URL сайта. Берётся из env, фоллбэк — продакшн домен. */
export const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL || 'https://sweepbase.com').replace(/\/$/, '');

/**
 * Превращает относительный путь в абсолютный URL.
 * Уже абсолютные URL (http/https) возвращаются без изменений.
 *
 * Примеры:
 *   '/logo.png'                      → 'https://sweepbase.com/logo.png'
 *   '/api/image-proxy?url=...'       → 'https://sweepbase.com/api/image-proxy?url=...'
 *   'https://ui-avatars.com/...'     → 'https://ui-avatars.com/...'  (без изменений)
 */
export function absoluteUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
