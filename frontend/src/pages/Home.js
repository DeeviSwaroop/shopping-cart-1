import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { useInventory } from '../hooks/useInventory';
import api from '../services/api';
import './Home.css';

export default function Home() {
  const [featured, setFeatured] = useState({ books: [], stationery: [], toys: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/products/featured')
      .then((res) => setFeatured(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const allProductIds = [
    ...featured.books,
    ...featured.stationery,
    ...featured.toys,
  ].map((p) => p.id);

  const inventory = useInventory(allProductIds);

  const authors = [
    { name: 'NCERT', desc: 'Official curriculum textbooks', emoji: '🏛️' },
    { name: 'Oxford', desc: 'International language books', emoji: '📗' },
    { name: 'R.D. Sharma', desc: 'Mathematics excellence', emoji: '📐' },
    { name: 'S. Chand', desc: 'Science & General studies', emoji: '🔬' },
  ];

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <h1 className="hero__title">
            Everything your child needs —<br />
            <span>LKG to Class 10</span>
          </h1>
          <p className="hero__sub">
            Textbooks, notebooks, stationery, toys & learning kits. Delivered to your door.
          </p>
          <div className="hero__actions">
            <Link to="/browse" className="btn btn-secondary btn-lg">Shop Now</Link>
            <Link to="/browse?category=BOOKS" className="btn btn-outline btn-lg">Browse Books</Link>
          </div>
        </div>
      </section>

      {/* Category highlights */}
      <section className="section container">
        <h2 className="section__title">Shop by Category</h2>
        <div className="cat-cards">
          {CAT_HIGHLIGHTS.map((c) => (
            <Link key={c.value} to={`/browse?category=${c.value}`} className="cat-card">
              <span className="cat-card__emoji">{c.emoji}</span>
              <span className="cat-card__label">{c.label}</span>
              <span className="cat-card__sub">{c.sub}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Class filter quick links */}
      <section className="section container">
        <h2 className="section__title">Shop by Class</h2>
        <div className="class-chips">
          {CLASS_LEVELS.map((cls) => (
            <Link key={cls} to={`/browse?classLevel=${cls}`} className="class-chip">
              {cls === 'LKG' || cls === 'UKG' ? cls : `Class ${cls}`}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Books */}
      {!loading && featured.books.length > 0 && (
        <FeaturedSection
          title="📖 Featured Books"
          viewAllHref="/browse?category=BOOKS"
          products={featured.books}
          inventory={inventory}
        />
      )}

      {/* Featured Stationery */}
      {!loading && featured.stationery.length > 0 && (
        <FeaturedSection
          title="✏️ Popular Stationery"
          viewAllHref="/browse?category=STATIONERY"
          products={featured.stationery}
          inventory={inventory}
        />
      )}

      {/* Featured Toys */}
      {!loading && featured.toys.length > 0 && (
        <FeaturedSection
          title="🎮 Learning Toys & Kits"
          viewAllHref="/browse?category=TOYS"
          products={featured.toys}
          inventory={inventory}
        />
      )}

      {/* Featured Authors */}
      <section className="section container">
        <h2 className="section__title">✍️ Featured Authors & Publishers</h2>
        <div className="authors-grid">
          {authors.map((a) => (
            <div key={a.name} className="author-card">
              <span className="author-card__emoji">{a.emoji}</span>
              <h3 className="author-card__name">{a.name}</h3>
              <p className="author-card__desc">{a.desc}</p>
              <Link
                to={`/browse?search=${encodeURIComponent(a.name)}`}
                className="btn btn-outline btn-sm"
              >
                Browse
              </Link>
            </div>
          ))}
        </div>
      </section>

      {loading && (
        <div className="flex-center" style={{ padding: 48 }}>
          <span className="spinner" style={{ width: 40, height: 40 }} />
        </div>
      )}
    </div>
  );
}

function FeaturedSection({ title, viewAllHref, products, inventory }) {
  return (
    <section className="section container">
      <div className="section__header">
        <h2 className="section__title">{title}</h2>
        <Link to={viewAllHref} className="section__viewall">View all →</Link>
      </div>
      <div className="products-grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} liveStock={inventory[p.id]} />
        ))}
      </div>
    </section>
  );
}

const CAT_HIGHLIGHTS = [
  { value: 'BOOKS', label: 'Books', sub: 'Textbooks, story books & more', emoji: '📚' },
  { value: 'STATIONERY', label: 'Stationery', sub: 'Pens, pencils, bags & more', emoji: '🖊️' },
  { value: 'TOYS', label: 'Toys & Kits', sub: 'Board games, puzzles & science kits', emoji: '🧩' },
];

const CLASS_LEVELS = ['LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
