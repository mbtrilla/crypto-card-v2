/**
 * Returns the local WebP image path for a card if it exists,
 * otherwise falls back to the original proxy URL.
 *
 * At build time, checks the filesystem. At runtime on the client,
 * assumes local images exist if the path was set during SSR.
 */

import fs from 'fs';
import path from 'path';

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'cards');

export function getCardImageSrc(slug: string, proxyFallback: string): string {
  const localPath = path.join(IMAGES_DIR, `${slug}.webp`);
  if (fs.existsSync(localPath)) {
    return `/images/cards/${slug}.webp`;
  }
  return proxyFallback;
}

export function getCardImageSrcSet(slug: string): string | undefined {
  const w400 = path.join(IMAGES_DIR, `${slug}-400w.webp`);
  const w800 = path.join(IMAGES_DIR, `${slug}-800w.webp`);
  if (fs.existsSync(w400) && fs.existsSync(w800)) {
    return `/images/cards/${slug}-400w.webp 400w, /images/cards/${slug}-800w.webp 800w`;
  }
  return undefined;
}

export function hasLocalImage(slug: string): boolean {
  return fs.existsSync(path.join(IMAGES_DIR, `${slug}.webp`));
}
