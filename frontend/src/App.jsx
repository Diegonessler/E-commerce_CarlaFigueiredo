import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import {
  Search,
  X,
  ShoppingBag,
  Heart,
  ShoppingCart,
  Flower2,
  Leaf,
} from "lucide-react";
import { useProducts } from "./hooks/useProducts";
import { useKits } from "./hooks/useKits";
import { useCart } from "./CartContext";

/* ============================================================
   HELPER — Navegação sem reload
   ============================================================ */
const navigate = (path) => {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
};

/* ============================================================
   HELPER — Feedback Toast
   ============================================================ */
const useFeedback = () => {
  const [msg, setMsg] = useState(null);
  const show = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(null), 2500);
  };
  return { msg, show };
};

/* ============================================================
   SEARCH DROPDOWN
   ============================================================ */
function SearchDropdown({ products, kits, onClose, onAddToCart, onFeedback }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (containerRef.current && !containerRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    window.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      window.removeEventListener("keydown", handler);
    };
  }, [onClose]);

  const q = query.toLowerCase().trim();
  const matchedProducts = q ? (products || []).filter(p => p.title?.toLowerCase().includes(q)) : [];
  const matchedKits = q ? (kits || []).filter(k => k.title?.toLowerCase().includes(q)) : [];

  return (
    <div className="search-dropdown" ref={containerRef}>
      <div className="search-input-row">
        <Search size={18} />
        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar bolachas..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-panel-input"
        />
        <button className="search-esc" onClick={onClose}>ESC</button>
      </div>

      <div className="search-results">
        {matchedProducts.map((item) => (
          <div key={item.id} className="search-result-item">
            <div className="search-result-info">
              <strong>{item.title}</strong>
              <span>{item.price}</span>
            </div>
            <button onClick={() => {
              onAddToCart({ ...item, id: "p-" + item.id });
              onFeedback("Adicionado! 🛍");
              onClose();
            }}>
              <ShoppingCart size={16} />
            </button>
          </div>
        ))}
        {matchedKits.map((item) => (
          <div key={item.id} className="search-result-item">
            <div className="search-result-info">
              <strong>{item.title}</strong>
              <span>{item.price}</span>
            </div>
            <button onClick={() => {
              onAddToCart({ ...item, id: "k-" + item.id });
              onFeedback("Kit Adicionado! 🛍");
              onClose();
            }}>
              <ShoppingCart size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   HEADER
   ============================================================ */
function Header({ products, kits, onFeedback }) {
  const { cart, addToCart } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="header">
      <div className="logo-block">
        <h1 className="logo-title">Carla Figueiredo</h1>
        <span className="logo-subtitle">BOLACHAS ARTESANAIS</span>
      </div>

      <nav className="nav">
        <a href="#inicio">Início</a>
        <a href="#produtos">Produtos</a>
        <a href="#kits">Kits</a>
        <a href="#sobre">Sobre Nós</a>
      </nav>

      <div className="header-actions">
        <div className="search-wrapper">
          <button className="header-icon" onClick={() => setSearchOpen(!searchOpen)}>
            <Search size={20} />
          </button>
          {searchOpen && (
            <SearchDropdown
              products={products}
              kits={kits}
              onClose={() => setSearchOpen(false)}
              onAddToCart={addToCart}
              onFeedback={onFeedback}
            />
          )}
        </div>

        {/* ✅ CORRIGIDO: usa navigate() em vez de window.location.href */}
        <button
          className="header-icon cart-button"
          onClick={() => navigate('/carrinho')}
        >
          <ShoppingBag size={20} />
          {cart && cart.length > 0 && (
            <span className="cart-badge">{cart.length}</span>
          )}
        </button>
      </div>
    </header>
  );
}

/* ============================================================
   COMPONENTES DE APOIO
   ============================================================ */
function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero-left">
        <div className="hero-ornament">♡</div>
        <div className="hero-heading">
          <h2>Bolachas</h2>
          <span>artesanais</span>
        </div>
        <p className="hero-description">Feitas com amor, para adoçar seus melhores momentos!</p>
        <button
          className="primary-button"
          onClick={() => document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" })}
        >
          <span>COMPRAR AGORA</span>
          <Heart size={15} fill="currentColor" />
        </button>
      </div>
      <div className="hero-right"><div className="hero-image" /></div>
    </section>
  );
}

function ProductCard({ item }) {
  const { addToCart } = useCart();
  return (
    <article className="product-card">
      <div className="product-thumb" style={{ backgroundImage: `url(${item.image})` }} />
      <div className="product-info">
        <h3>{item.title}</h3>
        <p>{item.desc}</p>
        <div className="product-bottom">
          <strong>{item.price}</strong>
          <button className="mini-cart" onClick={() => addToCart({ ...item, id: "p-" + item.id })}>
            <ShoppingCart size={19} />
          </button>
        </div>
      </div>
    </article>
  );
}

/* ============================================================
   APP PRINCIPAL
   ============================================================ */
export default function App() {
  const { products, loading } = useProducts();
  const { kits } = useKits();
  const { addToCart } = useCart();
  const { msg: feedbackMsg, show: showFeedback } = useFeedback();

  const featuredProducts = products?.slice(0, 4) || [];

  return (
    <div className="page-shell">
      <Header products={products || []} kits={kits || []} onFeedback={showFeedback} />

      <Hero />

      <section className="products-section" id="produtos">
        <div className="section-top">
          <h2>Nossas Bolachas</h2>
          {/* ✅ CORRIGIDO */}
          <button className="outline-button" onClick={() => navigate('/todos-produtos')}>
            <span>VER TODOS</span>
          </button>
        </div>
        <div className="products-grid">
          {loading ? <p>Carregando...</p> : featuredProducts.map(item => <ProductCard key={item.id} item={item} />)}
        </div>
      </section>

      <section className="kits-section" id="kits">
        <div className="kits-left">
          <h2>Kits Especiais</h2>
          {/* ✅ CORRIGIDO */}
          <button className="primary-button" onClick={() => navigate('/todos-kits')}>
            CONHECER KITS
          </button>
        </div>
        <div className="kits-right">
          {kits?.slice(0, 2).map(item => (
            <article key={item.id} className="kit-card">
              <div className="kit-thumb" style={{ backgroundImage: `url(${item.image})` }} />
              <div className="kit-info">
                <h3>{item.title}</h3>
                <div className="product-bottom">
                  <strong>{item.price}</strong>
                  <button className="mini-cart" onClick={() => addToCart({ ...item, id: "k-" + item.id })}>
                    <ShoppingCart size={19} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {feedbackMsg && <div className="toast-feedback">{feedbackMsg}</div>}
    </div>
  );
}