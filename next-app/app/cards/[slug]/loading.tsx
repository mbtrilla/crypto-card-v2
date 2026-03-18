export default function CardDetailLoading() {
  return (
    <main className="card-detail-static">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <div className="skeleton-block" style={{ height: '20px', width: '200px', marginBottom: '1.5rem', borderRadius: '4px' }} />

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div className="skeleton-block" style={{ width: '400px', height: '250px', borderRadius: '12px', flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div className="skeleton-block" style={{ height: '36px', width: '80%', marginBottom: '1rem', borderRadius: '6px' }} />
            <div className="skeleton-block" style={{ height: '20px', width: '40%', marginBottom: '1.5rem', borderRadius: '4px' }} />
            <div className="skeleton-block" style={{ height: '44px', width: '200px', borderRadius: '8px' }} />
          </div>
        </div>

        <div style={{ marginTop: '3rem' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton-block" style={{ height: '16px', width: `${90 - i * 10}%`, marginBottom: '0.75rem', borderRadius: '4px' }} />
          ))}
        </div>
      </div>
    </main>
  );
}
