/**
 * Download all card images from Google Drive, convert to WebP,
 * and save locally at /public/images/cards/{slug}.webp (400w + 800w).
 *
 * Usage:  npx tsx scripts/download-card-images.ts
 * Requires: sharp (already installed)
 */

import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import sharp from 'sharp';

const PROJECT_ROOT = path.resolve(__dirname, '..');
const CSV_PATH = path.join(PROJECT_ROOT, 'data.csv');
const OUT_DIR = path.join(PROJECT_ROOT, 'public', 'images', 'cards');

// ── Helpers ──────────────────────────────────────────────────────────────────

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function extractGDriveId(url: string): string | null {
  const m = url.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]{25,})/);
  return m ? m[1] : null;
}

function buildDownloadUrl(rawUrl: string): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;

  const driveId = extractGDriveId(rawUrl);
  if (driveId) {
    return `https://drive.google.com/thumbnail?id=${driveId}&sz=w800`;
  }

  if (rawUrl.startsWith('http')) return rawUrl;
  return null;
}

async function downloadImage(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Accept: 'image/webp,image/*,*/*;q=0.8',
      },
    });
    if (!res.ok) {
      console.warn(`  ⚠ HTTP ${res.status} for ${url}`);
      return null;
    }
    return Buffer.from(await res.arrayBuffer());
  } catch (e) {
    console.warn(`  ⚠ Fetch error: ${(e as Error).message}`);
    return null;
  }
}

async function saveWebp(buf: Buffer, slug: string): Promise<boolean> {
  try {
    // 400w
    await sharp(buf)
      .resize(400, 250, { fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(path.join(OUT_DIR, `${slug}-400w.webp`));

    // 800w
    await sharp(buf)
      .resize(800, 500, { fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(path.join(OUT_DIR, `${slug}-800w.webp`));

    // Default (400w alias)
    await sharp(buf)
      .resize(400, 250, { fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(path.join(OUT_DIR, `${slug}.webp`));

    return true;
  } catch (e) {
    console.warn(`  ⚠ Sharp error for ${slug}: ${(e as Error).message}`);
    return false;
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const csv = fs.readFileSync(CSV_PATH, 'utf8');
  const { data } = Papa.parse(csv, { header: true, skipEmptyLines: true });

  const rows = data as Record<string, string>[];
  console.log(`Found ${rows.length} cards in CSV\n`);

  let success = 0;
  let skipped = 0;
  let failed = 0;

  for (const row of rows) {
    const name = (row['Card Service'] || '').trim();
    if (!name) continue;

    const slug = slugify(name);
    const rawUrl = (row['IMG'] || '').trim();
    const downloadUrl = buildDownloadUrl(rawUrl);

    // Skip if already downloaded
    if (fs.existsSync(path.join(OUT_DIR, `${slug}.webp`))) {
      console.log(`✓ ${slug} — already exists, skipping`);
      skipped++;
      continue;
    }

    if (!downloadUrl) {
      console.log(`✗ ${slug} — no valid image URL`);
      failed++;
      continue;
    }

    process.stdout.write(`↓ ${slug}...`);
    const buf = await downloadImage(downloadUrl);
    if (!buf || buf.length < 100) {
      console.log(' FAILED (empty response)');
      failed++;
      continue;
    }

    const ok = await saveWebp(buf, slug);
    if (ok) {
      console.log(` OK (${(buf.length / 1024).toFixed(0)} KB → webp)`);
      success++;
    } else {
      failed++;
    }

    // Rate limit: 200ms between requests
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\nDone: ${success} downloaded, ${skipped} skipped, ${failed} failed`);
  console.log(`Images saved to: ${OUT_DIR}`);
}

main().catch(console.error);
