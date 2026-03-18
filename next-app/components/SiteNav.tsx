// Server component — no 'use client' needed.
// Logo, Discover and About links are static HTML with zero client JS.
// Only the "Browse" dropdown (NavDropdown) ships client-side behaviour.

import Link from 'next/link';
import Image from 'next/image';
import NavDropdown from './NavDropdown';
import logoImg from '@/public/logo.png';

export default function SiteNav() {
  return (
    <header className="navbar">
      <div className="container nav-content">
        <Link href="/" className="logo">
          <Image
            src={logoImg}
            alt="Sweepbase Logo"
            className="brand-logo"
            width={160}
            height={40}
            priority
            placeholder="blur"
          />
        </Link>

        <nav className="nav-links">
          <Link href="/#discover">Discover</Link>
          {/* NavDropdown is the only interactive part of the nav — client component */}
          <NavDropdown />
          <Link href="/guides">Guides</Link>
          <Link href="/about">About</Link>
        </nav>
      </div>
    </header>
  );
}
