
export default function QuoteSection() {
  return (
    <section className="present-column">
      <div className="present-blob"></div>
      <div className="image-container">
        <img 
          src="/globe_books.png" 
          alt="Globe and Stack of Books" 
          className="present-img"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 
              'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320"><rect width="100%" height="100%" fill="%23eff6ff"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="60">📚</text><text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="50">🌍</text></svg>';
          }}
        />
      </div>
      <div className="quote-container">
        <blockquote className="quote-text">
          "The beautiful thing about learning is that no one can take it away from you."
        </blockquote>
        <cite className="quote-author">— B.B. King</cite>
      </div>
    </section>
  );
}
