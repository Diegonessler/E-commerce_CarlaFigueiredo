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
   HELPER — feedback toast
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
   SEARCH DROPDOWN (card inline na lupa)
   ============================================================ */
function SearchDropdown({ products, kits, onClose, onAddToCart, onFeedback }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Foca o input ao abrir
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Fecha ao pressionar ESC
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Fecha ao clicar fora do card
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClose();
      }
    };
    // Delay pequeno para não fechar imediatamente ao abrir
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handler);
    }, 100);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handler);
    };
  }, [onClose]);

  const q = query.toLowerCase().trim();

  const matchedProducts = q
    ? (products || []).filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.desc?.toLowerCase().includes(q) ||
          p.genre?.toLowerCase().includes(q)
      )
    : [];

  const matchedKits = q
    ? (kits || []).filter(
        (k) =>
          k.title?.toLowerCase().includes(q) ||
          (k.description || k.desc || "").toLowerCase().includes(q)
      )
    : [];

  const hasResults = matchedProducts.length > 0 || matchedKits.length > 0;
  const noResults = q.length > 0 && !hasResults;

  const formatUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `/uploads${url.startsWith("/") ? url : `/${url}`}`;
  };

  return (
    <div className="search-dropdown" ref={containerRef}>
      {/* Input de busca */}
      <div className="search-input-row">
        <Search size={18} className="search-icon-inside" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar bolachas, kits..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-panel-input"
        />
        {query && (
          <button className="search-clear" onClick={() => setQuery("")}>
            <X size={16} />
          </button>
        )}
        <button className="search-esc" onClick={onClose}>
          ESC
        </button>
      </div>

      {/* Resultados */}
      {hasResults && (
        <div className="search-results">
          {matchedProducts.length > 0 && (
            <div className="search-group">
              <span className="search-group-label">Bolachas</span>
              {matchedProducts.map((item) => (
                <div key={item.id} className="search-result-item">
                  <div
                    className="search-result-thumb"
                    style={{
                      backgroundImage: `url(${formatUrl(item.image)})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="search-result-info">
                    <strong>{item.title}</strong>
                    <span>{item.price}</span>
                  </div>
                  <button
                    className="search-result-add"
                    onClick={() => {
                      onAddToCart({ ...item, id: "p-" + item.id });
                      onFeedback(`${item.title} adicionado ao carrinho! 🛍`);
                      onClose();
                    }}
                  >
                    <ShoppingCart size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {matchedKits.length > 0 && (
            <div className="search-group">
              <span className="search-group-label">Kits</span>
              {matchedKits.map((item) => (
                <div key={item.id} className="search-result-item">
                  <div
                    className="search-result-thumb"
                    style={{
                      backgroundImage: `url(${formatUrl(item.image)})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="search-result-info">
                    <strong>{item.title}</strong>
                    <span>{item.price}</span>
                  </div>
                  <button
                    className="search-result-add"
                    onClick={() => {
                      onAddToCart({ ...item, id: "k-" + item.id });
                      onFeedback(`${item.title} adicionado ao carrinho! 🛍`);
                      onClose();
                    }}
                  >
                    <ShoppingCart size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {noResults && (
        <div className="search-empty">
          Nenhum resultado para "<em>{query}</em>"
        </div>
      )}

      {!q && (
        <div className="search-hint">Digite para buscar produtos ou kits</div>
      )}
    </div>
  );
  return (
  <div className="search-dropdown" ref={containerRef}>
    <div className="search-mobile-header">
       <span>Buscar</span>
       <button onClick={onClose}><X size={20}/></button>
    </div>
    {/* ... resto do código igual ... */}
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
        {/* Wrapper relativo: o dropdown nasce aqui */}
        <div className="search-wrapper">
          <button
            className="header-icon"
            onClick={() => setSearchOpen((prev) => !prev)}
          >
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

        <button
          className="header-icon cart-button"
          onClick={() => (window.location.pathname = "/carrinho")}
        >
          <ShoppingBag size={20} />
          {cart.length > 0 && (
            <span className="cart-badge">{cart.length}</span>
          )}
        </button>
      </div>
    </header>
  );
}

/* ============================================================
   HERO
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
        <p className="hero-description">
          Feitas com amor, para adoçar seus melhores momentos!
        </p>
        <button
          className="primary-button"
          onClick={() =>
            document
              .getElementById("produtos")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          <span>COMPRAR AGORA</span>
          <Heart size={15} fill="currentColor" />
        </button>
        <div className="hero-features">
          <div className="feature-item">
            <div className="feature-circle">
              <Flower2 size={22} />
            </div>
            <p>
              Receitas
              <br />
              Exclusivas
            </p>
          </div>
          <div className="feature-item">
            <div className="feature-circle">
              <Heart size={22} />
            </div>
            <p>
              Feito
              <br />
              com Amor
            </p>
          </div>
          <div className="feature-item">
            <div className="feature-circle">
              <Leaf size={22} />
            </div>
            <p>
              Ingredientes
              <br />
              Selecionados
            </p>
          </div>
        </div>
      </div>
      <div className="hero-right">
        <div className="hero-image" />
      </div>
    </section>
  );
}

/* ============================================================
   PRODUCT CARD
   ============================================================ */
function ProductCard({ item }) {
  const { addToCart } = useCart();
  return (
    <article className="product-card">
      <div
        className="product-thumb"
        style={{ backgroundImage: `url(${item.image})` }}
      >
        {item.badge && <span className="product-badge">{item.badge}</span>}
      </div>
      <div className="product-info">
        <h3>{item.title}</h3>
        <p>{item.desc}</p>
        <div className="product-bottom">
          <strong>{item.price}</strong>
          <button
            className="mini-cart"
            onClick={() => addToCart({ ...item, id: "p-" + item.id })}
          >
            <ShoppingCart size={19} />
          </button>
        </div>
      </div>
    </article>
  );
}

/* ============================================================
   APP
   ============================================================ */
export default function App() {
  const { products, loading, error } = useProducts();
  const { kits, loading: kitsLoading, error: kitsError } = useKits();
  const { addToCart } = useCart();
  const { msg: feedbackMsg, show: showFeedback } = useFeedback();

  const featuredProducts = products?.slice(0, 4) || [];

  return (
    <div className="page-shell">
      <Header
        products={products || []}
        kits={kits || []}
        onFeedback={showFeedback}
      />

      <Hero />

      {/* PRODUTOS */}
      <section className="products-section" id="produtos">
        <div className="section-top">
          <div>
            <h2>Nossas Bolachas</h2>
            <p>Feitas à mão com ingredientes selecionados</p>
          </div>
          <button
            className="outline-button"
            onClick={() => (window.location.pathname = "/todos-produtos")}
          >
            <span>VER TODOS</span>
            <Heart size={13} fill="currentColor" />
          </button>
        </div>
        <div className="products-grid">
          {loading && <p>Carregando delícias...</p>}
          {error && <p>Erro ao carregar produtos: {error}</p>}
          {!loading && !error && products.length === 0 && (
            <p>Nenhum produto cadastrado ainda.</p>
          )}
          {featuredProducts.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* KITS */}
      <section className="kits-section" id="kits">
        <div className="kits-left">
          <div className="section-ornament">♡</div>
          <h2>Kits Especiais</h2>
          <p>Perfeitos para presentear!</p>
          <button
            className="primary-button"
            onClick={() => (window.location.pathname = "/todos-kits")}
          >
            <span>CONHECER KITS</span>
            <Heart size={15} fill="currentColor" />
          </button>
        </div>
        <div className="kits-right">
          {kitsLoading && <p>Carregando kits...</p>}
          {kitsError && <p>Erro ao carregar kits: {kitsError}</p>}
          {!kitsLoading && !kitsError && kits.length === 0 && (
            <p>Nenhum kit cadastrado ainda.</p>
          )}
          {kits.slice(0, 2).map((item) => (
            <article key={item.id} className="kit-card">
              <div
                className="kit-thumb"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <div className="kit-info">
                <h3>{item.title}</h3>
                <p>{item.description || item.desc}</p>
                <div className="product-bottom">
                  <strong>{item.price}</strong>
                  <button
                    className="mini-cart"
                    onClick={() => addToCart({ ...item, id: "k-" + item.id })}
                    style={{
                      background: "#8D6E63",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "5px",
                      cursor: "pointer",
                    }}
                  >
                    <ShoppingCart size={19} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SOBRE */}
      <section className="about-section" id="sobre">
        <div className="about-text">
          <h2>Feito com Amor</h2>
          <p>Nossa missão é levar sabor e carinho até você!</p>
        </div>
        <div className="about-image" />
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-box">
          <h2>Pronta para se apaixonar?</h2>
          <button
            className="cta-button"
            onClick={() => (window.location.pathname = "/todos-produtos")}
          >
            <span>FAZER PEDIDO</span>
            <Heart size={15} fill="currentColor" />
          </button>
        </div>
      </section>

      {feedbackMsg && <div className="toast-feedback">{feedbackMsg}</div>}
    </div>
  );
}