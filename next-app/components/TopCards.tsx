import Link from 'next/link';

interface TopCard {
  slug: string;
  name: string;
  detail: string;
}

interface TopCardsProps {
  title?: string;
  cards: TopCard[];
}

export default function TopCards({ title = 'Top Cards to Consider', cards }: TopCardsProps) {
  return (
    <section className="top-cards-section">
      <h2>{title}</h2>
      <div className="top-cards-list">
        {cards.map(({ slug, name, detail }) => (
          <Link key={slug} href={`/cards/${slug}`} className="top-cards-item">
            <span className="top-cards-name">{name}</span>
            <span className="top-cards-detail">{detail}</span>
            <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </Link>
        ))}
      </div>
    </section>
  );
}
