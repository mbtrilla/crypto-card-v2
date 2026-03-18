import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found — Sweepbase",
  description: "The page you are looking for does not exist. Browse our crypto card comparison database to find the best crypto debit and credit cards.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="container" style={{ textAlign: "center", padding: "80px 1.5rem 120px" }}>
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: "1rem" }}>
        404 — Page Not Found
      </h1>
      <p style={{ color: "var(--text-secondary)", maxWidth: "500px", margin: "0 auto 2rem" }}>
        The page you are looking for may have moved or no longer exists. Try browsing our crypto card database instead.
      </p>
      <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
        <Link href="/" className="btn btn-primary">
          Browse All Cards
        </Link>
        <Link href="/best-crypto-cards-usa" className="btn btn-outline">
          Best Cards in USA
        </Link>
        <Link href="/best-crypto-cards-europe" className="btn btn-outline">
          Best Cards in Europe
        </Link>
      </div>
    </main>
  );
}
