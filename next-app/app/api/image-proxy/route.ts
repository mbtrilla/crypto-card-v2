import { NextRequest, NextResponse } from 'next/server';

/**
 * Allowed hostname patterns for the image proxy.
 * Blocks SSRF attacks by rejecting URLs to internal/unrecognised hosts.
 */
const ALLOWED_HOSTS = [
  'drive.google.com',
  'lh3.googleusercontent.com',
  'ui-avatars.com',
];

function isAllowedUrl(raw: string): boolean {
  try {
    const url = new URL(raw);

    // Block non-HTTPS (prevents http://169.254.169.254 etc.)
    if (url.protocol !== 'https:') return false;

    // Block private/internal IPs
    const host = url.hostname;
    if (
      host === 'localhost' ||
      host.startsWith('127.') ||
      host.startsWith('10.') ||
      host.startsWith('192.168.') ||
      host.startsWith('169.254.') ||
      host.startsWith('172.') ||
      host === '[::1]' ||
      host.endsWith('.internal') ||
      host.endsWith('.local')
    ) {
      return false;
    }

    return ALLOWED_HOSTS.some(
      allowed => host === allowed || host.endsWith('.' + allowed),
    );
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('Missing URL', { status: 400 });
  }

  if (!isAllowedUrl(imageUrl)) {
    return new NextResponse('Forbidden: host not allowed', { status: 403 });
  }

  try {
    const acceptHeader =
      request.headers.get('accept') || 'image/webp,image/*,*/*;q=0.8';

    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        Accept: acceptHeader,
      },
    });

    if (!response.ok) {
      return new NextResponse('Image fetch failed', { status: response.status });
    }

    const contentType = response.headers.get('content-type');

    // Only proxy image content types
    if (contentType && !contentType.startsWith('image/')) {
      return new NextResponse('Not an image', { status: 415 });
    }

    const buffer = await response.arrayBuffer();

    // Limit response size to 5MB
    if (buffer.byteLength > 5 * 1024 * 1024) {
      return new NextResponse('Image too large', { status: 413 });
    }

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType || 'image/png',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        Vary: 'Accept',
      },
    });
  } catch {
    return new NextResponse('Error fetching image', { status: 500 });
  }
}
