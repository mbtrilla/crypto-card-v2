'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error reporting service in production
    console.error('Application error:', error);
  }, [error]);

  return (
    <main className="container" style={{ textAlign: 'center', padding: '80px 1.5rem 120px' }}>
      <h1
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          marginBottom: '1rem',
        }}
      >
        Something went wrong
      </h1>
      <p
        style={{
          color: 'var(--text-secondary)',
          maxWidth: '500px',
          margin: '0 auto 2rem',
        }}
      >
        An unexpected error occurred. Please try again or browse our crypto card database.
      </p>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={reset}
          className="btn btn-primary"
        >
          Try again
        </button>
        <Link href="/" className="btn btn-outline">
          Browse All Cards
        </Link>
      </div>
    </main>
  );
}
