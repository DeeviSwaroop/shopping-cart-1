import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { useInventory } from '../hooks/useInventory';
import api from '../services/api';
import './Browse.css';

const CATEGORIES = [
  {
    value: 'BOOKS',
    label: 'Books',
    sub: [
      { value: 'TEXTBOOKS', label: 'Textbooks' },
      { value: 'STORY_BOOKS', label: 'Story Books' },
    ],
  },
  {
    value: 'STATIONERY',
    label: 'Stationery',
    sub: [
      { value: 'PENS', label: 'Pens' },
      { value: 'PENCILS', label: 'Pencils' },
      { value: 'NOTEBOOKS', label: 'Notebooks' },
      { value: 'GEOMETRY', label: 'Geometry Box' },
      { value: 'SKETCH_PENS', label: 'Sketch Pens' },
      { value: 'CRAYONS', label: 'Crayons' },
      { value: 'PAINTS', label: 'Paints' },
      { value: 'CRAFT', label: 'Craft & Scissors' },
      { value: 'BAGS', label: 'Bags' },
    ],
  },
  {
    value: 'TOYS',
    label: 'Toys & Kits',
    sub: [
      { value: 'EDUCATIONAL', label: 'Educational' },
      { value: 'PUZZLES', label: 'Puzzles' },
      { value: 'SCIENCE_KITS', label: 'Science Kits' },
      { value: 'BOARD_GAMES', label: 'Board Games' },
      { value: 'SOFT_TOYS', label: 'Soft Toys' },
      { value: 'ACTION_FIGURES', label: 'Action Toys' },
      { value: 'CRAFT_TOYS', label: 'Craft Toys' },
    ],
  },
];

const CLASS_LEVELS = ['LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'ALL'];

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category') ?? '';
  const subCategory = searchParams.get('subCategory') ?? '';
  const classLevel = searchParams.get('classLevel') ?? '';
  const search = searchParams.get('search') ?? '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    const params = {};
    if (category) params.category = category;
    if (subCategory) params.subCategory = subCategory;
    if (classLevel) params.classLevel = classLevel;
    if (search) params.search = search;

    api
      .get('/products', { params })
      .then((res) => setProducts(res.data))
      .catch(() => setError('Failed to load products. Please try again.'))
      .finally(() => setLoading(false));
  }, [category, subCategory, classLevel, search]);

  const productIds = useMemo(() => products.map((p) => p.id), [products]);
  const inventory = useInventory(productIds);

  const setParam = (key, value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value);
      else next.delete(key);
      // Reset sub-filters when changing category
      if (key === 'category') next.delete('subCategory');
      return next;
    });
  };

  const activeCatDef = CATEGORIES.find((c) => c.value === category);

  const pageTitle = search
    ? `Search: "${search}"`
    : [
        category && CATEGORIES.find((c) => c.value === category)?.label,
        subCategory && activeCatDef?.sub.find((s) => s.value === subCategory)?.label,
        classLevel && (classLevel === 'LKG' || classLevel === 'UKG' ? classLevel : `Class ${classLevel}`),
      ]
        .filter(Boolean)
        .join(' › ') || 'All Products';

  return (
    <div className="browse container" style={{ paddingTop: 24, paddingBottom: 48 }}>
      <div className="browse__layout">
        {/* ── Sidebar ── */}
        <aside className="browse__sidebar">
          <div className="filter-section">
            <h3 className="filter-title">Category</h3>
            {CATEGORIES.map((cat) => (
              <div key={cat.value}>
                <button
                  className={`filter-btn ${category === cat.value ? 'active' : ''}`}
                  onClick={() => setParam('category', category === cat.value ? '' : cat.value)}
                >
                  {cat.label}
                </button>

                {/* Sub-category drill-down */}
                {category === cat.value && cat.sub.map((sub) => (
                  <button
                    key={sub.value}
                    className={`filter-btn filter-btn--sub ${subCategory === sub.value ? 'active' : ''}`}
                    onClick={() => setParam('subCategory', subCategory === sub.value ? '' : sub.value)}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className="filter-section">
            <h3 className="filter-title">Class / Grade</h3>
            {CLASS_LEVELS.map((cls) => (
              <button
                key={cls}
                className={`filter-btn ${classLevel === cls ? 'active' : ''}`}
                onClick={() => setParam('classLevel', classLevel === cls ? '' : cls)}
              >
                {cls === 'LKG' || cls === 'UKG' ? cls : cls === 'ALL' ? 'All Classes' : `Class ${cls}`}
              </button>
            ))}
          </div>

          {(category || classLevel || search) && (
            <button
              className="btn btn-outline btn-sm"
              style={{ width: '100%', marginTop: 8 }}
              onClick={() => setSearchParams({})}
            >
              Clear Filters
            </button>
          )}
        </aside>

        {/* ── Main content ── */}
        <main className="browse__main">
          <div className="browse__header">
            <h1 className="browse__page-title">{pageTitle}</h1>
            <span className="text-muted" style={{ fontSize: 14 }}>
              {loading ? '…' : `${products.length} products`}
            </span>
          </div>

          {error && <p className="error-msg">{error}</p>}

          {loading ? (
            <div className="flex-center" style={{ padding: 64 }}>
              <span className="spinner" style={{ width: 40, height: 40 }} />
            </div>
          ) : products.length === 0 ? (
            <div className="browse__empty">
              <p>No products found.</p>
              <Link to="/browse" className="btn btn-primary btn-sm mt-16">Browse all</Link>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} liveStock={inventory[p.id]} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
